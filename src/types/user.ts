/**
 * Admin user type – for user management dashboard.
 * Backend: replace with Supabase/Auth user schema.
 */

export type UserStatus = "Pending" | "Failed" | "Complete" | "Archived";

export interface AdminUser {
  id: string;
  userName: string;
  telegram: string;
  phone: string;
  email: string;
  status: UserStatus;
  lastUpdate: string;
  profits: number;
  losses: number;
}
