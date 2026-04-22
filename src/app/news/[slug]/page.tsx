import { NewsArticleView } from "@/components/news/news-article-view";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import type { NewsArticle } from "@/types/news";
import type { ApiResponse } from "@/types/api";

interface NewsListData {
  items: NewsArticle[];
  categories?: string[];
}

async function getBaseUrl(): Promise<string> {
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  const protocol = requestHeaders.get("x-forwarded-proto") ?? "http";

  if (!host) {
    throw new Error("Missing request host header.");
  }

  return `${protocol}://${host}`;
}

async function fetchNewsArticle(slug: string): Promise<NewsArticle | null> {
  const baseUrl = await getBaseUrl();
  const response = await fetch(`${baseUrl}/api/news/${slug}`, {
    cache: "no-store",
  });

  if (response.status === 404) {
    return null;
  }

  const payload = (await response.json()) as ApiResponse<NewsArticle>;

  if (!response.ok || !payload.success) {
    const message =
      payload.success === false
        ? payload.error.message
        : "Failed to fetch news article.";
    throw new Error(message);
  }

  return payload.data;
}

async function fetchSimilarArticles(
  currentArticleId: string
): Promise<NewsArticle[]> {
  const baseUrl = await getBaseUrl();
  const response = await fetch(`${baseUrl}/api/news?page=1&pageSize=6`, {
    cache: "no-store",
  });
  const payload = (await response.json()) as ApiResponse<NewsListData>;

  if (!response.ok || !payload.success) {
    return [];
  }

  return payload.data.items
    .filter((item) => item.id !== currentArticleId)
    .slice(0, 3);
}

/** Article detail page – backend: fetch by slug */
export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await fetchNewsArticle(slug);

  if (!article) {
    notFound();
  }

  const similarArticles = await fetchSimilarArticles(article.id);

  return (
    <NewsArticleView
      article={article}
      similarArticles={similarArticles}
      viewSlug={slug.trim().toLowerCase()}
    />
  );
}
