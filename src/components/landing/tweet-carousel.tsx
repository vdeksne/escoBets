"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight, MessageCircle, Repeat2, Heart, Share2 } from "lucide-react";

const tweets = [
  {
    name: "Elon Musk",
    handle: "@elonmusk",
    date: "May 20",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    name: "Sarah Wilson",
    handle: "@sarahw",
    date: "May 19",
    content:
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
  {
    name: "Alex Chen",
    handle: "@alexchen",
    date: "May 18",
    content:
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  },
];

export function TweetCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = 320;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <section className="px-4 py-12">
      <div className="container relative mx-auto">
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scroll-smooth py-4 scrollbar-hide [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {tweets.map((tweet, i) => (
            <article
              key={i}
              className="min-w-[300px] max-w-[340px] shrink-0 rounded-lg border border-white/10 bg-escobets-gray-card p-4"
            >
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded bg-white/10 text-white">
                  𝕏
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate font-semibold text-white">{tweet.name}</p>
                  <p className="truncate text-xs text-white/60">
                    {tweet.handle} · {tweet.date}
                  </p>
                </div>
              </div>
              <p className="mb-4 text-sm text-white/90">{tweet.content}</p>
              <div className="mb-4 h-32 rounded bg-white/5 flex items-center justify-center text-white/40 text-xs">
                Image
              </div>
              <div className="flex gap-4 text-white/50">
                <span className="flex items-center gap-1">
                  <MessageCircle className="h-4 w-4" /> 12
                </span>
                <span className="flex items-center gap-1">
                  <Repeat2 className="h-4 w-4" /> 5
                </span>
                <span className="flex items-center gap-1">
                  <Heart className="h-4 w-4" /> 28
                </span>
                <span className="flex items-center gap-1">
                  <Share2 className="h-4 w-4" />
                </span>
              </div>
            </article>
          ))}
        </div>
        <button
          type="button"
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-black/80 p-2 text-white hover:bg-white/10"
          aria-label="Previous"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-black/80 p-2 text-white hover:bg-white/10"
          aria-label="Next"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </section>
  );
}
