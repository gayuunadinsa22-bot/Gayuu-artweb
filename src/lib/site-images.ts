/**
 * Editable storefront imagery.
 *
 * The admin dashboard stores uploaded image URLs in Supabase; these
 * definitions provide the matching local placeholders so the site keeps
 * its original look whenever no admin image has been configured.
 */

/* ------------------------------------------------------------------ */
/* Homepage                                                           */
/* ------------------------------------------------------------------ */

export interface HomepageImages {
  hero_image_url?: string | null;
  hero_floating_image_url?: string | null;
  artist_intro_image_url?: string | null;
}

export type HomepageImageKey = keyof HomepageImages;

export const HOMEPAGE_IMAGE_KEYS = [
  "hero_image_url",
  "hero_floating_image_url",
  "artist_intro_image_url",
] as const satisfies readonly HomepageImageKey[];

export const homepageImageDefaults: Record<HomepageImageKey, string> = {
  hero_image_url: "/images/work-velvet-dusk.jpg",
  hero_floating_image_url: "/images/studio-palette.jpg",
  artist_intro_image_url: "/images/portrait-1.jpg",
};

export interface ImageFieldDefinition<TKey extends string> {
  key: TKey;
  label: string;
  description: string;
  /** Tailwind aspect class used by the admin thumbnail. */
  ratio: string;
}

export const homepageImageDefinitions: ImageFieldDefinition<HomepageImageKey>[] = [
  {
    key: "hero_image_url",
    label: "Main Hero Painting",
    description:
      "The large artwork shown on the right side of the homepage hero.",
    ratio: "aspect-[4/5]",
  },
  {
    key: "hero_floating_image_url",
    label: "Hero Floating Artwork",
    description:
      "The smaller studio image overlapping the bottom-left of the main hero painting.",
    ratio: "aspect-square",
  },
  {
    key: "artist_intro_image_url",
    label: "Artist Introduction Portrait",
    description:
      "The portrait shown beside “Hi, I’m the hands behind the art.”.",
    ratio: "aspect-[4/5]",
  },
];

/* ------------------------------------------------------------------ */
/* About page                                                         */
/* ------------------------------------------------------------------ */

export interface AboutImages {
  heroImageUrl?: string | null;
  portraitImageUrl?: string | null;
  studioImage1Url?: string | null;
  studioImage2Url?: string | null;
  studioImage3Url?: string | null;
}

export type AboutImageKey = keyof AboutImages;

export const ABOUT_IMAGE_KEYS = [
  "heroImageUrl",
  "portraitImageUrl",
  "studioImage1Url",
  "studioImage2Url",
  "studioImage3Url",
] as const satisfies readonly AboutImageKey[];

export const aboutImageDefaults: Record<AboutImageKey, string> = {
  heroImageUrl: "/images/gallery-wall.jpg",
  portraitImageUrl: "/images/portrait-1.jpg",
  studioImage1Url: "/images/studio-desk.jpg",
  studioImage2Url: "/images/studio-palette.jpg",
  studioImage3Url: "/images/studio-easel.jpg",
};

export const aboutImageDefinitions: ImageFieldDefinition<AboutImageKey>[] = [
  {
    key: "heroImageUrl",
    label: "About Hero Image",
    description: "The wide image beneath the About page headline.",
    ratio: "aspect-[16/9]",
  },
  {
    key: "portraitImageUrl",
    label: "Artist Portrait",
    description: "The portrait beside the artist introduction.",
    ratio: "aspect-[4/5]",
  },
  {
    key: "studioImage1Url",
    label: "Studio Photo 1",
    description: "First image in the “Studio notes” grid.",
    ratio: "aspect-[4/5]",
  },
  {
    key: "studioImage2Url",
    label: "Studio Photo 2",
    description: "Second image in the “Studio notes” grid.",
    ratio: "aspect-[4/5]",
  },
  {
    key: "studioImage3Url",
    label: "Studio Photo 3",
    description: "Third image in the “Studio notes” grid.",
    ratio: "aspect-[4/5]",
  },
];

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */

/** Returns a safe public image URL, or the bundled placeholder. */
export function resolveMediaUrl(
  value: string | null | undefined,
  fallback: string,
): string {
  const trimmed = value?.trim();
  if (!trimmed) return fallback;
  // Local public assets (but not protocol-relative "//host" URLs).
  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) return trimmed;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return fallback;
}
