"use client";

import { useEffect, useState } from "react";
import { UpdatesView } from "@/components/admin/updates-view";
import type { NewsPostAdmin } from "@/types/news-post";
import type { ApiResponse } from "@/types/api";

interface UpdatesData {
  posts: NewsPostAdmin[];
  stats: {
    totalPosts: number;
    newPosts: number;
    livePosts: number;
    totalViews: string;
  };
}

/** Admin updates (News and Predictions) – backend: replace mock data with API/CMS */
export default function UpdatesPage() {
  const [data, setData] = useState<UpdatesData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadUpdates() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/updates?page=1&pageSize=200", {
          signal: controller.signal,
        });
        const payload = (await response.json()) as ApiResponse<UpdatesData>;

        if (!response.ok || !payload.success) {
          const message =
            payload.success === false
              ? payload.error.message
              : "Failed to load updates.";
          throw new Error(message);
        }

        setData(payload.data);
      } catch (fetchError) {
        if (controller.signal.aborted) return;
        setError(
          fetchError instanceof Error
            ? fetchError.message
            : "Failed to load updates."
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    void loadUpdates();

    return () => {
      controller.abort();
    };
  }, []);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black px-4">
        <p className="font-gotham text-sm text-red-400">{error}</p>
      </div>
    );
  }

  if (isLoading || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black px-4">
        <p className="font-gotham text-sm text-white/70">Loading updates...</p>
      </div>
    );
  }

  return <UpdatesView posts={data.posts} stats={data.stats} />;
}
