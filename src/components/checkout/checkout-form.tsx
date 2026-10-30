"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  ArrowRight,
  Info,
  MessageCircle,
  Check,
  PartyPopper,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  checkoutSchema,
  districts,
  type CheckoutValues,
} from "@/lib/schemas";
import {
  useCartStore,
  useUIStore,
  cartSubtotal,
  type CartLine,
} from "@/lib/store";
import { generateOrderId, openWhatsAppOrder, buildOrderMessage, type OrderSummary } from "@/lib/whatsapp";
import { whatsappLink } from "@/lib/whatsapp";
import { siteSettings } from "@/lib/settings";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

/* ── Field wrapper ─────────────────────────────────────────── */

function Field({
  label,
  error,
  children,
  className,
  optional,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
  optional?: boolean;
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Label className="flex items-baseline gap-2">
        {label}
        {optional ? <span className="normal-case tracking-normal">(optional)</span> : null}
      </Label>
      {children}
      {error ? (
        <p role="alert" className="text-xs text-blush-deep">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/* ── Summary ───────────────────────────────────────────────── */

function Summary({ lines, subtotal }: { lines: CartLine[]; subtotal: number }) {
  return (
    <div className="rounded-3xl border border-line bg-cream/60 p-7">
      <h2 className="font-serif text-3xl tracking-tight">
        Your order <span className="font-hand text-xl text-blush-deep">({lines.length})</span>
      </h2>

      <ul className="mt-6 space-y-4">
        {lines.map((line) => (
          <li key={line.id} className="flex gap-3.5">
            <span className="relative h-16 w-14 shrink-0 overflow-hidden bg-ivory">
              <Image src={line.image} alt={line.title} fill sizes="56px" className="object-cover" />
              <span className="absolute -right-0.5 -top-0.5 grid size-4 place-items-center rounded-full bg-ink text-[9px] text-ivory">
                {line.quantity}
              </span>
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-serif text-lg leading-tight">{line.title}</p>
              <p className="mt-0.5 text-xs text-muted">
                {formatPrice(line.price)}
                {line.quantity > 1 ? ` × ${line.quantity}` : ""}
              </p>
            </div>
            <p className="text-sm tabular-nums">
              {formatPrice(line.price * line.quantity)}
            </p>
          </li>
        ))}
      </ul>

      <dl className="mt-6 space-y-3 border-t border-line pt-5 text-sm">
        <div className="flex items-baseline justify-between">
          <dt className="text-muted">Subtotal</dt>
          <dd className="font-serif text-xl tabular-nums">{formatPrice(subtotal)}</dd>
        </div>
        <div className="flex items-baseline justify-between">
          <dt className="text-muted">Delivery</dt>
          <dd className="text-muted">Confirmed on WhatsApp</dd>
        </div>
        <div className="flex items-baseline justify-between">
          <dt className="text-muted">Payment</dt>
          <dd className="text-muted">Arranged after confirmation</dd>
        </div>
      </dl>

      <div className="mt-4 rounded-2xl bg-lavender/40 p-4">
        <p className="flex gap-2.5 text-xs leading-relaxed text-ink/80">
          <Info className="mt-0.5 size-4 shrink-0 text-blush-deep" strokeWidth={1.6} />
          This is an <strong className="font-medium">order inquiry</strong>, not a payment.
          {siteSettings.artistName} will confirm availability, delivery fees and payment
          with you before anything is shipped.
        </p>
      </div>
    </div>
  );
}

/* ── Success ───────────────────────────────────────────────── */

function Success({
  orderId,
  summary,
  saved,
  onReset,
}: {
  orderId: string;
  summary: OrderSummary;
  /** True only when the server confirmed the inquiry was stored. */
  saved: boolean;
  onReset: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto max-w-xl py-10 text-center"
    >
      <div className="mx-auto grid size-20 place-items-center rounded-full bg-blush/30">
        <PartyPopper className="size-8 text-blush-deep" strokeWidth={1.4} />
      </div>
      <p className="font-hand mt-6 text-2xl text-blush-deep">order sent ♡</p>
      <h1 className="mt-2 font-serif text-5xl leading-tight tracking-tight">
        Your inquiry is on its way!
      </h1>
      <p className="mt-4 text-[15px] leading-relaxed text-muted">
        {saved ? (
          <>
            Your inquiry (reference{" "}
            <span className="font-medium text-ink">{orderId}</span>) is saved in the
            studio&rsquo;s order book, and your WhatsApp chat with the studio should
            have opened with the order summary. Just hit send — and{" "}
            {siteSettings.artistName} will reply to confirm everything personally.
          </>
        ) : (
          <>
            Your WhatsApp chat with the studio should have opened with your order summary
            (reference <span className="font-medium text-ink">{orderId}</span>). Just hit send
            — and {siteSettings.artistName} will reply to confirm everything personally.
          </>
        )}
      </p>

      <ol className="mx-auto mt-8 max-w-sm space-y-3 text-left">
        {[
          "Availability of each piece is confirmed",
          "Delivery fee for your address is quoted",
          "Payment options are agreed with you",
          "Your art is packed & shipped with love",
        ].map((step) => (
          <li key={step} className="flex items-start gap-3 text-sm text-muted">
            <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-sage/40 text-[10px] text-ink">
              <Check className="size-3" strokeWidth={2.5} />
            </span>
            {step}
          </li>
        ))}
      </ol>

      <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Button asChild>
          <a
            href={whatsappLink(buildOrderMessage(summary))}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle className="size-4" strokeWidth={1.6} />
            Reopen WhatsApp chat
          </a>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/shop" onClick={onReset}>
            Keep exploring
            <ArrowRight className="size-4" strokeWidth={1.6} />
          </Link>
        </Button>
      </div>
      <p className="mt-5 text-xs text-muted">
        Your bag is kept safe until you and the artist confirm everything.
      </p>
    </motion.div>
  );
}

/* ── Main form ─────────────────────────────────────────────── */

export function CheckoutForm() {
  const lines = useCartStore((s) => s.lines);
  const clearCart = useCartStore((s) => s.clear);
  const setCartOpen = useUIStore((s) => s.setCartOpen);
  const [done, setDone] = React.useState<{
    orderId: string;
    summary: OrderSummary;
    /** True only after the studio database confirmed the save. */
    saved: boolean;
  } | null>(null);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const subtotal = cartSubtotal(lines);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      district: "",
      postalCode: "",
      orderNotes: "",
    },
    mode: "onTouched",
  });

  const onSubmit = async (values: CheckoutValues) => {
    if (lines.length === 0 || isSubmitting) return;
    setSubmitError(null);

    const orderId = generateOrderId();
    const summary: OrderSummary = {
      orderId,
      lines,
      subtotal,
      customer: values,
    };

    // 1. Save the inquiry to the studio database first. The order is
    //    only ever described as "saved" once the server confirms it.
    let saved = false;
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientOrderId: orderId,
          customer: values,
          lines: lines.map((l) => ({
            slug: l.slug,
            title: l.title,
            price: l.price,
            quantity: l.quantity,
          })),
          subtotal,
        }),
      });

      if (res.ok) {
        saved = true;
      } else if (res.status === 503) {
        // Saving isn't configured on this site — proceed honestly
        // via WhatsApp only (no "saved" claim is shown).
        saved = false;
      } else {
        const data = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;
        setSubmitError(
          data?.error ??
            "We could not save your order just now. Please try again in a moment.",
        );
        return;
      }
    } catch {
      setSubmitError(
        "We could not reach the studio system. Please check your connection and try again.",
      );
      return;
    }

    // 2. Only after the save (or the honest unsaved fallback) does the
    //    WhatsApp chat open with the readable order summary.
    //    No payment is processed — see src/lib/whatsapp.ts for the
    //    payment-gateway integration notes.
    openWhatsAppOrder(summary);
    setDone({ orderId, summary, saved });
    reset();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* Empty bag guard (after hydration) */
  if (!done && lines.length === 0) {
    return (
      <div className="px-5 pb-24 pt-32 md:px-10 md:pt-40">
        <div className="mx-auto max-w-md text-center">
          <div className="mx-auto grid size-24 place-items-center rounded-full bg-cream">
            <MessageCircle className="size-9 text-muted" strokeWidth={1.1} />
          </div>
          <p className="mt-7 font-serif text-4xl tracking-tight">Your bag is empty</p>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Add a piece you love first — then come back to send your order inquiry.
          </p>
          <Button asChild size="lg" className="mt-8">
            <Link href="/shop">
              Explore the art
              <ArrowRight className="size-4" strokeWidth={1.6} />
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  if (done) {
    return (
      <div className="px-5 pb-24 pt-32 md:px-10 md:pt-40">
        <Success
          orderId={done.orderId}
          summary={done.summary}
          saved={done.saved}
          onReset={clearCart}
        />
      </div>
    );
  }

  return (
    <div className="px-5 pb-24 pt-28 md:px-10 md:pt-36">
      <div className="mx-auto max-w-[1200px]">
        <Link
          href="/cart"
          className="link-underline inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-ink"
        >
          <ArrowLeft className="size-4" strokeWidth={1.5} />
          Back to bag
        </Link>

        <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow mb-4">Almost there</p>
            <h1 className="font-serif text-6xl leading-none tracking-[-0.02em] sm:text-7xl md:text-8xl">
              Send your <span className="italic text-blush-deep">order.</span>
            </h1>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-muted">
            Fill in your details and we&rsquo;ll prepare everything as a WhatsApp message
            to the studio.
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="link-underline ml-1 text-ink"
            >
              Edit bag
            </button>
          </p>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:gap-14">
          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-10">
            <fieldset className="space-y-6">
              <legend className="eyebrow mb-4">01 · Who you are</legend>
              <div className="grid gap-6 sm:grid-cols-2">
                <Field label="Full name" error={errors.name?.message}>
                  <Input
                    {...register("name")}
                    autoComplete="name"
                    placeholder="Your name"
                    aria-invalid={Boolean(errors.name)}
                  />
                </Field>
                <Field label="Email" error={errors.email?.message}>
                  <Input
                    {...register("email")}
                    type="email"
                    autoComplete="email"
                    placeholder="you@email.com"
                    aria-invalid={Boolean(errors.email)}
                  />
                </Field>
                <Field label="Phone / WhatsApp" error={errors.phone?.message}>
                  <Input
                    {...register("phone")}
                    type="tel"
                    autoComplete="tel"
                    placeholder="+94 7X XXX XXXX"
                    aria-invalid={Boolean(errors.phone)}
                  />
                </Field>
              </div>
            </fieldset>

            <fieldset className="space-y-6">
              <legend className="eyebrow mb-4">02 · Where it&rsquo;s going</legend>
              <Field label="Shipping address" error={errors.address?.message}>
                <Textarea
                  {...register("address")}
                  rows={2}
                  inputVariant="box"
                  autoComplete="street-address"
                  placeholder="House number, street, area"
                  aria-invalid={Boolean(errors.address)}
                />
              </Field>
              <div className="grid gap-6 sm:grid-cols-2">
                <Field label="City" error={errors.city?.message}>
                  <Input
                    {...register("city")}
                    autoComplete="address-level2"
                    placeholder="City"
                    aria-invalid={Boolean(errors.city)}
                  />
                </Field>
                <Field label="District" error={errors.district?.message}>
                  <Controller
                    control={control}
                    name="district"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger aria-label="District">
                          <SelectValue placeholder="Select district" />
                        </SelectTrigger>
                        <SelectContent>
                          {districts.map((district) => (
                            <SelectItem key={district} value={district}>
                              {district}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </Field>
                <Field label="Postal code" error={errors.postalCode?.message}>
                  <Input
                    {...register("postalCode")}
                    inputMode="numeric"
                    autoComplete="postal-code"
                    placeholder="00000"
                    aria-invalid={Boolean(errors.postalCode)}
                  />
                </Field>
              </div>
            </fieldset>

            <fieldset className="space-y-6">
              <legend className="eyebrow mb-4">03 · Anything else</legend>
              <Field label="Order notes" error={errors.orderNotes?.message} optional>
                <Textarea
                  {...register("orderNotes")}
                  rows={3}
                  inputVariant="box"
                  placeholder="Gift wrapping, delivery wishes, a little message…"
                />
              </Field>
            </fieldset>

            {/* Notice + submit */}
            <div className="rounded-3xl border border-line bg-cream/60 p-6">
              <p className="flex gap-3 text-sm leading-relaxed text-muted">
                <Info className="mt-0.5 size-4.5 shrink-0 text-blush-deep" strokeWidth={1.6} />
                <span>
                  Submitting sends your order through <strong className="text-ink">WhatsApp</strong> —
                  no payment is taken here, and nothing is marked as paid. The artist
                  confirms availability, delivery fees and payment with you personally
                  before your artwork is packed and shipped.
                </span>
              </p>

              {submitError && (
                <p
                  role="alert"
                  className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm leading-relaxed text-red-700"
                >
                  {submitError}
                </p>
              )}

              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="mt-5 w-full"
              >
                {isSubmitting ? (
                  "Saving your order…"
                ) : (
                  <>
                    Send order inquiry on WhatsApp
                    <MessageCircle className="size-4" strokeWidth={1.6} />
                  </>
                )}
              </Button>

              <p className="mt-3 text-center text-xs text-muted">
                {siteSettings.currency} prices · Order ref generated automatically
              </p>
            </div>
          </form>

          {/* Sidebar */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <Summary lines={lines} subtotal={subtotal} />
          </aside>
        </div>
      </div>
    </div>
  );
}
