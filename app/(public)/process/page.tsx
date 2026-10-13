import React from "react";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";
import CTASection from "@/components/ui/CTASection";
import ProcessTimeline, { type ProcessPhase } from "@/components/ProcessTimeline";

import { getSEO, getPageSEO, getInternalLinkRules, getInternalLinkSettings } from "@/lib/db";
import { autoLinkMarkdown } from "@/lib/internalLinks";
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
  const [rules, linkSettings] = await Promise.all([
    getInternalLinkRules(),
    getInternalLinkSettings(),
  ]);
  const activeRules = rules.filter(r => r.enabled !== false);
  const steps: ProcessPhase[] = [
    {
      number: "01",
      title: "Vision & Quote",
      tagline: "Start With Your Idea. Build With a Plan.",
      icon: "FileText",
      description: "Everything starts with your concept. Our detailed intake system captures the essence of your business model—from menu complexity to daily output expectations. We don't just provide a price; we provide a project roadmap.",
      items: [
        "Chassis sourcing (New vs Guided Pre-owned)",
        "Primary appliance payload definition",
        "Initial feasibility & budget alignment",
        "Target launch date scheduling"
      ],
      proTip: "The more specific you are about your menu, the better we can optimize your equipment footprint for speed."
    },
    {
      number: "02",
      title: "Strategic Design",
      tagline: "A Smarter Layout for a More Efficient Kitchen.",
      icon: "PenTool",
      description: "Our design team creates professional 2D schematics that serve as the blueprint for your success. We analyze 'The Triangle'—the relationship between prep, cooking, and service—to minimize fatigue and maximize ticket speed.",
      items: [
        "CAD Floor plan development",
        "Electrical load & breaker distribution planning",
        "Gas line routing & fire suppression schematics",
        "NFPA 96 Hood system specifications"
      ],
      proTip: "We design for 'First Day' success and 'Third Year' durability."
    },
    {
      number: "03",
      title: "Project Approval & Agreement",
      tagline: "Clear Details. Clear Expectations.",
      icon: "Handshake",
      description: "Transparency is our foundation. Once the design and equipment specs are finalized, we sign a comprehensive sales agreement. Your deposit secures a dedicated fabrication slot in our Manassas facility.",
      items: [
        "Itemized equipment list confirmation",
        "Timeline commitment & milestones",
        "Legal & warranty documentation",
        "Chassis inspection & intake"
      ],
      proTip: "Our agreements have no hidden 'surprises'—the price we sign is the price you pay."
    },
    {
      number: "04",
      title: "Precision Fabrication",
      tagline: "Turning Your Approved Design Into Reality.",
      icon: "Hammer",
      description: "This is where the 'Elite Steel' name comes from. Our craftspeople install seamless NSF-grade stainless steel walls, custom cabinetry, and commercial-grade systems using master welding techniques.",
      items: [
        "Structural reinforcement & wall framing",
        "Electrical grid & plumbing installation",
        "Custom hood & extraction fabrication",
        "Equipment mounting & calibration"
      ],
      proTip: "TIG welding on interior joints ensures there are no cracks for grease or debris to hide."
    },
    {
      number: "05",
      title: "Final Inspection & Handover",
      tagline: "Your Mobile Kitchen, Ready for the Next Step.",
      icon: "KeyRound",
      description: "Your truck undergoes a 50-point inspection. We don't just hand you the keys; we walk you through every system, from starting the generator to properly cleaning the hood filters.",
      items: [
        "System stress testing (Gas/Electric)",
        "Equipment operation training",
        "Code compliance final check",
        "Final handover photoshoot"
      ],
      proTip: "We recommend a 'Soft Launch' to get used to the equipment before your first major event."
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

          <ProcessTimeline
            phases={steps.map((step) => ({
              ...step,
              description: autoLinkMarkdown(step.description, activeRules, linkSettings).updatedContent,
            }))}
          />
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
