
import { GalleryForm } from "@/components/admin/gallery-form";
import { PageHeader } from "@/components/admin/page-header";
import { requireAdmin } from "@/lib/admin/auth";

export default async function GalleryPage() {
  const { supabase } = await requireAdmin();
  const { data: galleryItems } = await supabase
    .from("gallery_items")
    .select("id, image_url, position, title, description, artwork_id")
    .order("position", { ascending: true });

  return (
    <div className="space-y-7">
      <PageHeader
        title="Gallery Management"
        description="Curate the gallery grid shown on the public site."
      />
      <GalleryForm galleryItems={galleryItems || []} />
    </div>
  );
}