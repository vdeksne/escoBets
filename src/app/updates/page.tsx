import { redirect } from "next/navigation";
import { UpdatesView } from "@/components/admin/updates-view";
import { mapNewsArticleToPostAdmin, computeAdminNewsStats } from "@/lib/news/admin-list-mapper";
import { fetchAdminNewsListForEditor } from "@/lib/news/fetch-admin-news-list-for-editor";

/** Admin news & predictions: single list UI backed by the `news` CMS. */
export default async function UpdatesPage() {
  const result = await fetchAdminNewsListForEditor();
  if (!result.ok) {
    if (result.kind === "unauthorized") {
      redirect("/login");
    }
    if (result.kind === "forbidden") {
      return (
        <div className="flex min-h-screen items-center justify-center bg-black px-4">
          <p className="font-gotham text-sm text-red-400">Admin access required.</p>
        </div>
      );
    }
    return (
      <div className="flex min-h-screen items-center justify-center bg-black px-4">
        <p className="font-gotham text-sm text-red-400">
          {result.message ?? "Failed to load news."}
        </p>
      </div>
    );
  }

  const posts = result.items.map(mapNewsArticleToPostAdmin);
  const stats = computeAdminNewsStats(result.items);
  return <UpdatesView posts={posts} stats={stats} />;
}
