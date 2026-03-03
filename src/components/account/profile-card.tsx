"use client";

import * as React from "react";
import Image from "next/image";
import { Pencil, Share2, Copy, Plus } from "lucide-react";
import type { Profile } from "@/types/account";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
  facebook: {
    label: "Facebook",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="#1877F2" aria-hidden>
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.18.097 2.533.141v2.94h-1.73c-1.366 0-1.72.649-1.72 1.612v2.151h3.473l-.443 3.47h-3.03v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
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
  onEdit?: () => void;
  onShare?: () => void;
  onAddSocial?: () => void;
  className?: string;
}

export function ProfileCard({
  profile,
  onEdit,
  onShare,
  onAddSocial,
  className,
}: ProfileCardProps) {
  const [copied, setCopied] = React.useState(false);

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
      <div className="flex items-center justify-between">
        <h2 className="font-gotham text-lg font-semibold text-white">Profile</h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onEdit}
            className="rounded-lg p-2 text-white/70 hover:bg-white/10 hover:text-white"
            aria-label="Edit profile"
          >
            <Pencil className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={onShare}
            className="rounded-lg p-2 text-white/70 hover:bg-white/10 hover:text-white"
            aria-label="Share"
          >
            <Share2 className="h-5 w-5" />
          </button>
        </div>
      </div>

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
            <span className="flex h-full w-full items-center justify-center font-gotham text-2xl font-bold text-escobets-yellow">
              {profile.firstName[0]}
              {profile.lastName[0]}
            </span>
          )}
        </div>
        <p className="mt-4 font-gotham text-lg font-bold text-white">
          {profile.firstName} {profile.lastName}
        </p>
        <div className="mt-2 flex items-center gap-2">
          <span className="font-gotham text-sm text-white/80">{profile.email}</span>
          <button
            type="button"
            onClick={copyEmail}
            className="text-white/60 hover:text-escobets-yellow"
            aria-label="Copy email"
          >
            <Copy className="h-4 w-4" />
          </button>
          {copied && (
            <span className="font-gotham text-xs text-escobets-yellow">Copied</span>
          )}
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
