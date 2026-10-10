import React from "react";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";
import ContactForm from "@/components/ContactForm";
import { Phone, Mail, MapPin } from "lucide-react";
import { getSettings, getPageSEO, getSEO } from "@/lib/db";
import type { Metadata } from "next";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
  const settings = await getSettings();

  const phoneDisplay = settings.phone?.startsWith("+") ? settings.phone : `+1 ${settings.phone}`;
  const mapEmbedUrl = settings.mapEmbedUrl
    || `https://maps.google.com/maps?q=${encodeURIComponent(settings.address)}&z=15&output=embed`;

  const contactCards = [
    { title: "Our Address", icon: MapPin, value: settings.address, href: settings.googleMapsLink },
    { title: "Phone Number", icon: Phone, value: phoneDisplay, href: `tel:${phoneDisplay.replace(/[^\d+]/g, "")}` },
    { title: "Email", icon: Mail, value: settings.email, href: `mailto:${settings.email}` },
  ];

  return (
    <>
      <PageHeader
        title="Contact Us"
        subtitle="Discuss your custom food truck or trailer. Fill out the form below. Our team member will get back to you shortly."
        normalCaseSubtitle
      />

      <Section className="bg-white pb-24">
        <Container>
          {/* Contact Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {contactCards.map((card) => (
              <div key={card.title} className="bg-gray-50 border border-gray-200 p-8 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-primary text-black flex items-center justify-center mb-5">
                  <card.icon size={26} />
                </div>
                <h3 className="text-lg font-black uppercase tracking-tight text-black mb-2">{card.title}</h3>
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
            <div className="relative min-h-[350px] lg:min-h-full bg-gray-100">
              <iframe
                src={mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Elite Steel Concepts Location"
                className="absolute inset-0 w-full h-full"
              />
            </div>
            <div className="p-8 md:p-12">
              <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-black mb-8 leading-none">
                Let&apos;s Discuss Your <span className="text-primary">Build</span>
              </h2>
              <ContactForm />
            </div>
          </div>
        </Container>
      </Section>

    </>
  );
}
