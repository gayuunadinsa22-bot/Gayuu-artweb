"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { ArtImage } from "@/components/shared/art-image";
import { Reveal, Stagger, StaggerItem } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";
import { siteSettings } from "@/lib/settings";
import { homepageImageDefaults, resolveMediaUrl } from "@/lib/site-images";

export function ArtistStory({
  sections,
  images,
}: {
  /** Edited artist copy from Admin → Homepage (falls back to defaults). */
  sections?: Record<string, string>;
  images?: {
    artist_intro_image_url?: string | null;
  };
}) {
  const heading = sections?.heading?.trim();
  const description = sections?.description?.trim();
  const portraitSrc = resolveMediaUrl(
    images?.artist_intro_image_url,
    homepageImageDefaults.artist_intro_image_url,
  );
  const ref = React.useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [reduced ? 0 : 40, reduced ? 0 : -40]);

  return (
    <section ref={ref} className="relative overflow-hidden bg-cream/50 px-5 py-20 md:px-10 md:py-28">
      <div aria-hidden className="pointer-events-none absolute -right-20 top-10 size-64 rounded-full bg-lavender/40 blur-3xl" />

      <div className="mx-auto grid max-w-[1440px] items-center gap-14 lg:grid-cols-12 lg:gap-20">
        {/* Portrait */}
        <div className="relative lg:col-span-5">
          <Reveal>
            <motion.div style={{ y }} className="relative">
              <div className="absolute -left-4 -top-4 hidden h-full w-full border border-blush md:block" />
              <div className="relative">
                <ArtImage
                  src={portraitSrc}
                  alt={`${siteSettings.artistName} — the artist in her studio`}
                  ratio="aspect-[4/5]"
                  sizes="(max-width: 1024px) 92vw, 40vw"
                  className="transition-transform duration-700 hover:scale-[1.04]"
                />
                <span className="absolute -bottom-5 -right-3 rotate-[-5deg] rounded-full border border-line bg-ivory px-4 py-1.5 font-hand text-xl text-ink shadow-card md:-right-8">
                  that&rsquo;s me ♡
                </span>
              </div>
            </motion.div>
          </Reveal>
        </div>

        {/* Copy */}
        <div className="lg:col-span-7">
          <Reveal>
            <p className="eyebrow mb-6 flex items-center gap-3">
              <span aria-hidden className="h-px w-10 bg-sage" />
              the artist
            </p>
            <h2 className="font-serif text-4xl leading-[1.05] tracking-[-0.02em] sm:text-5xl md:text-6xl lg:text-[68px]">
              {heading ? (
                heading
              ) : (
                <>
                  Hi, I&rsquo;m the{" "}
                  <span className="italic text-blush-deep">hands</span> behind the art.
                </>
              )}
            </h2>
          </Reveal>

          <Stagger className="mt-8 max-w-xl space-y-5" delay={0.15}>
            <StaggerItem>
              <p className="text-[15px] leading-relaxed text-muted md:text-base">
                {description ? (
                  description
                ) : (
                  <>
                    I&rsquo;m {siteSettings.artistName} — the painter, the mess-maker and the
                    person who spends forty minutes mixing one shade of &ldquo;almost
                    pink&rdquo;. I make art the slow way: by hand, by feel, and usually with
                    a cup of tea going cold beside me.
                  </>
                )}
              </p>
            </StaggerItem>
            <StaggerItem>
              <p className="text-[15px] leading-relaxed text-muted md:text-base">
                Every piece in this studio began as a feeling I didn&rsquo;t want to lose —
                a light, a season, a person worth remembering.{" "}
                <span className="text-ink">
                  (This intro is placeholder copy — tell your story here.)
                </span>
              </p>
            </StaggerItem>
            <StaggerItem>
              <p className="font-hand text-2xl text-ink">
                Thank you for being here, it means more than you know.
              </p>
            </StaggerItem>
          </Stagger>

          <Reveal delay={0.35} className="mt-10 flex flex-wrap items-center gap-4">
            <Button size="lg" variant="outline" asChild>
              <Link href="/about">
                More About Me
                <ArrowUpRight className="size-4" strokeWidth={1.5} />
              </Link>
            </Button>
            <div className="flex flex-wrap gap-2">
              {["originals", "prints", "commissions"].map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-line bg-ivory px-3.5 py-1.5 text-[11px] uppercase tracking-[0.16em] text-muted"
                >
                  {chip}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
