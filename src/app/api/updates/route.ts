import { NextRequest, NextResponse } from "next/server";
import { isDemoMode } from "@/lib/demo-mode";
import { createClient } from "@/lib/supabase/server";
import { MOCK_NEWS_POSTS, MOCK_UPDATES_STATS } from "@/lib/updates/mock-data";
import type { NewsPostAdmin, NewsPostStatus } from "@/types/news-post";
import type { ApiError, ApiSuccess } from "@/types/api";

interface UpdatesData {
  posts: NewsPostAdmin[];
  stats: {
    totalPosts: number;
    newPosts: number;
    livePosts: number;
    totalViews: string;
  };
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

type UpdatesResponse = ApiSuccess<UpdatesData> | ApiError;

const VALID_STATUSES = new Set<NewsPostStatus>([
  "Live",
  "Completed",
  "Pending",
  "Canceled",
]);

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

function normalizeNewsPost(row: Record<string, unknown>): NewsPostAdmin | null {
  const id = row.id;
  const title = row.title;
  const thumbnailUrl = row.thumbnailUrl;
  const date = row.date;
  const status = row.status;

  if (
    typeof id !== "string" ||
    typeof title !== "string" ||
    typeof thumbnailUrl !== "string" ||
    typeof date !== "string" ||
    typeof status !== "string" ||
    !VALID_STATUSES.has(status as NewsPostStatus)
  ) {
    return null;
  }

  return {
    id,
    title,
    thumbnailUrl,
    date,
    status: status as NewsPostStatus,
  };
}

async function fetchUpdatesFromSupabase(): Promise<NewsPostAdmin[] | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("updates").select("*");

  if (error || !Array.isArray(data)) {
    return null;
  }

  const normalized = data
    .map((row) =>
      normalizeNewsPost((row && typeof row === "object" ? row : {}) as Record<string, unknown>)
    )
    .filter((row): row is NewsPostAdmin => row !== null);

  return normalized.length > 0 ? normalized : null;
}

export async function GET(
  request: NextRequest
): Promise<NextResponse<UpdatesResponse>> {
  const url = new URL(request.url);
  const page = parsePositiveIntParam(url.searchParams.get("page"), {
    fallback: 1,
    min: 1,
    max: 10_000,
  });
  const pageSize = parsePositiveIntParam(url.searchParams.get("pageSize"), {
    fallback: 20,
    min: 1,
    /** Keep in sync with `src/app/updates/page.tsx` (pageSize=200). */
    max: 500,
  });

  if (page == null || pageSize == null) {
    return errorResponse(
      400,
      "INVALID_QUERY",
      "Query params `page` and `pageSize` must be positive integers."
    );
  }

  const search = (url.searchParams.get("search") ?? "").trim().toLowerCase();
  const statusParam = (url.searchParams.get("status") ?? "").trim();
  const statusFilter =
    statusParam.length === 0 ? null : (statusParam as NewsPostStatus);

  if (statusFilter && !VALID_STATUSES.has(statusFilter)) {
    return errorResponse(
      400,
      "INVALID_STATUS",
      "Query param `status` must be one of: Live, Completed, Pending, Canceled."
    );
  }

  try {
    const dbPosts = isDemoMode() ? null : await fetchUpdatesFromSupabase();
    const allPosts = dbPosts ?? MOCK_NEWS_POSTS;

    const filtered = allPosts.filter((post) => {
      const matchesSearch =
        search.length === 0 || post.title.toLowerCase().includes(search);
      const matchesStatus = !statusFilter || post.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const safePage = Math.min(page, totalPages);
    const start = (safePage - 1) * pageSize;
    const posts = filtered.slice(start, start + pageSize);

    const livePosts = allPosts.filter((post) => post.status === "Live").length;
    const newPosts = Math.min(10, allPosts.length);

    return successResponse<UpdatesData>({
      posts,
      stats: dbPosts
        ? {
            totalPosts: allPosts.length,
            newPosts,
            livePosts,
            totalViews: "N/A",
          }
        : MOCK_UPDATES_STATS,
      pagination: {
        page: safePage,
        pageSize,
        total,
        totalPages,
      },
    });
  } catch (error) {
    return errorResponse(500, "INTERNAL_ERROR", "Failed to fetch updates.", {
      reason: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
