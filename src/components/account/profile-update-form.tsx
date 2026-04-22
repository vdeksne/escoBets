"use client";

import * as React from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DateOfBirthPicker } from "@/components/account/date-of-birth-picker";
import {
  PROFILE_PHONE_DIAL_OPTIONS,
  buildSavedPhone,
  parsePhoneFromProfile,
  type ProfilePhoneCountryId,
} from "@/lib/account/profile-phone";
import { EMPTY_PROFILE_ADDRESS, type Profile, type ProfileAddress } from "@/types/account";
import {
  isTelegramPlaceholderEmail,
  telegramAccountDisplayLines,
} from "@/lib/account/telegram-profile-email";
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

function ProfilePlaceholderAvatar() {
  return (
    <svg
      className="h-12 w-12"
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

const inputClassName =
  "flex h-10 w-full rounded-lg border border-white/40 bg-black/40 px-4 py-2 font-gotham text-white placeholder:text-white/50 focus:border-white focus:outline-none focus:ring-1 focus:ring-white/50";

interface ProfileUpdateFormProps {
  profile: Profile;
  onSubmit?: (data: Partial<Profile>) => void | Promise<void>;
  onUploadAvatar?: (file: File) => void | Promise<void>;
  onDeleteAvatar?: () => void | Promise<void>;
  className?: string;
}

export function ProfileUpdateForm({
  profile,
  onSubmit,
  onUploadAvatar,
  onDeleteAvatar,
  className,
}: ProfileUpdateFormProps) {
  const [isSaving, setIsSaving] = React.useState(false);
  const [saveError, setSaveError] = React.useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = React.useState<string | null>(null);
  const [isAvatarBusy, setIsAvatarBusy] = React.useState(false);
  const [avatarError, setAvatarError] = React.useState<string | null>(null);
  const avatarFileInputRef = React.useRef<HTMLInputElement>(null);

  /** Controlled fields so values update when `profile` loads from the API or after save (defaultValue would not). */
  const [firstName, setFirstName] = React.useState(profile.firstName);
  const [lastName, setLastName] = React.useState(profile.lastName);
  const [email, setEmail] = React.useState(profile.email);
  const [phoneCountryId, setPhoneCountryId] = React.useState<ProfilePhoneCountryId>(
    () => parsePhoneFromProfile(profile.phone).countryId
  );
  const [phone, setPhone] = React.useState(() => parsePhoneFromProfile(profile.phone).national);
  const [dateOfBirth, setDateOfBirth] = React.useState(profile.dateOfBirth);
  const [address, setAddress] = React.useState<ProfileAddress>(() => ({
    ...EMPTY_PROFILE_ADDRESS,
    ...profile.address,
  }));

  const telegramSignInEmail = isTelegramPlaceholderEmail(profile.email);
  const telegramSignInDisplay = telegramSignInEmail
    ? telegramAccountDisplayLines({
        email: profile.email,
        telegramUsername: profile.telegramUsername,
      })
    : null;

  React.useEffect(() => {
    setFirstName(profile.firstName);
    setLastName(profile.lastName);
    setEmail(profile.email);
    const parsed = parsePhoneFromProfile(profile.phone);
    setPhoneCountryId(parsed.countryId);
    setPhone(parsed.national);
    setDateOfBirth(profile.dateOfBirth);
    setAddress({ ...EMPTY_PROFILE_ADDRESS, ...profile.address });
  }, [profile.id, profile.firstName, profile.lastName, profile.email, profile.phone, profile.dateOfBirth, profile.address]);

  const setAddressField = React.useCallback((key: keyof ProfileAddress, value: string) => {
    setAddress((prev) => ({ ...prev, [key]: value }));
  }, []);

  const phoneCountry = React.useMemo(() => {
    return (
      PROFILE_PHONE_DIAL_OPTIONS.find((o) => o.id === phoneCountryId) ??
      PROFILE_PHONE_DIAL_OPTIONS.find((o) => o.id === "uk")!
    );
  }, [phoneCountryId]);

  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !onUploadAvatar) return;
    setAvatarError(null);
    try {
      setIsAvatarBusy(true);
      await onUploadAvatar(file);
    } catch (err) {
      setAvatarError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setIsAvatarBusy(false);
    }
  };

  const handleDeleteAvatar = async () => {
    if (!onDeleteAvatar) return;
    setAvatarError(null);
    try {
      setIsAvatarBusy(true);
      await onDeleteAvatar();
    } catch (err) {
      setAvatarError(err instanceof Error ? err.message : "Could not remove photo.");
    } finally {
      setIsAvatarBusy(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaveError(null);
    setSaveSuccess(null);
    const data: Partial<Profile> = {
      firstName,
      lastName,
      ...(telegramSignInEmail ? {} : { email }),
      phone: buildSavedPhone(phoneCountryId, phone),
      dateOfBirth,
      address: { ...address },
    };
    try {
      setIsSaving(true);
      await onSubmit?.(data);
      setSaveSuccess("Saved.");
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Failed to save.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className={cn(
        "flex min-h-0 flex-col rounded-xl border border-white/10 bg-black/40 p-5",
        className
      )}
    >
      <h2 className="font-gotham text-lg font-semibold text-white">
        Profile Update
      </h2>

      {/* Avatar + Upload/Delete */}
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full bg-white/10">
          {profile.avatarUrl ? (
            <Image src={profile.avatarUrl} alt="" fill sizes="80px" className="object-cover" />
          ) : (
            <span className="flex h-full w-full items-center justify-center">
              <ProfilePlaceholderAvatar />
            </span>
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <input
            ref={avatarFileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="sr-only"
            tabIndex={-1}
            aria-hidden
            onChange={handleAvatarFileChange}
          />
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              disabled={isAvatarBusy || !onUploadAvatar}
              onClick={() => avatarFileInputRef.current?.click()}
              className="rounded-lg bg-escobets-yellow px-4 py-2 font-gotham font-medium text-black hover:bg-escobets-yellow/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isAvatarBusy ? "Working…" : "Upload new photo"}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={isAvatarBusy || !profile.avatarUrl || !onDeleteAvatar}
              onClick={handleDeleteAvatar}
              className="rounded-lg border border-white/40 bg-transparent font-gotham text-white hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Remove photo
            </Button>
          </div>
          <p className="font-gotham text-xs text-white/45">JPEG, PNG, WebP, or GIF · up to 5 MB</p>
          {avatarError ? (
            <p className="font-gotham text-sm text-red-300" role="alert">
              {avatarError}
            </p>
          ) : null}
        </div>
      </div>

      {/* Form fields - 2 columns; flex layout evens height with left column on lg */}
      <form
        onSubmit={handleSubmit}
        className="profile-form mt-5 flex min-h-0 flex-1 flex-col"
      >
        <div className="grid min-h-0 flex-1 gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="firstName" className="mb-0.5 block font-gotham text-sm text-white/70">
              First Name
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className={inputClassName}
            />
          </div>
          <div>
            <label htmlFor="lastName" className="mb-0.5 block font-gotham text-sm text-white/70">
              Last Name
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className={inputClassName}
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="phone" className="mb-0.5 block font-gotham text-sm text-white/70">
              Phone Number
            </label>
            <div className="flex items-center gap-2">
              <div className="relative shrink-0">
                <select
                  aria-label="Phone country code"
                  value={phoneCountryId}
                  onChange={(e) => setPhoneCountryId(e.target.value as ProfilePhoneCountryId)}
                  className={cn(
                    "h-10 rounded-lg border border-white/40 bg-black/40 pl-2 pr-10",
                    "font-gotham text-sm text-white outline-none",
                    "focus:border-white focus:outline-none focus:ring-1 focus:ring-white/50",
                    "appearance-none"
                  )}
                >
                  {PROFILE_PHONE_DIAL_OPTIONS.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.flag} {o.dialCode}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60" />
              </div>

              <div className="relative min-w-0 flex-1">
                <span
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 select-none font-gotham text-sm text-white/70"
                  aria-hidden
                >
                  {phoneCountry.dialCode}
                </span>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  autoComplete="tel-national"
                  className={cn(
                    inputClassName,
                    phoneCountry.dialCode.length <= 2
                      ? "pl-11"
                      : phoneCountry.dialCode.length === 3
                        ? "pl-12"
                        : phoneCountry.dialCode.length === 4
                          ? "pl-14"
                          : "pl-[4.5rem]"
                  )}
                />
              </div>
            </div>
          </div>
          <div className="sm:col-span-2">
            {telegramSignInEmail ? (
              <>
                <p className="mb-0.5 font-gotham text-sm text-white/70">Sign-in</p>
                <div
                  className="rounded-lg border border-white/30 bg-black/30 px-4 py-3"
                  role="group"
                  aria-label="Telegram sign-in"
                >
                  <p className="font-gotham text-base font-medium text-white">
                    {telegramSignInDisplay?.primary}
                  </p>
                  {telegramSignInDisplay?.secondary ? (
                    <p className="mt-0.5 font-gotham text-sm text-white/60">
                      {telegramSignInDisplay.secondary}
                    </p>
                  ) : null}
                  {profile.userName ? (
                    <p className="mt-2 font-gotham text-xs text-white/65">
                      Password login: use username <span className="text-white">{profile.userName}</span>{" "}
                      on the login page (set a password in account settings if you have not yet).
                    </p>
                  ) : (
                    <p className="mt-2 font-gotham text-xs leading-snug text-white/50">
                      Log in with your EscoBets username and password after you set a password.
                      Telegram does not share a personal email with us.
                    </p>
                  )}
                </div>
              </>
            ) : (
              <>
                <label htmlFor="email" className="mb-0.5 block font-gotham text-sm text-white/70">
                  E-mail
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClassName}
                />
              </>
            )}
          </div>
          <div className="sm:col-span-2">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="addressStreet" className="mb-0.5 block font-gotham text-sm text-white/70">
                  Street address
                </label>
                <input
                  id="addressStreet"
                  name="addressStreet"
                  type="text"
                  autoComplete="street-address"
                  value={address.street}
                  onChange={(e) => setAddressField("street", e.target.value)}
                  className={inputClassName}
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="addressApartment" className="mb-0.5 block font-gotham text-sm text-white/70">
                  Apartment, suite, etc. <span className="text-white/40">(optional)</span>
                </label>
                <input
                  id="addressApartment"
                  name="addressApartment"
                  type="text"
                  autoComplete="address-line2"
                  value={address.apartment}
                  onChange={(e) => setAddressField("apartment", e.target.value)}
                  className={inputClassName}
                />
              </div>
              <div>
                <label htmlFor="addressCity" className="mb-0.5 block font-gotham text-sm text-white/70">
                  City
                </label>
                <input
                  id="addressCity"
                  name="addressCity"
                  type="text"
                  autoComplete="address-level2"
                  value={address.city}
                  onChange={(e) => setAddressField("city", e.target.value)}
                  className={inputClassName}
                />
              </div>
              <div>
                <label htmlFor="addressPostcode" className="mb-0.5 block font-gotham text-sm text-white/70">
                  Post code
                </label>
                <input
                  id="addressPostcode"
                  name="addressPostcode"
                  type="text"
                  autoComplete="postal-code"
                  inputMode="text"
                  spellCheck={false}
                  value={address.postcode}
                  onChange={(e) => setAddressField("postcode", e.target.value)}
                  className={inputClassName}
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="addressCountry" className="mb-0.5 block font-gotham text-sm text-white/70">
                  Country
                </label>
                <input
                  id="addressCountry"
                  name="addressCountry"
                  type="text"
                  autoComplete="country-name"
                  value={address.country}
                  onChange={(e) => setAddressField("country", e.target.value)}
                  className={inputClassName}
                />
              </div>
            </div>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="dateOfBirth" className="mb-0.5 block font-gotham text-sm text-white/70">
              Date of Birth
            </label>
            <DateOfBirthPicker
              id="dateOfBirth"
              value={dateOfBirth}
              onChange={setDateOfBirth}
              disabled={isSaving}
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="creditCard" className="mb-0.5 block font-gotham text-sm text-white/70">
              Credit Card <span className="text-white/40">(optional)</span>
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3">
                <MasterCardLogo />
              </div>
              <input
                id="creditCard"
                type="text"
                value={profile.creditCardLast4 ?? ""}
                className={cn(inputClassName, "pl-14 pr-10")}
                readOnly
              />
              <ChevronDown className="absolute right-3 h-4 w-4 text-white/60" />
            </div>
          </div>
        </div>

        <div className="mt-10 shrink-0 pt-8 lg:mt-auto lg:pt-10">
          <Button
            type="submit"
            disabled={isSaving}
            className="rounded-lg bg-escobets-yellow px-6 py-2 font-gotham font-medium text-black hover:bg-escobets-yellow/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
          {saveError ? (
            <p className="mt-3 font-gotham text-sm text-red-300" role="alert">
              {saveError}
            </p>
          ) : null}
          {saveSuccess ? (
            <p className="mt-3 font-gotham text-sm text-green-300" role="status">
              {saveSuccess}
            </p>
          ) : null}
        </div>
      </form>
    </div>
  );
}
