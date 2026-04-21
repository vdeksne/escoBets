"use client";

import { useEffect, useState } from "react";
import type { ProfitTrackerEntry } from "@/types/profit-tracker";
import { MOCK_ENTRIES } from "@/lib/profit-tracker/mock-data";
import {
  loadProfitTrackerEntries,
  PROFIT_TRACKER_ENTRIES_CHANGED,
} from "@/lib/profit-tracker/entries-storage";

/**
 * Profit tracker entries for the current browser.
 * Pass `storageScope` (e.g. admin user id) to isolate data per user; omit for the signed-in member view.
 */
export function useProfitTrackerEntries(storageScope?: string) {
  const [entries, setEntries] = useState<ProfitTrackerEntry[]>(MOCK_ENTRIES);

  useEffect(() => {
    setEntries(loadProfitTrackerEntries(storageScope));
    const sync = () => setEntries(loadProfitTrackerEntries(storageScope));
    window.addEventListener(PROFIT_TRACKER_ENTRIES_CHANGED, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(PROFIT_TRACKER_ENTRIES_CHANGED, sync);
      window.removeEventListener("storage", sync);
    };
  }, [storageScope]);

  return entries;
}
