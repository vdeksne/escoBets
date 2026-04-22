import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { SiteSettingsForm } from "@/components/admin/site-settings-form";
import { getSiteSettings } from "@/lib/site-settings/get-site-settings";

export default async function AdminSitePage() {
  const initial = await getSiteSettings();
  return (
    <div className="flex min-h-screen flex-col bg-black">
      <Header />
      <SiteSettingsForm initial={initial} />
      <Footer />
    </div>
  );
}
