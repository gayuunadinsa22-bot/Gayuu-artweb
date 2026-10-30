import * as React from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/shared/reveal";

interface SectionHeadingProps {
  kicker?: string;
  title: React.ReactNode;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
  /** Adjusts editorial scale: sm = section, lg = page hero. */
  scale?: "sm" | "md" | "lg";
}

const scaleClasses = {
  sm: "text-4xl sm:text-5xl md:text-6xl",
  md: "text-5xl sm:text-6xl md:text-7xl",
  lg: "text-6xl sm:text-7xl md:text-8xl lg:text-[7.5rem] leading-[0.95]",
};

export function SectionHeading({
  kicker,
  title,
  subtitle,
  align = "left",
  className,
  scale = "md",
}: SectionHeadingProps) {
  return (
    <Reveal
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto max-w-2xl text-center",
        className,
      )}
    >
      {kicker ? (
        <p
          className={cn(
            "eyebrow mb-5 flex items-center gap-3",
            align === "center" && "justify-center",
          )}
        >
          <span aria-hidden className="h-px w-8 bg-blush" />
          {kicker}
        </p>
      ) : null}
      <h2
        className={cn(
          "font-serif font-normal leading-[1.04] tracking-[-0.015em] text-ink",
          scaleClasses[scale],
        )}
      >
        {title}
      </h2>
      {subtitle ? (
        <p
          className={cn(
            "mt-5 max-w-xl text-[15px] leading-relaxed text-muted md:text-base",
            align === "center" && "mx-auto",
          )}
        >
          {subtitle}
        </p>
      ) : null}
    </Reveal>
  );
}
