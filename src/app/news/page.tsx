"use client";

import * as React from "react";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { NewsGrid } from "@/components/news/news-grid";
import { MOCK_NEWS_ARTICLES } from "@/lib/news/mock-data";

/**
 * News and predictions page.
 * Data: Replace MOCK_NEWS_ARTICLES with API/CMS (e.g. useSWR('/api/news', fetcher)).
 */
export default function NewsPage() {
  const [page, setPage] = React.useState(1);

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <Header variant="withLogo" />

      <main className="flex-1 px-4 py-8">
        <div className="mx-auto max-w-6xl">
          <h1 className="font-gotham text-3xl font-bold uppercase tracking-tight text-white md:text-4xl">
            News and predictions
          </h1>

          <NewsGrid
            articles={MOCK_NEWS_ARTICLES}
            currentPage={page}
            totalPages={10}
            onPageChange={setPage}
            className="mt-8"
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
