"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, ShoppingBag, Trash2, Heart } from "lucide-react";
import { useCartStore, cartSubtotal } from "@/lib/store";
import { QuantityStepper } from "@/components/product/quantity-stepper";
import { Button } from "@/components/ui/button";
import { siteSettings } from "@/lib/settings";
import { formatPrice } from "@/lib/utils";

export function CartView() {
  const lines = useCartStore((s) => s.lines);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const remove = useCartStore((s) => s.remove);
  const clear = useCartStore((s) => s.clear);

  const subtotal = cartSubtotal(lines);
  const remaining = siteSettings.freeShippingOver - subtotal;

  return (
    <div className="px-5 pb-24 pt-28 md:px-10 md:pt-36">
      <div className="mx-auto max-w-[1200px]">
        <p className="eyebrow mb-5">Your selection</p>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h1 className="font-serif text-6xl leading-none tracking-[-0.02em] sm:text-7xl md:text-8xl">
            Your <span className="italic text-blush-deep">bag.</span>
          </h1>
          {lines.length > 0 ? (
            <button
              type="button"
              onClick={clear}
              className="text-xs uppercase tracking-[0.16em] text-muted underline-offset-4 transition-colors hover:text-blush-deep hover:underline"
            >
              Empty bag
            </button>
          ) : null}
        </div>

        {lines.length === 0 ? (
          <div className="mx-auto mt-20 max-w-md text-center">
            <div className="mx-auto grid size-24 place-items-center rounded-full bg-cream">
              <ShoppingBag className="size-9 text-muted" strokeWidth={1.1} />
            </div>
            <p className="mt-7 font-serif text-4xl tracking-tight">
              Nothing here yet
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Your bag is waiting for its first little piece of art.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/shop">
                  Explore the art
                  <ArrowRight className="size-4" strokeWidth={1.6} />
                </Link>
              </Button>
              <Button asChild size="lg" variant="ghost">
                <Link href="/gallery">
                  <Heart className="size-4" strokeWidth={1.6} />
                  Browse the gallery
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="mt-12 grid gap-12 lg:grid-cols-[1.6fr_1fr]">
            {/* Lines */}
            <ul>
              <AnimatePresence initial={false}>
                {lines.map((line) => (
                  <motion.li
                    key={line.id}
                    layout
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="flex gap-5 border-b border-line py-6 first:pt-0"
                  >
                    <Link
                      href={`/shop/${line.slug}`}
                      className="relative h-[130px] w-[100px] shrink-0 overflow-hidden bg-cream img-shimmer md:h-[150px] md:w-[116px]"
                    >
                      <Image
                        src={line.image}
                        alt={line.title}
                        fill
                        sizes="116px"
                        className="object-cover transition-transform duration-700 hover:scale-105"
                      />
                    </Link>

                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <Link
                            href={`/shop/${line.slug}`}
                            className="font-serif text-2xl leading-tight transition-colors hover:text-blush-deep"
                          >
                            {line.title}
                          </Link>
                          <p className="mt-1 text-xs uppercase tracking-[0.16em] text-muted">
                            {line.category.replace("-", " & ")}
                          </p>
                        </div>
                        <button
                          type="button"
                          aria-label={`Remove ${line.title}`}
                          onClick={() => remove(line.id)}
                          className="rounded-full p-2 text-muted transition-colors hover:bg-blush/25 hover:text-blush-deep"
                        >
                          <Trash2 className="size-4" strokeWidth={1.5} />
                        </button>
                      </div>

                      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-4">
                        {line.maxQuantity > 1 ? (
                          <QuantityStepper
                            value={line.quantity}
                            max={line.maxQuantity}
                            onChange={(next) => setQuantity(line.id, next)}
                          />
                        ) : (
                          <span className="rounded-full border border-line px-4 py-1.5 text-[11px] uppercase tracking-[0.16em] text-muted">
                            1 of 1 · original
                          </span>
                        )}
                        <span className="font-serif text-xl tabular-nums">
                          {formatPrice(line.price * line.quantity)}
                        </span>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>

              <li className="pt-7">
                <Link
                  href="/shop"
                  className="link-underline inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-ink"
                >
                  <ArrowLeft className="size-4" strokeWidth={1.5} />
                  Continue browsing
                </Link>
              </li>
            </ul>

            {/* Summary */}
            <aside className="lg:sticky lg:top-28 lg:self-start">
              <div className="rounded-3xl border border-line bg-cream/60 p-7">
                <h2 className="font-serif text-3xl tracking-tight">Order summary</h2>

                <dl className="mt-6 space-y-3 text-sm">
                  <div className="flex items-baseline justify-between">
                    <dt className="text-muted">Artworks ({lines.reduce((n, l) => n + l.quantity, 0)})</dt>
                    <dd className="tabular-nums">{formatPrice(subtotal)}</dd>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <dt className="text-muted">Delivery</dt>
                    <dd className="text-muted">Confirmed via WhatsApp</dd>
                  </div>
                </dl>

                <div className="mt-5 flex items-baseline justify-between border-t border-line pt-5">
                  <span className="text-sm uppercase tracking-[0.18em] text-muted">
                    Subtotal
                  </span>
                  <span className="font-serif text-3xl tabular-nums">
                    {formatPrice(subtotal)}
                  </span>
                </div>

                <p className="mt-3 text-xs leading-relaxed text-muted">
                  {siteSettings.freeShippingOver > 0 && remaining > 0 ? (
                    <>
                      Add{" "}
                      <span className="text-blush-deep">{formatPrice(remaining)}</span> for
                      free islandwide delivery*
                    </>
                  ) : (
                    "Free islandwide delivery unlocked ♡"
                  )}
                  <br />
                  No payment is taken online — availability, delivery and payment are
                  confirmed personally by the artist.
                </p>

                <Button size="lg" className="mt-6 w-full" asChild>
                  <Link href="/checkout">
                    Send order inquiry
                    <ArrowRight className="size-4" strokeWidth={1.6} />
                  </Link>
                </Button>
                <p className="font-hand mt-3 text-center text-lg text-muted">
                  opens WhatsApp — nothing is charged ♡
                </p>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
