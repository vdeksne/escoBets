import type {
  DayDataPoint,
  PeriodMetric,
  ProfitTrackerData,
  ProfitTrackerEntry,
  WeeklySummary,
} from "@/types/profit-tracker";

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

/** Local calendar date YYYY-MM-DD */
function toLocalYmd(d: Date): string {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function addDays(d: Date, days: number): Date {
  const x = new Date(d);
  x.setDate(x.getDate() + days);
  return x;
}

/** Week starting Sunday (0) through Saturday, local time */
function weekDatesContaining(ref: Date, weekOffset: number): string[] {
  const local = new Date(ref.getFullYear(), ref.getMonth(), ref.getDate());
  const dow = local.getDay();
  const start = addDays(local, -dow - weekOffset * 7);
  const dates: string[] = [];
  for (let i = 0; i < 7; i++) {
    dates.push(toLocalYmd(addDays(start, i)));
  }
  return dates;
}

/** Rolling 7-day window ending today (local time) */
function last7DatesEndingToday(ref: Date): string[] {
  const local = new Date(ref.getFullYear(), ref.getMonth(), ref.getDate());
  const dates: string[] = [];
  for (let i = 6; i >= 0; i--) {
    dates.push(toLocalYmd(addDays(local, -i)));
  }
  return dates;
}

const SHORT_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
const FULL_DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

function signedEntryAmount(e: ProfitTrackerEntry): number {
  if (e.type === "loss") return -e.amount;
  return e.amount;
}

function sumInRange(
  entries: ProfitTrackerEntry[],
  fromYmd: string,
  toYmd: string,
  type: ProfitTrackerEntry["type"],
): number {
  return entries
    .filter((e) => e.date >= fromYmd && e.date <= toYmd && e.type === type)
    .reduce((s, e) => s + e.amount, 0);
}

/** Rolling last 7 local days vs previous 7 */
function rollingPeriodMetrics(entries: ProfitTrackerEntry[]): {
  investments: PeriodMetric;
  profits: PeriodMetric;
  losses: PeriodMetric;
} {
  const today = new Date();
  const end = toLocalYmd(today);
  const start = toLocalYmd(addDays(today, -6));
  const prevEnd = toLocalYmd(addDays(today, -7));
  const prevStart = toLocalYmd(addDays(today, -13));

  const inv = sumInRange(entries, start, end, "investment");
  const invPrev = sumInRange(entries, prevStart, prevEnd, "investment");
  const prof = sumInRange(entries, start, end, "profit");
  const profPrev = sumInRange(entries, prevStart, prevEnd, "profit");
  const loss = sumInRange(entries, start, end, "loss");
  const lossPrev = sumInRange(entries, prevStart, prevEnd, "loss");

  const period = "Last 7 days";
  const previousPeriod = "Previous 7 days";

  return {
    investments: {
      value: inv,
      previousValue: invPrev,
      period,
      previousPeriod,
    },
    profits: {
      value: prof,
      previousValue: profPrev,
      period,
      previousPeriod,
    },
    losses: {
      value: loss,
      previousValue: lossPrev,
      period,
      previousPeriod,
    },
  };
}

function weeklySummaryForWeek(
  entries: ProfitTrackerEntry[],
  weekDates: string[],
): WeeklySummary {
  const from = weekDates[0];
  const to = weekDates[6];
  return {
    investments: sumInRange(entries, from, to, "investment"),
    totalProfits: sumInRange(entries, from, to, "profit"),
    totalLosses: sumInRange(entries, from, to, "loss"),
  };
}

function weeklySummaryForRange(
  entries: ProfitTrackerEntry[],
  from: string,
  to: string,
): WeeklySummary {
  return {
    investments: sumInRange(entries, from, to, "investment"),
    totalProfits: sumInRange(entries, from, to, "profit"),
    totalLosses: sumInRange(entries, from, to, "loss"),
  };
}

function chartDataForWeek(
  entries: ProfitTrackerEntry[],
  weekDates: string[],
): DayDataPoint[] {
  const from = weekDates[0];
  return weekDates.map((dayEnd, i) => {
    let cumulative = 0;
    let cumulativeInvestments = 0;
    let cumulativeProfits = 0;
    let cumulativeLosses = 0;
    for (const e of entries) {
      if (e.date < from || e.date > dayEnd) continue;
      cumulative += signedEntryAmount(e);
      if (e.type === "investment") cumulativeInvestments += e.amount;
      if (e.type === "profit") cumulativeProfits += e.amount;
      if (e.type === "loss") cumulativeLosses += e.amount;
    }
    return {
      day: SHORT_DAYS[i],
      fullDay: FULL_DAYS[i],
      value: cumulative,
      date: dayEnd,
      investments: cumulativeInvestments,
      profits: cumulativeProfits,
      losses: cumulativeLosses,
    };
  });
}

function chartDataForDates(
  entries: ProfitTrackerEntry[],
  dates: string[],
): DayDataPoint[] {
  const from = dates[0];
  return dates.map((dayEnd) => {
    let cumulative = 0;
    let cumulativeInvestments = 0;
    let cumulativeProfits = 0;
    let cumulativeLosses = 0;
    for (const e of entries) {
      if (e.date < from || e.date > dayEnd) continue;
      cumulative += signedEntryAmount(e);
      if (e.type === "investment") cumulativeInvestments += e.amount;
      if (e.type === "profit") cumulativeProfits += e.amount;
      if (e.type === "loss") cumulativeLosses += e.amount;
    }
    const d = new Date(`${dayEnd}T00:00:00`);
    const dow = d.getDay();
    return {
      day: SHORT_DAYS[dow],
      fullDay: FULL_DAYS[dow],
      value: cumulative,
      date: dayEnd,
      investments: cumulativeInvestments,
      profits: cumulativeProfits,
      losses: cumulativeLosses,
    };
  });
}

function listDatesInclusive(fromYmd: string, toYmd: string): string[] {
  const from = new Date(`${fromYmd}T00:00:00`);
  const to = new Date(`${toYmd}T00:00:00`);
  if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime()) || from > to) return [];
  const dates: string[] = [];
  for (let d = new Date(from); d <= to; d = addDays(d, 1)) {
    dates.push(toLocalYmd(d));
  }
  return dates;
}

