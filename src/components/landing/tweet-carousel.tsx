"use client";

import { useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Repeat2,
  Heart,
  Share2,
  BarChart2,
  MoreVertical,
  BadgeCheck,
} from "lucide-react";

const tweets = [
  {
    name: "Elon Musk",
    handle: "@elonmusk",
    date: "May 29",
    verified: true,
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam non velit tempor, convallis ipsum ut, eleifend est. Cras faucibus pharetra ante. #hashtag #hashtag",
    image: null,
    replies: "13.1k",
    retweets: "11.2k",
    likes: "36.3k",
    views: "97.4k",
  },
  {
    name: "Sarah Wilson",
    handle: "@sarahw",
    date: "May 19",
    verified: false,
    content:
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    image: null,
    replies: "12",
    retweets: "5",
    likes: "28",
    views: null,
  },
  {
    name: "Alex Chen",
    handle: "@alexchen",
    date: "May 18",
    verified: false,
    content:
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    image: null,
    replies: "12",
    retweets: "5",
    likes: "28",
    views: null,
  },
  {
    name: "Jordan Lee",
    handle: "@jordanlee",
    date: "May 15",
    verified: true,
    content:
      "Excited to announce our latest partnership! Big things coming soon. Stay tuned for updates. #EscoBets #SportsBetting",
    image: null,
    replies: "2.4k",
    retweets: "1.8k",
    likes: "8.5k",
    views: "45.2k",
  },
  {
    name: "Maria Santos",
    handle: "@mariasantos",
    date: "May 12",
    verified: false,
    content:
      "Just placed my first bet with EscoBets. The interface is so smooth and the odds are competitive. Highly recommend!",
    image: null,
    replies: "89",
    retweets: "34",
    likes: "412",
    views: null,
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
              className="min-w-[300px] max-w-[340px] shrink-0 rounded-xl border border-white/10 bg-[#1a1a1a] p-4 shadow-[0_0_20px_rgba(255,255,255,0.03)]"
            >
              <div className="mb-3 flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-lg text-white/80">
                  𝕏
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="truncate font-semibold text-white">
                      {tweet.name}
                    </p>
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
                <button
                  type="button"
                  className="shrink-0 rounded p-1 text-white/50 hover:text-white/80"
                  aria-label="More options"
                >
                  <MoreVertical className="h-5 w-5" />
                </button>
              </div>
              <p className="mb-4 text-sm leading-relaxed text-white/90">
                {tweet.content}
              </p>
              <div className="mb-4 flex h-32 items-center justify-center rounded-lg bg-white/5">
                <span className="text-4xl font-light text-white/20">𝕏</span>
              </div>
              <div className="flex items-center gap-5 text-sm text-white/50">
                <span className="flex items-center gap-1.5">
                  <MessageCircle className="h-4 w-4" /> {tweet.replies}
                </span>
                <span className="flex items-center gap-1.5">
                  <Repeat2 className="h-4 w-4" /> {tweet.retweets}
                </span>
                <span className="flex items-center gap-1.5">
                  <Heart className="h-4 w-4" /> {tweet.likes}
                </span>
                {tweet.views && (
                  <span className="flex items-center gap-1.5">
                    <BarChart2 className="h-4 w-4" /> {tweet.views}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <Share2 className="h-4 w-4" />
                </span>
              </div>
            </article>
          ))}
        </div>
        <button
          type="button"
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-[#1a1a1a] p-3 text-white shadow-lg hover:bg-white/10"
          aria-label="Previous"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-[#1a1a1a] p-3 text-white shadow-lg hover:bg-white/10"
          aria-label="Next"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </section>
  );
}
