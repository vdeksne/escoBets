"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { NewsAdminEditorPage } from "@/components/admin/news-admin-editor-page";
import type { NewsArticle } from "@/types/news";
import type { ApiResponse } from "@/types/api";

export default function AdminNewsEditPage() {
  const params = useParams();
  const raw = params.id;
  const id = (Array.isArray(raw) ? raw[0] : raw) ?? "";
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (signal: AbortSignal) => {
    setErr(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/news/${encodeURIComponent(id)}`, {
        signal,
        credentials: "include",
      });
      const json = (await res.json()) as ApiResponse<NewsArticle>;
      if (!res.ok || !json.success) {
        throw new Error("success" in json && !json.success ? json.error.message : "Failed to load article.");
      }
      setArticle(json.data);
    } catch (e) {
      if (signal.aborted) return;
      setErr(e instanceof Error ? e.message : "Failed to load article.");
    } finally {
      if (!signal.aborted) {
        setLoading(false);
      }
    }
  }, [id]);

  useEffect(() => {
    if (!id) {
      setErr("Missing article id.");
      setLoading(false);
      return;
    }
    const a = new AbortController();
    void load(a.signal);
    return () => a.abort();
  }, [id, load]);

  if (!id) {
    return null;
  }
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black px-4">
        <p className="font-gotham text-sm text-white/60">Loading…</p>
      </div>
    );
  }
  if (err) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black px-4">
        <p className="font-gotham text-sm text-red-400">{err}</p>
      </div>
    );
  }
  if (!article) {
    return null;
  }

  return <NewsAdminEditorPage mode="edit" initialArticle={article} />;
}
