"use client";

import * as React from "react";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
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

/**
 * Profit Tracker overview: summary + weekly chart are derived from stored entries
 * (same source as CSV import/export and the entries list).
 */
export default function ProfitTrackerPage() {
  const [period, setPeriod] = React.useState<"thisWeek" | "lastWeek" | "total">(
    "thisWeek",
  );
  const entries = useProfitTrackerEntries();

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
    <div className="flex min-h-screen flex-col bg-black">
      <Header variant="withLogo" />

      <main className="flex-1 px-4 py-8 md:px-6">
        <div className="mx-auto max-w-6xl">
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
                              // "Clear" from the calendar: clear selection, keep calendar open.
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
            <ValueInputForm />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
