import { requireAdminUser } from "@/lib/auth/require-admin";
import { isDemoMode } from "@/lib/demo-mode";
import { getDemoAdminNewsList } from "@/lib/news/demo-admin-news-store";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import type { NewsArticle } from "@/types/news";

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((v): v is string => typeof v === "string");
}

function normalizeNewsRow(row: Record<string, unknown>): NewsArticle | null {
  const id = row.id;
  const headline = row.headline;
  const imageUrl = row.imageUrl;
  const date = row.date;
  if (
    typeof id !== "string" ||
    typeof headline !== "string" ||
    typeof imageUrl !== "string" ||
    typeof date !== "string"
  ) {
    return null;
  }
  return {
    id,
    slug: typeof row.slug === "string" ? row.slug : undefined,
    imageUrl,
    date,
    headline,
    excerpt: typeof row.excerpt === "string" ? row.excerpt : undefined,
    tags: toStringArray(row.tags),
    body: undefined,
    tableOfContents: toStringArray(row.tableOfContents),
    author: typeof row.author === "string" ? row.author : undefined,
    category: typeof row.category === "string" ? row.category : undefined,
    readingTime: typeof row.readingTime === "string" ? row.readingTime : undefined,
    likes: typeof row.likes === "number" ? row.likes : undefined,
    views: typeof row.views === "number" ? row.views : undefined,
    comments: typeof row.comments === "number" ? row.comments : undefined,
    isDraft: row.is_draft === true,
  };
}

export type FetchAdminNewsListResult =
  | { ok: true; items: NewsArticle[] }
  | { ok: false; kind: "unauthorized" | "forbidden" | "config" | "db"; message?: string };

/** All news rows for admin editor (includes drafts). Server-only. */
export async function fetchAdminNewsListForEditor(): Promise<FetchAdminNewsListResult> {
  const adminGate = await requireAdminUser();
  if (adminGate.error) {
    return adminGate.error.status === 403
      ? { ok: false, kind: "forbidden" }
      : { ok: false, kind: "unauthorized" };
  }

  if (isDemoMode()) {
    return { ok: true, items: getDemoAdminNewsList() };
  }

  const service = createServiceRoleClient();
  if (!service) {
    return { ok: false, kind: "config", message: "Missing service role configuration." };
  }

  const { data, error } = await service.from("news").select("*").order("id", { ascending: false });
  if (error) {
    return { ok: false, kind: "db", message: error.message };
  }

  const items: NewsArticle[] = [];
  for (const r of data ?? []) {
    if (r && typeof r === "object") {
      const n = normalizeNewsRow(r as Record<string, unknown>);
      if (n) items.push(n);
    }
  }
  return { ok: true, items };
}
