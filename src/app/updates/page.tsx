"use client";

import { useEffect, useState } from "react";
import { UpdatesView } from "@/components/admin/updates-view";
import { mapNewsArticleToPostAdmin, computeAdminNewsStats } from "@/lib/news/admin-list-mapper";
import type { NewsArticle } from "@/types/news";
import type { ApiResponse } from "@/types/api";

type NewsListPayload = { items: NewsArticle[] };

/** Admin news & predictions: single list UI backed by the `news` CMS. */
export default function UpdatesPage() {
  const [items, setItems] = useState<NewsArticle[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/admin/news", {
          signal: controller.signal,
          credentials: "include",
        });
        const json = (await res.json()) as ApiResponse<NewsListPayload>;
        if (!res.ok || !json.success) {
          const message =
            json.success === false ? json.error.message : "Failed to load news.";
          throw new Error(message);
        }
        setItems(json.data.items);
      } catch (e) {
        if (controller.signal.aborted) return;
        setError(e instanceof Error ? e.message : "Failed to load news.");
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    void load();
    return () => controller.abort();
  }, []);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black px-4">
        <p className="font-gotham text-sm text-red-400">{error}</p>
      </div>
    );
  }

  if (isLoading || items === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black px-4">
        <p className="font-gotham text-sm text-white/70">Loading…</p>
      </div>
    );
  }

  const posts = items.map(mapNewsArticleToPostAdmin);
  const stats = computeAdminNewsStats(items);
  return <UpdatesView posts={posts} stats={stats} />;
}
