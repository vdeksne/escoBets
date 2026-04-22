import type { ProfitTrackerEntry } from "@/types/profit-tracker";
import { MOCK_ENTRIES } from "@/lib/profit-tracker/mock-data";
import { generateProfitTrackerEntryId } from "@/lib/profit-tracker/entry-id";

const STORAGE_KEY = "esco.profit-tracker.entries";

export const PROFIT_TRACKER_ENTRIES_CHANGED = "profit-tracker-entries-changed";

function storageKey(scope?: string): string {
  return scope ? `${STORAGE_KEY}::${scope}` : STORAGE_KEY;
}

/** Update localStorage cache and notify (e.g. after a successful API fetch). */
export function writeLocalProfitTrackerCache(
  entries: ProfitTrackerEntry[],
  scope?: string
) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(storageKey(scope), JSON.stringify(entries));
  notifyEntriesChanged();
}

function notifyEntriesChanged() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(PROFIT_TRACKER_ENTRIES_CHANGED));
}

function isAuthUuid(id: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    id.trim()
  );
}

/** Read cache only; never seeds mock data. */
export function readLocalProfitTrackerEntries(scope?: string): ProfitTrackerEntry[] {
  if (typeof window === "undefined") return [];
  const key = storageKey(scope);
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed as ProfitTrackerEntry[];
  } catch {
    return [];
  }
}

/**
 * Synchronous read for anonymous demo / first paint: may seed `MOCK_ENTRIES` in localStorage.
 * Prefer the async API path when the user is signed in.
 */
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

/**
 * For adding entries: use cached rows if any, else fall back to demo seeding for anonymous.
 */
function existingEntriesForMutation(scope?: string): ProfitTrackerEntry[] {
  const fromCache = readLocalProfitTrackerEntries(scope);
  if (fromCache.length > 0) return fromCache;
  return loadProfitTrackerEntries(scope);
}

export async function saveProfitTrackerEntries(
  entries: ProfitTrackerEntry[],
  scope?: string
): Promise<void> {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(storageKey(scope), JSON.stringify(entries));
    notifyEntriesChanged();
  }
  const body: { entries: ProfitTrackerEntry[]; targetUserId?: string } = { entries };
  if (scope && isAuthUuid(scope)) {
    body.targetUserId = scope;
  }
  try {
    const res = await fetch("/api/profit-tracker/entries", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      credentials: "include",
    });
    if (!res.ok) {
      /* Keep local copy; no server (guest or table missing) */
    }
  } catch {
    /* offline */
  }
}

export async function clearProfitTrackerEntries(scope?: string) {
  await saveProfitTrackerEntries([], scope);
}

export async function addProfitTrackerEntry(
  partial: Omit<ProfitTrackerEntry, "id">,
  scope?: string
) {
  const entries = existingEntriesForMutation(scope);
  const name = partial.name?.trim();
  const next: ProfitTrackerEntry = {
    id: generateProfitTrackerEntryId(),
    ...partial,
    name: name && name.length > 0 ? name : undefined,
  };
  await saveProfitTrackerEntries([next, ...entries], scope);
}
