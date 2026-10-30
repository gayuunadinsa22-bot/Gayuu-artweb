"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import { Search as SearchIcon } from "lucide-react";
import { Modal, ModalContent, ModalTitle, ModalDescription } from "@/components/ui/dialog";
import { useUIStore } from "@/lib/store";

const suggestions = ["Original paintings", "Art prints", "Portraits", "Mini art", "Sketches"];

export function SearchDialog() {
  const open = useUIStore((s) => s.searchOpen);
  const setOpen = useUIStore((s) => s.setSearchOpen);
  const [query, setQuery] = React.useState("");
  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
    setOpen(false);
  }, [pathname, setOpen]);

  const submit = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    setOpen(false);
    setQuery("");
    router.push(`/shop?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalContent className="max-w-lg rounded-3xl border border-line bg-ivory p-7 shadow-float md:p-9">
        <ModalTitle className="font-serif text-3xl tracking-tight">Find a piece</ModalTitle>
        <ModalDescription className="mt-1.5 text-sm text-muted">
          Search the studio by title, mood or category.
        </ModalDescription>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            submit(query);
          }}
          className="mt-7"
        >
          <div className="flex items-center gap-3 border-b border-ink pb-2.5">
            <SearchIcon className="size-4 text-muted" strokeWidth={1.5} />
            <input
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="e.g. golden hour, lilac, portrait…"
              aria-label="Search artworks"
              className="w-full bg-transparent py-1 text-base text-ink placeholder:text-muted/55 focus:outline-none"
            />
            <button
              type="submit"
              className="shrink-0 rounded-full bg-ink px-4 py-1.5 text-[11px] uppercase tracking-[0.16em] text-ivory transition-colors hover:bg-blush-deep"
            >
              Search
            </button>
          </div>
        </form>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className="eyebrow mr-1">Try</span>
          {suggestions.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => submit(item)}
              className="rounded-full border border-line px-3.5 py-1.5 text-xs text-muted transition-all hover:border-blush hover:bg-blush/20 hover:text-ink"
            >
              {item}
            </button>
          ))}
        </div>
      </ModalContent>
    </Modal>
  );
}
