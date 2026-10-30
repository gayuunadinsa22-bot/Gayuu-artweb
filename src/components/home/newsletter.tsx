"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Heart, ArrowRight, Check } from "lucide-react";
import { newsletterSchema, type NewsletterValues } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/shared/reveal";
import { cn } from "@/lib/utils";

export function Newsletter({
  sections,
}: {
  /** Edited copy from Admin → Homepage (falls back to defaults). */
  sections?: Record<string, string>;
}) {
  const heading = sections?.heading?.trim();
  const description = sections?.description?.trim();
  const [done, setDone] = React.useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<NewsletterValues>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (values: NewsletterValues) => {
    // DEMO ONLY — no data leaves the browser.
    // TODO: wire up your email provider (Mailchimp, Buttondown, Resend…)
    void values;
    await new Promise((resolve) => setTimeout(resolve, 600));
    setDone(true);
    reset();
  };

  return (
    <section className="px-5 py-20 md:px-10 md:py-28">
      <Reveal className="mx-auto max-w-[1120px]">
        <div className="relative overflow-hidden rounded-[32px] border border-line bg-gradient-to-br from-blush/16 via-ivory to-lavender/25 px-6 py-16 text-center md:px-16 md:py-20">
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="animate-float absolute left-8 top-8 text-2xl text-blush-deep">
              ♡
            </div>
            <div
              className="animate-float-slow absolute bottom-10 right-10 text-3xl text-sage"
              style={{ animationDelay: "-4s" }}
            >
              ✦
            </div>
          </div>

          <p className="eyebrow mb-6 flex justify-center">The studio letter</p>
          <h2 className="mx-auto max-w-2xl font-serif text-4xl leading-[1.05] tracking-[-0.02em] sm:text-5xl md:text-6xl">
            {heading ? (
              heading
            ) : (
              <>
                Love art? <span className="italic text-blush-deep">Let&rsquo;s stay close.</span>
              </>
            )}
          </h2>
          <p className="mx-auto mt-5 max-w-md text-[15px] leading-relaxed text-muted">
            {description ?? (
              <>
                Get first access to new collections, exclusive drops, and little creative
                updates.
              </>
            )}
          </p>

          {done ? (
            <div className="mx-auto mt-9 flex max-w-md items-center justify-center gap-2.5 rounded-full bg-ink px-6 py-3.5 text-sm text-ivory">
              <Check className="size-4 text-blush" strokeWidth={2} />
              You&rsquo;re on the list — see you in your inbox ♡
            </div>
          ) : (
            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="mx-auto mt-9 w-full max-w-md"
            >
              <div
                className={cn(
                  "flex flex-col gap-3 sm:flex-row sm:items-end",
                  errors.email && "[&_input]:border-blush-deep",
                )}
              >
                <div className="flex-1 text-left">
                  <input
                    type="email"
                    autoComplete="email"
                    placeholder="your@email.com"
                    aria-label="Email address"
                    className="w-full border-b border-ink/30 bg-transparent py-3 text-[15px] text-ink placeholder:text-muted/55 transition-colors focus:border-ink focus:outline-none"
                    {...register("email")}
                  />
                  {errors.email ? (
                    <p role="alert" className="mt-2 text-xs text-blush-deep">
                      {errors.email.message}
                    </p>
                  ) : null}
                </div>
                <Button type="submit" disabled={isSubmitting} className="shrink-0">
                  {isSubmitting ? "Joining…" : "Subscribe"}
                  <ArrowRight className="size-4" strokeWidth={1.6} />
                </Button>
              </div>
            </form>
          )}

          <p className="mx-auto mt-6 max-w-sm text-[11px] leading-relaxed text-muted/80">
            Demo form — connect an email provider (Mailchimp, Resend…) to start
            collecting subscribers. Unsubscribe anytime, no spam ever.
          </p>

          <p className="font-hand absolute bottom-4 left-1/2 hidden -translate-x-1/2 text-lg text-muted md:block">
            sent with <Heart className="inline size-3.5 fill-blush-deep text-blush-deep" />
          </p>
        </div>
      </Reveal>
    </section>
  );
}
