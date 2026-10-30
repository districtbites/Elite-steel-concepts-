import React from "react";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";
import CTASection from "@/components/ui/CTASection";
import { Wrench, Zap, Droplets, Wind, Flame, CookingPot, Hammer, Paintbrush, Check, ClipboardCheck, ScanSearch, Lightbulb, ArrowRight } from "lucide-react";
import { getSEO, getPageSEO } from "@/lib/db";
import type { Metadata } from "next";
import PageJsonLd from "@/components/PageJsonLd";
import CustomSections from "@/components/sections/CustomSections";
import { getSections, getCustomSections } from "@/lib/pageContent";
import { REPAIRS_HEADER, REPAIRS_SERVICES, REPAIRS_PROCESS, REPAIRS_CTA } from "@/lib/pageContent/pages/repairs-and-upgrades";

// Icons are assigned by position (cycled when more items are added in the admin)
const serviceIcons = [Zap, Droplets, Flame, Wind, CookingPot, Hammer, Paintbrush, Wrench];
const stepIcons = [ClipboardCheck, ScanSearch, Lightbulb, Wrench];

// Cached and regenerated every 5 minutes, or immediately when the admin saves changes (revalidatePath).
export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSEO();
  const pageSeo = await getPageSEO("repairs-and-upgrades");
  
  return {
    title: pageSeo?.title || "Food Truck Repairs & Upgrades | Elite Steel Concepts",
    description: pageSeo?.description || "Food truck and trailer repairs, equipment upgrades, electrical, plumbing and fire-safety work from our Manassas, VA shop. Code-compliant. Free quote.",
    keywords: pageSeo?.keywords || seo.keywords,
    alternates: { canonical: '/services/repairs-and-upgrades' },
  };
}

export default async function RepairsAndUpgradesPage() {
  const [[header, services, process, cta], customBlocks] = await Promise.all([
    getSections([REPAIRS_HEADER, REPAIRS_SERVICES, REPAIRS_PROCESS, REPAIRS_CTA] as const),
    getCustomSections("repairs_and_upgrades"),
  ]);
  const repairServices = services.services.map((service, i) => ({
    icon: serviceIcons[i % serviceIcons.length],
    title: String(service.title ?? ""),
    intro: String(service.intro ?? ""),
    points: String(service.points ?? "").split("\n").map((p) => p.trim()).filter(Boolean),
  }));
  const processSteps = process.steps.map((step, i) => ({
    icon: stepIcons[i % stepIcons.length],
    title: String(step.title ?? ""),
    text: String(step.text ?? ""),
  }));

  return (
    <>
      <PageJsonLd pageId="repairs-and-upgrades" />
      <PageHeader
        title={header.title}
        subtitle={header.subtitle}
        normalCaseSubtitle
      />

      {/* What ESC Fixes */}
      <Section className="bg-gray-50! py-14! md:py-20!">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-10 md:mb-12">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-2 h-2 bg-primary" />
              <p className="text-primary font-black uppercase tracking-[0.2em] text-xs">{services.eyebrow}</p>
              <div className="w-2 h-2 bg-primary" />
            </div>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-black leading-none">
              {services.title}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {repairServices.map((service, i) => (
              <div
                key={i}
                className="group relative bg-white border border-gray-200 p-7 flex flex-col hover:border-primary hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="absolute top-0 left-0 h-1 w-full bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
                <div className="w-14 h-14 bg-[#0a0a0a] text-primary flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-black transition-colors">
                  <service.icon size={26} />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight text-black leading-tight mb-3">
                  {service.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-5">{service.intro}</p>
                <ul className="space-y-3">
                  {service.points.map((point, j) => (
                    <li key={j} className="flex items-start gap-3 text-sm font-medium text-gray-800">
                      <span className="mt-0.5 w-5 h-5 shrink-0 rounded-full bg-primary/15 text-primary flex items-center justify-center">
                        <Check size={12} strokeWidth={3} />
                      </span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Repair Process */}
      <Section className="relative overflow-hidden py-14! md:py-20!">
        <Container className="relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-10 md:mb-12">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-black leading-none mb-6">
              {process.title}
            </h2>
            <p className="text-gray-600 text-base md:text-lg leading-relaxed">
              {process.intro}
            </p>
          </div>

          <ol className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
            {/* Connector line + arrows between steps (desktop) */}
            <div className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] border-t-2 border-dashed border-primary/50" aria-hidden="true" />
            {[25, 50, 75].map((pos) => (
              <div
                key={pos}
                className="hidden lg:flex absolute top-10 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white border border-primary/50 text-primary shadow-sm items-center justify-center"
                style={{ left: `${pos}%` }}
                aria-hidden="true"
              >
                <ArrowRight size={14} />
              </div>
            ))}

            {processSteps.map((step, i) => (
              <li key={i} className="group relative text-center px-2">
                <div className="relative w-20 h-20 mx-auto mb-7 rounded-full bg-white">
                  <div className="w-full h-full flex items-center justify-center rounded-full bg-primary/10 border-2 border-primary text-primary group-hover:bg-primary group-hover:text-black transition-colors">
                    <step.icon size={30} />
                  </div>
                  <span className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-primary text-black text-xs font-black flex items-center justify-center ring-4 ring-white">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tight text-black mb-3">{step.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed max-w-[240px] mx-auto">{step.text}</p>
              </li>
            ))}
          </ol>
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
