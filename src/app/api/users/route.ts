import { NextRequest, NextResponse } from "next/server";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
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

function hasAdminRole(user: User): boolean {
  const roleValues: string[] = [];

  const userRole = user.user_metadata?.role;
  const appRole = user.app_metadata?.role;
  const userRoles = user.user_metadata?.roles;
  const appRoles = user.app_metadata?.roles;

  if (typeof userRole === "string") roleValues.push(userRole);
  if (typeof appRole === "string") roleValues.push(appRole);
  if (Array.isArray(userRoles)) {
    roleValues.push(...userRoles.filter((value): value is string => typeof value === "string"));
  }
  if (Array.isArray(appRoles)) {
    roleValues.push(...appRoles.filter((value): value is string => typeof value === "string"));
  }

  return roleValues.some((role) => role.toLowerCase() === "admin");
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

async function fetchUsersFromSupabase(): Promise<AdminUser[] | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("users").select("*");

  if (error || !Array.isArray(data)) {
    return null;
  }

  const normalized = data
    .map((row) =>
      normalizeAdminUser((row && typeof row === "object" ? row : {}) as Record<string, unknown>)
    )
    .filter((row): row is AdminUser => row !== null);

  return normalized.length > 0 ? normalized : null;
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
    max: 100,
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
    const dbUsers = await fetchUsersFromSupabase();
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
