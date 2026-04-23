import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ensureAvatarsBucket, removeUserAvatarObjects } from "@/lib/supabase/avatar-storage-admin";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import type { ApiError, ApiSuccess } from "@/types/api";

type UploadResponse = ApiSuccess<{ avatarUrl: string }> | ApiError;

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

function errorResponse(
  status: number,
  code: string,
  message: string,
  details?: unknown
): NextResponse<ApiError> {
  return NextResponse.json({ success: false, error: { code, message, details } }, { status });
}

function successResponse<T>(data: T): NextResponse<ApiSuccess<T>> {
  return NextResponse.json({ success: true, data });
}

/** Multipart upload: creates bucket if needed, writes with service role, updates `profiles.avatar_url`. */
export async function POST(request: Request): Promise<NextResponse<UploadResponse>> {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return errorResponse(401, "UNAUTHORIZED", "Authentication required.");
  }

  const admin = createServiceRoleClient();
  if (!admin) {
    return errorResponse(
      503,
      "STORAGE_NOT_CONFIGURED",
      "Add SUPABASE_SERVICE_ROLE_KEY to .env.local (Settings → API → service_role, server only), or run the migration supabase/migrations/20260418_000002_avatars_storage_bucket.sql in the SQL Editor so the avatars bucket exists."
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return errorResponse(400, "INVALID_FORM", "Expected multipart form data.");
  }

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return errorResponse(400, "MISSING_FILE", "Missing image file.");
  }

  if (!ALLOWED.has(file.type)) {
    return errorResponse(400, "INVALID_TYPE", "Use a JPEG, PNG, WebP, or GIF image.");
  }

  if (file.size > MAX_BYTES) {
    return errorResponse(400, "FILE_TOO_LARGE", "Image must be 5 MB or smaller.");
  }

  try {
    await ensureAvatarsBucket(admin);
  } catch (e) {
    return errorResponse(
      500,
      "BUCKET_INIT_FAILED",
      "Could not create or verify the avatars storage bucket.",
      e instanceof Error ? e.message : e
    );
  }

  const folder = user.id;
  try {
    await removeUserAvatarObjects(admin, folder);
  } catch (e) {
    return errorResponse(
      500,
      "STORAGE_CLEANUP_FAILED",
      "Could not clear previous avatar files.",
      e instanceof Error ? e.message : e
    );
  }

  const rawExt = file.name.split(".").pop()?.toLowerCase() ?? "";
  const safeExt = /^[a-z0-9]{1,8}$/.test(rawExt) ? rawExt : "jpg";
  const path = `${folder}/avatar-${Date.now()}.${safeExt}`;
  const body = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await admin.storage.from("avatars").upload(path, body, {
    contentType: file.type || "application/octet-stream",
    cacheControl: "3600",
    upsert: false,
  });

  if (uploadError) {
    return errorResponse(500, "UPLOAD_FAILED", uploadError.message || "Upload failed.", uploadError);
  }

  const { data: pub } = admin.storage.from("avatars").getPublicUrl(path);
  const publicUrl = pub.publicUrl;

  const { data, error: dbError } = await supabase
    .from("profiles")
    .update({ avatar_url: publicUrl })
    .eq("id", user.id)
    .select("id");

  if (dbError) {
    return errorResponse(500, "AVATAR_SAVE_FAILED", "Uploaded file but could not update profile.", dbError.message);
  }

  if (data?.length) {
    return successResponse({ avatarUrl: publicUrl });
  }

  const email = user.email?.trim() ?? "";
  if (!email) {
    return errorResponse(
      400,
      "NO_EMAIL",
      "Add a verified email to your account before uploading a photo."
    );
  }
  const local = email.split("@")[0] ?? "user";
  const userName =
    local
      .replace(/[^a-zA-Z0-9_.-]/g, "_")
      .replace(/_+/g, "_")
      .replace(/^_|_$/g, "")
      .slice(0, 255) || "user";

  /**
   * 1) Update by `id` only (no `email` in the payload) — avoids
   *    `duplicate key value violates unique constraint "profiles_email_key"`
   *    when a row for this user exists but the session/RLS path returned 0 rows.
   * 2) If still no row, `INSERT` — if that email is already used by *another* id, return 409.
   */
  const { data: svcUpdated, error: svcUpdateErr } = await admin
    .from("profiles")
    .update({ avatar_url: publicUrl, user_name: userName })
    .eq("id", user.id)
    .select("id");

  if (svcUpdateErr) {
    return errorResponse(500, "AVATAR_SAVE_FAILED", "Could not update profile.", svcUpdateErr.message);
  }
  if (svcUpdated?.length) {
    return successResponse({ avatarUrl: publicUrl });
  }

  const { data: inserted, error: insertErr } = await admin
    .from("profiles")
    .insert({ id: user.id, user_name: userName, email, avatar_url: publicUrl })
    .select("id");

  if (!insertErr && inserted?.length) {
    return successResponse({ avatarUrl: publicUrl });
  }

  const msg = insertErr?.message ?? "";
  const isEmailDuplicate =
    insertErr?.code === "23505" ||
    msg.includes("profiles_email_key") ||
    (msg.toLowerCase().includes("duplicate") && msg.toLowerCase().includes("email"));

  if (isEmailDuplicate) {
    const { data: byEmail, error: selErr } = await admin
      .from("profiles")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (selErr) {
      return errorResponse(500, "AVATAR_SAVE_FAILED", "Could not resolve email conflict.", selErr.message);
    }

    if (byEmail?.id === user.id) {
      const { data: fix } = await admin
        .from("profiles")
        .update({ avatar_url: publicUrl, user_name: userName })
        .eq("id", user.id)
        .select("id");
      if (fix?.length) {
        return successResponse({ avatarUrl: publicUrl });
      }
    }

    if (byEmail && byEmail.id !== user.id) {
      return errorResponse(
        409,
        "PROFILE_EMAIL_CONFLICT",
        "The address is already on another profile row in the database. In Supabase → Table Editor → profiles, remove the duplicate row for this email or fix the `id` to match your auth user, then try again.",
        { existingProfileUserId: byEmail.id, authUserId: user.id }
      );
    }
  }

  return errorResponse(
    500,
    "AVATAR_SAVE_FAILED",
    "Could not create or update your profile row after upload.",
    insertErr?.message ?? msg
  );
}
