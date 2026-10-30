import React from "react";
import Link from "next/link";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";
import CTASection from "@/components/ui/CTASection";
import ProcessTimeline from "@/components/ProcessTimeline";

import { getSEO, getPageSEO } from "@/lib/db";
import type { Metadata } from "next";
import PageJsonLd from "@/components/PageJsonLd";
import CustomSections from "@/components/sections/CustomSections";
import { getSections, getCustomSections } from "@/lib/pageContent";
import { PROCESS_HEADER, PROCESS_INTRO, PROCESS_TIMELINE, PROCESS_CTA } from "@/lib/pageContent/pages/process";

// Cached and regenerated every 5 minutes, or immediately when the admin saves changes (revalidatePath).
export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSEO();
  const pageSeo = await getPageSEO("process");
  
  return {
    title: pageSeo?.title || `Our Process | ${seo.siteTitle}`,
    description: pageSeo?.description || seo.description,
    keywords: pageSeo?.keywords || seo.keywords,
    alternates: { canonical: '/process' },
  };
}

export default async function ProcessPage() {
  const [[header, intro, timeline, cta], customBlocks] = await Promise.all([
    getSections([PROCESS_HEADER, PROCESS_INTRO, PROCESS_TIMELINE, PROCESS_CTA] as const),
    getCustomSections("process"),
  ]);

  return (
    <>
      <PageJsonLd pageId="process" />
      <PageHeader
        title={header.title}
        subtitle={header.subtitle}
        normalCaseSubtitle
      />

      {/* Progress Journey Section */}
      <Section className="py-14! md:py-20!">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-black leading-none mb-5">
              {intro.title}
            </h2>
            <p className="text-gray-600 text-base md:text-lg leading-relaxed">
              {intro.textBefore}{" "}
              <Link
                href={intro.linkHref}
                className="text-primary font-bold underline underline-offset-4 hover:text-orange-600 transition-colors"
              >
                {intro.linkText}
              </Link>{" "}
              {intro.textAfter}
            </p>
          </div>

          <ProcessTimeline content={timeline} />
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
