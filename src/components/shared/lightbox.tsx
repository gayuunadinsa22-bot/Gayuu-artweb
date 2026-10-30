"use client";

import * as React from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export interface LightboxImage {
  src: string;
  alt: string;
}

/**
 * Full-screen gallery lightbox with keyboard navigation
 * (← → to move, Esc to close) and scroll locking.
 */
export function Lightbox({
  images,
  index,
  onIndexChange,
  onClose,
}: {
  images: LightboxImage[];
  index: number;
  onIndexChange: (next: number) => void;
  onClose: () => void;
}) {
  const count = images.length;

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") onIndexChange((index + 1) % count);
      if (event.key === "ArrowLeft") onIndexChange((index - 1 + count) % count);
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [index, count, onClose, onIndexChange]);

  const image = images[index];

  return (
    <AnimatePresence>
      <motion.div
        key="lightbox"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        role="dialog"
        aria-modal="true"
        aria-label={image?.alt ?? "Artwork gallery"}
        className="fixed inset-0 z-[80] bg-ink/95 backdrop-blur-sm"
        onClick={onClose}
      >
        {/* Controls */}
        <button
          type="button"
          aria-label="Close gallery"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 grid size-11 place-items-center rounded-full border border-ivory/25 text-ivory transition-colors hover:bg-ivory hover:text-ink md:right-6 md:top-6"
        >
          <X className="size-5" strokeWidth={1.5} />
        </button>

        <div className="absolute left-1/2 top-5 z-10 -translate-x-1/2 font-hand text-lg text-ivory/80 md:top-7">
          {index + 1} / {count}
        </div>

        {count > 1 ? (
          <>
            <button
              type="button"
              aria-label="Previous image"
              onClick={(event) => {
                event.stopPropagation();
                onIndexChange((index - 1 + count) % count);
              }}
              className="absolute left-3 top-1/2 z-10 grid size-12 -translate-y-1/2 place-items-center rounded-full border border-ivory/25 text-ivory transition-colors hover:bg-ivory hover:text-ink md:left-7"
            >
              <ChevronLeft className="size-5" strokeWidth={1.5} />
            </button>
            <button
              type="button"
              aria-label="Next image"
              onClick={(event) => {
                event.stopPropagation();
                onIndexChange((index + 1) % count);
              }}
              className="absolute right-3 top-1/2 z-10 grid size-12 -translate-y-1/2 place-items-center rounded-full border border-ivory/25 text-ivory transition-colors hover:bg-ivory hover:text-ink md:right-7"
            >
              <ChevronRight className="size-5" strokeWidth={1.5} />
            </button>
          </>
        ) : null}

        {/* Image */}
        <div
          className="absolute inset-0 flex items-center justify-center p-6 md:p-16"
          onClick={(event) => event.stopPropagation()}
        >
          {image ? (
            <motion.figure
              key={image.src}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative h-full w-full max-w-5xl"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="100vw"
                quality={90}
                className="object-contain"
                priority
              />
            </motion.figure>
          ) : null}
        </div>

        {/* Thumbnails */}
        {count > 1 ? (
          <div
            className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2"
            onClick={(event) => event.stopPropagation()}
          >
            {images.map((item, thumbIndex) => (
              <button
                key={item.src}
                type="button"
                aria-label={`View image ${thumbIndex + 1}`}
                onClick={() => onIndexChange(thumbIndex)}
                className={`relative size-12 overflow-hidden rounded-md border transition-all md:size-14 ${
                  thumbIndex === index
                    ? "border-ivory opacity-100"
                    : "border-transparent opacity-50 hover:opacity-85"
                }`}
              >
                <Image src={item.src} alt="" fill sizes="56px" className="object-cover" />
              </button>
            ))}
          </div>
        ) : null}
      </motion.div>
    </AnimatePresence>
  );
}
