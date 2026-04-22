"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { OAuthSocialButtons } from "@/components/landing/oauth-social-buttons";
import { cn } from "@/lib/utils";

/** Match mockup: 1.333px #FFF border, pill radius; glass fill; soft autofill like signup. */
const loginInputClassName =
  "rounded-[0.99975rem] border-[1.333px] border-[#FFF] bg-transparent text-white " +
  "placeholder:text-white/80 transition-[border-color,box-shadow] duration-150 " +
  "backdrop-blur-[2px] " +
  "focus:border-escobets-yellow focus:outline-none " +
  "focus:ring-2 focus:ring-escobets-yellow/35 focus:ring-offset-0 " +
  "[&:-webkit-autofill]:!shadow-[inset_0_0_0_1000px_rgba(0,0,0,0.12)] " +
  "[&:-webkit-autofill]:![-webkit-text-fill-color:#fff] [&:-webkit-autofill]:![caret-color:#fff] " +
  "[&:-webkit-autofill]:![transition:background-color_50000s_ease-out_0s]";

const passwordToggleBtnClass =
  "absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center " +
  "rounded-md bg-transparent text-escobets-yellow " +
  "transition hover:text-white " +
  "focus-visible:outline focus-visible:ring-2 focus-visible:ring-escobets-yellow/50";

const passwordToggleIconClass =
  "h-[1.15rem] w-[1.15rem] stroke-[2.5] drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]";

/** Shown after /auth/telegram redirect when server env is incomplete (e.g. Vercel). */
const TELEGRAM_NOT_CONFIGURED_MESSAGE =
  "Telegram login cannot run on this deployment yet. In your host (e.g. Vercel → Project → Settings → Environment Variables), set TELEGRAM_BOT_TOKEN, SUPABASE_SERVICE_ROLE_KEY, NEXT_PUBLIC_SUPABASE_URL, and NEXT_PUBLIC_SUPABASE_ANON_KEY, then redeploy.";

function oauthCallbackErrorMessage(code: string | undefined): string | null {
  if (code === "oauth_exchange_failed") {
    return "Social sign-in failed. Please try again.";
  }
  if (code === "missing_oauth_code") {
    return "Sign-in was cancelled or incomplete.";
  }
  if (code === "telegram_invalid") {
    return "Telegram sign-in could not be verified. Please try again.";
  }
  if (code === "telegram_not_configured") {
    return TELEGRAM_NOT_CONFIGURED_MESSAGE;
  }
  if (code === "telegram_session_failed") {
    return "Could not start your session after Telegram. Please try again.";
  }
  if (code === "telegram_magiclink_failed") {
    return "Telegram was verified, but creating a sign-in link failed (check server logs and Supabase Email/auth settings).";
  }
  if (code === "telegram_otp_failed") {
    return "Telegram was verified, but the app could not attach your session (check server logs).";
  }
  return null;
}

