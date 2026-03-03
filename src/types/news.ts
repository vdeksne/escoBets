/**
 * News article types – for NEWS AND PREDICTIONS section.
 * Backend: replace mock data with CMS/API (e.g. Sanity, Strapi).
 */

export interface NewsArticle {
  id: string;
  slug?: string;
  imageUrl: string;
  date: string; // e.g. "Sunday, 1 Jan 2026"
  headline: string;
  excerpt?: string;
  tags: string[];
}
