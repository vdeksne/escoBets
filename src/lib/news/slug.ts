const SLUG_RE = /[^a-z0-9]+/g;

const DEFAULT_MAX = 80;

/**
 * Web-safe slug: lowercase, hyphens, trimmed length. Used for URL paths from a headline.
 */
export function slugifyHeadline(value: string, maxLen: number = DEFAULT_MAX): string {
  return value
    .toLowerCase()
    .trim()
    .replace(SLUG_RE, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, maxLen);
}
