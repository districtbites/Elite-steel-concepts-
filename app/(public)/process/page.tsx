import React from "react";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";
import CTASection from "@/components/ui/CTASection";
import ProcessTimeline, { type ProcessPhase } from "@/components/ProcessTimeline";

import { getSEO, getPageSEO } from "@/lib/db";
import type { Metadata } from "next";

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
  const steps: ProcessPhase[] = [
    {
      number: "01",
      title: "Vision & Quote",
      tagline: "Start With Your Idea. Build With a Plan.",
      icon: "FileText"
    },
    {
      number: "02",
      title: "Strategic Design",
      tagline: "A Smarter Layout for a More Efficient Kitchen.",
      icon: "PenTool"
    },
    {
      number: "03",
      title: "Project Approval & Agreement",
      tagline: "Clear Details. Clear Expectations.",
      icon: "Handshake"
    },
    {
      number: "04",
      title: "Precision Fabrication",
      tagline: "Turning Your Approved Design Into Reality.",
      icon: "Hammer"
    },
    {
      number: "05",
      title: "Final Inspection & Handover",
      tagline: "Your Mobile Kitchen, Ready for the Next Step.",
      icon: "KeyRound"
    }
  ];

  return (
    <>
      <PageHeader
        title="Our Process"
        subtitle="Building Your Custom Food Truck or Trailer, Step by Step"
        normalCaseSubtitle
      />

      {/* Progress Journey Section */}
      <Section className="py-14! md:py-20!">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-black leading-none mb-5">
              ESC Custom Food Truck & Trailer Building Process
            </h2>
            <p className="text-gray-600 text-base md:text-lg leading-relaxed">
              Create a mobile kitchen that works for you with a custom food truck manufacturer you can trust.
            </p>
          </div>

          <ProcessTimeline phases={steps} />
        </Container>
      </Section>

      <CTASection
        title="Ready to Start Your Custom Food Truck and Trailer Project?"
        subtitle="Let's Discuss Your Dream Project With a Trusted Custom Food Truck Manufacturer!"
        buttonText="Get a Free Quote"
        buttonHref="/quote"
      />
    </>
  );
}
