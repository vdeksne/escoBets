"use client";

import * as React from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import type { TrackingType } from "@/types/profit-tracker";
import { TRACKING_TYPES } from "@/lib/profit-tracker/mock-data";
import { addProfitTrackerEntry } from "@/lib/profit-tracker/entries-storage";
import { EntriesCsvToolbar } from "@/components/profit-tracker/entries-csv-toolbar";
import { useProfitTrackerEntries } from "@/lib/profit-tracker/use-profit-tracker-entries";
import { cn } from "@/lib/utils";

type ValueInputFormProps = {
  className?: string;
  /** Scope for local storage (e.g. admin view of another user). */
  storageScope?: string;
  /** Target for "See more" (entries list). */
  entriesListHref?: string;
};

/** Backend: POST /api/profit-tracker/entries { amount, type, date } */
export function ValueInputForm({
  className,
  storageScope,
  entriesListHref = "/profit-tracker/entries",
}: ValueInputFormProps) {
  const [entryName, setEntryName] = React.useState("");
  const [amount, setAmount] = React.useState("");
  const [trackingType, setTrackingType] = React.useState<TrackingType>("investment");
  const [date, setDate] = React.useState(() => {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  });
  const entries = useProfitTrackerEntries(storageScope);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const n = Number.parseFloat(amount);
    if (!Number.isFinite(n) || n < 0) return;
    addProfitTrackerEntry(
      {
        name: entryName.trim() || undefined,
        amount: n,
        type: trackingType,
        date,
      },
      storageScope
    );
    setEntryName("");
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
        <div>
          <h3 className="font-gotham text-lg font-semibold text-escobets-yellow">
            Value Input
          </h3>
          <p className="mt-1 font-gotham text-xs text-white/60">
            Add entries, then use tools below to import/export CSV.
          </p>
        </div>
        <Link
          href={entriesListHref}
          className="inline-flex whitespace-nowrap font-gotham text-sm text-escobets-yellow hover:underline"
        >
          See more
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <div>
          <label htmlFor="entry-name" className="sr-only">
            Entry name
          </label>
          <Input
            id="entry-name"
            type="text"
            placeholder="Entry name (optional)"
            value={entryName}
            onChange={(e) => setEntryName(e.target.value)}
            className="rounded-lg border-white/30 bg-transparent text-white placeholder:text-white/50"
            maxLength={80}
          />
        </div>
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

      <div className="mt-6 border-t border-white/10 pt-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="font-gotham text-xs text-white/80">Data tools</p>
          <p className="font-gotham text-[11px] text-white/50">CSV (Excel)</p>
        </div>
        <EntriesCsvToolbar entries={entries} storageScope={storageScope} />
      </div>
    </div>
  );
}
