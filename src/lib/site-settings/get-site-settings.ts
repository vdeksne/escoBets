import { isDemoMode } from "@/lib/demo-mode";
import { createClient } from "@/lib/supabase/server";
import { mergeSiteSettings } from "./merge-payload";
import { DEFAULT_SITE_SETTINGS } from "./defaults";
import type { SiteSettingsPayload } from "@/types/site-settings";

/** Server-only: read merged site settings (public RLS). */
export async function getSiteSettings(): Promise<SiteSettingsPayload> {
  if (isDemoMode()) {
    return DEFAULT_SITE_SETTINGS;
  }
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select("payload")
      .eq("id", "default")
      .maybeSingle();
    if (error || !data?.payload) {
      return DEFAULT_SITE_SETTINGS;
    }
    return mergeSiteSettings(data.payload);
  } catch {
    return DEFAULT_SITE_SETTINGS;
  }
}
