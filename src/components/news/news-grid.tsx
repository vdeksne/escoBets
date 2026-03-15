"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { NewsArticleCard } from "./news-article-card";
import type { NewsArticle } from "@/types/news";
import { cn } from "@/lib/utils";

interface NewsGridProps {
  articles: NewsArticle[];
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  className?: string;
}

/** Grid layout: large+2small | medium+large | 3 equal | 3 equal */
export function NewsGrid({
  articles,
  currentPage = 1,
  totalPages = 10,
  onPageChange,
  className,
}: NewsGridProps) {
  const [a, b, c, d, e, f, g, h, i, j, k] = articles;

  return (
    <div className={cn("space-y-8", className)}>
      {/* Row 1: large left, 2 small stacked right – heights aligned */}
      <div className="grid gap-4 lg:grid-cols-2 lg:grid-rows-2 lg:items-stretch">
        {a && (
          <div className="lg:row-span-2 lg:min-h-0">
            <NewsArticleCard article={a} size="large" featured priority className="h-full" />
          </div>
        )}
        <div className="flex flex-col gap-4 lg:row-span-2">
          {b && <NewsArticleCard article={b} size="small" />}
          {c && <NewsArticleCard article={c} size="small" />}
        </div>
      </div>

      {/* Row 2: medium left, large right */}
      <div className="grid gap-4 lg:grid-cols-2">
        {d && <NewsArticleCard article={d} size="medium" />}
        {e && <NewsArticleCard article={e} size="large" />}
      </div>

      {/* Row 3: 3 equal */}
      <div className="grid gap-4 sm:grid-cols-3">
        {f && <NewsArticleCard article={f} size="medium" />}
        {g && <NewsArticleCard article={g} size="medium" />}
        {h && <NewsArticleCard article={h} size="medium" />}
      </div>

      {/* Row 4: 3 equal */}
      <div className="grid gap-4 sm:grid-cols-3">
        {i && <NewsArticleCard article={i} size="medium" />}
        {j && <NewsArticleCard article={j} size="medium" />}
        {k && <NewsArticleCard article={k} size="medium" />}
      </div>

      {/* Pagination */}
      <div className="flex flex-wrap items-center justify-center gap-2 border-t border-white/10 pt-8">
        <button
          type="button"
          onClick={() => onPageChange?.(currentPage - 1)}
          disabled={currentPage <= 1}
          className="flex items-center gap-1 rounded-lg px-3 py-2 font-gotham text-sm text-white/80 hover:bg-white/10 disabled:opacity-50"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </button>
        <div className="flex items-center gap-1">
          {[1, 2, 3].map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange?.(p)}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-lg font-gotham text-sm",
                p === currentPage
                  ? "bg-white text-black"
                  : "text-white/80 hover:bg-white/10"
              )}
            >
              {p}
            </button>
          ))}
          <span className="px-2 font-gotham text-sm text-white/50">...</span>
          {[8, 9, 10].map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange?.(p)}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-lg font-gotham text-sm",
                p === currentPage
                  ? "bg-white text-black"
                  : "text-white/80 hover:bg-white/10"
              )}
            >
              {p}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => onPageChange?.(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="flex items-center gap-1 rounded-lg px-3 py-2 font-gotham text-sm text-white/80 hover:bg-white/10 disabled:opacity-50"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
