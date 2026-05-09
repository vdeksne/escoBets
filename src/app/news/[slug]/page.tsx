import { NewsArticleView } from "@/components/news/news-article-view";
import { getNewsListPayload } from "@/lib/news/get-public-news-list";
import { getPublicNewsArticleBySlug } from "@/lib/news/get-public-news-article";
import { notFound } from "next/navigation";

/** Article detail page – backend: fetch by slug */
export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const normalizedSlug = slug.trim().toLowerCase();

  const [article, listSnapshot] = await Promise.all([
    getPublicNewsArticleBySlug(slug),
    getNewsListPayload({
      page: 1,
      pageSize: 64,
      search: "",
      tag: "",
      category: "",
    }),
  ]);

  if (!article) {
    notFound();
  }

  const similarArticles = listSnapshot.items
    .filter((item) => item.id !== article.id)
    .slice(0, 3);

  return (
    <NewsArticleView
      article={article}
      similarArticles={similarArticles}
      viewSlug={normalizedSlug}
    />
  );
}
