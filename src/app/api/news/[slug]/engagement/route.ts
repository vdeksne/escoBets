import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { isNewsEngagementAdmin } from "@/lib/news/engagement-viewer";
import { applyVisitorCookie, getVisitorIdForRequest } from "@/lib/news/engagement-visitor";
import { getPublishedNewsBySlug } from "@/lib/news/engagement-db";
import type { NewsCommentPublic } from "@/types/news";
import type { ApiError, ApiSuccess } from "@/types/api";

type EngagementData =
  | {
      mode: "live";
      /** Signed-in user has admin role (can delete any comment, see delete-all) */
      isAdmin: boolean;
      likes: number;
      views: number;
      comments: number;
      liked: boolean;
      recentComments: NewsCommentPublic[];
    }
  | { mode: "static" };

type EngagementResponse = ApiSuccess<EngagementData> | ApiError;

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

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
): Promise<NextResponse<EngagementResponse>> {
  const { slug: raw } = await context.params;
  const slug = raw.trim().toLowerCase();
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return errorResponse(400, "INVALID_SLUG", "Invalid slug.");
  }

  const { id: visitorId, isNew } = getVisitorIdForRequest(request);
  const isAdmin = await isNewsEngagementAdmin();

  const supabase = createServiceRoleClient();
  if (!supabase) {
    const res = NextResponse.json({
      success: true,
      data: { mode: "static" } satisfies EngagementData,
    } satisfies ApiSuccess<EngagementData>);
    applyVisitorCookie(res, visitorId, isNew);
    return res;
  }

  const article = await getPublishedNewsBySlug(supabase, slug);
  if (!article) {
    const res = NextResponse.json({
      success: true,
      data: { mode: "static" } satisfies EngagementData,
    } satisfies ApiSuccess<EngagementData>);
    applyVisitorCookie(res, visitorId, isNew);
    return res;
  }

  const track = request.nextUrl.searchParams.get("track") === "1";

  if (track) {
    const { error: rErr } = await supabase.rpc("record_news_view", {
      p_article_id: article.id,
      p_visitor_id: visitorId,
    });
    if (rErr) {
      // eslint-disable-next-line no-console
      console.error("record_news_view", rErr);
    }
  }

  const { data: fresh, error: freshErr } = await supabase
    .from("news")
    .select("likes, views, comments")
    .eq("id", article.id)
    .maybeSingle();

  if (freshErr || !fresh) {
    return errorResponse(500, "READ_FAILED", "Could not read article.");
  }
  const row = fresh as { likes: number | null; views: number | null; comments: number | null };

  const { data: likeRow } = await supabase
    .from("news_likes")
    .select("article_id")
    .eq("article_id", article.id)
    .eq("visitor_id", visitorId)
    .maybeSingle();

  type CommentRow = {
    id: string;
    body: string;
    author: string | null;
    created_at: string | null;
    visitor_id?: string | null;
  };
  let commentRows: CommentRow[] = [];
  {
    const res = await supabase
      .from("news_comments")
      .select("id, body, author, created_at, visitor_id")
      .eq("article_id", article.id)
      .order("created_at", { ascending: false })
      .limit(20);
    if (res.error && /visitor_id|schema cache|column/i.test(String(res.error.message))) {
      const legacy = await supabase
        .from("news_comments")
        .select("id, body, author, created_at")
        .eq("article_id", article.id)
        .order("created_at", { ascending: false })
        .limit(20);
      commentRows = (legacy.data as CommentRow[] | null) ?? [];
    } else if (res.error) {
      // eslint-disable-next-line no-console
      console.error("news_comments", res.error);
    } else {
      commentRows = (res.data as CommentRow[] | null) ?? [];
    }
  }

  const recentComments: NewsCommentPublic[] = commentRows.map((r) => {
    const vid = r.visitor_id ?? null;
    const own = Boolean(vid && vid === visitorId);
    return {
      id: r.id,
      body: r.body,
      author: r.author,
      createdAt: toIso(r.created_at),
      canDelete: isAdmin || own,
    };
  });

  const data: EngagementData = {
    mode: "live",
    isAdmin,
    likes: row.likes ?? 0,
    views: row.views ?? 0,
    comments: row.comments ?? 0,
    liked: Boolean(likeRow),
    recentComments,
  };

  const res = NextResponse.json({ success: true, data } satisfies ApiSuccess<EngagementData>);
  applyVisitorCookie(res, visitorId, isNew);
  return res;
}