function monthEndYmd(year: number, month1: number): string {
  // month1: 1..12
  const d = new Date(year, month1, 0); // day 0 of next month => last day of month
  return toLocalYmd(d);
}

const MONTH_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const;

function chartDataForDateTicks(
  entries: ProfitTrackerEntry[],
  from: string,
  ticks: Array<{ label: string; date: string }>,
): DayDataPoint[] {
  return ticks.map((t) => {
    let cumulative = 0;
    let cumulativeInvestments = 0;
    let cumulativeProfits = 0;
    let cumulativeLosses = 0;
    for (const e of entries) {
      if (e.date < from || e.date > t.date) continue;
      cumulative += signedEntryAmount(e);
      if (e.type === "investment") cumulativeInvestments += e.amount;
      if (e.type === "profit") cumulativeProfits += e.amount;
      if (e.type === "loss") cumulativeLosses += e.amount;
    }
    return {
      day: t.label,
      fullDay: t.date,
      value: cumulative,
      date: t.date,
      investments: cumulativeInvestments,
      profits: cumulativeProfits,
      losses: cumulativeLosses,
    };
  });
}

export type TotalTimeframe =
  | { mode: "last7" }
  | { mode: "month"; yearMonth: string } // YYYY-MM
  | { mode: "year"; year: number }
  | { mode: "custom"; from: string; to: string }; // YYYY-MM-DD

