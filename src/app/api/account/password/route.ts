import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { validatePasswordStrength } from "@/lib/account/password-policy";
import type { ApiError, ApiSuccess } from "@/types/api";

type PasswordPayload = {
  currentPassword?: string;
  newPassword?: string;
};

type PasswordResponse = ApiSuccess<{ ok: true }> | ApiError;

function errorResponse(
  status: number,
  code: string,
  message: string,
  details?: unknown
): NextResponse<ApiError> {
  return NextResponse.json({ success: false, error: { code, message, details } }, { status });
}

function successResponse(): NextResponse<ApiSuccess<{ ok: true }>> {
  return NextResponse.json({ success: true, data: { ok: true } });
}

/**
 * Change password for the signed-in user (email/password accounts).
 *
 * Security: current password is verified with `signInWithPassword` (no password in URL);
 * new password rules are enforced here and should mirror Supabase Auth → Password settings.
 * Use HTTPS in production. For brute-force protection, add rate limiting (e.g. edge/WAF) or
 * enable Supabase / platform throttling.
 */
export async function POST(request: NextRequest): Promise<NextResponse<PasswordResponse>> {
  let payload: PasswordPayload;
  try {
    payload = (await request.json()) as PasswordPayload;
  } catch {
    return errorResponse(400, "INVALID_JSON", "Invalid JSON body.");
  }

  const currentPassword =
    typeof payload.currentPassword === "string" ? payload.currentPassword : "";
  const newPasswordRaw = typeof payload.newPassword === "string" ? payload.newPassword : "";
  /** Trim stored password only on the new value; do not trim current (edge spaces may be intentional). */
  const newPassword = newPasswordRaw.trim();

  if (!currentPassword || !newPassword) {
    return errorResponse(400, "MISSING_FIELDS", "Current password and new password are required.");
  }

  const strength = validatePasswordStrength(newPassword);
  if (!strength.ok) {
    return errorResponse(400, "WEAK_PASSWORD", strength.message);
  }

  if (currentPassword === newPassword) {
    return errorResponse(400, "SAME_PASSWORD", "New password must be different from your current password.");
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user?.email) {
    return errorResponse(401, "UNAUTHORIZED", "You must be signed in to change your password.");
  }

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: currentPassword,
  });

  if (signInError) {
    return errorResponse(
      401,
      "INVALID_CURRENT_PASSWORD",
      "Current password is incorrect."
    );
  }

  const { error: updateError } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (updateError) {
    const msg = updateError.message?.toLowerCase().includes("password")
      ? updateError.message
      : "Could not update password. Check Supabase Auth password rules in the dashboard.";
    return errorResponse(400, "PASSWORD_UPDATE_FAILED", msg);
  }

  return successResponse();
}
