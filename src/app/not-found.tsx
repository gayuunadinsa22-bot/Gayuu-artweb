import type { Metadata } from "next";
import Link from "next/link";

import { navLinks } from "@/lib/settings";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Page not found",
  description: "This page doesn't exist — head back to the studio.",
};

export default function NotFound() {
  return (
    <section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden px-5 py-32 text-center md:px-10">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="animate-drift absolute -right-20 top-10 size-72 rounded-full bg-blush/25 blur-3xl" />
        <div
          className="animate-drift absolute left-1/4 bottom-10 size-56 rounded-full bg-lavender/40 blur-3xl"
          style={{ animationDelay: "-5s" }}
        />
        <div
          className="animate-float absolute left-10 top-24 text-3xl text-blush-deep"
          aria-hidden
        >
          ♡
        </div>
        <div
          className="animate-float-slow absolute right-14 bottom-24 text-4xl text-sage"
          style={{ animationDelay: "-4s" }}
          aria-hidden
        >
          ✦
        </div>
      </div>

      <div className="mx-auto max-w-2xl">
        <p className="eyebrow flex items-center justify-center gap-3">
          <span aria-hidden className="h-px w-10 bg-blush" />
          404 · lost canvas
          <span aria-hidden className="h-px w-10 bg-blush" />
        </p>

        <h1 className="mt-6 font-serif text-[22vw] leading-[0.9] tracking-[-0.03em] sm:text-[16vw] md:text-[150px]">
          This one&rsquo;s still{" "}
          <span className="italic text-blush-deep">wet.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-md text-[15px] leading-relaxed text-muted md:text-base">
          The page you&rsquo;re looking for doesn&rsquo;t exist — maybe it sold,
          maybe it never made it out of the sketchbook. Either way, let&rsquo;s
          get you back somewhere lovely.
        </p>

        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button size="lg" asChild>
            <Link href="/">
              Back to the studio
              <span aria-hidden>→</span>
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/shop">Browse the shop</Link>
          </Button>
        </div>

        <nav
          aria-label="Quick links"
          className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t border-line pt-8"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="link-underline text-sm text-muted transition-colors hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <p className="font-hand mt-8 text-xl text-muted">
          every wall deserves the right piece ♡
        </p>
      </div>
    </section>
  );
}
