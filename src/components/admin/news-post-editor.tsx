"use client";

import { useCallback, useRef } from "react";
import Link from "next/link";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import LinkExtension from "@tiptap/extension-link";
import UnderlineExtension from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import {
  Undo2,
  Redo2,
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  Link2,
  ImageIcon,
  Code2,
  Quote,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  MoreHorizontal,
} from "lucide-react";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { cn } from "@/lib/utils";

interface NewsPostEditorProps {
  /** Initial values for edit mode – omit for new post */
  initialTitle?: string;
  initialCategory?: string;
  initialContent?: string;
  postId?: string;
}

function EditorToolbarButton({
  onClick,
  active,
  disabled,
  "aria-label": ariaLabel,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  "aria-label": string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded text-white/70 transition hover:bg-white/10 hover:text-white disabled:opacity-50",
        active && "bg-white/10 text-escobets-yellow"
      )}
    >
      {children}
    </button>
  );
}

export function NewsPostEditor({
  initialTitle = "",
  initialCategory = "",
  initialContent = "",
  postId,
}: NewsPostEditorProps) {
  const titleRef = useRef<HTMLInputElement>(null);
  const categoryRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Placeholder.configure({ placeholder: "Write your post content here..." }),
      Image.configure({ inline: false, allowBase64: true }),
      LinkExtension.configure({ openOnClick: false }),
      UnderlineExtension,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: initialContent || "<p></p>",
    editorProps: {
      attributes: {
        class:
          "min-h-[300px] px-4 py-4 font-gotham text-white/90 focus:outline-none [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mt-4 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-3 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:mt-2 [&_p]:my-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-2 [&_li]:my-1 [&_blockquote]:border-l-4 [&_blockquote]:border-escobets-yellow [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-2 [&_blockquote]:text-white/80 [&_pre]:bg-white/10 [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:my-2 [&_pre]:font-mono [&_pre]:text-sm [&_img]:rounded-lg [&_img]:my-2",
      },
    },
    immediatelyRender: false,
  });

  const setLink = useCallback(() => {
    if (!editor) return;
    const url = window.prompt("Enter URL");
    if (url) {
      editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    }
  }, [editor]);

  const addImage = useCallback(() => {
    if (!editor) return;
    const url = window.prompt("Enter image URL");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const handleSave = useCallback(() => {
    // TODO: backend - submit form data
    const title = titleRef.current?.value ?? "";
    const category = categoryRef.current?.value ?? "";
    const content = editor?.getHTML() ?? "";
    console.log("Save:", { title, category, content, postId });
  }, [editor, postId]);

  const handleDelete = useCallback(() => {
    // TODO: backend - delete post
    if (window.confirm("Are you sure you want to delete this post?")) {
      console.log("Delete:", postId);
    }
  }, [postId]);

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <Header />
      <main className="flex-1 px-4 py-8 md:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/updates"
            className="mb-6 inline-flex items-center gap-2 font-gotham text-sm text-escobets-yellow hover:underline"
          >
            ← Back to Updates
          </Link>

          <div className="rounded-xl border border-white/10 bg-escobets-gray-card">
            {/* Title & Category */}
            <div className="space-y-4 border-b border-white/10 p-4 md:p-6">
              <div>
                <label htmlFor="post-title" className="mb-2 block font-gotham text-sm font-medium text-white/70">
                  Title
                </label>
                <input
                  ref={titleRef}
                  id="post-title"
                  type="text"
                  defaultValue={initialTitle}
                  placeholder="Title"
                  className="w-full rounded-lg border border-white/20 bg-black px-4 py-3 font-gotham text-white placeholder:text-white/40 focus:border-escobets-yellow/50 focus:outline-none focus:ring-1 focus:ring-escobets-yellow/30"
                />
              </div>
              <div>
                <label htmlFor="post-category" className="mb-2 block font-gotham text-sm font-medium text-white/70">
                  Category
                </label>
                <input
                  ref={categoryRef}
                  id="post-category"
                  type="text"
                  defaultValue={initialCategory}
                  placeholder="Category"
                  className="w-full rounded-lg border border-white/20 bg-black px-4 py-3 font-gotham text-white placeholder:text-white/40 focus:border-escobets-yellow/50 focus:outline-none focus:ring-1 focus:ring-escobets-yellow/30"
                />
              </div>
            </div>

            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-1 border-b border-white/10 p-2">
              <EditorToolbarButton
                onClick={() => editor?.chain().focus().undo().run()}
                disabled={!editor?.can().undo()}
                aria-label="Undo"
              >
                <Undo2 className="h-4 w-4" />
              </EditorToolbarButton>
              <EditorToolbarButton
                onClick={() => editor?.chain().focus().redo().run()}
                disabled={!editor?.can().redo()}
                aria-label="Redo"
              >
                <Redo2 className="h-4 w-4" />
              </EditorToolbarButton>
              <div className="mx-1 h-6 w-px bg-white/20" aria-hidden />
              <EditorToolbarButton
                onClick={() => editor?.chain().focus().toggleBold().run()}
                active={editor?.isActive("bold")}
                aria-label="Bold"
              >
                <Bold className="h-4 w-4" />
              </EditorToolbarButton>
              <EditorToolbarButton
                onClick={() => editor?.chain().focus().toggleItalic().run()}
                active={editor?.isActive("italic")}
                aria-label="Italic"
              >
                <Italic className="h-4 w-4" />
              </EditorToolbarButton>
              <EditorToolbarButton
                onClick={() => editor?.chain().focus().toggleStrike().run()}
                active={editor?.isActive("strike")}
                aria-label="Strikethrough"
              >
                <Strikethrough className="h-4 w-4" />
              </EditorToolbarButton>
              <EditorToolbarButton
                onClick={() => editor?.chain().focus().toggleUnderline().run()}
                active={editor?.isActive("underline")}
                aria-label="Underline"
              >
                <UnderlineIcon className="h-4 w-4" />
              </EditorToolbarButton>
              <div className="mx-1 h-6 w-px bg-white/20" aria-hidden />
              <EditorToolbarButton
                onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
                active={editor?.isActive("heading", { level: 1 })}
                aria-label="Heading 1"
              >
                <span className="font-gotham text-xs font-bold">H1</span>
              </EditorToolbarButton>
              <EditorToolbarButton
                onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                active={editor?.isActive("heading", { level: 2 })}
                aria-label="Heading 2"
              >
                <span className="font-gotham text-xs font-bold">H2</span>
              </EditorToolbarButton>
              <EditorToolbarButton
                onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
                active={editor?.isActive("heading", { level: 3 })}
                aria-label="Heading 3"
              >
                <span className="font-gotham text-xs font-bold">H3</span>
              </EditorToolbarButton>
              <div className="mx-1 h-6 w-px bg-white/20" aria-hidden />
              <EditorToolbarButton
                onClick={() => editor?.chain().focus().toggleBulletList().run()}
                active={editor?.isActive("bulletList")}
                aria-label="Bullet list"
              >
                <List className="h-4 w-4" />
              </EditorToolbarButton>
              <EditorToolbarButton
                onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                active={editor?.isActive("orderedList")}
                aria-label="Ordered list"
              >
                <ListOrdered className="h-4 w-4" />
              </EditorToolbarButton>
              <EditorToolbarButton
                onClick={setLink}
                active={editor?.isActive("link")}
                aria-label="Insert link"
              >
                <Link2 className="h-4 w-4" />
              </EditorToolbarButton>
              <EditorToolbarButton onClick={addImage} aria-label="Insert image">
                <ImageIcon className="h-4 w-4" />
              </EditorToolbarButton>
              <EditorToolbarButton
                onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
                active={editor?.isActive("codeBlock")}
                aria-label="Code block"
              >
                <Code2 className="h-4 w-4" />
              </EditorToolbarButton>
              <EditorToolbarButton
                onClick={() => editor?.chain().focus().toggleBlockquote().run()}
                active={editor?.isActive("blockquote")}
                aria-label="Blockquote"
              >
                <Quote className="h-4 w-4" />
              </EditorToolbarButton>
              <div className="mx-1 h-6 w-px bg-white/20" aria-hidden />
              <EditorToolbarButton
                onClick={() => editor?.chain().focus().setTextAlign("left").run()}
                active={editor?.isActive({ textAlign: "left" })}
                aria-label="Align left"
              >
                <AlignLeft className="h-4 w-4" />
              </EditorToolbarButton>
              <EditorToolbarButton
                onClick={() => editor?.chain().focus().setTextAlign("center").run()}
                active={editor?.isActive({ textAlign: "center" })}
                aria-label="Align center"
              >
                <AlignCenter className="h-4 w-4" />
              </EditorToolbarButton>
              <EditorToolbarButton
                onClick={() => editor?.chain().focus().setTextAlign("right").run()}
                active={editor?.isActive({ textAlign: "right" })}
                aria-label="Align right"
              >
                <AlignRight className="h-4 w-4" />
              </EditorToolbarButton>
              <EditorToolbarButton
                onClick={() => editor?.chain().focus().setTextAlign("justify").run()}
                active={editor?.isActive({ textAlign: "justify" })}
                aria-label="Justify"
              >
                <AlignJustify className="h-4 w-4" />
              </EditorToolbarButton>
              <EditorToolbarButton onClick={() => {}} aria-label="More options">
                <MoreHorizontal className="h-4 w-4" />
              </EditorToolbarButton>
            </div>

            {/* Editor content */}
            <div className="min-h-[320px]">
              <EditorContent editor={editor} />
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-8 flex justify-center gap-4">
            <button
              type="button"
              onClick={handleSave}
              className="rounded-lg border-2 border-white/20 bg-black px-8 py-3 font-gotham font-medium text-white transition hover:bg-white/10"
            >
              Save
            </button>
            {postId && (
              <button
                type="button"
                onClick={handleDelete}
                className="rounded-lg border-2 border-white/20 bg-black px-8 py-3 font-gotham font-medium text-white transition hover:bg-white/10"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
