import { createClient } from "@/lib/supabase/client";
import type { ApiResponse } from "@/types/api";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"] as const;

function assertImageFile(file: File): void {
  if (!ALLOWED_TYPES.includes(file.type as (typeof ALLOWED_TYPES)[number])) {
    throw new Error("Please choose a JPEG, PNG, WebP, or GIF image.");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("Image must be 5 MB or smaller.");
  }
}

/**
 * Upload a profile picture via the server (service role creates the `avatars` bucket if needed).
 */
export async function uploadProfileAvatar(file: File): Promise<string> {
  assertImageFile(file);

  const fd = new FormData();
  fd.append("file", file);

  const res = await fetch("/api/account/avatar/upload", {
    method: "POST",
    body: fd,
  });

  const json = (await res.json()) as ApiResponse<{ avatarUrl: string }>;
  if (!res.ok || !json.success) {
    const msg =
      json.success === false ? json.error.message : "Could not save profile photo.";
    throw new Error(msg);
  }

  return json.data.avatarUrl;
}

/** Clear `profiles.avatar_url` and remove objects in the avatars bucket (server). */
export async function deleteProfileAvatar(): Promise<void> {
  const supabase = createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Sign in to change your profile photo.");
  }

  const res = await fetch("/api/account/avatar", { method: "DELETE" });
  const json = (await res.json()) as ApiResponse<{ avatarUrl: string | null }>;
  if (!res.ok || !json.success) {
    const msg = json.success === false ? json.error.message : "Could not remove profile photo.";
    throw new Error(msg);
  }
}
