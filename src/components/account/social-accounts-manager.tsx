"use client";

import * as React from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { isTelegramPlaceholderEmail } from "@/lib/account/telegram-profile-email";
import {
  findUserIdentity,
  isLinkIdentitySupported,
  supabaseLinkProvider,
} from "@/lib/account/social-links-from-user";
import type { SocialLink } from "@/types/account";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2, X } from "lucide-react";

import { SOCIAL_ICONS, socialProviderLabel } from "./social-provider-icons";

type Props = {
  open: boolean;
  onClose: () => void;
  /** Profile email (detects Telegram-only sign-in without an OAuth identity row). */
  accountEmail: string;
  onUpdated: () => void;
};

function providerLinked(
  p: SocialLink["provider"],
  user: User,
  accountEmail: string
): boolean {
  if (findUserIdentity(user, p)) return true;
  if (p === "telegram" && isTelegramPlaceholderEmail(accountEmail)) return true;
  return false;
}

const MANUAL_LINKING_DOCS =
  "https://supabase.com/docs/guides/auth/auth-identity-linking#manual-linking";

function isManualLinkingDisabledError(msg: string): boolean {
  return /manual\s*linking\s+is\s+disabled|manual_linking|enable_manual_linking/i.test(
    msg
  );
}

/**
 * Connect / disconnect OAuth providers via Supabase `linkIdentity` / `unlinkIdentity`.
 * Requires "Manual identity linking" enabled in Supabase → Authentication.
 */
