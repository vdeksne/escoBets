"use client";

import * as React from "react";
import Image from "next/image";
import { Copy, Plus } from "lucide-react";
import type { Profile } from "@/types/account";
import { telegramAccountDisplayLines } from "@/lib/account/telegram-profile-email";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SocialAccountsManager } from "@/components/account/social-accounts-manager";
import { SOCIAL_ICONS } from "@/components/account/social-provider-icons";

function ProfilePlaceholderAvatar() {
  return (
    <svg
      className="h-14 w-14"
      viewBox="0 0 110 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M39.0195 49.031C39.0195 57.8435 46.1875 65.011 54.9995 65.011C63.8115 65.011 70.9795 57.843 70.9795 49.031C70.9795 40.219 63.8115 33.051 54.9995 33.051C46.1875 33.051 39.0195 40.219 39.0195 49.031ZM64.7305 49.031C64.7305 54.3982 60.3672 58.7615 55 58.7615C49.6328 58.7615 45.2695 54.3982 45.2695 49.031C45.2695 43.6638 49.6328 39.3005 55 39.3005C60.3672 39.3005 64.7305 43.6638 64.7305 49.031Z"
        fill="#FBFE27"
      />
      <path
        d="M98.7499 33.008C100.477 33.008 101.875 31.6096 101.875 29.883C101.875 28.1564 100.477 26.758 98.7499 26.758H85.0349C83.3083 26.758 81.9099 28.1564 81.9099 29.883V43.598C81.9099 45.3246 83.3083 46.723 85.0349 46.723C86.7615 46.723 88.1599 45.3246 88.1599 43.598V36.5746C92.9841 43.3988 95.6247 51.5516 95.6247 59.9966C95.6247 69.395 92.4099 78.0516 87.0309 84.9416C85.6989 76.3947 78.3121 69.8246 69.4059 69.8246H40.5939C31.6877 69.8246 24.3009 76.3949 22.9689 84.9416C17.59 78.051 14.3751 69.3946 14.3751 59.9966C14.3751 37.5946 32.6021 19.3716 55.0001 19.3716C62.4728 19.3716 69.7771 21.4185 76.1251 25.2857C77.5978 26.1841 79.5235 25.7154 80.422 24.2427C81.3204 22.77 80.8517 20.8443 79.379 19.9458C72.0548 15.481 63.625 13.1177 55.004 13.1177C29.152 13.1255 8.125 34.1527 8.125 60.0007C8.125 85.8487 29.152 106.876 55 106.876C80.848 106.876 101.875 85.8487 101.875 60.0007C101.875 50.2741 98.8594 40.8757 93.3125 33.0087L98.7499 33.008ZM28.9839 91.172V87.7032C28.9839 81.293 34.1909 76.0782 40.5929 76.0782H69.4049C75.8072 76.0782 81.0139 81.293 81.0139 87.7032V91.172C73.9592 97.0665 64.8889 100.625 54.9979 100.625C45.1069 100.625 36.0369 97.0704 28.9819 91.172H28.9839Z"
        fill="#FBFE27"
      />
    </svg>
  );
}

interface ProfileCardProps {
  profile: Profile;
  onSocialUpdate?: () => void;
  className?: string;
}

export function ProfileCard({ profile, onSocialUpdate, className }: ProfileCardProps) {
  const [copied, setCopied] = React.useState(false);
  const [socialOpen, setSocialOpen] = React.useState(false);

  const { primary: emailPrimary, secondary: emailSecondary } = telegramAccountDisplayLines({
    email: profile.email,
    telegramUsername: profile.telegramUsername,
  });

  const copyEmail = () => {
    navigator.clipboard.writeText(profile.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn(
        "rounded-xl border border-white/10 bg-black/40 p-6",
        className
      )}
    >
      <h2 className="font-gotham text-lg font-semibold text-white">Profile</h2>

      <div className="mt-6 flex flex-col items-center">
        <div className="relative h-24 w-24 overflow-hidden rounded-full bg-white/10">
          {profile.avatarUrl ? (
            <Image
              src={profile.avatarUrl}
              alt=""
              fill
              sizes="96px"
              className="object-cover"
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center">
              <ProfilePlaceholderAvatar />
            </span>
          )}
        </div>
        <p className="mt-4 font-gotham text-lg font-bold text-white">
          {profile.firstName} {profile.lastName}
        </p>
        <div className="mt-2 flex flex-col items-center gap-1">
          <div className="flex items-center gap-2 text-center">
            <span className="font-gotham text-sm font-medium text-white">{emailPrimary}</span>
            <button
              type="button"
              onClick={copyEmail}
              className="shrink-0 text-white/60 hover:text-escobets-yellow"
              aria-label={
                emailSecondary
                  ? "Copy internal sign-in email (for support)"
                  : "Copy email"
              }
              title={profile.email}
            >
              <Copy className="h-4 w-4" />
            </button>
            {copied ? (
              <span className="font-gotham text-xs text-escobets-yellow">Copied</span>
            ) : null}
          </div>
          {emailSecondary ? (
            <span className="font-gotham text-xs text-white/55">{emailSecondary}</span>
          ) : null}
        </div>
      </div>

      <div className="mt-6">
        <p className="font-gotham text-xs uppercase tracking-wider text-white/50">
          Linked with Social media
        </p>
        <div className="mt-3 flex min-h-[1.5rem] flex-wrap items-center gap-4">
          {profile.socialLinks
            .filter((l) => l.linked)
            .map((link) => (
              <span
                key={link.id}
                className="text-white/80"
                title={SOCIAL_ICONS[link.provider].label}
              >
                {SOCIAL_ICONS[link.provider].icon}
              </span>
            ))}
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => setSocialOpen(true)}
          className="mt-4 w-full rounded-lg border-white/30 bg-transparent py-2 font-gotham text-white hover:bg-white/10"
        >
          <Plus className="mr-2 h-4 w-4 rounded-full border border-current" />
          Social media
        </Button>
      </div>
      <SocialAccountsManager
        open={socialOpen}
        onClose={() => setSocialOpen(false)}
        accountEmail={profile.email}
        socialLinksFromProfile={profile.socialLinks}
        onUpdated={() => onSocialUpdate?.()}
      />
    </div>
  );
}
