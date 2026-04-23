"use client";

import * as React from "react";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { AccountView } from "@/components/account/account-view";
import { deleteProfileAvatar, uploadProfileAvatar } from "@/lib/account/avatar-upload";
import { createClient } from "@/lib/supabase/client";
import { MOCK_PROFILE } from "@/lib/account/mock-data";
import type { ApiResponse } from "@/types/api";
import type { Profile } from "@/types/account";

/**
 * Account page – profile, password, subscription.
 * Data: Replace MOCK_PROFILE with API/auth (e.g. Supabase user).
 */
export default function AccountPage() {
  const [profile, setProfile] = React.useState<Profile>(MOCK_PROFILE);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/account/profile", { cache: "no-store" });
        const json = (await res.json()) as ApiResponse<Profile>;
        if (!cancelled && res.ok && json.success) {
          setProfile(json.data);
        }
      } catch {
        // Keep mock profile as fallback in dev.
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSaveProfile = async (data: Partial<Profile>) => {
    const res = await fetch("/api/account/profile", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = (await res.json()) as ApiResponse<Profile>;
    if (res.ok && json.success) {
      setProfile(json.data);
      return;
    }
    throw new Error(json.success === false ? json.error.message : "Failed to save profile.");
  };

  const handleUploadAvatar = async (file: File) => {
    const url = await uploadProfileAvatar(file);
    setProfile((p) => ({ ...p, avatarUrl: url }));
  };

  const handleDeleteAvatar = async () => {
    await deleteProfileAvatar();
    setProfile((p) => {
      const next = { ...p };
      delete next.avatarUrl;
      return next;
    });
  };

  const handleRefreshProfile = async () => {
    try {
      const res = await fetch("/api/account/profile", { cache: "no-store" });
      const json = (await res.json()) as ApiResponse<Profile>;
      if (res.ok && json.success) {
        setProfile(json.data);
      }
    } catch {
      // ignore
    }
  };

  const handleDeleteAccount = async () => {
    const res = await fetch("/api/account", { method: "DELETE" });
    const json = (await res.json()) as ApiResponse<{ ok: true }>;
    if (!res.ok || !json.success) {
      throw new Error(
        json.success === false ? json.error.message : "Failed to delete account."
      );
    }
    const supabase = createClient();
    try {
      await supabase.auth.signOut();
    } catch {
      // User record is already gone; session may be invalid — still leave the app.
    }
    window.location.assign("/");
  };

  const handleSavePassword = async (data: { current: string; new: string; confirm: string }) => {
    const res = await fetch("/api/account/password", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        currentPassword: data.current,
        newPassword: data.new.trim(),
      }),
    });
    const json = (await res.json()) as ApiResponse<{ ok: true }>;
    if (!res.ok || !json.success) {
      throw new Error(json.success === false ? json.error.message : "Failed to update password.");
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <Header />

      <main className="flex-1 px-4 py-8">
        <div className="mx-auto max-w-5xl">
          <AccountView
            profile={profile}
            onSavePassword={handleSavePassword}
            onSaveProfile={handleSaveProfile}
            onUploadAvatar={handleUploadAvatar}
            onDeleteAvatar={handleDeleteAvatar}
            onDeleteAccount={handleDeleteAccount}
            onRefreshProfile={handleRefreshProfile}
          />
          {loading ? (
            <p className="mt-4 font-gotham text-sm text-white/50">Loading profile…</p>
          ) : null}
        </div>
      </main>

      <Footer />
    </div>
  );
}
