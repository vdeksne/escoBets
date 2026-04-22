import type { NewsArticle } from "@/types/news";
import type { NewsPostAdmin } from "@/types/news-post";

/** Maps CMS news rows to the table shape used by the Updates admin UI. */
export function mapNewsArticleToPostAdmin(article: NewsArticle): NewsPostAdmin {
  return {
    id: article.id,
    title: article.headline,
    thumbnailUrl: article.imageUrl,
    date: article.date,
    status: article.isDraft ? "Pending" : "Live",
  };
}

export function computeAdminNewsStats(items: NewsArticle[]) {
  const totalPosts = items.length;
  const livePosts = items.filter((a) => !a.isDraft).length;
  const draftPosts = items.filter((a) => a.isDraft).length;
  const viewSum = items.reduce((s, a) => s + (typeof a.views === "number" ? a.views : 0), 0);
  const totalViews = viewSum > 0 ? viewSum.toLocaleString() : "N/A";
  return {
    totalPosts,
    newPosts: draftPosts,
    livePosts,
    totalViews,
  };
}
