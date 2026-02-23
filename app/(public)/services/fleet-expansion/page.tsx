import React from "react";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";
import CTASection from "@/components/ui/CTASection";
import { Check } from "lucide-react";
import { getSEO, getPageSEO } from "@/lib/db";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSEO();
  const pageSeo = await getPageSEO("fleet-expansion");
  
  return {
    title: pageSeo?.title || `Fleet Expansion | ${seo.siteTitle}`,
    description: pageSeo?.description || seo.description,
    keywords: pageSeo?.keywords || seo.keywords,
  };
}

export default function FleetExpansionPage() {
  return (
    <>
      <PageHeader
        title="Fleet Expansion"
        subtitle="Scaling your mobile food empire? We offer standardized build processes for multi-unit operators and franchises."
      />

      <Section className="bg-white">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <span className="text-primary font-bold tracking-widest uppercase text-sm mb-2 block">Scale With Confidence</span>
              <h2 className="text-3xl md:text-4xl font-black uppercase text-secondary mb-6 tracking-tight">
                Consistent Quality at Scale
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                Whether you need 5 trucks or 50, we deliver identical build quality, equipment layouts, and branding. Streamline your operations with a standardized fleet.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  "Volume Pricing Available",
                  "Dedicated Project Management",
                  "Rapid Deployment Schedules",
                  "Consistent Build Standards",
                  "Fleet Maintenance Packages",
                ].map((item, i) => (
                  <li key={i} className="flex items-center text-gray-700 font-bold">
                    <Check size={18} className="text-primary mr-3 shrink-0" /> {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gray-50 p-8 md:p-10 rounded-xl border border-gray-100">
              <h3 className="font-black text-secondary uppercase mb-6 text-xl text-center tracking-tight">Perfect For</h3>
              <ul className="space-y-5">
                {[
                  "Restaurant Chains going Mobile",
                  "Corporate Promotional Vehicles",
                  "Franchise Operations",
                  "University & Campus Dining",
                  "Catering Companies Scaling Up",
                ].map((item, i) => (
                  <li key={i} className="flex items-center text-gray-600 font-medium">
                    <span className="w-2.5 h-2.5 bg-primary rounded-full mr-4 shrink-0"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </Section>

      <CTASection
        title="Discuss Fleet Options"
        subtitle="Let's discuss your multi-unit needs. We offer dedicated project management for fleet builds."
        buttonText="Contact Us"
        buttonHref="/contact"
      />
    </>
  );
}
