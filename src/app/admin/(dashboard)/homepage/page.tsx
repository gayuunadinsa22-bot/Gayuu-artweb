
import { HomepageForm } from "@/components/admin/homepage-form";
import { PageHeader } from "@/components/admin/page-header";
import { requireAdmin } from "@/lib/admin/auth";
import { describeAdminError } from "@/lib/admin/errors";

export default async function HomepagePage() {
  const { supabase } = await requireAdmin();

  // `*` keeps this page working even before the image-column migration has
  // been applied (missing fields simply stay undefined).
  const [
    { data: homepageData, error },
    { data: featuredArtworks, error: artworksError },
  ] = await Promise.all([
    supabase.from("homepage_sections").select("*"),
    supabase.from("artworks").select("*").eq("featured", true),
  ]);

  if (error) {
    console.error(`[admin/homepage] Failed to load homepage: ${error.message}`);
  }

  const sections = (homepageData || []).reduce<Record<string, Record<string, string>>>((acc, s) => {
    acc[s.section_key] = (s.content as Record<string, string>) || {};
    return acc;
  }, {});

  const heroSectionRow = (homepageData || []).find((row) => row.section_key === "hero");
  const heroContent = sections.hero ?? {};
  const images = {
    hero_image_url:
      heroSectionRow?.hero_image_url ?? (heroContent.heroImageUrl || null),
    hero_floating_image_url:
      heroSectionRow?.hero_floating_image_url ??
      (heroContent.heroFloatingImageUrl || null),
    artist_intro_image_url:
      heroSectionRow?.artist_intro_image_url ??
      (heroContent.artistIntroImageUrl || null),
  };

  if (artworksError) {
    console.error(
      `[admin/homepage] Failed to load featured artworks: ${artworksError.message}`,
    );
  }

  return (
    <div className="space-y-7">
      <PageHeader
        title="Homepage Management"
        description="Edit homepage copy and images without changing the layout."
      />
      {error ? (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          Homepage content could not be loaded from the database.{" "}
          {describeAdminError(error)} You can still edit and save once the database is
          available.
        </div>
      ) : null}
      <HomepageForm
        sections={sections}
        featuredArtworks={featuredArtworks || []}
        images={images}
      />
    </div>
  );
}
