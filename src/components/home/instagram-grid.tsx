"use client";

import { ArrowUpRight } from "lucide-react";
import { InstagramIcon } from "@/components/icons";
import { siteSettings } from "@/lib/settings";
import { ArtImage } from "@/components/shared/art-image";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";

const posts = [
  { src: "/images/work-golden-hour-detail.jpg", alt: "Golden Hour — detail" },
  { src: "/images/studio-hands.jpg", alt: "Layering colour in the studio" },
  { src: "/images/work-paper-hearts.jpg", alt: "Paper Hearts mini original" },
  { src: "/images/gallery-frames.jpg", alt: "Framed pieces on the wall" },
  { src: "/images/work-lavender-haze-detail.jpg", alt: "Lavender Haze — texture" },
  { src: "/images/studio-brushes.jpg", alt: "Paint-stained brushes" },
  { src: "/images/work-confetti-sky.jpg", alt: "Confetti Sky print" },
  { src: "/images/studio-desk.jpg", alt: "The studio desk" },
];

export function InstagramGrid({
  sections,
}: {
  /** Edited copy from Admin → Homepage (falls back to defaults). */
  sections?: Record<string, string>;
}) {
  const heading = sections?.heading?.trim();

  return (
    <section className="bg-cream/50 px-5 py-20 md:px-10 md:py-28">
      <div className="mx-auto max-w-[1440px]">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <SectionHeading
            kicker="On instagram"
            title={
              heading ? (
                heading
              ) : (
                <>
                  Art, life &amp; <span className="italic text-blush-deep">little moments.</span>
                </>
              )
            }
          />
          <Reveal delay={0.1}>
            <a
              href={siteSettings.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2.5 rounded-full border border-ink/25 px-6 py-3 text-sm font-medium tracking-wide transition-all duration-300 hover:border-ink hover:bg-ink hover:text-ivory"
            >
              <InstagramIcon className="size-4" strokeWidth={1.5} />
              Follow the journey on Instagram
              <ArrowUpRight
                className="size-4 transition-transform duration-300 group-hover:rotate-45"
                strokeWidth={1.5}
              />
            </a>
          </Reveal>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {posts.map((post, index) => (
            <Reveal key={post.src} delay={(index % 4) * 0.06}>
              <a
                href={siteSettings.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block"
                aria-label="View this post on Instagram"
              >
                <ArtImage
                  src={post.src}
                  alt={post.alt}
                  ratio="aspect-square"
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.08]"
                />
                <span className="absolute inset-0 flex items-center justify-center bg-ink/0 opacity-0 backdrop-blur-0 transition-all duration-500 group-hover:bg-ink/35 group-hover:opacity-100">
                  <InstagramIcon className="size-7 text-ivory" strokeWidth={1.3} />
                </span>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
