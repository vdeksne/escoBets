"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { OAuthSocialButtons } from "@/components/landing/oauth-social-buttons";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

/** Match mockup: 1.333px #FFF border, pill radius; glass fill (no solid grey). Yellow ring on focus. */
const loginInputClassName =
  "rounded-[0.99975rem] border-[1.333px] border-[#FFF] bg-transparent text-white " +
  "placeholder:text-white/80 transition-[border-color,box-shadow] duration-150 " +
  "focus:border-escobets-yellow focus:outline-none " +
  "focus:ring-2 focus:ring-escobets-yellow/35 focus:ring-offset-0";

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
}: {
  className?: string;
  /** Post-login redirect for email login + OAuth (same-site path only). */
  oauthNextPath?: string;
  /** `error` query from `/auth/callback` redirect (e.g. `oauth_exchange_failed`). */
  initialOAuthError?: string | null;
}) {
  const router = useRouter();
  const supabase = React.useMemo(() => createClient(), []);
  const [showPassword, setShowPassword] = React.useState(false);
  const [remember, setRemember] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState<string | null>(() =>
    oauthCallbackErrorMessage(initialOAuthError ?? undefined)
  );
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  /** Remove `error` from the URL so refresh/bookmark is clean; message stays in state. */
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (!params.has("error")) return;
    params.delete("error");
    const q = params.toString();
    const path = q ? `${window.location.pathname}?${q}` : window.location.pathname;
    window.history.replaceState(null, "", path);
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setIsSubmitting(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    const safeNext =
      oauthNextPath.startsWith("/") && !oauthNextPath.startsWith("//") ? oauthNextPath : "/account";
    router.push(safeNext);
    router.refresh();
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
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email"
          autoComplete="email"
          aria-label="Email"
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
            className={cn(loginInputClassName, "pr-10")}
          />
          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-escobets-yellow hover:opacity-80"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
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
