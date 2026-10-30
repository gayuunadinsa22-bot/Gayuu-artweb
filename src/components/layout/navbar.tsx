"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, ShoppingBag, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { navLinks, siteSettings } from "@/lib/settings";
import { useCartStore, useUIStore, useWishlistStore, rehydrateStores } from "@/lib/store";
import { cn } from "@/lib/utils";

function CountBadge({ count }: { count: number }) {
  return (
    <AnimatePresence>
      {count > 0 ? (
        <motion.span
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 24 }}
          className="absolute -right-1.5 -top-1.5 grid size-4 min-w-4 place-items-center rounded-full bg-ink px-1 font-sans text-[9px] font-medium leading-none text-ivory"
        >
          {count}
        </motion.span>
      ) : null}
    </AnimatePresence>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = React.useState(false);

  const setCartOpen = useUIStore((s) => s.setCartOpen);
  const setWishlistOpen = useUIStore((s) => s.setWishlistOpen);
  const setSearchOpen = useUIStore((s) => s.setSearchOpen);
  const setMenuOpen = useUIStore((s) => s.setMenuOpen);

  const cartCount = useCartStore((s) =>
    s.lines.reduce((total, line) => total + line.quantity, 0),
  );
  const cartHydrated = useCartStore((s) => s.hydrated);
  const wishlistCount = useWishlistStore((s) => s.ids.length);
  const wishlistHydrated = useWishlistStore((s) => s.hydrated);

  React.useEffect(() => {
    rehydrateStores();
  }, []);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  const iconBtn =
    "relative grid size-10 place-items-center rounded-full text-ink transition-all duration-300 hover:bg-cream hover:text-blush-deep";

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-all duration-500",
        scrolled
          ? "border-b border-line bg-ivory/78 backdrop-blur-xl supports-[backdrop-filter]:bg-ivory/65"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-4 px-5 md:h-20 md:px-10">
        {/* Mobile: menu trigger */}
        <button
          type="button"
          aria-label="Open menu"
          onClick={() => setMenuOpen(true)}
          className={cn(iconBtn, "md:hidden -ml-2")}
        >
          <Menu className="size-5" strokeWidth={1.5} />
        </button>

        {/* Brand */}
        <Link
          href="/"
          className="group flex shrink-0 items-start gap-0.5"
          aria-label={`${siteSettings.brandName} — home`}
        >
          <span className="font-serif text-[21px] tracking-tight text-ink transition-colors group-hover:text-blush-deep md:text-[26px]">
            {siteSettings.brandName}
          </span>
          <span className="font-hand text-base leading-none text-blush-deep md:text-xl" aria-hidden>
            ♡
          </span>
        </Link>

        {/* Desktop nav */}
        <nav
          aria-label="Primary"
          className="hidden items-center gap-8 lg:absolute lg:left-1/2 lg:top-1/2 lg:flex lg:-translate-x-1/2 lg:-translate-y-1/2"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              data-active={isActive(link.href)}
              className="link-underline font-sans text-[11.5px] uppercase tracking-[0.2em] text-ink/75 transition-colors data-[active=true]:text-ink hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-0.5 md:gap-1">
          <button
            type="button"
            aria-label="Search artworks"
            onClick={() => setSearchOpen(true)}
            className={iconBtn}
          >
            <Search className="size-[18px]" strokeWidth={1.5} />
          </button>

          <button
            type="button"
            aria-label={`Wishlist (${wishlistCount} saved)`}
            onClick={() => setWishlistOpen(true)}
            className={cn(iconBtn, "hidden sm:grid")}
          >
            <Heart className="size-[18px]" strokeWidth={1.5} />
            <CountBadge count={wishlistHydrated ? wishlistCount : 0} />
          </button>

          <button
            type="button"
            aria-label={`Shopping bag (${cartCount} items)`}
            onClick={() => setCartOpen(true)}
            className={iconBtn}
          >
            <ShoppingBag className="size-[18px]" strokeWidth={1.5} />
            <CountBadge count={cartHydrated ? cartCount : 0} />
          </button>
        </div>
      </div>
    </header>
  );
}
