import type { Metadata } from "next";
import { GalleryExplorer } from "@/components/gallery/gallery-explorer";
import { getArtworks, getGalleryItems } from "@/lib/data/storefront";

export const metadata: Metadata = {
  title: "Gallery — Portfolio",
  description:
    "A digital exhibition of original paintings, prints, sketches and commissions — browse the full portfolio in a masonry gallery.",
};

export default async function GalleryPage() {
  const [artworks, extraItems] = await Promise.all([getArtworks(), getGalleryItems()]);
  return <GalleryExplorer artworks={artworks} extraItems={extraItems ?? undefined} />;
}
