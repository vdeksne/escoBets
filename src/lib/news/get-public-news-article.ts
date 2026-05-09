import { isDemoMode } from "@/lib/demo-mode";
import { createClient } from "@/lib/supabase/server";
import { MOCK_NEWS_ARTICLES } from "@/lib/news/mock-data";
import type { NewsArticle, NewsArticleSection } from "@/types/news";

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

function toBodySections(value: unknown): NewsArticleSection[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const sections = value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const maybeSection = item as { heading?: unknown; content?: unknown };
      if (
        typeof maybeSection.heading !== "string" ||
        typeof maybeSection.content !== "string"
      ) {
        return null;
      }
      return { heading: maybeSection.heading, content: maybeSection.content };
    })
    .filter((item): item is NewsArticleSection => item !== null);
  return sections.length > 0 ? sections : undefined;
}

function normalizeNewsArticle(row: Record<string, unknown>): NewsArticle | null {
  const id = row.id;
  const headline = row.headline;
  const imageUrl = row.imageUrl;
  const date = row.date;

  if (
    typeof id !== "string" ||
    typeof headline !== "string" ||
    typeof imageUrl !== "string" ||
    typeof date !== "string"
  ) {
    return null;
  }

  return {
    id,
    slug: typeof row.slug === "string" ? row.slug : undefined,
    imageUrl,
    date,
    headline,
    excerpt: typeof row.excerpt === "string" ? row.excerpt : undefined,
    tags: toStringArray(row.tags),
    body: toBodySections(row.body),
    tableOfContents: toStringArray(row.tableOfContents),
    author: typeof row.author === "string" ? row.author : undefined,
    category: typeof row.category === "string" ? row.category : undefined,
    readingTime: typeof row.readingTime === "string" ? row.readingTime : undefined,
    likes: typeof row.likes === "number" ? row.likes : undefined,
    views: typeof row.views === "number" ? row.views : undefined,
    comments: typeof row.comments === "number" ? row.comments : undefined,
  };
}

async function fetchNewsBySlugFromSupabase(slug: string): Promise<NewsArticle | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("news")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data || typeof data !== "object") {
    return null;
  }

  const row = data as Record<string, unknown>;
  if (row.is_draft === true) {
    return null;
  }

  return normalizeNewsArticle(row);
}

/**
 * Resolve a published article by slug (DB in production, mock in demo).
 * Returns null if slug is invalid or article is missing.
 */
export async function getPublicNewsArticleBySlug(slug: string): Promise<NewsArticle | null> {
  const normalizedSlug = slug.trim().toLowerCase();
  if (!normalizedSlug || !/^[a-z0-9-]+$/.test(normalizedSlug)) {
    return null;
  }

  if (isDemoMode()) {
    return (
      MOCK_NEWS_ARTICLES.find((article) => article.slug?.toLowerCase() === normalizedSlug) ?? null
    );
  }

  const fromDb = await fetchNewsBySlugFromSupabase(normalizedSlug);
  if (fromDb) {
    return fromDb;
  }

  return (
    MOCK_NEWS_ARTICLES.find((article) => article.slug?.toLowerCase() === normalizedSlug) ?? null
  );
}
