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
  onSavePassword?: (data: { current: string; new: string; confirm: string }) => void | Promise<void>;
  onSaveProfile?: (data: Partial<Profile>) => void | Promise<void>;
  onUploadAvatar?: (file: File) => void | Promise<void>;
  onDeleteAvatar?: () => void | Promise<void>;
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
      {/* Two equal columns, stretched to the same height on large screens */}
      <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-2 lg:items-stretch">
        {/* Left column */}
        <div className="flex min-h-0 h-full flex-col gap-6">
          <ProfileCard
            profile={profile}
            onEdit={() => {}}
            onShare={() => {}}
            onAddSocial={() => {}}
          />
          <Link
            href="/account/subscription"
            className="flex items-center gap-4 rounded-lg border border-white/10 bg-black/30 p-4 text-left transition-colors hover:border-white/25"
          >
            <CreditCard className="h-9 w-9 shrink-0 text-escobets-yellow/80" aria-hidden />
            <div className="min-w-0 flex-1">
              <p className="font-gotham font-medium text-white">Manage Subscription</p>
              <p className="mt-0.5 font-gotham text-sm text-white/60">
                View plan, payment method, and invoices
              </p>
            </div>
          </Link>
          <ChangePassword onSave={onSavePassword} className="min-h-0" />
        </div>

        {/* Right column */}
        <ProfileUpdateForm
          profile={profile}
          onSubmit={onSaveProfile}
          onUploadAvatar={onUploadAvatar}
          onDeleteAvatar={onDeleteAvatar}
          className="min-h-0 h-full"
        />
      </div>
    </div>
  );
}
