"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import LinkExtension from "@tiptap/extension-link";
import UnderlineExtension from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  ArrowLeft,
  Bold,
  ChevronDown,
  Code2,
  Heading1,
  Heading2,
  Heading3,
  ImageIcon,
  Italic,
  Link2,
  List,
  ListOrdered,
  Loader2,
  Minus,
  Quote,
  Redo2,
  Save,
  Send,
  Strikethrough,
  Underline,
  Undo2,
  Upload,
} from "lucide-react";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { ArticleDisplayDatePicker } from "@/components/admin/article-display-date-picker";
import { uploadAdminNewsImage } from "@/lib/admin/news-image-upload";
import { cn } from "@/lib/utils";
import { slugifyHeadline } from "@/lib/news/slug";
import { getNewsBodyHtml } from "@/lib/news/article-html";
import type { NewsArticle } from "@/types/news";
import type { ApiResponse } from "@/types/api";

type Mode = "new" | "edit";

const CUSTOM_CATEGORY_VALUE = "__custom__";

/** Static class for TipTap ProseMirror root — keep outside useEditor to avoid option churn. */
const NEWS_EDITOR_CONTENT_CLASS =
  "min-h-[min(55vh,520px)] max-w-none px-5 py-6 font-gotham text-sm leading-relaxed text-white/90 focus:outline-none sm:px-8 sm:py-8 sm:text-base " +
  "[&_h1]:mb-3 [&_h1]:mt-2 [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:tracking-tight sm:[&_h1]:text-3xl " +
  "[&_h2]:mb-2 [&_h2]:mt-6 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-white sm:[&_h2]:text-2xl " +
  "[&_h3]:mb-2 [&_h3]:mt-4 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-white/95 " +
  "[&_p]:my-3 [&_a]:text-escobets-yellow [&_a]:underline [&_a]:decoration-escobets-yellow/50 [&_a]:underline-offset-2 " +
  "[&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:my-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:my-0.5 " +
  "[&_blockquote]:my-4 [&_blockquote]:border-l-2 [&_blockquote]:border-escobets-yellow/50 [&_blockquote]:pl-4 [&_blockquote]:text-white/75 [&_blockquote]:italic " +
  "[&_code]:rounded-md [&_code]:bg-white/10 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-[0.9em] [&_code]:text-escobets-yellow/95 " +
  "[&_pre]:my-4 [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:border [&_pre]:border-white/10 [&_pre]:bg-black/50 [&_pre]:p-4 [&_pre]:text-sm " +
  "[&_hr]:my-8 [&_hr]:border-0 [&_hr]:border-t [&_hr]:border-white/20 " +
  "[&_img]:my-4 [&_img]:max-h-[min(70vh,560px)] [&_img]:w-auto [&_img]:max-w-full [&_img]:rounded-xl [&_img]:border [&_img]:border-white/10";

function ToolbarGroup({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-0.5 border-l border-white/[0.1] pl-1.5 first:border-0 first:pl-0",
        "sm:pl-2",
        className
      )}
    >
      {children}
    </div>
  );
}

function EditorBarButton({
  onClick,
  active,
  disabled,
  children,
  "aria-label": label,
  title: titleAttr,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  "aria-label": string;
  title?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={titleAttr ?? label}
      className={cn(
        "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border text-white/80 transition",
        "border-transparent bg-white/[0.04] hover:bg-white/[0.1] hover:text-white",
        "disabled:cursor-not-allowed disabled:opacity-35",
        active && "border-escobets-yellow/40 bg-escobets-yellow/12 text-escobets-yellow shadow-[0_0_0_1px_rgba(223,255,0,0.15)]"
      )}
    >
      {children}
    </button>
  );
}

type NewsAdminEditorPageProps = {
  mode: Mode;
  initialArticle?: NewsArticle | null;
};

