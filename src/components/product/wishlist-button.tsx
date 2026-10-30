"use client";

import * as React from "react";
import { Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useWishlistStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function WishlistButton({
  artworkId,
  className,
  size = "md",
}: {
  artworkId: string;
  className?: string;
  size?: "sm" | "md";
}) {
  const ids = useWishlistStore((s) => s.ids);
  const hydrated = useWishlistStore((s) => s.hydrated);
  const toggle = useWishlistStore((s) => s.toggle);
  const active = hydrated && ids.includes(artworkId);

  return (
    <motion.button
      type="button"
      aria-pressed={active}
      aria-label={active ? "Remove from wishlist" : "Save to wishlist"}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        toggle(artworkId);
      }}
      whileTap={{ scale: 0.85 }}
      className={cn(
        "group/wish grid place-items-center rounded-full border border-line bg-ivory/85 backdrop-blur transition-colors hover:border-blush hover:bg-ivory",
        size === "sm" ? "size-8" : "size-9",
        className,
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={active ? "on" : "off"}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ duration: 0.22 }}
          className="grid place-items-center"
        >
          <Heart
            className={cn(
              "transition-colors",
              size === "sm" ? "size-3.5" : "size-4",
              active ? "fill-blush-deep text-blush-deep" : "text-ink group-hover/wish:text-blush-deep",
            )}
            strokeWidth={1.6}
          />
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}
