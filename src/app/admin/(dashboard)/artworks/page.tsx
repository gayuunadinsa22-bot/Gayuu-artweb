import Link from "next/link";
import { Plus, Pencil, Eye, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { requireAdmin } from "@/lib/admin/auth";
import { formatCurrency } from "@/lib/utils";
import { DeleteArtworkButton } from "@/components/admin/delete-artwork-button";
import { PageHeader } from "@/components/admin/page-header";

interface ArtworkImageRow {
  id: string;
  image_url: string;
  position: number;
  is_cover: boolean;
}

interface ArtworkListRow {
  id: string;
  slug: string;
  title: string;
  price: number | string;
  availability: string | null;
  images?: ArtworkImageRow[];
}

function availabilityVariant(availability: string | null) {
  if (availability === "sold") return "danger" as const;
  if (availability === "made-to-order") return "warning" as const;
  return "success" as const;
}

function availabilityLabel(availability: string | null) {
  if (availability === "made-to-order") return "Made to order";
  return availability ?? "Available";
}

export default async function ArtworksPage() {
  const { supabase } = await requireAdmin();
  const { data: artworks } = await supabase
    .from("artworks")
    .select("id, slug, title, price, availability, category, images:artwork_images(id, image_url, position, is_cover)")
    .order("created_at", { ascending: false });

  const rows: ArtworkListRow[] = (artworks ?? []) as unknown as ArtworkListRow[];

  return (
    <div className="space-y-7">
      <PageHeader
        title="Artworks"
        description="Manage every painting, print and commission in your collection."
        actions={
          <Button asChild>
            <Link href="/admin/artworks/new" prefetch={true}>
              <Plus className="size-4" strokeWidth={1.75} />
              Add New Painting
            </Link>
          </Button>
        }
      />

      {rows.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
            <span className="grid size-12 place-items-center rounded-2xl bg-rose-soft text-[#b06975]">
              <Palette className="size-6" strokeWidth={1.4} />
            </span>
            <p className="font-serif text-2xl text-ink">No artworks yet</p>
            <p className="max-w-md text-sm text-muted">
              Add your first painting to sell it online, show it in the gallery
              and feature it on the homepage.
            </p>
            <Button asChild className="mt-2">
              <Link href="/admin/artworks/new">
                <Plus className="size-4" strokeWidth={1.75} />
                Add New Painting
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {rows.map((artwork) => {
            const cover =
              (artwork.images ?? []).find((img) => img.is_cover) ??
              (artwork.images ?? [])[0];
            const src: string | undefined = cover?.image_url ?? undefined;

            return (
              <Card key={artwork.id} className="overflow-hidden transition-shadow duration-300 hover:shadow-card">
                <div className="relative aspect-[4/3] bg-cream">
                  {src ? (
                    <Image
                      src={src}
                      alt={artwork.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-faint">
                      <Palette className="size-8" strokeWidth={1.25} />
                    </div>
                  )}
                  <div className="absolute right-3 top-3">
                    <Badge variant={availabilityVariant(artwork.availability)}>
                      {availabilityLabel(artwork.availability)}
                    </Badge>
                  </div>
                </div>
                <CardContent className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-serif text-lg text-ink">
                        {artwork.title}
                      </p>
                      <p className="text-sm tabular-nums text-muted">
                        {formatCurrency(Number(artwork.price))}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button asChild variant="subtle" size="sm" className="flex-1">
                      <Link href={`/admin/artworks/${artwork.id}/edit`} prefetch={true}>
                        <Pencil className="size-3.5" strokeWidth={1.6} />
                        Edit
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="flex-1 text-muted hover:text-ink"
                    >
                      <Link
                        href={`/shop/${artwork.slug}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Eye className="size-3.5" strokeWidth={1.6} />
                        View
                      </Link>
                    </Button>
                    <DeleteArtworkButton
                      id={artwork.id}
                      title={artwork.title}
                    />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
