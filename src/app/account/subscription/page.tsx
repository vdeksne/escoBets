"use client";

import * as React from "react";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { SubscriptionAccountView } from "@/components/subscription-account/subscription-account-view";
import type { SubscriptionAccountData } from "@/types/subscription-account";

function parseSubscriptionApiError(
  res: Response,
  body: unknown
): { message: string; code: string | null } {
  if (res.status === 503) {
    const b = body as { error?: { code?: string; message?: string } } | { error?: string };
    const nested = b && typeof b === "object" && "error" in b ? b.error : null;
    if (nested && typeof nested === "object" && "message" in nested && typeof nested.message === "string") {
      return { code: nested.code ?? "STRIPE_NOT_CONFIGURED", message: nested.message };
    }
  }
  const b = body as { error?: { message?: string; code?: string } | string };
  if (b && typeof b === "object" && "error" in b) {
    const e = b.error;
    if (typeof e === "string") {
      return { code: null, message: e };
    }
    if (e && typeof e === "object" && "message" in e && typeof e.message === "string") {
      return { code: typeof e.code === "string" ? e.code : null, message: e.message };
    }
  }
  return { code: null, message: `Request failed (${res.status})` };
}

export default function AccountSubscriptionPage() {
  const [data, setData] = React.useState<SubscriptionAccountData | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [stripeErrorCode, setStripeErrorCode] = React.useState<string | null>(null);

  React.useEffect(() => {
    let alive = true;
    fetch("/api/account/subscription")
      .then(async (r) => {
        const body = await r.json().catch(() => ({}));
        if (!r.ok) {
          const { message, code } = parseSubscriptionApiError(r, body);
          const err = new Error(message) as Error & { code?: string | null };
          err.code = code;
          throw err;
        }
        return body as SubscriptionAccountData;
      })
      .then((d) => {
        if (!alive) return;
        setData(d);
        setError(null);
        setStripeErrorCode(null);
      })
      .catch((e) => {
        if (!alive) return;
        const code = (e as { code?: string | null })?.code ?? null;
        setStripeErrorCode(typeof code === "string" ? code : null);
        setError(e instanceof Error ? e.message : "Failed to load subscription");
      });
    return () => {
      alive = false;
    };
  }, []);

  const openPortal = React.useCallback(() => {
    window.location.assign("/api/stripe/portal");
  }, []);

  const isBillingUnavailable = stripeErrorCode === "STRIPE_NOT_CONFIGURED";

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <Header />

      <main className="flex-1 px-4 py-8">
        <div className="mx-auto max-w-4xl">
          {error ? (
            <div className="rounded-xl border border-white/10 bg-black/40 p-6">
              <h1 className="font-gotham text-lg font-semibold text-white">
                Billing &amp; invoices
              </h1>
              <p className="mt-2 font-gotham text-sm text-white/70 whitespace-pre-line">{error}</p>
              {isBillingUnavailable ? (
                <p className="mt-4 font-gotham text-xs text-white/45">
                  Use <code className="text-escobets-yellow/80">sk_test_…</code> in development and{" "}
                  <code className="text-escobets-yellow/80">sk_live_…</code> in production. Enable
                  the Billing customer portal in your{" "}
                  <a
                    className="text-escobets-yellow hover:underline"
                    href="https://dashboard.stripe.com/settings/billing/portal"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Stripe Dashboard
                  </a>{" "}
                  if the portal still fails after adding keys.
                </p>
              ) : null}
              {!isBillingUnavailable ? (
                <button
                  type="button"
                  onClick={openPortal}
                  className="mt-5 rounded-lg bg-escobets-yellow px-4 py-2 font-gotham font-medium text-black hover:bg-escobets-yellow/90"
                >
                  Open billing portal
                </button>
              ) : null}
            </div>
          ) : !data ? (
            <div className="rounded-xl border border-white/10 bg-black/40 p-6">
              <h1 className="font-gotham text-lg font-semibold text-white">
                Billing &amp; invoices
              </h1>
              <p className="mt-2 font-gotham text-sm text-white/60">
                Loading your subscription…
              </p>
            </div>
          ) : (
            <SubscriptionAccountView
              data={data}
              onUpgrade={openPortal}
              onChangePayment={openPortal}
            />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
