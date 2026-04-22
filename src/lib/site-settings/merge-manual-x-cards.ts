import type { XTweetCard } from "@/types/x-tweet";

const MAX_MANUAL = 20;

function s(v: unknown, fallback = ""): string {
  return typeof v === "string" ? v : fallback;
}

function b(v: unknown): boolean {
  return typeof v === "boolean" ? v : false;
}

function nullableUrl(v: unknown): string | null {
  const t = s(v).trim();
  return t || null;
}

/**
 * Merges stored `xFeed.manualCards` into safe `XTweetCard` rows. Drops empty content.
 * Caps length for JSON payload size.
 */
export function mergeManualXCards(raw: unknown): XTweetCard[] {
  if (!Array.isArray(raw)) return [];
  const out: XTweetCard[] = [];
  for (const item of raw) {
    if (out.length >= MAX_MANUAL) break;
    if (item === null || typeof item !== "object") continue;
    const r = item as Record<string, unknown>;
    const content = s(r.content).trim();
    const hasMedia = Boolean(nullableUrl(r.mediaUrl));
    if (!content && !hasMedia) continue;
    const id = s(r.id).trim() || `manual-${out.length}`;
    out.push({
      id,
      name: s(r.name, "X").trim() || "X",
      handle: s(r.handle).trim() || "@",
      date: s(r.date, "—").trim() || "—",
      verified: b(r.verified),
      content,
      profileImageUrl: nullableUrl(r.profileImageUrl),
      mediaUrl: nullableUrl(r.mediaUrl),
      xPostUrl: s(r.xPostUrl, "https://x.com").trim() || "https://x.com",
      replies: s(r.replies, "0").trim() || "0",
      retweets: s(r.retweets, "0").trim() || "0",
      likes: s(r.likes, "0").trim() || "0",
      views: (() => {
        const v = s(r.views).trim();
        return v || null;
      })(),
    });
  }
  return out;
}
