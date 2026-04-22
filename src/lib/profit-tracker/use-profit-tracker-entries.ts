"use client";

import { useCallback, useEffect, useState } from "react";
import type { ProfitTrackerEntry } from "@/types/profit-tracker";
import {
  loadProfitTrackerEntries,
  PROFIT_TRACKER_ENTRIES_CHANGED,
  readLocalProfitTrackerEntries,
  saveProfitTrackerEntries,
  writeLocalProfitTrackerCache,
} from "@/lib/profit-tracker/entries-storage";

/**
 * Profit tracker entries: loads from the API (Postgres) when signed in, migrates
 * from localStorage once, and falls back to the legacy mock for anonymous /profit-tracker.
 * Pass `storageScope` (admin) as the target user's auth id.
 */
export function useProfitTrackerEntries(storageScope?: string) {
  const [entries, setEntries] = useState<ProfitTrackerEntry[]>([]);

  const readCachedOrDemo = useCallback((): ProfitTrackerEntry[] => {
    const c = readLocalProfitTrackerEntries(storageScope);
    if (c.length > 0) return c;
    return loadProfitTrackerEntries(storageScope);
  }, [storageScope]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const url = storageScope
        ? `/api/profit-tracker/entries?userId=${encodeURIComponent(storageScope)}`
        : "/api/profit-tracker/entries";
      const res = await fetch(url, { credentials: "include" });
      if (cancelled) return;

      if (res.status === 401) {
        setEntries(loadProfitTrackerEntries(storageScope));
        return;
      }
      if (!res.ok) {
        setEntries(readCachedOrDemo());
        return;
      }
      const payload = (await res.json()) as {
        success?: boolean;
        data?: { entries?: ProfitTrackerEntry[] };
      };
      if (!payload.success || !Array.isArray(payload.data?.entries)) {
        setEntries(readCachedOrDemo());
        return;
      }
      let list = payload.data!.entries;
      if (list.length === 0) {
        const local = readLocalProfitTrackerEntries(storageScope);
        if (local.length > 0) {
          await saveProfitTrackerEntries(local, storageScope);
          if (cancelled) return;
          list = local;
        }
      }
      if (list.length > 0) {
        writeLocalProfitTrackerCache(list, storageScope);
      }
      if (!cancelled) setEntries(list);
    })();

    const onLocal = () => {
      if (!cancelled) setEntries(readCachedOrDemo());
    };
    if (typeof window !== "undefined") {
      window.addEventListener(PROFIT_TRACKER_ENTRIES_CHANGED, onLocal);
      window.addEventListener("storage", onLocal);
    }
    return () => {
      cancelled = true;
      if (typeof window !== "undefined") {
        window.removeEventListener(PROFIT_TRACKER_ENTRIES_CHANGED, onLocal);
        window.removeEventListener("storage", onLocal);
      }
    };
  }, [readCachedOrDemo, storageScope]);

  return entries;
}
