import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import {
  isTelegramPlaceholderEmail,
  readAvatarUrlFromUserMetadata,
  readTelegramUsernameFromUserMetadata,
} from "@/lib/account/telegram-profile-email";
import type { ApiError, ApiSuccess } from "@/types/api";
import type { Profile, ProfileAddress, SocialLink } from "@/types/account";

type ProfilePayload = Partial<
  Pick<Profile, "firstName" | "lastName" | "phone" | "dateOfBirth" | "avatarUrl" | "email" | "address">
> & {
  /** Optional login/display handle when the DB has a NOT NULL `user_name` column */
  userName?: string;
  username?: string;
  /** Legacy single-line address; applied to street when structured `address` is absent */
  location?: string;
};

type ProfileResponse = ApiSuccess<Profile> | ApiError;

function errorResponse(
  status: number,
  code: string,
  message: string,
  details?: unknown
): NextResponse<ApiError> {
  return NextResponse.json(
    {
      success: false,
      error: { code, message, details },
    },
    { status }
  );
}

function successResponse<T>(data: T): NextResponse<ApiSuccess<T>> {
  return NextResponse.json({ success: true, data });
}

function defaultSocialLinks(): SocialLink[] {
  return [
    { id: "google", provider: "google", linked: false },
    { id: "x", provider: "x", linked: false },
    { id: "telegram", provider: "telegram", linked: false },
    { id: "linkedin", provider: "linkedin", linked: false },
  ];
}

function splitFullName(full: string): { first: string; last: string } {
  const t = full.trim();
  if (!t) return { first: "", last: "" };
  const i = t.indexOf(" ");
  if (i === -1) return { first: t, last: "" };
  return { first: t.slice(0, i).trim(), last: t.slice(i + 1).trim() };
}

function sanitizeUserName(raw: string): string {
  const t = raw
    .trim()
    .replace(/[^a-zA-Z0-9_.-]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "")
    .slice(0, 255);
  return t || "user";
}

