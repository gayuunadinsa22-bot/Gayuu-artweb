"use client";

import { testimonials as localTestimonials, type Testimonial } from "@/lib/content";
import { SectionHeading } from "@/components/shared/section-heading";
import { Stagger, StaggerItem } from "@/components/shared/reveal";

export function Testimonials({
  items,
}: {
  /** Reviews from the data layer; falls back to local content. */
  items?: Testimonial[];
}) {
  const list = items ?? localTestimonials;

  // Hide the section entirely when there are no reviews to show.
  if (list.length === 0) return null;

  return (
    <section className="px-5 py-20 md:px-10 md:py-28">
      <div className="mx-auto max-w-[1440px]">
        <SectionHeading
          align="center"
          kicker="Customer love"
          title={
            <>
              Kind words, <span className="italic text-blush-deep">happy hearts.</span>
            </>
          }
        />

        <Stagger className="mt-16 grid gap-x-14 gap-y-12 md:grid-cols-2" delay={0.1}>
          {list.map((item) => (
            <StaggerItem key={item.name}>
              <figure className="border-t border-line pt-8">
                <span
                  aria-hidden
                  className="mb-3 block font-serif text-6xl leading-[0.4] text-blush"
                >
                  &ldquo;
                </span>
                <blockquote className="font-serif text-2xl leading-[1.35] text-ink md:text-[28px]">
                  {item.quote}
                </blockquote>
                <figcaption className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="text-sm font-medium text-ink">{item.name}</span>
                  {item.location && (
                    <>
                      <span aria-hidden className="size-1 rounded-full bg-blush" />
                      <span className="text-sm text-muted">{item.location}</span>
                    </>
                  )}
                  {item.work && (
                    <span className="ml-auto font-hand text-lg text-muted">
                      on {item.work}
                    </span>
                  )}
                </figcaption>
              </figure>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
