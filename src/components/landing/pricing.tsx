"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Zap, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const features = [
  "High-confidence daily tips",
  "Access to full P&L dashboard",
  "Priority Telegram notifications",
  "Pause or cancel anytime",
];

const PLANS = {
  monthly: {
    badge: "1-Month Plan",
    pricePerMonth: 20,
    title: "Monthly plan",
    description:
      "Flexible, cancel anytime. Just elite betting insights for one low monthly fee.",
  },
  sprint: {
    badge: "3-Month Sprint",
    pricePerMonth: 15,
    billedTotal: 45,
    title: "3-month commitment",
    description:
      "Save 25% when you commit. Same elite insights, lower price.",
  },
} as const;

export function Pricing() {
  const [plan, setPlan] = useState<"monthly" | "sprint">("monthly");
  const [consultations, setConsultations] = useState(false);

  const config = PLANS[plan];
  const sprintBilled =
    plan === "sprint"
      ? (config as typeof PLANS.sprint).billedTotal + (consultations ? 100 : 0)
      : 0;
  const monthlyTotal = config.pricePerMonth + (consultations ? 100 : 0);

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
        <p className="mb-8 text-center text-white/70">
          No hidden fees. No complicated tiers.
        </p>

        {/* Toggle */}
        <div className="mb-10 flex justify-center">
          <div className="inline-flex rounded-lg border border-white/20 bg-escobets-gray-card p-1">
            <button
              type="button"
              onClick={() => setPlan("monthly")}
              className={cn(
                "flex items-center gap-2 rounded-md px-6 py-2.5 text-sm font-medium transition-colors",
                plan === "monthly"
                  ? "bg-[#1a1a1a] text-white"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              )}
            >
              <Zap className="h-4 w-4" />
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setPlan("sprint")}
              className={cn(
                "rounded-md px-6 py-2.5 text-sm font-medium transition-colors",
                plan === "sprint"
                  ? "bg-[#1a1a1a] text-white"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              )}
            >
              Sprint
            </button>
          </div>
        </div>

        {/* Main pricing card */}
        <div className="rounded-xl border border-white/10 bg-escobets-gray-card p-6 shadow-[0_0_20px_rgba(255,255,255,0.03)] md:p-8">
          <div className="grid gap-8 md:grid-cols-2">
            {/* Left: Plan details */}
            <div>
              <span className="inline-block rounded bg-black/50 px-2.5 py-1 text-xs font-medium text-white">
                {config.badge}
              </span>
              <p className="mt-4 text-4xl font-bold text-escobets-yellow">
                ${plan === "sprint" ? config.pricePerMonth : monthlyTotal}
                <span className="text-lg font-normal text-white/70">
                  /month
                </span>
              </p>
              {plan === "sprint" && (
                <p className="mt-1 text-xs text-white/50">
                  Billed $
                  {sprintBilled || (config as typeof PLANS.sprint).billedTotal}{" "}
                  for 3 months
                </p>
              )}
              <p className="mt-2 font-semibold text-white">
                {config.title}
              </p>
              <p className="mt-1 text-sm text-white/60">
                {config.description}
              </p>
              <Button
                variant="outline"
                className="mt-6 w-full rounded-[0.83331rem] border-2 border-escobets-yellow"
                asChild
              >
                <Link href="/subscription">Get Started</Link>
              </Button>
            </div>

            {/* Right: Features + add-on */}
            <div>
              <ul className="space-y-3">
                {features.map((f, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 text-sm text-white"
                  >
                    <Check className="h-5 w-5 shrink-0 text-escobets-yellow" />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex items-center justify-between gap-4 rounded-lg border border-white/10 bg-black/30 px-4 py-3">
                <span className="text-sm text-white">24/7 consultations</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-escobets-yellow">
                    +$100
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

        {/* Bottom CTA */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-white/60">
            See how we can work for you.
          </p>
          <Link
            href="/demo"
            className="flex items-center gap-0 overflow-hidden rounded-xl border border-white/10 bg-[#1a1a1a] px-1 py-1 pr-5 transition-colors hover:border-white/20 hover:bg-[#222]"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white/5">
              <Sparkles className="h-5 w-5 text-escobets-yellow" />
            </div>
            <span className="flex flex-col items-start justify-center gap-0 pl-4 pr-6">
              <span className="text-xs font-normal text-white/60">
                Let&apos;s chat
              </span>
              <span className="text-base font-bold text-white">
                Book a Demo
              </span>
            </span>
            <ArrowRight className="h-5 w-5 shrink-0 text-white/60" />
          </Link>
        </div>
      </div>
    </section>
  );
}
