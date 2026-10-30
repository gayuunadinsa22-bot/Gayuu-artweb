"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { Artwork, CategorySlug } from "@/lib/artworks";
import { getBadge, badgeLabel, isInStock } from "@/lib/artworks";
import { categories } from "@/lib/content";
import { ArtImage } from "@/components/shared/art-image";
import { WishlistButton } from "@/components/product/wishlist-button";
import { AddToCartButton } from "@/components/product/add-to-cart-button";
import { Badge } from "@/components/ui/badge";
import { formatPrice, cn } from "@/lib/utils";

const badgeVariant: Record<string, "default" | "blush" | "sage" | "lavender" | "outline" | "muted"> = {
  original: "default",
  "limited-edition": "lavender",
  "sold-out": "muted",
  new: "blush",
};

export function categoryName(slug: CategorySlug): string {
  return categories.find((c) => c.slug === slug)?.name ?? slug;
}

export function ProductCard({
  artwork,
  index = 0,
  className,
}: {
  artwork: Artwork;
  index?: number;
  className?: string;
}) {
  const badge = getBadge(artwork);
  const inStock = isInStock(artwork);
  const available = artwork.availability;

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.75, delay: (index % 4) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className={cn("group flex flex-col", className)}
    >
      <div className="relative">
        <Link href={`/shop/${artwork.slug}`} className="relative block">
          <ArtImage
            src={artwork.images[0]}
            alt={`${artwork.title} — ${artwork.tagline}`}
            ratio="aspect-[4/5]"
            sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 26vw"
            className="transition-transform duration-[1.4s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
            frameClassName="!bg-cream"
          />
          {badge ? (
            <Badge
              variant={badgeVariant[badge] ?? "outline"}
              className={cn(
                "absolute left-3 top-3 z-10",
                badge === "sold-out" && "bg-ink/80 text-ivory backdrop-blur",
              )}
            >
              {badgeLabel[badge]}
            </Badge>
          ) : null}
        </Link>

        {/* Wishlist — sibling of the link so the markup stays valid */}
        <WishlistButton artworkId={artwork.id} className="absolute right-3 top-3 z-10" />

        {/* Quick add — desktop hover affordance */}
        {inStock ? (
          <div className="pointer-events-none absolute inset-x-3 bottom-3 hidden translate-y-[140%] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:pointer-events-auto group-hover:translate-y-0 group-focus-within:pointer-events-auto group-focus-within:translate-y-0 md:block">
            <AddToCartButton
              artwork={artwork}
              size="sm"
              variant="default"
              className="w-full shadow-card"
            />
          </div>
        ) : null}
      </div>

      {/* Meta */}
      <div className="mt-4 flex flex-1 flex-col gap-1.5">
        <div className="flex items-center justify-between gap-3">
          <p className="eyebrow text-[10px]">{categoryName(artwork.category)}</p>
          <p className="flex items-center gap-1.5 text-[11px] tracking-wide text-muted">
            <span
              aria-hidden
              className={cn(
                "size-1.5 rounded-full",
                available === "available" && "bg-sage",
                available === "made-to-order" && "bg-lavender",
                available === "sold" && "bg-line",
              )}
            />
            {available === "available"
              ? "Available"
              : available === "made-to-order"
                ? "Made to order"
                : "Sold"}
          </p>
        </div>

        <Link href={`/shop/${artwork.slug}`} className="group/title flex items-start justify-between gap-3">
          <h3 className="font-serif text-xl leading-tight text-ink transition-colors group-hover/title:text-blush-deep md:text-2xl">
            {artwork.title}
          </h3>
          <span className="mt-1 flex shrink-0 items-center gap-1 whitespace-nowrap font-sans text-sm text-ink">
            {artwork.priceFrom ? <span className="text-muted">from </span> : null}
            {formatPrice(artwork.price)}
          </span>
        </Link>

        <p className="font-hand text-lg leading-none text-muted">{artwork.tagline}</p>

        {/* Quick add — touch devices */}
        <div className="mt-3 md:hidden">
          {inStock ? (
            <AddToCartButton
              artwork={artwork}
              size="sm"
              variant="soft"
              label="Add to bag"
              className="w-full"
            />
          ) : (
            <Link
              href={`/shop/${artwork.slug}`}
              className="flex h-9 w-full items-center justify-center gap-2 rounded-full border border-line bg-cream/60 text-xs font-medium tracking-wide text-muted"
            >
              View details <ArrowUpRight className="size-3.5" strokeWidth={1.6} />
            </Link>
          )}
        </div>
      </div>
    </motion.article>
  );
}
