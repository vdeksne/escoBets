"use client";

import * as React from "react";
import Link from "next/link";
import { CreditCard, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const PLANS = [
  {
    id: "monthly" as const,
    label: "Pay Monthly",
    price: "$20 / Month",
  },
  {
    id: "annual" as const,
    label: "Pay Annual",
    price: "$16 / Month",
    badge: "SAVE 15%",
  },
];

export function SubscriptionForm({ className }: { className?: string }) {
  const [plan, setPlan] = React.useState<"monthly" | "annual">("annual");

  const total = plan === "annual" ? "$16 / Month" : "$20 / Month";

  return (
    <div
      className={cn(
        "mx-auto w-full max-w-4xl",
        className
      )}
    >
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Left: Billing & Payment */}
        <form className="subscription-form space-y-6" onSubmit={(e) => e.preventDefault()}>
          <h2 className="font-gotham text-lg font-semibold text-white">Billed To</h2>
          <Input
            type="text"
            placeholder="Account Name"
            autoComplete="name"
            aria-label="Account Name"
            className="rounded-none border-0 border-b border-white/60 bg-transparent pl-4 pr-0 text-white placeholder:text-white/60 focus:border-white focus:ring-0"
          />

          <h2 className="mt-8 font-gotham text-lg font-semibold text-white">Payment Details</h2>
          <div className="space-y-4">
            <div className="relative">
              <CreditCard className="absolute left-0 top-1/2 h-5 w-5 -translate-y-1/2 text-white/60" />
              <Input
                type="text"
                placeholder="Card number"
                autoComplete="cc-number"
                aria-label="Card number"
                maxLength={19}
                className="rounded-none border-0 border-b border-white/60 bg-transparent pl-10 pr-0 text-white placeholder:text-white/60 focus:border-white focus:ring-0"
              />
            </div>
            <Input
              type="text"
              placeholder="Cardholder name"
              autoComplete="cc-name"
              aria-label="Cardholder name"
              className="rounded-none border-0 border-b border-white/60 bg-transparent pl-4 pr-0 text-white placeholder:text-white/60 focus:border-white focus:ring-0"
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="text"
                placeholder="MM/YY"
                autoComplete="cc-exp"
                aria-label="Expiry date"
                maxLength={5}
                className="rounded-none border-0 border-b border-white/60 bg-transparent pl-4 pr-0 text-white placeholder:text-white/60 focus:border-white focus:ring-0"
              />
              <Input
                type="text"
                placeholder="CVV"
                autoComplete="cc-csc"
                aria-label="CVV"
                maxLength={4}
                className="rounded-none border-0 border-b border-white/60 bg-transparent pl-4 pr-0 text-white placeholder:text-white/60 focus:border-white focus:ring-0"
              />
            </div>
            <Input
              type="text"
              placeholder="Country"
              autoComplete="country"
              aria-label="Country"
              className="rounded-none border-0 border-b border-white/60 bg-transparent pl-4 pr-0 text-white placeholder:text-white/60 focus:border-white focus:ring-0"
            />
            <Input
              type="text"
              placeholder="Postal / ZIP code"
              autoComplete="postal-code"
              aria-label="Postal code"
              className="rounded-none border-0 border-b border-white/60 bg-transparent pl-4 pr-0 text-white placeholder:text-white/60 focus:border-white focus:ring-0"
            />
          </div>

          <div className="flex gap-4 pt-6">
            <Button
              variant="outline"
              asChild
              className="flex-1 rounded-[0.83331rem] border-[1.333px] border-[#FBFE27] bg-transparent text-white hover:bg-[#FBFE27]/10"
            >
              <Link href="/">Cancel</Link>
            </Button>
            <Button
              type="submit"
              className="flex-1 rounded-[0.83331rem] bg-escobets-yellow text-black hover:bg-escobets-yellow/90"
            >
              Subscribe
            </Button>
          </div>

          <p className="font-gotham text-sm text-white/80">
            By providing your card information, you allow us to charge your card for future payment in accordance with their terms.
          </p>

          {/* Dev shortcut – remove or replace with backend redirect after payment */}
          {process.env.NODE_ENV === "development" && (
            <p className="font-gotham text-xs text-white/50">
              Dev: <Link href="/subscription/confirmation" className="underline hover:text-white">View confirmation page</Link>
            </p>
          )}
        </form>

        {/* Right: Subscription options & total */}
        <div className="relative overflow-hidden rounded-xl border border-white/10 bg-black/40 p-6">
          <div className="space-y-4">
            {PLANS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPlan(p.id)}
                className={cn(
                  "flex w-full items-center justify-between rounded-lg border p-4 transition-colors",
                  plan === p.id
                    ? "border-escobets-yellow/60 bg-escobets-yellow/10"
                    : "border-white/20 bg-black/40 hover:border-white/40"
                )}
              >
                <div className="text-left">
                  <span className="font-gotham font-medium text-white">{p.label}</span>
                  <p className="mt-1 font-gotham text-sm text-white">{p.price}</p>
                </div>
                {p.badge && (
                  <span className="rounded bg-escobets-yellow px-2.5 py-1 font-gotham text-xs font-bold text-black">
                    {p.badge}
                  </span>
                )}
              </button>
            ))}

            <div className="mt-6 border-t border-white/20 pt-6">
              <h3 className="font-gotham text-sm font-medium text-white/80">Total</h3>
              <p className="mt-2 font-gotham text-2xl font-bold text-white">{total}</p>
              <div className="mt-4 flex items-center gap-2 font-gotham text-xs text-white/70">
                <Lock className="h-4 w-4 shrink-0" />
                <span>
                  Guaranteed to be safe & secure, ensuring that all transactions are protected with the highest level of security.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
