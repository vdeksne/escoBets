import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient, isServiceRoleKey } from "@/lib/supabase/service-role";
import { requireAdminUser } from "@/lib/auth/require-admin";
import { applyVisitorCookie, getVisitorIdForRequest } from "@/lib/news/engagement-visitor";
import { getPublishedNewsBySlug } from "@/lib/news/engagement-db";
import { ENGAGEMENT_MIGRATION_HINT, isEngagementTablesMissingError } from "@/lib/news/engagement-schema-error";
import type { NewsCommentPublic } from "@/types/news";
import type { ApiError, ApiSuccess } from "@/types/api";

type CommentPostData = {
  comment: NewsCommentPublic;
  comments: number;
};
type CommentPostResponse = ApiSuccess<CommentPostData> | ApiError;

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

function toIso(value: string | null | undefined): string {
  if (!value) {
    return new Date(0).toISOString();
  }
  return value;
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
): Promise<NextResponse<CommentPostResponse>> {
  const { slug: raw } = await context.params;
  const slug = raw.trim().toLowerCase();
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return errorResponse(400, "INVALID_SLUG", "Invalid slug.");
  }

  const { id: visitorId, isNew } = getVisitorIdForRequest(request);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse(400, "INVALID_JSON", "Expected JSON body.");
  }
  const text =
    body && typeof body === "object" && "body" in body && typeof (body as { body: unknown }).body === "string"
      ? (body as { body: string }).body.trim()
      : "";
  const authorRaw =
    body && typeof body === "object" && "author" in body && typeof (body as { author: unknown }).author === "string"
      ? (body as { author: string }).author.trim()
      : "";

  if (!text || text.length > 2000) {
    return errorResponse(400, "INVALID_BODY", "Comment must be 1–2000 characters.");
  }
  if (authorRaw.length > 80) {
    return errorResponse(400, "INVALID_AUTHOR", "Name is too long.");
  }

  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!key) {
    return errorResponse(503, "UNAVAILABLE", "Missing SUPABASE_SERVICE_ROLE_KEY in environment.");
  }
  if (!isServiceRoleKey(key)) {
    return errorResponse(
      503,
      "MISCONFIG",
      "Set SUPABASE_SERVICE_ROLE_KEY to the service_role secret (not the anon public key)."
    );
  }

  const supabase = createServiceRoleClient();
  if (!supabase) {
    return errorResponse(503, "UNAVAILABLE", "Comments are not available.");
  }

  const article = await getPublishedNewsBySlug(supabase, slug);
  if (!article) {
    return errorResponse(404, "NOT_FOUND", "Article not found in database.");
  }

  const { data: insRow, error: insErr } = await supabase
    .from("news_comments")
    .insert({
      article_id: article.id,
      body: text,
      author: authorRaw ? authorRaw : null,
      visitor_id: visitorId,
    })
    .select("id, created_at")
    .single();

  if (insErr) {
    // eslint-disable-next-line no-console
    console.error("news_comments insert", insErr);
    if (isEngagementTablesMissingError(insErr.message)) {
      return errorResponse(503, "MIGRATION_REQUIRED", ENGAGEMENT_MIGRATION_HINT, {
        supabaseError: insErr.message,
      });
    }
    return errorResponse(500, "COMMENT_FAILED", "Could not post comment.", { details: insErr.message });
  }

  if (!insRow) {
    return errorResponse(500, "COMMENT_FAILED", "No row returned from insert.");
  }
  const ir = insRow as { id: string; created_at: string | null };
  const before = article.comments ?? 0;
  const { data: nNews, error: upErr } = await supabase
    .from("news")
    .update({ comments: before + 1 })
    .eq("id", article.id)
    .select("comments")
    .maybeSingle();
  if (upErr) {
    // eslint-disable-next-line no-console
    console.error("news update comments", upErr);
    return errorResponse(500, "COMMENT_FAILED", "Could not update comment count.", { details: upErr.message });
  }
  const newTotal = typeof nNews?.comments === "number" ? nNews.comments : before + 1;

  const comment: NewsCommentPublic = {
    id: ir.id,
    body: text,
    author: authorRaw ? authorRaw : null,
    createdAt: toIso(ir.created_at),
    canDelete: true,
  };

  const res = NextResponse.json({
    success: true,
    data: { comment, comments: newTotal } satisfies CommentPostData,
  } satisfies ApiSuccess<CommentPostData>);
  applyVisitorCookie(res, visitorId, isNew);
  return res;
}

type DeleteAllData = { deleted: number; comments: number };
type DeleteAllResponse = ApiSuccess<DeleteAllData> | ApiError;

/** Admin only: remove every comment for this article. */
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
): Promise<NextResponse<DeleteAllResponse>> {
  const { slug: raw } = await context.params;
  const slug = raw.trim().toLowerCase();
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return errorResponse(400, "INVALID_SLUG", "Invalid slug.") as NextResponse<DeleteAllResponse>;
  }

  if (request.nextUrl.searchParams.get("all") !== "1") {
    return errorResponse(400, "INVALID_QUERY", "Use DELETE with ?all=1 to remove all comments (admin only).") as NextResponse<DeleteAllResponse>;
  }

  const admin = await requireAdminUser();
  if (admin.error) {
    return admin.error as NextResponse<DeleteAllResponse>;
  }

  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!key || !isServiceRoleKey(key)) {
    return errorResponse(503, "MISCONFIG", "Server is not configured to moderate comments.") as NextResponse<DeleteAllResponse>;
  }
  const supabase = createServiceRoleClient();
  if (!supabase) {
    return errorResponse(503, "UNAVAILABLE", "Comments service unavailable.") as NextResponse<DeleteAllResponse>;
  }

  const article = await getPublishedNewsBySlug(supabase, slug);
  if (!article) {
    return errorResponse(404, "NOT_FOUND", "Article not found in database.") as NextResponse<DeleteAllResponse>;
  }

  const { data: removed, error: delErr } = await supabase
    .from("news_comments")
    .delete()
    .eq("article_id", article.id)
    .select("id");
  if (delErr) {
    return errorResponse(500, "DELETE_FAILED", "Could not delete comments.", { details: delErr.message }) as NextResponse<DeleteAllResponse>;
  }
  const n = Array.isArray(removed) ? removed.length : 0;

  const { error: upErr } = await supabase
    .from("news")
    .update({ comments: 0 })
    .eq("id", article.id);
  if (upErr) {
    return errorResponse(500, "UPDATE_FAILED", "Could not reset comment count.", { details: upErr.message }) as NextResponse<DeleteAllResponse>;
  }

  return NextResponse.json({
    success: true,
    data: { deleted: n, comments: 0 },
  } satisfies ApiSuccess<DeleteAllData>) as NextResponse<DeleteAllResponse>;
}
