import React from "react";
import Link from "next/link";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";
import CTASection from "@/components/ui/CTASection";
import ProcessSteps, { ABOUT_STEP_ICONS, withStepIcons } from "@/components/ProcessSteps";
import Image from "next/image";
import { Award, Calendar, Package, PenTool, Shield, MapPin, Wrench, Handshake } from "lucide-react";
import { getPageSEO, getSEO } from "@/lib/db";
import type { Metadata } from "next";
import PageJsonLd from "@/components/PageJsonLd";
import CustomSections from "@/components/sections/CustomSections";
import { getSections, getCustomSections } from "@/lib/pageContent";
import {
  ABOUT_HEADER,
  ABOUT_MISSION,
  ABOUT_MANUFACTURE,
  ABOUT_PROCESS,
  ABOUT_WHY,
  ABOUT_CTA,
} from "@/lib/pageContent/pages/about";

// Cached and regenerated every 5 minutes, or immediately when the admin saves changes (revalidatePath).
export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSEO();
  const pageSeo = await getPageSEO("about");
  
  return {
    title: pageSeo?.title || `About Us | ${seo.siteTitle}`,
    description: pageSeo?.description || "Learn about Elite Steel Concepts, the premier custom food truck and trailer manufacturer in the DMV area.",
    keywords: pageSeo?.keywords || seo.keywords,
    alternates: { canonical: '/about' },
  };
}

// Icons for the "Why Choose Us" cards, assigned in order (cycled when there are more reasons)
const REASON_ICONS = [Calendar, Award, Package, PenTool, Shield, MapPin, Wrench, Handshake];

// External image URLs skip the optimizer so any host entered in the admin works
const isRemote = (src: string) => /^https?:\/\//i.test(src);

