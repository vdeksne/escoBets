"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
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

/** Admin: all entries for a user (scoped store mirror of /profit-tracker/entries). */
export default function AdminUserProfitTrackerEntriesPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const rawId = params.userId;
  const userId = Array.isArray(rawId) ? rawId[0] : rawId;
  const nameFromQuery = searchParams.get("name")?.trim();
  const userLabel = userId && (nameFromQuery?.length ? nameFromQuery : userId);

  const entries = useProfitTrackerEntries(userId);

  if (!userId) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-black px-4">
        <p className="font-gotham text-sm text-red-400">Invalid user.</p>
      </div>
    );
  }

  const trackerHref = `/users/${encodeURIComponent(userId)}/profit-tracker${
    nameFromQuery ? `?name=${encodeURIComponent(nameFromQuery)}` : ""
  }`;

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <Header variant="withLogo" showAdminLinks />
      <main className="flex-1 px-4 py-8">
        <div className="mx-auto max-w-2xl">
          <Link
            href={trackerHref}
            className="inline-flex items-center gap-2 font-gotham text-escobets-yellow hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Profit Tracker
          </Link>
          <h1 className="mt-8 font-gotham text-2xl font-bold text-white">
            All Entries
            {userLabel ? (
              <span className="block text-base font-normal text-white/60">
                {userLabel}
              </span>
            ) : null}
          </h1>
          <p className="mt-2 font-gotham text-sm text-white/60">
            Export or import entries as CSV. Admin view uses browser storage scoped to this
            user id until a backend is connected.
          </p>

          <div className="mt-4">
            <EntriesCsvToolbar entries={entries} storageScope={userId} />
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
                        typeColors[entry.type],
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
