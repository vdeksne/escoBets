"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type TelegramAuthPayload = false | Record<string, unknown>;

declare global {
  interface Window {
    Telegram?: {
      Login?: {
        auth: (
          options: { bot_id: string | number; request_access?: string },
          callback: (data: TelegramAuthPayload) => void
        ) => void;
      };
    };
  }
}

interface TelegramLoginWidgetProps {
  /** Same-site path after login (e.g. `/account`). */
  nextPath?: string;
  /**
   * `signin` — full Telegram account (magic link to `tg_*@` user).  
   * `link` — attach Telegram to the **current** session (`/auth/telegram-link`).
   */
  variant?: "signin" | "link";
  /** Outer layout (e.g. match Google/X circular buttons). */
  className?: string;
}

const TG_SCRIPT_SRC = "https://telegram.org/js/telegram-widget.js?23";
const TG_NEXT_COOKIE = "tg_login_next";

function waitForTelegramLoginApi(maxMs: number): Promise<void> {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const id = window.setInterval(() => {
      if (window.Telegram?.Login?.auth) {
        window.clearInterval(id);
        resolve();
      } else if (Date.now() - start > maxMs) {
        window.clearInterval(id);
        reject(new Error("Telegram Login API did not load (blocked script or React dev double-mount)."));
      }
    }, 50);
  });
}

function loadTelegramScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.Telegram?.Login?.auth) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const base = TG_SCRIPT_SRC.split("?")[0];
    const existing = document.querySelector(`script[src^="${base}"]`);
    if (existing) {
      waitForTelegramLoginApi(12_000).then(resolve).catch(reject);
      return;
    }
    const s = document.createElement("script");
    s.src = TG_SCRIPT_SRC;
    s.async = true;
    s.onload = () => {
      waitForTelegramLoginApi(12_000).then(resolve).catch(reject);
    };
    s.onerror = () => reject(new Error("Failed to load Telegram script"));
    document.body.appendChild(s);
  });
}

function authDataToSearchParams(data: Record<string, unknown>): string {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(data)) {
    if (v === undefined || v === null) continue;
    if (typeof v === "string" || typeof v === "number" || typeof v === "boolean") {
      sp.set(k, String(v));
    }
  }
  return sp.toString();
}

/**
 * Telegram Login via `Telegram.Login.auth` (popup). Custom icon from `/icons/telegram.png`.
 * Requires `TELEGRAM_BOT_TOKEN` on the server (`/api/auth/telegram/bot-id` exposes numeric bot id only).
 */
export function TelegramLoginWidget({
  nextPath = "/account",
  variant = "signin",
  className,
}: TelegramLoginWidgetProps) {
  const [botId, setBotId] = React.useState<string | null>(null);
  const [botIdLoaded, setBotIdLoaded] = React.useState(false);
  const [tokenMissingOnServer, setTokenMissingOnServer] = React.useState(false);
  const [scriptReady, setScriptReady] = React.useState(false);
  const [scriptIssue, setScriptIssue] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const res = await fetch("/api/auth/telegram/bot-id");
        const json = (await res.json()) as {
          ok?: boolean;
          botId?: string;
          code?: string;
        };
        if (!cancelled) {
          setTokenMissingOnServer(false);
        }
        if (!res.ok) {
          if (!cancelled) {
            setBotId(null);
            setBotIdLoaded(true);
          }
          return;
        }
        if (json.ok === false && json.code === "telegram_token_missing") {
          if (!cancelled) {
            setBotId(null);
            setTokenMissingOnServer(true);
            setBotIdLoaded(true);
          }
          return;
        }
        if (!cancelled) {
          const id =
            json.ok === true && json.botId && /^\d+$/.test(json.botId) ? json.botId : null;
          setBotId(id);
          setBotIdLoaded(true);
        }
      } catch {
        if (!cancelled) {
          setBotId(null);
          setTokenMissingOnServer(false);
          setBotIdLoaded(true);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  React.useEffect(() => {
    let cancelled = false;
    void loadTelegramScript()
      .then(() => {
        if (!cancelled) {
          setScriptReady(true);
          setScriptIssue(null);
        }
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          const msg = e instanceof Error ? e.message : "Telegram script failed.";
          setScriptIssue(msg);
          console.error("Telegram widget:", e);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const canUseTelegram = Boolean(botId && scriptReady && typeof window !== "undefined" && window.Telegram?.Login?.auth);

  const startTelegram = React.useCallback(() => {
    if (!botId) return;
    const login = window.Telegram?.Login?.auth;
    if (!login) return;

    if (variant === "signin") {
      const next = nextPath.startsWith("/") ? nextPath : "/account";
      const secure = window.location.protocol === "https:";
      document.cookie = `${TG_NEXT_COOKIE}=${encodeURIComponent(next)};path=/;max-age=600;SameSite=Lax${secure ? ";Secure" : ""}`;
    }

    const targetPath = variant === "link" ? "/auth/telegram-link" : "/auth/telegram";
    login({ bot_id: botId, request_access: "write" }, (data) => {
      if (data === false || typeof data !== "object" || data === null) return;
      const q = authDataToSearchParams(data as Record<string, unknown>);
      window.location.assign(`${window.location.origin}${targetPath}?${q}`);
    });
  }, [botId, nextPath, variant]);

  const disabledHint = tokenMissingOnServer
    ? "Telegram sign-in: set TELEGRAM_BOT_TOKEN on the server (.env.local or hosting env), restart the app, and link the domain in @BotFather."
    : "Telegram sign-in: add TELEGRAM_BOT_TOKEN and SUPABASE_SERVICE_ROLE_KEY to .env.local, restart dev, and set your domain with @BotFather /setdomain.";

  return (
    <div className="flex max-w-[11rem] flex-col items-center gap-1">
      <button
        type="button"
        className={cn(
          "relative h-10 w-10 shrink-0 overflow-hidden p-0",
          !canUseTelegram && "cursor-not-allowed opacity-40",
          className
        )}
        disabled={!canUseTelegram}
        onClick={startTelegram}
        aria-label={variant === "link" ? "Link Telegram to this account" : "Continue with Telegram"}
        title={
          canUseTelegram
            ? variant === "link"
              ? "Link Telegram to this account"
              : "Continue with Telegram"
            : disabledHint
        }
      >
        <Image
          src="/icons/telegram.png"
          alt=""
          fill
          sizes="40px"
          className="pointer-events-none object-contain p-1.5 select-none"
        />
        {botIdLoaded && !botId ? <span className="sr-only">Telegram sign-in not configured</span> : null}
      </button>
      {tokenMissingOnServer && !scriptIssue ? (
        <p className="max-w-[11rem] text-center text-[11px] leading-snug text-muted-foreground">
          Telegram login is off until <code className="text-[10px]">TELEGRAM_BOT_TOKEN</code> is set on the server and
          the app is restarted.
        </p>
      ) : null}
      {scriptIssue ? (
        <p className="text-center text-[11px] leading-snug text-red-300/95" role="alert">
          {scriptIssue}
        </p>
      ) : null}
    </div>
  );
}
