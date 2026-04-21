"use client";

import * as React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { DayDataPoint, WeeklySummary } from "@/types/profit-tracker";
import { cn } from "@/lib/utils";

function formatChartValue(value: number): string {
  if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
  return String(value);
}

type SeriesKey = "total" | "investments" | "profits" | "losses";

const SERIES: Array<{
  key: SeriesKey;
  label: string;
  dataKey: keyof DayDataPoint;
  stroke: string;
  fill: string;
  gradientId: string;
}> = [
  {
    key: "total",
    label: "Total",
    dataKey: "value",
    stroke: "#DFFF00",
    fill: "url(#areaGradientTotal)",
    gradientId: "areaGradientTotal",
  },
  {
    key: "investments",
    label: "Investments",
    dataKey: "investments",
    stroke: "#60A5FA",
    fill: "url(#areaGradientInvestments)",
    gradientId: "areaGradientInvestments",
  },
  {
    key: "profits",
    label: "Profits",
    dataKey: "profits",
    stroke: "#34D399",
    fill: "url(#areaGradientProfits)",
    gradientId: "areaGradientProfits",
  },
  {
    key: "losses",
    label: "Losses",
    dataKey: "losses",
    stroke: "#F87171",
    fill: "url(#areaGradientLosses)",
    gradientId: "areaGradientLosses",
  },
];

interface WeeklyReportChartProps {
  chartData: DayDataPoint[];
  summary: WeeklySummary;
  period: "thisWeek" | "lastWeek" | "total";
  onPeriodChange: (period: "thisWeek" | "lastWeek" | "total") => void;
  className?: string;
}

export function WeeklyReportChart({
  chartData,
  summary,
  period,
  onPeriodChange,
  className,
}: WeeklyReportChartProps) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const totalForPeriod = summary.investments + summary.totalProfits - summary.totalLosses;
  const title =
    period === "thisWeek"
      ? "Report for this week"
      : period === "lastWeek"
        ? "Report for last week"
        : "Report total (last 7 days)";

  const [visible, setVisible] = React.useState<Record<SeriesKey, boolean>>({
    total: true,
    investments: true,
    profits: true,
    losses: true,
  });

  const toggle = (k: SeriesKey) => {
    setVisible((v) => {
      const next = { ...v, [k]: !v[k] };
      if (!Object.values(next).some(Boolean)) return v; // keep at least one visible
      return next;
    });
  };

  return (
    <div
      className={cn(
        "rounded-xl border border-white/10 bg-black/40 p-5",
        className
      )}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="font-gotham text-lg font-semibold text-white sm:text-xl">
          {title}
        </h3>
        <div className="w-full sm:w-auto">
          <div className="flex w-full rounded-lg border border-white/20 p-0.5 sm:w-auto">
            <button
              type="button"
              onClick={() => onPeriodChange("thisWeek")}
              className={cn(
                "flex-1 rounded-md px-3 py-1.5 font-gotham text-sm transition-colors sm:flex-none",
                period === "thisWeek"
                  ? "bg-escobets-yellow text-black"
                  : "text-white/80 hover:text-white"
              )}
            >
              This week
            </button>
            <button
              type="button"
              onClick={() => onPeriodChange("lastWeek")}
              className={cn(
                "flex-1 rounded-md px-3 py-1.5 font-gotham text-sm transition-colors sm:flex-none",
                period === "lastWeek"
                  ? "bg-escobets-yellow text-black"
                  : "text-white/80 hover:text-white"
              )}
            >
              Last week
            </button>
            <button
              type="button"
              onClick={() => onPeriodChange("total")}
              className={cn(
                "flex-1 rounded-md px-3 py-1.5 font-gotham text-sm transition-colors sm:flex-none",
                period === "total"
                  ? "bg-escobets-yellow text-black"
                  : "text-white/80 hover:text-white",
              )}
            >
              Total
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-2 border-b border-white/10 pb-4 min-[420px]:grid-cols-2 sm:flex sm:flex-wrap">
        <span className="font-gotham text-sm text-escobets-yellow">
          {formatChartValue(totalForPeriod)} Total
        </span>
        <span className="font-gotham text-sm text-escobets-yellow">
          {formatChartValue(summary.investments)} Investments
        </span>
        <span className="font-gotham text-sm text-escobets-yellow">
          {formatChartValue(summary.totalProfits)} Total Profits
        </span>
        <span className="font-gotham text-sm text-escobets-yellow">
          {formatChartValue(summary.totalLosses)} Total Losses
        </span>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {SERIES.map((s) => (
          <button
            key={s.key}
            type="button"
            onClick={() => toggle(s.key)}
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-3 py-1 font-gotham text-xs transition-colors",
              visible[s.key]
                ? "border-white/30 bg-white/10 text-white"
                : "border-white/10 text-white/50 hover:text-white/80",
            )}
            aria-pressed={visible[s.key]}
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: visible[s.key] ? s.stroke : "rgba(255,255,255,0.25)" }}
              aria-hidden
            />
            {s.label}
          </button>
        ))}
      </div>

      <div className="mt-4 h-[220px] w-full sm:h-[260px]" style={{ minWidth: 0 }}>
        {mounted && (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="areaGradientTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#DFFF00" stopOpacity={0.28} />
                <stop offset="100%" stopColor="#DFFF00" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="areaGradientInvestments" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#60A5FA" stopOpacity={0.18} />
                <stop offset="100%" stopColor="#60A5FA" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="areaGradientProfits" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#34D399" stopOpacity={0.18} />
                <stop offset="100%" stopColor="#34D399" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="areaGradientLosses" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F87171" stopOpacity={0.18} />
                <stop offset="100%" stopColor="#F87171" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
            <XAxis
              dataKey="day"
              tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 12 }}
              axisLine={{ stroke: "rgba(255,255,255,0.2)" }}
              tickLine={false}
            />
            <YAxis
              tickFormatter={formatChartValue}
              tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={40}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const d = payload[0].payload as DayDataPoint;
                const rows = SERIES.filter((s) => visible[s.key])
                  .map((s) => {
                    const v = d[s.dataKey];
                    return typeof v === "number" && Number.isFinite(v)
                      ? { ...s, v }
                      : null;
                  })
                  .filter(Boolean) as Array<(typeof SERIES)[number] & { v: number }>;
                return (
                  <div className="rounded-lg border border-white/20 bg-black/90 px-3 py-2 font-gotham text-sm text-white">
                    <div className="text-white/80">{d.fullDay}</div>
                    <div className="mt-1 space-y-1">
                      {rows.map((r) => (
                        <div key={r.key} className="flex items-center justify-between gap-4">
                          <span className="inline-flex items-center gap-2 text-white/80">
                            <span
                              className="h-2 w-2 rounded-full"
                              style={{ backgroundColor: r.stroke }}
                              aria-hidden
                            />
                            {r.label}
                          </span>
                          <span className="text-white">{formatChartValue(r.v)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }}
              cursor={{ stroke: "rgba(255,255,255,0.3)", strokeDasharray: "4 4" }}
            />
            {SERIES.map((s) =>
              visible[s.key] ? (
                <Area
                  key={s.key}
                  type="monotone"
                  dataKey={s.dataKey as string}
                  stroke={s.stroke}
                  strokeWidth={s.key === "total" ? 2 : 1.6}
                  fill={s.fill}
                  dot={false}
                  isAnimationActive={false}
                />
              ) : null,
            )}
          </AreaChart>
        </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