function existingProfileUserName(row: Record<string, unknown> | null | undefined): string | undefined {
  if (!row) return undefined;
  for (const key of ["user_name", "username", "userName"]) {
    const v = row[key];
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return undefined;
}

function existingProfileEmail(row: Record<string, unknown> | null | undefined): string | undefined {
  if (!row) return undefined;
  for (const key of ["email", "user_email", "userEmail"]) {
    const v = row[key];
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return undefined;
}

/**
 * Some `profiles` tables require NOT NULL `user_name` with no default (insert would fail if omitted).
 */
function normalizeAddressFromRow(row: Record<string, unknown> | null | undefined): ProfileAddress {
  const get = (...keys: string[]) => {
    if (!row) return "";
    for (const key of keys) {
      const value = row[key];
      if (typeof value === "string" && value.trim()) return value.trim();
    }
    return "";
  };

  const country = get("address_country", "addressCountry", "country");
  const city = get("address_city", "addressCity", "city");
  let street = get("address_street", "addressStreet", "street_address", "street");
  const apartment = get("address_apartment", "addressApartment", "apartment", "address_line2");
  const postcode = get("address_postcode", "addressPostcode", "postal_code", "postcode", "zip");

  if (!street && !city && !country && !postcode) {
    const legacy = get("location");
    if (legacy) street = legacy;
  }

  return { country, city, street, apartment, postcode };
}

function formatAddressLine(a: ProfileAddress): string | undefined {
  const parts = [a.street, a.apartment, a.city, a.postcode, a.country].map((s) => s.trim()).filter(Boolean);
  const line = parts.join(", ");
  return line || undefined;
}

function colText(v: string): string | null {
  const t = v.trim();
  return t === "" ? null : t;
}

function resolveAddressForSave(
  payload: ProfilePayload,
  existingRow: Record<string, unknown> | null | undefined
): ProfileAddress {
  const existing = normalizeAddressFromRow(existingRow);
  const p = payload.address;

  if (p) {
    return {
      country: p.country !== undefined ? String(p.country).trim() : existing.country,
      city: p.city !== undefined ? String(p.city).trim() : existing.city,
      street: p.street !== undefined ? String(p.street).trim() : existing.street,
      apartment: p.apartment !== undefined ? String(p.apartment).trim() : existing.apartment,
      postcode: p.postcode !== undefined ? String(p.postcode).trim() : existing.postcode,
    };
  }

  const loc =
    typeof payload.location === "string" ? payload.location.trim() : undefined;
  if (loc !== undefined) {
    return { ...existing, street: loc };
  }

  return existing;
}

function deriveUserName(
  payload: ProfilePayload,
  user: { email?: string | null },
  existing?: string | undefined
): string {
  const explicit =
    (typeof payload.userName === "string" && payload.userName.trim()) ||
    (typeof payload.username === "string" && payload.username.trim()) ||
    "";
  if (explicit) return sanitizeUserName(explicit);
  if (existing) {
    const e = existing.trim().slice(0, 255);
    return e || "user";
  }
  const fromNames = [payload.firstName?.trim(), payload.lastName?.trim()].filter(Boolean).join("_");
  if (fromNames) return sanitizeUserName(fromNames);
  const local = user.email?.split("@")[0]?.trim() ?? "";
  if (local) return sanitizeUserName(local);
  return "user";
}

function toProfile(params: {
  userId: string;
  email: string;
  row?: Record<string, unknown> | null;
  telegramUsername?: string | null;
  /** Used when `profiles.avatar_url` is empty (e.g. Telegram OAuth photo only in auth metadata). */
  authAvatarFallback?: string | undefined;
}): Profile {
  const row = params.row ?? null;

  const getString = (...keys: string[]) => {
    for (const key of keys) {
      const value = row?.[key];
      if (typeof value === "string") return value;
      if (value == null) continue;
    }
    return "";
  };

  const getOptionalString = (...keys: string[]) => {
    for (const key of keys) {
      const value = row?.[key];
      if (typeof value === "string") return value;
    }
    return undefined;
  };

  let firstName = getString("first_name", "firstName", "firstname");
  let lastName = getString("last_name", "lastName", "lastname");
  if (!firstName && !lastName) {
    const full = getString("full_name", "fullName", "fullname");
    if (full) {
      const parts = splitFullName(full);
      firstName = parts.first;
      lastName = parts.last;
    }
  }
  if (!firstName && !lastName) {
    const handle = getString("user_name", "username", "userName");
    if (handle) {
      const parts = splitFullName(handle.replace(/[_.]/g, " "));
      firstName = parts.first || handle;
      lastName = parts.last;
    }
  }

  const rowEmail = getString("email", "user_email", "userEmail");
  const resolvedEmail = rowEmail || params.email;
  const baseLinks = defaultSocialLinks();
  const socialLinks = isTelegramPlaceholderEmail(resolvedEmail)
    ? baseLinks.map((l) => (l.provider === "telegram" ? { ...l, linked: true } : l))
    : baseLinks;

  const rowAvatarRaw = getOptionalString("avatar_url", "avatarUrl", "avatarurl");
  const rowAvatar = rowAvatarRaw?.trim();
  const avatarUrl = rowAvatar ? rowAvatar : params.authAvatarFallback;

  return {
    id: params.userId,
    telegramUsername: params.telegramUsername ?? null,
    userName: getOptionalString("user_name", "userName"),
    email: resolvedEmail,
    firstName,
    lastName,
    phone: getString("phone"),
    dateOfBirth: getString("date_of_birth", "dateOfBirth", "dateofbirth"),
    address: normalizeAddressFromRow(row),
    avatarUrl,
    socialLinks,
  };
}

export async function GET(): Promise<NextResponse<ProfileResponse>> {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return errorResponse(401, "UNAUTHORIZED", "Authentication required.");
  }

  const { data: row, error } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();

  if (error) {
    return errorResponse(500, "PROFILE_FETCH_FAILED", "Failed to load profile.", error.message);
  }

  return successResponse(
    toProfile({
      userId: user.id,
      email: user.email ?? "",
      row,
      telegramUsername: readTelegramUsernameFromUserMetadata(user),
      authAvatarFallback: readAvatarUrlFromUserMetadata(user),
    })
  );
}

export async function PUT(request: NextRequest): Promise<NextResponse<ProfileResponse>> {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return errorResponse(401, "UNAUTHORIZED", "Authentication required.");
  }

  const telegramUsername = readTelegramUsernameFromUserMetadata(user);

  let payload: ProfilePayload;
  try {
    payload = (await request.json()) as ProfilePayload;
  } catch {
    return errorResponse(400, "INVALID_JSON", "Invalid JSON body.");
  }

  const trim = (v: string | undefined) => (typeof v === "string" ? v.trim() : undefined);

  const { data: existingRow } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  const user_name = deriveUserName(
    payload,
    user,
    existingProfileUserName(existingRow as Record<string, unknown> | null | undefined)
  );

  const profileEmail =
    (typeof user.email === "string" && user.email.trim()) ||
    (typeof payload.email === "string" && payload.email.trim()) ||
    existingProfileEmail(existingRow as Record<string, unknown> | null | undefined) ||
    "";

  const savedAddress = resolveAddressForSave(payload, existingRow as Record<string, unknown> | null);
  const locationLine = formatAddressLine(savedAddress);

  if (!profileEmail) {
    return errorResponse(
      400,
      "NO_PROFILE_EMAIL",
      "No email is available for this account; the database requires a profile email."
    );
  }

  const updateSnakeBase = {
    id: user.id,
    user_name,
    email: profileEmail,
    first_name: trim(payload.firstName),
    last_name: trim(payload.lastName),
    phone: trim(payload.phone),
    date_of_birth: trim(payload.dateOfBirth),
    location: locationLine ?? null,
    address_country: colText(savedAddress.country),
    address_city: colText(savedAddress.city),
    address_street: colText(savedAddress.street),
    address_apartment: colText(savedAddress.apartment),
    address_postcode: colText(savedAddress.postcode),
    avatar_url: trim(payload.avatarUrl),
  };

  /** Starter-template `profiles` (full_name + avatar_url only). */
  const updateLegacyStarter = (): Record<string, unknown> => {
    const fn = trim(payload.firstName) ?? "";
    const ln = trim(payload.lastName) ?? "";
    const full_name = [fn, ln].filter(Boolean).join(" ").trim() || undefined;
    const out: Record<string, unknown> = { id: user.id, user_name, email: profileEmail };
    if (full_name !== undefined) out.full_name = full_name;
    if (trim(payload.avatarUrl) !== undefined) out.avatar_url = trim(payload.avatarUrl);
    return out;
  };

  const tryUpsert = async (update: Record<string, unknown>) => {
    // Do not chain `.maybeSingle()` on writes: it forces
    // `Accept: application/vnd.pgrst.object+json`, which can break upsert responses
    // against PostgREST. Use a normal JSON array response and take the first row.
    return supabase.from("profiles").upsert(update, { onConflict: "id" }).select("*");
  };

  const firstRow = (data: unknown): Record<string, unknown> | null => {
    if (data == null) return null;
    if (Array.isArray(data)) return (data[0] as Record<string, unknown> | undefined) ?? null;
    if (typeof data === "object") return data as Record<string, unknown>;
    return null;
  };

  const profileFromRow = (row: Record<string, unknown> | null) =>
    toProfile({
      userId: user.id,
      email: profileEmail,
      row,
      telegramUsername,
      authAvatarFallback: readAvatarUrlFromUserMetadata(user),
    });

  const { data: dataSnake, error: errorSnake } = await tryUpsert(updateSnakeBase);
  const rowSnake = firstRow(dataSnake);

  if (errorSnake) {
    // Some projects already have a `profiles` table with camelCase columns.
    const updateCamelBase = {
      id: user.id,
      user_name,
      email: profileEmail,
      firstName: typeof payload.firstName === "string" ? payload.firstName.trim() : undefined,
      lastName: typeof payload.lastName === "string" ? payload.lastName.trim() : undefined,
      phone: typeof payload.phone === "string" ? payload.phone.trim() : undefined,
      dateOfBirth: typeof payload.dateOfBirth === "string" ? payload.dateOfBirth.trim() : undefined,
      location: locationLine ?? null,
      addressCountry: colText(savedAddress.country),
      addressCity: colText(savedAddress.city),
      addressStreet: colText(savedAddress.street),
      addressApartment: colText(savedAddress.apartment),
      addressPostcode: colText(savedAddress.postcode),
      avatarUrl: typeof payload.avatarUrl === "string" ? payload.avatarUrl.trim() : undefined,
    };

    const { data: dataCamel, error: errorCamel } = await tryUpsert(updateCamelBase);
    const rowCamel = firstRow(dataCamel);

    if (errorCamel) {
      // Final fallback: if the table is missing DOB columns, retry without them
      // so the rest of the profile can still be saved.
      const snakeNoDob = { ...updateSnakeBase };
      const camelNoDob = { ...updateCamelBase };
      delete (snakeNoDob as Record<string, unknown>).date_of_birth;
      delete (camelNoDob as Record<string, unknown>).dateOfBirth;

      const { data: dataSnakeNoDob, error: errorSnakeNoDob } = await tryUpsert(snakeNoDob);
      const rowSnakeNoDob = firstRow(dataSnakeNoDob);
      if (!errorSnakeNoDob && rowSnakeNoDob) {
        return successResponse(profileFromRow(rowSnakeNoDob));
      }

      const { data: dataCamelNoDob, error: errorCamelNoDob } = await tryUpsert(camelNoDob);
      const rowCamelNoDob = firstRow(dataCamelNoDob);
      if (!errorCamelNoDob && rowCamelNoDob) {
        return successResponse(profileFromRow(rowCamelNoDob));
      }

      const legacy = updateLegacyStarter();
      const { data: dataLegacy, error: errorLegacy } = await tryUpsert(legacy);
      const rowLegacy = firstRow(dataLegacy);
      if (!errorLegacy && rowLegacy) {
        return successResponse(profileFromRow(rowLegacy));
      }

      const { data: dataMinimal, error: errorMinimal } = await tryUpsert({
        id: user.id,
        user_name,
        email: profileEmail,
      });
      const rowMinimal = firstRow(dataMinimal);
      if (!errorMinimal && rowMinimal) {
        return successResponse(profileFromRow(rowMinimal));
      }

      const service = createServiceRoleClient();
      if (service) {
        const { data: dataSvc, error: errorSvc } = await service
          .from("profiles")
          .upsert(updateSnakeBase, { onConflict: "id" })
          .select("*");
        const rowSvc = firstRow(dataSvc);
        if (!errorSvc && rowSvc) {
          return successResponse(profileFromRow(rowSvc));
        }
        const { data: dataSvcMin, error: errorSvcMin } = await service
          .from("profiles")
          .upsert(
            { id: user.id, user_name, email: profileEmail },
            { onConflict: "id" }
          )
          .select("*");
        const rowSvcMin = firstRow(dataSvcMin);
        if (!errorSvcMin && rowSvcMin) {
          return successResponse(profileFromRow(rowSvcMin));
        }
        return errorResponse(
          500,
          "PROFILE_SAVE_FAILED",
          "Failed to save profile. User session upserts failed; service role upsert also failed. Check SUPABASE_SERVICE_ROLE_KEY on the server, profiles RLS, and table columns.",
          `${errorSnake.message}; user minimal: ${errorMinimal?.message ?? "n/a"}; svc: ${errorSvc?.message ?? "n/a"}; svc-min: ${errorSvcMin?.message ?? "n/a"}`
        );
      }

      return errorResponse(
        500,
        "PROFILE_SAVE_FAILED",
        "Failed to save profile. Set SUPABASE_SERVICE_ROLE_KEY on your host to allow a server-side save when row-level security blocks the browser session.",
        `${errorSnake.message}; retry: ${errorCamel.message}; fallback: ${errorSnakeNoDob?.message ?? "n/a"}; ${errorCamelNoDob?.message ?? "n/a"}; legacy: ${errorLegacy?.message ?? "n/a"}; minimal: ${errorMinimal?.message ?? "n/a"}`
      );
    }

    return successResponse(profileFromRow(rowCamel));
  }

  return successResponse(profileFromRow(rowSnake));
}

