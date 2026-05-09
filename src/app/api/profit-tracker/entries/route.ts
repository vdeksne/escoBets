import { NextRequest, NextResponse } from "next/server";
import { isDemoMode } from "@/lib/demo-mode";
import { buildMockProfitTrackerEntries } from "@/lib/profit-tracker/mock-data";
import { createClient } from "@/lib/supabase/server";
import { hasAdminRole } from "@/lib/auth/admin";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import type { ProfitTrackerEntry, TrackingType } from "@/types/profit-tracker";
import type { ApiError, ApiSuccess } from "@/types/api";

type EntriesData = { entries: ProfitTrackerEntry[] };
type EntriesResponse = ApiSuccess<EntriesData> | ApiError;

const VALID_TYPES = new Set<TrackingType>(["investment", "profit", "loss"]);

function isAuthUuid(id: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    id.trim()
  );
}

function errorResponse(
  status: number,
  code: string,
  message: string,
  details?: unknown
): NextResponse<ApiError> {
  return NextResponse.json(
    { success: false, error: { code, message, details } },
    { status }
  );
}

function successResponse<T>(data: T): NextResponse<ApiSuccess<T>> {
  return NextResponse.json({ success: true, data });
}

function dbRowToEntry(row: Record<string, unknown>): ProfitTrackerEntry | null {
  const id = row.id;
  const user_id = row.user_id;
  const amount = row.amount;
  const type = row.type;
  const date = row.date;
  if (typeof id !== "string" || typeof user_id !== "string") return null;
  if (typeof amount !== "number" || !Number.isFinite(amount)) return null;
  if (typeof type !== "string" || !VALID_TYPES.has(type as TrackingType)) return null;
  if (typeof date !== "string") return null;
  const name = row.name;
  const createdAt = row.created_at;
  return {
    id,
    userId: user_id,
    amount,
    type: type as TrackingType,
    date: date.slice(0, 10),
    name: typeof name === "string" && name.trim() ? name : undefined,
    createdAt: typeof createdAt === "string" ? createdAt : undefined,
  };
}

function validateAndSanitize(
  e: unknown,
  userId: string
): Record<string, unknown> | null {
  if (!e || typeof e !== "object") return null;
  const o = e as Record<string, unknown>;
  const id = o.id;
  const amount = o.amount;
  const type = o.type;
  const date = o.date;
  if (typeof id !== "string" || id.trim() === "") return null;
  if (typeof amount !== "number" || !Number.isFinite(amount) || amount < 0) return null;
  if (typeof type !== "string" || !VALID_TYPES.has(type as TrackingType)) return null;
  if (typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}/.test(date)) return null;
  const name = o.name;
  return {
    id: id.trim(),
    user_id: userId,
    amount,
    type,
    date: date.slice(0, 10),
    name: typeof name === "string" && name.trim() ? name.trim() : null,
  };
}

function resolveReadTargetId(params: {
  requestUserId: string;
  queryUserId: string | null;
  isAdmin: boolean;
}): { targetId: string } | { error: NextResponse<ApiError> } {
  if (params.queryUserId) {
    if (!params.isAdmin) {
      return { error: errorResponse(403, "FORBIDDEN", "Not allowed to read this user's entries.") };
    }
    if (!isAuthUuid(params.queryUserId)) {
      return { error: errorResponse(400, "INVALID_QUERY", "userId must be a valid UUID.") };
    }
    return { targetId: params.queryUserId };
  }
  return { targetId: params.requestUserId };
}

function resolveWriteTargetId(params: {
  requestUserId: string;
  targetUserId: string | null | undefined;
  isAdmin: boolean;
}): { targetId: string } | { error: NextResponse<ApiError> } {
  if (params.targetUserId) {
    if (!params.isAdmin) {
      return { error: errorResponse(403, "FORBIDDEN", "Not allowed to write this user's entries.") };
    }
    if (!isAuthUuid(params.targetUserId)) {
      return { error: errorResponse(400, "INVALID_BODY", "targetUserId must be a valid UUID.") };
    }
    return { targetId: params.targetUserId };
  }
  return { targetId: params.requestUserId };
}

/**
 * List profit tracker entries for the signed-in user, or (admin) ?userId=…
 */