export function LoginForm({
  className,
  oauthNextPath = "/account",
  initialOAuthError,
  initialSuccessMessage,
}: {
  className?: string;
  /** Post-login redirect for email login + OAuth (same-site path only). */
  oauthNextPath?: string;
  /** `error` query from `/auth/callback` redirect (e.g. `oauth_exchange_failed`). */
  initialOAuthError?: string | null;
  /** e.g. after password reset from `/reset-password`. */
  initialSuccessMessage?: string | null;
}) {
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);
  const [remember, setRemember] = React.useState(false);
  const [identifier, setIdentifier] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState<string | null>(() =>
    oauthCallbackErrorMessage(initialOAuthError ?? undefined)
  );
  const [successMessage, setSuccessMessage] = React.useState<string | null>(
    () => initialSuccessMessage ?? null
  );
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  /** Remove `error` / `message` from the URL so refresh/bookmark is clean; copy stays in state. */
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    let changed = false;
    if (params.has("error")) {
      params.delete("error");
      changed = true;
    }
    if (params.has("message")) {
      params.delete("message");
      changed = true;
    }
    if (!changed) return;
    const q = params.toString();
    const path = q ? `${window.location.pathname}?${q}` : window.location.pathname;
    window.history.replaceState(null, "", path);
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/auth/password-sign-in", {
        method: "POST",
        headers: { "content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          identifier: identifier.trim(),
          password,
        }),
      });
      const json = (await res.json()) as
        | { success: true; data: { ok: true } }
        | { success: false; error: { message: string } };

      if (!res.ok || !json.success) {
        setErrorMessage(
          json.success === false ? json.error.message : "Invalid email or password."
        );
        return;
      }

      const safeNext =
        oauthNextPath.startsWith("/") && !oauthNextPath.startsWith("//") ? oauthNextPath : "/account";
      router.push(safeNext);
      router.refresh();
    } catch {
      setErrorMessage("Could not reach the server. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[26rem] p-6 sm:p-7 md:p-8",
        "rounded-[1.25rem] sm:rounded-[1.5rem] md:rounded-[1.66625rem]",
        "border-[1.333px] border-[#AFAFAF]",
        "backdrop-blur-[35.32px]",
        "shadow-lg",
        className
      )}
      style={{
        background:
          "linear-gradient(321deg, rgba(191, 191, 191, 0.06) 5.98%, rgba(0, 0, 0, 0.00) 66.28%), rgba(0, 0, 0, 0.14)",
        boxShadow: "-10.664px 5.332px 6.665px 0 rgba(0, 0, 0, 0.24)",
      }}
    >
      <h1 className="font-gotham text-xl sm:text-2xl font-bold text-white">Login</h1>
      <p className="mt-1 font-gotham text-sm text-white/90">
        Glad you&apos;re back
      </p>

      <form
        className="login-form mt-5 sm:mt-6 flex flex-col gap-3 sm:gap-4"
        onSubmit={handleSubmit}
      >
        <Input
          type="text"
          value={identifier}
          onChange={(event) => setIdentifier(event.target.value)}
          placeholder="Email or username"
          autoComplete="username"
          aria-label="Email or username"
          required
          className={loginInputClassName}
        />
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
            autoComplete="current-password"
            aria-label="Password"
            required
            className={cn(loginInputClassName, "pr-12")}
          />
          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            className={passwordToggleBtnClass}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className={passwordToggleIconClass} />
            ) : (
              <Eye className={passwordToggleIconClass} />
            )}
          </button>
        </div>

        <label className="flex cursor-pointer items-center gap-2 font-gotham text-sm text-white">
          <Checkbox
            checked={remember}
            onCheckedChange={setRemember}
            aria-label="Remember me"
          />
          Remember me
        </label>

        <Button type="submit" className="w-full rounded-[0.83331rem]" disabled={isSubmitting}>
          {isSubmitting ? "Logging in..." : "Login"}
        </Button>
        {successMessage ? (
          <p className="text-sm leading-snug text-green-300" role="status">
            {successMessage}
          </p>
        ) : null}
        {errorMessage ? (
          <p
            className={cn(
              "text-sm leading-snug",
              errorMessage === TELEGRAM_NOT_CONFIGURED_MESSAGE
                ? "text-amber-200/90"
                : "text-red-300"
            )}
            role={errorMessage === TELEGRAM_NOT_CONFIGURED_MESSAGE ? "status" : "alert"}
          >
            {errorMessage}
          </p>
        ) : null}
      </form>

      <p className="mt-3 sm:mt-4 text-center">
        <Link
          href="/forgot-password"
          className="font-gotham text-sm text-white hover:text-escobets-yellow"
        >
          Forgot password ?
        </Link>
      </p>

      <div className="relative my-4 sm:my-6 flex items-center">
        <div className="flex-grow border-t border-white/30" />
        <span className="px-3 font-gotham text-sm text-white">Or</span>
        <div className="flex-grow border-t border-white/30" />
      </div>

      <OAuthSocialButtons nextPath={oauthNextPath} />

      <p className="mt-5 sm:mt-6 text-center font-gotham text-sm text-white">
        Don&apos;t have an account ?{" "}
        <Link
          href="/signup"
          className="text-escobets-yellow hover:underline"
        >
          Signup
        </Link>
      </p>
    </div>
  );
}
