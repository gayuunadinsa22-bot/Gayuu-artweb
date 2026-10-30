/**
 * ─────────────────────────────────────────────────────────────
 *  SITE SETTINGS — built-in defaults (single source of fallback).
 *
 *  These values are the DEFAULTS shipped with the code. Once
 *  Supabase is connected, the artist can edit them live from
 *  Admin → Site Settings; the database values override these.
 *
 *  Every value below is placeholder content. Replace with the
 *  artist's real details before going live (or just edit them
 *  from the admin dashboard — no code needed).
 * ─────────────────────────────────────────────────────────────
 */

export interface SocialLinks {
  instagram: string;
  facebook: string;
  tiktok: string;
  pinterest: string;
}

export interface SeoSettings {
  title: string;
  description: string;
  ogImage: string;
}

export interface SiteSettingsShape {
  /** Brand / studio name (shown in navbar, footer, metadata). */
  brandName: string;
  /** Artist display name ("Hi, I'm …"). */
  artistName: string;
  /** Full artist name used in orders + signatures. */
  artistFullName: string;
  /** One-line brand descriptor. */
  tagline: string;
  /** WhatsApp business number — INTERNATIONAL FORMAT, DIGITS ONLY. */
  whatsappNumber: string;
  whatsappDisplay: string;
  /** Contact email (mailto links). */
  contactEmail: string;
  /** Location line. */
  location: string;
  social: SocialLinks;
  /** Currency used across the store. */
  currency: string;
  currencySymbol: string;
  /** Free shipping threshold in currency units (0 disables the note). */
  freeShippingOver: number;
  /** Base delivery fee shown at checkout (artist confirms final fee). */
  deliveryFeeFrom: number;
  /** Short line shown in the footer. */
  about: string;
  /** Optional logo image (public path or uploaded URL). Empty = text logo. */
  logoImage: string;
  /** Favicon image path/URL. */
  favicon: string;
  /** Store policies — plain text, supports multiple paragraphs (blank line separated). */
  shippingInfo: string;
  deliveryInfo: string;
  returnPolicy: string;
  careInstructions: string;
  seo: SeoSettings;
}

export const defaultSiteSettings: SiteSettingsShape = {
  /** Brand / studio name (shown in navbar, footer, metadata). */
  brandName: "Gayuu",

  /** Artist display name ("Hi, I'm …"). */
  artistName: "Amaya",

  /** Full artist name used in orders + signatures (placeholder). */
  artistFullName: "Amaya [Last Name]",

  /** One-line brand descriptor. */
  tagline: "Handmade art for spaces, souls & stories.",

  /**
   * WhatsApp business number — INTERNATIONAL FORMAT, DIGITS ONLY.
   * Example: +94 77 123 4567 → "94771234567"
   * TODO: replace with the artist's real WhatsApp number.
   */
  whatsappNumber: "94771234567",
  whatsappDisplay: "+94 77 123 4567",

  /** Contact email (mailto links). */
  contactEmail: "hello@gayuu.art",

  /** Location line — clearly editable placeholder. */
  location: "[Your City], Sri Lanka",

  social: {
    /** Full profile URLs — replace with real handles. */
    instagram: "https://www.instagram.com/",
    facebook: "https://www.facebook.com/",
    tiktok: "https://www.tiktok.com/",
    pinterest: "https://www.pinterest.com/",
  },

  /** Currency used across the store. */
  currency: "LKR",
  currencySymbol: "LKR",

  /** Free shipping threshold in LKR (0 disables the note). */
  freeShippingOver: 25000,

  /** Base delivery fee shown at checkout (artist confirms final fee). */
  deliveryFeeFrom: 750,

  /** A short line shown in the footer. */
  about:
    "A small independent art studio making original paintings, gentle prints & commissioned portraits by hand.",

  /** Optional brand assets — leave empty to use the elegant text logo. */
  logoImage: "",
  favicon: "/favicon.ico",

  /** Store policies — shown on checkout / product pages. */
  shippingInfo:
    "Ready-to-ship pieces leave the studio within 2–3 working days. Worldwide shipping is available — every piece is tracked and packed with care.",
  deliveryInfo:
    "Delivery fees are confirmed on WhatsApp before your order is packed. Local deliveries typically arrive within 2–5 working days; international delivery times vary by destination.",
  returnPolicy:
    "If your artwork arrives damaged, send a photo within 48 hours and a replacement or refund will be arranged. Because every piece is handmade and one-of-a-kind, change-of-mind returns are not accepted — please ask any questions before ordering.",
  careInstructions:
    "Keep artwork out of direct sunlight and humid areas. Dust gently with a soft, dry cloth. Avoid touching painted surfaces with wet hands.",

  seo: {
    title: "Gayuu — Handmade Art Studio",
    description:
      "Original handmade paintings, signed art prints, mini artworks and custom portrait commissions — made slowly and with love in Sri Lanka.",
    ogImage: "/images/og-cover.jpg",
  },
};

