import type { Profile } from "@/types/account";

/**
 * Mock profile – REMOVE when backend/auth is ready.
 * Replace with: useUser() or useSWR('/api/account/profile', fetcher)
 */
export const MOCK_PROFILE: Profile = {
  id: "1",
  avatarUrl: "/images/Profile.jpg",
  firstName: "Pablo",
  lastName: "Escobar",
  email: "Pablo@Escobar.com",
  phone: "(406) 555-0120",
  dateOfBirth: "12-January-1999",
  location: "Ezermalas 4-20, Riga, Latvia, LV-1010",
  creditCardLast4: "843-4359-4444",
  creditCardBrand: "mastercard",
  socialLinks: [
    { id: "1", provider: "google", linked: true },
    { id: "2", provider: "facebook", linked: true },
    { id: "3", provider: "linkedin", linked: true },
  ],
};
