import React from "react";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";
import CTASection from "@/components/ui/CTASection";
import { Workflow, FileCode, ShieldCheck, CookingPot, MessagesSquare, ClipboardList, PencilRuler, RefreshCw, ArrowRight } from "lucide-react";
import { getSEO, getPageSEO } from "@/lib/db";
import type { Metadata } from "next";
import PageJsonLd from "@/components/PageJsonLd";
import CustomSections from "@/components/sections/CustomSections";
import { getSections, getCustomSections } from "@/lib/pageContent";
import { DESIGN_HEADER, DESIGN_SERVICES, DESIGN_PROCESS, DESIGN_CTA } from "@/lib/pageContent/pages/design-and-consultation";

// Icons are assigned by position (cycled when more items are added in the admin)
const serviceIcons = [Workflow, FileCode, ShieldCheck, CookingPot];
const stepIcons = [MessagesSquare, ClipboardList, PencilRuler, RefreshCw];

// Cached and regenerated every 5 minutes, or immediately when the admin saves changes (revalidatePath).
export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSEO();
  const pageSeo = await getPageSEO("design-and-consultation");
  
  return {
    title: pageSeo?.title || "Food Truck Design & Consultation | Elite Steel Concepts",
    description: pageSeo?.description || "Plan your food truck or trailer with expert layout design, equipment planning and health-code guidance before the build starts. Book a free consultation.",
    keywords: pageSeo?.keywords || seo.keywords,
    alternates: { canonical: '/services/design-and-consultation' },
  };
}

export default async function DesignAndConsultationPage() {
  const [[header, services, process, cta], customBlocks] = await Promise.all([
    getSections([DESIGN_HEADER, DESIGN_SERVICES, DESIGN_PROCESS, DESIGN_CTA] as const),
    getCustomSections("design_and_consultation"),
  ]);
  const designServices = services.items.map((title, i) => ({ icon: serviceIcons[i % serviceIcons.length], title }));
  const consultationSteps = process.steps.map((step, i) => ({
    icon: stepIcons[i % stepIcons.length],
    title: String(step.title ?? ""),
    text: String(step.text ?? ""),
  }));

  return (
    <>
      <PageJsonLd pageId="design-and-consultation" />
      <PageHeader
        title={header.title}
        subtitle={header.subtitle}
        normalCaseSubtitle
      />

      {/* Design & Consultation Services */}
      <Section className="bg-gray-50! py-14! md:py-20!">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-10 md:mb-12">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-black leading-none mb-5">
              {services.title}
            </h2>
            <p className="text-gray-600 text-base md:text-lg leading-relaxed">
              {services.intro}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {designServices.map(({ icon: Icon, title }, i) => (
              <div
                key={i}
                className="group relative bg-white border border-gray-200 p-7 flex flex-col items-center text-center hover:border-primary hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="absolute top-0 left-0 h-1 w-full bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
                <div className="w-16 h-16 bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                  <Icon size={28} />
                </div>
                <h3 className="text-lg font-bold text-black leading-snug">{title}</h3>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Design & Consultation Process */}
      <Section className="py-14! md:py-20!">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-10 md:mb-14">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-black leading-none">
              {process.title}
            </h2>
          </div>

          <ol className="relative grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-12 xl:gap-8">
            {/* Connector line + arrows between steps (desktop) */}
            <div className="hidden xl:block absolute top-10 left-[12.5%] right-[12.5%] border-t-2 border-dashed border-primary/50" aria-hidden="true" />
            {[25, 50, 75].map((pos) => (
              <div
                key={pos}
                className="hidden xl:flex absolute top-10 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white border border-primary/50 text-primary shadow-sm items-center justify-center"
                style={{ left: `${pos}%` }}
                aria-hidden="true"
              >
                <ArrowRight size={14} />
              </div>
            ))}

            {consultationSteps.map((step, i) => (
              <li key={i} className="group relative text-center px-2">
                <div className="relative w-20 h-20 mx-auto mb-7 rounded-full bg-white">
                  <div className="w-full h-full flex items-center justify-center rounded-full bg-primary/10 border-2 border-primary text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <step.icon size={30} />
                  </div>
                  <span className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-primary text-black text-xs font-black flex items-center justify-center ring-4 ring-white">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <p className="text-primary font-black uppercase tracking-[0.25em] text-[11px] mb-2">Step {i + 1}</p>
                <h3 className="text-xl xl:text-base font-black uppercase tracking-tight text-black leading-tight mb-3 xl:whitespace-nowrap">{step.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed max-w-[260px] mx-auto">{step.text}</p>
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
