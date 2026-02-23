import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"], 
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
      icon: "/logo.png",
    },
    openGraph: {
      images: [seo.ogImage],
    },
    twitter: {
      site: seo.twitterHandle,
    },
    alternates: {
      canonical: seo.canonicalUrl,
    }
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${montserrat.variable} antialiased font-sans text-foreground bg-background flex flex-col min-h-screen`}
      >
        <Analytics />
        {children}
      </body>
    </html>
  );
}
