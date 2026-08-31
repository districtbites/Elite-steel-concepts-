import React from "react";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";
import CTASection from "@/components/ui/CTASection";
import { Check } from "lucide-react";
import { getSEO, getPageSEO, getInternalLinkRules, getInternalLinkSettings } from "@/lib/db";
import { autoLinkMarkdown } from "@/lib/internalLinks";
import AutoLinkedText from "@/components/ui/AutoLinkedText";
import type { Metadata } from "next";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSEO();
  const pageSeo = await getPageSEO("fleet-expansion");
  
  return {
    title: pageSeo?.title || `Fleet Expansion | ${seo.siteTitle}`,
    description: pageSeo?.description || seo.description,
    keywords: pageSeo?.keywords || seo.keywords,
    alternates: { canonical: '/services/fleet-expansion' },
  };
}

export default async function FleetExpansionPage() {
  const [rules, linkSettings] = await Promise.all([
    getInternalLinkRules(),
    getInternalLinkSettings(),
  ]);
  const activeRules = rules.filter(r => r.enabled !== false);

  const fleetDescRaw = "Whether you need 5 custom food trucks or 50 concession trailers, Elite Steel Concepts delivers identical build quality, equipment layouts, and nationwide compliance. Streamline your multi-unit mobile kitchen operations with a standardized fleet program.";
  const fleetDescLinked = autoLinkMarkdown(fleetDescRaw, activeRules, linkSettings).updatedContent;

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
                <AutoLinkedText text={fleetDescLinked} />
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
