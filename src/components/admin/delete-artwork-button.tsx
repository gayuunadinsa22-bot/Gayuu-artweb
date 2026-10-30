"use client";

import { useState, useTransition } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Modal,
  ModalContent,
  ModalTitle,
  ModalDescription,
} from "@/components/ui/dialog";
import { useToast } from "@/components/admin/toast";
import { deleteArtwork } from "@/lib/admin/actions";

export function DeleteArtworkButton({
  id,
  title,
}: {
  id: string;
  title: string;
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteArtwork(id);
      if (result.ok) {
        setOpen(false);
        toast({ title: `"${title}" deleted.`, variant: "success" });
      } else {
        toast({
          title: "Could not delete artwork",
          description: result.error,
          variant: "destructive",
        });
      }
    });
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen(true)}
        aria-label={`Delete ${title}`}
        className="text-muted hover:bg-red-50 hover:text-red-700"
      >
        <Trash2 className="size-3.5" strokeWidth={1.5} />
      </Button>

      <Modal open={open} onOpenChange={setOpen}>
        <ModalContent className="space-y-4 border border-line bg-ivory p-6 pr-14">
          <div className="space-y-2">
            <ModalTitle className="font-serif text-xl text-ink">
              Delete &quot;{title}&quot;?
            </ModalTitle>
            <ModalDescription className="text-sm text-muted">
              This removes the painting and its images from your shop. This
              cannot be undone.
            </ModalDescription>
          </div>
          <div className="flex justify-end gap-3">
            <Button
              variant="soft"
              onClick={() => setOpen(false)}
              disabled={pending}
            >
              Keep it
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={pending}
            >
              {pending && <Loader2 className="size-4 animate-spin" />}
              Delete painting
            </Button>
          </div>
        </ModalContent>
      </Modal>
    </>
  );
}
