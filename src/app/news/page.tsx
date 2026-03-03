"use client";

import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { Newspaper } from "lucide-react";

/** Placeholder – backend: news/articles list */
const MOCK_NEWS = [
  { id: "1", title: "Weekly Betting Insights", date: "2026-02-26", excerpt: "Top picks and analysis for the coming week." },
  { id: "2", title: "Market Trends Update", date: "2026-02-25", excerpt: "Key movements and value opportunities." },
  { id: "3", title: "Season Recap", date: "2026-02-24", excerpt: "Review of recent performance and lessons learned." },
];

export default function NewsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-black">
      <Header variant="withLogo" />
      <main className="flex-1 px-4 py-8">
        <div className="mx-auto max-w-2xl">
          <h1 className="font-gotham text-2xl font-bold text-white">News</h1>
          <p className="mt-2 font-gotham text-sm text-white/60">
            Backend: Fetch articles from CMS or API.
          </p>
          <div className="mt-6 space-y-4">
            {MOCK_NEWS.map((item) => (
              <article
                key={item.id}
                className="rounded-xl border border-white/10 bg-black/40 p-4"
              >
                <div className="flex items-start gap-4">
                  <Newspaper className="h-8 w-8 shrink-0 text-escobets-yellow/60" />
                  <div>
                    <h2 className="font-gotham font-medium text-white">{item.title}</h2>
                    <p className="mt-1 font-gotham text-xs text-white/60">{item.date}</p>
                    <p className="mt-2 font-gotham text-sm text-white/80">{item.excerpt}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
