"use client";

import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { ProfitTrackerDashboard } from "@/components/profit-tracker/profit-tracker-dashboard";

/**
 * Profit Tracker overview: summary + weekly chart are derived from stored entries
 * (same source as CSV import/export and the entries list).
 */
export default function ProfitTrackerPage() {
  return (
    <div className="flex min-h-screen flex-col bg-black">
      <Header />

      <main className="flex-1 px-4 py-8 md:px-6">
        <ProfitTrackerDashboard />
      </main>

      <Footer />
    </div>
  );
}
