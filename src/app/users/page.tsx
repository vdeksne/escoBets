import { UsersView } from "@/components/admin/users-view";
import { MOCK_ADMIN_USERS } from "@/lib/users/mock-data";

/** Admin users dashboard – backend: replace MOCK_ADMIN_USERS with API/Supabase */
export default function UsersPage() {
  return <UsersView users={MOCK_ADMIN_USERS} />;
}
