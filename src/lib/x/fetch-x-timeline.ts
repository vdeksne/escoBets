import { formatEngagementCount } from "@/lib/news/format-count";
import type { XTweetCard } from "@/types/x-tweet";

const API = "https://api.twitter.com/2";

type TwitterUser = {
  id: string;
  name?: string;
  username?: string;
  verified?: boolean;
  profile_image_url?: string;
};

type TwitterTweet = {
  id: string;
  text?: string;
  created_at?: string;
  author_id?: string;
  attachments?: { media_keys?: string[] };
  public_metrics?: {
    retweet_count?: number;
    reply_count?: number;
    like_count?: number;
    quote_count?: number;
    impression_count?: number;
  };
};

type TwitterMedia = {
  media_key?: string;
  type?: string;
  url?: string;
  preview_image_url?: string;
};

type TimelineResponse = {
  data?: TwitterTweet[];
  includes?: {
    media?: TwitterMedia[];
    users?: TwitterUser[];
  };
  errors?: { title?: string; detail?: string }[];
};

type UserByUsernameResponse = {
  data?: TwitterUser;
  errors?: { title?: string; detail?: string }[];
  /** Some error responses put a single problem object at the top level. */
  title?: string;
};

function isCreditsDepletedBody(body: unknown): boolean {
  if (body === null || typeof body !== "object") return false;
  const b = body as Record<string, unknown>;
  if (b.title === "CreditsDepleted") return true;
  const errs = b.errors;
  if (Array.isArray(errs)) {
    return errs.some(
      (e) =>
        e &&
        typeof e === "object" &&
        (e as { title?: string }).title === "CreditsDepleted"
    );
  }
  return false;
}

/**
 * X returns HTTP 402 + CreditsDepleted when the developer account has no API credits.
 * The home page still works (manual/seed cards). Do not use console.error — React/Next
 * devtools (installHook) surface that as a red “server error” even though this is expected.
 */
function logXApiDevFailure(
  context: string,
  status: number,
  handleOrId: string,
  body: unknown
) {
  if (process.env.NODE_ENV !== "development") return;
  if (status === 402 || isCreditsDepletedBody(body)) {
    return;
  }
  console.error(`[X API] ${context}`, status, handleOrId, body);
}

function normalizeHandle(raw: string): string {
  const t = raw.trim();
  if (!t) return "";
  return t.startsWith("@") ? t.slice(1) : t;
}

function formatTweetDate(iso: string | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-GB", { month: "short", day: "numeric" });
}

/**
 * Fetches recent posts for a public X user using Twitter API v2 (app-only bearer).
 * Requires `X_BEARER_TOKEN` (Developer Portal → your app → Keys and tokens).
 * Free tier: ensure the project has access to v2 read endpoints for user lookup + timeline.
 */
export async function fetchXUserTimeline(rawHandle: string): Promise<XTweetCard[]> {
  try {
    return await fetchXUserTimelineInner(rawHandle);
  } catch {
    return [];
  }
}

async function fetchXUserTimelineInner(rawHandle: string): Promise<XTweetCard[]> {
  const handle = normalizeHandle(rawHandle);
  if (!handle) {
    return [];
  }

  const bearer = process.env.X_BEARER_TOKEN;
  if (!bearer) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[X] X_BEARER_TOKEN is unset; home timeline will be empty. See .env.local.example."
      );
    }
    return [];
  }

  const headers = { Authorization: `Bearer ${bearer}` } as const;

  const userUrl = new URL(`${API}/users/by/username/${encodeURIComponent(handle)}`);
  userUrl.searchParams.set("user.fields", "name,username,verified,profile_image_url");

  const userRes = await fetch(userUrl.toString(), { headers, next: { revalidate: 300 } });
  const userJson = (await userRes.json()) as UserByUsernameResponse;
  if (!userRes.ok || !userJson.data?.id) {
    logXApiDevFailure("user lookup failed", userRes.status, handle, userJson);
    return [];
  }

  const user = userJson.data;
  const userId = user.id;

  const twUrl = new URL(`${API}/users/${userId}/tweets`);
  twUrl.searchParams.set("max_results", "10");
  twUrl.searchParams.set(
    "tweet.fields",
    "created_at,public_metrics,attachments,author_id"
  );
  twUrl.searchParams.set("expansions", "attachments.media_keys,author_id");
  twUrl.searchParams.set("media.fields", "type,url,preview_image_url,variants");
  twUrl.searchParams.append("exclude", "retweets");

  const twRes = await fetch(twUrl.toString(), { headers, next: { revalidate: 300 } });
  const twJson = (await twRes.json()) as TimelineResponse;
  if (!twRes.ok) {
    logXApiDevFailure("user timeline failed", twRes.status, userId, twJson);
    return [];
  }
  if (!twJson.data?.length) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[X API] no tweets in response (empty timeline or all excluded)",
        handle
      );
    }
    return [];
  }

  const mediaByKey = new Map<string, TwitterMedia>();
  for (const m of twJson.includes?.media ?? []) {
    if (m.media_key) {
      mediaByKey.set(m.media_key, m);
    }
  }

  const name = user.name ?? handle;
  const username = user.username ?? handle;
  const verified = Boolean(user.verified);
  const profileImageUrl = user.profile_image_url
    ? user.profile_image_url.replace("_normal", "_bigger")
    : null;

  const cards: XTweetCard[] = [];
  for (const t of twJson.data) {
    if (!t.id) continue;
    const metrics = t.public_metrics;
    const impressions = metrics?.impression_count;
    const views =
      typeof impressions === "number" && impressions > 0
        ? formatEngagementCount(impressions)
        : null;

    let mediaUrl: string | null = null;
    const keys = t.attachments?.media_keys;
    if (keys?.length) {
      for (const k of keys) {
        const m = mediaByKey.get(k);
        if (m?.type === "photo" && m.url) {
          mediaUrl = m.url;
          break;
        }
        if (
          (m?.type === "video" || m?.type === "animated_gif") &&
          m.preview_image_url
        ) {
          mediaUrl = m.preview_image_url;
          break;
        }
      }
    }

    const xPostUrl = `https://x.com/${encodeURIComponent(username)}/status/${encodeURIComponent(t.id)}`;

    cards.push({
      id: t.id,
      name,
      handle: `@${username}`,
      date: formatTweetDate(t.created_at),
      verified,
      content: t.text?.trim() ?? "",
      profileImageUrl,
      mediaUrl,
      xPostUrl,
      replies: formatEngagementCount(metrics?.reply_count ?? 0),
      retweets: formatEngagementCount(metrics?.retweet_count ?? 0),
      likes: formatEngagementCount(metrics?.like_count ?? 0),
      views,
    });
  }

  return cards;
}
