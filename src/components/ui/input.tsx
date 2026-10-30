import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** "underline" = editorial style, "box" = framed field, "admin" = dashboard field. */
  inputVariant?: "underline" | "box" | "admin";
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, inputVariant = "underline", type, ...props }, ref) => (
    <input
      type={type}
      ref={ref}
      className={cn(
        "w-full bg-transparent py-2.5 text-[15px] text-ink placeholder:text-muted/55 transition-colors duration-300",
        inputVariant === "underline" &&
          "border-0 border-b border-line focus:border-ink focus:outline-none focus:ring-0 hover:border-muted/60",
        inputVariant === "box" &&
          "rounded-full border border-line px-5 focus:border-ink focus:outline-none focus:ring-0 hover:border-muted/60",
        inputVariant === "admin" &&
          "h-11 rounded-lg border border-line-strong/70 bg-white px-3.5 py-2 text-[15px] text-ink shadow-[inset_0_1px_1px_rgb(37_37_37/0.03)] placeholder:text-faint hover:border-line-strong focus:border-rose focus:outline-none focus:ring-2 focus:ring-rose/25 aria-invalid:border-red-300 aria-invalid:focus:border-red-400 aria-invalid:focus:ring-red-200/70 disabled:cursor-not-allowed",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";

export { Input };
