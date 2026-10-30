"use client";

import * as React from "react";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Palette,
  Users,
  PawPrint,
  Gift,
  ArrowUpRight,
  MessageCircle,
  Send,
  Check,
  Info,
} from "lucide-react";

import {
  commissionSchema,
  commissionTypes as staticCommissionTypes,
  budgetRanges,
  type CommissionValues,
} from "@/lib/schemas";
import { getContactChannels, processSteps } from "@/lib/content";
import { buildCommissionMessage, openWhatsApp } from "@/lib/whatsapp";
import { whatsappLink } from "@/lib/whatsapp";
import { siteSettings } from "@/lib/settings";
import { formatCurrency } from "@/lib/utils";
import { currentYear } from "@/lib/year";
import type { CommissionType } from "@/lib/data/storefront";
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
import { ArtImage } from "@/components/shared/art-image";
import { Reveal, Stagger, StaggerItem } from "@/components/shared/reveal";

const commissionCards = [
  {
    title: "Custom portraits",
    description:
      "A one-of-a-kind painted portrait from your reference photos, with close attention to expression and light.",
    icon: Users,
    image: "/images/portrait-3.jpg",
    type: "Individual portrait",
  },
  {
    title: "Pet & animal painting",
    description:
      "A heartfelt painting of a beloved pet — the little head tilt, the favourite sleeping spot, all of it.",
    icon: PawPrint,
    image: "/images/portrait-4.jpg",
    type: "Pet portrait",
  },
  {
    title: "Couples & family pieces",
    description:
      "A meaningful scene or portrait for anniversaries, weddings, new homes and family milestones.",
    icon: Gift,
    image: "/images/portrait-2.jpg",
    type: "Couple portrait",
  },
  {
    title: "Abstract for your space",
    description:
      "An original abstract made for a specific room — palette, scale and mood tailored to your interior.",
    icon: Palette,
    image: "/images/work-linen-skies.jpg",
    type: "Personalized painting",
  },
];

