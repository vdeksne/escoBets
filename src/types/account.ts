/**
 * Account profile types – for user account management.
 * Backend: replace mock data with API/auth (e.g. Supabase user).
 */

export interface SocialLink {
  id: string;
  provider: "google" | "facebook" | "linkedin";
  linked: boolean;
}

export interface Profile {
  id: string;
  avatarUrl?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  location: string;
  creditCardLast4?: string;
  creditCardBrand?: string;
  socialLinks: SocialLink[];
}
