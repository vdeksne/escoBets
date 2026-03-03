/**
 * Profit Tracker types – structured for backend integration.
 * Replace mock data with API calls when ready.
 */

/** Category for each tracked value (enum in DB or config) */
export type TrackingType = "investment" | "profit" | "loss";

/** Raw entry from form / DB */
export interface ProfitTrackerEntry {
  id: string;
  amount: number;
  type: TrackingType;
  date: string; // ISO date YYYY-MM-DD
  createdAt?: string;
  userId?: string; // when auth is wired
}

/** Aggregated metric for a time period */
export interface PeriodMetric {
  value: number;
  previousValue: number;
  period: string; // e.g. "Last 7 days"
  previousPeriod: string; // e.g. "Previous 7days"
}

/** Day-level data for chart */
export interface DayDataPoint {
  day: string; // "Sun" | "Mon" | ...
  fullDay: string; // "Sunday", "Monday", ...
  value: number;
  date: string; // YYYY-MM-DD
}

/** Summary for a week (investments, profits, losses) */
export interface WeeklySummary {
  investments: number;
  totalProfits: number;
  totalLosses: number;
}

/** Full dashboard data – shape of API response */
export interface ProfitTrackerData {
  metrics: {
    totalInvestments: PeriodMetric;
    totalProfits: PeriodMetric;
    totalLosses: PeriodMetric;
  };
  weeklyReport: {
    thisWeek: { summary: WeeklySummary; chartData: DayDataPoint[] };
    lastWeek: { summary: WeeklySummary; chartData: DayDataPoint[] };
  };
}
