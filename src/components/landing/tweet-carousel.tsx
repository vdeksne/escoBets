"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { XFeedPostCard } from "@/components/landing/x-feed-post-card";
import { DEFAULT_SITE_SETTINGS } from "@/lib/site-settings/defaults";
import type { SiteSettingsPayload } from "@/types/site-settings";
import type { XTweetCard } from "@/types/x-tweet";

/** Shown only when no handle is configured and the API has nothing to show. */
const demoTweets: XTweetCard[] = [
  {
    id: "demo-1",
    name: "Elon Musk",
    handle: "@elonmusk",
    date: "May 29",
    verified: true,
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam non velit tempor, convallis ipsum ut, eleifend est.",
    profileImageUrl: null,
    mediaUrl: null,
    xPostUrl: "https://x.com",
    replies: "13.1k",
    retweets: "11.2k",
    likes: "36.3k",
    views: "97.4k",
  },
  {
    id: "demo-2",
    name: "Sample",
    handle: "@sample",
    date: "May 19",
    verified: false,
    content:
      "Configure an X handle under Control centre → Main page and add X_BEARER_TOKEN to show live posts.",
    profileImageUrl: null,
    mediaUrl: null,
    xPostUrl: "https://x.com",
    replies: "12",
    retweets: "5",
    likes: "28",
    views: null,
  },
];

/** When a handle is set but the X API returns nothing and no manual cards — layout preview. */
function previewTweetsForHandle(xHandle: string): XTweetCard[] {
  const base = `https://x.com/${encodeURIComponent(xHandle)}`;
  return [
    {
      id: "x-preview-1",
      name: "Feed preview",
      handle: `@${xHandle}`,
      date: "-",
      verified: false,
      content:
        "Layout preview. Set X_BEARER_TOKEN in the server environment (see .env.local.example), restart the server, and wait a few minutes for cache - real posts from this account will show here.",
      profileImageUrl: null,
      mediaUrl: null,
      xPostUrl: base,
      replies: "-",
      retweets: "-",
      likes: "-",
      views: null,
    },
    {
      id: "x-preview-2",
      name: "Feed preview",
      handle: `@${xHandle}`,
      date: "-",
      verified: false,
      content:
        "If the token is set but you still see this, check the terminal in dev: X often returns 403/402. Or add hand-picked posts in Control centre → Main page (manual X cards).",
      profileImageUrl: null,
      mediaUrl: null,
      xPostUrl: base,
      replies: "-",
      retweets: "-",
      likes: "-",
      views: null,
    },
  ];
}

type TweetCarouselProps = {
  xFeed?: SiteSettingsPayload["xFeed"];
  /** From server: X API v2 timeline (empty if token missing, credits, or error). */
  apiTweets?: XTweetCard[];
};

function normalizeHandle(raw: string): string {
  const t = raw.trim();
  if (!t) return "";
  return t.startsWith("@") ? t.slice(1) : t;
}

export function TweetCarousel({
  xFeed = DEFAULT_SITE_SETTINGS.xFeed,
  apiTweets = [],
}: TweetCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const handle = normalizeHandle(xFeed.handle);
  const manual = xFeed.manualCards ?? [];
  const fromApi = apiTweets.length > 0;
  const fromManual = !fromApi && manual.length > 0;
  const displayTweets: XTweetCard[] = fromApi
    ? apiTweets
    : fromManual
      ? manual
      : !handle
        ? demoTweets
        : previewTweetsForHandle(handle);
  const isPreviewOnly = !fromApi && !fromManual && Boolean(handle);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = 352;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  const profileXUrl = handle ? `https://x.com/${encodeURIComponent(handle)}` : null;

  return (
    <section className="px-4 py-14 sm:py-16">
      <div className="container relative mx-auto max-w-6xl">
        {xFeed.comingSoon && !fromApi && !fromManual && (
          <p className="mb-5 text-center font-gotham text-sm text-white/45 motion-safe:animate-admin-in">
            X feed: posts from{" "}
            {handle ? (
              <span className="text-escobets-yellow/90">@{handle}</span>
            ) : (
              "your linked account"
            )}{" "}
            will load here when the integration is fully enabled.
          </p>
        )}

        {!fromApi && !fromManual && handle && !xFeed.comingSoon && (
          <p className="mb-5 text-center font-gotham text-sm text-white/50">
            Live posts could not be loaded. Set{" "}
            <code className="text-escobets-yellow/80">X_BEARER_TOKEN</code> in the
            server environment (X Developer Portal), add hand-picked posts in the
            control centre, or{" "}
            {profileXUrl ? (
              <Link
                href={profileXUrl}
                className="text-escobets-yellow/90 underline decoration-escobets-yellow/40 underline-offset-2 hover:text-escobets-yellow"
                target="_blank"
                rel="noopener noreferrer"
              >
                open the profile on X
              </Link>
            ) : (
              "open the profile on X"
            )}
            . Handle in use: <span className="text-escobets-yellow/90">@{handle}</span>
          </p>
        )}

        {fromApi && handle && !xFeed.comingSoon && (
          <p className="mb-5 text-center font-gotham text-sm text-white/45">
            Latest from{" "}
            <Link
              href={profileXUrl!}
              className="text-escobets-yellow/90 underline decoration-escobets-yellow/40 underline-offset-2 hover:text-escobets-yellow"
              target="_blank"
              rel="noopener noreferrer"
            >
              @{handle}
            </Link>
            {" · "}
            <Link
              href={profileXUrl!}
              className="text-white/40 hover:text-white/60"
              target="_blank"
              rel="noopener noreferrer"
            >
              View on X
            </Link>
          </p>
        )}

        <div
          ref={scrollRef}
          className="overflow-x-auto scroll-smooth py-4 scrollbar-hide [scrollbar-width:none] sm:py-5 [&::-webkit-scrollbar]:hidden [-webkit-overflow-scrolling:touch] pl-12 pr-12 sm:pl-16 sm:pr-16"
        >
          <div
            className="mx-auto flex w-max min-w-0 max-w-full flex-nowrap justify-start gap-5 sm:gap-6 md:gap-7"
          >
            {displayTweets.map((tweet) => (
              <XFeedPostCard
                key={tweet.id}
                tweet={tweet}
                href={tweet.xPostUrl}
                variant={isPreviewOnly ? "dashed" : "solid"}
                unoptimizedImages={fromManual}
                previewMark={isPreviewOnly}
              />
            ))}
          </div>
        </div>
        {displayTweets.length > 0 && (
          <>
            <button
              type="button"
              onClick={() => scroll("left")}
              className="pointer-events-auto absolute left-1 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/10 bg-[#111] p-2.5 text-white shadow-lg sm:left-2 sm:p-3 hover:bg-zinc-800/80"
              aria-label="Previous"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              className="pointer-events-auto absolute right-1 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/10 bg-[#111] p-2.5 text-white shadow-lg sm:right-2 sm:p-3 hover:bg-zinc-800/80"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>
    </section>
  );
}
