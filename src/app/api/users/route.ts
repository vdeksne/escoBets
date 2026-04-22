import { NextRequest, NextResponse } from "next/server";
import type { User as AuthUser } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { hasAdminRole } from "@/lib/auth/admin";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import {
  applyAdminUserSubscriptionStatus,
  fetchEmailToUserStatusFromStripe,
} from "@/lib/stripe/admin-subscription-status";
import { MOCK_ADMIN_USERS } from "@/lib/users/mock-data";
import type { AdminUser, UserStatus } from "@/types/user";
import type { ApiError, ApiSuccess } from "@/types/api";

interface UsersData {
  items: AdminUser[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

type UsersResponse = ApiSuccess<UsersData> | ApiError;

interface UsersDeleteData {
  deleted: number;
}

const VALID_STATUSES = new Set<UserStatus>([
  "Pending",
  "Failed",
  "Complete",
  "Archived",
]);

function errorResponse(
  status: number,
  code: string,
  message: string,
  details?: unknown
): NextResponse<ApiError> {
  return NextResponse.json(
    {
      success: false,
      error: { code, message, details },
    },
    { status }
  );
}

function successResponse<T>(data: T): NextResponse<ApiSuccess<T>> {
  return NextResponse.json({
    success: true,
    data,
  });
}

function parsePositiveIntParam(
  rawValue: string | null,
  options: { fallback: number; min: number; max: number }
): number | null {
  if (rawValue == null || rawValue.trim() === "") return options.fallback;
  const value = Number(rawValue);
  if (!Number.isInteger(value) || value < options.min || value > options.max) {
    return null;
  }
  return value;
}

function normalizeAdminUser(row: Record<string, unknown>): AdminUser | null {
  const id = row.id;
  const userName = row.userName;
  const telegram = row.telegram;
  const phone = row.phone;
  const email = row.email;
  const status = row.status;
  const lastUpdate = row.lastUpdate;
  const profits = row.profits;
  const losses = row.losses;

  if (
    typeof id !== "string" ||
    typeof userName !== "string" ||
    typeof telegram !== "string" ||
    typeof phone !== "string" ||
    typeof email !== "string" ||
    typeof status !== "string" ||
    typeof lastUpdate !== "string" ||
    typeof profits !== "number" ||
    typeof losses !== "number" ||
    !VALID_STATUSES.has(status as UserStatus)
  ) {
    return null;
  }

  return {
    id,
    userName,
    telegram,
    phone,
    email,
    status: status as UserStatus,
    lastUpdate,
    profits,
    losses,
  };
}

function formatAdminTimestamp(iso: string | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return (
    `${d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" })}, ` +
    d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })
  );
}

type ProfileRow = Record<string, unknown> & { id: string };

