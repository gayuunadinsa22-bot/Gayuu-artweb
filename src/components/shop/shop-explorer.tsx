"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { artworks as localArtworks, isInStock, type CategorySlug, type Artwork } from "@/lib/artworks";
import { categories } from "@/lib/content";
import { useWishlistStore } from "@/lib/store";
import { ProductCard } from "@/components/product/product-card";
import { Reveal } from "@/components/shared/reveal";
import { cn } from "@/lib/utils";

type SortKey = "featured" | "price-asc" | "price-desc" | "newest";
type StockFilter = "all" | "available" | "sold";

const sortOptions: { key: SortKey; label: string }[] = [
  { key: "featured", label: "Featured" },
  { key: "price-asc", label: "Price: low to high" },
  { key: "price-desc", label: "Price: high to low" },
  { key: "newest", label: "Newest first" },
];

const stockOptions: { key: StockFilter; label: string }[] = [
  { key: "all", label: "All availability" },
  { key: "available", label: "Available only" },
  { key: "sold", label: "Sold archive" },
];

export function ShopExplorer({ artworks: artworksProp }: { artworks?: Artwork[] } = {}) {
  const router = useRouter();
  const params = useSearchParams();
  const artworks = artworksProp ?? localArtworks;

  const category = (params.get("category") as CategorySlug | null) ?? "all";
  const urlQuery = params.get("q") ?? "";

  const [query, setQuery] = React.useState(urlQuery);
  const [sort, setSort] = React.useState<SortKey>("featured");
  const [stock, setStock] = React.useState<StockFilter>("all");
  const [wishlistOnly, setWishlistOnly] = React.useState(false);
  const [mobileFilters, setMobileFilters] = React.useState(false);
  const wishlistIds = useWishlistStore((s) => s.ids);

  // Keep the local search box in sync with ?q= (e.g. from the search
  // dialog) — render-time adjustment instead of an effect.
  const [prevUrlQuery, setPrevUrlQuery] = React.useState(urlQuery);
  if (prevUrlQuery !== urlQuery) {
    setPrevUrlQuery(urlQuery);
    setQuery(urlQuery);
  }

  const replaceParams = React.useCallback(
    (next: { category?: string; q?: string }) => {
      const merged = new URLSearchParams(params.toString());
      const nextCategory = next.category ?? category;
      const nextQuery = next.q ?? query;

      if (nextCategory === "all") merged.delete("category");
      else merged.set("category", nextCategory);

      if (!nextQuery.trim()) merged.delete("q");
      else merged.set("q", nextQuery.trim());

      const search = merged.toString();
      router.replace(search ? `/shop?${search}` : "/shop", { scroll: false });
    },
    [category, params, query, router],
  );

  const filtered = React.useMemo(() => {
    let result = artworks.slice();

    if (category !== "all") {
      result = result.filter((item) => item.category === category);
    }

    const search = urlQuery.trim().toLowerCase();
    if (search) {
      result = result.filter((item) =>
        [item.title, item.tagline, item.description, item.medium, item.category]
          .join(" ")
          .toLowerCase()
          .includes(search),
      );
    }

    if (stock === "available") result = result.filter((item) => isInStock(item));
    if (stock === "sold") result = result.filter((item) => !isInStock(item));

    if (wishlistOnly) {
      result = result.filter((item) => wishlistIds.includes(item.id));
    }

    switch (sort) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        result.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
        break;
      default:
        result.sort((a, b) => Number(b.featured) - Number(a.featured));
    }

    return result;
  }, [artworks, category, urlQuery, stock, wishlistOnly, sort, wishlistIds]);

  const hasFilters =
    category !== "all" || urlQuery.trim() !== "" || stock !== "all" || wishlistOnly;

  const clearAll = () => {
    setStock("all");
    setWishlistOnly(false);
    setSort("featured");
    setQuery("");
    replaceParams({ category: "all", q: "" });
  };

  const pill =
    "shrink-0 rounded-full border px-4 py-2 text-[13px] tracking-wide transition-all duration-300 cursor-pointer";

  return (
    <div className="px-5 pb-24 pt-28 md:px-10 md:pt-36">
      <div className="mx-auto max-w-[1440px]">
        {/* Header */}
        <Reveal className="max-w-3xl">
          <p className="eyebrow mb-5 flex items-center gap-3">
            <span aria-hidden className="h-px w-10 bg-blush" />
            the shop
          </p>
          <h1 className="font-serif text-6xl leading-[0.98] tracking-[-0.02em] sm:text-7xl md:text-8xl">
            Shop the <span className="italic text-blush-deep">art.</span>
          </h1>
          <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-muted">
            Originals, prints and small treasures — every piece is made or chosen by hand.
            <span className="font-hand ml-2 text-lg text-ink">take your time ♡</span>
          </p>
        </Reveal>

        {/* Category pills */}
        <Reveal delay={0.1} className="mt-10">
          <div className="no-scrollbar -mx-5 flex gap-2.5 overflow-x-auto px-5 pb-1 md:mx-0 md:flex-wrap md:px-0">
            <button
              type="button"
              onClick={() => replaceParams({ category: "all" })}
              className={cn(
                pill,
                category === "all"
                  ? "border-ink bg-ink text-ivory"
                  : "border-line bg-ivory text-muted hover:border-ink hover:text-ink",
              )}
            >
              All works
            </button>
            {categories.map((item) => (
              <button
                key={item.slug}
                type="button"
                onClick={() => replaceParams({ category: item.slug })}
                className={cn(
                  pill,
                  category === item.slug
                    ? "border-ink bg-ink text-ivory"
                    : "border-line bg-ivory text-muted hover:border-ink hover:text-ink",
                )}
              >
                {item.name}
              </button>
            ))}
          </div>
        </Reveal>

        {/* Controls */}
        <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-4 border-y border-line py-4">
          <div className="flex min-w-[210px] flex-1 items-center gap-2.5 border-b border-line focus-within:border-ink">
            <Search className="size-4 shrink-0 text-muted" strokeWidth={1.5} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onBlur={() => replaceParams({ q: query })}
              onKeyDown={(event) => {
                if (event.key === "Enter") replaceParams({ q: query });
              }}
              placeholder="Search artworks…"
              aria-label="Search artworks"
              className="w-full bg-transparent py-2 text-sm text-ink placeholder:text-muted/60 focus:outline-none"
            />
            {query ? (
              <button
                type="button"
                aria-label="Clear search text"
                onClick={() => {
                  setQuery("");
                  replaceParams({ q: "" });
                }}
                className="text-muted hover:text-ink"
              >
                <X className="size-4" strokeWidth={1.5} />
              </button>
            ) : null}
          </div>

          <label className="hidden items-center gap-2 text-sm text-muted md:flex">
            <SlidersHorizontal className="size-4" strokeWidth={1.5} />
            <span className="sr-only">Sort by</span>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as SortKey)}
              className="cursor-pointer bg-transparent py-2 text-sm text-ink focus:outline-none"
            >
              {sortOptions.map((option) => (
                <option key={option.key} value={option.key}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="hidden items-center gap-2 text-sm text-muted md:flex">
            <span className="sr-only">Availability</span>
            <select
              value={stock}
              onChange={(event) => setStock(event.target.value as StockFilter)}
              className="cursor-pointer bg-transparent py-2 text-sm text-ink focus:outline-none"
            >
              {stockOptions.map((option) => (
                <option key={option.key} value={option.key}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <button
            type="button"
            onClick={() => setWishlistOnly((value) => !value)}
            aria-pressed={wishlistOnly}
            className={cn(
              "flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs transition-all",
              wishlistOnly
                ? "border-blush-deep bg-blush/25 text-ink"
                : "border-line text-muted hover:border-blush hover:text-ink",
            )}
          >
            <Heart
              className={cn("size-3.5", wishlistOnly && "fill-blush-deep text-blush-deep")}
              strokeWidth={1.6}
            />
            Saved
          </button>

          <div className="ml-auto flex items-center gap-4">
            <p className="text-xs tracking-wide text-muted" aria-live="polite">
              {filtered.length} of {artworks.length} works
            </p>
            <button
              type="button"
              onClick={() => setMobileFilters((value) => !value)}
              className="flex items-center gap-1.5 text-xs uppercase tracking-[0.16em] text-ink md:hidden"
            >
              <SlidersHorizontal className="size-3.5" strokeWidth={1.5} /> Filters
            </button>
            <AnimatePresence>
              {hasFilters ? (
                <motion.button
                  type="button"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  onClick={clearAll}
                  className="text-xs uppercase tracking-[0.16em] text-blush-deep underline-offset-4 hover:underline"
                >
                  Clear filters
                </motion.button>
              ) : null}
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile sort/stock */}
        <AnimatePresence initial={false}>
          {mobileFilters ? (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden md:hidden"
            >
              <div className="flex flex-col gap-3 border-b border-line py-4">
                <label className="flex items-center justify-between gap-3 text-sm text-muted">
                  Sort by
                  <select
                    value={sort}
                    onChange={(event) => setSort(event.target.value as SortKey)}
                    className="rounded-full border border-line bg-ivory px-4 py-2 text-sm text-ink"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.key} value={option.key}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex items-center justify-between gap-3 text-sm text-muted">
                  Availability
                  <select
                    value={stock}
                    onChange={(event) => setStock(event.target.value as StockFilter)}
                    className="rounded-full border border-line bg-ivory px-4 py-2 text-sm text-ink"
                  >
                    {stockOptions.map((option) => (
                      <option key={option.key} value={option.key}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="mt-12 grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-3 md:gap-x-7 xl:grid-cols-4">
            {filtered.map((artwork, index) => (
              <ProductCard key={artwork.id} artwork={artwork} index={index} />
            ))}
          </div>
        ) : (
          <div className="mx-auto mt-20 max-w-md text-center">
            <div className="mx-auto grid size-20 place-items-center rounded-full bg-cream">
              <Search className="size-7 text-muted" strokeWidth={1.2} />
            </div>
            <p className="mt-6 font-serif text-3xl tracking-tight">Nothing here (yet)</p>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              No artworks match those filters — try a different search, or clear
              everything and start again.
            </p>
            <button
              type="button"
              onClick={clearAll}
              className="mt-6 rounded-full bg-ink px-6 py-3 text-sm text-ivory transition-colors hover:bg-blush-deep"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
