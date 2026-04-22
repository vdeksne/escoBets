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
  /**
   * `bento` = editorial layout (page 1 home). `grid` = uniform cards, easier to scan (search, page 2+, or few items).
   */
  layout?: "bento" | "grid";
}

function BentoLayout({ articles }: { articles: NewsArticle[] }) {
  const [a, b, c, d, e, f, g, h, i, j, k] = articles;

  return (
    <div className="space-y-8">
      <div className="grid gap-4 lg:grid-cols-2 lg:grid-rows-2 lg:items-stretch">
        {a && (
          <div className="lg:row-span-2 lg:min-h-0">
            <NewsArticleCard article={a} size="large" featured priority className="h-full min-h-[280px] lg:min-h-0" />
          </div>
        )}
        <div className="flex flex-col gap-4 lg:row-span-2">
          {b && <NewsArticleCard article={b} size="small" />}
          {c && <NewsArticleCard article={c} size="small" />}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {d && <NewsArticleCard article={d} size="medium" />}
        {e && <NewsArticleCard article={e} size="large" />}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {f && <NewsArticleCard article={f} size="medium" />}
        {g && <NewsArticleCard article={g} size="medium" />}
        {h && <NewsArticleCard article={h} size="medium" />}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {i && <NewsArticleCard article={i} size="medium" />}
        {j && <NewsArticleCard article={j} size="medium" />}
        {k && <NewsArticleCard article={k} size="medium" />}
      </div>
    </div>
  );
}

function GridLayout({ articles }: { articles: NewsArticle[] }) {
  return (
    <ul className="grid list-none gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {articles.map((article) => (
        <li key={article.id}>
          <NewsArticleCard article={article} size="medium" />
        </li>
      ))}
    </ul>
  );
}

function buildPageList(current: number, total: number): (number | "gap")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const s = new Set(
    [1, total, current, current - 1, current + 1].filter((n) => typeof n === "number" && n >= 1 && n <= total)
  );
  const sorted = [...s].sort((a, b) => a - b);
  const out: (number | "gap")[] = [];
  for (let i = 0; i < sorted.length; i++) {
    const p = sorted[i]!;
    if (i > 0 && p - sorted[i - 1]! > 1) {
      out.push("gap");
    }
    out.push(p);
  }
  return out;
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}) {
  if (totalPages <= 1) return null;

  const visible = buildPageList(currentPage, totalPages);

  return (
    <nav
      className="flex flex-col items-center gap-4 border-t border-white/10 pt-10"
      aria-label="Pagination"
    >
      <p className="font-gotham text-xs text-white/45">
        Page {currentPage} of {totalPages}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="inline-flex h-10 items-center gap-1 rounded-xl border border-white/15 bg-white/5 px-3 font-gotham text-sm text-white/90 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Previous</span>
        </button>
        <div className="flex flex-wrap items-center justify-center gap-1">
          {visible.map((item, i) =>
            item === "gap" ? (
              <span key={`e-${i}`} className="px-1 font-gotham text-sm text-white/30">
                …
              </span>
            ) : (
              <button
                key={item}
                type="button"
                onClick={() => onPageChange(item)}
                className={cn(
                  "flex h-10 min-w-10 items-center justify-center rounded-xl font-gotham text-sm transition",
                  item === currentPage
                    ? "bg-escobets-yellow text-black"
                    : "text-white/80 hover:bg-white/10"
                )}
              >
                {item}
              </button>
            )
          )}
        </div>
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="inline-flex h-10 items-center gap-1 rounded-xl border border-white/15 bg-white/5 px-3 font-gotham text-sm text-white/90 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </nav>
  );
}

/** Grid layout: bento (editorial) or uniform grid for search / later pages. */
export function NewsGrid({
  articles,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  className,
  layout = "bento",
}: NewsGridProps) {
  if (articles.length === 0) {
    return (
      <div
        className={cn(
          "rounded-2xl border border-dashed border-white/15 bg-white/[0.02] py-20 text-center",
          className
        )}
      >
        <p className="font-gotham text-sm text-white/50">No articles match your filters yet.</p>
        <p className="mt-1 font-gotham text-xs text-white/35">Try another search or check back later.</p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-8", className)}>
      {layout === "grid" ? <GridLayout articles={articles} /> : <BentoLayout articles={articles} />}
      {onPageChange ? (
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
      ) : null}
    </div>
  );
}
