import Link from "next/link";
import { ArrowUpRight, Mail, MessageCircle } from "lucide-react";
import { InstagramIcon } from "@/components/icons";
import { navLinks, siteSettings } from "@/lib/settings";
import { whatsappLink, getWhatsAppDisplay } from "@/lib/whatsapp";
import { currentYear } from "@/lib/year";
import { categories } from "@/lib/content";

export function Footer() {
  const year = currentYear;

  return (
    <footer className="relative overflow-hidden border-t border-line bg-cream/40">
      {/* Big editorial CTA */}
      <div className="border-b border-line px-5 py-14 md:px-10 md:py-20">
        <Link href="/contact" className="group mx-auto block max-w-[1440px]">
          <p className="eyebrow mb-6">Say hello</p>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 className="max-w-4xl font-serif text-5xl leading-[1] tracking-[-0.02em] sm:text-6xl md:text-7xl lg:text-8xl">
              Let&rsquo;s make something{" "}
              <span className="italic text-blush-deep transition-colors group-hover:text-ink">
                beautiful
              </span>
            </h2>
            <span className="mb-3 grid size-14 place-items-center rounded-full border border-ink transition-all duration-500 group-hover:rotate-45 group-hover:bg-ink group-hover:text-ivory md:size-16">
              <ArrowUpRight className="size-6" strokeWidth={1.2} />
            </span>
          </div>
        </Link>
      </div>

      {/* Link columns */}
      <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-14 md:grid-cols-[1.4fr_1fr_1fr_1.2fr] md:px-10">
        <div>
          <p className="font-serif text-2xl tracking-tight">
            {siteSettings.brandName}
            <span className="ml-1 font-hand text-xl text-blush-deep" aria-hidden>
              ♡
            </span>
          </p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">{siteSettings.about}</p>
          <p className="font-hand mt-4 text-lg text-ink/70">made with love ♡</p>
        </div>

        <nav aria-label="Footer">
          <p className="eyebrow mb-4">Explore</p>
          <ul className="space-y-2.5">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="link-underline text-sm text-muted transition-colors hover:text-ink"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/commissions"
                className="link-underline text-sm text-muted transition-colors hover:text-ink"
              >
                Commissions
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <p className="eyebrow mb-4">Shop</p>
          <ul className="space-y-2.5">
            {categories.map((category) => (
              <li key={category.slug}>
                <Link
                  href={`/shop?category=${category.slug}`}
                  className="link-underline text-sm text-muted transition-colors hover:text-ink"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="eyebrow mb-4">Connect</p>
          <ul className="space-y-3">
            <li>
              <a
                href={`mailto:${siteSettings.contactEmail}`}
                className="group flex items-center gap-2.5 text-sm text-muted transition-colors hover:text-ink"
              >
                <Mail className="size-4" strokeWidth={1.5} />
                {siteSettings.contactEmail}
              </a>
            </li>
            <li>
              <a
                href={whatsappLink(`Hello ${siteSettings.artistName}! 🌷`)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-sm text-muted transition-colors hover:text-ink"
              >
                <MessageCircle className="size-4" strokeWidth={1.5} />
                {getWhatsAppDisplay()}
              </a>
            </li>
            <li>
              <a
                href={siteSettings.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-sm text-muted transition-colors hover:text-ink"
              >
                <InstagramIcon className="size-4" strokeWidth={1.5} />
                Instagram
              </a>
            </li>
            <li>
              <a
                href={siteSettings.social.pinterest}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-sm text-muted transition-colors hover:text-ink"
              >
                <span className="grid size-4 place-items-center font-serif text-sm leading-none">
                  P
                </span>
                Pinterest
              </a>
            </li>
            <li>
              <a
                href={siteSettings.social.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-sm text-muted transition-colors hover:text-ink"
              >
                <span className="grid size-4 place-items-center font-serif text-sm leading-none">
                  T
                </span>
                TikTok
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-line px-5 py-6 md:px-10">
        <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-3 text-xs text-muted md:flex-row">
          <p>
            © {year} {siteSettings.brandName} · All rights reserved
          </p>
          <p className="tracking-wide">
            All prices in {siteSettings.currency} · Handmade in {siteSettings.location}
          </p>
        </div>
      </div>
    </footer>
  );
}
