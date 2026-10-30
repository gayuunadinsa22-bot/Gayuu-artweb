import type { Metadata } from "next";

import { getSiteSettings } from "@/lib/data/storefront";
import { ContactContent } from "@/components/contact/contact-content";
import { getContactChannels } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: "Contact",
    description: `Get in touch with ${settings.brandName} — WhatsApp, email or Instagram. Questions about artwork, shipping, orders and commissions are all welcome.`,
  };
}

export default async function ContactPage() {
  const settings = await getSiteSettings();
  const contactChannels = getContactChannels();
  return (
    <>
      <section className="relative overflow-hidden border-b border-line bg-gradient-to-b from-lavender/30 via-cream/70 to-ivory px-5 pb-16 pt-36 text-center md:px-10 md:pb-20 md:pt-48">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="animate-drift absolute -right-24 top-8 size-72 rounded-full bg-blush/30 blur-3xl" />
          <div
            className="animate-drift absolute left-1/3 top-20 size-56 rounded-full bg-sage/30 blur-3xl"
            style={{ animationDelay: "-6s" }}
          />
        </div>

        <div className="mx-auto max-w-3xl">
          <p className="eyebrow mb-7 flex items-center justify-center gap-3">
            <span aria-hidden className="h-px w-10 bg-blush" />
            contact
            <span aria-hidden className="h-px w-10 bg-blush" />
          </p>
          <h1 className="font-serif text-[13vw] leading-[0.98] tracking-[-0.025em] sm:text-[9vw] md:text-[6.5vw] lg:text-[86px]">
            Let&rsquo;s <span className="italic text-blush-deep">talk</span>{" "}
            art.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-[15px] leading-relaxed text-muted md:text-base">
            Whether it&rsquo;s a question about a piece, a commission idea, or
            just a hello — the studio reads every message personally.
          </p>
          <p className="font-hand mt-5 rotate-[-3deg] text-xl text-muted">
            {settings.location} · replies within a day ♡
          </p>
        </div>
      </section>

      <div className="pt-10 md:pt-14">
        <ContactContent contactChannels={contactChannels} />
      </div>
    </>
  );
}
