"use client";

import Link from "next/link";
import { CreditCard } from "lucide-react";
import { ProfileCard } from "./profile-card";
import { ChangePassword } from "./change-password";
import { ProfileUpdateForm } from "./profile-update-form";
import type { Profile } from "@/types/account";
import { cn } from "@/lib/utils";

interface AccountViewProps {
  profile: Profile;
  onSavePassword?: (data: { current: string; new: string; confirm: string }) => void;
  onSaveProfile?: (data: Partial<Profile>) => void;
  onUploadAvatar?: () => void;
  onDeleteAvatar?: () => void;
  className?: string;
}

export function AccountView({
  profile,
  onSavePassword,
  onSaveProfile,
  onUploadAvatar,
  onDeleteAvatar,
  className,
}: AccountViewProps) {
  return (
    <div className={cn("space-y-8", className)}>
      {/* Manage Subscription link - prominent */}
      <Link
        href="/account/subscription"
        className="flex items-center gap-4 rounded-xl border border-white/10 bg-black/40 p-4 transition-colors hover:border-white/20"
      >
        <CreditCard className="h-10 w-10 shrink-0 text-escobets-yellow/80" />
        <div className="flex-1 text-left">
          <h2 className="font-gotham font-medium text-white">Manage Subscription</h2>
          <p className="font-gotham text-sm text-white/60">
            View plan, payment method, and invoices
          </p>
        </div>
      </Link>

      {/* Two-column layout: left + right */}
      <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
        {/* Left column */}
        <div className="space-y-6">
          <ProfileCard
            profile={profile}
            onEdit={() => {}}
            onShare={() => {}}
            onAddSocial={() => {}}
          />
          <ChangePassword onSave={onSavePassword} />
        </div>

        {/* Right column */}
        <ProfileUpdateForm
          profile={profile}
          onSubmit={onSaveProfile}
          onUploadAvatar={onUploadAvatar}
          onDeleteAvatar={onDeleteAvatar}
        />
      </div>
    </div>
  );
}
