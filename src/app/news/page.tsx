"use client";

import * as React from "react";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { NewsGrid } from "@/components/news/news-grid";
import type { NewsArticle } from "@/types/news";
import type { ApiResponse } from "@/types/api";
import { ChevronDown, Loader2, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

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

const SEARCH_DEBOUNCE_MS = 320;

/**
 * News and predictions — hero, search, and grid (editorial or scannable layout).
 */
export default function NewsPage() {
  const [page, setPage] = React.useState(1);
  const [articles, setArticles] = React.useState<NewsArticle[]>([]);
  const [totalPages, setTotalPages] = React.useState(1);
  const [totalCount, setTotalCount] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [searchInput, setSearchInput] = React.useState("");
  const [search, setSearch] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [categories, setCategories] = React.useState<string[]>([]);

  React.useEffect(() => {
    const t = window.setTimeout(() => {
      setSearch((s) => {
        const next = searchInput.trim();
        if (next !== s) {
          setPage(1);
        }
        return next;
      });
    }, SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(t);
  }, [searchInput]);

  React.useEffect(() => {
    const controller = new AbortController();

    async function loadNews() {
      setIsLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          page: String(page),
          pageSize: "11",
        });
        if (search) {
          params.set("search", search);
        }
        if (category) {
          params.set("category", category);
        }
        const response = await fetch(`/api/news?${params.toString()}`, {
          signal: controller.signal,
        });
        const payload = (await response.json()) as ApiResponse<NewsListData>;

        if (!response.ok || !payload.success) {
          const message =
            payload.success === false ? payload.error.message : "Failed to load news.";
          throw new Error(message);
        }

        setArticles(payload.data.items);
        setTotalPages(Math.max(1, payload.data.pagination.totalPages));
        setTotalCount(payload.data.pagination.total);
        if (Array.isArray(payload.data.categories)) {
          setCategories(payload.data.categories);
        }
      } catch (fetchError) {
        if (controller.signal.aborted) return;
        setError(fetchError instanceof Error ? fetchError.message : "Failed to load news.");
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
  }, [page, search, category]);

  /** Bento needs a “full” first page; fewer items or search/pagination are clearer as a uniform grid. */
  const useGridLayout =
    search.length > 0 ||
    category.length > 0 ||
    page > 1 ||
    (articles.length > 0 && articles.length < 9);

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <Header />

      <section className="border-b border-white/[0.06] bg-gradient-to-b from-zinc-950/80 via-black to-black">
        <div className="mx-auto max-w-6xl px-4 py-3 md:px-6 md:py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-6 md:gap-8">
            <div className="min-w-0 max-w-xl sm:pb-0.5">
              <p className="font-gotham text-[10px] font-medium uppercase tracking-[0.2em] text-white/40">
                Newsroom
              </p>
              <h1 className="mt-1 font-gotham text-xl font-semibold tracking-tight text-white/95 sm:text-2xl md:text-[1.65rem] md:leading-tight">
                News and predictions
              </h1>
              <p className="mt-1.5 font-gotham text-sm leading-relaxed text-white/45">
                Tips, match notes, and product updates. Filter by category or search.
              </p>
            </div>

            <div className="w-full shrink-0 sm:max-w-[min(100%,20rem)] md:max-w-md">
              <p className="mb-1.5 font-gotham text-[10px] font-medium uppercase tracking-wider text-white/30 sm:text-right">
                Filter
              </p>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch sm:gap-2">
                <div className="relative min-w-0 flex-1 sm:max-w-[9.5rem]">
                  <div className="relative">
                    <select
                      id="news-category"
                      value={category}
                      onChange={(e) => {
                        setCategory(e.target.value);
                        setPage(1);
                      }}
                      className={cn(
                        "h-9 w-full cursor-pointer appearance-none rounded-lg border border-white/10 bg-white/[0.04] py-0 pl-2.5 pr-8 font-gotham text-xs text-white/90 [color-scheme:dark]",
                        "focus:border-escobets-yellow/30 focus:outline-none focus:ring-1 focus:ring-escobets-yellow/15"
                      )}
                    >
                      <option value="">All categories</option>
                      {categories.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/40"
                      aria-hidden
                    />
                  </div>
                </div>
                <div className="relative min-w-0 flex-1">
                  <Search
                    className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/30"
                    aria-hidden
                  />
                  <input
                    id="news-search"
                    type="search"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Search…"
                    autoComplete="off"
                    className={cn(
                      "h-9 w-full rounded-lg border border-white/10 bg-white/[0.04] py-0 pl-8 pr-[4.5rem] font-gotham text-xs text-white/90 placeholder:text-white/30",
                      "focus:border-escobets-yellow/30 focus:outline-none focus:ring-1 focus:ring-escobets-yellow/15"
                    )}
                  />
                  {(searchInput || search) ? (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchInput("");
                        setSearch("");
                        setPage(1);
                      }}
                      className="absolute right-1.5 top-1/2 flex h-6 -translate-y-1/2 items-center gap-0.5 rounded-md px-1.5 font-gotham text-[10px] font-medium uppercase tracking-wide text-white/50 transition hover:bg-white/10 hover:text-white/85"
                      aria-label="Clear search"
                    >
                      <X className="h-3 w-3 sm:hidden" aria-hidden />
                      <span className="hidden sm:inline">Clear</span>
                    </button>
                  ) : null}
                </div>
              </div>
              <div className="mt-1.5 flex flex-wrap items-center justify-end gap-x-2 gap-y-0.5 font-gotham text-[10px] text-white/30">
                {(search || category) ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchInput("");
                      setSearch("");
                      setCategory("");
                      setPage(1);
                    }}
                    className="text-escobets-yellow/80 underline-offset-2 transition hover:text-escobets-yellow hover:underline"
                  >
                    Reset filters
                  </button>
                ) : null}
                {!isLoading && totalCount > 0 ? (
                  <span>
                    {totalCount} {totalCount === 1 ? "article" : "articles"}
                    {category ? ` · ${category}` : ""}
                    {search ? ` · “${search}”` : ""}
                  </span>
                ) : isLoading && (searchInput || search || category) ? (
                  <span className="inline-flex items-center gap-1.5">
                    <Loader2 className="h-3 w-3 animate-spin" aria-hidden />
                    Loading…
                  </span>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="flex-1 px-4 py-8 md:px-6 md:py-10">
        <div className="mx-auto max-w-6xl">
          {error ? (
            <p className="font-gotham text-sm text-red-400" role="alert">
              {error}
            </p>
          ) : isLoading && articles.length === 0 ? (
            <div className="flex items-center justify-center gap-3 py-24">
              <Loader2 className="h-8 w-8 animate-spin text-escobets-yellow/80" aria-hidden />
              <span className="font-gotham text-sm text-white/55">Loading articles…</span>
            </div>
          ) : (
            <NewsGrid
              articles={articles}
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
              layout={useGridLayout ? "grid" : "bento"}
              className="mt-0"
            />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
