"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const features = [
  "High confidence daily tips",
  "Access to full P&L dashboard",
  "Priority Telegram notifications",
  "Pause or cancel anytime",
];

export function Pricing() {
  const [yearly, setYearly] = useState(false);

  return (
    <section className="px-4 py-16 md:py-24">
      <div className="container mx-auto max-w-4xl">
        <h2 className="mb-2 text-center text-3xl font-bold md:text-4xl">
          Simple <span className="text-escobets-yellow">Pricing</span>
        </h2>
        <p className="mb-8 text-center text-white/70">
          No hidden fees. No complicated tiers.
        </p>

        {/* Toggle */}
        <div className="mb-12 flex justify-center">
          <div className="inline-flex rounded-lg border border-white/20 bg-escobets-gray-card p-1">
            <button
              type="button"
              onClick={() => setYearly(false)}
              className={cn(
                "rounded-md px-6 py-2 text-sm font-medium transition-colors",
                !yearly
                  ? "bg-escobets-yellow text-black"
                  : "text-white hover:bg-white/5"
              )}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setYearly(true)}
              className={cn(
                "rounded-md px-6 py-2 text-sm font-medium transition-colors",
                yearly
                  ? "bg-escobets-yellow text-black"
                  : "text-white hover:bg-white/5"
              )}
            >
              Yearly
            </button>
          </div>
        </div>

        {/* Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border-2 border-escobets-yellow bg-escobets-gray-card p-6 shadow-[0_0_20px_rgba(223,255,0,0.15)]">
            <p className="text-3xl font-bold text-white">
              ${yearly ? "200" : "20"}
              <span className="text-lg font-normal text-white/70">
                {" "}
                /{yearly ? "year" : "month"}
              </span>
            </p>
            <p className="mt-2 text-sm text-white/80">
              {yearly ? "One year access" : "One month sprint"}
            </p>
            <p className="mt-1 text-sm text-white/60">
              Just elite betting insights for one low{" "}
              {yearly ? "yearly" : "monthly"} fee.
            </p>
            <Button variant="outline" className="mt-6 w-full" asChild>
              <Link href="/subscribe">Get Started</Link>
            </Button>
          </div>

          <div className="rounded-xl border border-white/10 bg-escobets-gray-card p-6">
            <p className="mb-4 text-sm font-medium text-white/80">
              What you get
            </p>
            <ul className="space-y-3">
              {features.map((f, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-white">
                  <Check className="h-5 w-5 shrink-0 text-escobets-yellow" />
                  {f}
                </li>
              ))}
              <li className="flex items-center gap-3 text-sm text-white">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-white/30 text-xs">
                  •
                </span>
                <span className="flex items-center gap-2">
                  24/7 consultations
                  <span className="rounded bg-escobets-yellow/20 px-1.5 py-0.5 text-xs font-medium text-escobets-yellow">
                    NEW
                  </span>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
