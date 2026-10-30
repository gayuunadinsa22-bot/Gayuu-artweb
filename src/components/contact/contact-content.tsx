"use client";

import * as React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  MessageCircle,
  Mail,
  MapPin,
  Send,
  Check,
  Info,
  Clock,
} from "lucide-react";

import { contactSchema, type ContactValues } from "@/lib/schemas";
import { getContactChannels } from "@/lib/content";
import { openWhatsApp, whatsappLink } from "@/lib/whatsapp";
import { siteSettings } from "@/lib/settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArtImage } from "@/components/shared/art-image";
import { Reveal, Stagger, StaggerItem } from "@/components/shared/reveal";
import { InstagramIcon } from "@/components/icons";

const channelIcons = [
  MessageCircle,
  Mail,
  InstagramIcon,
  MapPin,
] as const;

const faqs = [
  {
    q: "How long does an order take?",
    a: "Ready-to-ship pieces leave the studio within 2–3 working days. Made-to-order and commissioned pieces take longer — you'll get an exact timeline when we confirm.",
  },
  {
    q: "Do you ship outside Sri Lanka?",
    a: "Yes — worldwide shipping is available. Delivery fees are quoted for your address before anything is packed, and every piece is tracked.",
  },
  {
    q: "Can I visit the studio?",
    a: "Studio visits are by appointment — send a message and we'll find a time. Otherwise everything can be arranged right here on chat.",
  },
  {
    q: "How do payments work?",
    a: "No payment is taken on this website. You send an order or commission inquiry, and payment options are agreed personally with the artist afterwards.",
  },
];

