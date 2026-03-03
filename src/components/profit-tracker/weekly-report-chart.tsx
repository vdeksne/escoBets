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
import { MoreVertical } from "lucide-react";
import type { DayDataPoint, WeeklySummary } from "@/types/profit-tracker";
import { cn } from "@/lib/utils";

function formatChartValue(value: number): string {
  if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
  return String(value);
}

interface WeeklyReportChartProps {
  chartData: DayDataPoint[];
  summary: WeeklySummary;
  isThisWeek: boolean;
  onWeekChange: (thisWeek: boolean) => void;
  className?: string;
}

export function WeeklyReportChart({
  chartData,
  summary,
  isThisWeek,
  onWeekChange,
  className,
}: WeeklyReportChartProps) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  return (
    <div
      className={cn(
        "rounded-xl border border-white/10 bg-black/40 p-5",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <h3 className="font-gotham text-lg font-semibold text-white">
          Report for this week
        </h3>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-white/20 p-0.5">
            <button
              type="button"
              onClick={() => onWeekChange(true)}
              className={cn(
                "rounded-md px-3 py-1.5 font-gotham text-sm transition-colors",
                isThisWeek
                  ? "bg-escobets-yellow text-black"
                  : "text-white/80 hover:text-white"
              )}
            >
              This week
            </button>
            <button
              type="button"
              onClick={() => onWeekChange(false)}
              className={cn(
                "rounded-md px-3 py-1.5 font-gotham text-sm transition-colors",
                !isThisWeek
                  ? "bg-escobets-yellow text-black"
                  : "text-white/80 hover:text-white"
              )}
            >
              Last week
            </button>
          </div>
          <button
            type="button"
            className="text-white/50 hover:text-white"
            aria-label="More options"
          >
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="mt-4 flex gap-6 border-b border-white/10 pb-4">
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

      <div className="mt-4 h-[200px] w-full min-h-[200px]" style={{ minWidth: 0 }}>
        {mounted && (
        <ResponsiveContainer width="100%" height={200} minWidth={300}>
          <AreaChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#DFFF00" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#DFFF00" stopOpacity={0} />
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
                if (!active || !payload?.[0]) return null;
                const d = payload[0].payload as DayDataPoint;
                return (
                  <div className="rounded-lg border border-white/20 bg-black/90 px-3 py-2 font-gotham text-sm text-white">
                    {d.fullDay} {formatChartValue(d.value)}
                  </div>
                );
              }}
              cursor={{ stroke: "rgba(255,255,255,0.3)", strokeDasharray: "4 4" }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#DFFF00"
              strokeWidth={2}
              fill="url(#areaGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
