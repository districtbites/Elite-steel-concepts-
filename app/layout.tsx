import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

// Variable font: one file covers every weight used on the site (300–900).
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

import { getSEO } from "@/lib/db";
import Analytics from "@/components/Analytics";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${montserrat.variable} antialiased font-sans text-foreground bg-background flex flex-col min-h-screen`}
      >
        <Analytics />
        {children}
      </body>
    </html>
  );
}