/**
 * ACTIVE settings singleton used across the storefront.
 *
 * The root layout (server) and the client `SettingsProvider` both call
 * `applySiteSettings()` with database values, so every component that
 * reads `siteSettings.*` shows the admin-edited values — no prop
 * threading needed. Always merges over the built-in defaults, so
 * deleting a value in the database never leaves stale content behind.
 */
export const siteSettings: SiteSettingsShape = {
  ...defaultSiteSettings,
  social: { ...defaultSiteSettings.social },
  seo: { ...defaultSiteSettings.seo },
};

/**
 * Pure merge of stored (DB) values over the built-in defaults.
 *
 * Blank strings in the database mean "not configured" — they must never
 * wipe out a sensible built-in value (this is what made the navbar lose
 * the brand name after an admin saved a form with empty fields).
 */
export function mergeSiteSettings(
  partial?: Partial<SiteSettingsShape> | null,
): SiteSettingsShape {
  const p = partial ?? {};
  const merged: SiteSettingsShape = {
    ...defaultSiteSettings,
    ...p,
    social: { ...defaultSiteSettings.social, ...(p.social ?? {}) },
    seo: { ...defaultSiteSettings.seo, ...(p.seo ?? {}) },
  };

  // Fall back to the built-in value whenever a stored string is blank and
  // the default is meaningful (logoImage keeps "" because blank = no logo).
  for (const key of Object.keys(defaultSiteSettings) as Array<keyof SiteSettingsShape>) {
    const fallback = defaultSiteSettings[key];
    const current = merged[key];
    if (typeof fallback !== "string" || typeof current !== "string") continue;
    if (current.trim() === "" && fallback.trim() !== "") {
      (merged as unknown as Record<string, unknown>)[key] = fallback;
    }
  }

  for (const key of Object.keys(defaultSiteSettings.social) as Array<keyof SocialLinks>) {
    if (!merged.social[key] || merged.social[key].trim() === "") {
      merged.social[key] = defaultSiteSettings.social[key];
    }
  }

  for (const key of Object.keys(defaultSiteSettings.seo) as Array<keyof SeoSettings>) {
    if (!merged.seo[key] || merged.seo[key].trim() === "") {
      merged.seo[key] = defaultSiteSettings.seo[key];
    }
  }

  // The brand is the one value that must never render as empty.
  if (!merged.brandName || merged.brandName.trim() === "") {
    merged.brandName = defaultSiteSettings.brandName || "Gayuu";
  }

  return merged;
}

/** Applies stored values onto the `siteSettings` singleton (in place). */
export function applySiteSettings(
  partial?: Partial<SiteSettingsShape> | null,
): void {
  Object.assign(siteSettings, mergeSiteSettings(partial));
}

/** Central nav model — used by navbar, footer and mobile menu. */
export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;
