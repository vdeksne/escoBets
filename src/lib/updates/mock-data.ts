import type { NewsPostAdmin } from "@/types/news-post";

const IMAGES = ["/images/news/news.jpg", "/images/news/news2.jpg", "/images/news/news3.jpg", "/images/news/news4.jpg", "/images/news/news5.jpg", "/images/news/news6.jpg", "/images/news/news7.jpg", "/images/news/news8.jpg", "/images/news/news9.jpg"];

/** Mock news posts for admin Updates dashboard – REPLACE with backend API */
export const MOCK_NEWS_POSTS: NewsPostAdmin[] = Array.from({ length: 100 }, (_, i) => ({
  id: `post-${i + 1}`,
  title: "News and Predictions Post",
  thumbnailUrl: IMAGES[i % IMAGES.length],
  date: "01-01-2025",
  status: (["Live", "Live", "Live", "Completed", "Pending", "Live", "Canceled", "Live", "Pending", "Live"] as const)[i % 10],
}));

/** Mock stats – REPLACE with backend aggregates */
export const MOCK_UPDATES_STATS = {
  totalPosts: 100,
  newPosts: 10,
  livePosts: 80,
  totalViews: "200M",
};
