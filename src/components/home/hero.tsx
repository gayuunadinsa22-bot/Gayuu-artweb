"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArtImage } from "@/components/shared/art-image";
import { EASE } from "@/components/shared/reveal";
import { homepageImageDefaults, resolveMediaUrl } from "@/lib/site-images";

const heroLines = [
  { text: "Art that feels", italic: null as string | null },
  { text: "like", italic: "a little piece" },
  { text: "of", italic: "magic." },
];

/** Keeps the default three-line headline until the artist edits it. */
function buildLines(sections?: Record<string, string>) {
  const heading = sections?.heading?.trim();
  const subheading = sections?.subheading?.trim();

  if (!heading && !subheading) return heroLines;
  if (heading && subheading) {
    return [
      { text: heading, italic: null },
      { text: "", italic: subheading },
    ];
  }
  if (heading) return [{ text: heading, italic: null }];
  return [
    heroLines[0],
    { text: "like", italic: subheading ?? heroLines[1].italic },
  ];
}

function MaskedLine({
  children,
  delay,
}: {
  children: React.ReactNode;
  delay: number;
}) {
  return (
    <span className="block overflow-hidden pb-[0.09em]">
      <motion.span
        className="block"
        initial={{ y: "105%" }}
        animate={{ y: 0 }}
        transition={{ duration: 1.05, delay, ease: EASE }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export function Hero({
  sections,
  images,
}: {
  /** Edited hero copy from Admin → Homepage (falls back to defaults). */
  sections?: Record<string, string>;
  images?: {
    hero_image_url?: string | null;
    hero_floating_image_url?: string | null;
  };
}) {
  const ref = React.useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const lines = buildLines(sections);
  const description =
    sections?.description?.trim() ||
    "Thoughtfully created artwork for spaces, souls, and stories that deserve something beautiful.";
  const cta1 = sections?.cta1?.trim() || "Explore the Collection";
  const cta2 = sections?.cta2?.trim() || "Meet the Artist";
  const mainImageSrc = resolveMediaUrl(
    images?.hero_image_url,
    homepageImageDefaults.hero_image_url,
  );
  const floatingImageSrc = resolveMediaUrl(
    images?.hero_floating_image_url,
    homepageImageDefaults.hero_floating_image_url,
  );
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const mainY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : -60]);
  const miniY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 50]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 40]);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden px-5 pb-16 pt-28 md:px-10 md:pb-24 md:pt-36 lg:pt-44"
    >
      {/* Floating decorative elements */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="animate-drift absolute -left-24 top-16 size-72 rounded-full bg-blush/30 blur-3xl" />
        <div
          className="animate-drift absolute right-1/4 top-8 size-56 rounded-full bg-lavender/40 blur-3xl"
          style={{ animationDelay: "-6s" }}
        />
        <div
          className="animate-drift absolute bottom-10 left-1/3 size-48 rounded-full bg-sage/25 blur-3xl"
          style={{ animationDelay: "-3s" }}
        />
        <div className="animate-float-slow absolute left-[8%] top-[52%] hidden text-3xl text-blush-deep lg:block">
          ✦
        </div>
        <div className="absolute right-[6%] top-[26%] hidden size-20 animate-spin rounded-full border border-dashed border-blush [animation-duration:34s] lg:block" />
      </div>

      <div className="mx-auto grid max-w-[1440px] gap-14 lg:grid-cols-12 lg:items-center lg:gap-10">
        {/* ── Text ─────────────────────────────────────── */}
        <motion.div style={{ y: textY }} className="lg:col-span-6 xl:col-span-6">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="eyebrow mb-7 flex items-center gap-3"
          >
            <span aria-hidden className="h-px w-10 bg-blush" />
            original art · made by hand · sri lanka
          </motion.p>

          <h1 className="font-serif text-[16vw] font-normal leading-[0.94] tracking-[-0.02em] sm:text-[13vw] md:text-[9.5vw] lg:text-[6.4vw] xl:text-[100px]">
            {lines.map((line, i) => (
              <MaskedLine key={i} delay={0.1 + i * 0.14}>
                {line.text && <span>{line.text}{line.italic ? " " : ""}</span>}
                {line.italic && (
                  <span
                    className={
                      i === 1 ? "italic text-blush-deep" : "italic"
                    }
                  >
                    {line.italic}
                  </span>
                )}
              </MaskedLine>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.6, ease: EASE }}
            className="mt-7 max-w-md text-[15px] leading-relaxed text-muted md:text-[17px]"
          >
            {description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.75, ease: EASE }}
            className="mt-9 flex flex-wrap items-center gap-3.5"
          >
            <Button size="lg" asChild>
              <Link href="/shop">
                {cta1}
                <ArrowUpRight className="size-4" strokeWidth={1.5} />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/about">{cta2}</Link>
            </Button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="font-hand mt-10 hidden text-xl text-muted/90 lg:block"
          >
            — new pieces drop slowly, one brushstroke at a time
          </motion.p>
        </motion.div>

        {/* ── Image composition ────────────────────────── */}
        <div className="relative lg:col-span-6 xl:col-span-6">
          <motion.figure
            initial={{ opacity: 0, y: 40, rotate: -1.5 }}
            animate={{ opacity: 1, y: 0, rotate: -1.5 }}
            transition={{ duration: 1.1, delay: 0.35, ease: EASE }}
            className="relative mx-auto max-w-[540px] lg:max-w-none"
          >
            <motion.div style={{ y: mainY }} className="shadow-float">
              <ArtImage
                src={mainImageSrc}
                alt="Original mixed media painting displayed in the Gayuu studio"
                ratio="aspect-[4/5]"
                sizes="(max-width: 1024px) 92vw, 44vw"
                priority
                className="transition-transform duration-700 hover:scale-[1.03]"
                frameClassName="bg-porcelain"
              />
            </motion.div>

            {/* Handwritten annotation */}
            <motion.figcaption
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 1.15, ease: EASE }}
              className="absolute -left-3 top-6 rotate-[-7deg] md:-left-8"
            >
              <span className="block rounded-full border border-blush bg-ivory/90 px-4 py-1.5 font-hand text-xl text-blush-deep shadow-card backdrop-blur">
                made with love ♡
              </span>
            </motion.figcaption>

            {/* Mini overlapping image */}
            <motion.div
              style={{ y: miniY }}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.85, ease: EASE }}
              className="absolute -bottom-10 -left-6 w-32 animate-float-slow sm:w-40 md:-left-14 md:w-48"
            >
              <div className="border-8 border-ivory bg-ivory shadow-float">
                <ArtImage
                  src={floatingImageSrc}
                  alt="Mixing colours on the studio palette"
                  ratio="aspect-square"
                  sizes="190px"
                />
              </div>
              <p className="font-hand mt-1 text-center text-base text-muted">
                a little studio moment ♡
              </p>
            </motion.div>

            {/* Scroll cue */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4 }}
              className="absolute -bottom-14 right-0 hidden items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-muted md:flex"
            >
              scroll
              <ArrowDown className="size-3.5 animate-bounce" strokeWidth={1.5} />
            </motion.div>
          </motion.figure>
        </div>
      </div>
    </section>
  );
}
