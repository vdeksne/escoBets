"use client";

import * as React from "react";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { NewsGrid } from "@/components/news/news-grid";
import type { NewsArticle } from "@/types/news";
import type { ApiResponse } from "@/types/api";

interface NewsListData {
  items: NewsArticle[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

/**
 * News and predictions page.
 * Data: Replace MOCK_NEWS_ARTICLES with API/CMS (e.g. useSWR('/api/news', fetcher)).
 */
export default function NewsPage() {
  const [page, setPage] = React.useState(1);
  const [articles, setArticles] = React.useState<NewsArticle[]>([]);
  const [totalPages, setTotalPages] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const controller = new AbortController();

    async function loadNews() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/news?page=${page}&pageSize=11`, {
          signal: controller.signal,
        });
        const payload = (await response.json()) as ApiResponse<NewsListData>;

        if (!response.ok || !payload.success) {
          const message =
            payload.success === false
              ? payload.error.message
              : "Failed to load news.";
          throw new Error(message);
        }

        setArticles(payload.data.items);
        setTotalPages(Math.max(1, payload.data.pagination.totalPages));
      } catch (fetchError) {
        if (controller.signal.aborted) return;
        setError(
          fetchError instanceof Error ? fetchError.message : "Failed to load news."
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    void loadNews();

    return () => {
      controller.abort();
    };
  }, [page]);

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <Header variant="withLogo" />

      <main className="flex-1 px-4 py-8">
        <div className="mx-auto max-w-6xl">
          <h1 className="font-gotham text-3xl font-bold uppercase tracking-tight text-white md:text-4xl">
            News and predictions
          </h1>

          {error ? (
            <p className="mt-8 font-gotham text-sm text-red-400">{error}</p>
          ) : isLoading ? (
            <p className="mt-8 font-gotham text-sm text-white/70">Loading news...</p>
          ) : (
            <NewsGrid
              articles={articles}
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
              className="mt-8"
            />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
