import React from "react";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";
import ContactForm from "@/components/ContactForm";
import LazyMap from "@/components/ui/LazyMap";
import { Phone, Mail, MapPin } from "lucide-react";
import { getSettings, getPageSEO, getSEO } from "@/lib/db";
import type { Metadata } from "next";
import PageJsonLd from "@/components/PageJsonLd";
import { getSections } from "@/lib/pageContent";
import { CONTACT_HEADER, CONTACT_DETAILS } from "@/lib/pageContent/pages/contact";

// Cached and regenerated every 5 minutes, or immediately when the admin saves changes (revalidatePath).
export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSEO();
  const pageSeo = await getPageSEO("contact");
  
  return {
    title: pageSeo?.title || `Contact Elite Steel Concepts | Custom Food Trucks`,
    description: pageSeo?.description || seo.description,
    keywords: pageSeo?.keywords || seo.keywords,
    alternates: { canonical: '/contact' },
  };
}

export default async function ContactPage() {
  const [settings, [header, details]] = await Promise.all([
    getSettings(),
    getSections([CONTACT_HEADER, CONTACT_DETAILS] as const),
  ]);

  const phoneDisplay = settings.phone?.startsWith("+") ? settings.phone : `+1 ${settings.phone}`;
  const mapEmbedUrl = settings.mapEmbedUrl
    || `https://maps.google.com/maps?q=${encodeURIComponent(settings.address)}&z=15&output=embed`;

  const contactCards = [
    { title: details.addressTitle, icon: MapPin, value: settings.address, href: settings.googleMapsLink },
    { title: details.phoneTitle, icon: Phone, value: phoneDisplay, href: `tel:${phoneDisplay.replace(/[^\d+]/g, "")}` },
    { title: details.emailTitle, icon: Mail, value: settings.email, href: `mailto:${settings.email}` },
  ];

  return (
    <>
      <PageJsonLd pageId="contact" />
      <PageHeader
        eyebrow={header.eyebrow}
        title={header.title}
        subtitle={header.subtitle}
        normalCaseSubtitle
      />

      <Section className="bg-white pb-24">
        <Container>
          {/* Contact Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {contactCards.map((card) => (
              <div key={card.href || card.title} className="bg-gray-50 border border-gray-200 p-8 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-primary text-black flex items-center justify-center mb-5">
                  <card.icon size={26} />
                </div>
                <h2 className="text-lg font-black uppercase tracking-tight text-black mb-2">{card.title}</h2>
                {card.href ? (
                  <a href={card.href} className="text-gray-600 hover:text-primary transition-colors break-words">
                    {card.value}
                  </a>
                ) : (
                  <p className="text-gray-600">{card.value}</p>
                )}
              </div>
            ))}
          </div>

          {/* Map + Form */}
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 bg-white border border-gray-200 shadow-xl overflow-hidden">
            <LazyMap
              src={mapEmbedUrl}
              title="Elite Steel Concepts Location"
              address={settings.address}
              mapsLink={settings.googleMapsLink}
              className="min-h-[350px] lg:min-h-full bg-gray-100"
            />
            <div className="p-8 md:p-12">
              <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-black mb-8 leading-none">
                {details.formTitle} <span className="text-primary">{details.formTitleHighlight}</span>
              </h2>
              <ContactForm />
            </div>
          </div>
        </Container>
      </Section>

    </>
  );
}
