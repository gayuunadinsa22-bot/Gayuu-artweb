"use client";

import * as React from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { artworks as localArtworks, type CategorySlug, type Artwork } from "@/lib/artworks";
import { categories } from "@/lib/content";
import { Lightbox, type LightboxImage } from "@/components/shared/lightbox";
import { Reveal } from "@/components/shared/reveal";
import { cn, formatPrice } from "@/lib/utils";
import type { GalleryItem } from "@/lib/data/storefront";

type Filter = "all" | CategorySlug;

const ratios = [
  "aspect-[4/5]",
  "aspect-[3/4]",
  "aspect-square",
  "aspect-[4/3]",
  "aspect-[2/3]",
  "aspect-[5/4]",
];

interface Piece extends LightboxImage {
  category: CategorySlug;
  title: string;
  price: number;
  ratio: string;
  slug: string;
}

export function GalleryExplorer({
  artworks: artworksProp,
  extraItems,
}: {
  artworks?: Artwork[];
  extraItems?: GalleryItem[];
} = {}) {
  const artworks = artworksProp ?? localArtworks;
  /** Build a curated wall: first + detail view of every piece. */
  const allPiecesBase: Piece[] = artworks.flatMap((artwork, artworkIndex) =>
    artwork.images.slice(0, 2).map((src, imageIndex) => ({
      src,
      alt: `${artwork.title} — ${imageIndex === 0 ? "full view" : "detail"}`,
      category: artwork.category,
      title: artwork.title,
      price: artwork.price,
      slug: artwork.slug,
      ratio: ratios[(artworkIndex + imageIndex * 3) % ratios.length],
    })),
  );

  const extraPieces: Piece[] = (extraItems ?? []).map((item, idx) => ({
    src: item.image_url,
    alt: item.title || "Gallery item",
    category: "original-paintings" as CategorySlug,
    title: item.title || "Untitled",
    price: 0,
    slug: item.artwork_id || `extra-${idx}`,
    ratio: ratios[(idx + allPiecesBase.length * 3) % ratios.length],
  }));

  const [filter, setFilter] = React.useState<Filter>("all");
  const [index, setIndex] = React.useState<number | null>(null);

  const pieces = React.useMemo(() => {
    const allPieces = [...extraPieces, ...allPiecesBase];
    return filter === "all" ? allPieces : allPieces.filter((piece) => piece.category === filter);
  }, [extraPieces, allPiecesBase, filter]);

  // Close the lightbox when the filter changes — render-time adjustment.
  const [prevFilter, setPrevFilter] = React.useState(filter);
  if (prevFilter !== filter) {
    setPrevFilter(filter);
    if (index !== null) setIndex(null);
  }

  const lightboxImages: LightboxImage[] = pieces;

  const pill =
    "shrink-0 rounded-full border px-4 py-2 text-[13px] tracking-wide transition-all duration-300 cursor-pointer";

  return (
    <div className="px-5 pb-24 pt-28 md:px-10 md:pt-36">
      <div className="mx-auto max-w-[1440px]">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <Reveal className="max-w-3xl">
            <p className="eyebrow mb-5 flex items-center gap-3">
              <span aria-hidden className="h-px w-10 bg-blush" />
              the gallery
            </p>
            <h1 className="font-serif text-6xl leading-[0.98] tracking-[-0.02em] sm:text-7xl md:text-8xl">
              A little <span className="italic text-blush-deep">exhibition,</span>
              <br className="hidden sm:block" /> just for you.
            </h1>
          </Reveal>
          <Reveal delay={0.15} className="max-w-[280px]">
            <p className="text-sm leading-relaxed text-muted">
              Wander slowly. Click any piece to see it full screen — use ← → to move
              through the wall.
            </p>
            <p className="font-hand mt-2 text-lg text-ink">take your time ♡</p>
          </Reveal>
        </div>

        {/* Filters */}
        <Reveal delay={0.1} className="mt-10 border-b border-line pb-5">
          <div className="no-scrollbar -mx-5 flex gap-2.5 overflow-x-auto px-5 pb-1 md:mx-0 md:flex-wrap md:px-0">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={cn(
                pill,
                filter === "all"
                  ? "border-ink bg-ink text-ivory"
                  : "border-line bg-ivory text-muted hover:border-ink hover:text-ink",
              )}
            >
              Everything
            </button>
            {categories.map((category) => (
              <button
                key={category.slug}
                type="button"
                onClick={() => setFilter(category.slug)}
                className={cn(
                  pill,
                  filter === category.slug
                    ? "border-ink bg-ink text-ivory"
                    : "border-line bg-ivory text-muted hover:border-ink hover:text-ink",
                )}
              >
                {category.name}
              </button>
            ))}
            <span className="ml-auto hidden self-center text-xs tracking-wide text-muted md:block">
              {pieces.length} pieces on the wall
            </span>
          </div>
        </Reveal>

        {/* Masonry wall */}
        <div className="mt-10 columns-2 gap-4 md:columns-3 md:gap-5 xl:columns-4">
          <AnimatePresence mode="popLayout">
            {pieces.map((piece, pieceIndex) => (
              <motion.button
                key={`${piece.src}-${piece.slug}`}
                type="button"
                layout
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{
                  duration: 0.55,
                  delay: Math.min((pieceIndex % 8) * 0.04, 0.3),
                  ease: [0.22, 1, 0.36, 1],
                }}
                onClick={() => setIndex(pieceIndex)}
                className="group relative mb-4 block w-full break-inside-avoid overflow-hidden bg-cream text-left md:mb-5"
                aria-label={`Open ${piece.title} full screen`}
              >
                <div className={cn("relative w-full", piece.ratio)}>
                  <Image
                    src={piece.src}
                    alt={piece.alt}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
                    className="object-cover transition-transform duration-[1.3s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
                  />
                </div>

                {/* Caption on hover / always on touch */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/75 via-ink/25 to-transparent p-4 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  <p className="font-serif text-xl leading-tight text-ivory">
                    {piece.title}
                  </p>
                  <p className="text-xs tracking-wide text-ivory/75">
                    {formatPrice(piece.price)}
                  </p>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>

        {pieces.length === 0 ? (
          <div className="py-24 text-center">
            <p className="font-serif text-3xl">Nothing in this room yet</p>
            <button
              type="button"
              onClick={() => setFilter("all")}
              className="mt-4 text-sm underline underline-offset-4 text-muted hover:text-ink"
            >
              Show everything
            </button>
          </div>
        ) : null}
      </div>

      {index !== null && pieces[index] ? (
        <Lightbox
          images={lightboxImages}
          index={index}
          onIndexChange={setIndex}
          onClose={() => setIndex(null)}
        />
      ) : null}
    </div>
  );
}
