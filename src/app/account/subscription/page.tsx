"use client";

import * as React from "react";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { SubscriptionAccountView } from "@/components/subscription-account/subscription-account-view";
import type { SubscriptionAccountData } from "@/types/subscription-account";

export default function AccountSubscriptionPage() {
  const [data, setData] = React.useState<SubscriptionAccountData | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let alive = true;
    fetch("/api/account/subscription")
      .then(async (r) => {
        if (!r.ok) {
          const body = await r.json().catch(() => ({}));
          throw new Error(body?.error || `Request failed (${r.status})`);
        }
        return r.json() as Promise<SubscriptionAccountData>;
      })
      .then((d) => {
        if (!alive) return;
        setData(d);
      })
      .catch((e) => {
        if (!alive) return;
        setError(e instanceof Error ? e.message : "Failed to load subscription");
      });
    return () => {
      alive = false;
    };
  }, []);

  const openPortal = React.useCallback(() => {
    window.location.assign("/api/stripe/portal");
  }, []);

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
              <p className="mt-2 font-gotham text-sm text-white/70">{error}</p>
              <button
                type="button"
                onClick={openPortal}
                className="mt-5 rounded-lg bg-escobets-yellow px-4 py-2 font-gotham font-medium text-black hover:bg-escobets-yellow/90"
              >
                Open billing portal
              </button>
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
