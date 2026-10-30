"use client";

import type { ReactNode } from "react";
import {
  applySiteSettings,
  type SiteSettingsShape,
} from "@/lib/settings";

/**
 * Applies admin-edited site settings to the `siteSettings` singleton
 * during render — before any child renders — so every component that
 * reads `siteSettings.*` (navbar, footer, WhatsApp links, policies,
 * currency…) shows database values on both server and client with no
 * hydration mismatch. When Supabase isn't configured the layout passes
 * `undefined` and the built-in defaults stay in effect.
 */
export function SettingsProvider({
  settings,
  children,
}: {
  settings?: Partial<SiteSettingsShape> | null;
  children: ReactNode;
}) {
  applySiteSettings(settings);
  return <>{children}</>;
}
