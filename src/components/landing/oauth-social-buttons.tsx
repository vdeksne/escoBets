"use client";

import * as React from "react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { TelegramLoginWidget } from "@/components/landing/telegram-login-widget";

const oauthButtonClass =
  "flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black text-white " +
  "hover:border-escobets-yellow hover:text-escobets-yellow transition-colors";

function GoogleMark() {
  return (
    <span className="font-gotham text-sm font-medium" aria-hidden>
      G
    </span>
  );
}

function XMark() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

type OAuthProvider = "google" | "x";

interface OAuthSocialButtonsProps {
  /** Path after OAuth (must stay same-site; validated in `/auth/callback`). */
  nextPath?: string;
  className?: string;
}

/**
 * Google + X via Supabase OAuth; Telegram via Login Widget → `/auth/telegram`.
 */
export function OAuthSocialButtons({ nextPath = "/account", className }: OAuthSocialButtonsProps) {
  const supabase = React.useMemo(() => createClient(), []);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const redirectTo = React.useMemo(() => {
    if (typeof window === "undefined") return "";
    const next = nextPath.startsWith("/") ? nextPath : "/account";
    return `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;
  }, [nextPath]);

  const startOAuth = async (provider: OAuthProvider) => {
    setErrorMessage(null);
    if (!redirectTo) return;

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo },
    });
    if (error) setErrorMessage(error.message);
  };

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => startOAuth("google")}
          aria-label="Continue with Google"
          className={oauthButtonClass}
        >
          <GoogleMark />
        </button>
        <button
          type="button"
          onClick={() => startOAuth("x")}
          aria-label="Continue with X"
          className={oauthButtonClass}
        >
          <XMark />
        </button>
        <TelegramLoginWidget nextPath={nextPath} className={oauthButtonClass} />
      </div>
      {errorMessage ? (
        <p className="text-center text-sm text-red-300" role="alert">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}
