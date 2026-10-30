"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

export interface AccordionItem {
  title: string;
  content: React.ReactNode;
}

/** Gentle expanding disclosure used for shipping / care / authenticity. */
export function Accordion({ items }: { items: AccordionItem[] }) {
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);

  return (
    <div className="border-t border-line">
      {items.map((item, index) => {
        const open = openIndex === index;
        return (
          <div key={item.title} className="border-b border-line">
            <button
              type="button"
              aria-expanded={open}
              onClick={() => setOpenIndex(open ? null : index)}
              className="flex w-full items-center justify-between gap-4 py-4 text-left text-sm font-medium tracking-wide text-ink transition-colors hover:text-blush-deep"
            >
              {item.title}
              <span className="relative grid size-6 place-items-center">
                <Plus
                  className={`absolute size-4 transition-transform duration-300 ${
                    open ? "rotate-45 opacity-0" : "opacity-100"
                  }`}
                  strokeWidth={1.5}
                />
                <Minus
                  className={`absolute size-4 transition-transform duration-300 ${
                    open ? "opacity-100" : "-rotate-45 opacity-0"
                  }`}
                  strokeWidth={1.5}
                />
              </span>
            </button>
            <AnimatePresence initial={false}>
              {open ? (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className="pb-5 text-sm leading-relaxed text-muted">
                    {item.content}
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
