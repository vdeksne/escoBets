import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { removeUserAvatarObjects } from "@/lib/supabase/avatar-storage-admin";
import type { ApiError, ApiSuccess } from "@/types/api";

type DeleteResponse = ApiSuccess<{ ok: true }> | ApiError;

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
  return NextResponse.json({ success: true, data });
}

/**
 * Permanently delete the signed-in user's auth account (and cascaded profile rows).
 * Requires SUPABASE_SERVICE_ROLE_KEY on the server.
 */
export async function DELETE(): Promise<NextResponse<DeleteResponse>> {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return errorResponse(401, "UNAUTHORIZED", "You must be signed in to delete your account.");
  }

  const admin = createServiceRoleClient();
  if (!admin) {
    return errorResponse(
      503,
      "SERVER_CONFIG",
      "Account deletion is not available (missing server configuration)."
    );
  }

  try {
    await removeUserAvatarObjects(admin, user.id);
  } catch {
    // Best-effort cleanup; proceed with user deletion
  }

  const { error: deleteError } = await admin.auth.admin.deleteUser(user.id);
  if (deleteError) {
    return errorResponse(500, "DELETE_FAILED", deleteError.message);
  }

  return successResponse({ ok: true as const });
}
