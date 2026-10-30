"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

/**
 * The admin dashboard lives at `/admin` but still renders inside this
 * root layout, so the storefront chrome (navbar, footer, cart/wishlist
 * drawers, search dialog, WhatsApp button) would otherwise show up
 * around the dashboard and its own header/sidebar.
 *
 * This gate hides the storefront chrome on `/admin/**` — the dashboard
 * provides its own shell. Everything else (login page included) keeps
 * the site's normal framing.
 */
export function StorefrontChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  return <>{children}</>;
}
