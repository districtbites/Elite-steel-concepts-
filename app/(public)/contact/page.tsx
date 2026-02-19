import React from "react";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";
import ContactForm from "@/components/ContactForm";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { getSettings } from "@/lib/db";

import { getSEO } from "@/lib/db";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSEO();
  const pageSeo = seo.pages?.["contact"];
  
  return {
    title: pageSeo?.title || seo.siteTitle,
    description: pageSeo?.description || seo.description,
    keywords: pageSeo?.keywords || seo.keywords,
  };
}

export default async function ContactPage() {
  const settings = await getSettings();

  return (
    <>
      <PageHeader
        title="Get In Touch"
        subtitle="Ready to start your build? Contact us today for a consultation or quote."
      />

      <Section className="bg-white">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Contact Info Sidebar (4 Cols) */}
            <div className="lg:col-span-4 space-y-8">
              <div>
                <h3 className="text-2xl font-black uppercase text-secondary mb-6 border-l-4 border-primary pl-4 tracking-tight">
                  Contact Info
                </h3>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  We are here to help you every step of the way. Reach out to us via phone or email, or visit our shop.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-primary/10 p-3 rounded-full mr-4 text-primary shrink-0">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-secondary uppercase text-sm mb-1">Phone</h4>
                    <a href={`tel:${settings.phone}`} className="text-gray-600 hover:text-primary transition-colors">
                      {settings.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-primary/10 p-3 rounded-full mr-4 text-primary shrink-0">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-secondary uppercase text-sm mb-1">Email</h4>
                    <a href={`mailto:${settings.email}`} className="text-gray-600 hover:text-primary transition-colors">
                      {settings.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-primary/10 p-3 rounded-full mr-4 text-primary shrink-0">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-secondary uppercase text-sm mb-1">Location</h4>
                    <p className="text-gray-600 whitespace-pre-line">
                      {settings.address}
                    </p>
                  </div>
                </div>
                
                 <div className="flex items-start">
                  <div className="bg-primary/10 p-3 rounded-full mr-4 text-primary shrink-0">
                    <Clock size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-secondary uppercase text-sm mb-1">Hours</h4>
                    <p className="text-gray-600">
                      Mon - Fri: 8:00 AM - 5:00 PM<br />
                      Sat - Sun: Closed
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form Main (8 Cols) */}
            <div className="lg:col-span-8">
               <div className="bg-white p-6 md:p-10 border border-gray-100 shadow-xl rounded-xl">
                  <h3 className="text-2xl font-black uppercase text-secondary mb-2 tracking-tight">
                    Send us a Message
                  </h3>
                  <p className="text-gray-500 mb-8">
                    Fill out the form below and we will get back to you as soon as possible.
                  </p>
                  <ContactForm />
               </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
