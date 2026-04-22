"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Zap, Calendar } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { DEFAULT_SITE_SETTINGS } from "@/lib/site-settings/defaults";
import type { SitePricingPlan } from "@/types/site-settings";

const features = [
  "High-confidence daily tips",
  "Access to full P&L dashboard",
  "Priority Telegram notifications",
  "Pause or cancel anytime",
];

const CURRENCY_STORAGE = "escobets:pricing-currency" as const;

type Currency = "GBP" | "EUR";

type PlansPair = { monthly: SitePricingPlan; annual: SitePricingPlan };

type PricingProps = {
  sectionSub?: string;
  plans?: PlansPair;
};

const defaultPlans: PlansPair = {
  monthly: DEFAULT_SITE_SETTINGS.pricing.monthly,
  annual: DEFAULT_SITE_SETTINGS.pricing.annual,
};

function perMonthFor(p: SitePricingPlan, c: Currency) {
  return c === "GBP" ? p.pricePerMonth : p.pricePerMonthEur;
}

/** Annual total line (yearly) — uses stored billing totals when the consultation add-on is off. */
function annualBilledFor(
  p: SitePricingPlan,
  c: Currency,
  withConsult: boolean,
  perMonthWithConsult: number
) {
  if (withConsult) return perMonthWithConsult * 12;
  if (c === "GBP" && p.billedTotal != null) return p.billedTotal;
  if (c === "EUR" && p.billedTotalEur != null) return p.billedTotalEur;
  return perMonthFor(p, c) * 12;
}

export function Pricing({
  sectionSub = DEFAULT_SITE_SETTINGS.pricing.sectionSub,
  plans = defaultPlans,
}: PricingProps) {
  const [plan, setPlan] = useState<"monthly" | "annual">("monthly");
  const [currency, setCurrency] = useState<Currency>("GBP");
  const [consultations, setConsultations] = useState(false);

  useEffect(() => {
    try {
      const s = localStorage.getItem(CURRENCY_STORAGE);
      if (s === "GBP" || s === "EUR") setCurrency(s);
    } catch {
      /* ignore */
    }
  }, []);

  const setCurrencyAndStore = (c: Currency) => {
    setCurrency(c);
    try {
      localStorage.setItem(CURRENCY_STORAGE, c);
    } catch {
      /* ignore */
    }
  };

  const config = plan === "monthly" ? plans.monthly : plans.annual;
  const basePerMonth = perMonthFor(config, currency);
  const perMonth = basePerMonth + (consultations ? 100 : 0);
  const consultAddon = 100;
  const symbol = currency === "GBP" ? "£" : "€";
  const annualYearTotal =
    plan === "annual"
      ? annualBilledFor(config, currency, consultations, perMonth)
      : 0;

  return (
    <section className="px-4 py-16 md:py-24">
      <div className="container mx-auto max-w-4xl">
        <h2 className="mb-2 text-center text-3xl font-bold md:text-4xl">
          Simple{" "}
          <span
            className="text-[#FBFE27]"
            style={{ textShadow: "0 0 66.667px #FBFE27" }}
          >
            Pricing
          </span>
        </h2>
        <p className="mb-6 text-center text-white/70">{sectionSub}</p>

        {/* Currency */}
        <div className="mb-6 flex justify-center">
          <div
            className="inline-flex rounded-lg border border-white/12 bg-black/30 p-0.5 backdrop-blur-sm"
            role="group"
            aria-label="Currency"
          >
            <button
              type="button"
              onClick={() => setCurrencyAndStore("GBP")}
              className={cn(
                "rounded-md px-4 py-1.5 text-xs font-medium transition-colors sm:px-5 sm:text-sm",
                currency === "GBP"
                  ? "bg-white/12 text-white"
                  : "text-white/50 hover:text-white/80"
              )}
            >
              GBP
            </button>
            <button
              type="button"
              onClick={() => setCurrencyAndStore("EUR")}
              className={cn(
                "rounded-md px-4 py-1.5 text-xs font-medium transition-colors sm:px-5 sm:text-sm",
                currency === "EUR"
                  ? "bg-white/12 text-white"
                  : "text-white/50 hover:text-white/80"
              )}
            >
              EUR
            </button>
          </div>
        </div>

        {/* Plan period */}
        <div className="mb-10 flex justify-center">
          <div className="inline-flex rounded-xl border border-white/15 bg-black/35 p-1 backdrop-blur-md">
            <button
              type="button"
              onClick={() => setPlan("monthly")}
              className={cn(
                "flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-medium transition-colors",
                plan === "monthly"
                  ? "bg-white/10 text-white shadow-inner"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              )}
            >
              <Zap className="h-4 w-4" />
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setPlan("annual")}
              className={cn(
                "flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-medium transition-colors",
                plan === "annual"
                  ? "bg-white/10 text-white shadow-inner"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              )}
            >
              <Calendar className="h-4 w-4" />
              Annual
            </button>
          </div>
        </div>

        <div
          className={cn(
            "rounded-2xl border p-6 shadow-[0_8px_40px_rgba(0,0,0,0.5)] md:p-8",
            "border-white/[0.09] bg-zinc-950/55 backdrop-blur-xl"
          )}
        >
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <span className="inline-block rounded-lg border border-white/10 bg-black/50 px-2.5 py-1 text-xs font-medium text-white/95 backdrop-blur-sm">
                {config.badge}
              </span>
              <p className="mt-4 text-4xl font-bold text-escobets-yellow">
                {symbol}
                {perMonth}
                <span className="text-lg font-normal text-white/70">/month</span>
              </p>
              {plan === "annual" && (
                <p className="mt-1 text-xs text-white/50">
                  Billed {symbol}
                  {annualYearTotal} per year
                </p>
              )}
              <p className="mt-2 font-semibold text-white">{config.title}</p>
              <p className="mt-1 text-sm text-white/60">{config.description}</p>
              <Button
                variant="outline"
                className="mt-6 w-full rounded-[0.83331rem] border-2 border-escobets-yellow"
                asChild
              >
                <Link prefetch={false} href="/subscription">
                  Get Started
                </Link>
              </Button>
            </div>

            <div>
              <ul className="space-y-3">
                {features.map((f, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 text-sm text-white/95"
                  >
                    <Check className="h-5 w-5 shrink-0 text-escobets-yellow" />
                    {f}
                  </li>
                ))}
              </ul>
              <div
                className={cn(
                  "mt-6 flex items-center justify-between gap-4 rounded-xl border border-white/[0.08] px-4 py-3",
                  "bg-black/35 backdrop-blur-md"
                )}
              >
                <span className="text-sm text-white/90">24/7 consultations</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-escobets-yellow">
                    +{symbol}
                    {consultAddon}
                  </span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={consultations}
                    onClick={() => setConsultations((c) => !c)}
                    className={cn(
                      "relative h-6 w-11 shrink-0 rounded-full transition-colors",
                      consultations ? "bg-escobets-yellow" : "bg-white/20"
                    )}
                  >
                    <span
                      className={cn(
                        "absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-white shadow transition-all",
                        consultations ? "left-6" : "left-0.5"
                      )}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