export default async function AboutPage() {
  const [[header, mission, manufacture, process, why, cta], customBlocks] = await Promise.all([
    getSections([ABOUT_HEADER, ABOUT_MISSION, ABOUT_MANUFACTURE, ABOUT_PROCESS, ABOUT_WHY, ABOUT_CTA] as const),
    getCustomSections("about"),
  ]);

  const chooseReasons = why.reasons.map((title, i) => ({ title, icon: REASON_ICONS[i % REASON_ICONS.length] }));

  return (
    <>
      <PageJsonLd pageId="about" />
      <PageHeader
        title={header.title}
        subtitle={header.subtitle}
        normalCaseSubtitle
        titleClassName="text-3xl md:text-5xl max-w-5xl mx-auto !leading-tight"
      />

      {/* Intro Section */}
      <Section className="!py-10 md:!py-14 bg-white">
        <Container>
          {/* Header — full width center, same as other sections */}
          <div className="text-center max-w-4xl mx-auto mb-8 md:mb-10">
            <div className="inline-flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-8 bg-primary" />
              <p className="text-primary text-xs font-black uppercase tracking-[0.25em]">
                {mission.eyebrow}
              </p>
              <div className="h-px w-8 bg-primary" />
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-black uppercase tracking-tight leading-tight">
              {mission.title}
            </h2>
          </div>

          {/* Image + body — equal height, content vertically centered */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-14 items-stretch">
            <div className="lg:col-span-5 relative group w-full max-w-sm sm:max-w-md lg:max-w-none mx-auto lg:mx-0 min-h-[280px] sm:min-h-[320px]">
              <div
                className="absolute inset-0 translate-x-3 translate-y-3 bg-primary hidden sm:block"
                aria-hidden
              />
              <div className="relative h-full min-h-[280px] sm:min-h-[320px] border-2 border-black overflow-hidden bg-black z-10">
                <Image
                  src={mission.image}
                  alt={mission.imageAlt}
                  unoptimized={isRemote(mission.image)}
                  fill
                  className="object-cover opacity-95 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                  sizes="(max-width: 1024px) 90vw, 420px"
                  priority
                />
              </div>
            </div>

            <div className="lg:col-span-7 flex items-center justify-center lg:justify-start">
              <div className="max-w-xl w-full">
                <p className="text-gray-600 text-base md:text-[17px] font-normal leading-relaxed">
                  {mission.body}
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* What We Manufacture */}
      <Section className="!py-10 md:!py-14 bg-white border-t border-gray-100">
        <Container>
          <div className="text-center max-w-4xl mx-auto mb-8 md:mb-10">
            <div className="inline-flex items-center justify-center gap-3">
              <div className="h-px w-10 bg-primary" />
              <p className="text-primary text-sm md:text-base font-black uppercase tracking-[0.25em]">
                {manufacture.eyebrow}
              </p>
              <div className="h-px w-10 bg-primary" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-6xl mx-auto">
            {manufacture.cards.map((card, i) => (
              <Link
                key={i}
                href={card.href}
                className="group border border-gray-200 hover:border-primary bg-white transition-colors overflow-hidden"
              >
                <div className="px-6 pt-6 pb-2 text-center">
                  <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-primary group-hover:text-black transition-colors">
                    {card.title}
                  </h3>
                </div>
                <div className="relative aspect-[16/10] mx-4 mb-6 md:mx-5 overflow-hidden bg-[#1a1a1a]">
                  <Image
                    src={card.image}
                    alt={card.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    unoptimized={isRemote(card.image)}
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      {/* Our Building Process */}
      <ProcessSteps
        eyebrow={process.eyebrow}
        title={
          <>
            {process.title}
            <span className="block">{process.titleLine2}</span>
          </>
        }
        steps={withStepIcons(process.steps, ABOUT_STEP_ICONS)}
        showFullProcessLink={false}
        ctaText={process.ctaText}
      />

      {/* Stats / Numbers — hidden for now
      <Section dark className="!bg-[#0a0a0a] py-24 border-y border-[#1a1a1a] relative overflow-hidden">
         <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "repeating-linear-gradient(0deg, #fff 0px, #fff 1px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, #fff 0px, #fff 1px, transparent 1px, transparent 40px)" }} />
         
         <Container className="relative z-10">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
               {[
                 { label: "Builds Completed", value: "350+", icon: Award },
                 { label: "Active Clients", value: "280+", icon: Users },
                 { label: "Years Experience", value: "14+", icon: Zap },
                 { label: "States Served", value: "48", icon: Globe }
               ].map((stat, i) => (
                 <div key={i} className="flex flex-col items-center justify-center group relative p-8">
                    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-primary opacity-0 group-hover:opacity-100 transition-opacity" />

                    <stat.icon className="text-primary mb-6 group-hover:scale-125 transition-transform duration-500" size={32} />
                    <div className="text-5xl md:text-6xl font-black text-white mb-3 tracking-tighter leading-none">{stat.value}</div>
                    <div className="text-primary text-[10px] font-black uppercase tracking-[0.2em]">{stat.label}</div>
                 </div>
               ))}
            </div>
         </Container>
      </Section>
      */}

      {/* Why Entrepreneurs Choose ECS */}
      <Section className="!py-10 md:!py-14 bg-white border-y border-gray-100">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-8 md:mb-10">
            <div className="inline-flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-8 bg-primary" />
              <p className="text-primary text-xs font-black uppercase tracking-[0.25em]">
                {why.eyebrow}
              </p>
              <div className="h-px w-8 bg-primary" />
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black uppercase text-black tracking-tight leading-tight mb-5">
              {why.title}
            </h2>
            <p className="text-gray-600 text-base md:text-lg leading-relaxed font-medium">
              {why.intro}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 max-w-6xl mx-auto">
            {chooseReasons.map((reason, i) => (
              <div
                key={i}
                className="group relative bg-white border border-gray-200 hover:border-primary hover:-translate-y-1 hover:shadow-xl transition-all duration-300 px-6 py-8 flex flex-col items-center text-center overflow-hidden"
              >
                <div className="absolute top-0 left-0 h-1 w-0 bg-primary group-hover:w-full transition-all duration-500" />

                <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 group-hover:bg-primary group-hover:border-primary flex items-center justify-center mb-5 transition-colors duration-300">
                  <reason.icon
                    size={26}
                    className="text-primary group-hover:text-white transition-colors duration-300"
                  />
                </div>

                <h3 className="text-sm md:text-base font-black text-black uppercase tracking-wide leading-snug group-hover:text-primary transition-colors">
                  {reason.title}
                </h3>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Custom sections (Admin → Page Content → page builder) */}
      <CustomSections blocks={customBlocks} />

      <CTASection
        title={cta.title}
        titleClassName="text-2xl md:text-4xl tracking-tight leading-tight"
        subtitle={cta.subtitle}
        buttonText={cta.buttonText}
        buttonHref={cta.buttonLink}
      />
    </>
  );
}
