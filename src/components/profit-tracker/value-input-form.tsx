"use client";

import * as React from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import type { TrackingType } from "@/types/profit-tracker";
import { TRACKING_TYPES } from "@/lib/profit-tracker/mock-data";
import { cn } from "@/lib/utils";

/** Backend: POST /api/profit-tracker/entries { amount, type, date } */
export function ValueInputForm({ className }: { className?: string }) {
  const [amount, setAmount] = React.useState("");
  const [trackingType, setTrackingType] = React.useState<TrackingType>("investment");
  const [date, setDate] = React.useState(() => {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Backend: await fetch('/api/profit-tracker/entries', { method: 'POST', body: JSON.stringify({ amount: +amount, type: trackingType, date }) })
    console.log("Submit:", { amount: +amount, type: trackingType, date });
    setAmount("");
  };

  return (
    <div
      className={cn(
        "rounded-xl border border-white/10 bg-black/40 p-5",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <h3 className="font-gotham text-lg font-semibold text-escobets-yellow">
          Value Input
        </h3>
        <Link
          href="/profit-tracker/entries"
          className="font-gotham text-sm text-escobets-yellow hover:underline"
        >
          See more
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div>
          <label htmlFor="amount" className="sr-only">
            Amount
          </label>
          <Input
            id="amount"
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="rounded-lg border-white/30 bg-transparent text-white placeholder:text-white/50"
            min={0}
            step="0.01"
          />
        </div>
        <div>
          <label htmlFor="tracking-type" className="sr-only">
            Tracking Type
          </label>
          <select
            id="tracking-type"
            value={trackingType}
            onChange={(e) => setTrackingType(e.target.value as TrackingType)}
            className={cn(
              "flex h-10 w-full rounded-lg border border-white/30 bg-transparent px-3 py-2",
              "font-gotham text-white placeholder:text-white/50",
              "focus:outline-none focus:ring-2 focus:ring-escobets-yellow/50"
            )}
          >
            {TRACKING_TYPES.map((t) => (
              <option key={t.value} value={t.value} className="bg-gray-900 text-white">
                {t.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="date" className="sr-only">
            Date
          </label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="rounded-lg border-white/30 bg-transparent text-white"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-lg bg-escobets-yellow py-2.5 font-gotham font-medium text-black hover:bg-escobets-yellow/90"
        >
          Add
        </button>
      </form>
    </div>
  );
}
