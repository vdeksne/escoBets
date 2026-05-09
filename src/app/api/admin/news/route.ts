import { NextRequest, NextResponse } from "next/server";
import { isDemoMode } from "@/lib/demo-mode";
import {
  demoAdminSlugTaken,
  prependDemoAdminArticle,
} from "@/lib/news/demo-admin-news-store";
import { fetchAdminNewsListForEditor } from "@/lib/news/fetch-admin-news-list-for-editor";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { adminError, requireAdminUser } from "@/lib/auth/require-admin";
import { slugifyHeadline } from "@/lib/news/slug";
import type { NewsArticle, NewsArticleSection } from "@/types/news";
import type { ApiError, ApiSuccess } from "@/types/api";

type NewsListData = { items: NewsArticle[] };

type NewsListResponse = ApiSuccess<NewsListData> | ApiError;

type CreateBody = {
  headline: string;
  slug?: string;
  imageUrl: string;
  date: string;
  excerpt?: string;
  tags?: string[];
  bodyHtml: string;
  tableOfContents?: string[];
  author?: string;
  category?: string;
  readingTime?: string;
  isDraft?: boolean;
};

function errorResponse(
  status: number,
  code: string,
  message: string,
  details?: unknown
): NextResponse<ApiError> {
  return NextResponse.json(
    { success: false, error: { code, message, details } },
    { status }
  );
}

function successResponse<T>(data: T) {
  return NextResponse.json({ success: true, data } satisfies ApiSuccess<T>);
}

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((v): v is string => typeof v === "string");
}

function toBodyJson(html: string): NewsArticleSection[] {
  const t = html.trim();
  if (!t) return [];
  return [{ heading: "", content: t }];
}

function normalizeNewsRow(row: Record<string, unknown>): NewsArticle | null {
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
    body: undefined,
    tableOfContents: toStringArray(row.tableOfContents),
    author: typeof row.author === "string" ? row.author : undefined,
    category: typeof row.category === "string" ? row.category : undefined,
    readingTime: typeof row.readingTime === "string" ? row.readingTime : undefined,
    likes: typeof row.likes === "number" ? row.likes : undefined,
    views: typeof row.views === "number" ? row.views : undefined,
    comments: typeof row.comments === "number" ? row.comments : undefined,
    isDraft: row.is_draft === true,
  };
}

/**
 * List all news rows for the editor (admin). Includes drafts.
 */
export async function GET(): Promise<NextResponse<NewsListResponse>> {
  const result = await fetchAdminNewsListForEditor();
  if (!result.ok) {
    if (result.kind === "unauthorized") {
      return adminError(401, "UNAUTHORIZED", "Authentication required.");
    }
    if (result.kind === "forbidden") {
      return adminError(403, "FORBIDDEN", "Admin access required.");
    }
    if (result.kind === "config") {
      return errorResponse(503, "SERVER_CONFIG", result.message ?? "Missing service configuration.");
    }
    return errorResponse(500, "FETCH_FAILED", result.message ?? "Failed to fetch news.");
  }
  return successResponse<NewsListData>({ items: result.items });
}

export async function POST(request: NextRequest) {
  const adminGate = await requireAdminUser();
  if (adminGate.error) {
    return adminGate.error;
  }

  let body: CreateBody;
  try {
    body = (await request.json()) as CreateBody;
  } catch {
    return errorResponse(400, "INVALID_JSON", "Expected JSON body.");
  }

  const headline = typeof body.headline === "string" ? body.headline.trim() : "";
  const imageUrl = typeof body.imageUrl === "string" ? body.imageUrl.trim() : "";
  const date = typeof body.date === "string" ? body.date.trim() : "";
  const bodyHtml = typeof body.bodyHtml === "string" ? body.bodyHtml : "";
  if (!headline) {
    return errorResponse(400, "VALIDATION", "headline is required.");
  }
  if (!imageUrl) {
    return errorResponse(400, "VALIDATION", "imageUrl is required.");
  }
  if (!date) {
    return errorResponse(400, "VALIDATION", "date is required.");
  }

  const slugInput = typeof body.slug === "string" && body.slug.trim() ? body.slug.trim() : "";
  const baseSlug = slugifyHeadline(slugInput || headline);
  if (!baseSlug) {
    return errorResponse(400, "VALIDATION", "Could not derive a valid slug from the headline.");
  }

  const tags = Array.isArray(body.tags) ? body.tags.filter((t): t is string => typeof t === "string") : [];
  const tableOfContents = Array.isArray(body.tableOfContents)
    ? body.tableOfContents.filter((t): t is string => typeof t === "string")
    : [];
  const excerpt = typeof body.excerpt === "string" ? body.excerpt.trim() : "";
  const bodyJson = toBodyJson(bodyHtml);
  const isDraft = Boolean(body.isDraft);

  if (isDemoMode()) {
    if (demoAdminSlugTaken(baseSlug)) {
      return errorResponse(409, "DUPLICATE", "A post with this slug or id already exists.");
    }
    const created: NewsArticle = {
      id: baseSlug,
      slug: baseSlug,
      imageUrl,
      date,
      headline,
      excerpt: excerpt || undefined,
      tags,
      body: bodyJson.length > 0 ? bodyJson : undefined,
      tableOfContents: tableOfContents.length > 0 ? tableOfContents : undefined,
      author:
        typeof body.author === "string" && body.author.trim() ? body.author.trim() : undefined,
      category:
        typeof body.category === "string" && body.category.trim()
          ? body.category.trim()
          : undefined,
      readingTime:
        typeof body.readingTime === "string" && body.readingTime.trim()
          ? body.readingTime.trim()
          : undefined,
      likes: 0,
      views: 0,
      comments: 0,
      isDraft,
    };
    prependDemoAdminArticle(created);
    const listRow = normalizeNewsRow({
      ...created,
      is_draft: isDraft,
    } as unknown as Record<string, unknown>);
    if (!listRow) {
      return errorResponse(500, "NORMALIZE_FAILED", "Created row could not be normalized.");
    }
    return successResponse<NewsArticle>(listRow);
  }

  const service = createServiceRoleClient();
  if (!service) {
    return errorResponse(503, "SERVER_CONFIG", "Missing service role configuration.");
  }

  const row: Record<string, unknown> = {
    id: baseSlug,
    slug: baseSlug,
    imageUrl,
    date,
    headline,
    excerpt: excerpt || null,
    tags: tags.length > 0 ? tags : [],
    body: bodyJson,
    tableOfContents: tableOfContents.length > 0 ? tableOfContents : [],
    author: typeof body.author === "string" && body.author.trim() ? body.author.trim() : null,
    category: typeof body.category === "string" && body.category.trim() ? body.category.trim() : null,
    readingTime: typeof body.readingTime === "string" && body.readingTime.trim() ? body.readingTime.trim() : null,
    likes: 0,
    views: 0,
    comments: 0,
    is_draft: isDraft,
  };

  const { data: created, error: insError } = await service
    .from("news")
    .insert(row)
    .select("*")
    .maybeSingle();

  if (insError) {
    if (insError.code === "23505") {
      return errorResponse(409, "DUPLICATE", "A post with this slug or id already exists.");
    }
    return errorResponse(500, "INSERT_FAILED", insError.message, insError);
  }

  const n = created && typeof created === "object" ? normalizeNewsRow(created as Record<string, unknown>) : null;
  if (!n) {
    return errorResponse(500, "NORMALIZE_FAILED", "Created row could not be read back.");
  }
  return successResponse<NewsArticle>(n);
}
