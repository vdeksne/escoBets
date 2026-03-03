"use client";

import * as React from "react";
import Image from "next/image";
import { Pencil, Eye, EyeOff, Calendar, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Profile } from "@/types/account";
import { cn } from "@/lib/utils";

/** MasterCard-style logo */
function MasterCardLogo() {
  return (
    <svg className="h-6 w-8 shrink-0" viewBox="0 0 48 32" fill="none" aria-hidden>
      <circle cx="18" cy="16" r="11" fill="#EB001B" />
      <circle cx="30" cy="16" r="11" fill="#F79E1B" />
    </svg>
  );
}

const inputClassName =
  "flex h-10 w-full rounded-lg border border-white/40 bg-black/40 px-4 py-2 font-gotham text-white placeholder:text-white/50 focus:border-white focus:outline-none focus:ring-1 focus:ring-white/50";

interface ProfileUpdateFormProps {
  profile: Profile;
  onSubmit?: (data: Partial<Profile>) => void;
  onUploadAvatar?: () => void;
  onDeleteAvatar?: () => void;
  className?: string;
}

export function ProfileUpdateForm({
  profile,
  onSubmit,
  onUploadAvatar,
  onDeleteAvatar,
  className,
}: ProfileUpdateFormProps) {
  const [showPassword, setShowPassword] = React.useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data: Partial<Profile> = {
      firstName: (form.elements.namedItem("firstName") as HTMLInputElement).value,
      lastName: (form.elements.namedItem("lastName") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      phone: (form.elements.namedItem("phone") as HTMLInputElement).value,
      dateOfBirth: (form.elements.namedItem("dateOfBirth") as HTMLInputElement).value,
      location: (form.elements.namedItem("location") as HTMLInputElement).value,
    };
    onSubmit?.(data);
  };

  return (
    <div
      className={cn(
        "rounded-xl border border-white/10 bg-black/40 p-6",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <h2 className="font-gotham text-lg font-semibold text-white">
          Profile Update
        </h2>
        <button
          type="button"
          className="rounded-lg p-2 text-white/70 hover:bg-white/10 hover:text-white"
          aria-label="Edit"
        >
          <Pencil className="h-5 w-5" />
        </button>
      </div>

      {/* Avatar + Upload/Delete */}
      <div className="mt-6 flex items-center gap-4">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full bg-white/10">
          {profile.avatarUrl ? (
            <Image src={profile.avatarUrl} alt="" fill sizes="80px" className="object-cover" />
          ) : (
            <span className="flex h-full w-full items-center justify-center font-gotham text-xl font-bold text-escobets-yellow">
              {profile.firstName[0]}
              {profile.lastName[0]}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            onClick={onUploadAvatar}
            className="rounded-lg bg-escobets-yellow px-4 py-2 font-gotham font-medium text-black hover:bg-escobets-yellow/90"
          >
            Upload New
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onDeleteAvatar}
            className="rounded-lg border border-white/40 bg-transparent font-gotham text-white hover:bg-white/10"
          >
            Delete
          </Button>
        </div>
      </div>

      {/* Form fields - 2 columns */}
      <form onSubmit={handleSubmit} className="mt-8">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="firstName" className="mb-1 block font-gotham text-sm text-white/70">
              First Name
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              defaultValue={profile.firstName}
              className={inputClassName}
            />
          </div>
          <div>
            <label htmlFor="lastName" className="mb-1 block font-gotham text-sm text-white/70">
              Last Name
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              defaultValue={profile.lastName}
              className={inputClassName}
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="password" className="mb-1 block font-gotham text-sm text-white/70">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                defaultValue="**********"
                className={inputClassName}
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
                aria-label={showPassword ? "Hide" : "Show"}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>
          <div>
            <label htmlFor="phone" className="mb-1 block font-gotham text-sm text-white/70">
              Phone Number
            </label>
            <div className="relative">
              <input
                id="phone"
                name="phone"
                type="tel"
                defaultValue={profile.phone}
                className={cn(inputClassName, "pr-10")}
              />
              <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1">
                <span className="text-lg" aria-hidden>🇺🇸</span>
                <ChevronDown className="h-4 w-4 text-white/60" />
              </div>
            </div>
          </div>
          <div>
            <label htmlFor="email" className="mb-1 block font-gotham text-sm text-white/70">
              E-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              defaultValue={profile.email}
              className={inputClassName}
            />
          </div>
          <div>
            <label htmlFor="dateOfBirth" className="mb-1 block font-gotham text-sm text-white/70">
              Date of Birth
            </label>
            <div className="relative">
              <input
                id="dateOfBirth"
                name="dateOfBirth"
                type="text"
                defaultValue={profile.dateOfBirth}
                className={cn(inputClassName, "pr-10")}
              />
              <Calendar className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-white/60" />
            </div>
          </div>
          <div>
            <label htmlFor="location" className="mb-1 block font-gotham text-sm text-white/70">
              Location
            </label>
            <input
              id="location"
              name="location"
              type="text"
              defaultValue={profile.location}
              className={inputClassName}
            />
          </div>
          <div>
            <label htmlFor="creditCard" className="mb-1 block font-gotham text-sm text-white/70">
              Credit Card
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3">
                <MasterCardLogo />
              </div>
              <input
                id="creditCard"
                type="text"
                defaultValue={profile.creditCardLast4}
                className={cn(inputClassName, "pl-14 pr-10")}
                readOnly
              />
              <ChevronDown className="absolute right-3 h-4 w-4 text-white/60" />
            </div>
          </div>
        </div>

        <Button
          type="submit"
          className="mt-6 rounded-lg bg-escobets-yellow px-6 py-2 font-gotham font-medium text-black hover:bg-escobets-yellow/90"
        >
          Save Changes
        </Button>
      </form>
    </div>
  );
}
