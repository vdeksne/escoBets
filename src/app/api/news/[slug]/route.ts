import { NextRequest, NextResponse } from "next/server";
import { getPublicNewsArticleBySlug } from "@/lib/news/get-public-news-article";
import type { NewsArticle } from "@/types/news";
import type { ApiError, ApiSuccess } from "@/types/api";

type NewsDetailResponse = ApiSuccess<NewsArticle> | ApiError;

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

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ slug: string }> }
): Promise<NextResponse<NewsDetailResponse>> {
  const { slug } = await context.params;
  const normalizedSlug = slug.trim().toLowerCase();

  if (!normalizedSlug || !/^[a-z0-9-]+$/.test(normalizedSlug)) {
    return errorResponse(
      400,
      "INVALID_SLUG",
      "Route param `slug` must include only lowercase letters, numbers, and dashes."
    );
  }

  try {
    const article = await getPublicNewsArticleBySlug(slug);
    if (!article) {
      return errorResponse(404, "NOT_FOUND", "News article not found.");
    }
    return successResponse(article);
  } catch (error) {
    return errorResponse(500, "INTERNAL_ERROR", "Failed to fetch news article.", {
      reason: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