export function deriveTotalFromEntries(
  entries: ProfitTrackerEntry[],
  tf: TotalTimeframe,
): { summary: WeeklySummary; chartData: DayDataPoint[]; label: string } {
  const today = new Date();

  if (tf.mode === "last7") {
    const dates = last7DatesEndingToday(today);
    const from = dates[0];
    const to = dates[6];
    return {
      label: "Last 7 days",
      summary: weeklySummaryForRange(entries, from, to),
      chartData: chartDataForDates(entries, dates).map((p) => ({
        ...p,
        day: p.date.slice(5), // MM-DD
        fullDay: p.date,
      })),
    };
  }

  if (tf.mode === "month") {
    const ym = tf.yearMonth;
    const [yS, mS] = ym.split("-");
    const y = Number(yS);
    const m = Number(mS);
    const from = `${yS}-${mS}-01`;
    const to = monthEndYmd(y, m);
    const dates = listDatesInclusive(from, to);
    return {
      label: `${MONTH_SHORT[m - 1]} ${y}`,
      summary: weeklySummaryForRange(entries, from, to),
      chartData: chartDataForDates(entries, dates).map((p) => ({
        ...p,
        day: String(Number(p.date.slice(8, 10))), // day of month
        fullDay: p.date,
      })),
    };
  }

  if (tf.mode === "year") {
    const y = tf.year;
    const from = `${y}-01-01`;
    const to = `${y}-12-31`;
    const ticks = Array.from({ length: 12 }, (_, i) => ({
      label: MONTH_SHORT[i],
      date: monthEndYmd(y, i + 1),
    }));
    return {
      label: String(y),
      summary: weeklySummaryForRange(entries, from, to),
      chartData: chartDataForDateTicks(entries, from, ticks),
    };
  }

  // custom
  const from = tf.from;
  const to = tf.to;
  const dates = listDatesInclusive(from, to);
  if (dates.length === 0) {
    return { label: "Custom", summary: { investments: 0, totalProfits: 0, totalLosses: 0 }, chartData: [] };
  }

  // If range is large, bucket by month for readability/perf.
  if (dates.length > 62) {
    const start = new Date(`${from}T00:00:00`);
    const end = new Date(`${to}T00:00:00`);
    const ticks: Array<{ label: string; date: string }> = [];
    const cur = new Date(start.getFullYear(), start.getMonth(), 1);
    while (cur <= end) {
      const y = cur.getFullYear();
      const m1 = cur.getMonth() + 1;
      const endOfMonth = monthEndYmd(y, m1);
      const tickDate = endOfMonth > to ? to : endOfMonth;
      ticks.push({ label: `${MONTH_SHORT[m1 - 1]} ${y}`, date: tickDate });
      cur.setMonth(cur.getMonth() + 1);
    }
    return {
      label: `${from} → ${to}`,
      summary: weeklySummaryForRange(entries, from, to),
      chartData: chartDataForDateTicks(entries, from, ticks),
    };
  }

  return {
    label: `${from} → ${to}`,
    summary: weeklySummaryForRange(entries, from, to),
    chartData: chartDataForDates(entries, dates).map((p) => ({
      ...p,
      day: p.date.slice(5), // MM-DD
      fullDay: p.date,
    })),
  };
}

/**
 * Build dashboard metrics + weekly views from stored entries (local or API).
 */
export function deriveDashboardFromEntries(
  entries: ProfitTrackerEntry[],
): ProfitTrackerData {
  const m = rollingPeriodMetrics(entries);
  const thisWeekDates = weekDatesContaining(new Date(), 0);
  const lastWeekDates = weekDatesContaining(new Date(), 1);
  const totalDates = last7DatesEndingToday(new Date());

  return {
    metrics: {
      totalInvestments: m.investments,
      totalProfits: m.profits,
      totalLosses: m.losses,
    },
    weeklyReport: {
      thisWeek: {
        summary: weeklySummaryForWeek(entries, thisWeekDates),
        chartData: chartDataForWeek(entries, thisWeekDates),
      },
      lastWeek: {
        summary: weeklySummaryForWeek(entries, lastWeekDates),
        chartData: chartDataForWeek(entries, lastWeekDates),
      },
      total: {
        summary: weeklySummaryForWeek(entries, totalDates),
        chartData: chartDataForDates(entries, totalDates),
      },
    },
  };
}
