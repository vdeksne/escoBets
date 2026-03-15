import { NewsArticleView } from "@/components/news/news-article-view";
import { MOCK_NEWS_ARTICLES, getSimilarArticles } from "@/lib/news/mock-data";

/** Article detail page – backend: fetch by slug */
export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article =
    MOCK_NEWS_ARTICLES.find(
      (a) => a.id === slug || a.slug === slug
    ) ?? MOCK_NEWS_ARTICLES[0];
  const similarArticles = getSimilarArticles(article.id);

  return (
    <NewsArticleView article={article} similarArticles={similarArticles} />
  );
}
