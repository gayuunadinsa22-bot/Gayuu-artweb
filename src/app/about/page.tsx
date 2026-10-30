import type { Metadata } from "next";
import { AboutContent } from "@/components/about/about-content";
import { getAboutContent, getAboutImages } from "@/lib/data/storefront";

export const metadata: Metadata = {
  title: "About the Artist",
  description:
    "Meet the hands behind the art — the journey, inspirations, materials and philosophy of the studio.",
};

export default async function AboutPage() {
  const [content, images] = await Promise.all([getAboutContent(), getAboutImages()]);
  return <AboutContent content={content} images={images} />;
}
