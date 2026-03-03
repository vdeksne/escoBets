"use client";

import Link from "next/link";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { User, CreditCard } from "lucide-react";

/** Placeholder – backend: user profile, settings */
export default function AccountPage() {
  return (
    <div className="flex min-h-screen flex-col bg-black">
      <Header variant="withLogo" />
      <main className="flex-1 px-4 py-8">
        <div className="mx-auto max-w-md">
          <h1 className="font-gotham text-2xl font-bold text-white">Account</h1>
          <p className="mt-2 font-gotham text-sm text-white/60">
            Backend: User profile, subscription, settings.
          </p>
          <Link
            href="/account/subscription"
            className="mt-6 flex items-center gap-4 rounded-xl border border-white/10 bg-black/40 p-4 transition-colors hover:border-white/20"
          >
            <CreditCard className="h-10 w-10 text-escobets-yellow/80" />
            <div className="flex-1 text-left">
              <h2 className="font-gotham font-medium text-white">
                Manage Subscription
              </h2>
              <p className="font-gotham text-sm text-white/60">
                View plan, payment method, and invoices
              </p>
            </div>
          </Link>
          <div className="mt-6 rounded-xl border border-white/10 bg-black/40 p-6">
            <User className="mx-auto h-12 w-12 text-white/40" />
            <p className="mt-4 text-center font-gotham text-sm text-white/60">
              Sign in to manage your account
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
