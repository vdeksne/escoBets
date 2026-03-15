import { UpdatesView } from "@/components/admin/updates-view";
import {
  MOCK_NEWS_POSTS,
  MOCK_UPDATES_STATS,
} from "@/lib/updates/mock-data";

/** Admin updates (News and Predictions) – backend: replace mock data with API/CMS */
export default function UpdatesPage() {
  return (
    <UpdatesView posts={MOCK_NEWS_POSTS} stats={MOCK_UPDATES_STATS} />
  );
}
