/**
 * ARTWORK CATALOG — demo content.
 * Replace images, titles, prices and copy with the artist's real works.
 * Images live in /public/images and are referenced from the site root.
 */

export type CategorySlug =
  | "original-paintings"
  | "sketches-drawings"
  | "custom-portraits"
  | "art-prints"
  | "mini-artworks";

export type Availability = "available" | "made-to-order" | "sold";

export type Badge = "original" | "limited-edition" | "new" | "sold-out";

export interface Artwork {
  id: string;
  slug: string;
  title: string;
  /** One-line poetic subtitle shown on cards. */
  tagline: string;
  description: string;
  /** Price in Sri Lankan Rupees. */
  price: number;
  /** From-price for made-to-order work. */
  priceFrom?: boolean;
  category: CategorySlug;
  images: string[];
  dimensions: string;
  medium: string;
  materials: string[];
  availability: Availability;
  /** Max units a customer may add to cart (originals = 1). */
  maxQuantity: number;
  featured: boolean;
  isNew?: boolean;
  /** Edition size for limited-edition prints. */
  editionSize?: number;
  createdAt: string;
  /** Short story shown on the product page. */
  story?: string;
  /** Accent color used for tinted placeholders. */
  accent: string;
}

export const artworks: Artwork[] = [
  {
    id: "w01",
    slug: "golden-hour",
    title: "Golden Hour",
    tagline: "honey light, held still",
    description:
      "A warm, glowing original built from layers of amber, terracotta and soft cream. Painted slowly over several evenings, Golden Hour captures that last quiet light before the day turns in on itself.",
    price: 95000,
    category: "original-paintings",
    images: [
      "/images/work-golden-hour.jpg",
      "/images/work-golden-hour-detail.jpg",
      "/images/work-golden-hour-alt.jpg",
    ],
    dimensions: '24 × 36 in (61 × 91 cm)',
    medium: "Acrylic & oil on stretched canvas",
    materials: ["Artist-grade acrylic", "Cold-pressed linseed oil", "Cotton canvas", "Matte varnish"],
    availability: "available",
    maxQuantity: 1,
    featured: true,
    isNew: false,
    createdAt: "2026-06-12",
    story:
      "This piece began as a colour study on a scrap of canvas and refused to stay small. The final layer of gold was added in one sitting, just as the studio light went amber — the painting basically painted its own ending.",
    accent: "#E8B4B8",
  },
  {
    id: "w02",
    slug: "quiet-bloom",
    title: "Quiet Bloom",
    tagline: "a garden whispering",
    description:
      "Soft botanical forms drift across a pale ground in this gentle original. Dusty rose, sage and ivory blend into something that feels like flowers remembered rather than seen.",
    price: 78000,
    category: "original-paintings",
    images: [
      "/images/work-quiet-bloom.jpg",
      "/images/work-quiet-bloom-detail.jpg",
      "/images/work-quiet-bloom-alt.jpg",
    ],
    dimensions: '18 × 24 in (46 × 61 cm)',
    medium: "Acrylic on stretched canvas",
    materials: ["Artist-grade acrylic", "Gesso-primed canvas", "Soft matte varnish"],
    availability: "available",
    maxQuantity: 1,
    featured: true,
    createdAt: "2026-07-02",
    story:
      "Painted after a week of rain, with the window open and the garden dripping. Nothing was planned — the blooms arrived on their own.",
    accent: "#A8B5A2",
  },
  {
    id: "w03",
    slug: "linen-skies",
    title: "Linen Skies",
    tagline: "clouds on real linen",
    description:
      "A large atmospheric original on natural linen, where pale blues and warm greys dissolve into open sky. Visible weave and raw edges keep it grounded and tactile.",
    price: 120000,
    category: "original-paintings",
    images: [
      "/images/work-linen-skies.jpg",
      "/images/work-linen-skies-detail.jpg",
      "/images/work-linen-skies-alt.jpg",
    ],
    dimensions: '30 × 40 in (76 × 102 cm)',
    medium: "Oil on Belgian linen",
    materials: ["Oil paint", "Belgian linen", "Cold-pressed medium", "Natural resin varnish"],
    availability: "sold",
    maxQuantity: 1,
    featured: true,
    createdAt: "2026-04-18",
    story:
      "A study of the sky on the days it can't decide what it is. This one found its home before it was even varnished.",
    accent: "#DCD6F7",
  },
  {
    id: "w04",
    slug: "rosewater",
    title: "Rosewater",
    tagline: "blush, dissolved",
    description:
      "Tonal washes of dusty rose and warm white move like tinted water across the canvas. Minimal, meditative and impossibly soft in person.",
    price: 64000,
    category: "original-paintings",
    images: [
      "/images/work-rosewater.jpg",
      "/images/work-rosewater-detail.jpg",
      "/images/work-rosewater-alt.jpg",
    ],
    dimensions: '16 × 20 in (41 × 51 cm)',
    medium: "Acrylic wash on canvas",
    materials: ["Fluid acrylics", "Blending medium", "Cotton canvas"],
    availability: "available",
    maxQuantity: 1,
    featured: false,
    createdAt: "2026-08-21",
    accent: "#E8B4B8",
  },
  {
    id: "w05",
    slug: "velvet-dusk",
    title: "Velvet Dusk",
    tagline: "the hour between",
    description:
      "Deep plum, ink and candle-gold collide in this moody large-format original. Built in thick, confident layers that catch the light differently all day long.",
    price: 145000,
    category: "original-paintings",
    images: [
      "/images/work-velvet-dusk.jpg",
      "/images/work-velvet-dusk-detail.jpg",
      "/images/work-velvet-dusk-alt.jpg",
    ],
    dimensions: '36 × 48 in (91 × 122 cm)',
    medium: "Mixed media on canvas",
    materials: ["Acrylic", "Oil stick", "Metallic pigment", "Gallery-depth canvas"],
    availability: "available",
    maxQuantity: 1,
    featured: true,
    createdAt: "2026-05-30",
    story:
      "The studio's biggest canvas yet — painted standing up, music too loud, entirely by feel.",
    accent: "#77716D",
  },
  {
    id: "w06",
    slug: "lavender-haze",
    title: "Lavender Haze",
    tagline: "soft focus, lilac days",
    description:
      "A dreamy lilac-toned original with blurred edges and a hazy, film-like glow. Feels like a memory you can hang on a wall.",
    price: 88000,
    category: "original-paintings",
    images: [
      "/images/work-lavender-haze.jpg",
      "/images/work-lavender-haze-detail.jpg",
      "/images/work-lavender-haze-alt.jpg",
    ],
    dimensions: '20 × 30 in (51 × 76 cm)',
    medium: "Acrylic & pastel on canvas",
    materials: ["Acrylic", "Soft pastel", "Workable fixative", "Cotton canvas"],
    availability: "available",
    maxQuantity: 1,
    featured: false,
    isNew: true,
    createdAt: "2026-10-04",
    accent: "#DCD6F7",
  },
  {
    id: "w07",
    slug: "midnight-bloom",
    title: "Midnight Bloom",
    tagline: "flowers that grow after dark",
    description:
      "Dark ground, electric petals. A night-garden original where deep charcoal meets blush and sage highlights — bold from across the room, detailed up close.",
    price: 110000,
    category: "original-paintings",
    images: [
      "/images/work-midnight-bloom.jpg",
      "/images/work-midnight-bloom-detail.jpg",
      "/images/work-midnight-bloom-alt.jpg",
    ],
    dimensions: '24 × 30 in (61 × 76 cm)',
    medium: "Acrylic on canvas",
    materials: ["Artist-grade acrylic", "Gloss medium", "Sealed cotton canvas"],
    availability: "available",
    maxQuantity: 1,
    featured: false,
    createdAt: "2026-09-09",
    accent: "#252525",
  },

  /* ── ART PRINTS ───────────────────────────────────────── */

  {
    id: "w08",
    slug: "sunday-lilacs",
    title: "Sunday Lilacs",
    tagline: "a limited run of 50",
    description:
      "A giclée edition of one of the studio's most-loved originals, printed on weighty archival cotton paper. Each print is signed, numbered and stamped by hand.",
    price: 6500,
    category: "art-prints",
    images: [
      "/images/work-sunday-lilacs.jpg",
      "/images/work-sunday-lilacs-detail.jpg",
      "/images/work-sunday-lilacs-alt.jpg",
    ],
    dimensions: 'A3 (29.7 × 42 cm)',
    medium: "Giclée print on 310gsm cotton rag",
    materials: ["Archival pigment inks", "310gsm cotton rag paper", "Signed & numbered"],
    availability: "available",
    maxQuantity: 10,
    featured: true,
    editionSize: 50,
    createdAt: "2026-09-01",
    accent: "#E8B4B8",
  },
  {
    id: "w09",
    slug: "tide-pool",
    title: "Tide Pool",
    tagline: "sea glass colours",
    description:
      "Sage, salt and shallow-water blues in a calm abstract edition. Printed small enough to gift, beautiful enough to frame alone.",
    price: 4800,
    category: "art-prints",
    images: [
      "/images/work-tide-pool.jpg",
      "/images/work-tide-pool-detail.jpg",
      "/images/work-tide-pool-alt.jpg",
    ],
    dimensions: 'A4 (21 × 29.7 cm)',
    medium: "Giclée print on 310gsm cotton rag",
    materials: ["Archival pigment inks", "310gsm cotton rag paper"],
    availability: "available",
    maxQuantity: 10,
    featured: false,
    createdAt: "2026-08-10",
    accent: "#A8B5A2",
  },
  {
    id: "w10",
    slug: "confetti-sky",
    title: "Confetti Sky",
    tagline: "joy, on paper",
    description:
      "A happy accident turned favourite — flecks of colour scattered across warm ivory like celebration confetti. A guaranteed mood-lifter for any wall.",
    price: 5500,
    category: "art-prints",
    images: [
      "/images/work-confetti-sky.jpg",
      "/images/work-confetti-sky-detail.jpg",
      "/images/work-confetti-sky-alt.jpg",
    ],
    dimensions: 'A3 (29.7 × 42 cm)',
    medium: "Giclée print on 310gsm cotton rag",
    materials: ["Archival pigment inks", "310gsm cotton rag paper"],
    availability: "available",
    maxQuantity: 10,
    featured: false,
    isNew: true,
    createdAt: "2026-10-11",
    accent: "#DCD6F7",
  },
  {
    id: "w11",
    slug: "soft-static",
    title: "Soft Static",
    tagline: "texture for quiet walls",
    description:
      "A textured neutral edition with just enough blush breaking through. The kind of piece that makes a room feel finished without asking for attention.",
    price: 7200,
    category: "art-prints",
    images: [
      "/images/work-soft-static.jpg",
      "/images/work-soft-static-detail.jpg",
      "/images/work-soft-static-alt.jpg",
    ],
    dimensions: 'A3 (29.7 × 42 cm)',
    medium: "Giclée print on 310gsm cotton rag",
    materials: ["Archival pigment inks", "310gsm cotton rag paper", "Signed edition"],
    availability: "available",
    maxQuantity: 10,
    featured: false,
    isNew: true,
    editionSize: 75,
    createdAt: "2026-10-08",
    accent: "#F3EFE9",
  },

  /* ── SKETCHES & DRAWINGS ──────────────────────────────── */

  {
    id: "w12",
    slug: "watercolour-notes",
    title: "Watercolour Notes",
    tagline: "loose, quick, honest",
    description:
      "A loose watercolour study full of soft edges and honest brush marks — the kind of drawing that keeps the freshness of the first five minutes.",
    price: 18000,
    category: "sketches-drawings",
    images: [
      "/images/work-watercolour-notes.jpg",
      "/images/work-watercolour-notes-detail.jpg",
      "/images/work-watercolour-notes-alt.jpg",
    ],
    dimensions: '11 × 14 in (28 × 36 cm)',
    medium: "Watercolour on cold-pressed paper",
    materials: ["Artist-grade watercolour", "300gsm cold-pressed cotton paper"],
    availability: "available",
    maxQuantity: 1,
    featured: false,
    createdAt: "2026-07-19",
    accent: "#A8B5A2",
  },
  {
    id: "w13",
    slug: "daydream-no-4",
    title: "Daydream No. 4",
    tagline: "from the sketchbook",
    description:
      "Part of an ongoing series of graphite daydreams — abstract faces, soft hands and shapes that only make sense together.",
    price: 22000,
    category: "sketches-drawings",
    images: [
      "/images/work-daydream.jpg",
      "/images/work-daydream-detail.jpg",
      "/images/work-daydream-alt.jpg",
    ],
    dimensions: '12 × 16 in (30 × 41 cm)',
    medium: "Graphite & charcoal on paper",
    materials: ["Graphite", "Compressed charcoal", "Fixative", "160gsm sketch paper"],
    availability: "sold",
    maxQuantity: 1,
    featured: false,
    createdAt: "2026-03-27",
    accent: "#77716D",
  },
  {
    id: "w14",
    slug: "graphite-studies",
    title: "Graphite Studies",
    tagline: "two pages, framed together",
    description:
      "Two facing sketchbook pages of quiet graphite studies, sold as a pair and ready to frame. An intimate look at how every piece begins.",
    price: 14000,
    category: "sketches-drawings",
    images: [
      "/images/work-graphite-notes.jpg",
      "/images/work-graphite-notes-detail.jpg",
      "/images/work-graphite-notes-alt.jpg",
    ],
    dimensions: '8.3 × 11.7 in each (A4)',
    medium: "Graphite on sketchbook paper",
    materials: ["Graphite pencil", "Kneaded eraser", "A4 sketchbook paper"],
    availability: "available",
    maxQuantity: 1,
    featured: false,
    createdAt: "2026-06-30",
    accent: "#EAE5DF",
  },

  /* ── MINI ARTWORKS ────────────────────────────────────── */

  {
    id: "w15",
    slug: "paper-hearts",
    title: "Paper Hearts",
    tagline: "tiny but full of feeling",
    description:
      "A palm-sized original gouache painting on thick paper — one of a kind, signed on the back, and sweet enough to gift to someone you love (including you).",
    price: 9500,
    category: "mini-artworks",
    images: [
      "/images/work-paper-hearts.jpg",
      "/images/work-paper-hearts-detail.jpg",
      "/images/work-paper-hearts-alt.jpg",
    ],
    dimensions: '5 × 7 in (13 × 18 cm)',
    medium: "Gouache on 300gsm paper",
    materials: ["Artist gouache", "300gsm hot-pressed paper", "Sealed with matte spray"],
    availability: "available",
    maxQuantity: 1,
    featured: true,
    createdAt: "2026-09-20",
    accent: "#E8B4B8",
  },
  {
    id: "w16",
    slug: "peach-fuzz",
    title: "Peach Fuzz",
    tagline: "a little sunbeam",
    description:
      "Warm peach tones and fuzzy edges in a miniature original made for shelves, bedside tables and small sunny corners.",
    price: 7500,
    category: "mini-artworks",
    images: [
      "/images/work-peach-fuzz.jpg",
      "/images/work-peach-fuzz-detail.jpg",
      "/images/work-peach-fuzz-alt.jpg",
    ],
    dimensions: '4 × 6 in (10 × 15 cm)',
    medium: "Acrylic on panel",
    materials: ["Artist-grade acrylic", "Birch wood panel", "Gloss varnish"],
    availability: "available",
    maxQuantity: 1,
    featured: false,
    isNew: true,
    createdAt: "2026-10-14",
    accent: "#E8B4B8",
  },

  /* ── CUSTOM PORTRAITS ─────────────────────────────────── */

  {
    id: "w17",
    slug: "your-story-painted",
    title: "Your Story, Painted",
    tagline: "a portrait made for you",
    description:
      "A hand-painted portrait commission — of you, your person, your pet or the two of you together. Built from your reference photos with regular progress updates along the way. Enquire for current lead times.",
    price: 35000,
    priceFrom: true,
    category: "custom-portraits",
    images: [
      "/images/portrait-2.jpg",
      "/images/portrait-2-detail.jpg",
      "/images/portrait-2-alt.jpg",
    ],
    dimensions: "Custom — from 12 × 16 in",
    medium: "Acrylic on canvas",
    materials: ["Artist-grade acrylic", "Stretched canvas", "Protective varnish", "Certificate of authenticity"],
    availability: "made-to-order",
    maxQuantity: 5,
    featured: false,
    createdAt: "2026-01-15",
    story:
      "Every commission starts with your reference photos and a short conversation about the feeling you want the piece to hold.",
    accent: "#DCD6F7",
  },
];

