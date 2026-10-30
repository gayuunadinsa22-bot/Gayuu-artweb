
import { ArtworkForm } from "@/components/admin/artwork-form";
import { PageHeader } from "@/components/admin/page-header";

export default function NewArtworkPage() {
  return (
    <div className="space-y-7">
      <PageHeader
        title="Add New Painting"
        description="Create a new artwork entry for the shop."
      />
      <ArtworkForm />
    </div>
  );
}