export function NewsAdminEditorPage({ mode, initialArticle }: NewsAdminEditorPageProps) {
  const router = useRouter();
  const featuredFileRef = useRef<HTMLInputElement>(null);
  const bodyImageFileRef = useRef<HTMLInputElement>(null);
  const excerptRef = useRef<HTMLTextAreaElement>(null);
  const tagsRef = useRef<HTMLInputElement>(null);
  const authorRef = useRef<HTMLInputElement>(null);
  const readingTimeRef = useRef<HTMLInputElement>(null);

  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingFeatured, setUploadingFeatured] = useState(false);
  const [uploadingBodyImage, setUploadingBodyImage] = useState(false);
  const [existingCategories, setExistingCategories] = useState<string[]>([]);
  const [categorySelect, setCategorySelect] = useState("");
  const [categoryCustom, setCategoryCustom] = useState("");

  const [title, setTitle] = useState(initialArticle?.headline ?? "");
  const [slug, setSlug] = useState(initialArticle?.slug ?? "");
  const [dateStr, setDateStr] = useState(initialArticle?.date ?? "");
  const [imageUrl, setImageUrl] = useState(initialArticle?.imageUrl ?? "");
  /** In edit mode, do not overwrite slug from title. In new mode, false until the user edits the slug. */
  const [slugUserEdited, setSlugUserEdited] = useState(mode === "edit");

  useEffect(() => {
    if (!initialArticle) {
      setTitle("");
      setSlug("");
      setDateStr("");
      setImageUrl("");
      setSlugUserEdited(false);
      return;
    }
    setTitle(initialArticle.headline ?? "");
    setSlug(initialArticle.slug ?? "");
    setDateStr(initialArticle.date ?? "");
    setImageUrl(initialArticle.imageUrl ?? "");
    setSlugUserEdited(true);
  }, [initialArticle?.id]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch("/api/admin/news", { credentials: "include" });
        const json = (await res.json()) as ApiResponse<{ items: NewsArticle[] }>;
        if (!alive || !json.success || !json.data?.items) return;
        const set = new Set<string>();
        for (const a of json.data.items) {
          const c = a.category?.trim();
          if (c) set.add(c);
        }
        setExistingCategories(
          [...set].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }))
        );
      } catch {
        /* ignore */
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!initialArticle) {
      setCategorySelect("");
      setCategoryCustom("");
      return;
    }
    const c = initialArticle.category?.trim() ?? "";
    if (!c) {
      setCategorySelect("");
      setCategoryCustom("");
      return;
    }
    if (existingCategories.includes(c)) {
      setCategorySelect(c);
      setCategoryCustom("");
    } else {
      setCategorySelect(CUSTOM_CATEGORY_VALUE);
      setCategoryCustom(c);
    }
  }, [initialArticle?.id, initialArticle?.category, existingCategories]);

  const initialHtml = getNewsBodyHtml(initialArticle ?? null) || "<p></p>";
  const articleId = initialArticle?.id;

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Placeholder.configure({
        placeholder: "Start writing… Use the format bar for headings, lists, quotes, and media.",
      }),
      Image.configure({ inline: false, allowBase64: true }),
      LinkExtension.configure({ openOnClick: false }),
      UnderlineExtension,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: initialHtml,
    editorProps: {
      attributes: {
        class: NEWS_EDITOR_CONTENT_CLASS,
      },
    },
    immediatelyRender: false,
  });

  const setLink = useCallback(() => {
    if (!editor) return;
    const url = window.prompt("URL");
    if (url) editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  const addImageFromUrl = useCallback(() => {
    if (!editor) return;
    const url = window.prompt("Image URL");
    if (url?.trim()) editor.chain().focus().setImage({ src: url.trim() }).run();
  }, [editor]);

  const openBodyImageFileDialog = useCallback(() => {
    bodyImageFileRef.current?.click();
  }, []);

  const onFeaturedFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploadingFeatured(true);
    setError(null);
    try {
      setImageUrl(await uploadAdminNewsImage(file));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploadingFeatured(false);
    }
  }, []);

  const onBodyImageFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      e.target.value = "";
      if (!file || !editor) return;
      setUploadingBodyImage(true);
      setError(null);
      try {
        const url = await uploadAdminNewsImage(file);
        editor.chain().focus().setImage({ src: url }).run();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Image upload failed.");
      } finally {
        setUploadingBodyImage(false);
      }
    },
    [editor]
  );

  const onTitleInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value;
      setTitle(v);
      if (!slugUserEdited) {
        setSlug(slugifyHeadline(v));
      }
    },
    [slugUserEdited]
  );

  const onSlugInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSlugUserEdited(true);
    setSlug(e.target.value);
  }, []);

  const parseTags = (raw: string) =>
    raw
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

  const buildPayload = (isDraft: boolean) => {
    const t = title.trim();
    const slugOut = slugifyHeadline((slug || "").trim() || t) || "";
    return {
      headline: t,
      slug: slugOut || undefined,
      imageUrl: imageUrl.trim(),
      date: dateStr.trim(),
      excerpt: excerptRef.current?.value?.trim() ?? "",
      tags: parseTags(tagsRef.current?.value ?? ""),
      bodyHtml: editor?.getHTML() ?? "",
      category:
        categorySelect === CUSTOM_CATEGORY_VALUE
          ? categoryCustom.trim()
          : categorySelect.trim(),
      author: authorRef.current?.value?.trim() ?? "",
      readingTime: readingTimeRef.current?.value?.trim() ?? "",
      isDraft,
    };
  };

  const save = async (isDraft: boolean) => {
    setError(null);
    setIsSaving(true);
    const payload = buildPayload(isDraft);
    if (!payload.headline) {
      setError("Add a title.");
      setIsSaving(false);
      return;
    }
    if (!payload.imageUrl) {
      setError("Add a featured image URL.");
      setIsSaving(false);
      return;
    }
    if (!payload.date) {
      setError("Add a display date using the date selector.");
      setIsSaving(false);
      return;
    }
    try {
      if (mode === "new") {
        const res = await fetch("/api/admin/news", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...payload, isDraft: isDraft }),
        });
        const json = (await res.json()) as ApiResponse<NewsArticle>;
        if (!res.ok || !json.success) {
          throw new Error(
            "success" in json && !json.success ? json.error.message : "Save failed."
          );
        }
        router.push(`/admin/news/${json.data.id}/edit`);
        router.refresh();
        return;
      }
      if (!articleId) {
        setError("Missing article id.");
        return;
      }
      const res = await fetch(`/api/admin/news/${encodeURIComponent(articleId)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, isDraft }),
      });
      const json = (await res.json()) as ApiResponse<NewsArticle>;
      if (!res.ok || !json.success) {
        throw new Error(
          "success" in json && !json.success ? json.error.message : "Update failed."
        );
      }
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Request failed.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (mode === "new" || !articleId) return;
    if (!window.confirm("Delete this article permanently?")) return;
    setIsSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/news/${encodeURIComponent(articleId)}`, {
        method: "DELETE",
      });
      const json = (await res.json()) as ApiResponse<{ deleted: true }>;
      if (!res.ok || !json.success) {
        throw new Error(
          "success" in json && !json.success ? json.error.message : "Delete failed."
        );
      }
      router.push("/updates");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed.");
    } finally {
      setIsSaving(false);
    }
  };

  const publicSlug = initialArticle?.slug ?? initialArticle?.id ?? "";

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <Header />

      <main className="flex-1 px-3 py-6 sm:px-4 md:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-[min(100%,1200px)]">
          <nav className="mb-6 flex flex-wrap items-center gap-2 font-gotham text-xs text-white/45 sm:text-sm">
            <Link href="/admin" className="hover:text-white/70">
              Control centre
            </Link>
            <span aria-hidden>/</span>
            <Link href="/updates" className="hover:text-white/70">
              News
            </Link>
            <span aria-hidden>/</span>
            <span className="text-white/70">{mode === "new" ? "New article" : "Edit"}</span>
          </nav>

          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="font-gotham text-2xl font-bold text-white sm:text-3xl">
                {mode === "new" ? "New article" : "Edit article"}
              </h1>
              <p className="mt-1 max-w-xl font-gotham text-sm text-white/50">
                Drafts stay out of the public news feed until you publish.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:shrink-0">
              <Link
                href="/updates"
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 font-gotham text-sm text-white/90 transition hover:bg-white/10"
              >
                <ArrowLeft className="h-4 w-4" />
                All posts
              </Link>
              <button
                type="button"
                disabled={isSaving}
                onClick={() => void save(true)}
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 font-gotham text-sm text-white/90 transition hover:bg-white/10 disabled:opacity-50"
              >
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save draft
              </button>
              <button
                type="button"
                disabled={isSaving}
                onClick={() => void save(false)}
                className="inline-flex h-10 items-center gap-2 rounded-xl border-2 border-escobets-yellow bg-escobets-yellow/10 px-5 font-gotham text-sm font-medium text-escobets-yellow transition hover:bg-escobets-yellow/20 disabled:opacity-50"
              >
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                Publish
              </button>
            </div>
          </div>

          {error ? (
            <p className="mb-4 font-gotham text-sm text-red-400" role="alert">
              {error}
            </p>
          ) : null}

          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <div className="space-y-4">
              <div className="rounded-2xl border border-white/10 bg-escobets-gray-card/60 p-4 shadow-lg shadow-black/30 sm:p-6">
                <label className="mb-2 block font-gotham text-xs font-medium uppercase tracking-wide text-white/50">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={onTitleInput}
                  placeholder="Headline for News & Predictions"
                  className="w-full rounded-xl border border-white/15 bg-black/50 px-4 py-3 font-gotham text-lg text-white placeholder:text-white/35 focus:border-escobets-yellow/50 focus:outline-none focus:ring-1 focus:ring-escobets-yellow/30"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-escobets-gray-card/60 p-4 sm:p-5">
                  <label className="mb-2 block font-gotham text-xs font-medium text-white/50">URL slug</label>
                  <input
                    type="text"
                    value={slug}
                    onChange={onSlugInput}
                    placeholder={slugifyHeadline("my-article-title")}
                    autoComplete="off"
                    className="w-full rounded-xl border border-white/15 bg-black/50 px-3 py-2.5 font-gotham text-sm text-white placeholder:text-white/35 focus:border-escobets-yellow/50 focus:outline-none"
                  />
                  <p className="mt-1.5 font-gotham text-[11px] text-white/35">
                    {mode === "new"
                      ? "Filled from the title; edit to use a custom slug."
                      : "Edit only if you need a different URL; changing it changes the public link."}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-escobets-gray-card/60 p-4 sm:p-5">
                  <label htmlFor="article-display-date" className="mb-2 block font-gotham text-xs font-medium text-white/50">
                    Display date
                  </label>
                  <ArticleDisplayDatePicker id="article-display-date" value={dateStr} onChange={setDateStr} />
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-escobets-gray-card/60 p-4 sm:p-5">
                <label className="mb-2 block font-gotham text-xs font-medium text-white/50">Featured image</label>
                <p className="mb-3 font-gotham text-[11px] text-white/40">Paste an image URL or upload a file from your computer.</p>
                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://…"
                    className="min-w-0 flex-1 rounded-xl border border-white/15 bg-black/50 px-3 py-2.5 font-gotham text-sm text-white placeholder:text-white/35 focus:border-escobets-yellow/50 focus:outline-none"
                  />
                  <input
                    ref={featuredFileRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="sr-only"
                    aria-hidden
                    onChange={onFeaturedFileChange}
                  />
                  <button
                    type="button"
                    disabled={uploadingFeatured}
                    onClick={() => featuredFileRef.current?.click()}
                    className="inline-flex shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 font-gotham text-sm text-white/90 transition hover:bg-white/10 disabled:opacity-50"
                  >
                    {uploadingFeatured ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                    {uploadingFeatured ? " Uploading…" : "Upload from computer"}
                  </button>
                </div>
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt=""
                    className="mt-3 max-h-40 w-auto max-w-full rounded-lg border border-white/10 object-contain"
                  />
                ) : null}
              </div>

              <div className="rounded-2xl border border-white/10 bg-escobets-gray-card/60 p-4 sm:p-5">
                <label className="mb-2 block font-gotham text-xs font-medium text-white/50">Excerpt</label>
                <textarea
                  ref={excerptRef}
                  key={initialArticle?.id ? `ex-${initialArticle.id}` : "new-ex"}
                  defaultValue={initialArticle?.excerpt ?? ""}
                  rows={3}
                  placeholder="Short summary for cards and SEO"
                  className="w-full resize-y rounded-xl border border-white/15 bg-black/50 px-3 py-2.5 font-gotham text-sm text-white placeholder:text-white/35 focus:border-escobets-yellow/50 focus:outline-none"
                />
              </div>

              <div className="mb-1.5 flex items-end justify-between gap-3">
                <h2 className="font-gotham text-xs font-medium uppercase tracking-wide text-white/50">Article content</h2>
                <span className="hidden font-gotham text-[10px] text-white/30 sm:inline">Use the bar below to format</span>
              </div>
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-[#111] to-[#0a0a0a] shadow-[0_24px_80px_-16px_rgba(0,0,0,0.75)]">
                <input
                  ref={bodyImageFileRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="sr-only"
                  aria-hidden
                  onChange={onBodyImageFileChange}
                />
                <div className="sticky top-0 z-20 border-b border-white/[0.08] bg-[#141414]/95 shadow-sm shadow-black/40 backdrop-blur-md">
                  <div className="flex items-baseline justify-between gap-3 border-b border-white/[0.06] px-3 py-1.5 sm:px-4">
                    <span className="font-gotham text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">
                      Format
                    </span>
                    <span className="hidden text-right font-gotham text-[10px] text-white/30 sm:block">
                      Tip: use headings and lists for structure
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-y-1.5 px-2 py-2 sm:px-3">
                      <ToolbarGroup>
                        <EditorBarButton
                          onClick={() => editor?.chain().focus().undo().run()}
                          disabled={!editor?.can().undo()}
                          aria-label="Undo"
                          title="Undo"
                        >
                          <Undo2 className="h-3.5 w-3.5" />
                        </EditorBarButton>
                        <EditorBarButton
                          onClick={() => editor?.chain().focus().redo().run()}
                          disabled={!editor?.can().redo()}
                          aria-label="Redo"
                          title="Redo"
                        >
                          <Redo2 className="h-3.5 w-3.5" />
                        </EditorBarButton>
                      </ToolbarGroup>
                      <ToolbarGroup>
                        <EditorBarButton
                          onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
                          active={editor?.isActive("heading", { level: 1 })}
                          aria-label="Heading 1"
                          title="Heading 1"
                        >
                          <Heading1 className="h-3.5 w-3.5" />
                        </EditorBarButton>
                        <EditorBarButton
                          onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                          active={editor?.isActive("heading", { level: 2 })}
                          aria-label="Heading 2"
                          title="Heading 2"
                        >
                          <Heading2 className="h-3.5 w-3.5" />
                        </EditorBarButton>
                        <EditorBarButton
                          onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
                          active={editor?.isActive("heading", { level: 3 })}
                          aria-label="Heading 3"
                          title="Heading 3"
                        >
                          <Heading3 className="h-3.5 w-3.5" />
                        </EditorBarButton>
                      </ToolbarGroup>
                      <ToolbarGroup>
                        <EditorBarButton
                          onClick={() => editor?.chain().focus().toggleBold().run()}
                          active={editor?.isActive("bold")}
                          aria-label="Bold"
                          title="Bold (⌘B)"
                        >
                          <Bold className="h-3.5 w-3.5" />
                        </EditorBarButton>
                        <EditorBarButton
                          onClick={() => editor?.chain().focus().toggleItalic().run()}
                          active={editor?.isActive("italic")}
                          aria-label="Italic"
                          title="Italic (⌘I)"
                        >
                          <Italic className="h-3.5 w-3.5" />
                        </EditorBarButton>
                        <EditorBarButton
                          onClick={() => editor?.chain().focus().toggleUnderline().run()}
                          active={editor?.isActive("underline")}
                          aria-label="Underline"
                          title="Underline"
                        >
                          <Underline className="h-3.5 w-3.5" />
                        </EditorBarButton>
                        <EditorBarButton
                          onClick={() => editor?.chain().focus().toggleStrike().run()}
                          active={editor?.isActive("strike")}
                          aria-label="Strikethrough"
                          title="Strikethrough"
                        >
                          <Strikethrough className="h-3.5 w-3.5" />
                        </EditorBarButton>
                        <EditorBarButton
                          onClick={() => editor?.chain().focus().toggleCode().run()}
                          active={editor?.isActive("code")}
                          aria-label="Inline code"
                          title="Inline code"
                        >
                          <Code2 className="h-3.5 w-3.5" />
                        </EditorBarButton>
                      </ToolbarGroup>
                      <ToolbarGroup>
                        <EditorBarButton
                          onClick={() => editor?.chain().focus().setTextAlign("left").run()}
                          active={editor?.isActive({ textAlign: "left" })}
                          aria-label="Align left"
                          title="Align left"
                        >
                          <AlignLeft className="h-3.5 w-3.5" />
                        </EditorBarButton>
                        <EditorBarButton
                          onClick={() => editor?.chain().focus().setTextAlign("center").run()}
                          active={editor?.isActive({ textAlign: "center" })}
                          aria-label="Align center"
                          title="Align center"
                        >
                          <AlignCenter className="h-3.5 w-3.5" />
                        </EditorBarButton>
                        <EditorBarButton
                          onClick={() => editor?.chain().focus().setTextAlign("right").run()}
                          active={editor?.isActive({ textAlign: "right" })}
                          aria-label="Align right"
                          title="Align right"
                        >
                          <AlignRight className="h-3.5 w-3.5" />
                        </EditorBarButton>
                      </ToolbarGroup>
                      <ToolbarGroup>
                        <EditorBarButton
                          onClick={() => editor?.chain().focus().toggleBulletList().run()}
                          active={editor?.isActive("bulletList")}
                          aria-label="Bullet list"
                          title="Bullet list"
                        >
                          <List className="h-3.5 w-3.5" />
                        </EditorBarButton>
                        <EditorBarButton
                          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                          active={editor?.isActive("orderedList")}
                          aria-label="Numbered list"
                          title="Numbered list"
                        >
                          <ListOrdered className="h-3.5 w-3.5" />
                        </EditorBarButton>
                        <EditorBarButton
                          onClick={() => editor?.chain().focus().toggleBlockquote().run()}
                          active={editor?.isActive("blockquote")}
                          aria-label="Quote"
                          title="Blockquote"
                        >
                          <Quote className="h-3.5 w-3.5" />
                        </EditorBarButton>
                        <EditorBarButton
                          onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
                          active={editor?.isActive("codeBlock")}
                          aria-label="Code block"
                          title="Code block"
                        >
                          <span className="font-mono text-[11px] font-bold">&lt;/&gt;</span>
                        </EditorBarButton>
                        <EditorBarButton
                          onClick={() => editor?.chain().focus().setHorizontalRule().run()}
                          disabled={!editor}
                          aria-label="Horizontal rule"
                          title="Divider"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </EditorBarButton>
                      </ToolbarGroup>
                      <ToolbarGroup>
                        <EditorBarButton onClick={setLink} active={editor?.isActive("link")} aria-label="Insert link" title="Link">
                          <Link2 className="h-3.5 w-3.5" />
                        </EditorBarButton>
                        <EditorBarButton
                          onClick={openBodyImageFileDialog}
                          disabled={uploadingBodyImage}
                          aria-label="Insert image from computer"
                          title="Image from file"
                        >
                          {uploadingBodyImage ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Upload className="h-3.5 w-3.5" />
                          )}
                        </EditorBarButton>
                        <EditorBarButton
                          onClick={addImageFromUrl}
                          aria-label="Insert image from URL"
                          title="Image from URL"
                        >
                          <ImageIcon className="h-3.5 w-3.5" />
                        </EditorBarButton>
                      </ToolbarGroup>
                  </div>
                </div>
                <div className="min-h-0">
                  <EditorContent editor={editor} />
                </div>
              </div>
            </div>

            <aside className="space-y-4 lg:sticky lg:top-24">
              <div className="rounded-2xl border border-white/10 bg-escobets-gray-card/80 p-5 backdrop-blur-sm">
                <h2 className="font-gotham text-sm font-semibold uppercase tracking-wide text-white/80">Publish</h2>
                {initialArticle ? (
                  <p className="mt-2 font-gotham text-xs text-white/50">
                    Status: {initialArticle.isDraft ? "Draft" : "Published"} (in feed when published and saved)
                  </p>
                ) : (
                  <p className="mt-2 font-gotham text-xs text-white/50">New posts start as draft until you publish.</p>
                )}
                {mode === "edit" && publicSlug ? (
                  <a
                    href={`/news/${publicSlug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-block font-gotham text-sm text-escobets-yellow hover:underline"
                  >
                    Open public page ↗
                  </a>
                ) : null}
              </div>

              <div className="rounded-2xl border border-white/10 bg-escobets-gray-card/60 p-5">
                <h2 className="mb-3 font-gotham text-sm font-semibold text-white/80">Metadata</h2>
                <div className="space-y-3">
                  <div>
                    <label className="mb-1 block font-gotham text-xs text-white/45" htmlFor="admin-news-category">
                      Category
                    </label>
                    <div className="relative">
                      <select
                        id="admin-news-category"
                        value={categorySelect}
                        onChange={(e) => {
                          const v = e.target.value;
                          setCategorySelect(v);
                          if (v !== CUSTOM_CATEGORY_VALUE) setCategoryCustom("");
                        }}
                        className={cn(
                          "w-full cursor-pointer appearance-none rounded-lg border border-white/10 bg-white/[0.04] py-2 pl-3 pr-9 font-gotham text-sm text-white/90 [color-scheme:dark]",
                          "focus:border-escobets-yellow/50 focus:outline-none focus:ring-1 focus:ring-escobets-yellow/20"
                        )}
                      >
                        <option value="">None</option>
                        {existingCategories.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                        <option value={CUSTOM_CATEGORY_VALUE}>New category…</option>
                      </select>
                      <ChevronDown
                        className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/40"
                        aria-hidden
                      />
                    </div>
                    {categorySelect === CUSTOM_CATEGORY_VALUE ? (
                      <input
                        type="text"
                        value={categoryCustom}
                        onChange={(e) => setCategoryCustom(e.target.value)}
                        placeholder="Type a category name"
                        className="mt-2 w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 font-gotham text-sm text-white focus:border-escobets-yellow/50 focus:outline-none"
                      />
                    ) : null}
                  </div>
                  <div>
                    <label className="mb-1 block font-gotham text-xs text-white/45">Author</label>
                    <input
                      ref={authorRef}
                      type="text"
                      key={initialArticle?.id ? `au-${initialArticle.id}` : "new-au"}
                      defaultValue={initialArticle?.author ?? ""}
                      className="w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 font-gotham text-sm text-white focus:border-escobets-yellow/50 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block font-gotham text-xs text-white/45">Reading time</label>
                    <input
                      ref={readingTimeRef}
                      type="text"
                      key={initialArticle?.id ? `rt-${initialArticle.id}` : "new-rt"}
                      defaultValue={initialArticle?.readingTime ?? ""}
                      placeholder="e.g. 8 Min"
                      className="w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 font-gotham text-sm text-white focus:border-escobets-yellow/50 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block font-gotham text-xs text-white/45">Tags (comma)</label>
                    <input
                      ref={tagsRef}
                      type="text"
                      key={initialArticle?.id ? `tg-${initialArticle.id}` : "new-tg"}
                      defaultValue={initialArticle?.tags?.join(", ") ?? ""}
                      placeholder="Soccer, Premier League"
                      className="w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 font-gotham text-sm text-white focus:border-escobets-yellow/50 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {mode === "edit" && articleId ? (
                <button
                  type="button"
                  onClick={() => void handleDelete()}
                  disabled={isSaving}
                  className="w-full rounded-xl border border-red-500/50 bg-red-950/20 py-3 font-gotham text-sm text-red-200 transition hover:bg-red-950/40 disabled:opacity-50"
                >
                  Delete article
                </button>
              ) : null}
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
