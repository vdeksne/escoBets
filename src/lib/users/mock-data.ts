import type { AdminUser } from "@/types/user";

/** 20 × 5 → 100 unique full names (row-major: same last name block = shared surname, varied first names). */
const FIRST_NAMES = [
  "Viktorija",
  "John",
  "Maria",
  "Lars",
  "Anna",
  "Erik",
  "Sophie",
  "James",
  "Elena",
  "Mark",
  "Olivia",
  "Thomas",
  "Julia",
  "Mateo",
  "Priya",
  "Yuki",
  "Fatima",
  "Nathan",
  "Zoe",
  "Ahmed",
] as const;

const LAST_NAMES = ["Deksne", "Smith", "Garcia", "Nielsen", "Kowalski"] as const;

const STATUSES: AdminUser["status"][] = [
  "Complete",
  "Pending",
  "Failed",
  "Complete",
  "Complete",
  "Pending",
  "Failed",
  "Complete",
  "Archived",
  "Complete",
];

function fullNameAt(index: number): string {
  const first = FIRST_NAMES[index % FIRST_NAMES.length]!;
  const last = LAST_NAMES[Math.floor(index / FIRST_NAMES.length) % LAST_NAMES.length]!;
  return `${first} ${last}`;
}

function slugPart(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function demoTelegram(first: string, last: string, n: number): string {
  const base = `${slugPart(first)}_${slugPart(last)}`;
  return `${base}_${String(n).padStart(3, "0")}`;
}

function demoEmail(first: string, last: string, n: number): string {
  return `${slugPart(first)}.${slugPart(last)}.${n}@demo.escobets.local`;
}

/** Mock users for admin dashboard – REPLACE with backend API (100 rows, unique identity fields). */
export const MOCK_ADMIN_USERS: AdminUser[] = Array.from({ length: 100 }, (_, i) => {
  const n = i + 1;
  const first = FIRST_NAMES[i % FIRST_NAMES.length]!;
  const last = LAST_NAMES[Math.floor(i / FIRST_NAMES.length) % LAST_NAMES.length]!;
  return {
    id: `user-${n}`,
    userName: fullNameAt(i),
    telegram: demoTelegram(first, last, n),
    phone: `+1 555 ${String(2_000_000 + n).slice(-7)}`,
    email: demoEmail(first, last, n),
    status: STATUSES[i % STATUSES.length],
    lastUpdate: `${String(1 + (i % 28)).padStart(2, "0")} Mar 2026, ${String(9 + (i % 12)).padStart(2, "0")}:${String(i % 60).padStart(2, "0")}`,
    profits: 10500 + i * 123,
    losses: 10500 - i * 50 + (i % 3) * 200,
  };
});
