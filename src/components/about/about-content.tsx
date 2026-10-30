"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, ArrowDown } from "lucide-react";
import { ArtImage } from "@/components/shared/art-image";
import { Reveal, Stagger, StaggerItem } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";
import { siteSettings } from "@/lib/settings";
import { aboutImageDefaults, resolveMediaUrl } from "@/lib/site-images";

const journey = [
  {
    when: "[Year]",
    title: "The first little sale",
    body: "A small piece went to a real home, and I learned that art you make can live on someone else's wall. (Edit this milestone.)",
  },
  {
    when: "[Year]",
    title: "A corner of my own",
    body: "I turned a corner of my room into a proper studio — jars of brushes, a drying rack, paint in my hair most days.",
  },
  {
    when: "[Season]",
    title: "Commissions opened",
    body: "People started asking for portraits of their people and their pets, and saying yes felt like the best kind of adventure.",
  },
  {
    when: "Now",
    title: "Slow art, soft life",
    body: "Painting thoughtfully, releasing small collections, and keeping the whole thing personal — one piece at a time.",
  },
];

const inspirations = [
  "Golden light through curtains",
  "Old love letters & handwriting",
  "Gardens a little past their prime",
  "Colour combinations found by accident",
  "People watching, softly",
];

const materials = [
  "Artist-grade acrylics",
  "Oil sticks",
  "Gouache",
  "Cold-pressed watercolour paper",
  "Belgian linen",
  "Cotton canvas",
  "Archival pigment inks",
  "310gsm cotton rag",
  "Soft pastels",
  "Matte varnish",
];

