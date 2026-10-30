"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const Modal = DialogPrimitive.Root;
const ModalTrigger = DialogPrimitive.Trigger;
const ModalClose = DialogPrimitive.Close;

function ModalOverlay({ className, ...props }: DialogPrimitive.DialogOverlayProps) {
  return (
    <DialogPrimitive.Overlay
      className={cn(
        "overlay-layer fixed inset-0 z-50 bg-ink/55 backdrop-blur-[4px]",
        className,
      )}
      {...props}
    />
  );
}

function ModalContent({
  className,
  children,
  ...props
}: DialogPrimitive.DialogContentProps) {
  return (
    <DialogPrimitive.Portal>
      <ModalOverlay />
      <DialogPrimitive.Content
        className={cn(
          "modal-panel fixed left-1/2 top-1/2 z-50 w-[calc(100vw-2rem)] max-w-xl -translate-x-1/2 -translate-y-1/2 focus:outline-none",
          className,
        )}
        {...props}
      >
        {children}
        <DialogPrimitive.Close
          aria-label="Close"
          className="absolute right-4 top-4 grid size-9 place-items-center rounded-full border border-line bg-ivory/80 text-ink backdrop-blur transition-colors hover:bg-ink hover:text-ivory"
        >
          <X className="size-4" strokeWidth={1.5} />
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

const ModalTitle = DialogPrimitive.Title;
const ModalDescription = DialogPrimitive.Description;

export { Modal, ModalTrigger, ModalClose, ModalContent, ModalTitle, ModalDescription, ModalOverlay };
