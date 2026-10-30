/**
 * STOREFRONT DATA LAYER — Supabase first, local content as fallback.
 *
 * Every getter is a `"use cache"` function tagged with a named cache
 * tag. Admin mutations call `revalidateStorefront()` (see
 * `@/lib/admin/actions`) so changes appear on the public site
 * immediately.
 *
 * Fallback rules (site must build & run with no Supabase configured):
 *  - Supabase not configured  → built-in local content
 *  - Query failed (network…)  → built-in local content (resilience)
 *  - Configured + empty table → real empty result (artist cleared it)
 */

import { cacheTag } from "next/cache";
import { createPublicClient } from "@/lib/supabase/public";
import {
  applySiteSettings,
  defaultSiteSettings,
  mergeSiteSettings,
  type SiteSettingsShape,
} from "@/lib/settings";
import {
  artworks as localArtworks,
  type Artwork,
  type CategorySlug,
} from "@/lib/artworks";
import { testimonials as localTestimonials, type Testimonial } from "@/lib/content";

/* ------------------------------------------------------------------ */
/* Site settings                                                      */
/* ------------------------------------------------------------------ */

/** Coerces a stored JSONB value back to the type of its default. */
function coerceSetting(key: string, value: unknown): unknown {
  if (value === null || value === undefined) return undefined;

  const def = (defaultSiteSettings as unknown as Record<string, unknown>)[key];

  if (typeof def === "number") {
    const n =
      typeof value === "number"
        ? value
        : Number(String(value).replace(/[^0-9.-]/g, ""));
    return Number.isFinite(n) ? n : undefined;
  }

  if (def && typeof def === "object" && !Array.isArray(def)) {
    // Nested objects (social / seo) only when stored as an object.
    return typeof value === "object" && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : undefined;
  }

  return typeof value === "string" ? value : String(value);
}

/** Keys the old/existing admin form stores as flat `site_settings` rows. */
const FLAT_SOCIAL_KEYS = ["instagram", "facebook", "tiktok", "pinterest"] as const;

/** Cached database read. Never called directly — see `getSiteSettings`. */
async function fetchSiteSettings(): Promise<SiteSettingsShape> {
  "use cache";
  cacheTag("settings");

  const supabase = createPublicClient();
  if (!supabase) return defaultSiteSettings;

  const { data, error } = await supabase
    .from("site_settings")
    .select("key, value");

  if (error) {
    // Surface the real problem in server logs instead of silently serving
    // demo data, while still keeping the storefront resilient.
    console.error(`[storefront] Failed to load site settings: ${error.message}`);
    return defaultSiteSettings;
  }

  if (!data || data.length === 0) return defaultSiteSettings;

  const partial: Record<string, unknown> = {};
  const flatSocial: Record<string, unknown> = {};
  let nestedSocial: Record<string, unknown> | null = null;

  for (const row of data) {
    const value = coerceSetting(row.key, row.value);
    if (value === undefined) continue;

    if (
      row.key === "social" &&
      typeof value === "object" &&
      value !== null &&
      !Array.isArray(value)
    ) {
      nestedSocial = value as Record<string, unknown>;
      continue;
    }

    // The admin form saves social links as flat keys (`instagram`, …)
    // while older data may nest them under `social`. Support both, with
    // the flat keys (what the form writes) taking precedence.
    if (
      (FLAT_SOCIAL_KEYS as readonly string[]).includes(row.key) &&
      typeof value === "string"
    ) {
      flatSocial[row.key] = value;
      continue;
    }

    partial[row.key] = value;
  }

  if (nestedSocial || Object.keys(flatSocial).length > 0) {
    partial.social = { ...(nestedSocial ?? {}), ...flatSocial };
  }

  return mergeSiteSettings(partial as Partial<SiteSettingsShape>);
}

/**
 * Database settings merged over the built-in defaults.
 *
 * Also applies the result onto the shared `siteSettings` singleton before
 * returning. Server Components (footer, contact page, metadata) read that
 * singleton directly, so they must see database values during the RSC
 * render — the client `SettingsProvider` runs too late for them.
 */
export async function getSiteSettings(): Promise<SiteSettingsShape> {
  const settings = await fetchSiteSettings();
  applySiteSettings(settings);
  return settings;
}

/* ------------------------------------------------------------------ */
/* Homepage sections                                                  */
/* ------------------------------------------------------------------ */

export type HomepageSections = Record<string, Record<string, string>>;

export interface HomepageImages {
  hero_image_url?: string | null;
  hero_floating_image_url?: string | null;
  artist_intro_image_url?: string | null;
}

/**
 * Edited homepage copy keyed by section (`hero`, `artist`, `behind`,
 * `instagram`, `newsletter`). Missing sections fall back to the copy
 * already hard-coded in the components — layouts never change.
 */
