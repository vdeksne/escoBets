import { NewsPageClient } from "./news-page-client";
import { getNewsListPayload } from "@/lib/news/get-public-news-list";

/**
 * News and predictions — hero, search, and grid (editorial or scannable layout).
 * First page is loaded on the server; filter/pagination updates fetch from the API on the client.
 */
export default async function NewsPage() {
  const initialData = await getNewsListPayload({
    page: 1,
    pageSize: 11,
    search: "",
    tag: "",
    category: "",
  });
  return <NewsPageClient initialData={initialData} />;
}
