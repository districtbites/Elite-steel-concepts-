import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getSettings } from "@/lib/db";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();

  return (
    <>
      <Header settings={settings} />
      <main className="flex-grow">
        {children}
      </main>
      <Footer settings={settings} />
    </>
  );
}
