import type { SupabaseClient } from "@supabase/supabase-js";

const BUCKET = "avatars";

/** Create the public avatars bucket if it does not exist (requires service role). */
export async function ensureAvatarsBucket(admin: SupabaseClient): Promise<void> {
  const { data: buckets, error: listErr } = await admin.storage.listBuckets();
  if (listErr) throw listErr;
  if (buckets?.some((b) => b.id === BUCKET)) return;

  const { error } = await admin.storage.createBucket(BUCKET, {
    public: true,
    fileSizeLimit: 5242880,
    allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
  });

  if (error && !/already exists|duplicate|Bucket already exists/i.test(error.message)) {
    throw error;
  }
}

export async function removeUserAvatarObjects(admin: SupabaseClient, userId: string): Promise<void> {
  const { data: files, error: listErr } = await admin.storage.from(BUCKET).list(userId);
  if (listErr) {
    if (/Bucket not found|not found/i.test(listErr.message)) return;
    throw listErr;
  }
  if (!files?.length) return;
  const paths = files.map((f) => `${userId}/${f.name}`);
  const { error: rmErr } = await admin.storage.from(BUCKET).remove(paths);
  if (rmErr && !/Bucket not found/i.test(rmErr.message)) throw rmErr;
}
