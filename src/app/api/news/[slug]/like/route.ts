import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient, isServiceRoleKey } from "@/lib/supabase/service-role";
import { applyVisitorCookie, getVisitorIdForRequest } from "@/lib/news/engagement-visitor";
import { getPublishedNewsBySlug } from "@/lib/news/engagement-db";
import { ENGAGEMENT_MIGRATION_HINT, isEngagementTablesMissingError } from "@/lib/news/engagement-schema-error";
import type { ApiError, ApiSuccess } from "@/types/api";

type LikeData = { likes: number; liked: boolean };
type LikeResponse = ApiSuccess<LikeData> | ApiError;

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

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
): Promise<NextResponse<LikeResponse>> {
  const { slug: raw } = await context.params;
  const slug = raw.trim().toLowerCase();
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return errorResponse(400, "INVALID_SLUG", "Invalid slug.");
  }

  const { id: visitorId, isNew } = getVisitorIdForRequest(request);

  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!key) {
    return errorResponse(503, "UNAVAILABLE", "Missing SUPABASE_SERVICE_ROLE_KEY in environment.");
  }
  if (!isServiceRoleKey(key)) {
    return errorResponse(
      503,
      "MISCONFIG",
      "Set SUPABASE_SERVICE_ROLE_KEY to the service_role secret in Supabase (Settings → API), not the anon public key. The anon key cannot update articles or post likes (RLS)."
    );
  }

  const supabase = createServiceRoleClient();
  if (!supabase) {
    return errorResponse(503, "UNAVAILABLE", "Engagement is not available. Check NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
  }

  const article = await getPublishedNewsBySlug(supabase, slug);
  if (!article) {
    return errorResponse(404, "NOT_FOUND", "Article not found in database.");
  }

  // Direct table updates (reliable; PostgREST RPC to SECURITY DEFINER fns is often flaky in prod)
  const { data: likeRow, error: likeSelErr } = await supabase
    .from("news_likes")
    .select("article_id")
    .eq("article_id", article.id)
    .eq("visitor_id", visitorId)
    .maybeSingle();

  if (likeSelErr) {
    // eslint-disable-next-line no-console
    console.error("news_likes select", likeSelErr);
    if (isEngagementTablesMissingError(likeSelErr.message)) {
      return errorResponse(503, "MIGRATION_REQUIRED", ENGAGEMENT_MIGRATION_HINT, {
        supabaseError: likeSelErr.message,
      });
    }
    return errorResponse(500, "TOGGLE_FAILED", "Could not update like.", {
      details: likeSelErr.message,
    });
  }

  const hadLike = Boolean(likeRow);

  const readLikes = async (): Promise<number | null> => {
    const { data: row, error: e } = await supabase
      .from("news")
      .select("likes")
      .eq("id", article.id)
      .single();
    if (e) {
      // eslint-disable-next-line no-console
      console.error("news read likes", e);
      return null;
    }
    return typeof (row as { likes?: number | null })?.likes === "number"
      ? (row as { likes: number }).likes
      : 0;
  };

  if (hadLike) {
    const { error: delErr } = await supabase
      .from("news_likes")
      .delete()
      .eq("article_id", article.id)
      .eq("visitor_id", visitorId);
    if (delErr) {
      // eslint-disable-next-line no-console
      console.error("news_likes delete", delErr);
      if (isEngagementTablesMissingError(delErr.message)) {
        return errorResponse(503, "MIGRATION_REQUIRED", ENGAGEMENT_MIGRATION_HINT, {
          supabaseError: delErr.message,
        });
      }
      return errorResponse(500, "TOGGLE_FAILED", "Could not update like.", { details: delErr.message });
    }
    const current = (await readLikes()) ?? article.likes ?? 0;
    const { data: nRow, error: upErr } = await supabase
      .from("news")
      .update({ likes: Math.max(0, current - 1) })
      .eq("id", article.id)
      .select("likes")
      .maybeSingle();
    if (upErr) {
      // eslint-disable-next-line no-console
      console.error("news update unlike", upErr);
      return errorResponse(500, "TOGGLE_FAILED", "Could not update like count.", { details: upErr.message });
    }
    if (nRow == null) {
      return errorResponse(
        500,
        "TOGGLE_FAILED",
        "Update affected no row — check article id, or that the DB key is service_role and migration for news_likes is applied."
      );
    }
    const likes = typeof nRow.likes === "number" ? nRow.likes : Math.max(0, current - 1);
    const res = NextResponse.json({
      success: true,
      data: { likes, liked: false } satisfies LikeData,
    } satisfies ApiSuccess<LikeData>);
    applyVisitorCookie(res, visitorId, isNew);
    return res;
  }

  const { error: insErr } = await supabase.from("news_likes").insert({
    article_id: article.id,
    visitor_id: visitorId,
  });
  if (insErr) {
    // eslint-disable-next-line no-console
    console.error("news_likes insert", insErr);
    if (isEngagementTablesMissingError(insErr.message)) {
      return errorResponse(503, "MIGRATION_REQUIRED", ENGAGEMENT_MIGRATION_HINT, {
        supabaseError: insErr.message,
      });
    }
    return errorResponse(500, "TOGGLE_FAILED", "Could not record like.", { details: insErr.message });
  }
  const before = (await readLikes()) ?? article.likes ?? 0;
  const { data: pRow, error: up2Err } = await supabase
    .from("news")
    .update({ likes: before + 1 })
    .eq("id", article.id)
    .select("likes")
    .maybeSingle();
  if (up2Err) {
    // eslint-disable-next-line no-console
    console.error("news update like", up2Err);
    return errorResponse(500, "TOGGLE_FAILED", "Could not update like count.", { details: up2Err.message });
  }
  if (pRow == null) {
    return errorResponse(
      500,
      "TOGGLE_FAILED",
      "Update affected no row — check article id, or that the DB key is service_role and migration for news_likes is applied."
    );
  }
  const likes = typeof pRow.likes === "number" ? pRow.likes : before + 1;

  const res = NextResponse.json({
    success: true,
    data: { likes, liked: true } satisfies LikeData,
  } satisfies ApiSuccess<LikeData>);
  applyVisitorCookie(res, visitorId, isNew);
  return res;
}
