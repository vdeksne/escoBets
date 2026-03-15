"use client";

import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import type { NewsArticle } from "@/types/news";
import { cn } from "@/lib/utils";

interface NewsArticleCardProps {
  article: NewsArticle;
  size?: "large" | "medium" | "small";
  /** When true, image fills card and text overlays on top (like climate/featured block) */
  featured?: boolean;
  /** When true, image gets priority loading (for LCP / above-the-fold images) */
  priority?: boolean;
  className?: string;
}

export function NewsArticleCard({
  article,
  size = "medium",
  featured = false,
  priority = false,
  className,
}: NewsArticleCardProps) {
  if (featured) {
    return (
      <Link
        href={`/news/${article.slug ?? article.id}`}
        className={cn(
          "group relative flex overflow-hidden rounded-xl border border-white/10 transition-colors hover:border-white/20",
          className
        )}
      >
        <Image
          src={article.imageUrl}
          alt=""
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(min-width: 1024px) 50vw, 100vw"
          priority={priority}
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"
          aria-hidden
        />
        <div className="relative flex h-full flex-col justify-end p-6">
          <span className="absolute right-6 top-6 text-white/60 group-hover:text-white" aria-hidden>
            <ExternalLink className="h-5 w-5" />
          </span>
          <p className="font-gotham text-sm text-escobets-yellow">{article.date}</p>
          <h3 className="mt-2 font-gotham text-xl font-bold text-white group-hover:text-escobets-yellow md:text-2xl">
            {article.headline}
          </h3>
          {article.excerpt && (
            <p className="mt-2 line-clamp-2 font-gotham text-sm text-white/80">
              {article.excerpt}
            </p>
          )}
          <div className="mt-4 flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/30 bg-white/5 px-3 py-1 font-gotham text-xs text-white"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/news/${article.slug ?? article.id}`}
      className={cn(
        "group flex flex-col overflow-hidden rounded-xl border border-white/10 bg-black/40 transition-colors hover:border-white/20",
        className
      )}
    >
      <div
        className={cn(
          "relative w-full overflow-hidden bg-white/5",
          size === "large" && "aspect-[4/3]",
          size === "medium" && "aspect-[4/3]",
          size === "small" && "aspect-video"
        )}
      >
        <Image
          src={article.imageUrl}
          alt=""
          fill
          className="object-cover transition-transform group-hover:scale-105"
          priority={priority}
          sizes={
            size === "large"
              ? "(min-width: 1024px) 50vw, 100vw"
              : size === "medium"
              ? "(min-width: 1024px) 33vw, 100vw"
              : "(min-width: 1024px) 25vw, 100vw"
          }
        />
      </div>
      <div className="relative flex flex-1 flex-col p-4">
        <span className="absolute right-4 top-4 text-white/60 group-hover:text-white" aria-hidden>
          <ExternalLink className="h-4 w-4" />
        </span>
        <p className="font-gotham text-xs text-white/60">{article.date}</p>
        <h3 className="mt-2 font-gotham font-semibold text-white group-hover:text-escobets-yellow">
          {article.headline}
        </h3>
        {article.excerpt && (
          <p
            className={cn(
              "mt-2 font-gotham text-sm text-white/70 line-clamp-2",
              size === "large" && "line-clamp-3",
              size === "small" && "line-clamp-2"
            )}
          >
            {article.excerpt}
          </p>
        )}
        <div className="mt-4 flex flex-wrap gap-2">
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/30 bg-white/5 px-3 py-1 font-gotham text-xs text-white"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
