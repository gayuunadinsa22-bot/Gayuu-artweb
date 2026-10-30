"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getFeaturedArtworks, type Artwork } from "@/lib/artworks";
import { ProductCard } from "@/components/product/product-card";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";

export function FeaturedWorks({
  artworks,
}: {
  /** Full catalog from the data layer; falls back to local content. */
  artworks?: Artwork[];
}) {
  const works = (artworks ?? getFeaturedArtworks(6))
    .filter((a) => a.featured)
    .slice(0, 6);

  if (works.length === 0) return null;

  return (
    <section className="px-5 py-20 md:px-10 md:py-28">
      <div className="mx-auto max-w-[1440px]">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <SectionHeading
            kicker="Featured works"
            title={
              <>
                Little pieces of <span className="italic text-blush-deep">my world.</span>
              </>
            }
            subtitle="A curated collection of art, made with heart."
          />
          <Reveal delay={0.15} className="hidden md:block">
            <Button variant="outline" asChild>
              <Link href="/shop">
                View all artworks
                <ArrowUpRight className="size-4" strokeWidth={1.5} />
              </Link>
            </Button>
          </Reveal>
        </div>

        {/* Editorial staggered grid */}
        <div className="mt-14 grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {works.map((artwork, index) => (
            <div
              key={artwork.id}
              className={
                index % 3 === 1 ? "lg:mt-16" : index % 3 === 2 ? "lg:mt-8" : ""
              }
            >
              <ProductCard artwork={artwork} index={index} />
            </div>
          ))}
        </div>

        <Reveal className="mt-14 flex justify-center md:hidden">
          <Button variant="outline" asChild>
            <Link href="/shop">
              View all artworks
              <ArrowUpRight className="size-4" strokeWidth={1.5} />
            </Link>
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
