import React from "react";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";
import CTASection from "@/components/ui/CTASection";
import { Wrench, Zap, Droplets, Wind, ArrowRight } from "lucide-react";
import { getSEO, getPageSEO } from "@/lib/db";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSEO();
  const pageSeo = await getPageSEO("repairs-and-upgrades");
  
  return {
    title: pageSeo?.title || `Repairs & Upgrades | ${seo.siteTitle}`,
    description: pageSeo?.description || seo.description,
    keywords: pageSeo?.keywords || seo.keywords,
    alternates: { canonical: '/services/repairs-and-upgrades' },
  };
}

export default function RepairsAndUpgradesPage() {
  return (
    <>
      <PageHeader
        title="Repairs & Upgrades"
        subtitle="Keep your mobile kitchen running at peak performance with our expert maintenance, repair, and upgrade services."
      />

      <Section className="bg-white">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="bg-gray-50 p-8 rounded-xl border border-gray-100 hover:border-primary/30 transition-colors">
              <h3 className="text-2xl font-black uppercase text-secondary mb-6 tracking-tight">Maintenance & Repairs</h3>
              <ul className="space-y-4">
                {[
                  { icon: Zap, text: "Generator Service & Replacement" },
                  { icon: Zap, text: "Electrical System Diagnostics" },
                  { icon: Droplets, text: "Plumbing & Water System Fixes" },
                  { icon: Wind, text: "Hood Fan & Ventilation Repair" },
                ].map((item, i) => (
                  <li key={i} className="flex items-center text-gray-700 font-medium">
                    <item.icon size={18} className="text-primary mr-3 shrink-0" />
                    {item.text}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gray-50 p-8 rounded-xl border border-gray-100 hover:border-primary/30 transition-colors">
              <h3 className="text-2xl font-black uppercase text-secondary mb-6 tracking-tight">Upgrades & Refits</h3>
              <ul className="space-y-4">
                {[
                  { icon: Wrench, text: "Equipment Swaps & Upgrades" },
                  { icon: Wrench, text: "Interior Layout Optimization" },
                  { icon: Wrench, text: "Exterior Wrap & Branding Updates" },
                  { icon: Wrench, text: "Code Compliance Retrofits" },
                ].map((item, i) => (
                  <li key={i} className="flex items-center text-gray-700 font-medium">
                    <item.icon size={18} className="text-primary mr-3 shrink-0" />
                    {item.text}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-secondary p-8 md:p-12 rounded-xl text-center">
            <h3 className="text-2xl font-black uppercase text-white mb-4 tracking-tight">Need Emergency Service?</h3>
            <p className="text-gray-400 max-w-xl mx-auto mb-6">
              We understand that downtime means lost revenue. Contact us directly for priority scheduling on urgent repairs.
            </p>
          </div>
        </Container>
      </Section>

      <CTASection
        title="Schedule Your Service"
        subtitle="Keep your fleet running smoothly. Contact us to schedule maintenance or an upgrade consultation."
        buttonText="Contact Us"
        buttonHref="/contact"
      />
    </>
  );
}
