"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Eye, ArrowRight } from "lucide-react";
import type { NewsArticle } from "@/types/news";
import { cn } from "@/lib/utils";

interface SimilarNewsCardProps {
  article: NewsArticle;
  className?: string;
}

export function SimilarNewsCard({ article, className }: SimilarNewsCardProps) {
  const likes = article.likes ?? 0;
  const views = article.views ?? 0;

  const formatCount = (n: number) => {
    if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
    return String(n);
  };

  return (
    <article
      className={cn(
        "group flex flex-col overflow-hidden rounded-xl border border-white/10 bg-escobets-gray-card transition hover:border-escobets-yellow/50",
        className
      )}
    >
      <Link
        href={`/news/${article.slug ?? article.id}`}
        className="relative block aspect-video w-full overflow-hidden"
      >
        <Image
          src={article.imageUrl}
          alt=""
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(min-width: 1024px) 33vw, 100vw"
        />
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <Link
          href={`/news/${article.slug ?? article.id}`}
          className="font-gotham font-bold text-white transition group-hover:text-escobets-yellow"
        >
          {article.headline}
        </Link>
        {(article.category || article.tags[0]) && (
          <p className="mt-2 font-gotham text-sm text-white/60">
            {article.category ?? article.tags[0]}
          </p>
        )}
        <div className="mt-4 flex items-center gap-4">
          <span className="flex items-center gap-1.5 font-gotham text-sm text-white">
            <Heart className="h-4 w-4 shrink-0 fill-escobets-yellow text-escobets-yellow" />
            {formatCount(likes)}
          </span>
          <span className="flex items-center gap-1.5 font-gotham text-sm text-white">
            <Eye className="h-4 w-4 shrink-0" />
            {formatCount(views)}
          </span>
        </div>
        <Link
          href={`/news/${article.slug ?? article.id}`}
          className="mt-4 inline-flex w-fit items-center gap-2 rounded-lg border-2 border-white/20 bg-transparent px-4 py-2 font-gotham text-sm font-medium text-escobets-yellow transition hover:border-escobets-yellow/50 hover:bg-escobets-yellow/5"
        >
          Read More
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}
