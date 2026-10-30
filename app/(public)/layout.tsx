import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getSettings } from "@/lib/db";
import { getSections } from "@/lib/pageContent";
import { SITE_HEADER, SITE_FOOTER } from "@/lib/pageContent/pages/site";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, [header, footer]] = await Promise.all([
    getSettings(),
    getSections([SITE_HEADER, SITE_FOOTER] as const),
  ]);

  return (
    <>
      <Header phone={settings.phone} content={header} />
      <main className="flex-grow">
        {children}
      </main>
      <Footer settings={settings} content={footer} />
    </>
  );
}
