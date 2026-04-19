import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { removeUserAvatarObjects } from "@/lib/supabase/avatar-storage-admin";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import type { ApiError, ApiSuccess } from "@/types/api";

type AvatarResponse = ApiSuccess<{ avatarUrl: string | null }> | ApiError;

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

function isTrustedAvatarPublicUrl(userId: string, avatarUrl: string): boolean {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  if (!base) return false;
  const prefix = `${base}/storage/v1/object/public/avatars/${userId}/`;
  return avatarUrl.startsWith(prefix);
}

/** Persist public storage URL on `profiles` after client upload (URL must be under this user’s folder). */
export async function POST(request: NextRequest): Promise<NextResponse<AvatarResponse>> {
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
    return errorResponse(400, "INVALID_JSON", "Invalid JSON body.");
  }

  const avatarUrl =
    typeof body === "object" &&
    body !== null &&
    "avatarUrl" in body &&
    typeof (body as { avatarUrl: unknown }).avatarUrl === "string"
      ? (body as { avatarUrl: string }).avatarUrl.trim()
      : "";

  if (!avatarUrl) {
    return errorResponse(400, "MISSING_AVATAR_URL", "avatarUrl is required.");
  }

  if (!isTrustedAvatarPublicUrl(user.id, avatarUrl)) {
    return errorResponse(403, "INVALID_AVATAR_URL", "URL does not match your storage folder.");
  }

  const { data, error } = await supabase
    .from("profiles")
    .update({ avatar_url: avatarUrl })
    .eq("id", user.id)
    .select("id");

  if (error) {
    return errorResponse(500, "AVATAR_SAVE_FAILED", "Could not update profile photo.", error.message);
  }

  if (!data?.length) {
    return errorResponse(
      404,
      "PROFILE_NOT_FOUND",
      "No profile row found. Save your profile once, then try again."
    );
  }

  return successResponse({ avatarUrl });
}

/** Clear `avatar_url` and remove objects under `{userId}/` in the avatars bucket. */
export async function DELETE(): Promise<NextResponse<AvatarResponse>> {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return errorResponse(401, "UNAUTHORIZED", "Authentication required.");
  }

  const folder = user.id;
  const admin = createServiceRoleClient();
  try {
    if (admin) {
      await removeUserAvatarObjects(admin, folder);
    } else {
      const { data: files, error: listError } = await supabase.storage.from("avatars").list(folder);
      if (!listError && files?.length) {
        const paths = files.map((f) => `${folder}/${f.name}`);
        await supabase.storage.from("avatars").remove(paths);
      }
    }
  } catch {
    // Still clear DB avatar if storage cleanup fails (e.g. bucket missing).
  }

  const { data, error } = await supabase
    .from("profiles")
    .update({ avatar_url: null })
    .eq("id", user.id)
    .select("id");

  if (error) {
    return errorResponse(500, "AVATAR_CLEAR_FAILED", "Could not remove profile photo.", error.message);
  }

  if (!data?.length) {
    return errorResponse(
      404,
      "PROFILE_NOT_FOUND",
      "No profile row found. Save your profile once, then try again."
    );
  }

  return successResponse({ avatarUrl: null });
}
