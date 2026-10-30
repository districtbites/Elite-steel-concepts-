import React from "react";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";
import CTASection from "@/components/ui/CTASection";
import { Check } from "lucide-react";
import { getSEO, getPageSEO } from "@/lib/db";
import { getLinkedPageSections } from "@/lib/linkablePages";
import AutoLinkedText from "@/components/ui/AutoLinkedText";
import type { Metadata } from "next";
import PageJsonLd from "@/components/PageJsonLd";
import CustomSections from "@/components/sections/CustomSections";
import { getSections, getCustomSections } from "@/lib/pageContent";
import { FLEET_HEADER, FLEET_INTRO, FLEET_CTA } from "@/lib/pageContent/pages/fleet-expansion";

// Cached and regenerated every 5 minutes, or immediately when the admin saves changes (revalidatePath).
export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSEO();
  const pageSeo = await getPageSEO("fleet-expansion");
  
  return {
    title: pageSeo?.title || "Food Truck Fleet Builds | Elite Steel Concepts",
    description: pageSeo?.description || "Scale from one truck to a fleet with standardized custom food truck and trailer builds, dedicated project management and consistent quality. Free quote.",
    keywords: pageSeo?.keywords || seo.keywords,
    alternates: { canonical: '/services/fleet-expansion' },
  };
}

export default async function FleetExpansionPage() {
  const [linked, [header, intro, cta], customBlocks] = await Promise.all([
    getLinkedPageSections("fleet-expansion"),
    getSections([FLEET_HEADER, FLEET_INTRO, FLEET_CTA] as const),
    getCustomSections("fleet_expansion"),
  ]);
  const fleetDescLinked = linked.intro;

  return (
    <>
      <PageJsonLd pageId="fleet-expansion" />
      <PageHeader
        title={header.title}
        subtitle={header.subtitle}
      />

      <Section className="bg-white">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <p className="text-primary font-bold tracking-widest uppercase text-sm mb-2 block">{intro.eyebrow}</p>
              <h2 className="text-3xl md:text-4xl font-black uppercase text-secondary mb-6 tracking-tight">
                {intro.title}
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                <AutoLinkedText text={fleetDescLinked} />
              </p>
              <ul className="space-y-4 mb-8">
                {intro.benefits.map((item, i) => (
                  <li key={i} className="flex items-center text-gray-700 font-bold">
                    <Check size={18} className="text-primary mr-3 shrink-0" /> {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gray-50 p-8 md:p-10 rounded-xl border border-gray-100">
              <h3 className="font-black text-secondary uppercase mb-6 text-xl text-center tracking-tight">{intro.audienceTitle}</h3>
              <ul className="space-y-5">
                {intro.audience.map((item, i) => (
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

      <CustomSections blocks={customBlocks} />

      <CTASection
        title={cta.title}
        subtitle={cta.subtitle}
        buttonText={cta.buttonText}
        buttonHref={cta.buttonLink}
      />
    </>
  );
}
