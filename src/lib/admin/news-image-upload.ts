import type { ApiResponse } from "@/types/api";

const MAX_BYTES = 6 * 1024 * 1024;
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

function assertFile(file: File): void {
  if (!ALLOWED.has(file.type)) {
    throw new Error("Use a JPEG, PNG, WebP, or GIF image.");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("Image must be 6 MB or smaller.");
  }
}

/** Upload a news image (admin). Returns a public URL to store in `imageUrl` or TipTap. */
export async function uploadAdminNewsImage(file: File): Promise<string> {
  assertFile(file);
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("/api/admin/news/upload-image", { method: "POST", body: fd });
  const json = (await res.json()) as ApiResponse<{ url: string }>;
  if (!res.ok || !json.success) {
    const msg = json.success === false ? json.error.message : "Upload failed.";
    throw new Error(msg);
  }
  return json.data.url;
}
