"use client";

import * as React from "react";
import { format, isValid, parse } from "date-fns";
import { enGB } from "date-fns/locale";
import { Calendar as CalendarIcon, ChevronDown } from "lucide-react";
import { DayPicker, type DateRange } from "react-day-picker";
import { enGB as rdpEnGB } from "react-day-picker/locale";

import "react-day-picker/style.css";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

function toYmd(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const da = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${da}`;
}

function parseYmd(s: string): Date | undefined {
  const d = parse(s, "yyyy-MM-dd", new Date(), { locale: enGB });
  return isValid(d) ? d : undefined;
}

function formatDisplay(d: Date): string {
  return format(d, "dd/MM/yyyy", { locale: enGB });
}

const triggerClassName =
  "flex h-10 w-full items-center gap-2 rounded-full border border-white/20 bg-transparent px-4 py-2 font-gotham text-left text-white " +
  "transition-[border-color,box-shadow] duration-150 hover:border-white/35 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-escobets-yellow/50";

const calendarClassName = cn(
  "profit-tracker-range-calendar p-3 font-gotham text-sm text-white",
  "[--rdp-accent-color:#DFFF00] [--rdp-accent-background-color:rgba(223,255,0,0.14)] [--rdp-today-color:#DFFF00]",
  "[--rdp-outside-opacity:0.35] [--rdp-disabled-opacity:0.35]",
);

export type ProfitTrackerDateRange = {
  from?: string; // YYYY-MM-DD
  to?: string; // YYYY-MM-DD
};

export interface DateRangePickerProps {
  value: ProfitTrackerDateRange;
  onChange: (next: ProfitTrackerDateRange) => void;
  className?: string;
}

export function DateRangePicker({ value, onChange, className }: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false);

  const selectedRange: DateRange | undefined = React.useMemo(() => {
    const from = value.from ? parseYmd(value.from) : undefined;
    const to = value.to ? parseYmd(value.to) : undefined;
    if (!from && !to) return undefined;
    return { from, to };
  }, [value.from, value.to]);

  const label = React.useMemo(() => {
    const from = value.from ? parseYmd(value.from) : undefined;
    const to = value.to ? parseYmd(value.to) : undefined;
    if (from && to) return `${formatDisplay(from)} to ${formatDisplay(to)}`;
    if (from) return `${formatDisplay(from)} to …`;
    return "Select date range";
  }, [value.from, value.to]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(triggerClassName, className)}
          aria-expanded={open}
          aria-haspopup="dialog"
        >
          <span className={cn("min-w-0 flex-1 truncate", !value.from && "text-white/60")}>
            {label}
          </span>
          <CalendarIcon className="h-4 w-4 shrink-0 text-white/50" aria-hidden />
          <ChevronDown className="h-4 w-4 shrink-0 text-white/40" aria-hidden />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="border-b border-white/10 p-3">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="rounded-full border border-white/15 bg-white/5 px-3 py-1 font-gotham text-xs text-white/80 hover:bg-white/10"
              onClick={() => {
                const today = new Date();
                const start = new Date();
                start.setDate(today.getDate() - 6);
                onChange({ from: toYmd(start), to: toYmd(today) });
              }}
            >
              Last 7 days
            </button>
            <button
              type="button"
              className="rounded-full border border-white/15 bg-white/5 px-3 py-1 font-gotham text-xs text-white/80 hover:bg-white/10"
              onClick={() => {
                const today = new Date();
                const start = new Date(today.getFullYear(), today.getMonth(), 1);
                onChange({ from: toYmd(start), to: toYmd(today) });
              }}
            >
              This month
            </button>
            <button
              type="button"
              className="rounded-full border border-white/15 bg-white/5 px-3 py-1 font-gotham text-xs text-white/80 hover:bg-white/10"
              onClick={() => {
                onChange({ from: undefined, to: undefined });
              }}
            >
              Clear
            </button>
          </div>
        </div>

        <DayPicker
          mode="range"
          selected={selectedRange}
          onSelect={(range) => {
            onChange({
              from: range?.from ? toYmd(range.from) : undefined,
              to: range?.to ? toYmd(range.to) : undefined,
            });
          }}
          numberOfMonths={2}
          weekStartsOn={1}
          locale={rdpEnGB}
          showOutsideDays
          className={calendarClassName}
        />

        <div className="flex items-center justify-end gap-2 border-t border-white/10 p-3">
          <button
            type="button"
            className="rounded-lg px-3 py-1.5 font-gotham text-sm text-white/70 hover:text-white"
            onClick={() => setOpen(false)}
          >
            Done
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

