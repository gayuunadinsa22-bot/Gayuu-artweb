import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  inputVariant?: "underline" | "box" | "admin";
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, inputVariant = "underline", ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "w-full resize-none bg-transparent py-2.5 text-[15px] leading-relaxed text-ink placeholder:text-muted/55 transition-colors duration-300",
        inputVariant === "underline" &&
          "border-0 border-b border-line focus:border-ink focus:outline-none focus:ring-0 hover:border-muted/60",
        inputVariant === "box" &&
          "rounded-3xl border border-line px-5 py-4 focus:border-ink focus:outline-none focus:ring-0 hover:border-muted/60",
        inputVariant === "admin" &&
          "min-h-28 resize-y rounded-lg border border-line-strong/70 bg-white px-3.5 py-3 text-[15px] leading-relaxed text-ink shadow-[inset_0_1px_1px_rgb(37_37_37/0.03)] placeholder:text-faint hover:border-line-strong focus:border-rose focus:outline-none focus:ring-2 focus:ring-rose/25 aria-invalid:border-red-300 aria-invalid:focus:border-red-400 aria-invalid:focus:ring-red-200/70 disabled:cursor-not-allowed",
        className,
      )}
      {...props}
    />
  ),
);
Textarea.displayName = "Textarea";

export { Textarea };