export function ContactContent({ contactChannels: channelsProp }: { contactChannels?: ReturnType<typeof getContactChannels> } = {}) {
  const contactChannels = channelsProp ?? getContactChannels();
  const [sentMessage, setSentMessage] = React.useState<string | null>(null);
  const [openFaq, setOpenFaq] = React.useState<number | null>(0);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", message: "" },
    mode: "onTouched",
  });

  const onSubmit = (values: ContactValues) => {
    const message = [
      `Hello ${siteSettings.artistName}! 👋`,
      ``,
      `Name: ${values.name}`,
      `Email: ${values.email}`,
      ``,
      values.message,
    ].join("\n");
    setSentMessage(message);
    openWhatsApp(message);
    reset();
  };

  return (
    <>
      {/* ── CHANNELS ─────────────────────────────────── */}
      <section className="px-5 pb-6 md:px-10">
        <Stagger className="mx-auto grid max-w-[1200px] gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {contactChannels.map((channel, index) => {
            const Icon = channelIcons[index] ?? Mail;
            const body = (
              <>
                <span className="grid size-11 place-items-center rounded-full bg-cream transition-colors group-hover:bg-blush/30">
                  <Icon className="size-5 text-ink" strokeWidth={1.5} />
                </span>
                <span className="mt-4 block text-[11px] uppercase tracking-[0.22em] text-muted">
                  {channel.label}
                </span>
                <span className="mt-1.5 block font-serif text-2xl leading-tight text-ink transition-colors group-hover:text-blush-deep">
                  {channel.value}
                </span>
                <span className="mt-2 block text-sm leading-relaxed text-muted">
                  {channel.note}
                </span>
              </>
            );

            const className =
              "group block rounded-3xl border border-line bg-cream/50 p-6 transition-colors hover:border-blush/70";

            return (
              <StaggerItem key={channel.label}>
                {channel.href === "whatsapp" ? (
                  <a
                    className={className}
                    href={whatsappLink(
                      `Hi ${siteSettings.artistName}! I have a question about your art.`,
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {body}
                  </a>
                ) : channel.href ? (
                  <a
                    className={className}
                    href={channel.href}
                    target={
                      channel.href.startsWith("http") ? "_blank" : undefined
                    }
                    rel={
                      channel.href.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                  >
                    {body}
                  </a>
                ) : (
                  <div className={className}>{body}</div>
                )}
              </StaggerItem>
            );
          })}
        </Stagger>
      </section>

      {/* ── FORM + FAQ ───────────────────────────────── */}
      <section className="px-5 py-16 md:px-10 md:py-24">
        <div className="mx-auto grid max-w-[1440px] gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="eyebrow mb-6 flex items-center gap-3">
                <span aria-hidden className="h-px w-10 bg-blush" />
                send a message
              </p>
              <h2 className="font-serif text-4xl leading-[1.05] tracking-[-0.02em] sm:text-5xl md:text-6xl">
                Say hello —{" "}
                <span className="italic text-blush-deep">I read everything.</span>
              </h2>
              <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-muted">
                Questions about a piece, shipping to your corner of the world, or
                a wild idea for something custom? Write it here — the message is
                sent through WhatsApp so you get a personal reply.
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <form
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                className="mt-9 rounded-[32px] border border-line bg-cream/50 p-6 sm:p-8"
              >
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="contact-name">Your name</Label>
                    <Input
                      id="contact-name"
                      className="mt-2"
                      autoComplete="name"
                      placeholder="Your name"
                      aria-invalid={Boolean(errors.name)}
                      {...register("name")}
                    />
                    {errors.name ? (
                      <p role="alert" className="mt-1.5 text-xs text-blush-deep">
                        {errors.name.message}
                      </p>
                    ) : null}
                  </div>
                  <div>
                    <Label htmlFor="contact-email">Email</Label>
                    <Input
                      id="contact-email"
                      className="mt-2"
                      type="email"
                      autoComplete="email"
                      placeholder="you@email.com"
                      aria-invalid={Boolean(errors.email)}
                      {...register("email")}
                    />
                    {errors.email ? (
                      <p role="alert" className="mt-1.5 text-xs text-blush-deep">
                        {errors.email.message}
                      </p>
                    ) : null}
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="contact-message">Message</Label>
                    <div className="mt-2">
                      <Textarea
                        id="contact-message"
                        rows={6}
                        inputVariant="box"
                        placeholder="Hi! I'd love to know more about…"
                        aria-invalid={Boolean(errors.message)}
                        {...register("message")}
                      />
                    </div>
                    {errors.message ? (
                      <p role="alert" className="mt-1.5 text-xs text-blush-deep">
                        {errors.message.message}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="mt-6 rounded-3xl border border-line bg-ivory p-5">
                  <p className="flex gap-3 text-sm leading-relaxed text-muted">
                    <Info
                      className="mt-0.5 size-4.5 shrink-0 text-blush-deep"
                      strokeWidth={1.6}
                    />
                    <span>
                      This opens a <strong className="text-ink">WhatsApp</strong>{" "}
                      chat with your message pre-filled — nothing is signed up
                      and no data is stored on this site.
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
                        Send message on WhatsApp
                        <Send className="size-4" strokeWidth={1.6} />
                      </>
                    )}
                  </Button>
                </div>

                {sentMessage ? (
                  <div className="mt-5 rounded-3xl border border-sage/60 bg-sage/15 p-5">
                    <p className="text-sm font-medium text-ink">
                      Your message is ready to send.
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-muted">
                      If WhatsApp didn&rsquo;t open, copy the text below and send
                      it manually.
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
              </form>
            </Reveal>
          </div>

          {/* FAQ / studio card */}
          <div className="lg:col-span-5">
            <Reveal delay={0.1}>
              <div className="lg:sticky lg:top-32">
                <p className="eyebrow mb-6">Before you ask</p>
                <div className="divide-y divide-line border-y border-line">
                  {faqs.map((faq, index) => (
                    <button
                      key={faq.q}
                      type="button"
                      onClick={() =>
                        setOpenFaq(openFaq === index ? null : index)
                      }
                      aria-expanded={openFaq === index}
                      className="group w-full py-5 text-left"
                    >
                      <span className="flex items-center justify-between gap-4">
                        <span className="font-serif text-xl leading-snug transition-colors group-hover:text-blush-deep md:text-2xl">
                          {faq.q}
                        </span>
                        <span
                          aria-hidden
                          className={`grid size-7 shrink-0 place-items-center rounded-full border border-line text-sm transition-transform duration-300 ${
                            openFaq === index ? "rotate-45 bg-blush/30" : ""
                          }`}
                        >
                          +
                        </span>
                      </span>
                      <span
                        className={`grid transition-all duration-300 ${
                          openFaq === index
                            ? "mt-3 grid-rows-[1fr] opacity-100"
                            : "grid-rows-[0fr] opacity-0"
                        }`}
                      >
                        <span className="overflow-hidden">
                          <span className="block text-sm leading-relaxed text-muted">
                            {faq.a}
                          </span>
                        </span>
                      </span>
                    </button>
                  ))}
                </div>

                <div className="mt-8 overflow-hidden rounded-[28px] border border-line">
                  <ArtImage
                    src="/images/studio-desk.jpg"
                    alt="The studio desk with brushes and works in progress"
                    ratio="aspect-[16/10]"
                    sizes="(max-width: 1024px) 92vw, 36vw"
                  />
                  <div className="bg-cream/70 p-5">
                    <p className="flex items-center gap-2.5 text-sm text-muted">
                      <Clock className="size-4 shrink-0 text-blush-deep" strokeWidth={1.6} />
                      Replies usually land within one working day.
                    </p>
                    <p className="mt-2 font-hand text-lg text-muted">
                      slow answers, honest ones — thank you for waiting ♡
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Button
                    onClick={() =>
                      openWhatsApp(
                        `Hi ${siteSettings.artistName}! I have a question about your art 🌷`,
                      )
                    }
                  >
                    <MessageCircle className="size-4" strokeWidth={1.6} />
                    Message the studio
                  </Button>
                  <Button variant="outline" asChild>
                    <a href={`mailto:${siteSettings.contactEmail}`}>
                      <Mail className="size-4" strokeWidth={1.6} />
                      Email instead
                    </a>
                  </Button>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── CTA STRIP ────────────────────────────────── */}
      <section className="px-5 pb-24 md:px-10">
        <Reveal className="mx-auto flex max-w-[1120px] flex-col items-center gap-6 rounded-[32px] border border-line bg-gradient-to-br from-blush/20 via-ivory to-lavender/30 px-6 py-14 text-center md:px-16">
          <p className="eyebrow flex justify-center">While you&rsquo;re here</p>
          <h2 className="max-w-2xl font-serif text-4xl leading-[1.05] tracking-[-0.02em] sm:text-5xl">
            Thinking about something{" "}
            <span className="italic text-blush-deep">made just for you?</span>
          </h2>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/commissions">
                Start a commission
                <Send className="size-4" strokeWidth={1.6} />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/shop">
                <Check className="size-4" strokeWidth={1.6} />
                Browse the shop
              </Link>
            </Button>
          </div>
        </Reveal>
      </section>
    </>
  );
}
