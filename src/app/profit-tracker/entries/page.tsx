"use client";

import Link from "next/link";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { ArrowLeft } from "lucide-react";
import { EntriesCsvToolbar } from "@/components/profit-tracker/entries-csv-toolbar";
import { useProfitTrackerEntries } from "@/lib/profit-tracker/use-profit-tracker-entries";
import type { TrackingType } from "@/types/profit-tracker";
import { cn } from "@/lib/utils";

const typeLabels: Record<TrackingType, string> = {
  investment: "Investment",
  profit: "Profit",
  loss: "Loss",
};

const typeColors: Record<TrackingType, string> = {
  investment: "text-white",
  profit: "text-green-400",
  loss: "text-red-400",
};

/** Backend: GET /api/profit-tracker/entries with pagination, filters */
export default function ProfitTrackerEntriesPage() {
  const entries = useProfitTrackerEntries();

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <Header />
      <main className="flex-1 px-4 py-8">
        <div className="mx-auto max-w-2xl">
          <Link
            href="/profit-tracker"
            className="inline-flex items-center gap-2 font-gotham text-escobets-yellow hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Profit Tracker
          </Link>
          <h1 className="mt-8 font-gotham text-2xl font-bold text-white">
            All Entries
          </h1>
          <p className="mt-2 font-gotham text-sm text-white/60">
            Export or import entries as CSV (Excel). Data is stored in this browser until a backend is connected.
          </p>

          <div className="mt-4">
            <EntriesCsvToolbar entries={entries} />
          </div>

          <div className="mt-6 rounded-xl border border-white/10 bg-black/40">
            <ul className="divide-y divide-white/10">
              {entries.map((entry) => (
                <li
                  key={entry.id}
                  className="flex items-center justify-between px-4 py-3"
                >
                  <div>
                    <span
                      className={cn(
                        "font-gotham font-medium",
                        typeColors[entry.type]
                      )}
                    >
                      {entry.name ?? typeLabels[entry.type]}
                    </span>
                    <span className="ml-2 font-gotham text-sm text-white/60">
                      {entry.name ? `${typeLabels[entry.type]} - ${entry.date}` : entry.date}
                    </span>
                  </div>
                  <span className="font-gotham font-medium text-white">
                    ${entry.amount.toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
