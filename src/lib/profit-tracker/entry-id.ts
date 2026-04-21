const ENTRY_ID_PREFIX = "PT";

function dateStamp(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}${month}${day}`;
}

function randomToken(length: number): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < length; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

/** Example: PT-20260421-A9K3 */
export function generateProfitTrackerEntryId(now = new Date()): string {
  return `${ENTRY_ID_PREFIX}-${dateStamp(now)}-${randomToken(4)}`;
}
