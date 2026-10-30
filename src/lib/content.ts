/**
 * EDITORIAL CONTENT — categories, process story, testimonials, social.
 * All placeholder copy; edit freely to match the artist's voice.
 */

import type { CategorySlug } from "@/lib/artworks";
import { siteSettings } from "@/lib/settings";
import { getWhatsAppDisplay } from "@/lib/whatsapp";

export interface CategoryBlock {
  slug: CategorySlug;
  name: string;
  blurb: string;
  image: string;
  /** Editorial size in the asymmetric layout. */
  size: "tall" | "wide" | "standard";
}

export const categories: CategoryBlock[] = [
  {
    slug: "original-paintings",
    name: "Original Paintings",
    blurb: "One-of-one canvases, painted slowly and signed by hand.",
    image: "/images/work-velvet-dusk.jpg",
    size: "tall",
  },
  {
    slug: "sketches-drawings",
    name: "Sketches & Drawings",
    blurb: "Loose, honest lines straight from the sketchbook.",
    image: "/images/work-graphite-notes.jpg",
    size: "standard",
  },
  {
    slug: "custom-portraits",
    name: "Custom Portraits",
    blurb: "Your people, your pets — painted just for you.",
    image: "/images/portrait-2.jpg",
    size: "standard",
  },
  {
    slug: "art-prints",
    name: "Art Prints",
    blurb: "Signed archival prints of studio favourites.",
    image: "/images/work-sunday-lilacs.jpg",
    size: "wide",
  },
  {
    slug: "mini-artworks",
    name: "Mini Artworks",
    blurb: "Pocket-sized originals for small sunny corners.",
    image: "/images/work-paper-hearts.jpg",
    size: "standard",
  },
];

export interface ProcessMoment {
  image: string;
  caption: string;
  tag: string;
}

export const processMoments: ProcessMoment[] = [
  { image: "/images/studio-desk.jpg", caption: "Where every piece begins", tag: "The desk" },
  { image: "/images/studio-hands.jpg", caption: "First layers, always the scariest", tag: "Layer one" },
  { image: "/images/studio-palette.jpg", caption: "Mixing until the colour feels right", tag: "The palette" },
  { image: "/images/studio-brushes.jpg", caption: "Lived-in, paint-stained tools", tag: "The tools" },
  { image: "/images/studio-water.jpg", caption: "Rinsing between every wash", tag: "The ritual" },
  { image: "/images/studio-easel.jpg", caption: "Step back, squint, decide", tag: "The easel" },
];

export interface Testimonial {
  quote: string;
  name: string;
  location: string;
  work: string;
}

export const testimonials: Testimonial[] = [
  {
    quote:
      "It arrived wrapped like a gift and honestly looked even better in person. The colours change with the light all day — I keep finding new things in it.",
    name: "Nimasha P.",
    location: "Colombo",
    work: "Golden Hour",
  },
  {
    quote:
      "I commissioned a portrait of my dog and cried a little when I opened it. She captured exactly the little head tilt he does.",
    name: "Tharushi M.",
    location: "Kandy",
    work: "Custom portrait",
  },
  {
    quote:
      "The print quality is unreal — heavy paper, signed on the back, tiny handwritten note included. It feels personal, not mass produced.",
    name: "Sarah L.",
    location: "Melbourne",
    work: "Sunday Lilacs print",
  },
  {
    quote:
      "Bought a mini original for my sister's birthday and ended up keeping it. Ordering over WhatsApp was so easy and so human.",
    name: "Ravi S.",
    location: "Galle",
    work: "Paper Hearts",
  },
];

/** Titles for the brand ticker. */
export const tickerPhrases = [
  "handmade in small batches",
  "one of one",
  "painted with feeling",
  "signed & sealed",
  "made in the studio",
  "slow art, soft life",
];

/** Commissions page — how a custom piece comes to life. */
export interface ProcessStep {
  title: string;
  description: string;
}

export const processSteps: ProcessStep[] = [
  {
    title: "Tell me your idea",
    description:
      "Send a message with the subject, size, colours and the feeling you're after — reference photos are always welcome.",
  },
  {
    title: "Quote & timeline",
    description:
      "You'll get a clear price, a realistic completion date and a short summary of what's included before anything begins.",
  },
  {
    title: "Painted by hand",
    description:
      "The piece is painted in the studio with progress photos shared at key stages, so nothing about the direction is a surprise.",
  },
  {
    title: "Packed & delivered",
    description:
      "Once you're happy, the artwork is sealed, wrapped with care and shipped — or delivered by arrangement.",
  },
];

/** Contact page — ways to reach the studio (reads live settings). */
export interface ContactChannel {
  label: string;
  value: string;
  /** Pre-filled message / mailto target. Empty string = no link. */
  href: string;
  note: string;
}

/** Extracts an @handle from a social URL, with a graceful fallback. */
function handleFrom(url: string, fallback: string): string {
  try {
    const seg = new URL(url).pathname.split("/").filter(Boolean).pop();
    return seg ? `@${seg}` : fallback;
  } catch {
    return fallback;
  }
}

export function getContactChannels(): ContactChannel[] {
  return [
    {
      label: "WhatsApp",
      value: getWhatsAppDisplay(),
      href: "whatsapp",
      note: "Orders, commissions and quick questions.",
    },
    {
      label: "Email",
      value: siteSettings.contactEmail,
      href: `mailto:${siteSettings.contactEmail}`,
      note: "For longer messages, press or stockist enquiries.",
    },
    {
      label: "Instagram",
      value: handleFrom(siteSettings.social.instagram, "@gayuu.art"),
      href: siteSettings.social.instagram,
      note: "New work, studio days and works in progress.",
    },
    {
      label: "Studio",
      value: siteSettings.location,
      href: "",
      note: "Visits by appointment only.",
    },
  ];
}
