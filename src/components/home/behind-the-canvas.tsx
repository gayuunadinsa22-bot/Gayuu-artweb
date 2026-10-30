"use client";

import * as React from "react";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { InstagramIcon } from "@/components/icons";
import { processMoments } from "@/lib/content";
import { siteSettings } from "@/lib/settings";
import { Reveal } from "@/components/shared/reveal";
import { ArtImage } from "@/components/shared/art-image";

export function BehindTheCanvas({
  sections,
}: {
  /** Edited copy from Admin → Homepage (falls back to defaults). */
  sections?: Record<string, string>;
}) {
  const heading = sections?.heading?.trim();
  const description = sections?.description?.trim();
  const strip = [...processMoments, ...processMoments];

  return (
    <section className="relative overflow-hidden bg-ink py-20 text-ivory md:py-28">
      {/* soft colour wash */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-0 size-96 rounded-full bg-blush/12 blur-3xl" />
        <div className="absolute -right-24 bottom-0 size-80 rounded-full bg-lavender/12 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-[1440px] px-5 md:px-10">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <Reveal className="max-w-2xl">
            <p className="eyebrow mb-6 flex items-center gap-3 text-ivory/55">
              <span aria-hidden className="h-px w-10 bg-blush" />
              behind the canvas
            </p>
            <h2 className="font-serif text-5xl leading-[1.03] tracking-[-0.02em] sm:text-6xl md:text-7xl">
              {heading ? (
                heading
              ) : (
                <>
                  Every artwork has <span className="italic text-blush">a story.</span>
                </>
              )}
            </h2>
          </Reveal>

          <Reveal delay={0.15} className="max-w-md">
            <p className="text-[15px] leading-relaxed text-ivory/65">
              {description ?? (
                <>
                  The half-finished layers, the paint water, the sketchbook pages that never
                  make it online. This is the quiet part — where the magic actually happens.
                </>
              )}
            </p>
            <a
              href={siteSettings.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline mt-5 inline-flex items-center gap-2 text-sm text-blush transition-colors hover:text-ivory"
            >
              <InstagramIcon className="size-4" strokeWidth={1.5} />
              More studio moments on Instagram
              <ArrowUpRight className="size-3.5" strokeWidth={1.6} />
            </a>
          </Reveal>
        </div>
      </div>

      {/* Film strip */}
      <div className="relative mt-14 border-y border-ivory/15 py-5">
        {/* sprocket holes */}
        <div
          aria-hidden
          className="absolute inset-x-0 top-1 h-2.5 bg-[repeating-linear-gradient(90deg,transparent_0_18px,rgba(250,248,245,0.16)_18px_30px)]"
        />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-1 h-2.5 bg-[repeating-linear-gradient(90deg,transparent_0_18px,rgba(250,248,245,0.16)_18px_30px)]"
        />

        <div className="animate-marquee flex w-max gap-4 py-4 hover:[animation-play-state:paused] md:gap-6">
          {strip.map((moment, index) => (
            <figure key={`${moment.image}-${index}`} className="w-[230px] shrink-0 md:w-[300px]">
              <div className="overflow-hidden">
                <ArtImage
                  src={moment.image}
                  alt={moment.caption}
                  ratio="aspect-[4/5]"
                  sizes="300px"
                  className="transition-transform duration-700 hover:scale-105"
                  frameClassName="!bg-ink/40"
                />
              </div>
              <figcaption className="mt-3 flex items-baseline justify-between gap-3">
                <span className="text-xs leading-snug text-ivory/70">{moment.caption}</span>
                <span className="font-hand text-base text-blush">{moment.tag}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-[1440px] px-5 md:px-10">
        <Reveal className="flex flex-wrap items-center justify-between gap-6">
          <p className="font-hand text-2xl text-ivory/80">
            from first sketch to final seal ♡
          </p>
          <Link
            href="/gallery"
            className="link-underline inline-flex items-center gap-2 text-sm text-ivory/80 transition-colors hover:text-blush"
          >
            See the full gallery
            <ArrowUpRight className="size-4" strokeWidth={1.5} />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
