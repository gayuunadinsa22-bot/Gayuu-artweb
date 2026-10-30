import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { siteSettings } from "@/lib/settings";

/** Tailwind class merge helper (shadcn-style). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Formats a number as Sri Lankan Rupees → "LKR 95,000" */
export function formatPrice(amount: number): string {
  return `${siteSettings.currencySymbol} ${new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(amount)}`;
}

/** Alias of `formatPrice` — used by the admin dashboard. */
export const formatCurrency = formatPrice;

/** Returns "LKR X" without the label — for aria labels etc. */
export function priceValue(amount: number): string {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(amount);
}

/** Simple slugify for dynamic use. */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Date → "12 October 2026" */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}


