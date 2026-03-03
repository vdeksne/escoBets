"use client";

import * as React from "react";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { SummaryCard } from "@/components/profit-tracker/summary-card";
import { WeeklyReportChart } from "@/components/profit-tracker/weekly-report-chart";
import { ValueInputForm } from "@/components/profit-tracker/value-input-form";
import { MOCK_PROFIT_TRACKER_DATA } from "@/lib/profit-tracker/mock-data";

/**
 * Profit Tracker page.
 * Data source: replace MOCK_PROFIT_TRACKER_DATA with API call:
 *   const { data } = useSWR('/api/profit-tracker', fetcher)
 *   or: const data = await fetch('/api/profit-tracker').then(r => r.json())
 */
export default function ProfitTrackerPage() {
  const [isThisWeek, setIsThisWeek] = React.useState(true);

  const data = MOCK_PROFIT_TRACKER_DATA;
  const weekly = isThisWeek ? data.weeklyReport.thisWeek : data.weeklyReport.lastWeek;

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <Header variant="withLogo" />

      <main className="flex-1 px-4 py-8 md:px-6">
        <div className="mx-auto max-w-6xl">
          {/* Summary cards */}
          <div className="grid gap-4 sm:grid-cols-3">
            <SummaryCard title="Total Investments" metric={data.metrics.totalInvestments} />
            <SummaryCard title="Total Profits" metric={data.metrics.totalProfits} />
            <SummaryCard title="Total Losses" metric={data.metrics.totalLosses} />
          </div>

          {/* Report chart + Value input */}
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
            <WeeklyReportChart
              chartData={weekly.chartData}
              summary={weekly.summary}
              isThisWeek={isThisWeek}
              onWeekChange={setIsThisWeek}
            />
            <ValueInputForm />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
