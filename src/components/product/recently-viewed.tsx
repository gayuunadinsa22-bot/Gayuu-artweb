"use client";

import Link from "next/link";
import { useRecentStore } from "@/lib/store";
import { getArtworkBySlug, type Artwork } from "@/lib/artworks";
import { ArtImage } from "@/components/shared/art-image";
import { formatPrice } from "@/lib/utils";

/** Horizontal strip of recently viewed artworks (client-only). */
export function RecentlyViewed({ artworks }: { artworks?: Artwork[] }) {
  const slugs = useRecentStore((s) => s.slugs);
  const hydrated = useRecentStore((s) => s.hydrated);

  const find = (slug: string) =>
    artworks ? (artworks.find((a) => a.slug === slug) ?? null) : getArtworkBySlug(slug);

  const items = (hydrated ? slugs : [])
    .map((slug) => find(slug))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  if (items.length === 0) return null;

  return (
    <section className="px-5 pb-8 md:px-10">
      <div className="mx-auto max-w-[1440px] border-t border-line pt-12">
        <div className="mb-7 flex items-baseline justify-between gap-4">
          <h2 className="font-serif text-2xl tracking-tight md:text-3xl">
            Still on your mind{" "}
            <span className="font-hand text-xl text-blush-deep">♡</span>
          </h2>
          <Link
            href="/shop"
            className="link-underline text-xs uppercase tracking-[0.2em] text-muted transition-colors hover:text-ink"
          >
            Shop all
          </Link>
        </div>

        <div className="no-scrollbar -mx-5 flex gap-5 overflow-x-auto px-5 pb-2 md:mx-0 md:px-0">
          {items.map((item) => (
            <Link
              key={item.id}
              href={`/shop/${item.slug}`}
              className="group w-[160px] shrink-0 md:w-[200px]"
            >
              <ArtImage
                src={item.images[0]}
                alt={item.title}
                ratio="aspect-square"
                sizes="200px"
                className="transition-transform duration-700 group-hover:scale-[1.06]"
              />
              <p className="mt-3 truncate font-serif text-lg leading-tight transition-colors group-hover:text-blush-deep">
                {item.title}
              </p>
              <p className="text-xs text-muted">{formatPrice(item.price)}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
