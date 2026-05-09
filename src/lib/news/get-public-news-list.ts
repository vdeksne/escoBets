import { isDemoMode } from "@/lib/demo-mode";
import { createClient } from "@/lib/supabase/server";
import { MOCK_NEWS_ARTICLES } from "@/lib/news/mock-data";
import type { NewsArticle, NewsArticleSection } from "@/types/news";

export interface NewsListPayload {
  items: NewsArticle[];
  categories: string[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface NewsListQuery {
  page: number;
  pageSize: number;
  search?: string;
  tag?: string;
  category?: string;
}

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

async function fetchNewsFromSupabase(): Promise<NewsArticle[] | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("news").select("*");

  if (error || !Array.isArray(data)) {
    return null;
  }

  const visible = data.filter((row: Record<string, unknown>) => row.is_draft !== true);

  const normalized = visible
    .map((row) =>
      normalizeNewsArticle(
        (row && typeof row === "object" ? row : {}) as Record<string, unknown>
      )
    )
    .filter((row): row is NewsArticle => row !== null);

  return normalized.length > 0 ? normalized : null;
}

/** Public news list (published only when using DB). Safe to call from Server Components. */
export async function getNewsListPayload(query: NewsListQuery): Promise<NewsListPayload> {
  const page = query.page;
  const pageSize = query.pageSize;
  const search = (query.search ?? "").trim().toLowerCase();
  const tag = (query.tag ?? "").trim().toLowerCase();
  const categoryParam = (query.category ?? "").trim();
  const categoryLower = categoryParam.toLowerCase();

  const dbNews = isDemoMode() ? null : await fetchNewsFromSupabase();
  const allItems = dbNews ?? MOCK_NEWS_ARTICLES;

  const categories = [
    ...new Set(
      allItems
        .map((a) => (a.category ?? "").trim())
        .filter((c): c is string => c.length > 0)
    ),
  ].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));

  const filtered = allItems.filter((article) => {
    const h = article.headline.toLowerCase();
    const ex = (article.excerpt ?? "").toLowerCase();
    const cat = (article.category ?? "").toLowerCase();
    const tagStr = article.tags.join(" ").toLowerCase();
    const matchesSearch =
      search.length === 0 ||
      h.includes(search) ||
      ex.includes(search) ||
      cat.includes(search) ||
      tagStr.includes(search) ||
      article.tags.some((t) => t.toLowerCase().includes(search));
    const matchesTag =
      tag.length === 0 || article.tags.some((articleTag) => articleTag.toLowerCase() === tag);
    const matchesCategory =
      categoryParam.length === 0 ||
      (article.category ?? "").trim().toLowerCase() === categoryLower;
    return matchesSearch && matchesTag && matchesCategory;
  });

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * pageSize;
  const items = filtered.slice(start, start + pageSize);

  return {
    items,
    categories,
    pagination: {
      page: safePage,
      pageSize,
      total,
      totalPages,
    },
  };
}
