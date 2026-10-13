import React from "react";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";
import CTASection from "@/components/ui/CTASection";
import { FileText, PenTool, Hammer, Lightbulb, Handshake, KeyRound, Check } from "lucide-react";

import { getSEO, getPageSEO, getInternalLinkRules, getInternalLinkSettings } from "@/lib/db";
import { autoLinkMarkdown } from "@/lib/internalLinks";
import AutoLinkedText from "@/components/ui/AutoLinkedText";
import type { Metadata } from "next";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
  const steps = [
    {
      number: "01",
      title: "Vision & Quote",
      tagline: "Start With Your Idea. Build With a Plan.",
      icon: FileText,
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
      icon: PenTool,
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
      icon: Handshake,
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
      icon: Hammer,
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
      icon: KeyRound,
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

          <div className="max-w-5xl mx-auto relative">
            {/* Timeline line */}
            <div className="absolute left-7 md:left-1/2 top-0 bottom-0 border-l-2 border-dashed border-primary/40 md:-ml-px" aria-hidden="true" />

            <ol className="space-y-12 md:space-y-16">
              {steps.map((step, index) => {
                const reversed = index % 2 !== 0;
                return (
                  <li key={step.number} className="relative pl-20 md:pl-0">
                    {/* Timeline node */}
                    <div className="absolute left-0 md:left-1/2 top-0 md:-ml-7 z-10 w-14 h-14 rounded-full bg-primary text-black flex items-center justify-center text-lg font-black ring-8 ring-white shadow-md">
                      {step.number}
                    </div>

                    <div className={`md:flex md:items-start md:gap-16 ${reversed ? "md:flex-row-reverse" : ""}`}>
                      {/* Phase heading */}
                      <div className={`md:w-1/2 mb-6 md:mb-0 md:pt-1 ${reversed ? "md:pl-12" : "md:pr-12 md:text-right"}`}>
                        <p className="text-primary font-black uppercase tracking-[0.2em] text-xs mb-3">Phase {step.number}</p>
                        <h3 className="text-2xl md:text-4xl font-black uppercase tracking-tighter text-black leading-[0.95] mb-3">
                          {step.title}
                        </h3>
                        <p className="text-base md:text-lg font-semibold text-gray-500">{step.tagline}</p>
                      </div>

                      {/* Phase details card */}
                      <div className={`md:w-1/2 ${reversed ? "md:pr-12" : "md:pl-12"}`}>
                        <div className="group relative bg-white border border-gray-200 p-6 md:p-8 hover:border-primary hover:shadow-xl transition-all duration-300">
                          <div className="absolute top-0 left-0 h-1 w-full bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
                          <div className="w-12 h-12 bg-[#0a0a0a] text-primary flex items-center justify-center mb-5 group-hover:bg-primary group-hover:text-black transition-colors">
                            <step.icon size={22} />
                          </div>

                          <p className="text-gray-600 leading-relaxed mb-6">
                            <AutoLinkedText text={autoLinkMarkdown(step.description, activeRules, linkSettings).updatedContent} />
                          </p>

                          <ul className="space-y-3 mb-6">
                            {step.items.map((item) => (
                              <li key={item} className="flex items-start gap-3 text-sm font-medium text-gray-800">
                                <span className="mt-0.5 w-5 h-5 shrink-0 rounded-full bg-primary/15 text-primary flex items-center justify-center">
                                  <Check size={12} strokeWidth={3} />
                                </span>
                                {item}
                              </li>
                            ))}
                          </ul>

                          <div className="bg-primary/5 border-l-4 border-primary p-4 flex gap-3">
                            <Lightbulb size={18} className="text-primary shrink-0 mt-0.5" />
                            <div>
                              <span className="text-[10px] font-black uppercase tracking-widest text-primary block mb-1">Elite Pro-Tip</span>
                              <p className="text-sm text-gray-600 leading-relaxed">{step.proTip}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </Container>
      </Section>

      <CTASection
        title="Ready to Start Your Custom Food Truck and Trailer Project?"
        subtitle="Let's Discuss Your Dream Project With a Trusted Custom Food Truck Manufacturer!"
        buttonText="Get a FREE Quote!"
        buttonHref="/quote"
      />
    </>
  );
}
