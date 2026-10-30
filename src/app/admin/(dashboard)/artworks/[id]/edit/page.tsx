
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin/auth";
import { ArtworkForm } from "@/components/admin/artwork-form";
import { PageHeader } from "@/components/admin/page-header";

export default async function EditArtworkPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase } = await requireAdmin();

  const { data: artwork } = await supabase
    .from("artworks")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!artwork) {
    notFound();
  }

  const { data: artworkImages } = await supabase
    .from("artwork_images")
    .select("*")
    .eq("artwork_id", id)
    .order("position", { ascending: true });

  return (
    <div className="space-y-7">
      <PageHeader
        title="Edit Artwork"
        description={`Update “${artwork.title}”.`}
      />
      <ArtworkForm artwork={artwork} artworkImages={artworkImages || []} />
    </div>
  );
}