"use client";

import { useMemo, useState } from "react";
import { Eye, GripVertical, Plus, Trash2, X } from "lucide-react";
import { XFeedPostCard } from "@/components/landing/x-feed-post-card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import type { XTweetCard } from "@/types/x-tweet";

const inputClass =
  "h-8 rounded-md border border-white/15 bg-zinc-950 px-2 py-1.5 text-xs font-light text-white " +
  "focus:border-escobets-yellow/45 focus:outline-none focus:ring-1 focus:ring-escobets-yellow/20";

const textareaClass =
  "min-h-[56px] w-full rounded-md border border-white/15 bg-zinc-950 px-2 py-1.5 text-xs font-light text-white " +
  "focus:border-escobets-yellow/45 focus:outline-none focus:ring-1 focus:ring-escobets-yellow/20";

function labelS() {
  return "mb-0.5 block text-[10px] font-medium uppercase tracking-wider text-white/40";
}

function withAt(handle: string) {
  const t = handle.trim();
  if (!t) return "@";
  return t.startsWith("@") ? t : `@${t}`;
}

function newCard(xHandle: string, index: number): XTweetCard {
  const h = withAt(xHandle).replace(/^@/, "");
  return {
    id: typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `manual-${index}-${Date.now()}`,
    name: "",
    handle: h ? `@${h}` : "@",
    date: new Date().toLocaleDateString("en-GB", { month: "short", day: "numeric" }),
    verified: false,
    content: "",
    profileImageUrl: null,
    mediaUrl: null,
    xPostUrl: h ? `https://x.com/${encodeURIComponent(h)}` : "https://x.com",
    replies: "0",
    retweets: "0",
    likes: "0",
    views: null,
  };
}

type Props = {
  cards: XTweetCard[];
  siteXHandle: string;
  onChange: (next: XTweetCard[]) => void;
  inputOverrideClass: string;
};