/* ── Helpers ──────────────────────────────────────────────── */

export function getArtworkBySlug(slug: string): Artwork | undefined {
  return artworks.find((a) => a.slug === slug);
}

export function getFeaturedArtworks(limit = 8): Artwork[] {
  return artworks.filter((a) => a.featured).slice(0, limit);
}

export function getRelatedArtworks(artwork: Artwork, limit = 4, list?: Artwork[]): Artwork[] {
  const base = list ?? artworks;
  const sameCategory = base.filter(
    (a) => a.slug !== artwork.slug && a.category === artwork.category,
  );
  const others = base.filter(
    (a) => a.slug !== artwork.slug && a.category !== artwork.category,
  );
  return [...sameCategory, ...others].slice(0, limit);
}

export function isInStock(artwork: Artwork): boolean {
  return artwork.availability !== "sold";
}

export function getBadge(artwork: Artwork): Badge | null {
  if (artwork.availability === "sold") return "sold-out";
  if (artwork.isNew) return "new";
  if (artwork.editionSize) return "limited-edition";
  if (artwork.category === "original-paintings") return "original";
  if (artwork.availability === "made-to-order") return "limited-edition";
  return null;
}

export const badgeLabel: Record<Badge, string> = {
  original: "Original",
  "limited-edition": "Limited Edition",
  "sold-out": "Sold Out",
  new: "New",
};
