import { NextRequest, NextResponse } from "next/server";
import { getNewsListPayload } from "@/lib/news/get-public-news-list";
import type { NewsArticle } from "@/types/news";
import type { ApiError, ApiSuccess } from "@/types/api";

interface NewsListData {
  items: NewsArticle[];
  categories: string[];
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

  const search = (url.searchParams.get("search") ?? "").trim();
  const tag = (url.searchParams.get("tag") ?? "").trim();
  const category = (url.searchParams.get("category") ?? "").trim();

  try {
    const data = await getNewsListPayload({ page, pageSize, search, tag, category });
    return successResponse<NewsListData>(data);
  } catch (error) {
    return errorResponse(500, "INTERNAL_ERROR", "Failed to fetch news.", {
      reason: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
