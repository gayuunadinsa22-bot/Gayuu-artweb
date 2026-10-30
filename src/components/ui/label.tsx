"use client";

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cn } from "@/lib/utils";

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(
      "font-sans text-[11px] uppercase tracking-[0.22em] text-muted transition-colors peer-focus-within:text-ink",
      className,
    )}
    {...props}
  />
));
Label.displayName = "Label";

export { Label };
