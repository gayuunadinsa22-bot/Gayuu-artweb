import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getRelatedArtworks } from "@/lib/artworks";
import { getArtworkBySlug, getArtworks, getSiteSettings } from "@/lib/data/storefront";
import { categories } from "@/lib/content";
import { ProductDetail } from "@/components/product/product-detail";
import { ProductCard } from "@/components/product/product-card";
import { SectionHeading } from "@/components/shared/section-heading";
import { RecentlyViewed } from "@/components/product/recently-viewed";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

/**
 * With `cacheComponents` enabled, `generateStaticParams` must return at least
 * one param — but artworks only exist once the admin adds them, so an empty
 * table fails the build with `empty-generate-static-params`. The export is
 * therefore omitted and this route is rendered on demand.
 *
 * `instant = false` opts the route out of static-shell validation, which is
 * what allows the page to await `params` and call `notFound()` at the top
 * level, so unknown slugs still return a real 404 status.
 */
export const instant = false;

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const [artwork, settings] = await Promise.all([
    getArtworkBySlug(slug),
    getSiteSettings(),
  ]);
  if (!artwork) return { title: "Artwork not found" };

  const categoryName =
    categories.find((category) => category.slug === artwork.category)?.name ?? "Artwork";

  return {
    title: `${artwork.title} — ${categoryName}`,
    description: artwork.tagline
      ? `${artwork.tagline}. ${artwork.description.slice(0, 130)}…`
      : artwork.description.slice(0, 155),
    openGraph: {
      title: `${artwork.title} · ${settings.brandName}`,
      description: artwork.tagline,
      images: [{ url: artwork.images[0], alt: artwork.title }],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const [artwork, artworks, settings] = await Promise.all([
    getArtworkBySlug(slug),
    getArtworks(),
    getSiteSettings(),
  ]);
  if (!artwork) notFound();

  const related = getRelatedArtworks(artwork, 4, artworks);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: artwork.title,
    description: artwork.description,
    image: artwork.images.map((image) => `${siteUrl()}${image}`),
    brand: { "@type": "Brand", name: settings.brandName },
    offers: {
      "@type": "Offer",
      priceCurrency: "LKR",
      price: artwork.price,
      availability:
        artwork.availability === "sold"
          ? "https://schema.org/SoldOut"
          : artwork.availability === "made-to-order"
            ? "https://schema.org/MadeToOrder"
            : "https://schema.org/InStock",
      url: `${siteUrl()}/shop/${artwork.slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <ProductDetail artwork={artwork} />

      {/* Related works */}
      <section className="border-t border-line px-5 py-20 md:px-10 md:py-24">
        <div className="mx-auto max-w-[1440px]">
          <SectionHeading
            kicker="Keep exploring"
            title={
              <>
                You may also <span className="italic text-blush-deep">love.</span>
              </>
            }
          />
          <div className="mt-12 grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-4 md:gap-x-7">
            {related.map((item, index) => (
              <ProductCard key={item.id} artwork={item} index={index} />
            ))}
          </div>
        </div>
      </section>

      <RecentlyViewed artworks={artworks} />
    </>
  );
}

function siteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "https://gayuu.example.com";
}
