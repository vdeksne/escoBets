"use client";

import Image from "next/image";
import {
  MessageCircle,
  Repeat2,
  Heart,
  Share2,
  MoreVertical,
  BadgeCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { XTweetCard } from "@/types/x-tweet";

export type XFeedPostCardProps = {
  tweet: XTweetCard;
  /** If set, the card is a link; otherwise a static block (e.g. admin preview). */
  href?: string;
  variant?: "solid" | "dashed";
  /** Manual posts may use arbitrary image URLs; use Next unoptimized to allow any host. */
  unoptimizedImages?: boolean;
  /** Marks layout-only preview cards for styling hooks. */
  previewMark?: boolean;
  className?: string;
};

export function XFeedPostCard({
  tweet,
  href,
  variant = "solid",
  unoptimizedImages = false,
  previewMark,
  className,
}: XFeedPostCardProps) {
  const borderClass =
    variant === "dashed"
      ? "border-dashed border-white/15"
      : "border border-white/[0.08]";

  const boxClass = cn(
    "flex w-[320px] max-w-full shrink-0 flex-col rounded-xl border bg-[#0f0f0f] p-[1.1rem] text-left shadow-[0_0_24px_rgba(0,0,0,0.45)] transition sm:p-5",
    href && "hover:border-escobets-yellow/25",
    borderClass,
    className
  );

  const body = (
    <>
      <div className="mb-3 flex shrink-0 items-start gap-3">
        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-white/[0.07]">
          {tweet.profileImageUrl ? (
            <Image
              src={tweet.profileImageUrl}
              alt=""
              width={40}
              height={40}
              className="object-cover"
              unoptimized={unoptimizedImages}
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-lg text-white/80">
              𝕏
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="truncate font-semibold text-white">{tweet.name}</p>
            {tweet.verified && (
              <BadgeCheck
                className="h-4 w-4 shrink-0 text-[#1d9bf0]"
                aria-label="Verified"
              />
            )}
          </div>
          <p className="truncate text-sm text-white/50">
            {tweet.handle} · {tweet.date}
          </p>
        </div>
        <span className="shrink-0 text-white/40" aria-hidden>
          <MoreVertical className="h-5 w-5" />
        </span>
      </div>
      <p className="mb-4 line-clamp-4 min-h-20 shrink-0 overflow-hidden text-sm leading-relaxed text-white/90">
        {tweet.content}
      </p>
      <div className="relative mb-4 h-32 w-full shrink-0 overflow-hidden rounded-lg bg-white/[0.04]">
        {tweet.mediaUrl ? (
          <Image
            src={tweet.mediaUrl}
            alt=""
            fill
            className="object-cover"
            sizes="320px"
            unoptimized={
              unoptimizedImages || tweet.mediaUrl.startsWith("http://")
            }
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-4xl font-light text-white/20">𝕏</span>
          </div>
        )}
      </div>
      <div className="mt-auto flex shrink-0 items-center gap-4 text-xs text-white/50">
        <span className="flex items-center gap-1">
          <MessageCircle className="h-3.5 w-3.5 shrink-0" /> {tweet.replies}
        </span>
        <span className="flex items-center gap-1">
          <Repeat2 className="h-3.5 w-3.5 shrink-0" /> {tweet.retweets}
        </span>
        <span className="flex items-center gap-1">
          <Heart className="h-3.5 w-3.5 shrink-0" /> {tweet.likes}
        </span>
        <span className="flex items-center gap-1" aria-hidden>
          <Share2 className="h-3.5 w-3.5 shrink-0" />
        </span>
        {tweet.views != null && (
          <span className="ml-auto text-white/40">{tweet.views} views</span>
        )}
      </div>
    </>
  );

  const dataPreview =
    previewMark === true ? ({ "data-preview": "true" } as const) : undefined;

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={boxClass}
        {...dataPreview}
      >
        {body}
      </a>
    );
  }

  return (
    <div className={boxClass} {...dataPreview}>
      {body}
    </div>
  );
}
