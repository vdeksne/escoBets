import type { User } from "@supabase/supabase-js";

/** True if the user has admin in metadata (role or roles on user_metadata / app_metadata). */
export function hasAdminRole(user: User): boolean {
  const roleValues: string[] = [];

  const userRole = user.user_metadata?.role;
  const appRole = user.app_metadata?.role;
  const userRoles = user.user_metadata?.roles;
  const appRoles = user.app_metadata?.roles;

  if (typeof userRole === "string") roleValues.push(userRole);
  if (typeof appRole === "string") roleValues.push(appRole);
  if (Array.isArray(userRoles)) {
    roleValues.push(...userRoles.filter((value): value is string => typeof value === "string"));
  }
  if (Array.isArray(appRoles)) {
    roleValues.push(...appRoles.filter((value): value is string => typeof value === "string"));
  }

  return roleValues.some((role) => role.toLowerCase() === "admin");
}
