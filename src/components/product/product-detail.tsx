"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  MessageCircle,
  ShieldCheck,
  Truck,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import type { Artwork } from "@/lib/artworks";
import { getBadge, badgeLabel } from "@/lib/artworks";
import { categories } from "@/lib/content";
import { siteSettings } from "@/lib/settings";
import { useRecentStore } from "@/lib/store";
import { formatPrice, formatDate, cn } from "@/lib/utils";
import { openWhatsApp } from "@/lib/whatsapp";
import { ProductGallery } from "@/components/product/product-gallery";
import { Accordion } from "@/components/product/accordion";
import { QuantityStepper } from "@/components/product/quantity-stepper";
import { AddToCartButton } from "@/components/product/add-to-cart-button";
import { WishlistButton } from "@/components/product/wishlist-button";
import { Lightbox, type LightboxImage } from "@/components/shared/lightbox";
import { Badge } from "@/components/ui/badge";

function categoryLabel(slug: string): string {
  return categories.find((category) => category.slug === slug)?.name ?? slug;
}

export function ProductDetail({ artwork }: { artwork: Artwork }) {
  const [quantity, setQuantity] = React.useState(1);
  const [lightboxIndex, setLightboxIndex] = React.useState<number | null>(null);
  const pushRecent = useRecentStore((s) => s.push);

  React.useEffect(() => {
    pushRecent(artwork.slug);
  }, [artwork.slug, pushRecent]);

  // Reset quantity when navigating between products (render-time adjustment).
  const [prevSlug, setPrevSlug] = React.useState(artwork.slug);
  if (prevSlug !== artwork.slug) {
    setPrevSlug(artwork.slug);
    setQuantity(1);
    setLightboxIndex(null);
  }

  const sold = artwork.availability === "sold";
  const badge = getBadge(artwork);

  const lightboxImages: LightboxImage[] = artwork.images.map((src, index) => ({
    src,
    alt: `${artwork.title} — view ${index + 1}`,
  }));

  const handleEnquiry = () => {
    openWhatsApp(
      `Hello ${siteSettings.artistName}! I'm interested in "${artwork.title}" — is it still available? 🌷\n\n`,
    );
  };

  const specs: { label: string; value: React.ReactNode }[] = [
    { label: "Dimensions", value: artwork.dimensions },
    { label: "Medium", value: artwork.medium },
    { label: "Materials", value: artwork.materials.join(" · ") },
    {
      label: "Edition",
      value: artwork.editionSize
        ? `Limited edition of ${artwork.editionSize}`
        : artwork.maxQuantity === 1
          ? "Original — one of one"
          : "Made to order",
    },
    { label: "Created", value: formatDate(artwork.createdAt) },
  ];

  return (
    <div className="px-5 pb-24 pt-24 md:px-10 md:pt-32">
      <div className="mx-auto max-w-[1440px]">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-8 flex flex-wrap items-center gap-2 text-xs text-muted">
          <Link href="/shop" className="transition-colors hover:text-ink">
            Shop
          </Link>
          <ChevronRight className="size-3" strokeWidth={1.5} />
          <Link
            href={`/shop?category=${artwork.category}`}
            className="transition-colors hover:text-ink"
          >
            {categoryLabel(artwork.category)}
          </Link>
          <ChevronRight className="size-3" strokeWidth={1.5} />
          <span className="text-ink">{artwork.title}</span>
        </nav>

        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* ── Gallery ─────────────────────────────────── */}
          <div className="lg:col-span-7">
            <ProductGallery
              images={artwork.images}
              title={artwork.title}
              onOpenLightbox={(index) => setLightboxIndex(index)}
            />
            <p className="font-hand mt-4 text-lg text-muted">
              hover to zoom · click for full screen ♡
            </p>
          </div>

          {/* ── Info ────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5"
          >
            <div className="lg:sticky lg:top-28">
              <div className="flex flex-wrap items-center gap-2.5">
                <Link
                  href={`/shop?category=${artwork.category}`}
                  className="eyebrow transition-colors hover:text-ink"
                >
                  {categoryLabel(artwork.category)}
                </Link>
                {badge ? (
                  <Badge
                    variant={
                      badge === "new"
                        ? "blush"
                        : badge === "limited-edition"
                          ? "lavender"
                          : badge === "original"
                            ? "default"
                            : "muted"
                    }
                    className={badge === "sold-out" ? "bg-ink/80 text-ivory" : undefined}
                  >
                    {badgeLabel[badge]}
                  </Badge>
                ) : null}
              </div>

              <h1 className="mt-4 font-serif text-5xl leading-[1] tracking-[-0.02em] md:text-6xl">
                {artwork.title}
              </h1>
              <p className="font-hand mt-2 text-2xl text-blush-deep">{artwork.tagline}</p>

              <div className="mt-6 flex items-baseline gap-4">
                <p className="font-serif text-3xl tabular-nums">
                  {artwork.priceFrom ? (
                    <span className="mr-1 text-lg text-muted">from</span>
                  ) : null}
                  {formatPrice(artwork.price)}
                </p>
                <span className="flex items-center gap-1.5 text-xs tracking-wide text-muted">
                  <span
                    aria-hidden
                    className={cn(
                      "size-1.5 rounded-full",
                      sold && "bg-line",
                      artwork.availability === "available" && "bg-sage",
                      artwork.availability === "made-to-order" && "bg-lavender",
                    )}
                  />
                  {sold
                    ? "This piece has found a home"
                    : artwork.availability === "made-to-order"
                      ? "Made to order"
                      : "Available now"}
                </span>
              </div>

              <p className="mt-6 text-[15px] leading-relaxed text-muted">
                {artwork.description}
              </p>

              {artwork.story ? (
                <blockquote className="mt-5 border-l-2 border-blush pl-4 text-sm italic leading-relaxed text-ink/80">
                  {artwork.story}
                </blockquote>
              ) : null}

              {/* Specs */}
              <dl className="mt-7 grid grid-cols-1 gap-y-3 border-y border-line py-5 sm:grid-cols-2">
                {specs.map((spec) => (
                  <div key={spec.label}>
                    <dt className="text-[10px] uppercase tracking-[0.2em] text-muted">
                      {spec.label}
                    </dt>
                    <dd className="mt-0.5 text-sm text-ink">{spec.value}</dd>
                  </div>
                ))}
              </dl>

              {/* Actions */}
              <div className="mt-7 flex flex-wrap items-center gap-3">
                {artwork.maxQuantity > 1 && !sold ? (
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-muted">
                      Quantity
                    </span>
                    <QuantityStepper
                      value={quantity}
                      max={artwork.maxQuantity}
                      onChange={setQuantity}
                    />
                  </div>
                ) : (
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-muted">
                      Quantity
                    </span>
                    <span className="inline-flex h-11 items-center rounded-full border border-line px-5 text-sm text-muted">
                      {sold ? "—" : "1 of 1 · original"}
                    </span>
                  </div>
                )}

                <div className="flex-1 min-w-[220px]">
                  <AddToCartButton
                    artwork={artwork}
                    quantity={quantity}
                    size="lg"
                    className="w-full"
                    label={sold ? undefined : "Add to bag"}
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleEnquiry}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-sage bg-sage/15 px-6 py-3.5 text-sm font-medium tracking-wide text-ink transition-all duration-300 hover:border-ink hover:bg-ink hover:text-ivory"
              >
                <MessageCircle className="size-4" strokeWidth={1.6} />
                {sold ? "Ask about similar work" : "Enquire on WhatsApp"}
              </button>

              <div className="mt-4 flex items-center justify-between">
                <WishlistButton artworkId={artwork.id} size="sm" />
                <p className="text-[11px] tracking-wide text-muted">
                  {siteSettings.freeShippingOver > 0
                    ? "Free islandwide delivery over " +
                      formatPrice(siteSettings.freeShippingOver)
                    : "Islandwide delivery available"}
                </p>
              </div>

              {/* Trust strip */}
              <div className="mt-6 grid grid-cols-3 gap-3 text-center">
                {[
                  { icon: Truck, label: "Ships in 3–7 days" },
                  { icon: ShieldCheck, label: "Certificate of authenticity" },
                  { icon: Sparkles, label: "Handmade & signed" },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl bg-cream/70 px-2 py-4">
                    <item.icon className="mx-auto size-4 text-blush-deep" strokeWidth={1.5} />
                    <p className="mt-2 text-[10px] leading-tight tracking-wide text-muted">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>

              {/* Accordions */}
              <div className="mt-8">
                <Accordion
                  items={[
                    {
                      title: "Shipping & delivery",
                      content: (
                        <>
                          Every artwork is packed by hand with acid-free tissue, corner
                          protectors and a sturdy box. Islandwide delivery takes 3–7
                          working days; international shipping is quoted per order.
                          Delivery fees are confirmed personally with you on WhatsApp
                          before anything is sent.
                        </>
                      ),
                    },
                    {
                      title: "Care instructions",
                      content: (
                        <>
                          Keep the piece out of direct sunlight and humid spaces. Dust
                          gently with a soft, dry cloth and never touch the painted
                          surface of an original. If you ever need help with framing,
                          just ask — I&rsquo;m happy to advise.
                        </>
                      ),
                    },
                    {
                      title: "Authenticity & packaging",
                      content: (
                        <>
                          Originals ship with a hand-signed certificate of authenticity
                          and a small care card. Limited-edition prints are signed and
                          numbered in pencil. Everything arrives wrapped like the little
                          gift it is.
                        </>
                      ),
                    },
                    {
                      title: artwork.availability === "made-to-order"
                        ? "About made-to-order work"
                        : "Payment & confirmation",
                      content: (
                        <>
                          No payment happens on this site. After you send your order
                          inquiry, {siteSettings.artistName} confirms availability,
                          delivery and payment options with you personally (bank
                          transfer or another agreed method) before anything is
                          produced or shipped.
                        </>
                      ),
                    },
                  ]}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {lightboxIndex !== null ? (
        <Lightbox
          images={lightboxImages}
          index={lightboxIndex}
          onIndexChange={setLightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      ) : null}
    </div>
  );
}
