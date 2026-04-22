import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { TERMS_LAST_UPDATED_LABEL, TermsAndConditionsBody } from "@/components/legal/terms-content";

export const metadata: Metadata = {
  title: "Terms and Conditions — EscoBets",
  description: "Terms and Conditions for using EscoBets sports tipster and betting information services.",
};

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-black">
      <Header />
      <main className="flex-1 px-4 py-10 md:py-14">
        <article className="mx-auto max-w-3xl">
          <p className="font-gotham text-xs font-medium uppercase tracking-[0.2em] text-escobets-yellow/90">
            Legal
          </p>
          <h1 className="mt-2 font-gotham text-3xl font-bold text-white md:text-4xl">Terms and Conditions</h1>
          <p className="mt-2 font-gotham text-sm text-white/55">Last updated: {TERMS_LAST_UPDATED_LABEL}</p>
          <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8 md:p-10">
            <TermsAndConditionsBody />
          </div>
          <p className="mt-8 text-center font-gotham text-sm text-white/60">
            <Link prefetch={false} href="/" className="text-escobets-yellow hover:underline">
              Back to home
            </Link>
          </p>
        </article>
      </main>
      <Footer />
    </div>
  );
}
