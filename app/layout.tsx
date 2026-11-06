import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

// Variable font: one file covers every weight used on the site (300–900).
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

import { getSEO, getSettings } from "@/lib/db";
import { getSections } from "@/lib/pageContent";
import { SITE_HEADER, SITE_FOOTER } from "@/lib/pageContent/pages/site";
import Analytics from "@/components/Analytics";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SiteChrome from "@/components/layout/SiteChrome";

// Admin changes must show on the next page load, including saves made from another server
// (local dev and production share one database), so pages are never served from a page cache.
// Rendering stays fast because lib/db.ts serves the data from memory.
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSEO();
  return {
    metadataBase: new URL(seo.canonicalUrl || 'https://www.esteelconcepts.com'),
    title: seo.siteTitle,
    description: seo.description,
    keywords: seo.keywords,
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "48x48" },
        { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      ],
      apple: "/apple-touch-icon.png",
    },
    openGraph: {
      images: [seo.ogImage],
    },
    twitter: {
      site: seo.twitterHandle,
    },
    alternates: {
      canonical: '/',
    }
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [settings, [header, footer]] = await Promise.all([
    getSettings(),
    getSections([SITE_HEADER, SITE_FOOTER] as const),
  ]);

  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${montserrat.variable} antialiased font-sans text-foreground bg-background flex flex-col min-h-screen`}
      >
        <Analytics />
        <SiteChrome
          header={<Header phone={settings.phone} content={header} />}
          footer={<Footer settings={settings} content={footer} />}
        >
          {children}
        </SiteChrome>
      </body>
    </html>
  );
}
