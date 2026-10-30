"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ArtImageProps {
  src: string;
  alt: string;
  /** Tailwind aspect class for the frame. */
  ratio?: string;
  sizes?: string;
  priority?: boolean;
  /** Classes for the <img> element. */
  className?: string;
  /** Classes for the frame wrapper. */
  frameClassName?: string;
  fallback?: string;
  draggable?: boolean;
}

/**
 * Image with shimmer loading state and automatic fallback swap —
 * a broken source never shows an empty box.
 */
export function ArtImage({
  src,
  alt,
  ratio = "aspect-[4/5]",
  sizes = "(max-width: 768px) 100vw, 33vw",
  priority = false,
  className,
  frameClassName,
  fallback = "/images/fallback-work.jpg",
  draggable = true,
}: ArtImageProps) {
  const [current, setCurrent] = React.useState(src);
  const [prevSrc, setPrevSrc] = React.useState(src);

  // Reset the (possibly fallback) source when the prop changes —
  // render-time adjustment, no effect needed.
  if (prevSrc !== src) {
    setPrevSrc(src);
    setCurrent(src);
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-cream img-shimmer",
        ratio,
        frameClassName,
      )}
    >
      <Image
        src={current}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        draggable={draggable}
        className={cn("object-cover", className)}
        onError={() => {
          if (current !== fallback) setCurrent(fallback);
        }}
      />
    </div>
  );
}
