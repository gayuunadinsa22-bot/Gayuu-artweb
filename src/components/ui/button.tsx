import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-sans text-sm font-medium tracking-wide transition-all duration-300 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-45 disabled:shadow-none [&_svg]:pointer-events-none [&_svg]:shrink-0 cursor-pointer select-none",
  {
    variants: {
      variant: {
        default:
          "bg-ink text-ivory hover:bg-black hover:shadow-card active:scale-[0.98]",
        rose: "bg-blush text-ink hover:bg-blush-deep hover:text-white active:scale-[0.98]",
        sage: "bg-sage text-ink hover:bg-ink hover:text-ivory",
        outline:
          "border border-ink/25 bg-transparent text-ink hover:border-ink hover:bg-ink hover:text-ivory",
        soft: "border border-line bg-cream/60 text-ink hover:bg-blush/30 hover:border-blush",
        // Admin dashboard secondary action: white surface, charcoal text.
        subtle:
          "border border-line-strong/80 bg-white text-ink shadow-[0_1px_2px_rgb(37_37_37/0.04)] hover:border-line-strong hover:bg-cream/60 hover:text-ink",
        ghost: "text-ink hover:bg-cream",
        destructive: "bg-red-600 text-white hover:bg-red-700 active:scale-[0.98]",
        // Muted destructive action for admin lists.
        danger:
          "border border-red-200 bg-white text-red-700 hover:border-red-300 hover:bg-red-50 hover:text-red-800",
        link: "text-ink underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        sm: "h-9 px-4 text-xs",
        md: "h-11 px-6",
        lg: "h-13 px-8 text-[15px]",
        icon: "size-10",
        bare: "h-auto p-0",
      },
    },
    defaultVariants: { variant: "default", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
