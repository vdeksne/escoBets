import type { SiteDeal } from "@/types/site-settings";

/**
 * Resolves the URL for a deal card: external URL, custom path, or `/deals/[slug]`.
 */
export function dealPageHref(d: SiteDeal): string {
  const h = d.href?.trim() ?? "";
  if (/^https?:\/\//i.test(h)) {
    return h;
  }
  if (h.startsWith("/deals/") && h.slice("/deals/".length).length > 0) {
    return h;
  }
  const s = d.slug?.trim();
  if (s) {
    return `/deals/${s}`;
  }
  return "/deals";
}
