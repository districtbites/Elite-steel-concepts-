import React from "react";
import Link from "next/link";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";
import CTASection from "@/components/ui/CTASection";
import ReadMore from "@/components/ui/ReadMore";
import ProcessSteps, { aboutBuildingProcessSteps } from "@/components/ProcessSteps";
import Image from "next/image";
import { Shield, Target, Zap } from "lucide-react";
import { getPageSEO, getSEO, getMediaAsset, getInternalLinkRules, getInternalLinkSettings } from "@/lib/db";
import { autoLinkMarkdown } from "@/lib/internalLinks";
import type { Metadata } from "next";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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

export default async function AboutPage() {
  const [pageSeo, aboutHero, truckImage, trailerImage, rules, linkSettings] = await Promise.all([
    getPageSEO("about"),
    getMediaAsset("about", "hero", "https://images.pexels.com/photos/2955819/pexels-photo-2955819.jpeg?auto=compress&cs=tinysrgb&w=800"),
    getMediaAsset("home", "truck_card", "/food-truck-transparent.png"),
    getMediaAsset("home", "trailer_card", "/concession-trailer.png"),
    getInternalLinkRules(),
    getInternalLinkSettings(),
  ]);
  const activeRules = rules.filter(r => r.enabled !== false);
  const alts = pageSeo.imageAlts || {};
  const sections = pageSeo.sections || {};

  const storyRaw =
    "Our mission is to build high-quality custom food trailers and trucks using durable, commercial-grade materials, reliable equipment, expert construction, and practical kitchen layouts. Every build is carefully designed around the client's menu, workflow, and business needs, with a strong focus on durability, functionality, professional finishing, and applicable code requirements. We use quality materials and thoughtful designs to create dependable mobile kitchen solutions that support entrepreneurs from their first launch through long-term business growth.";
  const storyLinked = autoLinkMarkdown(storyRaw, activeRules, linkSettings).updatedContent;
  
  const values = [
    {
      title: "Precision Engineering",
      description: "We don't just build; we engineer. Every weld and every wire is placed with surgical precision to withstand the harsh environment of mobile kitchens.",
      icon: Zap
    },
    {
      title: "Client-Centric Design",
      description: "Your workflow is our priority. We design layouts that make your staff 30% faster on the line, minimizing steps and maximizing output.",
      icon: Target
    },
    {
      title: "100% Code Compliance",
      description: "We guarantee that every build meets local health and fire safety regulations or we make it right. No exceptions.",
      icon: Shield
    }
  ];

  return (
    <>
      {pageSeo.structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: pageSeo.structuredData }}
        />
      )}
      <PageHeader
        title={sections.header?.title || "Operational History"}
        subtitle="With 14+ years of experience, Elite Steel Concepts builds custom food trucks, trailers & mobile kitchens designed for food businesses. Based in Manassas, Virginia, we proudly serve entrepreneurs nationwide."
      />

      {/* Intro Section */}
      <Section className="!py-10 md:!py-14 bg-white">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-14 items-start">
            {/* Image */}
            <div className="lg:col-span-5 relative group w-full max-w-sm sm:max-w-md lg:max-w-none mx-auto lg:mx-0">
              <div
                className="absolute inset-0 translate-x-3 -translate-y-3 bg-primary hidden sm:block"
                aria-hidden
              />
              <div className="relative aspect-[4/5] border-2 border-black overflow-hidden bg-black z-10">
                <Image
                  src={aboutHero.url}
                  alt={aboutHero.alt || alts["about-hero"] || "Elite Steel Concepts Workshop"}
                  fill
                  className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 grayscale group-hover:grayscale-0"
                  sizes="(max-width: 1024px) 90vw, 420px"
                  priority
                />
              </div>
            </div>

            {/* Copy — top-aligned with image */}
            <div className="lg:col-span-7 flex flex-col lg:pt-1">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="h-px w-8 bg-primary shrink-0" />
                <span className="text-primary text-xs font-black uppercase tracking-[0.25em]">
                  Our Mission
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-[2.5rem] font-black uppercase text-black tracking-tight leading-[1.15] mb-5">
                Built Custom Food Trucks &amp; Trailers for Entrepreneurs With Big Ideas
              </h2>

              <div className="max-w-xl">
                <ReadMore
                  text={storyLinked}
                  maxLength={280}
                  className="text-gray-600 text-base md:text-[17px] font-normal leading-relaxed"
                  buttonClassName="mt-5 text-[10px] font-black uppercase tracking-[0.2em] text-black border border-black px-4 py-2.5 hover:bg-primary hover:border-primary transition-colors inline-flex items-center gap-2"
                />
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* What We Manufacture */}
      <Section className="!py-10 md:!py-14 bg-white border-t border-gray-100">
        <Container>
          <div className="text-center max-w-4xl mx-auto mb-8 md:mb-10">
            <div className="inline-flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-10 bg-primary" />
              <span className="text-primary text-sm font-black uppercase tracking-[0.25em]">
                Platforms
              </span>
              <div className="h-px w-10 bg-primary" />
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-black uppercase tracking-tight leading-tight">
              What We Manufacture
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-6xl mx-auto">
            <Link
              href="/services/custom-food-trucks"
              className="group border border-gray-200 hover:border-primary bg-white transition-colors overflow-hidden"
            >
              <div className="px-6 pt-6 pb-2 text-center">
                <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-primary group-hover:text-black transition-colors">
                  Truck
                </h3>
              </div>
              <div className="relative aspect-[16/11] mx-5 mb-6 bg-gray-50">
                <Image
                  src={truckImage.url}
                  alt={truckImage.alt || alts["truck-platform"] || "Custom Food Truck"}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-contain p-5 transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </Link>

            <Link
              href="/services/custom-food-trailers"
              className="group border border-gray-200 hover:border-primary bg-white transition-colors overflow-hidden"
            >
              <div className="px-6 pt-6 pb-2 text-center">
                <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-primary group-hover:text-black transition-colors">
                  Trailer
                </h3>
              </div>
              <div className="relative aspect-[16/11] mx-5 mb-6 bg-gray-50">
                <Image
                  src={trailerImage.url}
                  alt={trailerImage.alt || alts["trailer-platform"] || "Custom Food Trailer"}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-contain p-5 transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </Link>
          </div>
        </Container>
      </Section>

      {/* Our Building Process */}
      <ProcessSteps
        eyebrow="How We Build"
        title={
          <>
            Our Building
            <span className="block text-primary">Process</span>
          </>
        }
        steps={aboutBuildingProcessSteps}
        showFullProcessLink={false}
        ctaText="Ready to share your idea? Start with a free quote."
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

      {/* Values / DNA */}
      <Section className="!py-10 md:!py-14 bg-gray-50/70 border-y border-gray-100">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-8 md:mb-10">
            <div className="inline-flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-8 bg-primary" />
              <span className="text-primary text-xs font-black uppercase tracking-[0.25em]">
                Operational Standard
              </span>
              <div className="h-px w-8 bg-primary" />
            </div>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black uppercase text-black tracking-tight leading-tight">
              The Elite <span className="text-primary">DNA</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {values.map((v, i) => (
              <div
                key={v.title}
                className="group bg-white border border-gray-100 hover:border-primary/40 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden"
              >
                <div className="relative bg-[#0a0a0a] p-8 overflow-hidden">
                  <div className="absolute -right-2 -top-2 text-[7rem] font-black text-white/[0.04] leading-none select-none pointer-events-none">
                    0{i + 1}
                  </div>
                  <div className="absolute top-0 left-0 right-0 h-1 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                  <div className="relative z-10 size-14 bg-primary/10 border border-primary/30 flex items-center justify-center mb-5 group-hover:bg-primary transition-colors">
                    <v.icon
                      size={26}
                      className="text-primary group-hover:text-black transition-colors"
                    />
                  </div>
                  <span className="relative z-10 text-[10px] font-black uppercase tracking-[0.25em] text-primary">
                    Pillar 0{i + 1}
                  </span>
                </div>

                <div className="p-8 flex flex-col flex-1">
                  <h3 className="text-xl md:text-2xl font-black uppercase text-black tracking-tight mb-4 leading-snug">
                    {v.title}
                  </h3>
                  <p className="text-gray-600 text-sm md:text-base leading-relaxed font-medium">
                    {v.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <CTASection
        title="Ready to Build Your Custom Food Business?"
        subtitle="Your food business starts with the right build. Elite Steel Concepts is ready to help bring your idea to reality. Contact us today!"
        buttonText="Get a free quote today!"
        buttonHref="/quote"
        secondaryButtonText="Read Intelligence Briefs"
        secondaryButtonHref="/blog"
      />
    </>
  );
}
