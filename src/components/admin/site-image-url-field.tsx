"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Loader2, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { uploadSiteSettingsImage } from "@/lib/admin/site-image-upload";
import { cn } from "@/lib/utils";

type Props = {
  id: string;
  label: string;
  value: string;
  onUrlChange: (url: string) => void;
  inputClassName: string;
  labelClassName: string;
};

export function SiteImageUrlField({
  id,
  label,
  value,
  onUrlChange,
  inputClassName,
  labelClassName,
}: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setErr(null);
    setBusy(true);
    try {
      const url = await uploadSiteSettingsImage(file);
      onUrlChange(url);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  }

  const showPreview = value.trim().length > 0;

  return (
    <div>
      <label className={labelClassName} htmlFor={id}>
        {label}
      </label>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch sm:gap-2">
          <Input
            id={id}
            className={cn(inputClassName, "min-w-0 flex-1")}
            value={value}
            onChange={(e) => onUrlChange(e.target.value)}
            placeholder="/images/... or URL after upload"
            autoComplete="off"
          />
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="sr-only"
            onChange={onFileChange}
            aria-hidden
            tabIndex={-1}
          />
          <button
            type="button"
            disabled={busy}
            onClick={() => fileRef.current?.click()}
            className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg border border-white/15 bg-zinc-950 px-3 py-2 font-gotham text-sm font-medium text-white/80 transition hover:bg-zinc-900 disabled:opacity-50 sm:w-36"
          >
            {busy ? (
              <Loader2 className="h-4 w-4 shrink-0 animate-spin" aria-hidden />
            ) : (
              <Upload className="h-4 w-4 shrink-0" aria-hidden />
            )}
            Upload
          </button>
        </div>
        {err ? (
          <p className="font-gotham text-xs font-light text-red-400" role="alert">
            {err}
          </p>
        ) : null}
        {showPreview && (
          <div className="relative max-h-28 max-w-md overflow-hidden rounded-md border border-white/[0.06] bg-zinc-950 p-1.5">
            <Image
              src={value}
              alt=""
              width={640}
              height={240}
              className="h-auto max-h-24 w-auto max-w-full object-contain object-left"
              unoptimized={value.startsWith("http://")}
            />
          </div>
        )}
      </div>
    </div>
  );
}
