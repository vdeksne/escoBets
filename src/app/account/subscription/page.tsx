"use client";

import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { SubscriptionAccountView } from "@/components/subscription-account/subscription-account-view";
import { MOCK_SUBSCRIPTION_ACCOUNT_DATA } from "@/lib/subscription-account/mock-data";

/**
 * Subscription management for subscribed users.
 * Data: Replace MOCK_SUBSCRIPTION_ACCOUNT_DATA with API:
 *   const { data } = useSWR('/api/account/subscription', fetcher)
 */
export default function AccountSubscriptionPage() {
  const data = MOCK_SUBSCRIPTION_ACCOUNT_DATA;

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <Header variant="withLogo" />

      <main className="flex-1 px-4 py-8">
        <div className="mx-auto max-w-4xl">
          <SubscriptionAccountView
            data={data}
            onUpgrade={() => {}}
            onChangePayment={() => {}}
            onDownloadInvoice={() => {}}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
