import type { ProfitTrackerData, ProfitTrackerEntry } from "@/types/profit-tracker";

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

/** Local calendar YYYY-MM-DD */
export function profitMockToYmd(d: Date): string {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function addDays(d: Date, days: number): Date {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  x.setDate(x.getDate() + days);
  return x;
}

/**
 * ~8 weeks of demo rows: profit settlements rise over time (newer weeks = higher income),
 * with steady investments and small losses so the dashboard chart trends up.
 * Dates are anchored to `reference` (defaults to now) so “Last 7 days” / weekly charts stay populated.
 */
export function buildMockProfitTrackerEntries(reference = new Date()): ProfitTrackerEntry[] {
  const ref = new Date(reference.getFullYear(), reference.getMonth(), reference.getDate());
  const entries: ProfitTrackerEntry[] = [];
  let n = 0;
  const id = () => `mock-pt-${++n}`;

  const horizonDays = 56;

  for (let daysAgo = horizonDays; daysAgo >= 0; daysAgo--) {
    const d = addDays(ref, -daysAgo);
    const ymd = profitMockToYmd(d);
    const dow = d.getDay();
    const recency = horizonDays - daysAgo;

    // Weekly capital adds (Mondays)
    if (dow === 1) {
      const weekIndex = Math.floor(recency / 7);
      entries.push({
        id: id(),
        name: `Stake week ${weekIndex + 1}`,
        amount: 4_500 + weekIndex * 550,
        type: "investment",
        date: ymd,
      });
    }

    // Profit settlements: more frequent and larger as time goes on (income ramping up)
    if (dow === 2 || dow === 4 || dow === 6) {
      const base = 220 + Math.round(recency * 28);
      const bump = (daysAgo % 5) * 40;
      entries.push({
        id: id(),
        name: daysAgo <= 7 ? "Pick settlement" : "Ticket win",
        amount: base + bump,
        type: "profit",
        date: ymd,
      });
    }

    // Small losses on some Wednesdays (does not outweigh the upward profit slope)
    if (dow === 3 && daysAgo % 2 === 0) {
      entries.push({
        id: id(),
        name: "Void / regrade",
        amount: Math.min(520, 180 + Math.floor(recency / 4)),
        type: "loss",
        date: ymd,
      });
    }
  }

  // Extra “recent hot streak” — last few days edge higher
  for (let k = 0; k < 4; k++) {
    const d = addDays(ref, -k);
    entries.push({
      id: id(),
      name: "Live edge",
      amount: 950 + k * 120 + (4 - k) * 85,
      type: "profit",
      date: profitMockToYmd(d),
    });
  }

  return entries.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

/**
 * Mock data – static snapshot shape; the live dashboard uses `deriveDashboardFromEntries`
 * with `buildMockProfitTrackerEntries()` so charts match dated rows.
 */
export const MOCK_PROFIT_TRACKER_DATA: ProfitTrackerData = {
  metrics: {
    totalInvestments: {
      value: 420000,
      previousValue: 310000,
      period: "Last 7 days",
      previousPeriod: "Previous 7days",
    },
    totalProfits: {
      value: 28500,
      previousValue: 15200,
      period: "Last 7 days",
      previousPeriod: "Previous 7days",
    },
    totalLosses: {
      value: 3200,
      previousValue: 4100,
      period: "Last 7 days",
      previousPeriod: "Previous 7days",
    },
  },
  weeklyReport: {
    thisWeek: {
      summary: {
        investments: 72000,
        totalProfits: 28500,
        totalLosses: 3200,
      },
      chartData: [
        { day: "Sun", fullDay: "Sunday", value: 4000, date: "2026-05-03" },
        { day: "Mon", fullDay: "Monday", value: 9500, date: "2026-05-04" },
        { day: "Tue", fullDay: "Tuesday", value: 14000, date: "2026-05-05" },
        { day: "Wed", fullDay: "Wednesday", value: 17500, date: "2026-05-06" },
        { day: "Thu", fullDay: "Thursday", value: 22800, date: "2026-05-07" },
        { day: "Fri", fullDay: "Friday", value: 29200, date: "2026-05-08" },
        { day: "Sat", fullDay: "Saturday", value: 31800, date: "2026-05-09" },
      ],
    },
    lastWeek: {
      summary: {
        investments: 68000,
        totalProfits: 19800,
        totalLosses: 4500,
      },
      chartData: [
        { day: "Sun", fullDay: "Sunday", value: 2500, date: "2026-04-26" },
        { day: "Mon", fullDay: "Monday", value: 7200, date: "2026-04-27" },
        { day: "Tue", fullDay: "Tuesday", value: 11800, date: "2026-04-28" },
        { day: "Wed", fullDay: "Wednesday", value: 13900, date: "2026-04-29" },
        { day: "Thu", fullDay: "Thursday", value: 18100, date: "2026-04-30" },
        { day: "Fri", fullDay: "Friday", value: 22400, date: "2026-05-01" },
        { day: "Sat", fullDay: "Saturday", value: 25100, date: "2026-05-02" },
      ],
    },
    total: {
      summary: {
        investments: 140000,
        totalProfits: 48300,
        totalLosses: 7700,
      },
      chartData: [
        { day: "Sun", fullDay: "Sunday", value: 6500, date: "2026-05-03" },
        { day: "Mon", fullDay: "Monday", value: 16700, date: "2026-05-04" },
        { day: "Tue", fullDay: "Tuesday", value: 25800, date: "2026-05-05" },
        { day: "Wed", fullDay: "Wednesday", value: 30300, date: "2026-05-06" },
        { day: "Thu", fullDay: "Thursday", value: 40600, date: "2026-05-07" },
        { day: "Fri", fullDay: "Friday", value: 52000, date: "2026-05-08" },
        { day: "Sat", fullDay: "Saturday", value: 57100, date: "2026-05-09" },
      ],
    },
  },
};

export const TRACKING_TYPES = [
  { value: "investment", label: "Investment" },
  { value: "profit", label: "Profit" },
  { value: "loss", label: "Loss" },
] as const;
