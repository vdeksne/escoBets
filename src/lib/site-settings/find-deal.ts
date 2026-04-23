import type { SiteDeal } from "@/types/site-settings";

export function findDealBySlug(deals: SiteDeal[], slug: string): SiteDeal | undefined {
  const normalized = decodeURIComponent(slug).trim().toLowerCase();
  return deals.find((d) => d.slug.trim().toLowerCase() === normalized);
}
