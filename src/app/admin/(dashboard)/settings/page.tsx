
import { SiteSettingsForm } from "@/components/admin/site-settings-form";
import { PageHeader } from "@/components/admin/page-header";
import { requireAdmin } from "@/lib/admin/auth";

export default async function SettingsPage() {
  const { supabase } = await requireAdmin();
  const { data: settings, error } = await supabase
    .from("site_settings")
    .select("key, value");

  if (error) {
    console.error(`[admin/settings] Failed to load settings: ${error.message}`);
  }

  const settingsMap: Record<string, string> = {};

  // Legacy nested `social` rows first — explicit flat keys (written by the
  // form) take precedence so the admin always sees the effective value.
  for (const row of settings ?? []) {
    if (row.key === "social" && row.value && typeof row.value === "object") {
      for (const [key, value] of Object.entries(row.value)) {
        if (value !== null && value !== undefined) settingsMap[key] = String(value);
      }
    }
  }

  for (const row of settings ?? []) {
    if (row.key === "social") continue;
    if (row.value !== null && row.value !== undefined) {
      settingsMap[row.key] = typeof row.value === "string" ? row.value : String(row.value);
    }
  }

  return (
    <div className="space-y-7">
      <PageHeader
        title="Site Settings"
        description="Branding, contact details and store defaults used across the website."
      />
      {error ? (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          Settings could not be loaded from the database ({error.message}). Values shown
          below are the built-in defaults and saving will overwrite them.
        </div>
      ) : null}
      <SiteSettingsForm settings={settingsMap} />
    </div>
  );
}
