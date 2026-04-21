import type { ProfitTrackerData, ProfitTrackerEntry } from "@/types/profit-tracker";

/**
 * Mock data – replace with API calls:
 * - GET /api/profit-tracker or similar
 * - useSWR/react-query for fetching
 */
export const MOCK_PROFIT_TRACKER_DATA: ProfitTrackerData = {
  metrics: {
    totalInvestments: {
      value: 350000,
      previousValue: 235000,
      period: "Last 7 days",
      previousPeriod: "Previous 7days",
    },
    totalProfits: {
      value: 10700,
      previousValue: 7600,
      period: "Last 7 days",
      previousPeriod: "Previous 7days",
    },
    totalLosses: {
      value: 1700,
      previousValue: 7600,
      period: "Last 7 days",
      previousPeriod: "Previous 7days",
    },
  },
  weeklyReport: {
    thisWeek: {
      summary: {
        investments: 64000,
        totalProfits: 10700,
        totalLosses: 1700,
      },
      chartData: [
        { day: "Sun", fullDay: "Sunday", value: 2000, date: "2026-02-23" },
        { day: "Mon", fullDay: "Monday", value: 4000, date: "2026-02-24" },
        { day: "Tue", fullDay: "Tuesday", value: 6000, date: "2026-02-25" },
        { day: "Wed", fullDay: "Wednesday", value: 9000, date: "2026-02-26" },
        { day: "Thu", fullDay: "Thursday", value: 12000, date: "2026-02-27" },
        { day: "Fri", fullDay: "Friday", value: 15000, date: "2026-02-28" },
        { day: "Sat", fullDay: "Saturday", value: 16000, date: "2026-03-01" },
      ],
    },
    lastWeek: {
      summary: {
        investments: 63000,
        totalProfits: 8600,
        totalLosses: 2100,
      },
      chartData: [
        { day: "Sun", fullDay: "Sunday", value: 3000, date: "2026-02-16" },
        { day: "Mon", fullDay: "Monday", value: 5000, date: "2026-02-17" },
        { day: "Tue", fullDay: "Tuesday", value: 7000, date: "2026-02-18" },
        { day: "Wed", fullDay: "Wednesday", value: 9000, date: "2026-02-19" },
        { day: "Thu", fullDay: "Thursday", value: 11000, date: "2026-02-20" },
        { day: "Fri", fullDay: "Friday", value: 13000, date: "2026-02-21" },
        { day: "Sat", fullDay: "Saturday", value: 15000, date: "2026-02-22" },
      ],
    },
    total: {
      summary: {
        investments: 127000,
        totalProfits: 19300,
        totalLosses: 3800,
      },
      chartData: [
        { day: "Sun", fullDay: "Sunday", value: 3500, date: "2026-02-17" },
        { day: "Mon", fullDay: "Monday", value: 6500, date: "2026-02-18" },
        { day: "Tue", fullDay: "Tuesday", value: 10000, date: "2026-02-19" },
        { day: "Wed", fullDay: "Wednesday", value: 14000, date: "2026-02-20" },
        { day: "Thu", fullDay: "Thursday", value: 18000, date: "2026-02-21" },
        { day: "Fri", fullDay: "Friday", value: 22000, date: "2026-02-22" },
        { day: "Sat", fullDay: "Saturday", value: 26000, date: "2026-02-23" },
      ],
    },
  },
};

/** Mock entries for "All Entries" page – replace with GET /api/profit-tracker/entries */
export const MOCK_ENTRIES: ProfitTrackerEntry[] = [
  { id: "1", amount: 5000, type: "investment", date: "2026-02-26" },
  { id: "2", amount: 1200, type: "profit", date: "2026-02-25" },
  { id: "3", amount: 350, type: "loss", date: "2026-02-24" },
  { id: "4", amount: 10000, type: "investment", date: "2026-02-23" },
  { id: "5", amount: 2400, type: "profit", date: "2026-02-22" },
  { id: "6", amount: 800, type: "loss", date: "2026-02-21" },
  { id: "7", amount: 2500, type: "investment", date: "2026-02-20" },
  { id: "8", amount: 950, type: "profit", date: "2026-02-19" },
];

export const TRACKING_TYPES = [
  { value: "investment", label: "Investment" },
  { value: "profit", label: "Profit" },
  { value: "loss", label: "Loss" },
] as const;
