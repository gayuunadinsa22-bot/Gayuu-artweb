import type { Metadata } from "next";
import { Suspense } from "react";
import { ShopExplorer } from "@/components/shop/shop-explorer";
import { getArtworks } from "@/lib/data/storefront";

export const metadata: Metadata = {
  title: "Shop Original Art, Prints & Commissions",
  description:
    "Browse original paintings, signed art prints, sketchbook works, mini artworks and custom portrait commissions — handmade in Sri Lanka.",
};

export default async function ShopPage() {
  const artworks = await getArtworks();
  return (
    <Suspense fallback={<div className="h-[60vh]" aria-hidden />}>
      <ShopExplorer artworks={artworks} />
    </Suspense>
  );
}
