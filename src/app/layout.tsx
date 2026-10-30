import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, DM_Sans, Caveat } from "next/font/google";
import { MotionConfig } from "framer-motion";
import "./globals.css";
import { getArtworks, getSiteSettings } from "@/lib/data/storefront";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/layout/cart-drawer";
import { WishlistDrawer } from "@/components/layout/wishlist-drawer";
import { SearchDialog } from "@/components/layout/search-dialog";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { WhatsAppFab } from "@/components/layout/whatsapp-fab";
import { StorefrontChrome } from "@/components/layout/storefront-chrome";
import { SettingsProvider } from "@/components/providers/settings-provider";
import { cn } from "@/lib/utils";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const sans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const hand = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://gayuu.example.com";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const title = settings.seo.title || `${settings.brandName} — ${settings.tagline}`;
  const description = settings.seo.description;

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: title,
      template: `%s · ${settings.brandName}`,
    },
    description,
    keywords: [
      "handmade art",
      "original paintings",
      "art prints sri lanka",
      "custom portrait commission",
      "sri lankan artist",
      "boutique art store",
      "gayuu",
    ],
    icons: { icon: settings.favicon || "/favicon.ico" },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: "/",
      siteName: settings.brandName,
      title,
      description,
      images: [
        {
          url: settings.seo.ogImage || "/images/og-cover.jpg",
          width: 1200,
          height: 630,
          alt: `${settings.brandName} — artwork`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [settings.seo.ogImage || "/images/og-cover.jpg"],
    },
    robots: { index: true, follow: true },
  };
}

export const viewport: Viewport = {
  themeColor: "#FAF8F5",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, artworks] = await Promise.all([
    getSiteSettings(),
    getArtworks(),
  ]);

  return (
    <html
      lang="en"
      className={cn("h-full", serif.variable, sans.variable, hand.variable, "font-sans")}
    >
      <body className="grain flex min-h-full flex-col antialiased">
        <MotionConfig reducedMotion="user">
          <SettingsProvider settings={settings}>
            <a
              href="#main-content"
              className="sr-only rounded-full bg-ink px-5 py-2.5 text-xs uppercase tracking-widest text-ivory focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80]"
            >
              Skip to content
            </a>

            <StorefrontChrome>
              <Navbar />
              <MobileMenu />
            </StorefrontChrome>

            <main id="main-content" className="flex-1">
              {children}
            </main>

            <StorefrontChrome>
              <Footer />

              <CartDrawer />
              <WishlistDrawer artworks={artworks} />
              <SearchDialog />
              <WhatsAppFab />
            </StorefrontChrome>
          </SettingsProvider>
        </MotionConfig>
      </body>
    </html>
  );
}
