import type { ProfitTrackerEntry } from "@/types/profit-tracker";
import { MOCK_ENTRIES } from "@/lib/profit-tracker/mock-data";
import { generateProfitTrackerEntryId } from "@/lib/profit-tracker/entry-id";

const STORAGE_KEY = "esco.profit-tracker.entries";

export const PROFIT_TRACKER_ENTRIES_CHANGED = "profit-tracker-entries-changed";

function storageKey(scope?: string): string {
  return scope ? `${STORAGE_KEY}::${scope}` : STORAGE_KEY;
}

function notifyEntriesChanged() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(PROFIT_TRACKER_ENTRIES_CHANGED));
}

export function loadProfitTrackerEntries(scope?: string): ProfitTrackerEntry[] {
  if (typeof window === "undefined") return MOCK_ENTRIES;
  const key = storageKey(scope);
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) {
      window.localStorage.setItem(key, JSON.stringify(MOCK_ENTRIES));
      return MOCK_ENTRIES;
    }
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return MOCK_ENTRIES;
    return parsed as ProfitTrackerEntry[];
  } catch {
    return MOCK_ENTRIES;
  }
}

export function saveProfitTrackerEntries(entries: ProfitTrackerEntry[], scope?: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(storageKey(scope), JSON.stringify(entries));
  notifyEntriesChanged();
}

export function clearProfitTrackerEntries(scope?: string) {
  saveProfitTrackerEntries([], scope);
}

export function addProfitTrackerEntry(
  partial: Omit<ProfitTrackerEntry, "id">,
  scope?: string
) {
  const entries = loadProfitTrackerEntries(scope);
  const name = partial.name?.trim();
  const next: ProfitTrackerEntry = {
    id: generateProfitTrackerEntryId(),
    ...partial,
    name: name && name.length > 0 ? name : undefined,
  };
  saveProfitTrackerEntries([next, ...entries], scope);
}
