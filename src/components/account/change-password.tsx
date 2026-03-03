"use client";

import * as React from "react";
import Link from "next/link";
import { Eye, EyeOff, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const inputClassName =
  "flex h-10 w-full rounded-lg border border-white/40 bg-black/40 px-4 py-2 font-gotham text-white placeholder:text-white/50 focus:border-white focus:outline-none focus:ring-1 focus:ring-white/50";

interface ChangePasswordProps {
  onSave?: (data: { current: string; new: string; confirm: string }) => void;
  className?: string;
}

export function ChangePassword({ onSave, className }: ChangePasswordProps) {
  const [showCurrent, setShowCurrent] = React.useState(false);
  const [showNew, setShowNew] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = {
      current: (form.elements.namedItem("current") as HTMLInputElement).value,
      new: (form.elements.namedItem("new") as HTMLInputElement).value,
      confirm: (form.elements.namedItem("confirm") as HTMLInputElement).value,
    };
    onSave?.(data);
  };

  return (
    <div
      className={cn(
        "rounded-xl border border-white/10 bg-black/40 p-6",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <h2 className="font-gotham text-lg font-semibold text-white">
          Change Password
        </h2>
        <button
          type="button"
          className="flex items-center gap-1 font-gotham text-sm text-white/70 hover:text-white"
        >
          <HelpCircle className="h-4 w-4" />
          Need help
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="current" className="mb-1 block font-gotham text-sm text-white/70">
            Current Password
          </label>
          <div className="relative">
            <input
              id="current"
              name="current"
              type={showCurrent ? "text" : "password"}
              placeholder="Enter password"
              className={inputClassName}
            />
            <button
              type="button"
              onClick={() => setShowCurrent((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
              aria-label={showCurrent ? "Hide password" : "Show password"}
            >
              {showCurrent ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          <Link
            href="/forgot-password"
            className="mt-1 block font-gotham text-sm text-escobets-yellow hover:underline"
          >
            Forgot Current Password? Click here
          </Link>
        </div>

        <div>
          <label htmlFor="new" className="mb-1 block font-gotham text-sm text-white/70">
            New Password
          </label>
          <div className="relative">
            <input
              id="new"
              name="new"
              type={showNew ? "text" : "password"}
              placeholder="Enter password"
              className={inputClassName}
            />
            <button
              type="button"
              onClick={() => setShowNew((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
              aria-label={showNew ? "Hide password" : "Show password"}
            >
              {showNew ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="confirm" className="mb-1 block font-gotham text-sm text-white/70">
            Re-enter Password
          </label>
          <div className="relative">
            <input
              id="confirm"
              name="confirm"
              type={showConfirm ? "text" : "password"}
              placeholder="Enter password"
              className={inputClassName}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
              aria-label={showConfirm ? "Hide password" : "Show password"}
            >
              {showConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          variant="outline"
          className="mt-4 w-full rounded-lg border-2 border-escobets-yellow bg-transparent font-gotham text-white hover:bg-escobets-yellow/10"
        >
          Save Change
        </Button>
      </form>
    </div>
  );
}
