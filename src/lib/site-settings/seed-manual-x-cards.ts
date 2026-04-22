import type { XTweetCard } from "@/types/x-tweet";

const PROFILE = "https://x.com/DeksneViktorija";

/**
 * Sensible default manual carousel cards (used when `xFeed.manualCards` is absent from stored
 * settings). On-brand for EscoBets: picks, transparency, Telegram, responsible tone.
 */
export const SEED_MANUAL_X_CARDS: XTweetCard[] = [
  {
    id: "seed-esco-1",
    name: "EscoBets",
    handle: "@DeksneViktorija",
    date: "Apr 2026",
    verified: false,
    content:
      "Elite football and select sports picks with the numbers behind every call. No noise — just high-confidence angles, clear reasoning, and a team that tracks real P&L. #EscoBets #SportsBetting",
    profileImageUrl: null,
    mediaUrl: null,
    xPostUrl: PROFILE,
    replies: "12",
    retweets: "24",
    likes: "186",
    views: "1.2k",
  },
  {
    id: "seed-esco-2",
    name: "EscoBets",
    handle: "@DeksneViktorija",
    date: "Apr 2026",
    verified: false,
    content:
      "Every pick matters when you can see the full record. We publish profit & loss in the open so members know what edge looks like over time — not a highlight reel. Transparency first.",
    profileImageUrl: null,
    mediaUrl: null,
    xPostUrl: PROFILE,
    replies: "8",
    retweets: "19",
    likes: "142",
    views: "980",
  },
  {
    id: "seed-esco-3",
    name: "EscoBets",
    handle: "@DeksneViktorija",
    date: "Apr 2026",
    verified: false,
    content:
      "Picks go out in our private Telegram: fast updates, bet-ready stakes context, and the discipline to bet smart. New here? Check the site for plans and what’s included. 18+ only. Bet responsibly.",
    profileImageUrl: null,
    mediaUrl: null,
    xPostUrl: PROFILE,
    replies: "15",
    retweets: "31",
    likes: "201",
    views: "1.4k",
  },
  {
    id: "seed-esco-4",
    name: "EscoBets",
    handle: "@DeksneViktorija",
    date: "Apr 2026",
    verified: false,
    content:
      "We focus on markets where we have a repeatable process — not every fixture, every day. Quality over volume. If that sounds like your kind of edge, the link in bio has everything you need to get started.",
    profileImageUrl: null,
    mediaUrl: null,
    xPostUrl: PROFILE,
    replies: "6",
    retweets: "14",
    likes: "97",
    views: "720",
  },
];
