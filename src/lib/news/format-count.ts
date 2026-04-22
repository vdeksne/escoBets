/** Compact display for likes / views (e.g. 8.9k). */
export function formatEngagementCount(n: number): string {
  if (n >= 1000) {
    return `${(n / 1000).toFixed(1)}k`;
  }
  return String(n);
}
