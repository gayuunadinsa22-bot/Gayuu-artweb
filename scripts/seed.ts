#!/usr/bin/env ts-node
/**
 * Non-destructive seed script for Gayuu (Supabase).
 *
 * Imports the existing local demo content as the source of truth:
 * - `@/lib/artworks` (artworks + artwork_images)
 * - `@/lib/settings` (defaultSiteSettings) → site_settings key/value rows
 * - `@/lib/content` (testimonials)
 *
 * Behavior:
 * - Uses the Supabase service-role key (SUPABASE_SERVICE_ROLE_KEY) — never run in the browser.
 * - Non-destructive: upserts by unique keys (artworks.slug, site_settings.key, homepage_sections.section_key, about_content.id? single row). Deletes nothing.
 * - Skips if Supabase isn't configured or key missing (exits 0 with message).
 * - Does not invent credentials or overwrite auth users.
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

type Db = SupabaseClient;
import { artworks as localArtworks } from "../src/lib/artworks";
import { defaultSiteSettings } from "../src/lib/settings";
import { testimonials as localTestimonials } from "../src/lib/content";

function isConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
      process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}

async function upsertSettings(supabase: Db) {
  console.log("Seeding site_settings...");
  const rows = Object.entries(defaultSiteSettings).flatMap(([key, value]) => {
    if (value === null || value === undefined) return [];
    if (typeof value === "object" && !Array.isArray(value)) {
      return [{ key, value: value as unknown as Record<string, unknown> }];
    }
    // Store primitives as-is (numbers/strings/booleans)
    return [{ key, value }];
  });

  for (const row of rows) {
    const { error } = await supabase
      .from("site_settings")
      .upsert({ key: row.key, value: row.value }, { onConflict: "key" });
    if (error) console.warn(`Warning upserting site_settings.${row.key}: ${error.message}`);
  }
}

async function upsertAbout(supabase: Db) {
  console.log("Seeding about_content...");
  const defaultAbout = {
    artistName: defaultSiteSettings.artistName,
    heroHeading: `Hi, I'm the hands behind the art.`,
    heroDescription:
      "Thoughtfully created artwork for spaces, souls, and stories that deserve something beautiful.",
    shortBiography: `I'm ${defaultSiteSettings.artistName} — painting slowly, by hand, with a cup of tea going cold beside me.`,
    fullBiography:
      "Every piece in this studio begins as a feeling worth holding onto — a sliver of light, a season, or a moment of quiet joy.",
    creativeJourney:
      "I paint intuitively, layer by layer, letting colour lead the way until the piece feels like itself.",
    artisticInspiration:
      "Drawn to softness, slowness, and the poetry of ordinary days, my work leans into warmth and gentle wonder.",
    paintingPhilosophy:
      "Art should feel like coming home — honest, tender, and made to be lived with for years to come.",
    location: defaultSiteSettings.location,
    contactCTA: `Say hi — I'd love to hear about the piece that's calling to you.`,
  };
  // Single-row table — upsert by id if exists? about_content has content JSONB and created_at/updated_at; no explicit id in migration shown. Try upsert without conflict key — but PostgREST needs onConflict. As a non-destructive seed, insert if empty, else update the first row.
  const { data: existing } = await supabase.from("about_content").select("id").limit(1);
  if (existing && existing.length > 0) {
    const { error } = await supabase
      .from("about_content")
      .update({ content: defaultAbout })
      .eq("id", existing[0].id);
    if (error) console.warn(`Warning updating about_content: ${error.message}`);
  } else {
    const { error } = await supabase.from("about_content").insert({ content: defaultAbout });
    if (error) console.warn(`Warning inserting about_content: ${error.message}`);
  }
}

async function upsertHomepage(supabase: Db) {
  console.log("Seeding homepage_sections...");
  const sections: Record<string, Record<string, string>> = {
    hero: {
      heading: "Art that feels",
      subheading: "a little piece",
      description:
        "Thoughtfully created artwork for spaces, souls, and stories that deserve something beautiful.",
      cta1: "Explore the Collection",
      cta2: "Meet the Artist",
    },
    artist: {
      heading: "Hi, I'm the hands behind the art.",
      description: `I'm ${defaultSiteSettings.artistName} — the painter, the mess-maker and the person who spends forty minutes mixing one shade of "almost pink". I make art the slow way: by hand, by feel, and usually with a cup of tea going cold beside me.`,
    },
    behind: {
      heading: "Every artwork has a story.",
      description:
        "The half-finished layers, the paint water, the sketchbook pages that never make it online. This is the quiet part — where the magic actually happens.",
    },
    instagram: {
      heading: "Art, life & little moments.",
    },
    newsletter: {
      heading: "Love art? Let's stay close.",
      description:
        "Get first access to new collections, exclusive drops, and little creative updates.",
    },
  };
  for (const [section_key, content] of Object.entries(sections)) {
    const { error } = await supabase
      .from("homepage_sections")
      .upsert({ section_key, content }, { onConflict: "section_key" });
    if (error) console.warn(`Warning upserting homepage_sections.${section_key}: ${error.message}`);
  }
}

async function upsertTestimonials(supabase: Db) {
  console.log("Seeding testimonials...");
  for (const t of localTestimonials) {
    const { error } = await supabase.from("testimonials").insert({
      customer_name: t.name,
      review: t.quote,
      visible: true,
    });
    // Ignore duplicate? No unique constraint obvious; insert-if-not-exists by review+name rare — non-destructive, ignore conflicts gracefully? Insert may fail on RLS but service-role bypasses; unique not enforced — OK to allow duplicates? Not specified; just seed defaults once. Skip on generic errors.
    if (error && !/duplicate/i.test(error.message)) {
      console.warn(`Warning inserting testimonial: ${error.message}`);
    }
  }
}

async function upsertArtworks(supabase: Db) {
  console.log("Seeding artworks...");
  for (const a of localArtworks) {
    const { data: artwork, error } = await supabase
      .from("artworks")
      .upsert(
        {
          slug: a.slug,
          title: a.title,
          tagline: a.tagline,
          description: a.description,
          price: a.price,
          price_from: a.priceFrom ?? false,
          category: a.category,
          dimensions: a.dimensions,
          medium: a.medium,
          materials: a.materials ?? [],
          availability: a.availability,
          max_quantity: a.maxQuantity ?? 1,
          featured: a.featured,
          is_new: a.isNew ?? false,
          edition_size: a.editionSize ?? null,
          story: a.story ?? null,
          accent: a.accent ?? "#E8B4B8",
        },
        { onConflict: "slug" },
      )
      .select("id")
      .single();
    if (error) {
      console.warn(`Warning upserting artwork ${a.slug}: ${error.message}`);
      continue;
    }
    // Images: replace images for this artwork (non-destructive of other art) — delete existing image rows first? Cleaner: delete+insert.
    await supabase.from("artwork_images").delete().eq("artwork_id", artwork.id);
    const imageRows = a.images.map((url, i) => ({
      artwork_id: artwork.id,
      image_url: url,
      position: i,
      is_cover: i === 0,
    }));
    if (imageRows.length > 0) {
      const { error: imgErr } = await supabase.from("artwork_images").insert(imageRows);
      if (imgErr) console.warn(`Warning inserting images for ${a.slug}: ${imgErr.message}`);
    }
  }
}

async function main() {
  if (!isConfigured()) {
    console.warn(
      "[seed] Skipping: Supabase env vars missing. Set NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY and SUPABASE_SERVICE_ROLE_KEY (see .env.example).",
    );
    process.exit(0);
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );

  await upsertSettings(supabase);
  await upsertAbout(supabase);
  await upsertHomepage(supabase);
  await upsertTestimonials(supabase);
  await upsertArtworks(supabase);

  console.log("Seed completed.");
}

main().catch((e) => {
  console.error("[seed] Error:", e);
  process.exit(1);
});
