import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient, isServiceRoleKey } from "@/lib/supabase/service-role";
import { isNewsEngagementAdmin } from "@/lib/news/engagement-viewer";
import { applyVisitorCookie, getVisitorIdForRequest } from "@/lib/news/engagement-visitor";
import { getPublishedNewsBySlug } from "@/lib/news/engagement-db";
import type { ApiError, ApiSuccess } from "@/types/api";

type DeleteOneData = { comments: number };
type DeleteOneResponse = ApiSuccess<DeleteOneData> | ApiError;

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

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ slug: string; commentId: string }> }
): Promise<NextResponse<DeleteOneResponse>> {
  const { slug: raw, commentId: rawCid } = await context.params;
  const slug = raw.trim().toLowerCase();
  const commentId = rawCid.trim();
  if (!/^[a-z0-9-]+$/.test(slug) || !commentId) {
    return errorResponse(400, "INVALID_PARAMS", "Invalid slug or comment id.");
  }

  const { id: visitorId, isNew } = getVisitorIdForRequest(request);
  const isAdmin = await isNewsEngagementAdmin();

  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!key || !isServiceRoleKey(key)) {
    return errorResponse(503, "MISCONFIG", "Server is not configured for comment moderation.");
  }
  const supabase = createServiceRoleClient();
  if (!supabase) {
    return errorResponse(503, "UNAVAILABLE", "Comments service unavailable.");
  }

  const article = await getPublishedNewsBySlug(supabase, slug);
  if (!article) {
    return errorResponse(404, "NOT_FOUND", "Article not found in database.");
  }

  const { data: row, error: selErr } = await supabase
    .from("news_comments")
    .select("id, article_id, visitor_id")
    .eq("id", commentId)
    .eq("article_id", article.id)
    .maybeSingle();
  if (selErr) {
    return errorResponse(500, "READ_FAILED", "Could not load comment.", { details: selErr.message });
  }
  if (!row) {
    return errorResponse(404, "NOT_FOUND", "Comment not found.");
  }

  const rec = row as { visitor_id: string | null };
  if (!isAdmin) {
    if (!rec.visitor_id || rec.visitor_id !== visitorId) {
      return errorResponse(403, "FORBIDDEN", "You can only delete your own comments.");
    }
  }

  const { data: delRows, error: delErr } = await supabase
    .from("news_comments")
    .delete()
    .eq("id", commentId)
    .eq("article_id", article.id)
    .select("id");
  if (delErr) {
    return errorResponse(500, "DELETE_FAILED", "Could not delete comment.", { details: delErr.message });
  }
  if (!delRows?.length) {
    return errorResponse(404, "NOT_FOUND", "Comment was already removed.");
  }

  const { data: countRow, error: cErr } = await supabase
    .from("news")
    .select("comments")
    .eq("id", article.id)
    .single();
  if (cErr) {
    return errorResponse(500, "READ_FAILED", "Could not read comment count.", { details: cErr.message });
  }
  const beforeCount = typeof (countRow as { comments?: number | null })?.comments === "number" ? (countRow as { comments: number }).comments : 0;
  const { data: nNews, error: upErr } = await supabase
    .from("news")
    .update({ comments: Math.max(0, beforeCount - 1) })
    .eq("id", article.id)
    .select("comments")
    .maybeSingle();
  if (upErr) {
    return errorResponse(500, "UPDATE_FAILED", "Could not update comment count.", { details: upErr.message });
  }
  const nextCount = typeof nNews?.comments === "number" ? nNews.comments : Math.max(0, beforeCount - 1);

  const res = NextResponse.json({
    success: true,
    data: { comments: nextCount },
  } satisfies ApiSuccess<DeleteOneData>);
  applyVisitorCookie(res, visitorId, isNew);
  return res;
}
