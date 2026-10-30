"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const Select = SelectPrimitive.Root;
const SelectValue = SelectPrimitive.Value;

interface SelectTriggerProps extends SelectPrimitive.SelectTriggerProps {
  /** "underline" = editorial style, "admin" = framed dashboard field. */
  variant?: "underline" | "admin";
}

function SelectTrigger({
  className,
  children,
  variant = "underline",
  ...props
}: SelectTriggerProps) {
  return (
    <SelectPrimitive.Trigger
      className={cn(
        "flex w-full items-center justify-between gap-3 border-b border-line bg-transparent py-2.5 text-left text-[15px] text-ink transition-colors hover:border-muted/60 focus:border-ink focus:outline-none data-[placeholder]:text-muted/55 [&>span]:truncate",
        variant === "admin" &&
          "h-11 rounded-lg border border-line-strong/70 bg-white px-3.5 py-0 shadow-[inset_0_1px_1px_rgb(37_37_37/0.03)] hover:border-line-strong focus:border-rose focus:outline-none focus:ring-2 focus:ring-rose/25 data-[placeholder]:text-faint aria-invalid:border-red-300",
        className,
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDown className="size-4 shrink-0 text-muted transition-transform duration-300" strokeWidth={1.5} />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

function SelectContent({
  className,
  children,
  position = "popper",
  ...props
}: SelectPrimitive.SelectContentProps) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        position={position}
        className={cn(
          "select-pop relative z-[60] max-h-72 w-full min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-2xl border border-line bg-ivory shadow-card",
          position === "popper" && "translate-y-1",
          className,
        )}
        {...props}
      >
        <SelectPrimitive.Viewport className="p-1.5">
          {children}
        </SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

function SelectItem({
  className,
  children,
  ...props
}: SelectPrimitive.SelectItemProps) {
  return (
    <SelectPrimitive.Item
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center rounded-xl py-2.5 pl-4 pr-9 text-sm text-ink outline-none transition-colors focus:bg-cream data-[state=checked]:font-medium data-[highlighted]:bg-cream",
        className,
      )}
      {...props}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      <span className="absolute right-3">
        <SelectPrimitive.ItemIndicator>
          <Check className="size-3.5 text-blush-deep" strokeWidth={2} />
        </SelectPrimitive.ItemIndicator>
      </span>
    </SelectPrimitive.Item>
  );
}

const SelectLabel = SelectPrimitive.Label;
const SelectSeparator = SelectPrimitive.Separator;

export {
  Select,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectSeparator,
};
