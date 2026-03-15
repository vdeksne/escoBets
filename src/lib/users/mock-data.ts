import type { AdminUser } from "@/types/user";

const NAMES = [
  "Viktorija Deksne",
  "John Smith",
  "Maria Garcia",
  "Lars Andersen",
  "Anna Kowalski",
  "Erik Nielsen",
  "Sophie Müller",
  "James Wilson",
  "Elena Petrov",
  "Mark Johnson",
];
const TELEGRAM = ["vicky_latvia", "john_smith", "maria_g", "lars_a", "anna_k", "erik_n", "sophie_m", "james_w", "elena_p", "mark_j"];
const PHONES = ["+371 27266132", "+44 7700 900123", "+34 612 345678", "+45 20123456", "+48 601 234 567", "+46 70 123 4567", "+49 151 12345678", "+1 555 123 4567", "+7 912 345 6789", "+33 6 12 34 56 78"];
const EMAILS = [
  "viktorijadeksne@gmail.com",
  "john@example.com",
  "maria@example.com",
  "lars@example.com",
  "anna@example.com",
  "erik@example.com",
  "sophie@example.com",
  "james@example.com",
  "elena@example.com",
  "mark@example.com",
];
const STATUSES: AdminUser["status"][] = ["Complete", "Pending", "Failed", "Complete", "Complete", "Pending", "Failed", "Complete", "Archived", "Complete"];

/** Mock users for admin dashboard – REPLACE with backend API */
export const MOCK_ADMIN_USERS: AdminUser[] = Array.from({ length: 100 }, (_, i) => ({
  id: `user-${i + 1}`,
  userName: NAMES[i % NAMES.length],
  telegram: TELEGRAM[i % TELEGRAM.length],
  phone: PHONES[i % PHONES.length],
  email: EMAILS[i % EMAILS.length],
  status: STATUSES[i % STATUSES.length],
  lastUpdate: `${String(1 + (i % 28)).padStart(2, "0")} Mar 2026, ${String(9 + (i % 12)).padStart(2, "0")}:${String((i % 60)).padStart(2, "0")}`,
  profits: 10500 + i * 123,
  losses: 10500 - i * 50 + (i % 3) * 200,
}));