function strFromRow(row: ProfileRow | undefined, keys: string[]): string {
  if (!row) return "";
  for (const k of keys) {
    const v = row[k];
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return "";
}

function splitFullName(full: string): { first: string; last: string } {
  const t = full.trim();
  if (!t) return { first: "", last: "" };
  const i = t.indexOf(" ");
  if (i === -1) return { first: t, last: "" };
  return { first: t.slice(0, i).trim(), last: t.slice(i + 1).trim() };
}

/**
 * Display name and phone from `profiles` + auth metadata. Mirrors `toProfile` in
 * `api/account/profile` so the admin list shows the same data as the account page.
 */
function buildAdminDisplayName(
  u: AuthUser,
  profile: ProfileRow | undefined
): string {
  let first = strFromRow(profile, ["first_name", "firstName", "firstname"]);
  let last = strFromRow(profile, ["last_name", "lastName", "lastname"]);
  if (!first && !last) {
    const full = strFromRow(profile, ["full_name", "fullName", "fullname"]);
    if (full) {
      const p = splitFullName(full);
      first = p.first;
      last = p.last;
    }
  }
  if (!first && !last) {
    const handle = strFromRow(profile, ["user_name", "username", "userName"]);
    if (handle) {
      const p = splitFullName(handle.replace(/[_.]/g, " "));
      first = p.first || handle;
      last = p.last;
    }
  }
  const fullName = [first, last].filter(Boolean).join(" ").trim();

  const meta = u.user_metadata ?? {};
  const username =
    typeof meta.username === "string" ? meta.username.trim() : "";
  const email = u.email ?? strFromRow(profile, ["email", "user_email", "userEmail"]);
  const localPart = email.includes("@") ? email.split("@")[0]! : "Member";
  return fullName || username || localPart;
}

function authUserToAdminUser(u: AuthUser, profile?: ProfileRow): AdminUser {
  const meta = u.user_metadata ?? {};
  const email = u.email ?? strFromRow(profile, ["email", "user_email", "userEmail"]) ?? "";
  const userName = buildAdminDisplayName(u, profile);
  const phoneFromProfile = strFromRow(profile, ["phone"]);
  const telegram =
    typeof meta.telegram === "string"
      ? meta.telegram
      : typeof meta.telegram_username === "string"
        ? meta.telegram_username
        : "—";

  const phone = phoneFromProfile || "—";
  /** Overwritten by Stripe subscription in `applyAdminUserSubscriptionStatus` (or email fallback). */
  const status: UserStatus = "Pending";
  const lastUpdate = formatAdminTimestamp(
    u.updated_at ?? u.last_sign_in_at ?? u.created_at
  );

  return {
    id: u.id,
    userName,
    telegram,
    phone,
    email,
    status,
    lastUpdate,
    profits: 0,
    losses: 0,
  };
}

/** Totals from `profit_tracker_user_totals` view (real stored entries); overrides legacy CRM P/L. */
async function applyProfitTrackerRollups(
  fromAuth: AdminUser[],
  admin: SupabaseClient
): Promise<void> {
  const { data, error } = await admin
    .from("profit_tracker_user_totals")
    .select("user_id, total_profits, total_losses");
  if (error || !data) return;
  for (const row of data) {
    if (!row || typeof row !== "object") continue;
    const r = row as { user_id?: unknown; total_profits?: unknown; total_losses?: unknown };
    if (typeof r.user_id !== "string") continue;
    const p = r.total_profits;
    const l = r.total_losses;
    if (typeof p !== "number" || typeof l !== "number") continue;
    const idx = fromAuth.findIndex((u) => u.id === r.user_id);
    if (idx >= 0) {
      fromAuth[idx] = { ...fromAuth[idx]!, profits: p, losses: l };
    }
  }
}

async function listAllAuthUsers(admin: SupabaseClient): Promise<AuthUser[]> {
  const all: AuthUser[] = [];
  let page = 1;
  const perPage = 1000;
  for (;;) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage });
    if (error) throw error;
    const batch = data.users;
    all.push(...batch);
    if (batch.length < perPage) break;
    page += 1;
  }
  return all;
}

/** True for Supabase `auth.users` ids (UUID string). */
function isAuthUuid(id: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    id.trim()
  );
}

/**
 * Real accounts from `auth.users` + optional legacy rows from `public.users` (seed / CRM).
 * Registrations only appear once we merge Auth (public.users is not filled on sign-up by default).
 */
