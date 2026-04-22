import type { SupabaseClient } from "@supabase/supabase-js";

export type PublishedNewsRow = {
  id: string;
  likes: number;
  views: number;
  comments: number;
};

export function normalizeNewsSlugParam(raw: string): string {
  return raw.trim().toLowerCase();
}

export function isValidNewsSlugParam(slug: string): boolean {
  return slug.length > 0 && /^[a-z0-9-]+$/.test(slug);
}

/**
 * Resolves a published (non-draft) news row for engagement APIs. Returns null if missing.
 */
export async function getPublishedNewsBySlug(
  supabase: SupabaseClient,
  rawSlug: string
): Promise<PublishedNewsRow | null> {
  const slug = normalizeNewsSlugParam(rawSlug);
  if (!isValidNewsSlugParam(slug)) {
    return null;
  }
  const { data, error } = await supabase
    .from("news")
    .select("id, likes, views, comments, is_draft")
    .eq("slug", slug)
    .maybeSingle();
  if (error || !data) {
    return null;
  }
  const row = data as { id: string; likes: number | null; views: number | null; comments: number | null; is_draft?: boolean };
  if (row.is_draft === true) {
    return null;
  }
  return {
    id: row.id,
    likes: row.likes ?? 0,
    views: row.views ?? 0,
    comments: row.comments ?? 0,
  };
}
