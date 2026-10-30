"use client";

/**
 * GLOBAL CLIENT STATE — cart, wishlist, UI + recently viewed.
 * All stores persist to localStorage and hydrate manually to avoid
 * SSR/CSR mismatches (see `hydrated` flags + rehydrate() in effects).
 */

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Artwork } from "@/lib/artworks";

export interface CartLine {
  id: string;
  slug: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
  maxQuantity: number;
  category: string;
}

interface CartStore {
  lines: CartLine[];
  hydrated: boolean;
  add: (artwork: Artwork, quantity?: number) => void;
  remove: (id: string) => void;
  setQuantity: (id: string, quantity: number) => void;
  clear: () => void;
  setHydrated: (value: boolean) => void;
}

const sameLine = (line: CartLine, id: string) => line.id === id;

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      lines: [],
      hydrated: false,
      setHydrated: (value) => set({ hydrated: value }),
      add: (artwork, quantity = 1) => {
        const existing = get().lines.find((l) => sameLine(l, artwork.id));
        if (existing) {
          set({
            lines: get().lines.map((l) =>
              sameLine(l, artwork.id)
                ? {
                    ...l,
                    quantity: Math.min(
                      l.quantity + quantity,
                      Math.max(artwork.maxQuantity, 1),
                    ),
                  }
                : l,
            ),
          });
          return;
        }
        set({
          lines: [
            ...get().lines,
            {
              id: artwork.id,
              slug: artwork.slug,
              title: artwork.title,
              price: artwork.price,
              image: artwork.images[0],
              quantity: Math.min(quantity, artwork.maxQuantity),
              maxQuantity: artwork.maxQuantity,
              category: artwork.category,
            },
          ],
        });
      },
      remove: (id) => set({ lines: get().lines.filter((l) => !sameLine(l, id)) }),
      setQuantity: (id, quantity) =>
        set({
          lines: get().lines.map((l) =>
            sameLine(l, id)
              ? { ...l, quantity: Math.max(1, Math.min(quantity, l.maxQuantity)) }
              : l,
          ),
        }),
      clear: () => set({ lines: [] }),
    }),
    {
      name: "gayuu-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ lines: state.lines }) as CartStore,
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);

export function cartCount(lines: CartLine[]): number {
  return lines.reduce((sum, l) => sum + l.quantity, 0);
}

export function cartSubtotal(lines: CartLine[]): number {
  return lines.reduce((sum, l) => sum + l.price * l.quantity, 0);
}

/* ── Wishlist ─────────────────────────────────────────────── */

interface WishlistStore {
  ids: string[];
  hydrated: boolean;
  toggle: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
  setHydrated: (value: boolean) => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      ids: [],
      hydrated: false,
      setHydrated: (value) => set({ hydrated: value }),
      toggle: (id) =>
        set({
          ids: get().ids.includes(id)
            ? get().ids.filter((x) => x !== id)
            : [...get().ids, id],
        }),
      remove: (id) => set({ ids: get().ids.filter((x) => x !== id) }),
      clear: () => set({ ids: [] }),
    }),
    {
      name: "gayuu-wishlist",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ ids: state.ids }) as WishlistStore,
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);

/* ── Recently viewed ──────────────────────────────────────── */

interface RecentStore {
  slugs: string[];
  hydrated: boolean;
  push: (slug: string) => void;
  setHydrated: (value: boolean) => void;
}

export const useRecentStore = create<RecentStore>()(
  persist(
    (set, get) => ({
      slugs: [],
      hydrated: false,
      setHydrated: (value) => set({ hydrated: value }),
      push: (slug) => {
        const next = [slug, ...get().slugs.filter((s) => s !== slug)].slice(0, 6);
        set({ slugs: next });
      },
    }),
    {
      name: "gayuu-recent",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ slugs: state.slugs }) as RecentStore,
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);

/* ── UI (drawers / overlays) ──────────────────────────────── */

interface UIStore {
  cartOpen: boolean;
  wishlistOpen: boolean;
  searchOpen: boolean;
  menuOpen: boolean;
  setCartOpen: (open: boolean) => void;
  setWishlistOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;
  setMenuOpen: (open: boolean) => void;
}

export const useUIStore = create<UIStore>()((set) => ({
  cartOpen: false,
  wishlistOpen: false,
  searchOpen: false,
  menuOpen: false,
  setCartOpen: (cartOpen) => set({ cartOpen }),
  setWishlistOpen: (wishlistOpen) => set({ wishlistOpen }),
  setSearchOpen: (searchOpen) => set({ searchOpen }),
  setMenuOpen: (menuOpen) => set({ menuOpen }),
}));

/** Rehydrate all persisted stores — call once on mount. */
export function rehydrateStores(): void {
  useCartStore.persist.rehydrate();
  useWishlistStore.persist.rehydrate();
  useRecentStore.persist.rehydrate();
}
