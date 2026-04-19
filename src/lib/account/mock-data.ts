import type { Profile } from "@/types/account";

/**
 * Mock profile – REMOVE when backend/auth is ready.
 * Replace with: useUser() or useSWR('/api/account/profile', fetcher)
 */
export const MOCK_PROFILE: Profile = {
  id: "1",
  firstName: "Alex",
  lastName: "Taylor",
  email: "alex.taylor@example.com",
  phone: "(555) 010-1234",
  dateOfBirth: "01-January-2000",
  address: {
    country: "United Kingdom",
    city: "London",
    street: "221B Baker Street",
    apartment: "Flat 2",
    postcode: "NW1 6XE",
  },
  creditCardLast4: "**** **** **** 4242",
  creditCardBrand: "mastercard",
  socialLinks: [
    { id: "1", provider: "google", linked: true },
    { id: "2", provider: "x", linked: true },
    { id: "3", provider: "telegram", linked: false },
    { id: "4", provider: "linkedin", linked: true },
  ],
};
