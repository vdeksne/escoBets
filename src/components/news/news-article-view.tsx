"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Eye, MessageCircle, ChevronDown, ArrowRight } from "lucide-react";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { SimilarNewsCard } from "./similar-news-card";
import type { NewsArticle } from "@/types/news";

interface NewsArticleViewProps {
  article: NewsArticle;
  similarArticles: NewsArticle[];
}

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

export function NewsArticleView({ article, similarArticles }: NewsArticleViewProps) {
  const [showFullArticle, setShowFullArticle] = useState(false);
  const likes = article.likes ?? 0;
  const views = article.views ?? 0;
  const comments = article.comments ?? 0;

  const body = article.body ?? [];
  const visibleSectionCount = showFullArticle
    ? body.length
    : Math.max(1, Math.ceil(body.length / 3));
  const visibleSections = body.slice(0, visibleSectionCount);

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <Header variant="withLogo" />

      {/* Hero */}
      <section className="relative h-[50vh] min-h-[300px] w-full overflow-hidden md:h-[60vh]">
        <Image
          src={article.imageUrl}
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"
          aria-hidden
        />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <h1 className="font-gotham text-3xl font-bold text-white md:text-4xl lg:text-5xl">
            {article.headline}
          </h1>
        </div>
      </section>

      {/* Main content - two columns */}
      <main className="flex-1 px-4 py-8 md:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
            {/* Left: Article body */}
            <article className="min-w-0">
              {body.length > 0 ? (
                <div className="space-y-8">
                  {visibleSections.map((section, i) => (
                    <section key={i}>
                      <h2 className="font-gotham text-xl font-bold text-white md:text-2xl">
                        {section.heading}
                      </h2>
                      <p className="mt-3 font-gotham text-white/90 leading-relaxed">
                        {section.content}
                      </p>
                    </section>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {article.excerpt && (
                    <p className="font-gotham text-lg text-white/90 leading-relaxed">
                      {article.excerpt}
                    </p>
                  )}
                  <p className="font-gotham text-white/80">
                    Full article content would be loaded from the backend.
                  </p>
                </div>
              )}

              {body.length > 0 && !showFullArticle && (
                <div className="mt-10 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setShowFullArticle(true)}
                    className="inline-flex items-center gap-2 rounded-lg border-2 border-white/20 bg-transparent px-6 py-3 font-gotham font-medium text-escobets-yellow transition hover:border-escobets-yellow/50 hover:bg-escobets-yellow/5"
                  >
                    Read Full Blog
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </div>
              )}
            </article>

            {/* Right: Sidebar */}
            <aside className="space-y-6 lg:sticky lg:top-8 lg:self-start">
              {/* Interaction metrics */}
              <div className="flex flex-wrap items-center gap-6 rounded-xl border border-white/10 bg-escobets-gray-card p-4">
                <span className="flex items-center gap-2 font-gotham text-sm text-white">
                  <Heart className="h-5 w-5 shrink-0 fill-escobets-yellow text-escobets-yellow" />
                  {formatCount(likes)}
                </span>
                <span className="flex items-center gap-2 font-gotham text-sm text-white">
                  <Eye className="h-5 w-5 shrink-0" />
                  {formatCount(views)}
                </span>
                <span className="flex items-center gap-2 font-gotham text-sm text-white">
                  <MessageCircle className="h-5 w-5 shrink-0" />
                  {comments}
                </span>
              </div>

              {/* Metadata */}
              <div className="rounded-xl border border-white/10 bg-escobets-gray-card p-4">
                <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-3 font-gotham text-sm">
                  {article.date && (
                    <>
                      <dt className="font-bold text-white">Publication Date</dt>
                      <dd className="text-white/90">{article.date}</dd>
                    </>
                  )}
                  {article.category && (
                    <>
                      <dt className="font-bold text-white">Category</dt>
                      <dd className="text-white/90">{article.category}</dd>
                    </>
                  )}
                  {article.readingTime && (
                    <>
                      <dt className="font-bold text-white">Reading Time</dt>
                      <dd className="text-white/90">{article.readingTime}</dd>
                    </>
                  )}
                  {article.author && (
                    <>
                      <dt className="font-bold text-white">Author Name</dt>
                      <dd className="text-white/90">{article.author}</dd>
                    </>
                  )}
                </dl>
              </div>

              {/* Table of Contents */}
              {article.tableOfContents && article.tableOfContents.length > 0 && (
                <div className="rounded-xl border border-white/10 bg-escobets-gray-card p-4">
                  <h3 className="font-gotham font-bold text-white">Table of Contents</h3>
                  <ul className="mt-3 space-y-2">
                    {article.tableOfContents.map((item, i) => (
                      <li
                        key={i}
                        className="font-gotham text-sm text-white before:mr-2 before:content-['•']"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </aside>
          </div>

          {/* Similar News */}
          {similarArticles.length > 0 && (
            <section className="mt-16">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="font-gotham text-2xl font-bold text-white">Similar News</h2>
                <Link
                  href="/news"
                  className="inline-flex w-fit items-center gap-2 rounded-lg border-2 border-white/20 bg-transparent px-4 py-2 font-gotham text-sm font-medium text-escobets-yellow transition hover:border-escobets-yellow/50 hover:bg-escobets-yellow/5"
                >
                  View All News
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {similarArticles.map((a) => (
                  <SimilarNewsCard key={a.id} article={a} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
