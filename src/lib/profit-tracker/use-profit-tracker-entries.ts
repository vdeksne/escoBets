"use client";

import { useEffect, useState } from "react";
import type { ProfitTrackerEntry } from "@/types/profit-tracker";
import { MOCK_ENTRIES } from "@/lib/profit-tracker/mock-data";
import {
  loadProfitTrackerEntries,
  PROFIT_TRACKER_ENTRIES_CHANGED,
} from "@/lib/profit-tracker/entries-storage";

export function useProfitTrackerEntries() {
  const [entries, setEntries] = useState<ProfitTrackerEntry[]>(MOCK_ENTRIES);

  useEffect(() => {
    setEntries(loadProfitTrackerEntries());
    const sync = () => setEntries(loadProfitTrackerEntries());
    window.addEventListener(PROFIT_TRACKER_ENTRIES_CHANGED, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(PROFIT_TRACKER_ENTRIES_CHANGED, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return entries;
}
