import type { SupabaseClient } from "@supabase/supabase-js";

const BUCKET = "news-images";

/** Public bucket for featured / inline article images (admin uploads only; API enforces). */
export async function ensureNewsImagesBucket(admin: SupabaseClient): Promise<void> {
  const { data: buckets, error: listErr } = await admin.storage.listBuckets();
  if (listErr) throw listErr;
  if (buckets?.some((b) => b.id === BUCKET)) return;

  const { error } = await admin.storage.createBucket(BUCKET, {
    public: true,
    fileSizeLimit: 6 * 1024 * 1024,
    allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
  });

  if (error && !/already exists|duplicate|Bucket already exists/i.test(error.message)) {
    throw error;
  }
}

export { BUCKET as NEWS_IMAGES_BUCKET };
