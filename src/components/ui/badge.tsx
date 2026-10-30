import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 font-sans text-[10px] font-medium uppercase tracking-[0.18em] transition-colors",
  {
    variants: {
      variant: {
        default: "bg-ink text-ivory",
        blush: "bg-blush text-ink",
        sage: "bg-sage text-ink",
        lavender: "bg-lavender text-ink",
        outline: "border border-ink/20 bg-ivory/85 text-ink backdrop-blur-sm",
        muted: "bg-cream text-muted border border-line",
        success: "border border-[#dbe5d7] bg-[#eef2ec] text-[#4d6147]",
        warning: "border border-[#f0dfc9] bg-[#fbf1e6] text-[#8a5a2b]",
        danger: "border border-rose-line bg-rose-soft text-[#8f3d49]",
        info: "border border-[#dfe3ef] bg-[#eef0f7] text-[#475277]",
      },
      size: {
        sm: "px-2.5 py-1",
        md: "px-3.5 py-1.5",
      },
    },
    defaultVariants: { variant: "outline", size: "sm" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, size }), className)} {...props} />;
}

export { Badge, badgeVariants };
