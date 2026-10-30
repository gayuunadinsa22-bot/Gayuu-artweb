"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Expand } from "lucide-react";
import { ArtImage } from "@/components/shared/art-image";
import { cn } from "@/lib/utils";

/**
 * Product gallery: hover magnifier (zoom follows the cursor),
 * thumbnails, arrow navigation, click to open the lightbox.
 */
export function ProductGallery({
  images,
  title,
  onOpenLightbox,
}: {
  images: string[];
  title: string;
  onOpenLightbox: (index: number) => void;
}) {
  const [active, setActive] = React.useState(0);
  const [zooming, setZooming] = React.useState(false);
  const [origin, setOrigin] = React.useState("50% 50%");
  const frameRef = React.useRef<HTMLDivElement>(null);

  const select = (next: number) => setActive((next + images.length) % images.length);

  const handleMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = frameRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    setOrigin(`${x.toFixed(1)}% ${y.toFixed(1)}%`);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Main frame */}
      <div
        ref={frameRef}
        onMouseEnter={() => setZooming(true)}
        onMouseLeave={() => setZooming(false)}
        onMouseMove={handleMove}
        onClick={() => onOpenLightbox(active)}
        role="button"
        tabIndex={0}
        aria-label={`Open ${title} in full screen`}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onOpenLightbox(active);
          }
        }}
        className={cn(
          "group relative aspect-[4/5] cursor-zoom-in overflow-hidden bg-cream img-shimmer md:aspect-[5/6]",
        )}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={images[active]}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="absolute inset-0"
            style={{
              transformOrigin: origin,
              transform: zooming ? "scale(2)" : "scale(1)",
              transition: "transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          >
            {/* next/image optimized frame with fallback handled by ArtImage */}
            <ArtImage
              src={images[active]}
              alt={`${title} — view ${active + 1}`}
              ratio=""
              sizes="(max-width: 1024px) 100vw, 55vw"
              priority
              frameClassName="absolute inset-0"
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>

        {/* Expand hint */}
        <span className="absolute right-4 top-4 grid size-10 translate-y-1 place-items-center rounded-full bg-ivory/85 text-ink opacity-0 backdrop-blur transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <Expand className="size-4" strokeWidth={1.5} />
        </span>

        {/* Arrows */}
        {images.length > 1 ? (
          <>
            <button
              type="button"
              aria-label="Previous image"
              onClick={(event) => {
                event.stopPropagation();
                select(active - 1);
              }}
              className="absolute left-4 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-ivory/85 text-ink opacity-0 backdrop-blur transition-all duration-300 hover:bg-ivory group-hover:opacity-100"
            >
              <ChevronLeft className="size-4" strokeWidth={1.5} />
            </button>
            <button
              type="button"
              aria-label="Next image"
              onClick={(event) => {
                event.stopPropagation();
                select(active + 1);
              }}
              className="absolute right-4 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-ivory/85 text-ink opacity-0 backdrop-blur transition-all duration-300 hover:bg-ivory group-hover:opacity-100"
            >
              <ChevronRight className="size-4" strokeWidth={1.5} />
            </button>
          </>
        ) : null}
      </div>

      {/* Thumbnails */}
      {images.length > 1 ? (
        <div className="flex gap-3">
          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              aria-label={`Show view ${index + 1}`}
              aria-current={index === active}
              onClick={() => setActive(index)}
              className={cn(
                "relative h-20 w-16 overflow-hidden border transition-all duration-300 md:h-24 md:w-20",
                index === active
                  ? "border-ink opacity-100"
                  : "border-transparent opacity-55 hover:opacity-90",
              )}
            >
              <ArtImage
                src={image}
                alt=""
                ratio=""
                sizes="96px"
                frameClassName="absolute inset-0"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
