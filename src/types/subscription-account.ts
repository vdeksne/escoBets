/**
 * Subscription account types – for users who have subscribed.
 * Backend: replace mock data with API calls to fetch plan, payment, invoices.
 */

export type BillingCycle = "monthly" | "annual";

export interface PlanSummary {
  planName: string;
  billingCycle: BillingCycle;
  planCost: string; // e.g. "$20"
  nextBillingDate?: string;
  status?: string;
}

export interface PaymentMethod {
  brand: string; // "Master Card", "Visa", etc.
  last4: string;
  expiryMonth: string;
  expiryYear: string;
  billingEmail: string;
}

export type InvoiceStatus = "paid" | "pending";

export interface Invoice {
  id: string;
  billingDate: string; // e.g. "23 Jan 2026"
  plan: string;
  amount: string;
  status: InvoiceStatus;
  downloadUrl?: string;
}

/** Full subscription account data – shape of API response */
export interface SubscriptionAccountData {
  planSummary: PlanSummary;
  paymentMethod: PaymentMethod;
  invoices: Invoice[];
}
