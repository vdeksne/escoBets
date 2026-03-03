"use client";

import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { AccountView } from "@/components/account/account-view";
import { MOCK_PROFILE } from "@/lib/account/mock-data";

/**
 * Account page – profile, password, subscription.
 * Data: Replace MOCK_PROFILE with API/auth (e.g. Supabase user).
 */
export default function AccountPage() {
  return (
    <div className="flex min-h-screen flex-col bg-black">
      <Header variant="withLogo" />

      <main className="flex-1 px-4 py-8">
        <div className="mx-auto max-w-5xl">
          <AccountView
            profile={MOCK_PROFILE}
            onSavePassword={(data) => console.log("Save password:", data)}
            onSaveProfile={(data) => console.log("Save profile:", data)}
            onUploadAvatar={() => console.log("Upload avatar")}
            onDeleteAvatar={() => console.log("Delete avatar")}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
