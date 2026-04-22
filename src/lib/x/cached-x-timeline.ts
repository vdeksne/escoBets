import { unstable_cache } from "next/cache";
import { fetchXUserTimeline } from "./fetch-x-timeline";
import type { XTweetCard } from "@/types/x-tweet";

function normalizeXHandle(raw: string): string {
  const t = raw.trim();
  if (!t) return "";
  return t.startsWith("@") ? t.slice(1) : t;
}

/** Cached user timeline for the home page (5 min). Handle comes from site settings. */
export async function getCachedXTimelineByHandle(handle: string): Promise<XTweetCard[]> {
  const h = normalizeXHandle(handle);
  if (!h) {
    return [];
  }
  return unstable_cache(
    () => fetchXUserTimeline(h),
    ["x-user-timeline", h],
    { revalidate: 300 }
  )();
}
