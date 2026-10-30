"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { categories } from "@/lib/content";
import { ArtImage } from "@/components/shared/art-image";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { cn } from "@/lib/utils";

const layout: Record<string, string> = {
  "original-paintings": "md:col-span-5 md:row-span-2 min-h-[320px] md:min-h-[560px]",
  "art-prints": "md:col-span-4 min-h-[260px] md:min-h-[266px]",
  "custom-portraits": "md:col-span-3 min-h-[260px] md:min-h-[266px]",
  "sketches-drawings": "md:col-span-4 min-h-[260px] md:min-h-[266px]",
  "mini-artworks": "md:col-span-3 min-h-[260px] md:min-h-[266px]",
};

export function Categories() {
  return (
    <section className="px-5 py-20 md:px-10 md:py-28">
      <div className="mx-auto max-w-[1440px]">
        <SectionHeading
          kicker="Shop by category"
          title={
            <>
              Five little worlds <span className="italic">to get lost in.</span>
            </>
          }
          subtitle="Originals, prints and small treasures — every category has its own kind of magic."
        />

        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3 md:grid-rows-2">
          {categories.map((category, index) => (
            <Reveal key={category.slug} delay={index * 0.07} className={cn("group relative", layout[category.slug])}>
              <Link
                href={`/shop?category=${category.slug}`}
                className="relative flex h-full flex-col justify-end overflow-hidden rounded-[22px] bg-cream"
                aria-label={`Shop ${category.name}`}
              >
                <ArtImage
                  src={category.image}
                  alt={category.name}
                  ratio=""
                  sizes="(max-width: 768px) 92vw, 45vw"
                  className="transition-transform duration-[1.4s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.07]"
                  frameClassName="absolute inset-0"
                />

                {/* Legibility gradient */}
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/15 to-transparent transition-opacity duration-500 group-hover:from-ink/80"
                />

                {/* Hover arrow */}
                <span className="absolute right-5 top-5 grid size-11 -translate-y-2 place-items-center rounded-full bg-ivory/90 text-ink opacity-0 backdrop-blur transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  <ArrowUpRight className="size-5" strokeWidth={1.4} />
                </span>

                <div className="relative p-6 md:p-7">
                  <h3 className="font-serif text-3xl leading-none text-ivory md:text-4xl">
                    {category.name}
                  </h3>
                  <p className="mt-2.5 max-w-sm text-sm leading-relaxed text-ivory/85">
                    {category.blurb}
                  </p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
