import { createClient } from "@/lib/supabase/server";
import { hasAdminRole } from "@/lib/auth/admin";

/** Signed-in user may moderate comments (delete any / all). */
export async function isNewsEngagementAdmin(): Promise<boolean> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return Boolean(user && hasAdminRole(user));
}
