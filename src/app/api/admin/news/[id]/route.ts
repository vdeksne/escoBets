import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { requireAdminUser } from "@/lib/auth/require-admin";
import { slugifyHeadline } from "@/lib/news/slug";
import type { NewsArticle, NewsArticleSection } from "@/types/news";
import type { ApiError, ApiSuccess } from "@/types/api";

type DetailResponse = ApiSuccess<NewsArticle> | ApiError;

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

function toBodySections(value: unknown): NewsArticleSection[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const sections = value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const o = item as { heading?: unknown; content?: unknown };
      if (typeof o.heading !== "string" || typeof o.content !== "string") return null;
      return { heading: o.heading, content: o.content };
    })
    .filter((s): s is NewsArticleSection => s !== null);
  return sections.length > 0 ? sections : undefined;
}

function toBodyJson(html: string): NewsArticleSection[] {
  const t = html.trim();
  if (!t) return [];
  return [{ heading: "", content: t }];
}

function normalizeFull(row: Record<string, unknown>): NewsArticle | null {
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
    isDraft: row.is_draft === true,
  };
}

type UpdateBody = {
  headline?: string;
  slug?: string;
  imageUrl?: string;
  date?: string;
  excerpt?: string;
  tags?: string[];
  bodyHtml?: string;
  tableOfContents?: string[];
  author?: string;
  category?: string;
  readingTime?: string;
  isDraft?: boolean;
};

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse<DetailResponse>> {
  const adminGate = await requireAdminUser();
  if (adminGate.error) {
    return adminGate.error;
  }

  const { id: rawId } = await context.params;
  const id = decodeURIComponent(rawId).trim();
  if (!id) {
    return errorResponse(400, "INVALID", "Missing article id.");
  }

  const service = createServiceRoleClient();
  if (!service) {
    return errorResponse(503, "SERVER_CONFIG", "Missing service role configuration.");
  }

  const { data, error } = await service.from("news").select("*").eq("id", id).maybeSingle();
  if (error) {
    return errorResponse(500, "FETCH_FAILED", error.message, error);
  }
  if (!data || typeof data !== "object") {
    return errorResponse(404, "NOT_FOUND", "Article not found.");
  }
  const n = normalizeFull(data as Record<string, unknown>);
  if (!n) {
    return errorResponse(500, "NORMALIZE_FAILED", "Invalid row.");
  }
  return successResponse<NewsArticle>(n);
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const adminGate = await requireAdminUser();
  if (adminGate.error) {
    return adminGate.error;
  }

  const { id: rawId } = await context.params;
  const id = decodeURIComponent(rawId).trim();
  if (!id) {
    return errorResponse(400, "INVALID", "Missing article id.");
  }

  let body: UpdateBody;
  try {
    body = (await request.json()) as UpdateBody;
  } catch {
    return errorResponse(400, "INVALID_JSON", "Expected JSON body.");
  }

  const service = createServiceRoleClient();
  if (!service) {
    return errorResponse(503, "SERVER_CONFIG", "Missing service role configuration.");
  }

  const { data: existing, error: existingError } = await service
    .from("news")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (existingError) {
    return errorResponse(500, "FETCH_FAILED", existingError.message, existingError);
  }
  if (!existing) {
    return errorResponse(404, "NOT_FOUND", "Article not found.");
  }

  const e = existing as Record<string, unknown>;
  const headline = typeof body.headline === "string" ? body.headline.trim() : (e.headline as string) ?? "";
  const imageUrl = typeof body.imageUrl === "string" ? body.imageUrl.trim() : (e.imageUrl as string) ?? "";
  const date = typeof body.date === "string" ? body.date.trim() : (e.date as string) ?? "";
  if (!headline || !imageUrl || !date) {
    return errorResponse(400, "VALIDATION", "headline, imageUrl, and date are required.");
  }

  const slugInput = typeof body.slug === "string" && body.slug.trim() ? body.slug.trim() : "";
  const nextSlug = slugifyHeadline(slugInput || headline) || (e.slug as string) || id;
  if (!nextSlug) {
    return errorResponse(400, "VALIDATION", "Invalid slug.");
  }

  const tags = Array.isArray(body.tags)
    ? body.tags.filter((t): t is string => typeof t === "string")
    : toStringArray(e.tags);
  const tableOfContents = Array.isArray(body.tableOfContents)
    ? body.tableOfContents.filter((t): t is string => typeof t === "string")
    : toStringArray(e.tableOfContents);
  const excerpt = typeof body.excerpt === "string" ? body.excerpt : (e.excerpt as string) ?? "";
  const bodyJson =
    typeof body.bodyHtml === "string" ? toBodyJson(body.bodyHtml) : toBodySections(e.body) ?? [];
  const isDraft =
    typeof body.isDraft === "boolean" ? body.isDraft : (e as { is_draft?: boolean }).is_draft === true;

  const updateRow: Record<string, unknown> = {
    id,
    slug: nextSlug,
    imageUrl,
    date,
    headline,
    excerpt: excerpt ? excerpt : null,
    tags,
    body: bodyJson.length > 0 ? bodyJson : null,
    tableOfContents: tableOfContents.length > 0 ? tableOfContents : [],
    author: typeof body.author === "string" && body.author.trim() ? body.author.trim() : (e.author as string) ?? null,
    category: typeof body.category === "string" && body.category.trim() ? body.category.trim() : (e.category as string) ?? null,
    readingTime:
      typeof body.readingTime === "string" && body.readingTime.trim()
        ? body.readingTime.trim()
        : (e.readingTime as string) ?? null,
    likes: typeof e.likes === "number" ? e.likes : 0,
    views: typeof e.views === "number" ? e.views : 0,
    comments: typeof e.comments === "number" ? e.comments : 0,
    is_draft: isDraft,
  };

  const { data: updated, error: upError } = await service
    .from("news")
    .update(updateRow)
    .eq("id", id)
    .select("*")
    .maybeSingle();

  if (upError) {
    if (upError.code === "23505") {
      return errorResponse(409, "DUPLICATE", "Slug is already in use.");
    }
    return errorResponse(500, "UPDATE_FAILED", upError.message, upError);
  }
  if (!updated) {
    return errorResponse(500, "UPDATE_FAILED", "No row returned.");
  }
  const n = normalizeFull(updated as Record<string, unknown>);
  if (!n) {
    return errorResponse(500, "NORMALIZE_FAILED", "Invalid row after update.");
  }
  return successResponse<NewsArticle>(n);
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const adminGate = await requireAdminUser();
  if (adminGate.error) {
    return adminGate.error;
  }

  const { id: rawId } = await context.params;
  const id = decodeURIComponent(rawId).trim();
  if (!id) {
    return errorResponse(400, "INVALID", "Missing article id.");
  }

  const service = createServiceRoleClient();
  if (!service) {
    return errorResponse(503, "SERVER_CONFIG", "Missing service role configuration.");
  }

  const { error } = await service.from("news").delete().eq("id", id);
  if (error) {
    return errorResponse(500, "DELETE_FAILED", error.message, error);
  }
  return successResponse<{ deleted: true }>({ deleted: true });
}