export function SocialAccountsManager({ open, onClose, accountEmail, onUpdated }: Props) {
  const supabase = React.useMemo(() => createClient(), []);
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [actionKey, setActionKey] = React.useState<string | null>(null);
  const [message, setMessage] = React.useState<{ type: "ok" | "err"; text: string } | null>(null);

  const refreshUser = React.useCallback(async () => {
    const { data } = await supabase.auth.getUser();
    setUser(data.user);
  }, [supabase]);

  React.useEffect(() => {
    if (!open) return;
    setMessage(null);
    void refreshUser();
  }, [open, refreshUser]);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const linkOne = async (p: SocialLink["provider"]) => {
    if (!isLinkIdentitySupported(p)) return;
    const sp = supabaseLinkProvider(p);
    if (!sp) return;
    setActionKey(`link-${p}`);
    setMessage(null);
    setLoading(true);
    try {
      const origin = window.location.origin;
      const next = "/account";
      const redirectTo = `${origin}/auth/callback?next=${encodeURIComponent(next)}`;
      const { error } = await supabase.auth.linkIdentity({
        provider: sp,
        options: { redirectTo },
      });
      if (error) {
        setMessage({ type: "err", text: error.message });
        return;
      }
    } finally {
      setLoading(false);
      setActionKey(null);
    }
  };

  const unlinkOne = async (p: SocialLink["provider"]) => {
    setActionKey(`unlink-${p}`);
    setMessage(null);
    setLoading(true);
    try {
      const { data, error: guErr } = await supabase.auth.getUser();
      if (guErr || !data.user) {
        setMessage({ type: "err", text: guErr?.message ?? "Not signed in." });
        return;
      }
      const ident = findUserIdentity(data.user, p);
      if (!ident) {
        setMessage({ type: "err", text: "Could not find that login method on your account." });
        return;
      }
      const { error } = await supabase.auth.unlinkIdentity(ident);
      if (error) {
        setMessage({ type: "err", text: error.message });
        return;
      }
      setMessage({ type: "ok", text: "Disconnected." });
      await refreshUser();
      onUpdated();
    } finally {
      setLoading(false);
      setActionKey(null);
    }
  };

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:items-center">
      <button
        type="button"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        aria-label="Close"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal
        aria-labelledby="social-accounts-title"
        className="relative z-10 w-full max-w-md rounded-xl border border-white/15 bg-zinc-950 p-5 shadow-2xl"
      >
        <div className="mb-4 flex items-start justify-between gap-2">
          <h2 id="social-accounts-title" className="font-gotham text-lg font-semibold text-white">
            Social sign-in
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-white/50 transition hover:bg-white/10 hover:text-white"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="mb-4 font-gotham text-sm font-light text-white/60">
          Connect Google, X, or LinkedIn to sign in faster. You can disconnect anytime if you still
          have another way to sign in (e.g. password or email).
        </p>
        {message?.type === "err" && isManualLinkingDisabledError(message.text) ? (
          <div
            className="mb-4 rounded-lg border border-amber-500/35 bg-amber-500/10 px-3 py-3 font-gotham text-sm text-amber-100/95"
            role="status"
          >
            <p className="font-medium text-amber-50">Manual identity linking is off in Supabase</p>
            <p className="mt-2 font-light leading-relaxed text-amber-100/85">
              Connect requires this project setting. In the{" "}
              <strong className="font-medium text-amber-50">Supabase Dashboard</strong>: open your
              project → <strong className="font-medium">Authentication</strong> →{" "}
              <strong className="font-medium">Settings</strong> (or the Providers / Advanced
              section, depending on UI version) and turn on{" "}
              <strong className="font-medium">Manual identity linking</strong>. For local CLI, set{" "}
              <code className="rounded bg-black/30 px-1 text-[0.8rem]">enable_manual_linking = true</code>{" "}
              under <code className="rounded bg-black/30 px-1 text-[0.8rem]">[auth]</code> in{" "}
              <code className="rounded bg-black/30 px-1 text-[0.8rem]">supabase/config.toml</code>{" "}
              and restart Supabase.
            </p>
            <a
              href={MANUAL_LINKING_DOCS}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-escobets-yellow/95 underline-offset-2 hover:underline"
            >
              Supabase docs: identity linking
            </a>
          </div>
        ) : message ? (
          <p
            className={cn(
              "mb-3 rounded-lg border px-3 py-2 font-gotham text-sm",
              message.type === "ok"
                ? "border-escobets-yellow/30 text-escobets-yellow/90"
                : "border-red-500/40 text-red-200"
            )}
            role="status"
          >
            {message.text}
          </p>
        ) : null}
        <ul className="flex flex-col gap-2">
          {user &&
            (["google", "x", "linkedin", "telegram"] as const).map((p) => {
              const linked = providerLinked(p, user, accountEmail);
              const canLink = isLinkIdentitySupported(p);
              const label = socialProviderLabel(p);
              const icon = SOCIAL_ICONS[p]?.icon;
              const busy = loading && actionKey === `link-${p}`;
              const busyUn = loading && actionKey === `unlink-${p}`;

              return (
                <li
                  key={p}
                  className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-black/30 px-3 py-2.5"
                >
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span className="shrink-0 text-white/90">{icon}</span>
                    <span className="font-gotham text-sm font-medium text-white">{label}</span>
                    {linked ? (
                      <span className="rounded border border-escobets-yellow/40 px-1.5 font-gotham text-[10px] uppercase text-escobets-yellow/90">
                        Connected
                      </span>
                    ) : null}
                  </div>
                  <div className="shrink-0 text-right">
                    {p === "telegram" ? (
                      <span className="font-gotham text-xs text-white/45">
                        {linked && !findUserIdentity(user, "telegram")
                          ? "Primary Telegram sign-in"
                          : !linked
                            ? "Use Telegram on the login page"
                            : null}
                        {linked && findUserIdentity(user, "telegram") ? (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            disabled={loading}
                            onClick={() => void unlinkOne(p)}
                            className="ml-1 font-gotham text-xs text-red-300 hover:bg-red-500/10 hover:text-red-200"
                          >
                            {busyUn ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Disconnect"}
                          </Button>
                        ) : null}
                      </span>
                    ) : linked ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        disabled={loading}
                        onClick={() => void unlinkOne(p)}
                        className="font-gotham text-xs text-red-300 hover:bg-red-500/10 hover:text-red-200"
                      >
                        {busyUn ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Disconnect"}
                      </Button>
                    ) : canLink ? (
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        disabled={loading}
                        onClick={() => void linkOne(p)}
                        className="border-white/30 font-gotham text-xs text-white"
                      >
                        {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Connect"}
                      </Button>
                    ) : null}
                  </div>
                </li>
              );
            })}
        </ul>
        {!user && (
          <p className="mt-3 font-gotham text-sm text-white/50">
            <Loader2 className="mr-2 inline h-4 w-4 animate-spin" />
            Loading…
          </p>
        )}
      </div>
    </div>
  );
}
