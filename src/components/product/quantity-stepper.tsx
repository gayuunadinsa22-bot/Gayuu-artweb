"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export function QuantityStepper({
  value,
  max,
  onChange,
  className,
}: {
  value: number;
  max: number;
  onChange: (next: number) => void;
  className?: string;
}) {
  const clamp = (next: number) => Math.max(1, Math.min(next, max));

  return (
    <div
      className={cn(
        "inline-flex h-11 items-center gap-1 rounded-full border border-line bg-ivory px-1.5",
        className,
      )}
    >
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={() => onChange(clamp(value - 1))}
        disabled={value <= 1}
        className="grid size-8 place-items-center rounded-full text-ink transition-colors hover:bg-cream disabled:opacity-30 disabled:hover:bg-transparent"
      >
        <Minus className="size-3.5" strokeWidth={1.8} />
      </button>
      <span
        aria-live="polite"
        className="w-8 text-center text-sm font-medium tabular-nums text-ink"
      >
        {value}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={() => onChange(clamp(value + 1))}
        disabled={value >= max}
        className="grid size-8 place-items-center rounded-full text-ink transition-colors hover:bg-cream disabled:opacity-30 disabled:hover:bg-transparent"
      >
        <Plus className="size-3.5" strokeWidth={1.8} />
      </button>
    </div>
  );
}
