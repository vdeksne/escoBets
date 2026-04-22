"use client";

import * as React from "react";
import { format, isValid, parse } from "date-fns";
import { enGB } from "date-fns/locale";
import { Calendar as CalendarIcon, ChevronDown } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { enGB as rdpEnGB } from "react-day-picker/locale";

import "react-day-picker/style.css";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const DISPLAY_FORMAT = "d MMMM yyyy";

function parseDisplayDate(raw: string): Date | undefined {
  const s = raw.trim();
  if (!s) return undefined;

  if (/^\d{4}-\d{2}-\d{2}/.test(s)) {
    const d = parse(s, "yyyy-MM-dd", new Date());
    if (isValid(d)) return d;
  }

  const patterns = ["d MMMM yyyy", "dd MMMM yyyy", "d-MMMM-yyyy", "dd-MMMM-yyyy"];
  for (const pattern of patterns) {
    const d = parse(s, pattern, new Date(), { locale: enGB });
    if (isValid(d)) return d;
  }

  const fallback = new Date(s);
  return isValid(fallback) ? fallback : undefined;
}

function formatDisplay(d: Date): string {
  return format(d, DISPLAY_FORMAT, { locale: enGB });
}

const triggerClassName =
  "flex h-10 w-full items-center gap-2 rounded-lg border-2 border-escobets-yellow bg-black/40 px-4 py-2 font-gotham text-left text-white " +
  "transition-[border-color,box-shadow] duration-150 hover:border-white/90 " +
  "focus:border-escobets-yellow focus:outline-none focus:ring-2 focus:ring-escobets-yellow/45 " +
  "disabled:cursor-not-allowed disabled:opacity-50";

const calendarClassName = cn("date-of-birth-calendar p-3 font-gotham text-sm text-white");

export interface ArticleDisplayDatePickerProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

/** Display date for news articles: same “d MMMM yyyy” + calendar as account date of birth (any calendar date). */
export function ArticleDisplayDatePicker({ id, value, onChange, disabled, className }: ArticleDisplayDatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const selected = React.useMemo(() => parseDisplayDate(value), [value]);
  const defaultMonth = selected ?? new Date();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          id={id}
          disabled={disabled}
          className={cn(triggerClassName, className)}
          aria-expanded={open}
          aria-haspopup="dialog"
        >
          <span className={cn("min-w-0 flex-1 truncate", !selected && "text-white/50")}>
            {selected ? formatDisplay(selected) : "Select display date"}
          </span>
          <CalendarIcon className="h-4 w-4 shrink-0 text-white/50" aria-hidden />
          <ChevronDown className="h-4 w-4 shrink-0 text-white/40" aria-hidden />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="max-w-[min(100vw-1.5rem,20rem)] border-2 border-escobets-yellow bg-black/95 p-0"
        align="start"
      >
        <DayPicker
          mode="single"
          selected={selected}
          onSelect={(d) => {
            if (d) onChange(formatDisplay(d));
            setOpen(false);
          }}
          defaultMonth={defaultMonth}
          captionLayout="dropdown"
          startMonth={new Date(1990, 0)}
          endMonth={new Date(2035, 11, 31)}
          weekStartsOn={1}
          locale={rdpEnGB}
          showOutsideDays
          className={calendarClassName}
        />
      </PopoverContent>
    </Popover>
  );
}
