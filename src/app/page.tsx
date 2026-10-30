import { Hero } from "@/components/home/hero";
import { Ticker } from "@/components/home/ticker";
import { FeaturedWorks } from "@/components/home/featured-works";
import { RecentlyViewed } from "@/components/product/recently-viewed";
import { ArtistStory } from "@/components/home/artist-story";
import { Categories } from "@/components/home/categories";
import { BehindTheCanvas } from "@/components/home/behind-the-canvas";
import { Testimonials } from "@/components/home/testimonials";
import { InstagramGrid } from "@/components/home/instagram-grid";
import { Newsletter } from "@/components/home/newsletter";
import {
  getArtworks,
  getHomepageImages,
  getHomepageSections,
  getTestimonials,
} from "@/lib/data/storefront";

export default async function HomePage() {
  const [sections, artworks, testimonials, images] = await Promise.all([
    getHomepageSections(),
    getArtworks(),
    getTestimonials(),
    getHomepageImages(),
  ]);

  return (
    <>
      <Hero sections={sections.hero} images={images} />
      <Ticker />
      <FeaturedWorks artworks={artworks} />
      <RecentlyViewed artworks={artworks} />
      <ArtistStory sections={sections.artist} images={images} />
      <Categories />
      <BehindTheCanvas sections={sections.behind} />
      <Testimonials items={testimonials} />
      <InstagramGrid sections={sections.instagram} />
      <Newsletter sections={sections.newsletter} />
    </>
  );
}
