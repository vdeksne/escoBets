"use client";

import * as React from "react";
import Link from "next/link";
import { Eye, EyeOff, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { passwordRequirementsHint, validatePasswordStrength } from "@/lib/account/password-policy";
import { cn } from "@/lib/utils";

const inputClassName =
  [
    "flex h-10 w-full rounded-lg px-4 py-2 font-gotham text-white placeholder:text-white/50",
    "border border-white/30 bg-white/[0.07] shadow-inner shadow-black/30",
    "transition-[background-color,border-color,box-shadow] duration-150",
    "focus:border-escobets-yellow/80 focus:bg-white/[0.12] focus:outline-none",
    "focus:ring-2 focus:ring-escobets-yellow/35 focus:ring-offset-0",
  ].join(" ");

interface ChangePasswordProps {
  onSave?: (data: { current: string; new: string; confirm: string }) => void | Promise<void>;
  className?: string;
}

export function ChangePassword({ onSave, className }: ChangePasswordProps) {
  const [showCurrent, setShowCurrent] = React.useState(false);
  const [showNew, setShowNew] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [formError, setFormError] = React.useState<string | null>(null);
  const [formSuccess, setFormSuccess] = React.useState<string | null>(null);
  const formRef = React.useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    const form = e.currentTarget;
    const data = {
      current: (form.elements.namedItem("current") as HTMLInputElement).value,
      new: (form.elements.namedItem("new") as HTMLInputElement).value,
      confirm: (form.elements.namedItem("confirm") as HTMLInputElement).value,
    };

    if (!data.current || !data.new || !data.confirm) {
      setFormError("Please fill in all fields.");
      return;
    }
    if (data.new !== data.confirm) {
      setFormError("New password and confirmation do not match.");
      return;
    }
    const strength = validatePasswordStrength(data.new.trim());
    if (!strength.ok) {
      setFormError(strength.message);
      return;
    }
    if (data.current === data.new.trim()) {
      setFormError("New password must be different from your current password.");
      return;
    }

    if (!onSave) {
      setFormError("Password change is not available.");
      return;
    }

    try {
      setIsSaving(true);
      await onSave(data);
      setFormSuccess("Password updated.");
      formRef.current?.reset();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Could not update password.");
    } finally {
      setIsSaving(false);
    }
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

      <form ref={formRef} onSubmit={handleSubmit} className="change-password-form mt-6 space-y-4">
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
              autoComplete="current-password"
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
          <p className="mb-1.5 font-gotham text-xs text-white/45">{passwordRequirementsHint()}</p>
          <div className="relative">
            <input
              id="new"
              name="new"
              type={showNew ? "text" : "password"}
              placeholder="Enter password"
              autoComplete="new-password"
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
              autoComplete="new-password"
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

        {formError ? (
          <p className="font-gotham text-sm text-red-300" role="alert">
            {formError}
          </p>
        ) : null}
        {formSuccess ? (
          <p className="font-gotham text-sm text-green-300" role="status">
            {formSuccess}
          </p>
        ) : null}

        <Button
          type="submit"
          variant="outline"
          disabled={isSaving}
          className="mt-4 w-full rounded-lg border-2 border-escobets-yellow bg-transparent font-gotham text-white hover:bg-escobets-yellow/10 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? "Saving…" : "Save change"}
        </Button>
      </form>
    </div>
  );
}
