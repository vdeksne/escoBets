"use client";

import { useCallback, useEffect, useId, useState } from "react";
import { Heart, Eye, MessageCircle, Loader2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatEngagementCount } from "@/lib/news/format-count";
import type { NewsCommentPublic } from "@/types/news";
import type { ApiResponse } from "@/types/api";

type EngagementPayload =
  | {
      mode: "live";
      isAdmin: boolean;
      likes: number;
      views: number;
      comments: number;
      liked: boolean;
      recentComments: NewsCommentPublic[];
    }
  | { mode: "static" };

const dateFmt = new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" });

function formatShortDate(iso: string) {
  try {
    return dateFmt.format(new Date(iso));
  } catch {
    return "";
  }
}

type NewsArticleEngagementProps = {
  articleSlug: string;
  initialLikes: number;
  initialViews: number;
  initialComments: number;
};

export function NewsArticleEngagement({
  articleSlug,
  initialLikes,
  initialViews,
  initialComments,
}: NewsArticleEngagementProps) {
  const [live, setLive] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [likes, setLikes] = useState(initialLikes);
  const [views, setViews] = useState(initialViews);
  const [commentCount, setCommentCount] = useState(initialComments);
  const [liked, setLiked] = useState(false);
  const [likeBusy, setLikeBusy] = useState(false);
  const [open, setOpen] = useState(false);
  const [comments, setComments] = useState<NewsCommentPublic[]>([]);
  const [body, setBody] = useState("");
  const [name, setName] = useState("");
  const [posting, setPosting] = useState(false);
  const [postError, setPostError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deletingAll, setDeletingAll] = useState(false);
  const nameId = useId();
  const bodyId = useId();

  useEffect(() => {
    const ac = new AbortController();
    (async () => {
      if (!articleSlug) {
        setHydrated(true);
        return;
      }
      try {
        const r = await fetch(
          `/api/news/${encodeURIComponent(articleSlug)}/engagement?track=1`,
          { credentials: "include", signal: ac.signal }
        );
        const j = (await r.json()) as ApiResponse<EngagementPayload>;
        if (ac.signal.aborted || !j.success) {
          return;
        }
        if (j.data.mode === "live") {
          setLive(true);
          setIsAdmin(j.data.isAdmin);
          setLikes(j.data.likes);
          setViews(j.data.views);
          setCommentCount(j.data.comments);
          setLiked(j.data.liked);
          setComments(j.data.recentComments);
        }
      } catch {
        /* network */
      } finally {
        if (!ac.signal.aborted) {
          setHydrated(true);
        }
      }
    })();
    return () => ac.abort();
  }, [articleSlug]);

  const onLike = useCallback(async () => {
    if (!live || !articleSlug || likeBusy) {
      return;
    }
    setLikeBusy(true);
    setPostError(null);
    try {
      const r = await fetch(`/api/news/${encodeURIComponent(articleSlug)}/like`, {
        method: "POST",
        credentials: "include",
      });
      const j = (await r.json()) as ApiResponse<{ likes: number; liked: boolean }>;
      if (j.success) {
        setLikes(j.data.likes);
        setLiked(j.data.liked);
      }
    } catch {
      /* ignore */
    } finally {
      setLikeBusy(false);
    }
  }, [articleSlug, live, likeBusy]);

  const onPost = useCallback(async () => {
    if (!live || !articleSlug || posting) {
      return;
    }
    const t = body.trim();
    if (!t) {
      return;
    }
    setPosting(true);
    setPostError(null);
    try {
      const r = await fetch(`/api/news/${encodeURIComponent(articleSlug)}/comments`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: t, author: name.trim() || undefined }),
      });
      const j = (await r.json()) as ApiResponse<{
        comment: NewsCommentPublic;
        comments: number;
      }>;
      if (!r.ok || !j.success) {
        const msg =
          !j.success ? j.error.message : "Could not post.";
        setPostError(msg);
        return;
      }
      setCommentCount(j.data.comments);
      setComments((c) => [{ ...j.data.comment, canDelete: true }, ...c].slice(0, 20));
      setBody("");
    } catch {
      setPostError("Could not post.");
    } finally {
      setPosting(false);
    }
  }, [articleSlug, body, live, name, posting]);

  const onDeleteComment = useCallback(
    async (commentId: string) => {
      if (!live || !articleSlug || deletingId) {
        return;
      }
      setDeletingId(commentId);
      setPostError(null);
      try {
        const r = await fetch(
          `/api/news/${encodeURIComponent(articleSlug)}/comments/${encodeURIComponent(commentId)}`,
          { method: "DELETE", credentials: "include" }
        );
        const j = (await r.json()) as ApiResponse<{ comments: number }>;
        if (!r.ok || !j.success) {
          const msg = !j.success ? j.error.message : "Could not delete.";
          setPostError(msg);
          return;
        }
        setCommentCount(j.data.comments);
        setComments((list) => list.filter((c) => c.id !== commentId));
      } catch {
        setPostError("Could not delete.");
      } finally {
        setDeletingId(null);
      }
    },
    [articleSlug, live, deletingId]
  );

  const onDeleteAllComments = useCallback(async () => {
    if (!live || !articleSlug || !isAdmin || deletingAll) {
      return;
    }
    if (!window.confirm("Remove all comments on this article? This cannot be undone.")) {
      return;
    }
    setDeletingAll(true);
    setPostError(null);
    try {
      const r = await fetch(
        `/api/news/${encodeURIComponent(articleSlug)}/comments?all=1`,
        { method: "DELETE", credentials: "include" }
      );
      const j = (await r.json()) as ApiResponse<{ deleted: number; comments: number }>;
      if (!r.ok || !j.success) {
        const msg = !j.success ? j.error.message : "Could not delete.";
        setPostError(msg);
        return;
      }
      setCommentCount(j.data.comments);
      setComments([]);
    } catch {
      setPostError("Could not delete all.");
    } finally {
      setDeletingAll(false);
    }
  }, [articleSlug, isAdmin, live, deletingAll]);

  return (
    <div className="rounded-lg border border-white/[0.08] bg-escobets-gray-card/90">
      <div
        className={cn(
          "grid grid-cols-3 items-center gap-1 px-3 py-2.5 sm:gap-2 sm:px-3.5",
          open && "border-b border-white/[0.06]"
        )}
      >
        <button
          type="button"
          onClick={onLike}
          disabled={!live || !hydrated || likeBusy}
          aria-pressed={liked}
          aria-label={liked ? "Unlike" : "Like"}
          className={cn(
            "flex items-center justify-center gap-1.5 py-0.5 font-gotham text-xs tabular-nums text-white/90 transition sm:text-sm",
            !live && "cursor-default opacity-60",
            live && "hover:opacity-90"
          )}
        >
          {likeBusy ? (
            <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin text-escobets-yellow/80" />
          ) : (
            <Heart
              className={cn(
                "h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4",
                liked
                  ? "fill-escobets-yellow text-escobets-yellow"
                  : "text-white/45",
                live && !liked && "text-white/40"
              )}
            />
          )}
          {formatEngagementCount(likes)}
        </button>

        <div className="flex items-center justify-center gap-1.5 font-gotham text-xs tabular-nums text-white/75 sm:text-sm">
          <Eye className="h-3.5 w-3.5 shrink-0 text-white/35 sm:h-4 sm:w-4" aria-hidden />
          {formatEngagementCount(views)}
        </div>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="flex items-center justify-center gap-1.5 py-0.5 font-gotham text-xs tabular-nums text-white/90 transition hover:text-white sm:text-sm"
        >
          <MessageCircle className="h-3.5 w-3.5 shrink-0 text-white/40 sm:h-4 sm:w-4" aria-hidden />
          {formatEngagementCount(commentCount)}
        </button>
      </div>

      {open ? (
        <div className="space-y-3 px-3 pb-3 pt-1 sm:px-3.5">
          {live ? (
            <>
              <div className="space-y-1.5">
                <label htmlFor={nameId} className="font-gotham text-[10px] uppercase tracking-wider text-white/30">
                  Name (optional)
                </label>
                <input
                  id={nameId}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={80}
                  placeholder="Anonymous"
                  className="w-full rounded-md border border-white/10 bg-black/30 px-2.5 py-1.5 font-gotham text-xs text-white placeholder:text-white/25 focus:border-escobets-yellow/30 focus:outline-none"
                />
                <label htmlFor={bodyId} className="mt-1 block font-gotham text-[10px] uppercase tracking-wider text-white/30">
                  Comment
                </label>
                <textarea
                  id={bodyId}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  maxLength={2000}
                  rows={3}
                  placeholder="Add a short note…"
                  className="w-full resize-none rounded-md border border-white/10 bg-black/30 px-2.5 py-1.5 font-gotham text-xs text-white placeholder:text-white/25 focus:border-escobets-yellow/30 focus:outline-none"
                />
                {postError ? (
                  <p className="font-gotham text-[11px] text-red-400/90" role="alert">
                    {postError}
                  </p>
                ) : null}
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => void onPost()}
                    disabled={posting || !body.trim()}
                    className="rounded-md border border-escobets-yellow/30 bg-escobets-yellow/10 px-3 py-1 font-gotham text-xs font-medium text-escobets-yellow transition hover:bg-escobets-yellow/15 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {posting ? "Sending…" : "Post"}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <p className="font-gotham text-[11px] text-white/40">
              Comments and likes are available when the article is saved in the live feed.
            </p>
          )}

          {comments.length > 0 ? (
            <div className="space-y-2 border-t border-white/[0.06] pt-2.5">
              {isAdmin ? (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => void onDeleteAllComments()}
                    disabled={deletingAll}
                    className="font-gotham text-[10px] text-red-400/90 underline-offset-2 hover:underline disabled:opacity-50"
                  >
                    {deletingAll ? "Removing…" : "Delete all comments"}
                  </button>
                </div>
              ) : null}
              <ul className="max-h-40 space-y-2 overflow-y-auto sm:max-h-48">
                {comments.map((c) => (
                  <li key={c.id} className="group font-gotham text-xs leading-snug text-white/70">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] text-white/30">{formatShortDate(c.createdAt)}</span>
                        {c.author ? (
                          <span className="ml-1.5 text-white/50">{c.author}</span>
                        ) : null}
                        <p className="mt-0.5 text-white/85">{c.body}</p>
                      </div>
                      {c.canDelete ? (
                        <button
                          type="button"
                          onClick={() => void onDeleteComment(c.id)}
                          disabled={deletingId === c.id}
                          aria-label="Delete comment"
                          className="shrink-0 rounded p-0.5 text-white/25 transition hover:bg-white/10 hover:text-red-400/90 disabled:opacity-40"
                        >
                          {deletingId === c.id ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <Trash2 className="h-3 w-3" />
                          )}
                        </button>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
