import React from "react";
import Link from "next/link";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";
import CTASection from "@/components/ui/CTASection";
import ProcessSteps, { aboutBuildingProcessSteps } from "@/components/ProcessSteps";
import Image from "next/image";
import { Award, Calendar, Package, PenTool, Shield, MapPin, Wrench, Handshake } from "lucide-react";
import { getPageSEO, getSEO } from "@/lib/db";
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
  const pageSeo = await getPageSEO("about");

  const storyRaw =
    "Our mission is to build high-quality custom food trailers and trucks using durable, commercial-grade materials, reliable equipment, expert construction, and practical kitchen layouts. Every build is carefully designed around the client's menu, workflow, and business needs, with a strong focus on durability, functionality, professional finishing, and applicable code requirements. We use quality materials and thoughtful designs to create dependable mobile kitchen solutions that support entrepreneurs from their first launch through long-term business growth.";
  
  const chooseReasons = [
    { title: "14+ Years of Industry Experience", icon: Calendar },
    { title: "350+ Custom Builds Completed", icon: Award },
    { title: "Quality Materials & Reliable Equipment", icon: Package },
    { title: "Custom Designs Built Around Your Business", icon: PenTool },
    { title: "Compliance-Focused Construction", icon: Shield },
    { title: "Nationwide Service — 48 States Served", icon: MapPin },
    { title: "Built for Long-Term Business Use", icon: Wrench },
    { title: "Start-to-Finish Project Support", icon: Handshake },
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
        title="About Us"
        subtitle="With 14+ years of experience, Elite Steel Concepts builds custom food trucks, trailers & mobile kitchens designed for food businesses. Based in Manassas, Virginia, we proudly serve entrepreneurs nationwide."
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
              <h1 className="text-primary text-xs font-black uppercase tracking-[0.25em]">
                Our Mission
              </h1>
              <div className="h-px w-8 bg-primary" />
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-black uppercase tracking-tight leading-tight">
              Built Custom Food Trucks &amp; Trailers for Entrepreneurs With Big Ideas
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
                  src="/uploads/about/about-mission-worker.jpg"
                  alt="Elite Steel Concepts fabricator building a custom food truck"
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
                  {storyRaw}
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
              <h1 className="text-primary text-sm md:text-base font-black uppercase tracking-[0.25em]">
                What We Manufacture
              </h1>
              <div className="h-px w-10 bg-primary" />
            </div>
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
              <div className="relative aspect-[16/10] mx-4 mb-6 md:mx-5 overflow-hidden bg-[#1a1a1a]">
                <Image
                  src="/uploads/about/about-manufacture-truck.jpg"
                  alt="Custom white food truck built by Elite Steel Concepts"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
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
              <div className="relative aspect-[16/10] mx-4 mb-6 md:mx-5 overflow-hidden bg-[#1a1a1a]">
                <Image
                  src="/uploads/about/about-manufacture-trailer.jpg"
                  alt="Custom black and yellow concession trailer by Elite Steel Concepts"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
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
            <span className="block">Process</span>
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

      {/* Why Entrepreneurs Choose ECS */}
      <Section className="!py-10 md:!py-14 bg-white border-y border-gray-100">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-8 md:mb-10">
            <div className="inline-flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-8 bg-primary" />
              <h1 className="text-primary text-xs font-black uppercase tracking-[0.25em]">
                Why Choose Us
              </h1>
              <div className="h-px w-8 bg-primary" />
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black uppercase text-black tracking-tight leading-tight mb-5">
              Why Entrepreneurs Choose Elite Steel Concepts
            </h2>
            <p className="text-gray-600 text-base md:text-lg leading-relaxed font-medium">
              Entrepreneurs choose ECS as their trusted custom food truck builder for quality craftsmanship, durable builds, and mobile kitchens designed to support long-term business success.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 max-w-6xl mx-auto">
            {chooseReasons.map((reason) => (
              <div
                key={reason.title}
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

      <CTASection
        title="Ready to Build Your Custom Food Business?"
        titleClassName="text-2xl md:text-4xl tracking-tight leading-tight"
        subtitle="Your food business starts with the right build. Elite Steel Concepts is ready to help bring your idea to reality. Contact us today!"
        buttonText="Get a free quote today!"
        buttonHref="/quote"
      />
    </>
  );
}
