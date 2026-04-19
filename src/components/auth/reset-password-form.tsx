"use client";

import * as React from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { validatePasswordStrength } from "@/lib/account/password-policy";
import { cn } from "@/lib/utils";

const inputClassName =
  "rounded-[0.99975rem] border-[1.333px] border-[#FFF] bg-transparent text-white " +
  "placeholder:text-white/80 transition-[border-color,box-shadow] duration-150 " +
  "focus:border-escobets-yellow focus:outline-none " +
  "focus:ring-2 focus:ring-escobets-yellow/35 focus:ring-offset-0";

function decodeParam(raw: string | null): string | null {
  if (!raw) return null;
  return raw.replace(/\+/g, " ");
}

/**
 * Supabase recovery emails redirect here with `?code=…` (PKCE) or hash tokens (implicit).
 * Exchanges the session, then lets the user set a new password (same flow as Supabase recommends).
 */
export function ResetPasswordForm({ className }: { className?: string }) {
  const supabase = React.useMemo(() => createClient(), []);
  const [phase, setPhase] = React.useState<"loading" | "ready" | "error">("loading");
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [password, setPassword] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const [showPw, setShowPw] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;

    void (async () => {
      try {
        const url = new URL(window.location.href);
        const hashParams = new URLSearchParams(url.hash.replace(/^#/, ""));
        const err = url.searchParams.get("error") ?? hashParams.get("error");
        const errDesc = decodeParam(
          url.searchParams.get("error_description") ?? hashParams.get("error_description")
        );
        const errCode = hashParams.get("error_code") ?? url.searchParams.get("error_code");
        if (err || errCode === "otp_expired") {
          if (!cancelled) {
            const expiredLike =
              errCode === "otp_expired" ||
              errDesc?.toLowerCase().includes("expired") ||
              errDesc?.toLowerCase().includes("invalid");
            setErrorMessage(
              expiredLike
                ? [
                    errDesc ||
                      "This reset link was already used or is no longer valid.",
                    "If it was sent in Telegram, an automatic link preview can open the URL before you tap it and invalidate the link. Request a new reset and open the link in your browser (copy URL or long-press → Open).",
                  ].join(" ")
                : errDesc || "This reset link is invalid. Request a new one from Forgot password or your account settings."
            );
            setPhase("error");
          }
          return;
        }

        const code = url.searchParams.get("code");
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(window.location.search);
          if (error) {
            if (!cancelled) {
              setErrorMessage(error.message);
              setPhase("error");
            }
            return;
          }
          window.history.replaceState(null, "", url.pathname);
        }

        for (let i = 0; i < 8; i++) {
          const {
            data: { session },
          } = await supabase.auth.getSession();
          if (session) {
            if (!cancelled) setPhase("ready");
            return;
          }
          await new Promise((r) => setTimeout(r, 120));
        }

        if (!cancelled) {
          setErrorMessage(
            "We could not confirm your reset link. It may have expired — request a new reset email."
          );
          setPhase("error");
        }
      } catch (e) {
        if (!cancelled) {
          setErrorMessage(e instanceof Error ? e.message : "Something went wrong.");
          setPhase("error");
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [supabase]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!password || !confirm) {
      setErrorMessage("Enter and confirm your new password.");
      return;
    }
    if (password !== confirm) {
      setErrorMessage("Passwords do not match.");
      return;
    }
    const strength = validatePasswordStrength(password);
    if (!strength.ok) {
      setErrorMessage(strength.message);
      return;
    }

    setIsSubmitting(true);
    const { error } = await supabase.auth.updateUser({ password });
    setIsSubmitting(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    await supabase.auth.signOut();
    window.location.assign("/login?message=password_reset");
  };

  if (phase === "loading") {
    return (
      <div
        className={cn(
          "mx-auto w-full max-w-[26rem] p-6 sm:p-7 md:p-8",
          "rounded-[1.25rem] border-[1.333px] border-[#AFAFAF] backdrop-blur-[35.32px]",
          className
        )}
        style={{
          background:
            "linear-gradient(321deg, rgba(191, 191, 191, 0.06) 5.98%, rgba(0, 0, 0, 0.00) 66.28%), rgba(0, 0, 0, 0.14)",
        }}
      >
        <p className="font-gotham text-center text-sm text-white/80">Confirming reset link…</p>
      </div>
    );
  }

  if (phase === "error") {
    return (
      <div
        className={cn(
          "mx-auto w-full max-w-[26rem] p-6 sm:p-7 md:p-8",
          "rounded-[1.25rem] border-[1.333px] border-[#AFAFAF] backdrop-blur-[35.32px]",
          className
        )}
        style={{
          background:
            "linear-gradient(321deg, rgba(191, 191, 191, 0.06) 5.98%, rgba(0, 0, 0, 0.00) 66.28%), rgba(0, 0, 0, 0.14)",
        }}
      >
        <h1 className="font-gotham text-xl font-bold text-white">Reset link problem</h1>
        <p className="mt-3 font-gotham text-sm text-red-300" role="alert">
          {errorMessage}
        </p>
        <p className="mt-5 text-center font-gotham text-sm text-white">
          <Link prefetch={false} href="/forgot-password" className="text-escobets-yellow hover:underline">
            Request a new reset link
          </Link>
          {" · "}
          <Link prefetch={false} href="/login" className="text-escobets-yellow hover:underline">
            Back to login
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[26rem] p-6 sm:p-7 md:p-8",
        "rounded-[1.25rem] border-[1.333px] border-[#AFAFAF] backdrop-blur-[35.32px]",
        className
      )}
      style={{
        background:
          "linear-gradient(321deg, rgba(191, 191, 191, 0.06) 5.98%, rgba(0, 0, 0, 0.00) 66.28%), rgba(0, 0, 0, 0.14)",
        boxShadow: "-10.664px 5.332px 6.665px 0 rgba(0, 0, 0, 0.24)",
      }}
    >
      <h1 className="font-gotham text-xl sm:text-2xl font-bold text-white">Set new password</h1>
      <p className="mt-1 font-gotham text-sm text-white/90">
        Choose a strong password you have not used elsewhere.
      </p>

      <form className="mt-5 flex flex-col gap-3 sm:gap-4" onSubmit={handleSubmit}>
        <div className="relative">
          <label htmlFor="reset-password" className="sr-only">
            New password
          </label>
          <Input
            id="reset-password"
            type={showPw ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New password"
            autoComplete="new-password"
            required
            className={cn(inputClassName, "pr-10")}
          />
          <button
            type="button"
            onClick={() => setShowPw((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-escobets-yellow hover:opacity-80"
            aria-label={showPw ? "Hide password" : "Show password"}
          >
            {showPw ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        <div className="relative">
          <label htmlFor="reset-password-confirm" className="sr-only">
            Confirm new password
          </label>
          <Input
            id="reset-password-confirm"
            type={showConfirm ? "text" : "password"}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Confirm new password"
            autoComplete="new-password"
            required
            className={cn(inputClassName, "pr-10")}
          />
          <button
            type="button"
            onClick={() => setShowConfirm((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-escobets-yellow hover:opacity-80"
            aria-label={showConfirm ? "Hide password" : "Show password"}
          >
            {showConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>

        {errorMessage ? (
          <p className="font-gotham text-sm text-red-300" role="alert">
            {errorMessage}
          </p>
        ) : null}

        <Button type="submit" className="w-full rounded-[0.83331rem]" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : "Save new password"}
        </Button>
      </form>

      <p className="mt-5 text-center font-gotham text-sm text-white">
        <Link prefetch={false} href="/login" className="text-escobets-yellow hover:underline">
          Back to login
        </Link>
      </p>
    </div>
  );
}
