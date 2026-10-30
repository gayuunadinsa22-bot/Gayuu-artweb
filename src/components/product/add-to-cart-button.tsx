"use client";

import * as React from "react";
import { ShoppingBag, Check, LoaderCircle } from "lucide-react";
import { useCartStore, useUIStore } from "@/lib/store";
import type { Artwork } from "@/lib/artworks";
import { isInStock } from "@/lib/artworks";
import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AddToCartButtonProps extends Omit<ButtonProps, "onClick"> {
  artwork: Artwork;
  quantity?: number;
  /** Open the cart drawer after adding. */
  openDrawer?: boolean;
  label?: string;
}

export function AddToCartButton({
  artwork,
  quantity = 1,
  openDrawer = true,
  label,
  className,
  variant,
  size,
  ...props
}: AddToCartButtonProps) {
  const add = useCartStore((s) => s.add);
  const setCartOpen = useUIStore((s) => s.setCartOpen);
  const [state, setState] = React.useState<"idle" | "adding" | "added">("idle");
  const sold = !isInStock(artwork);

  const handleAdd = () => {
    if (sold || state !== "idle") return;
    setState("adding");
    add(artwork, quantity);
    window.setTimeout(() => {
      setState("added");
      if (openDrawer) setCartOpen(true);
      window.setTimeout(() => setState("idle"), 1600);
    }, 350);
  };

  if (sold) {
    return (
      <Button variant="soft" size={size} className={cn("cursor-not-allowed", className)} disabled {...props}>
        Sold out
      </Button>
    );
  }

  return (
    <Button
      variant={variant ?? "default"}
      size={size}
      className={className}
      onClick={handleAdd}
      aria-label={`Add ${artwork.title} to bag`}
      {...props}
    >
      {state === "idle" ? (
        <>
          <ShoppingBag className="size-4" strokeWidth={1.6} />
          {label ?? "Add to bag"}
        </>
      ) : state === "adding" ? (
        <>
          <LoaderCircle className="size-4 animate-spin" strokeWidth={1.6} />
          Adding
        </>
      ) : (
        <>
          <Check className="size-4" strokeWidth={2} />
          Added
        </>
      )}
    </Button>
  );
}
