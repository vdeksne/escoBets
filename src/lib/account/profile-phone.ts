/** Dial prefixes for profile phone UI (longest first for parsing). */
export const PROFILE_PHONE_DIAL_OPTIONS = [
  { id: "intl" as const, label: "International", flag: "🌍", dialCode: "+" },
  { id: "us" as const, label: "United States", flag: "🇺🇸", dialCode: "+1" },
  { id: "ca" as const, label: "Canada", flag: "🇨🇦", dialCode: "+1" },
  { id: "au" as const, label: "Australia", flag: "🇦🇺", dialCode: "+61" },
  { id: "uk" as const, label: "United Kingdom", flag: "🇬🇧", dialCode: "+44" },
  { id: "ie" as const, label: "Ireland", flag: "🇮🇪", dialCode: "+353" },
  { id: "de" as const, label: "Germany", flag: "🇩🇪", dialCode: "+49" },
  { id: "fr" as const, label: "France", flag: "🇫🇷", dialCode: "+33" },
  { id: "es" as const, label: "Spain", flag: "🇪🇸", dialCode: "+34" },
  { id: "it" as const, label: "Italy", flag: "🇮🇹", dialCode: "+39" },
  { id: "nl" as const, label: "Netherlands", flag: "🇳🇱", dialCode: "+31" },
  { id: "be" as const, label: "Belgium", flag: "🇧🇪", dialCode: "+32" },
  { id: "se" as const, label: "Sweden", flag: "🇸🇪", dialCode: "+46" },
  { id: "no" as const, label: "Norway", flag: "🇳🇴", dialCode: "+47" },
  { id: "dk" as const, label: "Denmark", flag: "🇩🇰", dialCode: "+45" },
  { id: "fi" as const, label: "Finland", flag: "🇫🇮", dialCode: "+358" },
  { id: "pl" as const, label: "Poland", flag: "🇵🇱", dialCode: "+48" },
  { id: "pt" as const, label: "Portugal", flag: "🇵🇹", dialCode: "+351" },
  { id: "gr" as const, label: "Greece", flag: "🇬🇷", dialCode: "+30" },
  { id: "cz" as const, label: "Czechia", flag: "🇨🇿", dialCode: "+420" },
  { id: "at" as const, label: "Austria", flag: "🇦🇹", dialCode: "+43" },
  { id: "ch" as const, label: "Switzerland", flag: "🇨🇭", dialCode: "+41" },
  { id: "ro" as const, label: "Romania", flag: "🇷🇴", dialCode: "+40" },
  { id: "hu" as const, label: "Hungary", flag: "🇭🇺", dialCode: "+36" },
  { id: "lt" as const, label: "Lithuania", flag: "🇱🇹", dialCode: "+370" },
  { id: "lv" as const, label: "Latvia", flag: "🇱🇻", dialCode: "+371" },
  { id: "ee" as const, label: "Estonia", flag: "🇪🇪", dialCode: "+372" },
] as const;

export type ProfilePhoneCountryId = (typeof PROFILE_PHONE_DIAL_OPTIONS)[number]["id"];

function dialOptionsByLengthDesc() {
  return PROFILE_PHONE_DIAL_OPTIONS.filter((o) => o.dialCode !== "+").slice().sort((a, b) => b.dialCode.length - a.dialCode.length);
}

/** Split stored phone (e.g. +447700900000) into country selector + national input. */
export function parsePhoneFromProfile(full: string): { countryId: ProfilePhoneCountryId; national: string } {
  const trimmed = full.trim();
  if (!trimmed) return { countryId: "uk", national: "" };

  const compact = trimmed.replace(/\s/g, "");
  if (compact.startsWith("+")) {
    for (const o of dialOptionsByLengthDesc()) {
      if (compact.startsWith(o.dialCode)) {
        return { countryId: o.id, national: compact.slice(o.dialCode.length) };
      }
    }
    return { countryId: "intl", national: compact.slice(1) };
  }

  const digits = trimmed.replace(/\D/g, "");
  if (digits.length === 10) return { countryId: "us", national: trimmed };
  return { countryId: "uk", national: trimmed };
}

/** Combine country dial code + national digits for `profiles.phone`. */
export function buildSavedPhone(countryId: ProfilePhoneCountryId, national: string): string {
  const opt =
    PROFILE_PHONE_DIAL_OPTIONS.find((o) => o.id === countryId) ??
    PROFILE_PHONE_DIAL_OPTIONS.find((o) => o.id === "uk")!;
  const dial = opt.dialCode;
  const n = national.trim();
  if (!n) return "";

  const compact = n.replace(/\s/g, "");
  if (dial === "+") {
    return compact.startsWith("+") ? compact : `+${compact.replace(/^\+/, "")}`;
  }
  if (compact.startsWith(dial)) return compact;
  if (compact.startsWith("+")) return compact;

  let digits = n.replace(/\D/g, "");
  if (dial === "+44" && digits.startsWith("0")) digits = digits.replace(/^0+/, "") || digits;
  return `${dial}${digits}`;
}