function Field({
  label,
  error,
  children,
  optional,
  className,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  optional?: boolean;
  className?: string;
}) {
  return (
    <div className={className ? className : undefined}>
      <Label className="flex items-baseline gap-2">
        {label}
        {optional ? (
          <span className="normal-case tracking-normal text-muted">
            (optional)
          </span>
        ) : null}
      </Label>
      <div className="mt-2">{children}</div>
      {error ? (
        <p role="alert" className="mt-1.5 text-xs text-blush-deep">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function CommissionsContent({ commissionTypes }: { commissionTypes?: CommissionType[] | null } = {}) {
  const [sentMessage, setSentMessage] = React.useState<string | null>(null);
  const contactChannels = getContactChannels();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CommissionValues>({
    resolver: zodResolver(commissionSchema),
    defaultValues: {
      name: "",
      email: "",
      whatsapp: "",
      artworkType: "",
      dimensions: "",
      budget: "",
      description: "",
      references: "",
    },
    mode: "onTouched",
  });

  function onSubmit(values: CommissionValues) {
    const message = buildCommissionMessage(values);
    setSentMessage(message);
    openWhatsApp(message);
    reset();
  }

  return (
    <>
      {/* ── COMMISSION TYPES ─────────────────────────── */}
      <section className="px-5 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-[1440px]">
          <Reveal className="max-w-3xl">
            <p className="eyebrow mb-6 flex items-center gap-3">
              <span aria-hidden className="h-px w-10 bg-blush" />
              what can be commissioned
            </p>
            <h2 className="font-serif text-4xl leading-[1.05] tracking-[-0.02em] sm:text-5xl md:text-6xl">
              Pieces made for{" "}
              <span className="italic text-blush-deep">your story.</span>
            </h2>
            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-muted md:text-base">
              Every commission begins with a conversation about what the piece
              should feel like in your space.
            </p>
          </Reveal>

          {commissionTypes && commissionTypes.length > 0 ? (
            <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {commissionTypes.map((type) => (
                <StaggerItem key={type.id}>
                  <article className="group h-full overflow-hidden rounded-3xl border border-line bg-cream/50 transition-shadow duration-300 hover:shadow-[0_18px_50px_rgba(37,37,37,0.08)]">
                    <div className="relative">
                      <ArtImage
                        src={type.image_url || "/images/portrait-3.jpg"}
                        alt={type.name}
                        ratio="aspect-[4/3]"
                        sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 31vw"
                        className="transition-transform duration-700 group-hover:scale-[1.06]"
                      />
                    </div>
                    <div className="p-5">
                      <h3 className="font-serif text-2xl leading-tight">{type.name}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted">
                        {type.description || "Custom piece tailored to your story."}
                      </p>
                      <p className="mt-4 text-[11px] uppercase tracking-[0.18em] text-muted/80">
                        {type.starting_price != null ? `from ${formatCurrency(type.starting_price)}` : "Quote after we talk"}
                        {!type.available ? " · currently unavailable" : ""}
                      </p>
                    </div>
                  </article>
                </StaggerItem>
              ))}
            </Stagger>
          ) : (
            <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {commissionCards.map((card) => (
                <StaggerItem key={card.title}>
                  <article className="group h-full overflow-hidden rounded-3xl border border-line bg-cream/50 transition-shadow duration-300 hover:shadow-[0_18px_50px_rgba(37,37,37,0.08)]">
                    <div className="relative">
                      <ArtImage
                        src={card.image}
                        alt={card.title}
                        ratio="aspect-[4/3]"
                        sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 24vw"
                        className="transition-transform duration-700 group-hover:scale-[1.06]"
                      />
                      <span className="absolute left-4 top-4 grid size-10 place-items-center rounded-full bg-ivory/90 backdrop-blur">
                        <card.icon className="size-4 text-ink" strokeWidth={1.6} />
                      </span>
                    </div>
                    <div className="p-5">
                      <h3 className="font-serif text-2xl leading-tight">{card.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted">{card.description}</p>
                      <p className="mt-4 text-[11px] uppercase tracking-[0.18em] text-muted/80">
                        Quote after we talk
                      </p>
                    </div>
                  </article>
                </StaggerItem>
              ))}
            </Stagger>
          )}

          <Reveal delay={0.1}>
            <p className="mx-auto mt-8 max-w-2xl text-center text-sm leading-relaxed text-muted">
              Pricing depends on size, detail and materials — you&apos;ll always
              receive a clear quote and a timeline before anything begins.
              Nothing is confirmed until you say yes.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── PROCESS ──────────────────────────────────── */}
      <section className="border-y border-line bg-cream/60 px-5 py-20 md:px-10 md:py-24">
        <div className="mx-auto max-w-[1440px]">
          <Reveal>
            <p className="eyebrow mb-6">How it works</p>
            <h2 className="max-w-2xl font-serif text-4xl leading-[1.05] tracking-[-0.02em] sm:text-5xl md:text-6xl">
              From first message to{" "}
              <span className="italic">finished piece.</span>
            </h2>
          </Reveal>

          <Stagger className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((step, index) => (
              <StaggerItem key={step.title}>
                <div>
                  <span className="font-hand text-3xl text-blush-deep">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-2 font-serif text-2xl leading-tight">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {step.description}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ── FORM ─────────────────────────────────────── */}
      <section
        id="commission-form"
        className="scroll-mt-28 px-5 py-20 md:px-10 md:py-28"
      >
        <div className="mx-auto grid max-w-[1440px] gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5">
            <div className="lg:sticky lg:top-32">
              <p className="eyebrow mb-6">Tell me your idea</p>
              <h2 className="font-serif text-4xl leading-[1.05] tracking-[-0.02em] sm:text-5xl md:text-6xl">
                Let&rsquo;s design your{" "}
                <span className="italic text-blush-deep">piece together.</span>
              </h2>
              <p className="mt-5 max-w-md text-[15px] leading-relaxed text-muted">
                Share a few details and {siteSettings.artistName} will reply on
                WhatsApp with availability, ideas, a quote and a delivery
                estimate. Prefer email? Use the address below instead.
              </p>

              <div className="mt-8 rounded-3xl border border-line bg-cream/60 p-6">
                <h3 className="font-serif text-2xl">Good to know</h3>
                <ul className="mt-4 space-y-3 text-sm text-muted">
                  {[
                    "A small advance secures your slot in the studio calendar.",
                    "You'll receive progress photos at key stages.",
                    "Shipping fees and delivery timing are quoted separately.",
                    "No payment is taken on this website — everything is agreed personally.",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-sage/40 text-[10px] text-ink">
                        <Check className="size-3" strokeWidth={2.5} />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button
                  onClick={() =>
                    openWhatsApp(
                      `Hi ${siteSettings.artistName}! I'd like to enquire about a custom commission.`,
                    )
                  }
                >
                  <MessageCircle className="size-4" strokeWidth={1.6} />
                  Chat on WhatsApp
                </Button>
                <Button variant="outline" asChild>
                  <a href={`mailto:${siteSettings.contactEmail}`}>
                    {siteSettings.contactEmail}
                  </a>
                </Button>
              </div>

              <p className="mt-6 font-hand text-lg text-muted">
                commissions open for {currentYear} ♡
              </p>
            </div>
          </Reveal>

          <div className="lg:col-span-7">
            <Reveal delay={0.1}>
              <form
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                className="rounded-[32px] border border-line bg-cream/50 p-6 shadow-[0_18px_50px_rgba(37,37,37,0.06)] sm:p-8"
              >
                <p className="eyebrow mb-6">Commission enquiry</p>

                <div className="grid gap-6 sm:grid-cols-2">
                  <Field label="Your name" error={errors.name?.message}>
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
                  <Field
                    label="WhatsApp number"
                    error={errors.whatsapp?.message}
                  >
                    <Input
                      {...register("whatsapp")}
                      type="tel"
                      autoComplete="tel"
                      placeholder="+94 7X XXX XXXX"
                      aria-invalid={Boolean(errors.whatsapp)}
                    />
                  </Field>
                  <Field label="Artwork type" error={errors.artworkType?.message}>
                    <Controller
                      control={control}
                      name="artworkType"
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger
                            className="w-full"
                            aria-label="Artwork type"
                          >
                            <SelectValue placeholder="Choose a type" />
                          </SelectTrigger>
                          <SelectContent>
                            {commissionTypes && commissionTypes.length > 0
                              ? commissionTypes.map((type) => (
                                  <SelectItem key={type.id || type.name} value={String(type.name)}>
                                    {type.name as string}
                                  </SelectItem>
                                ))
                              : staticCommissionTypes.map((type) => (
                                  <SelectItem key={type} value={type}>
                                    {type}
                                  </SelectItem>
                                ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </Field>
                  <Field
                    label="Approx. size"
                    error={errors.dimensions?.message}
                    optional
                  >
                    <Input
                      {...register("dimensions")}
                      placeholder="e.g. 40 × 50 cm"
                    />
                  </Field>
                  <Field label="Budget range" error={errors.budget?.message}>
                    <Controller
                      control={control}
                      name="budget"
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-full" aria-label="Budget">
                            <SelectValue placeholder="Choose a range" />
                          </SelectTrigger>
                          <SelectContent>
                            {budgetRanges.map((range) => (
                              <SelectItem key={range} value={range}>
                                {range}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </Field>

                  <Field
                    label="Tell me about the piece"
                    error={errors.description?.message}
                    className="sm:col-span-2"
                  >
                    <Textarea
                      {...register("description")}
                      rows={5}
                      inputVariant="box"
                      placeholder="The subject, the colours, the mood, where it will hang, any reference photos you have…"
                      aria-invalid={Boolean(errors.description)}
                    />
                  </Field>

                  <Field
                    label="Reference links"
                    error={errors.references?.message}
                    optional
                    className="sm:col-span-2"
                  >
                    <Input
                      {...register("references")}
                      placeholder="Pinterest board, Google Drive, Instagram post…"
                    />
                  </Field>
                </div>

                <div className="mt-6 rounded-3xl border border-line bg-ivory p-5">
                  <p className="flex gap-3 text-sm leading-relaxed text-muted">
                    <Info
                      className="mt-0.5 size-4.5 shrink-0 text-blush-deep"
                      strokeWidth={1.6}
                    />
                    <span>
                      Submitting opens <strong className="text-ink">WhatsApp</strong>{" "}
                      with your enquiry pre-filled. No payment is taken here —
                      pricing, timing and payment are confirmed personally by{" "}
                      {siteSettings.artistName} before any work begins.
                    </span>
                  </p>

                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting}
                    className="mt-5 w-full"
                  >
                    {isSubmitting ? (
                      "Preparing your message…"
                    ) : (
                      <>
                        Send commission enquiry
                        <Send className="size-4" strokeWidth={1.6} />
                      </>
                    )}
                  </Button>

                  <p className="mt-3 text-center text-xs text-muted">
                    Budgets shown are {siteSettings.currency} ranges — your
                    final quote comes after we talk.
                  </p>
                </div>

                {sentMessage ? (
                  <div className="mt-5 rounded-3xl border border-sage/60 bg-sage/15 p-5">
                    <p className="text-sm font-medium text-ink">
                      Your enquiry is ready in WhatsApp.
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-muted">
                      If the chat didn&apos;t open automatically, copy your
                      message below and send it manually.
                    </p>
                    <pre className="mt-3 max-h-44 overflow-auto whitespace-pre-wrap rounded-2xl bg-ivory p-4 text-xs leading-relaxed text-muted">
                      {sentMessage}
                    </pre>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <Button size="sm" asChild>
                        <a
                          href={whatsappLink(sentMessage)}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <MessageCircle className="size-4" strokeWidth={1.6} />
                          Open WhatsApp
                        </a>
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setSentMessage(null)}
                      >
                        Clear
                      </Button>
                    </div>
                  </div>
                ) : null}

                <div className="mt-6 grid gap-3 border-t border-line pt-6 sm:grid-cols-2">
                  {contactChannels.map((channel) => (
                    <div key={channel.label}>
                      <p className="text-[11px] uppercase tracking-[0.18em] text-muted">
                        {channel.label}
                      </p>
                      <p className="font-serif text-lg text-ink">
                        {channel.value}
                      </p>
                    </div>
                  ))}
                </div>
              </form>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="mt-8 rounded-[32px] border border-line bg-gradient-to-br from-sage/20 via-ivory to-lavender/40 p-7 text-center">
                <p className="eyebrow mb-4 flex justify-center">
                  Not ready yet?
                </p>
                <p className="mx-auto max-w-sm text-sm leading-relaxed text-muted">
                  Browse available originals — many pieces are one-of-one and
                  ready to leave the studio.
                </p>
                <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <Button asChild>
                    <Link href="/shop">
                      Explore the shop
                      <ArrowUpRight className="size-4" strokeWidth={1.6} />
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/gallery">See the gallery</Link>
                  </Button>
                </div>
                <p className="mt-5 font-hand text-lg text-muted">
                  {siteSettings.currency} · worldwide shipping quotes on
                  request
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
