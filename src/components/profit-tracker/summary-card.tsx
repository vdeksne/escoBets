"use client";

import { TrendingUp } from "lucide-react";
import type { PeriodMetric } from "@/types/profit-tracker";
import { cn } from "@/lib/utils";

function formatValue(value: number): string {
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  if (value >= 100000) return `${Math.round(value / 1000)}K`;
  return String(value);
}

interface SummaryCardProps {
  title: string;
  metric: PeriodMetric;
  className?: string;
}

export function SummaryCard({ title, metric, className }: SummaryCardProps) {
  const isPositive = metric.value >= metric.previousValue;

  return (
    <div
      className={cn(
        "relative rounded-xl border border-white/10 bg-black/40 p-5",
        className
      )}
    >
      <h3 className="font-gotham text-sm font-medium text-white/80">{title}</h3>
      <p className="mt-1 font-gotham text-xs text-white/60">{metric.period}</p>
      <div className="mt-2 flex items-center gap-2">
        <span className="font-gotham text-2xl font-bold text-escobets-yellow">
          ${formatValue(metric.value)}
        </span>
        <TrendingUp
          className={cn(
            "h-5 w-5",
            isPositive ? "text-escobets-yellow" : "text-red-500 rotate-180"
          )}
          aria-hidden
        />
      </div>
      <p className="mt-2 font-gotham text-xs text-white/60">
        {metric.previousPeriod} (${formatValue(metric.previousValue)})
      </p>
    </div>
  );
}
