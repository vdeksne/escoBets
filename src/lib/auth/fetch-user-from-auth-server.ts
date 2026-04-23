import type { User } from "@supabase/supabase-js";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

/**
 * Returns the user as stored in Supabase Auth (authoritative `user_metadata`),
 * not necessarily the claims embedded in the current session JWT.
 * Use after admin `updateUserById` or when cookie/session may be stale.
 */
export async function fetchUserFromAuthServer(userId: string): Promise<User | null> {
  const service = createServiceRoleClient();
  if (!service) return null;
  const { data, error } = await service.auth.admin.getUserById(userId);
  if (error || !data.user) return null;
  return data.user;
}
