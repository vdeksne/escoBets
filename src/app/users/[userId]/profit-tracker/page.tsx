"use client";

import * as React from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { ProfitTrackerDashboard } from "@/components/profit-tracker/profit-tracker-dashboard";

/** Admin view: same profit tracker as members, scoped per admin user id in localStorage. */
export default function AdminUserProfitTrackerPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const rawId = params.userId;
  const userId = Array.isArray(rawId) ? rawId[0] : rawId;
  const nameFromQuery = searchParams.get("name")?.trim();

  if (!userId) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-black px-4">
        <p className="font-gotham text-sm text-red-400">Invalid user.</p>
      </div>
    );
  }

  const userLabel = nameFromQuery?.length ? nameFromQuery : userId;

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <Header />

      <main className="flex-1 px-4 py-8 md:px-6">
        <ProfitTrackerDashboard
          storageScope={userId}
          adminBanner={{ backHref: "/users", userLabel }}
        />
      </main>

      <Footer />
    </div>
  );
}