async function fetchMergedUsersForAdmin(): Promise<AdminUser[] | null> {
  const admin = createServiceRoleClient();
  if (!admin) {
    return null;
  }

  let authUsers: AuthUser[] = [];
  try {
    authUsers = await listAllAuthUsers(admin);
  } catch {
    authUsers = [];
  }

  const profileById = new Map<string, ProfileRow>();
  if (authUsers.length > 0) {
    const ids = authUsers.map((u) => u.id);
    const CHUNK = 100;
    for (let o = 0; o < ids.length; o += CHUNK) {
      const chunk = ids.slice(o, o + CHUNK);
      const { data: profiles, error: profilesError } = await admin
        .from("profiles")
        .select("*")
        .in("id", chunk);
      if (profilesError) {
        continue;
      }
      for (const p of profiles ?? []) {
        if (p && typeof p === "object" && typeof (p as { id?: unknown }).id === "string") {
          profileById.set((p as { id: string }).id, p as ProfileRow);
        }
      }
    }
  }

  const fromAuth = authUsers.map((u) => authUserToAdminUser(u, profileById.get(u.id)));
  fromAuth.sort((a, b) => {
    const ua = authUsers.find((u) => u.id === a.id);
    const ub = authUsers.find((u) => u.id === b.id);
    const ta = ua?.created_at ? new Date(ua.created_at).getTime() : 0;
    const tb = ub?.created_at ? new Date(ub.created_at).getTime() : 0;
    return tb - ta;
  });

  const { byEmail: subscriptionByEmail } = await fetchEmailToUserStatusFromStripe();
  applyAdminUserSubscriptionStatus(fromAuth, authUsers, subscriptionByEmail);

  const authEmails = new Set(
    fromAuth.map((u) => u.email.toLowerCase()).filter((e) => e.length > 0)
  );
  const authIds = new Set(fromAuth.map((u) => u.id));

  const { data: legacyRows, error: legacyError } = await admin.from("users").select("*");
  if (legacyError || !Array.isArray(legacyRows)) {
    return fromAuth.length > 0 ? fromAuth : null;
  }

  /** When `public.users` id is not an auth id but email matches a real user (e.g. CRM `user-1`). */
  const pnlByAuthEmail = new Map<string, { profits: number; losses: number }>();
  for (const row of legacyRows) {
    const n = normalizeAdminUser(
      (row && typeof row === "object" ? row : {}) as Record<string, unknown>
    );
    if (!n) continue;
    if (authIds.has(n.id)) continue;
    if (authEmails.has(n.email.toLowerCase())) {
      pnlByAuthEmail.set(n.email.toLowerCase(), { profits: n.profits, losses: n.losses });
    }
  }

  const gotPnlFromIdMerge = new Set<string>();
  for (const row of legacyRows) {
    const n = normalizeAdminUser(
      (row && typeof row === "object" ? row : {}) as Record<string, unknown>
    );
    if (!n) continue;
    if (authIds.has(n.id)) {
      const idx = fromAuth.findIndex((a) => a.id === n.id);
      if (idx >= 0) {
        fromAuth[idx] = {
          ...fromAuth[idx]!,
          profits: n.profits,
          losses: n.losses,
        };
        gotPnlFromIdMerge.add(n.id);
      }
    }
  }

  for (let i = 0; i < fromAuth.length; i++) {
    if (gotPnlFromIdMerge.has(fromAuth[i]!.id)) continue;
    const emailKey = fromAuth[i]!.email.toLowerCase();
    const pnl = pnlByAuthEmail.get(emailKey);
    if (pnl) {
      fromAuth[i] = { ...fromAuth[i]!, ...pnl };
    }
  }

  await applyProfitTrackerRollups(fromAuth, admin);

  const legacy: AdminUser[] = [];
  for (const row of legacyRows) {
    const n = normalizeAdminUser(
      (row && typeof row === "object" ? row : {}) as Record<string, unknown>
    );
    if (!n) continue;

    if (authIds.has(n.id)) {
      continue;
    }

    if (authEmails.has(n.email.toLowerCase())) {
      continue;
    }

    legacy.push(n);
  }

  return [...fromAuth, ...legacy];
}

