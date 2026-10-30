"use client";

import * as React from "react";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const Sheet = SheetPrimitive.Root;
const SheetTrigger = SheetPrimitive.Trigger;
const SheetClose = SheetPrimitive.Close;

/** Full-viewport scrim shared by every overlay. */
function SheetOverlay({ className, ...props }: SheetPrimitive.DialogOverlayProps) {
  return (
    <SheetPrimitive.Overlay
      className={cn(
        "overlay-layer fixed inset-0 z-50 bg-ink/45 backdrop-blur-[3px]",
        className,
      )}
      {...props}
    />
  );
}

interface SheetContentProps extends SheetPrimitive.DialogContentProps {
  /** Side the panel slides from. */
  side?: "right" | "top" | "left";
}

function SheetContent({
  side = "right",
  className,
  children,
  ...props
}: SheetContentProps) {
  return (
    <SheetPrimitive.Portal>
      <SheetOverlay />
      <SheetPrimitive.Content
        className={cn(
          "fixed inset-y-0 z-50 flex w-full max-w-[440px] flex-col bg-ivory shadow-float focus:outline-none",
          side === "right" && "right-0 sheet-panel border-l border-line",
          side === "left" && "left-0 sheet-panel-left border-r border-line",
          side === "top" && "top-0 sheet-panel-down border-b border-line max-w-none",
          className,
        )}
        {...props}
      >
        {children}
        <SheetPrimitive.Close
          aria-label="Close"
          className="absolute right-5 top-5 grid size-10 place-items-center rounded-full border border-line bg-ivory/80 text-ink backdrop-blur transition-colors hover:bg-ink hover:text-ivory"
        >
          <X className="size-4" strokeWidth={1.5} />
        </SheetPrimitive.Close>
      </SheetPrimitive.Content>
    </SheetPrimitive.Portal>
  );
}

function SheetHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex items-center justify-between border-b border-line px-6 py-5",
        className,
      )}
      {...props}
    />
  );
}

function SheetTitle(props: SheetPrimitive.DialogTitleProps) {
  return (
    <SheetPrimitive.Title className="font-serif text-2xl tracking-tight" {...props} />
  );
}

function SheetDescription(props: SheetPrimitive.DialogDescriptionProps) {
  return (
    <SheetPrimitive.Description className="sr-only" {...props} />
  );
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetOverlay,
};
