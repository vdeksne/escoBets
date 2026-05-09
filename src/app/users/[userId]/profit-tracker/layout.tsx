import { redirect } from "next/navigation";
import { isDemoMode } from "@/lib/demo-mode";
import { createClient } from "@/lib/supabase/server";
import { hasAdminRole } from "@/lib/auth/admin";

export default async function AdminUserProfitTrackerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (isDemoMode()) {
    return children;
  }
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login?next=/users");
  }
  if (!hasAdminRole(user)) {
    redirect("/account");
  }
  return children;
}
