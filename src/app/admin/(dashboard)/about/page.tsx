
import { requireAdmin } from "@/lib/admin/auth";
import { describeAdminError } from "@/lib/admin/errors";
import { AboutForm } from "@/components/admin/about-form";
import { PageHeader } from "@/components/admin/page-header";

function toContent(value: unknown): Record<string, string> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const result: Record<string, string> = {};
  for (const [key, entry] of Object.entries(value)) {
    if (typeof entry === "string") result[key] = entry;
    else if (entry !== null && entry !== undefined) result[key] = String(entry);
  }
  return result;
}

export default async function AboutPage() {
  const { supabase } = await requireAdmin();

  // `maybeSingle()` errors when several rows exist, so cap the query at one
  // row. A missing row is expected on a fresh database and must not crash.
  // Try to fetch with image columns; fall back gracefully if they don't exist yet
  let aboutData: any = null;
  let error: any = null;

  const res1 = await supabase
    .from("about_content")
    .select("*")
    .order("updated_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (res1.error) {
    error = res1.error;
  } else {
    aboutData = res1.data;
  }

  if (error) {
    console.error(`[admin/about] Failed to load about content: ${error.message}`);
  }

  const content = toContent(aboutData?.content);
  const images = {
    heroImageUrl:
      aboutData?.heroImageUrl ??
      aboutData?.hero_image_url ??
      (content.heroImageUrl || content.hero_image_url || null),
    portraitImageUrl:
      aboutData?.portraitImageUrl ??
      aboutData?.portrait_image_url ??
      (content.portraitImageUrl || content.portrait_image_url || null),
    studioImage1Url:
      aboutData?.studioImage1Url ??
      aboutData?.studio_image1_url ??
      (content.studioImage1Url || content.studio_image1_url || null),
    studioImage2Url:
      aboutData?.studioImage2Url ??
      aboutData?.studio_image2_url ??
      (content.studioImage2Url || content.studio_image2_url || null),
    studioImage3Url:
      aboutData?.studioImage3Url ??
      aboutData?.studio_image3_url ??
      (content.studioImage3Url || content.studio_image3_url || null),
  };

  return (
    <div className="space-y-7">
      <PageHeader
        title="About Page Management"
        description="Edit the artist story, biography, images and contact call-to-action."
      />
      {error ? (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          About content could not be loaded from the database.{" "}
          {describeAdminError(error)} You can still edit the form below and save once
          the database is available.
        </div>
      ) : null}
      <AboutForm
        rowId={aboutData?.id ?? null}
        content={toContent(aboutData?.content)}
        images={images}
      />
    </div>
  );
}
