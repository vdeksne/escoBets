/**
 * News article types – for NEWS AND PREDICTIONS section.
 * Backend: replace mock data with CMS/API (e.g. Sanity, Strapi).
 */

export interface NewsArticleSection {
  heading: string;
  content: string;
}

export interface NewsArticle {
  id: string;
  slug?: string;
  imageUrl: string;
  date: string; // e.g. "Sunday, 1 Jan 2026" or "October 15, 2026"
  headline: string;
  excerpt?: string;
  tags: string[];
  /** Full article content (for article detail view) */
  body?: NewsArticleSection[];
  /** Table of contents (section headings) */
  tableOfContents?: string[];
  /** Article metadata */
  author?: string;
  category?: string;
  readingTime?: string; // e.g. "10 Min"
  /** Interaction metrics */
  likes?: number;
  views?: number;
  comments?: number;
  /** Admin API only — hidden from public /api/news */
  isDraft?: boolean;
}

/** Public comment row from /api/news/[slug]/engagement or comments */
export interface NewsCommentPublic {
  id: string;
  body: string;
  author: string | null;
  createdAt: string;
  /** Server: current viewer may remove this (admin or own comment with visitor cookie) */
  canDelete?: boolean;
}
