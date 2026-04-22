import { createClient } from "@/lib/supabase/server";
import { hasAdminRole } from "@/lib/auth/admin";
import { NextResponse } from "next/server";
import type { User } from "@supabase/supabase-js";

type ErrorBody = { success: false; error: { code: string; message: string } };

export function adminError(
  status: 401 | 403,
  code: "UNAUTHORIZED" | "FORBIDDEN",
  message: string
): NextResponse<ErrorBody> {
  return NextResponse.json({ success: false, error: { code, message } }, { status });
}

export type AdminAuthResult =
  | { user: User; error: null }
  | { user: null; error: NextResponse<ErrorBody> };

/** Returns the signed-in admin user, or a JSON `NextResponse` to return from the route. */
export async function requireAdminUser(): Promise<AdminAuthResult> {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { user: null, error: adminError(401, "UNAUTHORIZED", "Authentication required.") };
  }
  if (!hasAdminRole(user)) {
    return { user: null, error: adminError(403, "FORBIDDEN", "Admin access required.") };
  }
  return { user, error: null };
}
