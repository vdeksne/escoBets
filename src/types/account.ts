/**
 * Account profile types – for user account management.
 * Backend: replace mock data with API/auth (e.g. Supabase user).
 */

export interface SocialLink {
  id: string;
  provider: "google" | "x" | "telegram" | "linkedin";
  linked: boolean;
}

/** Postal-style address stored as `address_*` columns on `profiles`. */
export interface ProfileAddress {
  country: string;
  city: string;
  street: string;
  apartment: string;
  postcode: string;
}

export const EMPTY_PROFILE_ADDRESS: ProfileAddress = {
  country: "",
  city: "",
  street: "",
  apartment: "",
  postcode: "",
};

export interface Profile {
  id: string;
  avatarUrl?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: ProfileAddress;
  creditCardLast4?: string;
  creditCardBrand?: string;
  socialLinks: SocialLink[];
}
