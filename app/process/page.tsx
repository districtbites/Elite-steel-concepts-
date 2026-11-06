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
import AutoLinkedText from "@/components/ui/AutoLinkedText";
import { getLinkedPageSections } from "@/lib/linkablePages";
import { getSections, getCustomSections } from "@/lib/pageContent";
import { PROCESS_HEADER, PROCESS_INTRO, PROCESS_TIMELINE, PROCESS_CTA } from "@/lib/pageContent/pages/process";


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
  const [linked, [header, intro, timeline, cta], customBlocks] = await Promise.all([
    getLinkedPageSections("process"),
    getSections([PROCESS_HEADER, PROCESS_INTRO, PROCESS_TIMELINE, PROCESS_CTA] as const),
    getCustomSections("process"),
  ]);

  return (
    <>
      <PageJsonLd pageId="process" />
      <PageHeader
        title={header.title}
        subtitle={linked.header ? <AutoLinkedText text={linked.header} /> : undefined}
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
              <AutoLinkedText text={linked["intro-before"]} />{" "}
              <Link
                href={intro.linkHref}
                className="text-primary font-bold underline underline-offset-4 hover:text-orange-600 transition-colors"
              >
                {intro.linkText}
              </Link>{" "}
              <AutoLinkedText text={linked["intro-after"]} />
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
