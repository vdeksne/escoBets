import type { NewsArticle } from "@/types/news";

/** First block stores TipTap / rich HTML; legacy articles may use plain text sections. */
export function getNewsBodyHtml(article: NewsArticle | null | undefined): string {
  const body = article?.body;
  if (!Array.isArray(body) || body.length === 0) return "";
  return body[0]?.content?.trim() ?? "";
}
