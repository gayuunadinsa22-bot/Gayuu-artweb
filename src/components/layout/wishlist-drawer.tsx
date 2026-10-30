"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, X, ShoppingBag } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCartStore, useUIStore, useWishlistStore } from "@/lib/store";
import { artworks as localArtworks, isInStock, type Artwork } from "@/lib/artworks";
import { formatPrice } from "@/lib/utils";

export function WishlistDrawer({ artworks }: { artworks?: Artwork[] }) {
  const open = useUIStore((s) => s.wishlistOpen);
  const setOpen = useUIStore((s) => s.setWishlistOpen);
  const ids = useWishlistStore((s) => s.ids);
  const remove = useWishlistStore((s) => s.remove);
  const add = useCartStore((s) => s.add);
  const setCartOpen = useUIStore((s) => s.setCartOpen);

  const saved = (artworks ?? localArtworks).filter((artwork) =>
    ids.includes(artwork.id),
  );

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent aria-label="Wishlist">
        <SheetHeader>
          <SheetTitle className="flex items-baseline gap-2.5">
            Saved pieces
            {saved.length > 0 ? (
              <span className="font-hand text-2xl text-blush-deep">({saved.length})</span>
            ) : null}
          </SheetTitle>
          <SheetDescription>Artworks you have saved for later</SheetDescription>
        </SheetHeader>

        {saved.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-5 px-10 text-center">
            <div className="grid size-20 place-items-center rounded-full bg-cream">
              <Heart className="size-7 text-muted" strokeWidth={1.2} />
            </div>
            <div>
              <p className="font-serif text-3xl tracking-tight">Nothing saved yet</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Tap the heart on any piece you love — it will wait for you here.
              </p>
            </div>
            <Button
              onClick={() => {
                setOpen(false);
              }}
              asChild
            >
              <Link href="/gallery">Browse the gallery</Link>
            </Button>
          </div>
        ) : (
          <ul className="flex-1 overflow-y-auto px-6 py-5">
            {saved.map((artwork) => (
              <li
                key={artwork.id}
                className="flex gap-4 border-b border-line py-4 first:pt-0 last:border-0"
              >
                <Link
                  href={`/shop/${artwork.slug}`}
                  onClick={() => setOpen(false)}
                  className="relative h-[96px] w-[72px] shrink-0 overflow-hidden rounded-lg bg-cream img-shimmer"
                >
                  <Image
                    src={artwork.images[0]}
                    alt={artwork.title}
                    fill
                    sizes="72px"
                    className="object-cover"
                  />
                </Link>

                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      href={`/shop/${artwork.slug}`}
                      onClick={() => setOpen(false)}
                      className="truncate font-serif text-lg leading-tight hover:text-blush-deep"
                    >
                      {artwork.title}
                    </Link>
                    <button
                      type="button"
                      aria-label={`Remove ${artwork.title} from wishlist`}
                      onClick={() => remove(artwork.id)}
                      className="rounded-full p-1 text-muted transition-colors hover:text-blush-deep"
                    >
                      <X className="size-4" strokeWidth={1.5} />
                    </button>
                  </div>
                  <p className="mt-0.5 text-xs text-muted">
                    {artwork.priceFrom ? "from " : ""}
                    {formatPrice(artwork.price)}
                  </p>

                  <div className="mt-auto pt-3">
                    {isInStock(artwork) ? (
                      <Button
                        size="sm"
                        variant="soft"
                        onClick={() => {
                          add(artwork, 1);
                          setOpen(false);
                          setCartOpen(true);
                        }}
                      >
                        <ShoppingBag className="size-3.5" strokeWidth={1.6} />
                        Move to bag
                      </Button>
                    ) : (
                      <span className="text-[11px] uppercase tracking-[0.16em] text-muted">
                        Sold out
                      </span>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </SheetContent>
    </Sheet>
  );
}
