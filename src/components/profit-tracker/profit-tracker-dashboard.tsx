"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SummaryCard } from "@/components/profit-tracker/summary-card";
import { WeeklyReportChart } from "@/components/profit-tracker/weekly-report-chart";
import { ValueInputForm } from "@/components/profit-tracker/value-input-form";
import {
  deriveDashboardFromEntries,
  deriveTotalFromEntries,
  type TotalTimeframe,
} from "@/lib/profit-tracker/derive-from-entries";
import { useProfitTrackerEntries } from "@/lib/profit-tracker/use-profit-tracker-entries";
import { Input } from "@/components/ui/input";
import { DateRangePicker } from "@/components/profit-tracker/date-range-picker";

function todayYmd() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const da = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${da}`;
}

function currentYearMonth() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

export type ProfitTrackerDashboardProps = {
  /** Isolated localStorage scope (e.g. admin user id). */
  storageScope?: string;
  /** Entries list URL for ValueInputForm "See more". */
  entriesListHref?: string;
  /** Optional admin banner (back link + label). */
  adminBanner?: { backHref: string; userLabel: string };
};

/**
 * Summary + weekly chart + value input — same layout as /profit-tracker with optional scoped storage.
 */
export function ProfitTrackerDashboard({
  storageScope,
  entriesListHref: entriesListHrefProp,
  adminBanner,
}: ProfitTrackerDashboardProps) {
  const entriesListHref =
    entriesListHrefProp ??
    (storageScope
      ? `/users/${encodeURIComponent(storageScope)}/profit-tracker/entries`
      : "/profit-tracker/entries");

  const [period, setPeriod] = React.useState<"thisWeek" | "lastWeek" | "total">(
    "thisWeek",
  );
  const entries = useProfitTrackerEntries(storageScope);

  const data = React.useMemo(
    () => deriveDashboardFromEntries(entries),
    [entries],
  );

  const [totalMode, setTotalMode] =
    React.useState<TotalTimeframe["mode"]>("last7");
  const [totalYearMonth, setTotalYearMonth] = React.useState(currentYearMonth);
  const [totalYear, setTotalYear] = React.useState(() =>
    new Date().getFullYear(),
  );
  const [totalFrom, setTotalFrom] = React.useState(() => todayYmd());
  const [totalTo, setTotalTo] = React.useState(() => todayYmd());

  const totalTf: TotalTimeframe = React.useMemo(() => {
    if (totalMode === "month")
      return { mode: "month", yearMonth: totalYearMonth };
    if (totalMode === "year") return { mode: "year", year: totalYear };
    if (totalMode === "custom")
      return { mode: "custom", from: totalFrom, to: totalTo };
    return { mode: "last7" };
  }, [totalMode, totalYearMonth, totalYear, totalFrom, totalTo]);

  const weekly = React.useMemo(() => {
    if (period === "thisWeek") return data.weeklyReport.thisWeek;
    if (period === "lastWeek") return data.weeklyReport.lastWeek;
    return deriveTotalFromEntries(entries, totalTf);
  }, [period, data.weeklyReport, entries, totalTf]);

  return (
    <div className="mx-auto max-w-6xl">
      {adminBanner ? (
        <div className="mb-6 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
          <Link
            href={adminBanner.backHref}
            className="inline-flex items-center gap-2 font-gotham text-sm text-escobets-yellow hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to users
          </Link>
          <p className="mt-2 font-gotham text-sm text-white/80">
            Profit tracker for{" "}
            <span className="font-semibold text-white">{adminBanner.userLabel}</span>
          </p>
        </div>
      ) : null}

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <SummaryCard
          title="Total Investments"
          metric={data.metrics.totalInvestments}
        />
        <SummaryCard
          title="Total Profits"
          metric={data.metrics.totalProfits}
        />
        <SummaryCard
          title="Total Losses"
          metric={data.metrics.totalLosses}
        />
      </div>

      {/* Report chart + Value input */}
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
        <div>
          {period === "total" && (
            <div className="mb-3 flex flex-col gap-2 rounded-xl border border-white/10 bg-black/40 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-2">
                <label className="font-gotham text-sm text-white/70">
                  Timeframe
                </label>
                <select
                  value={totalMode}
                  onChange={(e) =>
                    setTotalMode(e.target.value as TotalTimeframe["mode"])
                  }
                  className="h-9 rounded-lg border border-white/20 bg-transparent px-3 font-gotham text-sm text-white focus:outline-none focus:ring-2 focus:ring-escobets-yellow/50"
                >
                  <option value="last7" className="bg-gray-900 text-white">
                    Last 7 days
                  </option>
                  <option value="month" className="bg-gray-900 text-white">
                    Month
                  </option>
                  <option value="year" className="bg-gray-900 text-white">
                    Year
                  </option>
                  <option value="custom" className="bg-gray-900 text-white">
                    Custom range
                  </option>
                </select>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {totalMode === "month" && (
                  <Input
                    type="month"
                    value={totalYearMonth}
                    onChange={(e) => setTotalYearMonth(e.target.value)}
                    className="h-9 w-[160px] border-white/20 bg-transparent"
                  />
                )}
                {totalMode === "year" && (
                  <Input
                    type="number"
                    value={totalYear}
                    onChange={(e) => setTotalYear(Number(e.target.value))}
                    min={2000}
                    max={2100}
                    className="h-9 w-[120px] border-white/20 bg-transparent"
                  />
                )}
                {totalMode === "custom" && (
                  <>
                    <DateRangePicker
                      value={{ from: totalFrom, to: totalTo }}
                      onChange={(next) => {
                        if (!next.from && !next.to) {
                          setTotalFrom("");
                          setTotalTo("");
                          return;
                        }
                        if (next.from) setTotalFrom(next.from);
                        if (next.to) setTotalTo(next.to);
                      }}
                      className="w-[min(520px,100%)]"
                    />
                  </>
                )}
              </div>
            </div>
          )}

          <WeeklyReportChart
            chartData={weekly.chartData}
            summary={weekly.summary}
            period={period}
            onPeriodChange={setPeriod}
          />
        </div>
        <ValueInputForm
          storageScope={storageScope}
          entriesListHref={entriesListHref}
        />
      </div>
    </div>
  );
}
