"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { QuantityStepper } from "@/components/product/quantity-stepper";
import { useCartStore, useUIStore, cartSubtotal } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import { siteSettings } from "@/lib/settings";

export function CartDrawer() {
  const open = useUIStore((s) => s.cartOpen);
  const setOpen = useUIStore((s) => s.setCartOpen);
  const lines = useCartStore((s) => s.lines);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const remove = useCartStore((s) => s.remove);
  const router = useRouter();

  const subtotal = cartSubtotal(lines);
  const remaining = siteSettings.freeShippingOver - subtotal;

  const go = (path: string) => {
    setOpen(false);
    router.push(path);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent aria-label="Shopping bag">
        <SheetHeader>
          <SheetTitle className="flex items-baseline gap-2.5">
            Your bag
            <span className="font-hand text-2xl text-blush-deep">
              {lines.length > 0 ? `(${lines.reduce((n, l) => n + l.quantity, 0)})` : ""}
            </span>
          </SheetTitle>
          <SheetDescription>
            {lines.length} artwork{lines.length === 1 ? "" : "s"} in your shopping bag
          </SheetDescription>
        </SheetHeader>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-5 px-10 text-center">
            <div className="grid size-20 place-items-center rounded-full bg-cream">
              <ShoppingBag className="size-7 text-muted" strokeWidth={1.2} />
            </div>
            <div>
              <p className="font-serif text-3xl tracking-tight">Your bag is empty</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Nothing here yet — go find something that feels like you.
              </p>
            </div>
            <Button onClick={() => go("/shop")} className="mt-1">
              Explore the art
              <ArrowRight className="size-4" strokeWidth={1.6} />
            </Button>
          </div>
        ) : (
          <>
            <ul className="flex-1 overflow-y-auto px-6 py-5">
              {lines.map((line) => (
                <li
                  key={line.id}
                  className="group flex gap-4 border-b border-line py-4 first:pt-0 last:border-0 last:pb-0"
                >
                  <Link
                    href={`/shop/${line.slug}`}
                    onClick={() => setOpen(false)}
                    className="relative h-[96px] w-[72px] shrink-0 overflow-hidden rounded-lg bg-cream img-shimmer"
                  >
                    <Image
                      src={line.image}
                      alt={line.title}
                      fill
                      sizes="72px"
                      className="object-cover"
                    />
                  </Link>

                  <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate font-serif text-lg leading-tight">
                          {line.title}
                        </p>
                        <p className="mt-0.5 text-xs text-muted">{formatPrice(line.price)}</p>
                      </div>
                      <button
                        type="button"
                        aria-label={`Remove ${line.title} from bag`}
                        onClick={() => remove(line.id)}
                        className="shrink-0 rounded-full p-1.5 text-muted transition-colors hover:bg-blush/25 hover:text-blush-deep"
                      >
                        <Trash2 className="size-4" strokeWidth={1.5} />
                      </button>
                    </div>

                    <div className="mt-auto flex items-center justify-between gap-3">
                      {line.maxQuantity > 1 ? (
                        <QuantityStepper
                          value={line.quantity}
                          max={line.maxQuantity}
                          onChange={(next) => setQuantity(line.id, next)}
                          className="h-9"
                        />
                      ) : (
                        <span className="text-[11px] uppercase tracking-[0.18em] text-muted">
                          1 of 1 · original
                        </span>
                      )}
                      <span className="text-sm font-medium tabular-nums">
                        {formatPrice(line.price * line.quantity)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t border-line bg-cream/50 px-6 py-5">
              <div className="flex items-baseline justify-between">
                <span className="eyebrow">Subtotal</span>
                <span className="font-serif text-2xl tabular-nums">{formatPrice(subtotal)}</span>
              </div>

              <p className="mt-2 text-xs leading-relaxed text-muted">
                {siteSettings.freeShippingOver > 0 && remaining > 0 ? (
                  <>
                    Add{" "}
                    <span className="text-blush-deep">{formatPrice(remaining)}</span> more for
                    free islandwide delivery*
                  </>
                ) : (
                  "Free islandwide delivery unlocked ♡"
                )}
                <br />
                Delivery fees &amp; payment are confirmed personally by the artist via WhatsApp.
              </p>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <Button variant="outline" onClick={() => go("/cart")}>
                  View bag
                </Button>
                <Button onClick={() => go("/checkout")}>
                  Checkout
                  <ArrowRight className="size-4" strokeWidth={1.6} />
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
