"use client";

import * as React from "react";
import Image from "next/image";
import { Copy, Plus, Send } from "lucide-react";
import type { Profile } from "@/types/account";
import { telegramAccountDisplayLines } from "@/lib/account/telegram-profile-email";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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

const SOCIAL_ICONS: Record<string, { label: string; icon: React.ReactNode }> = {
  google: {
    label: "Google",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
      </svg>
    ),
  },
  x: {
    label: "X",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  telegram: {
    label: "Telegram",
    icon: <Send className="h-5 w-5 text-sky-400" aria-hidden />,
  },
  linkedin: {
    label: "LinkedIn",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="#0A66C2" aria-hidden>
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
};

interface ProfileCardProps {
  profile: Profile;
  onAddSocial?: () => void;
  className?: string;
}

export function ProfileCard({
  profile,
  onAddSocial,
  className,
}: ProfileCardProps) {
  const [copied, setCopied] = React.useState(false);

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
        <div className="mt-3 flex items-center gap-4">
          {profile.socialLinks
            .filter((l) => l.linked)
            .map((link) => (
              <span key={link.id} className="text-white/80" title={SOCIAL_ICONS[link.provider]?.label}>
                {SOCIAL_ICONS[link.provider]?.icon}
              </span>
            ))}
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={onAddSocial}
          className="mt-4 w-full rounded-lg border-white/30 bg-transparent py-2 font-gotham text-white hover:bg-white/10"
        >
          <Plus className="mr-2 h-4 w-4 rounded-full border border-current" />
          Social media
        </Button>
      </div>
    </div>
  );
}
