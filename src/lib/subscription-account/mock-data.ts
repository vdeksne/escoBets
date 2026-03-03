import type { SubscriptionAccountData } from "@/types/subscription-account";

/**
 * Mock data – REMOVE or replace with API when backend is ready:
 *   const { data } = useSWR('/api/account/subscription', fetcher)
 *   or: const data = await fetch('/api/account/subscription').then(r => r.json())
 */
export const MOCK_SUBSCRIPTION_ACCOUNT_DATA: SubscriptionAccountData = {
  planSummary: {
    planName: "Growth Plan",
    billingCycle: "monthly",
    planCost: "$20",
  },
  paymentMethod: {
    brand: "Master Card",
    last4: "4002",
    expiryMonth: "20",
    expiryYear: "2024",
    billingEmail: "billing@acme.corp",
  },
  invoices: [
    { id: "23456", billingDate: "23 Jan 2026", plan: "Basic Plan", amount: "$20", status: "paid" },
    { id: "56489", billingDate: "23 Feb 2026", plan: "Pro Plan", amount: "$20", status: "paid" },
    { id: "98380", billingDate: "23 Mar 2026", plan: "Growth Plan", amount: "$20", status: "paid" },
    { id: "90394", billingDate: "23 Apr 2026", plan: "Growth Plan", amount: "$20", status: "paid" },
    { id: "929348", billingDate: "23 May 2026", plan: "Growth Plan", amount: "$20", status: "paid" },
    { id: "48394", billingDate: "23 Jun 2026", plan: "Growth Plan", amount: "$20", status: "paid" },
    { id: "83942", billingDate: "23 Jul 2026", plan: "Growth Plan", amount: "$20", status: "pending" },
  ],
};