export async function GET(
  request: NextRequest
): Promise<NextResponse<UsersResponse>> {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return errorResponse(401, "UNAUTHORIZED", "Authentication required.");
  }

  if (!hasAdminRole(user)) {
    return errorResponse(403, "FORBIDDEN", "Admin access required.");
  }

  const url = new URL(request.url);
  const page = parsePositiveIntParam(url.searchParams.get("page"), {
    fallback: 1,
    min: 1,
    max: 10_000,
  });
  const pageSize = parsePositiveIntParam(url.searchParams.get("pageSize"), {
    fallback: 20,
    min: 1,
    /** Admin users table loads many rows; keep in sync with `src/app/users/page.tsx`. */
    max: 500,
  });

  if (page == null || pageSize == null) {
    return errorResponse(
      400,
      "INVALID_QUERY",
      "Query params `page` and `pageSize` must be positive integers."
    );
  }

  const search = (url.searchParams.get("search") ?? "").trim().toLowerCase();
  const statusParam = (url.searchParams.get("status") ?? "").trim();
  const statusFilter = statusParam.length === 0 ? null : (statusParam as UserStatus);

  if (statusFilter && !VALID_STATUSES.has(statusFilter)) {
    return errorResponse(
      400,
      "INVALID_STATUS",
      "Query param `status` must be one of: Pending, Failed, Complete, Archived."
    );
  }

  try {
    const dbUsers = await fetchMergedUsersForAdmin();
    const allItems = dbUsers ?? MOCK_ADMIN_USERS;

    const filtered = allItems.filter((item) => {
      const matchesSearch =
        search.length === 0 ||
        item.userName.toLowerCase().includes(search) ||
        item.telegram.toLowerCase().includes(search) ||
        item.email.toLowerCase().includes(search) ||
        item.phone.toLowerCase().includes(search);
      const matchesStatus = !statusFilter || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const safePage = Math.min(page, totalPages);
    const start = (safePage - 1) * pageSize;
    const items = filtered.slice(start, start + pageSize);

    return successResponse<UsersData>({
      items,
      pagination: {
        page: safePage,
        pageSize,
        total,
        totalPages,
      },
    });
  } catch (error) {
    return errorResponse(500, "INTERNAL_ERROR", "Failed to fetch users.", {
      reason: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

const MAX_DELETE_BATCH = 500;

export async function DELETE(
  request: NextRequest
): Promise<NextResponse<ApiSuccess<UsersDeleteData> | ApiError>> {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return errorResponse(401, "UNAUTHORIZED", "Authentication required.");
  }

  if (!hasAdminRole(user)) {
    return errorResponse(403, "FORBIDDEN", "Admin access required.");
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse(400, "INVALID_BODY", "Expected JSON body.");
  }

  if (
    !body ||
    typeof body !== "object" ||
    !Array.isArray((body as { ids?: unknown }).ids)
  ) {
    return errorResponse(400, "INVALID_BODY", "Body must include an `ids` array of strings.");
  }

  const rawIds = (body as { ids: unknown[] }).ids;
  const ids = rawIds.filter(
    (id): id is string => typeof id === "string" && id.trim().length > 0
  );

  if (ids.length === 0) {
    return errorResponse(400, "INVALID_BODY", "At least one valid id is required.");
  }

  if (ids.length > MAX_DELETE_BATCH) {
    return errorResponse(
      400,
      "INVALID_BODY",
      `Too many ids (max ${MAX_DELETE_BATCH}).`
    );
  }

  const admin = createServiceRoleClient();
  if (!admin) {
    return errorResponse(
      503,
      "SERVER_CONFIG",
      "Server is missing Supabase service role configuration."
    );
  }

  let deleted = 0;
  const failMessages: string[] = [];

  for (const id of ids) {
    if (isAuthUuid(id)) {
      const { error: delAuthError } = await admin.auth.admin.deleteUser(id);
      if (delAuthError) {
        failMessages.push(`${id}: ${delAuthError.message}`);
        continue;
      }
      deleted += 1;
      await admin.from("users").delete().eq("id", id);
    } else {
      const { error: delTableError, count } = await admin
        .from("users")
        .delete({ count: "exact" })
        .eq("id", id);
      if (delTableError) {
        failMessages.push(`${id}: ${delTableError.message}`);
        continue;
      }
      deleted += typeof count === "number" ? count : 1;
    }
  }

  if (deleted === 0 && failMessages.length > 0) {
    return errorResponse(500, "DELETE_FAILED", failMessages.join(" "));
  }

  return successResponse<UsersDeleteData>({ deleted });
}
