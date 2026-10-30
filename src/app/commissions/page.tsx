import type { Metadata } from "next";

import { getSiteSettings } from "@/lib/data/storefront";
import { CommissionsContent } from "@/components/commissions/commissions-content";
import { getCommissionTypes } from "@/lib/data/storefront";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: "Commissions",
    description: `Commission a custom artwork by ${settings.artistName} — portraits, pet paintings, couple portraits and personalised pieces, made by hand in Sri Lanka.`,
  };
}

export default async function CommissionsPage() {
  const commissionTypes = await getCommissionTypes();
  return (
    <>
      <section className="relative overflow-hidden border-b border-line bg-gradient-to-b from-blush/25 via-cream/70 to-ivory px-5 pb-16 pt-36 md:px-10 md:pb-24 md:pt-48">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="animate-drift absolute -right-24 top-6 size-72 rounded-full bg-lavender/45 blur-3xl" />
          <div
            className="animate-drift absolute left-1/4 top-24 size-56 rounded-full bg-blush/30 blur-3xl"
            style={{ animationDelay: "-5s" }}
          />
        </div>

        <div className="mx-auto max-w-4xl text-center">
          <p className="eyebrow mb-7 flex items-center justify-center gap-3">
            <span aria-hidden className="h-px w-10 bg-blush" />
            commissions
            <span aria-hidden className="h-px w-10 bg-blush" />
          </p>
          <h1 className="font-serif text-[13vw] leading-[0.98] tracking-[-0.025em] sm:text-[9vw] md:text-[6.5vw] lg:text-[86px]">
            Your idea, <span className="italic text-blush-deep">painted</span>{" "}
            by hand.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-[15px] leading-relaxed text-muted md:text-base">
            One-of-a-kind pieces created for you — for a wall you love, a person
            you love, or a moment you want to keep.
          </p>
          <p className="font-hand mt-5 rotate-[-3deg] text-xl text-muted">
            portraits · pets · abstracts · gifts
          </p>
        </div>
      </section>

      <CommissionsContent commissionTypes={commissionTypes} />
    </>
  );
}