export function XManualCardsEditor({ cards, siteXHandle, onChange, inputOverrideClass }: Props) {
  const [openPreview, setOpenPreview] = useState<number | null>(null);
  const [sectionOpen, setSectionOpen] = useState(cards.length > 0);
  const count = cards.length;

  const defaultAt = useMemo(() => withAt(siteXHandle), [siteXHandle]);

  const update = (index: number, partial: Partial<XTweetCard>) => {
    onChange(
      cards.map((c, j) => (j === index ? { ...c, ...partial } : c))
    );
  };

  const remove = (index: number) => {
    onChange(cards.filter((_, j) => j !== index));
  };

  const add = () => {
    onChange([...cards, newCard(siteXHandle, cards.length)]);
    setSectionOpen(true);
  };

  return (
    <div className="mt-4 rounded-lg border border-dashed border-white/15 bg-zinc-950/80">
      <button
        type="button"
        onClick={() => setSectionOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left font-gotham text-sm text-white/80 hover:bg-white/[0.04]"
      >
        <span className="flex items-center gap-2">
          <GripVertical className="h-4 w-4 shrink-0 text-white/35" aria-hidden />
          Manual X posts
          <span className="text-white/40">
            {count > 0 ? `(${count})` : "— when API has no data"}
          </span>
        </span>
        <span className="text-[11px] text-white/45">{sectionOpen ? "Hide" : "Show"}</span>
      </button>

      {sectionOpen && (
        <div className="space-y-2 border-t border-white/[0.06] px-3 py-3">
          <p className="font-gotham text-xs font-light leading-relaxed text-white/45">
            If the X API does not return posts (credits, errors, or missing token), these cards
            display instead. A successful API response always overrides them.
          </p>
          {cards.length === 0 && (
            <p className="text-center font-gotham text-xs text-white/35">No manual posts yet.</p>
          )}
          <ul className="max-h-[min(52vh,420px)] space-y-2 overflow-y-auto pr-0.5">
            {cards.map((card, index) => {
              const snip =
                card.content.trim().slice(0, 42) + (card.content.length > 42 ? "…" : "");
              return (
                <li
                  key={card.id}
                  className="rounded-lg border border-white/[0.08] bg-black/50"
                >
                  <details className="group">
                    <summary
                      className="cursor-pointer list-none px-2 py-2 font-gotham text-xs text-white/70 marker:content-none [&::-webkit-details-marker]:hidden"
                    >
                      <span className="flex items-center justify-between gap-2">
                        <span className="min-w-0 truncate">
                          <span className="text-escobets-yellow/70">#{index + 1}</span>{" "}
                          {card.name || "New post"}{" "}
                          <span className="text-white/40">{snip || "— no text yet"}</span>
                        </span>
                        <span className="shrink-0 text-[10px] text-white/35 group-open:opacity-100">
                          Edit
                        </span>
                      </span>
                    </summary>
                    <div className="space-y-2 border-t border-white/[0.06] px-2 pb-3 pt-1">
                      <div className="grid gap-2 sm:grid-cols-2">
                        <div>
                          <p className={labelS()}>Name</p>
                          <Input
                            className={cn(inputClass, inputOverrideClass)}
                            value={card.name}
                            onChange={(e) => update(index, { name: e.target.value })}
                            placeholder="Display name"
                          />
                        </div>
                        <div>
                          <p className={labelS()}>Handle</p>
                          <Input
                            className={cn(inputClass, inputOverrideClass)}
                            value={card.handle}
                            onChange={(e) => update(index, { handle: e.target.value })}
                            placeholder={defaultAt}
                          />
                        </div>
                        <div>
                          <p className={labelS()}>Date (shown on card)</p>
                          <Input
                            className={cn(inputClass, inputOverrideClass)}
                            value={card.date}
                            onChange={(e) => update(index, { date: e.target.value })}
                            placeholder="Apr 22"
                          />
                        </div>
                        <div className="flex items-end gap-2 pb-0.5">
                          <label className="flex cursor-pointer items-center gap-2 text-xs text-white/55">
                            <Checkbox
                              checked={card.verified}
                              onCheckedChange={(c) => update(index, { verified: Boolean(c) })}
                            />
                            Verified badge
                          </label>
                        </div>
                      </div>
                      <div>
                        <p className={labelS()}>Post text</p>
                        <textarea
                          className={textareaClass}
                          value={card.content}
                          onChange={(e) => update(index, { content: e.target.value })}
                          placeholder="Post content…"
                        />
                      </div>
                      <div className="grid gap-2 sm:grid-cols-2">
                        <div>
                          <p className={labelS()}>Profile image URL</p>
                          <Input
                            className={cn(inputClass, inputOverrideClass)}
                            value={card.profileImageUrl ?? ""}
                            onChange={(e) =>
                              update(index, {
                                profileImageUrl: e.target.value.trim() || null,
                              })
                            }
                            placeholder="https://…"
                          />
                        </div>
                        <div>
                          <p className={labelS()}>Media image URL</p>
                          <Input
                            className={cn(inputClass, inputOverrideClass)}
                            value={card.mediaUrl ?? ""}
                            onChange={(e) =>
                              update(index, { mediaUrl: e.target.value.trim() || null })
                            }
                            placeholder="https://…"
                          />
                        </div>
                      </div>
                      <div>
                        <p className={labelS()}>Link (card opens in new tab)</p>
                        <Input
                          className={cn(inputClass, inputOverrideClass)}
                          value={card.xPostUrl}
                          onChange={(e) => update(index, { xPostUrl: e.target.value })}
                          placeholder="https://x.com/…/status/…"
                        />
                      </div>
                      <div className="grid grid-cols-4 gap-1.5">
                        <div>
                          <p className={labelS()}>Replies</p>
                          <Input
                            className={cn(inputClass, inputOverrideClass)}
                            value={card.replies}
                            onChange={(e) => update(index, { replies: e.target.value })}
                            placeholder="—"
                          />
                        </div>
                        <div>
                          <p className={labelS()}>Reposts</p>
                          <Input
                            className={cn(inputClass, inputOverrideClass)}
                            value={card.retweets}
                            onChange={(e) => update(index, { retweets: e.target.value })}
                            placeholder="—"
                          />
                        </div>
                        <div>
                          <p className={labelS()}>Likes</p>
                          <Input
                            className={cn(inputClass, inputOverrideClass)}
                            value={card.likes}
                            onChange={(e) => update(index, { likes: e.target.value })}
                            placeholder="—"
                          />
                        </div>
                        <div>
                          <p className={labelS()}>Views</p>
                          <Input
                            className={cn(inputClass, inputOverrideClass)}
                            value={card.views ?? ""}
                            onChange={(e) =>
                              update(index, { views: e.target.value.trim() || null })
                            }
                            placeholder="—"
                          />
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => setOpenPreview(index)}
                          className="inline-flex items-center gap-1.5 rounded-md border border-white/15 bg-black px-2.5 py-1.5 font-gotham text-xs text-white/80 hover:border-escobets-yellow/40"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          Preview card
                        </button>
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="inline-flex items-center gap-1.5 rounded-md border border-red-500/30 px-2.5 py-1.5 font-gotham text-xs text-red-300/90 hover:bg-red-950/40"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Remove
                        </button>
                      </div>
                    </div>
                  </details>
                </li>
              );
            })}
          </ul>
          <button
            type="button"
            onClick={add}
            className="flex w-full items-center justify-center gap-2 rounded-md border border-white/10 py-2 font-gotham text-xs text-escobets-yellow/90 hover:bg-white/[0.04]"
          >
            <Plus className="h-4 w-4" />
            Add post
          </button>
        </div>
      )}

      {openPreview != null && cards[openPreview] && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4"
          role="dialog"
          aria-modal
          aria-label="Card preview"
          onClick={() => setOpenPreview(null)}
        >
          <div
            className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setOpenPreview(null)}
              className="absolute right-0 top-0 z-10 rounded-md border border-white/20 bg-black/90 p-2 text-white/80 hover:text-white"
              aria-label="Close preview"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="mx-auto w-fit max-w-full scale-95 pt-8 sm:scale-100 sm:pt-2">
              <XFeedPostCard
                tweet={cards[openPreview]!}
                unoptimizedImages
                className="w-[min(100vw-2rem,320px)]"
              />
            </div>
            <p className="mt-2 text-center font-gotham text-xs text-white/45">
              Preview may differ slightly from the live home page. Save to apply on the site.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
