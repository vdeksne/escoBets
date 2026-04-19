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

type ResetStatus =
  | null
  | {
      variant: "success" | "error";
      lines: string[];
      xUrl?: string | null;
    };

export function ChangePassword({ onSave, className }: ChangePasswordProps) {
  const [showCurrent, setShowCurrent] = React.useState(false);
  const [showNew, setShowNew] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [isRequestingReset, setIsRequestingReset] = React.useState(false);
  const [formError, setFormError] = React.useState<string | null>(null);
  const [formSuccess, setFormSuccess] = React.useState<string | null>(null);
  const [resetStatus, setResetStatus] = React.useState<ResetStatus>(null);
  const formRef = React.useRef<HTMLFormElement>(null);

  const requestPasswordReset = React.useCallback(async () => {
    setResetStatus(null);
    setFormError(null);
    setFormSuccess(null);
    setIsRequestingReset(true);
    try {
      const res = await fetch("/api/account/request-password-reset", {
        method: "POST",
        credentials: "include",
      });
      const json = (await res.json()) as
        | {
            success: true;
            data: {
              emailSent: boolean;
              telegramSent: boolean;
              telegramDetail?: string;
              supportXUrl: string | null;
            };
          }
        | {
            success: false;
            error: {
              message: string;
              details?: {
                supportXUrl?: string | null;
                attemptedRedirectTo?: string;
                supabaseEmailError?: string | null;
                telegramDetail?: string | null;
                synthetic?: boolean;
              };
            };
          };

      if (res.ok && json.success) {
        const { emailSent, telegramSent, telegramDetail, supportXUrl } = json.data;
        const lines: string[] = [
          "Supabase sends a secure reset link (not a new password in the email body).",
        ];
        if (emailSent) {
          lines.push("Check your inbox for the password reset link from Supabase.");
        } else if (telegramSent) {
          lines.push(
            "This account has no personal email on file — we sent the reset link to your Telegram from the EscoBets bot."
          );
        } else {
          lines.push("We could not send a reset email for this account.");
        }
        if (telegramSent && emailSent) {
          lines.push("We also sent the same reset link to your Telegram.");
        }
        if (!telegramSent && telegramDetail) {
          lines.push(`Telegram: ${telegramDetail}`);
        }
        if (supportXUrl) {
          lines.push("You can also contact support on X using the link below.");
        }
        setResetStatus({ variant: "success", lines, xUrl: supportXUrl });
        return;
      }

      const d = json.success === false ? json.error.details : undefined;
      const xUrl = d?.supportXUrl ?? null;
      const msg =
        json.success === false ? json.error.message : "Could not send reset instructions.";
      const lines = [msg];
      if (d?.supabaseEmailError) {
        lines.push(`Supabase: ${d.supabaseEmailError}`);
      }
      if (d?.attemptedRedirectTo) {
        lines.push(
          `Add this exact URL to Supabase → Authentication → URL configuration → Redirect URLs: ${d.attemptedRedirectTo}`
        );
      }
      if (d?.telegramDetail) {
        lines.push(`Telegram: ${d.telegramDetail}`);
      }
      setResetStatus({
        variant: "error",
        lines,
        xUrl: xUrl ?? null,
      });
    } catch {
      setResetStatus({
        variant: "error",
        lines: ["Could not reach the server. Try again in a moment."],
      });
    } finally {
      setIsRequestingReset(false);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);
    setResetStatus(null);

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
          onClick={() => void requestPasswordReset()}
          disabled={isRequestingReset}
          className="flex items-center gap-1 font-gotham text-sm text-white/70 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-escobets-yellow disabled:opacity-50"
        >
          <HelpCircle className="h-4 w-4 shrink-0" aria-hidden />
          {isRequestingReset ? "Sending…" : "Need help"}
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
          <button
            type="button"
            onClick={() => void requestPasswordReset()}
            disabled={isRequestingReset}
            className="mt-1 block w-full text-left font-gotham text-sm text-escobets-yellow underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-escobets-yellow disabled:opacity-50"
          >
            {isRequestingReset ? "Sending reset…" : "Forgot current password? Click here"}
          </button>
          {resetStatus ? (
            <div
              className={cn(
                "mt-3 rounded-lg border px-3 py-2.5 font-gotham text-xs leading-snug sm:text-sm",
                resetStatus.variant === "success"
                  ? "border-green-400/40 bg-green-950/35 text-green-100"
                  : "border-red-400/40 bg-red-950/30 text-red-100"
              )}
              role={resetStatus.variant === "success" ? "status" : "alert"}
            >
              <ul className="list-inside list-disc space-y-1">
                {resetStatus.lines.map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
              {resetStatus.xUrl ? (
                <p className="mt-2">
                  <Link
                    href={resetStatus.xUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-escobets-yellow underline underline-offset-2 hover:opacity-90"
                  >
                    Open X (support)
                  </Link>
                </p>
              ) : null}
              <p className="mt-2 text-white/55">
                <Link
                  href="/forgot-password?from=account"
                  className="text-escobets-yellow/95 underline-offset-2 hover:underline"
                >
                  Open forgot-password page
                </Link>{" "}
                if you prefer to type your email manually.
              </p>
            </div>
          ) : null}
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
