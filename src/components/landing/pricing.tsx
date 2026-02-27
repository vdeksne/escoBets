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

export function Pricing() {
  const [plan, setPlan] = useState<"monthly" | "sprint">("monthly");
  const [consultations, setConsultations] = useState(false);

  const price = plan === "monthly" ? 20 : 20;
  const total = price + (consultations ? 100 : 0);

  return (
    <section className="px-4 py-16 md:py-24">
      <div className="container mx-auto max-w-4xl">
        <h2 className="mb-2 text-center text-3xl font-bold md:text-4xl">
          Simple{" "}
          <span className="text-escobets-yellow drop-shadow-[0_0_12px_rgba(223,255,0,0.5)]">
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
                1-Month Sprint
              </span>
              <p className="mt-4 text-4xl font-bold text-escobets-yellow">
                ${total}
                <span className="text-lg font-normal text-white/70">
                  /month
                </span>
              </p>
              <p className="mt-2 font-semibold text-white">
                One month sprint
              </p>
              <p className="mt-1 text-sm text-white/60">
                Just elite betting insights for one low monthly fee.
              </p>
              <Button
                variant="outline"
                className="mt-6 w-full rounded-[0.83331rem] border-2 border-escobets-yellow"
                asChild
              >
                <Link href="/subscribe">Get Started</Link>
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
          <Button
            variant="outline"
            className="rounded-[0.83331rem] border-2 border-escobets-yellow"
            asChild
          >
            <Link
              href="#book-demo"
              className="flex items-center gap-2"
            >
              <Sparkles className="h-4 w-4 text-escobets-yellow" />
              <span className="flex flex-col items-start">
                <span className="leading-tight">Let&apos;s chat</span>
                <span className="text-xs font-normal text-white/80">
                  Book a Demo
                </span>
              </span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
