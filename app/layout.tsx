import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"], 
});

export const metadata: Metadata = {
  title: "Elite Steel Concepts | Custom Food Trucks & Mobile Kitchen Fabrication",
  description: "Elite Steel Concepts builds premium custom food trucks, trailers, and mobile kitchens in Manassas, VA. Serving the DMV and nationwide. Request a quote today.",
  icons: {
    icon: "/logo.png",
  }
};

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
        {children}
      </body>
    </html>
  );
}
