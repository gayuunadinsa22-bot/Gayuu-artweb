"use client";

import * as React from "react";
import Link from "next/link";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X, ArrowUpRight } from "lucide-react";
import { InstagramIcon } from "@/components/icons";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { navLinks, siteSettings } from "@/lib/settings";
import { whatsappLink } from "@/lib/whatsapp";
import { useUIStore } from "@/lib/store";
import { categories } from "@/lib/content";

export function MobileMenu() {
  const open = useUIStore((s) => s.menuOpen);
  const setOpen = useUIStore((s) => s.setMenuOpen);
  const pathname = usePathname();

  React.useEffect(() => {
    setOpen(false);
  }, [pathname, setOpen]);

  const list = [
    ...navLinks,
    { href: "/commissions", label: "Commissions" } as const,
  ];

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Content
          className="modal-panel fixed inset-0 z-[60] flex flex-col bg-ivory focus:outline-none"
          aria-label="Site menu"
        >
          {/* Top bar */}
          <div className="flex h-16 items-center justify-between border-b border-line px-5">
            <span className="font-serif text-[21px] tracking-tight">{siteSettings.brandName}</span>
            <DialogPrimitive.Close
              aria-label="Close menu"
              className="grid size-10 place-items-center rounded-full border border-line transition-colors hover:bg-ink hover:text-ivory"
            >
              <X className="size-4" strokeWidth={1.5} />
            </DialogPrimitive.Close>
          </div>

          {/* Links */}
          <nav aria-label="Mobile" className="flex flex-1 flex-col justify-center px-7">
            <ul>
              {list.map((link, index) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, y: 26 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 + index * 0.06, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="border-b border-line/70 py-4 last:border-0"
                >
                  <Link
                    href={link.href}
                    className="flex items-baseline justify-between gap-4"
                    onClick={() => setOpen(false)}
                  >
                    <span className="font-serif text-4xl leading-none tracking-tight text-ink">
                      {link.label}
                    </span>
                    <span className="font-hand text-xl text-blush-deep">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </nav>

          {/* Shop-by + social */}
          <div className="border-t border-line px-7 pb-8 pt-6">
            <p className="eyebrow mb-3">Shop by</p>
            <div className="mb-6 flex flex-wrap gap-x-4 gap-y-2">
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/shop?category=${category.slug}`}
                  onClick={() => setOpen(false)}
                  className="text-sm text-muted underline-offset-4 transition-colors hover:text-ink hover:underline"
                >
                  {category.name}
                </Link>
              ))}
            </div>
            <div className="flex items-center justify-between gap-4">
              <a
                href={siteSettings.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted transition-colors hover:text-ink"
              >
                <InstagramIcon className="size-4" strokeWidth={1.5} /> Instagram
              </a>
              <a
                href={whatsappLink(`Hello ${siteSettings.artistName}! I found your site 🌷`)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-full bg-ink px-5 py-2.5 text-xs font-medium tracking-wide text-ivory"
              >
                WhatsApp
                <ArrowUpRight className="size-3.5" strokeWidth={1.6} />
              </a>
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