export async function getHomepageSections(): Promise<HomepageSections> {
  "use cache";
  cacheTag("homepage");

  const supabase = createPublicClient();
  if (!supabase) return {};

  const { data, error } = await supabase
    .from("homepage_sections")
    .select("section_key, content");

  if (error) {
    console.error(`[storefront] Failed to load homepage sections: ${error.message}`);
    return {};
  }
  if (!data) return {};

  const sections: HomepageSections = {};
  for (const row of data) {
    if (row.content && typeof row.content === "object" && !Array.isArray(row.content)) {
      sections[row.section_key] = row.content as Record<string, string>;
    }
  }
  return sections;
}

/** Editable homepage images from the admin dashboard. */
export async function getHomepageImages(): Promise<HomepageImages> {
  "use cache";
  cacheTag("homepage");

  const supabase = createPublicClient();
  if (!supabase) return {};

  // `*` keeps this working before the additive image migration has been
  // applied; the JSONB `content` mirror is used as a fallback below.
  const { data, error } = await supabase
    .from("homepage_sections")
    .select("*")
    .eq("section_key", "hero")
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error(`[storefront] Failed to load homepage images: ${error.message}`);
    return {};
  }
  if (!data) return {};

  const row = data as Record<string, unknown>;
  const content =
    data.content && typeof data.content === "object" && !Array.isArray(data.content)
      ? (data.content as Record<string, unknown>)
      : {};

  return {
    hero_image_url:
      (row.hero_image_url as string | null | undefined) ??
      (content.heroImageUrl as string | null | undefined) ??
      null,
    hero_floating_image_url:
      (row.hero_floating_image_url as string | null | undefined) ??
      (content.heroFloatingImageUrl as string | null | undefined) ??
      null,
    artist_intro_image_url:
      (row.artist_intro_image_url as string | null | undefined) ??
      (content.artistIntroImageUrl as string | null | undefined) ??
      null,
  };
}

/* ------------------------------------------------------------------ */
/* About page                                                         */
/* ------------------------------------------------------------------ */

export type AboutContent = Record<string, string>;

export interface AboutImages {
  heroImageUrl?: string | null;
  portraitImageUrl?: string | null;
  studioImage1Url?: string | null;
  studioImage2Url?: string | null;
  studioImage3Url?: string | null;
}

/** Edited about-page copy; empty object = use the component defaults. */
export async function getAboutContent(): Promise<AboutContent> {
  "use cache";
  cacheTag("about");

  const supabase = createPublicClient();
  if (!supabase) return {};

  const { data, error } = await supabase
    .from("about_content")
    .select("content")
    .order("updated_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error(`[storefront] Failed to load about content: ${error.message}`);
    return {};
  }
  if (!data?.content) return {};
  if (typeof data.content !== "object" || Array.isArray(data.content)) return {};

  // Coerce every stored value to a string so optional/misshapen data can
  // never crash the public About page (e.g. `.trim()` on a number).
  const result: AboutContent = {};
  for (const [key, value] of Object.entries(data.content as Record<string, unknown>)) {
    if (typeof value === "string") result[key] = value;
    else if (value !== null && value !== undefined) result[key] = String(value);
  }
  return result;
}

/** Editable about-page images from the admin dashboard. */
export async function getAboutImages(): Promise<AboutImages> {
  "use cache";
  cacheTag("about");

  const supabase = createPublicClient();
  if (!supabase) return {};

  // `*` avoids failing the whole query when the additive image columns
  // have not been created yet; `content` carries the same URLs as a mirror.
  const { data, error } = await supabase
    .from("about_content")
    .select("*")
    .order("updated_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error(`[storefront] Failed to load about images: ${error.message}`);
    return {};
  }
  if (!data) return {};

  const d = data as Record<string, unknown>;
  const fromColumns: AboutImages = {
    heroImageUrl: (d.heroImageUrl ?? d.hero_image_url) as string | null | undefined,
    portraitImageUrl: (d.portraitImageUrl ?? d.portrait_image_url) as string | null | undefined,
    studioImage1Url: (d.studioImage1Url ?? d.studio_image1_url) as string | null | undefined,
    studioImage2Url: (d.studioImage2Url ?? d.studio_image2_url) as string | null | undefined,
    studioImage3Url: (d.studioImage3Url ?? d.studio_image3_url) as string | null | undefined,
  };

  const content = data.content;
  if (content && typeof content === "object" && !Array.isArray(content)) {
    const c = content as Record<string, unknown>;
    return {
      heroImageUrl: (fromColumns.heroImageUrl ?? c.heroImageUrl ?? c.hero_image_url) as string | null | undefined,
      portraitImageUrl: (fromColumns.portraitImageUrl ?? c.portraitImageUrl ?? c.portrait_image_url) as string | null | undefined,
      studioImage1Url: (fromColumns.studioImage1Url ?? c.studioImage1Url ?? c.studio_image1_url) as string | null | undefined,
      studioImage2Url: (fromColumns.studioImage2Url ?? c.studioImage2Url ?? c.studio_image2_url) as string | null | undefined,
      studioImage3Url: (fromColumns.studioImage3Url ?? c.studioImage3Url ?? c.studio_image3_url) as string | null | undefined,
    };
  }

  return fromColumns;
}

