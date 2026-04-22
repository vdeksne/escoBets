import { NextResponse } from "next/server";
import { requireAdminUser } from "@/lib/auth/require-admin";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { ensureNewsImagesBucket, NEWS_IMAGES_BUCKET } from "@/lib/supabase/news-images-storage-admin";
import type { ApiError, ApiSuccess } from "@/types/api";

type UploadResponse = ApiSuccess<{ url: string }> | ApiError;

const MAX_BYTES = 6 * 1024 * 1024;
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

function randomName(): string {
  const a = new Uint8Array(8);
  if (typeof globalThis.crypto !== "undefined" && globalThis.crypto.getRandomValues) {
    globalThis.crypto.getRandomValues(a);
    return Array.from(a, (b) => b.toString(16).padStart(2, "0")).join("");
  }
  return Math.random().toString(36).slice(2, 14) + Date.now().toString(36);
}

/** Admin-only: upload a site / landing image; public URL stored in `site_settings` JSON. */
export async function POST(request: Request): Promise<NextResponse<UploadResponse>> {
  const adminGate = await requireAdminUser();
  if (adminGate.error) {
    return adminGate.error;
  }

  const service = createServiceRoleClient();
  if (!service) {
    return errorResponse(503, "SERVER_CONFIG", "Missing service role configuration.");
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
    return errorResponse(400, "FILE_TOO_LARGE", "Image must be 6 MB or smaller.");
  }

  try {
    await ensureNewsImagesBucket(service);
  } catch (e) {
    return errorResponse(
      500,
      "BUCKET_INIT_FAILED",
      "Could not create or verify the storage bucket.",
      e instanceof Error ? e.message : e
    );
  }

  const rawExt = file.name.split(".").pop()?.toLowerCase() ?? "";
  const safeExt = /^[a-z0-9]{1,8}$/.test(rawExt) ? rawExt : "jpg";
  const path = `site/${Date.now()}-${randomName()}.${safeExt}`;
  const body = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await service.storage.from(NEWS_IMAGES_BUCKET).upload(path, body, {
    contentType: file.type || "application/octet-stream",
    cacheControl: "3600",
    upsert: false,
  });

  if (uploadError) {
    return errorResponse(500, "UPLOAD_FAILED", uploadError.message || "Upload failed.", uploadError);
  }

  const { data: pub } = service.storage.from(NEWS_IMAGES_BUCKET).getPublicUrl(path);
  return successResponse({ url: pub.publicUrl });
}
