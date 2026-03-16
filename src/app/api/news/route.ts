import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { MOCK_NEWS_ARTICLES } from "@/lib/news/mock-data";
import type { NewsArticle, NewsArticleSection } from "@/types/news";
import type { ApiError, ApiSuccess } from "@/types/api";

interface NewsListData {
  items: NewsArticle[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

type NewsListResponse = ApiSuccess<NewsListData> | ApiError;

function errorResponse(
  status: number,
  code: string,
  message: string,
  details?: unknown
): NextResponse<ApiError> {
  return NextResponse.json(
    {
      success: false,
      error: { code, message, details },
    },
    { status }
  );
}

function successResponse<T>(data: T): NextResponse<ApiSuccess<T>> {
  return NextResponse.json({
    success: true,
    data,
  });
}

function parsePositiveIntParam(
  rawValue: string | null,
  options: { fallback: number; min: number; max: number }
): number | null {
  if (rawValue == null || rawValue.trim() === "") return options.fallback;
  const value = Number(rawValue);
  if (!Number.isInteger(value) || value < options.min || value > options.max) {
    return null;
  }
  return value;
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

  const normalized = data
    .map((row) =>
      normalizeNewsArticle(
        (row && typeof row === "object" ? row : {}) as Record<string, unknown>
      )
    )
    .filter((row): row is NewsArticle => row !== null);

  return normalized.length > 0 ? normalized : null;
}

export async function GET(
  request: NextRequest
): Promise<NextResponse<NewsListResponse>> {
  const url = new URL(request.url);
  const page = parsePositiveIntParam(url.searchParams.get("page"), {
    fallback: 1,
    min: 1,
    max: 10_000,
  });
  const pageSize = parsePositiveIntParam(url.searchParams.get("pageSize"), {
    fallback: 20,
    min: 1,
    max: 100,
  });

  if (page == null || pageSize == null) {
    return errorResponse(
      400,
      "INVALID_QUERY",
      "Query params `page` and `pageSize` must be positive integers."
    );
  }

  const search = (url.searchParams.get("search") ?? "").trim().toLowerCase();
  const tag = (url.searchParams.get("tag") ?? "").trim().toLowerCase();

  try {
    const dbNews = await fetchNewsFromSupabase();
    const allItems = dbNews ?? MOCK_NEWS_ARTICLES;

    const filtered = allItems.filter((article) => {
      const matchesSearch =
        search.length === 0 ||
        article.headline.toLowerCase().includes(search) ||
        (article.excerpt ?? "").toLowerCase().includes(search);
      const matchesTag =
        tag.length === 0 ||
        article.tags.some((articleTag) => articleTag.toLowerCase() === tag);
      return matchesSearch && matchesTag;
    });

    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const safePage = Math.min(page, totalPages);
    const start = (safePage - 1) * pageSize;
    const items = filtered.slice(start, start + pageSize);

    return successResponse<NewsListData>({
      items,
      pagination: {
        page: safePage,
        pageSize,
        total,
        totalPages,
      },
    });
  } catch (error) {
    return errorResponse(500, "INTERNAL_ERROR", "Failed to fetch news.", {
      reason: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