/* ------------------------------------------------------------------ */
/* Artworks                                                           */
/* ------------------------------------------------------------------ */

interface ArtworkImageRow {
  image_url: string;
  position: number | null;
  is_cover: boolean | null;
}

interface ArtworkRow {
  id: string;
  slug: string;
  title: string;
  tagline: string | null;
  description: string | null;
  price: number | string;
  price_from: boolean | null;
  category: string;
  dimensions: string | null;
  medium: string | null;
  materials: string[] | null;
  availability: string | null;
  max_quantity: number | null;
  featured: boolean | null;
  is_new: boolean | null;
  edition_size: number | null;
  created_at: string;
  story: string | null;
  accent: string | null;
  artwork_images?: ArtworkImageRow[];
}

function mapArtwork(row: ArtworkRow): Artwork {
  const images = [...(row.artwork_images ?? [])]
    .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
    .sort((a, b) => Number(b.is_cover ?? false) - Number(a.is_cover ?? false))
    .map((img) => img.image_url);

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    tagline: row.tagline ?? "",
    description: row.description ?? "",
    price: Number(row.price),
    priceFrom: row.price_from ?? undefined,
    category: row.category as CategorySlug,
    images,
    dimensions: row.dimensions ?? "",
    medium: row.medium ?? "",
    materials: row.materials ?? [],
    availability: (row.availability as Artwork["availability"]) ?? "available",
    maxQuantity: row.max_quantity ?? 1,
    featured: row.featured ?? false,
    isNew: row.is_new ?? undefined,
    editionSize: row.edition_size ?? undefined,
    createdAt: (row.created_at ?? "").slice(0, 10),
    story: row.story ?? undefined,
    accent: row.accent ?? "#E8B4B8",
  };
}

const ARTWORK_SELECT =
  "*, artwork_images(image_url, position, is_cover)";

/** Full catalog — database when configured, otherwise local content. */
export async function getArtworks(): Promise<Artwork[]> {
  "use cache";
  cacheTag("artworks");

  const supabase = createPublicClient();
  if (!supabase) return localArtworks;

  const { data, error } = await supabase
    .from("artworks")
    .select(ARTWORK_SELECT)
    .order("created_at", { ascending: false });

  if (error || !data) return localArtworks;
  return (data as unknown as ArtworkRow[]).map(mapArtwork);
}

/** Single artwork by slug, or `null` when it doesn't exist. */
export async function getArtworkBySlug(slug: string): Promise<Artwork | null> {
  "use cache";
  cacheTag("artworks");

  const supabase = createPublicClient();
  if (!supabase) {
    return localArtworks.find((a) => a.slug === slug) ?? null;
  }

  const { data, error } = await supabase
    .from("artworks")
    .select(ARTWORK_SELECT)
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    return localArtworks.find((a) => a.slug === slug) ?? null;
  }
  if (!data) return null;
  return mapArtwork(data as unknown as ArtworkRow);
}

/* ------------------------------------------------------------------ */
/* Testimonials                                                       */
/* ------------------------------------------------------------------ */

interface TestimonialRow {
  id: string;
  customer_name: string;
  review: string;
  visible: boolean | null;
}

/** Visible customer reviews (newest first), local fallback when offline. */
export async function getTestimonials(): Promise<Testimonial[]> {
  "use cache";
  cacheTag("testimonials");

  const supabase = createPublicClient();
  if (!supabase) return localTestimonials;

  const { data, error } = await supabase
    .from("testimonials")
    .select("id, customer_name, review, visible")
    .eq("visible", true)
    .order("created_at", { ascending: false });

  if (error) return localTestimonials;

  return (data as TestimonialRow[]).map((row) => ({
    quote: row.review,
    name: row.customer_name,
    location: "",
    work: "",
  }));
}

/* ------------------------------------------------------------------ */
/* Gallery extras                                                     */
/* ------------------------------------------------------------------ */

export interface GalleryItem {
  id: string;
  title: string | null;
  description: string | null;
  image_url: string;
  artwork_id: string | null;
  position: number;
}

/**
 * Extra studio photos shown in the gallery. Returns `null` when not
 * configured (component keeps its current content); `[]` when the
 * gallery was intentionally emptied.
 */
export async function getGalleryItems(): Promise<GalleryItem[] | null> {
  "use cache";
  cacheTag("gallery");

  const supabase = createPublicClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("gallery_items")
    .select("*")
    .order("position", { ascending: true });

  if (error) return null;
  return (data ?? []) as GalleryItem[];
}

/* ------------------------------------------------------------------ */
/* Commission types                                                   */
/* ------------------------------------------------------------------ */

export interface CommissionType {
  id: string;
  name: string;
  description: string | null;
  starting_price: number | null;
  available: boolean;
  image_url: string | null;
}

/** `null` = not configured/error (component keeps static content). */
export async function getCommissionTypes(): Promise<CommissionType[] | null> {
  "use cache";
  cacheTag("commissions");

  const supabase = createPublicClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("commission_types")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) return null;
  return (data ?? []) as CommissionType[];
}
