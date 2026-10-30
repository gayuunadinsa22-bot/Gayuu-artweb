/**
 * WHATSAPP ORDER WORKFLOW
 * ──────────────────────
 * The checkout builds a readable order summary and opens a prefilled
 * WhatsApp chat with the studio. No payment is processed and nothing is
 * marked as paid — availability, delivery fees and payment are always
 * confirmed by the artist personally.
 *
 * This module also centralises phone-number normalisation so the public
 * site never links to a placeholder number when a real one is configured.
 */

import type { CartLine } from "@/lib/store";
import type { CheckoutValues, CommissionValues } from "@/lib/schemas";
import { formatPrice } from "@/lib/utils";
import { siteSettings } from "@/lib/settings";

const DEFAULT_WHATSAPP_NUMBER = "94771234567";
const DEFAULT_WHATSAPP_DISPLAY = "+94 77 123 4567";

function digitsOnly(value: string | null | undefined): string {
  return (value ?? "").replace(/[^0-9]/g, "");
}

/**
 * Normalizes a phone number to international format suitable for wa.me
 * (digits only, without the leading +). Handles Sri Lankan numbers
 * written as `0721404162`, `072 140 4162`, `94721404162`, `+94 72 …`
 * or a bare 9-digit mobile (`721404162`).
 */
export function normalizeWhatsAppNumber(raw: string | null | undefined): string {
  const digits = digitsOnly(raw);
  if (!digits) return "";

  // Already international (Sri Lanka country code).
  if (digits.startsWith("94") && digits.length >= 11) {
    return digits;
  }

  // Local format with a leading trunk 0 → replace it with +94.
  if (digits.startsWith("0") && digits.length >= 10) {
    return `94${digits.slice(1)}`;
  }

  // Bare Sri Lankan mobile number without the trunk 0 (9 digits, starts 7).
  if (digits.length === 9 && digits.startsWith("7")) {
    return `94${digits}`;
  }

  // Other international numbers are passed through unchanged.
  return digits;
}

/** Derives a readable display number from a stored/international number. */
export function formatWhatsAppDisplay(raw: string | null | undefined): string {
  const digits = digitsOnly(raw);
  if (!digits) return "";

  // Sri Lankan numbers: 94XXXXXXXXX
  if (digits.startsWith("94") && digits.length === 11) {
    const local = digits.slice(2);
    return `+94 ${local.slice(0, 2)} ${local.slice(2, 5)} ${local.slice(5)}`;
  }

  if (digits.length === 9 && digits.startsWith("7")) {
    return `+94 ${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5)}`;
  }

  return `+${digits}`;
}

/**
 * Returns the configured WhatsApp number normalized for wa.me links.
 * A real configured number always wins over the built-in placeholder,
 * even when the real value was only entered in the display field.
 */
export function getWhatsAppNumber(): string {
  const configured = normalizeWhatsAppNumber(siteSettings.whatsappNumber);
  const fromDisplay = normalizeWhatsAppNumber(siteSettings.whatsappDisplay);

  const configuredIsReal =
    configured !== "" && configured !== DEFAULT_WHATSAPP_NUMBER;
  if (configuredIsReal) return configured;

  const displayIsReal =
    fromDisplay !== "" && fromDisplay !== DEFAULT_WHATSAPP_NUMBER;
  if (displayIsReal) return fromDisplay;

  return configured || fromDisplay || DEFAULT_WHATSAPP_NUMBER;
}

/**
 * Returns the display number for UI. `whatsappDisplay` wins when the
 * admin set a custom value; otherwise the display is derived from
 * `whatsappNumber` so a changed number is never masked by the old
 * placeholder text.
 */
export function getWhatsAppDisplay(): string {
  const display = siteSettings.whatsappDisplay?.trim() ?? "";
  const number = getWhatsAppNumber();
  const displayDigits = normalizeWhatsAppNumber(display);
  const isPlaceholderDisplay =
    !display ||
    display === DEFAULT_WHATSAPP_DISPLAY ||
    displayDigits === DEFAULT_WHATSAPP_NUMBER;

  if (display && !isPlaceholderDisplay) return display;

  const derived = formatWhatsAppDisplay(number);
  if (derived) return derived;

  return display || DEFAULT_WHATSAPP_DISPLAY;
}

/** Builds a prefilled WhatsApp chat link using current settings. */
export function whatsappLink(message: string): string {
  return `https://wa.me/${getWhatsAppNumber()}?text=${encodeURIComponent(message)}`;
}

/* ------------------------------------------------------------------ */
/* Order + enquiry helpers                                            */
/* ------------------------------------------------------------------ */

export function generateOrderId(): string {
  const stamp = Date.now().toString(36).toUpperCase().slice(-4);
  const rand = Math.floor(Math.random() * 9000 + 1000);
  return `AM-${stamp}-${rand}`;
}

export interface OrderSummary {
  orderId: string;
  lines: CartLine[];
  subtotal: number;
  customer: CheckoutValues;
}

export function buildOrderMessage({ orderId, lines, subtotal, customer }: OrderSummary): string {
  const itemLines = lines
    .map(
      (l) =>
        `• ${l.title} — ×${l.quantity} — ${formatPrice(l.price * l.quantity)}`,
    )
    .join("\n");

  return [
    `Hello ${siteSettings.artistName}! I'd like to place an order inquiry 🌷`,
    ``,
    `Order ref: ${orderId}`,
    ``,
    `ARTWORKS`,
    itemLines,
    ``,
    `Subtotal: ${formatPrice(subtotal)}`,
    `(delivery fee & payment to be confirmed by the artist)`,
    ``,
    `MY DETAILS`,
    `Name: ${customer.name}`,
    `Email: ${customer.email}`,
    `Phone: ${customer.phone}`,
    ``,
    `SHIPPING`,
    `${customer.address}`,
    `${customer.city}, ${customer.district} ${customer.postalCode}`,
    ``,
    customer.orderNotes ? `NOTES\n${customer.orderNotes}\n` : ``,
    `I understand this is an order inquiry — availability, delivery and payment will be confirmed before anything is shipped. Thank you!`,
  ]
    .filter((segment): segment is string => segment !== undefined && segment !== "")
    .join("\n");
}

/** Opens WhatsApp with the prefilled order summary. */
export function openWhatsAppOrder(summary: OrderSummary): void {
  window.open(whatsappLink(buildOrderMessage(summary)), "_blank", "noopener,noreferrer");
}

/** Generic WhatsApp message helper for enquiry buttons. */
export function openWhatsApp(message: string): void {
  window.open(whatsappLink(message), "_blank", "noopener,noreferrer");
}

/** Builds the commission enquiry text (used by the commissions form). */
export function buildCommissionMessage(values: CommissionValues): string {
  return [
    `Hello ${siteSettings.artistName}! I'd like to enquire about a custom commission 🎨`,
    ``,
    `Name: ${values.name}`,
    `Email: ${values.email}`,
    `WhatsApp: ${values.whatsapp}`,
    ``,
    `PROJECT`,
    `Type: ${values.artworkType}`,
    values.dimensions ? `Size: ${values.dimensions}` : ``,
    `Budget: ${values.budget}`,
    ``,
    `DETAILS`,
    values.description,
    values.references ? `References: ${values.references}` : ``,
    ``,
    `I understand pricing and timing are confirmed by the artist before any work begins. Thank you!`,
  ]
    .filter((segment) => segment !== "")
    .join("\n");
}