export async function GET(request: NextRequest): Promise<NextResponse<EntriesResponse>> {
  if (isDemoMode()) {
    return successResponse<EntriesData>({ entries: buildMockProfitTrackerEntries() });
  }
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return errorResponse(401, "UNAUTHORIZED", "Authentication required.");
  }

  const url = new URL(request.url);
  const queryUserId = (url.searchParams.get("userId") ?? "").trim() || null;
  const isAdmin = hasAdminRole(user);
  const resolved = resolveReadTargetId({
    requestUserId: user.id,
    queryUserId,
    isAdmin,
  });
  if ("error" in resolved) {
    return resolved.error;
  }
  const { targetId } = resolved;

  const useService = isAdmin && queryUserId && queryUserId !== user.id;
  const service = useService ? createServiceRoleClient() : null;
  if (useService && !service) {
    return errorResponse(503, "SERVER_CONFIG", "Server is missing Supabase service role configuration.");
  }
  const client = service ?? supabase;
  const { data, error } = await client
    .from("profit_tracker_entries")
    .select("id, user_id, name, amount, type, date, created_at")
    .eq("user_id", targetId)
    .order("date", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    if (error.message?.toLowerCase().includes("does not exist")) {
      return successResponse<EntriesData>({ entries: [] });
    }
    return errorResponse(500, "FETCH_FAILED", error.message, error);
  }

  const entries: ProfitTrackerEntry[] = [];
  for (const row of data ?? []) {
    if (row && typeof row === "object") {
      const e = dbRowToEntry(row as Record<string, unknown>);
      if (e) entries.push(e);
    }
  }
  return successResponse<EntriesData>({ entries });
}

/**
 * Replace all entries for the signed-in user, or (admin) target user.
 */
export async function PUT(request: NextRequest): Promise<NextResponse<EntriesResponse>> {
  if (isDemoMode()) {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return errorResponse(400, "INVALID_JSON", "Expected JSON body.");
    }
    if (!body || typeof body !== "object" || !Array.isArray((body as { entries?: unknown }).entries)) {
      return errorResponse(400, "INVALID_BODY", "Body must be `{ entries: ProfitTrackerEntry[] }`.");
    }
    const rawEntries = (body as { entries: unknown[] }).entries;
    const entries: ProfitTrackerEntry[] = [];
    for (const e of rawEntries) {
      if (!e || typeof e !== "object") continue;
      const o = e as Record<string, unknown>;
      if (
        typeof o.id === "string" &&
        typeof o.amount === "number" &&
        typeof o.type === "string" &&
        typeof o.date === "string" &&
        typeof o.userId === "string"
      ) {
        entries.push({
          id: o.id,
          userId: o.userId,
          amount: o.amount,
          type: o.type as TrackingType,
          date: String(o.date).slice(0, 10),
          name: typeof o.name === "string" ? o.name : undefined,
          createdAt: typeof o.createdAt === "string" ? o.createdAt : undefined,
        });
      }
    }
    return successResponse<EntriesData>({ entries });
  }
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return errorResponse(401, "UNAUTHORIZED", "Authentication required.");
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse(400, "INVALID_JSON", "Expected JSON body.");
  }

  if (!body || typeof body !== "object" || !Array.isArray((body as { entries?: unknown }).entries)) {
    return errorResponse(400, "INVALID_BODY", "Body must be `{ entries: ProfitTrackerEntry[] }`.");
  }

  const rawEntries = (body as { entries: unknown[]; targetUserId?: unknown }).entries;
  const rawTarget = (body as { targetUserId?: unknown }).targetUserId;
  const targetUserId =
    typeof rawTarget === "string" && rawTarget.trim() ? rawTarget.trim() : undefined;

  const isAdmin = hasAdminRole(user);
  const resolved = resolveWriteTargetId({
    requestUserId: user.id,
    targetUserId: targetUserId ?? null,
    isAdmin,
  });
  if ("error" in resolved) {
    return resolved.error;
  }
  const { targetId } = resolved;

  const rows: Record<string, unknown>[] = [];
  for (const item of rawEntries) {
    const r = validateAndSanitize(item, targetId);
    if (!r) {
      return errorResponse(400, "INVALID_ENTRY", "Each entry must have id, amount ≥ 0, type, and date YYYY-MM-DD.");
    }
    rows.push(r);
  }

  const admin = createServiceRoleClient();
  if (!admin) {
    return errorResponse(503, "SERVER_CONFIG", "Server is missing Supabase service role configuration.");
  }

  const { error: delError } = await admin.from("profit_tracker_entries").delete().eq("user_id", targetId);
  if (delError) {
    return errorResponse(500, "DELETE_FAILED", delError.message, delError);
  }

  if (rows.length > 0) {
    const { error: insError } = await admin.from("profit_tracker_entries").insert(rows);
    if (insError) {
      return errorResponse(500, "INSERT_FAILED", insError.message, insError);
    }
  }

  const { data: fresh, error: readBackError } = await admin
    .from("profit_tracker_entries")
    .select("id, user_id, name, amount, type, date, created_at")
    .eq("user_id", targetId)
    .order("date", { ascending: false })
    .order("created_at", { ascending: false });

  if (readBackError) {
    return errorResponse(500, "FETCH_FAILED", readBackError.message, readBackError);
  }
  const out: ProfitTrackerEntry[] = [];
  for (const row of fresh ?? []) {
    if (row && typeof row === "object") {
      const e = dbRowToEntry(row as Record<string, unknown>);
      if (e) out.push(e);
    }
  }
  return successResponse<EntriesData>({ entries: out });
}