export function AboutContent({
  content,
  images,
}: {
  content?: Record<string, string>;
  images?: {
    heroImageUrl?: string | null;
    portraitImageUrl?: string | null;
    studioImage1Url?: string | null;
    studioImage2Url?: string | null;
    studioImage3Url?: string | null;
  };
} = {}) {
  const heroRef = React.useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : -70]);

  const heroHeading = content?.heroHeading?.trim();
  const heroDescription = content?.heroDescription?.trim();
  const location = content?.location?.trim() || siteSettings.location;
  const artistName = content?.artistName?.trim() || siteSettings.artistName;
  const shortBiography = content?.shortBiography?.trim();
  const fullBiography = content?.fullBiography?.trim();
  const paintingPhilosophy = content?.paintingPhilosophy?.trim();
  const contactCTA = content?.contactCTA?.trim();
  const heroImageSrc = resolveMediaUrl(images?.heroImageUrl, aboutImageDefaults.heroImageUrl);
  const portraitSrc = resolveMediaUrl(images?.portraitImageUrl, aboutImageDefaults.portraitImageUrl);
  const studioShots = [
    {
      src: resolveMediaUrl(images?.studioImage1Url, aboutImageDefaults.studioImage1Url),
      alt: "The studio desk mid-project",
      caption: "the desk, mid-chaos",
    },
    {
      src: resolveMediaUrl(images?.studioImage2Url, aboutImageDefaults.studioImage2Url),
      alt: "Palette covered in mixed colours",
      caption: "too many pinks",
    },
    {
      src: resolveMediaUrl(images?.studioImage3Url, aboutImageDefaults.studioImage3Url),
      alt: "An artwork resting on the easel",
      caption: "step back & squint",
    },
  ];

  return (
    <>
      {/* ── HERO ─────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative overflow-hidden px-5 pb-14 pt-32 md:px-10 md:pt-44"
      >
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="animate-drift absolute -right-20 top-10 size-72 rounded-full bg-lavender/35 blur-3xl" />
          <div
            className="animate-drift absolute left-1/4 top-40 size-56 rounded-full bg-blush/25 blur-3xl"
            style={{ animationDelay: "-5s" }}
          />
        </div>

        <div className="mx-auto max-w-[1440px]">
          <Reveal className="max-w-5xl">
            <p className="eyebrow mb-7 flex items-center gap-3">
              <span aria-hidden className="h-px w-10 bg-blush" />
              about the artist
            </p>
            <h1 className="font-serif text-[13vw] leading-[0.96] tracking-[-0.025em] sm:text-[10vw] md:text-[7.6vw] lg:text-[104px]">
              {heroHeading ? (
                heroHeading
              ) : (
                <>
                  Creating little worlds,
                  <br />
                  one <span className="italic text-blush-deep">brushstroke</span> at a time.
                </>
              )}
            </h1>
          </Reveal>

          <Reveal delay={0.2} className="mt-8 flex flex-wrap items-center justify-between gap-6">
            <p className="max-w-md text-[15px] leading-relaxed text-muted md:text-base">
              {heroDescription ||
                "Half studio diary, half love letter — this page is about the hands, the habits and the quiet obsession behind every piece."}
            </p>
            <p className="font-hand rotate-[-4deg] text-xl text-muted">
              {location} · painting daily ♡
            </p>
          </Reveal>
        </div>

        {/* Wide portrait */}
        <div className="mx-auto mt-14 max-w-[1440px]">
          <Reveal delay={0.15}>
            <motion.div style={{ y: heroY }} className="overflow-hidden shadow-float">
              <ArtImage
                src={heroImageSrc}
                alt="Framed artwork in the studio"
                ratio="aspect-[16/9]"
                sizes="100vw"
                priority
                className="transition-transform duration-700"
              />
            </motion.div>
          </Reveal>
        </div>

        <div className="mx-auto mt-6 flex max-w-[1440px] items-center justify-between">
          <p className="text-xs uppercase tracking-[0.25em] text-muted">scroll to read</p>
          <ArrowDown className="size-4 animate-bounce text-blush-deep" strokeWidth={1.5} />
        </div>
      </section>

      {/* ── INTRODUCTION ─────────────────────────────── */}
      <section className="px-5 py-20 md:px-10 md:py-28">
        <div className="mx-auto grid max-w-[1440px] items-center gap-14 lg:grid-cols-12 lg:gap-20">
          <Reveal className="lg:col-span-5">
            <div className="relative">
              <div className="absolute -bottom-4 -right-4 hidden h-full w-full border border-sage md:block" />
              <ArtImage
                src={portraitSrc}
                alt={`${artistName}, the artist`}
                ratio="aspect-[4/5]"
                sizes="(max-width: 1024px) 92vw, 40vw"
              />
            </div>
          </Reveal>

          <div className="lg:col-span-7">
            <Reveal>
              <p className="eyebrow mb-6">Hello there</p>
              <h2 className="font-serif text-4xl leading-[1.05] tracking-[-0.02em] sm:text-5xl md:text-6xl">
                I paint the things I want to{" "}
                <span className="italic text-blush-deep">remember.</span>
              </h2>
            </Reveal>
            <Stagger className="mt-7 max-w-xl space-y-5" delay={0.15}>
              <StaggerItem>
                <p className="text-[15px] leading-relaxed text-muted md:text-base">
                  {shortBiography ||
                    `I’m ${artistName} — a self-taught artist who always came back to colour, no matter what else was going on. (This is placeholder copy: replace it with your own introduction, in your own voice — a few honest sentences beat a long biography.)`}
                </p>
              </StaggerItem>
              <StaggerItem>
                <p className="text-[15px] leading-relaxed text-muted md:text-base">
                  {fullBiography ||
                    "My work is soft but not shy — warm neutrals with a blush of colour, texture you can feel from across the room, and details that reward anyone who steps closer. I make everything myself, in small batches, usually with music playing and at least one cup of tea gone cold."}
                </p>
              </StaggerItem>
              <StaggerItem>
                <p className="text-[15px] leading-relaxed text-muted md:text-base">
                  {"When I’m not painting, I’m wrapping parcels like they’re gifts, answering your lovely messages, or rearranging the studio for the twelfth time."}
                </p>
              </StaggerItem>
              <StaggerItem>
                <p className="font-hand text-2xl text-ink">so happy you found your way here ♡</p>
              </StaggerItem>
            </Stagger>
          </div>
        </div>
      </section>

      {/* ── CREATIVE JOURNEY ─────────────────────────── */}
      <section className="bg-cream/50 px-5 py-20 md:px-10 md:py-28">
        <div className="mx-auto grid max-w-[1440px] gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-4">
            <div className="lg:sticky lg:top-32">
              <p className="eyebrow mb-6">The journey</p>
              <h2 className="font-serif text-4xl leading-[1.05] tracking-[-0.02em] sm:text-5xl md:text-6xl">
                A very unhurried <span className="italic">becoming.</span>
              </h2>
              <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted">
                Milestones are personal — edit these to your own story (they&rsquo;re
                clearly marked placeholders).
              </p>
            </div>
          </Reveal>

          <div className="lg:col-span-8">
            <Stagger className="space-y-0" gap={0.12}>
              {journey.map((step) => (
                <StaggerItem key={step.title}>
                  <div className="group grid gap-3 border-t border-line py-8 sm:grid-cols-[110px_1fr] sm:gap-8">
                    <span className="font-hand text-xl text-blush-deep">{step.when}</span>
                    <div>
                      <h3 className="font-serif text-2xl leading-tight transition-colors group-hover:text-blush-deep md:text-3xl">
                        {step.title}
                      </h3>
                      <p className="mt-2.5 max-w-lg text-sm leading-relaxed text-muted">
                        {step.body}
                      </p>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </section>

      {/* ── INSPIRATION + MATERIALS ──────────────────── */}
      <section className="px-5 py-20 md:px-10 md:py-28">
        <div className="mx-auto grid max-w-[1440px] gap-14 lg:grid-cols-2 lg:gap-24">
          <div>
            <Reveal>
              <p className="eyebrow mb-6">What finds me</p>
              <h2 className="font-serif text-4xl leading-tight tracking-[-0.02em] sm:text-5xl">
                Things that make me{" "}
                <span className="italic text-blush-deep">want to paint.</span>
              </h2>
            </Reveal>
            <ul className="mt-8">
              {inspirations.map((item, index) => (
                <Reveal key={item} delay={index * 0.06}>
                  <li className="group flex items-baseline gap-5 border-b border-line py-4">
                    <span className="text-xs tabular-nums text-muted">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="font-serif text-xl transition-colors group-hover:text-blush-deep md:text-2xl">
                      {item}
                    </span>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>

          <div>
            <Reveal delay={0.1}>
              <p className="eyebrow mb-6">In my hands</p>
              <h2 className="font-serif text-4xl leading-tight tracking-[-0.02em] sm:text-5xl">
                Favourite <span className="italic">materials.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.2} className="mt-8 flex flex-wrap gap-2.5">
              {materials.map((material, index) => (
                <span
                  key={material}
                  className={`rounded-full border px-4 py-2 text-sm transition-all duration-300 hover:border-blush hover:bg-blush/20 ${
                    index % 3 === 0
                      ? "border-blush/60 text-ink"
                      : index % 3 === 1
                        ? "border-sage/70 text-ink"
                        : "border-lavender text-ink"
                  }`}
                >
                  {material}
                </span>
              ))}
            </Reveal>
            <Reveal delay={0.3} className="mt-8">
              <p className="font-hand text-xl text-muted">
                natural light, good music, zero rush
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── STUDIO PHOTOGRAPHY ───────────────────────── */}
      <section className="px-5 pb-20 md:px-10 md:pb-28">
        <div className="mx-auto max-w-[1440px]">
          <Reveal>
            <p className="eyebrow mb-8">Studio notes</p>
          </Reveal>
          <div className="grid gap-5 md:grid-cols-3">
            {studioShots.map((shot, index) => (
              <Reveal
                key={shot.src}
                delay={index * 0.08}
                className={index === 1 ? "md:mt-12" : index === 2 ? "md:mt-6" : ""}
              >
                <figure className="group">
                  <ArtImage
                    src={shot.src}
                    alt={shot.alt}
                    ratio="aspect-[4/5]"
                    sizes="(max-width: 768px) 92vw, 30vw"
                    className="transition-transform duration-[1.3s] group-hover:scale-[1.05]"
                  />
                  <figcaption className="font-hand mt-3 text-lg text-muted">
                    {shot.caption}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── PHILOSOPHY ───────────────────────────────── */}
      <section className="relative overflow-hidden bg-ink px-5 py-24 text-ivory md:px-10 md:py-32">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -left-20 top-0 size-72 rounded-full bg-blush/12 blur-3xl" />
          <div className="absolute -right-16 bottom-0 size-72 rounded-full bg-sage/12 blur-3xl" />
        </div>

        <Reveal className="relative mx-auto max-w-4xl text-center">
          <p className="eyebrow mb-8 flex justify-center text-ivory/55">Studio philosophy</p>
          <blockquote className="font-serif text-4xl leading-[1.15] tracking-[-0.01em] sm:text-5xl md:text-6xl">
            &ldquo;Paint the feeling, not the thing —{" "}
            <span className="italic text-blush">the rest arrives on its own.</span>&rdquo;
          </blockquote>
          <p className="mx-auto mt-8 max-w-xl text-[15px] leading-relaxed text-ivory/65">
            {paintingPhilosophy ||
              "I believe art should feel like a person made it: a little imperfect, a little intimate, and full of care. That's why nothing here is mass produced, and why every order comes with a handwritten note. (Placeholder philosophy — make it yours.)"}
          </p>
          <p className="font-hand mt-8 text-2xl text-blush">— {siteSettings.artistFullName}</p>
        </Reveal>
      </section>

      {/* ── CONTACT CTA ──────────────────────────────── */}
      <section className="px-5 py-20 md:px-10 md:py-28">
        <Reveal className="mx-auto flex max-w-[1120px] flex-col items-center gap-7 rounded-[32px] border border-line bg-gradient-to-br from-sage/20 via-ivory to-lavender/30 px-6 py-16 text-center md:px-16">
          <p className="eyebrow flex justify-center">What happens next</p>
          <h2 className="max-w-2xl font-serif text-4xl leading-[1.05] tracking-[-0.02em] sm:text-5xl md:text-6xl">
            Let&rsquo;s create something{" "}
            <span className="italic text-blush-deep">together.</span>
          </h2>
          <p className="max-w-md text-[15px] leading-relaxed text-muted">
            {contactCTA ||
              "Have a wall that needs a story, or an idea you can't stop thinking about? Commissions are the best kind of collaboration."}
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/commissions">
                Request a custom piece
                <ArrowUpRight className="size-4" strokeWidth={1.5} />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/contact">Just say hello</Link>
            </Button>
          </div>
        </Reveal>
      </section>
    </>
  );
}
