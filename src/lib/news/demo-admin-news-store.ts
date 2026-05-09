import { MOCK_NEWS_ARTICLES } from "@/lib/news/mock-data";
import type { NewsArticle } from "@/types/news";

/** In-memory news for admin API when `isDemoMode()` — survives for process lifetime only. */
let demoAdminNews: NewsArticle[] | null = null;

export function getDemoAdminNewsList(): NewsArticle[] {
  demoAdminNews ??= structuredClone(MOCK_NEWS_ARTICLES);
  return demoAdminNews;
}

export function findDemoAdminArticle(idOrSlug: string): NewsArticle | undefined {
  return getDemoAdminNewsList().find((a) => a.id === idOrSlug || a.slug === idOrSlug);
}

export function demoAdminSlugTaken(slug: string, exceptId?: string): boolean {
  return getDemoAdminNewsList().some((a) => {
    if (exceptId && a.id === exceptId) return false;
    return a.id === slug || a.slug === slug;
  });
}

export function prependDemoAdminArticle(article: NewsArticle): void {
  getDemoAdminNewsList().unshift(article);
}

export function replaceDemoAdminArticle(id: string, article: NewsArticle): boolean {
  const list = getDemoAdminNewsList();
  const idx = list.findIndex((a) => a.id === id || a.slug === id);
  if (idx === -1) return false;
  list[idx] = article;
  return true;
}

export function removeDemoAdminArticle(id: string): boolean {
  const list = getDemoAdminNewsList();
  const idx = list.findIndex((a) => a.id === id || a.slug === id);
  if (idx === -1) return false;
  list.splice(idx, 1);
  return true;
}
