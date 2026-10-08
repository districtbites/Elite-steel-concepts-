import React from "react";
import Link from "next/link";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import Image from "next/image";
import { Truck, Box, PenTool, Wrench, ShieldCheck, ArrowRight, Check, X, Award, MapPin, Zap } from "lucide-react";
import FAQSection from "@/components/FAQSection";

import { getSEO, getPageSEO, getFAQs, getMediaAsset } from "@/lib/db";
import type { Metadata } from "next";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSEO();
  const pageSeo = await getPageSEO("services");
  
  return {
    title: pageSeo?.title || `Our Services | ${seo.siteTitle}`,
    description: pageSeo?.description || seo.description,
    keywords: pageSeo?.keywords || seo.keywords,
    alternates: { canonical: '/services' },
  };
}

export default async function ServicesPage() {
  const [faqs, pageSeo, servicesHero, truckImage, trailerImage] = await Promise.all([
    getFAQs(),
    getPageSEO("services"),
    getMediaAsset("services", "hero", "https://images.pexels.com/photos/1855214/pexels-photo-1855214.jpeg?auto=compress&cs=tinysrgb&w=800"),
    getMediaAsset("services", "service_card_1", "https://images.pexels.com/photos/2577274/pexels-photo-2577274.jpeg?auto=compress&cs=tinysrgb&w=800"),
    getMediaAsset("services", "service_card_2", "https://images.pexels.com/photos/4393021/pexels-photo-4393021.jpeg?auto=compress&cs=tinysrgb&w=800"),
  ]);
  const sections = pageSeo.sections || {};

  const introRaw = typeof sections.intro?.content === 'string'
    ? sections.intro.content
    : "At Elite Steel Concepts, we don't just build boxes with kitchens. We engineer high-performance commercial environments designed to maximize flow, sanitation, and safety while projecting a premium brand image.";

  const services = [
    {
      title: "Custom Food Trailers, Concession Trailers & Mobile Kitchens Services",
      icon: Truck,
      image: truckImage.url,
      description:
        "At ESC, we build custom food trailers, concession trailers, and mobile kitchens designed around your menu, equipment, workflow, and business needs, with durable construction, practical layouts, quality materials, and compliance-focused designs.",
      href: "/quote",
      ctaText: "Get Your Free Quote",
    },
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
        eyebrow="ECS Services"
        title="Expert Food Truck, Food Trailer & Mobile Kitchen Services Nationwide"
        subtitle="We build custom food trucks and trailers designed around your menu, equipment, and business goals."
        normalCaseSubtitle
        titleClassName="text-3xl md:text-5xl max-w-5xl mx-auto !leading-tight"
        className="!pb-10 md:!pb-12"
      />

      {/* What We Manufacture */}
      <Section className="!py-10 md:!py-14 bg-white border-b border-gray-100">
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

      {/* Intro Section */}
      <Section className="!py-10 md:!py-14 bg-white overflow-hidden">
        <Container>
          <div className="text-center max-w-4xl mx-auto mb-8 md:mb-10">
            <div className="inline-flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-8 bg-primary" />
              <h1 className="text-primary text-xs font-black uppercase tracking-[0.25em]">
                {sections.intro?.subtitle || "Precision Builds"}
              </h1>
              <div className="h-px w-8 bg-primary" />
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black uppercase text-black tracking-tight leading-tight">
              {sections.intro?.title || (
                <>
                  Industry Leading{" "}
                  <span className="text-primary">Mobile Kitchen</span>
                </>
              )}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
            <div className="order-2 lg:order-1 lg:col-span-6 flex items-center">
              <div className="w-full max-w-xl">
                <p className="text-gray-600 text-base md:text-[17px] font-normal leading-relaxed border-l-2 border-primary pl-5 md:pl-6 mb-7">
                  {introRaw}
                </p>
                <Link
                  href="/quote"
                  className="inline-flex items-center justify-center gap-3 bg-primary text-black px-10 py-5 font-black uppercase tracking-[0.2em] text-[10px] hover:bg-orange-600 hover:text-white transition-colors"
                >
                  Get Your Free Quote <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            <div className="order-1 lg:order-2 lg:col-span-6 relative group w-full min-h-[260px] sm:min-h-[300px]">
              <div
                className="absolute inset-0 translate-x-3 translate-y-3 bg-primary hidden sm:block"
                aria-hidden
              />
              <div className="relative h-full min-h-[260px] sm:min-h-[300px] border-2 border-black overflow-hidden bg-black z-10">
                <Image
                  src={servicesHero.url}
                  alt={servicesHero.alt || "Workshop Fabrication"}
                  fill
                  sizes="(max-width: 1024px) 90vw, 50vw"
                  className="object-cover opacity-95 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                  priority
                />
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Main Services */}
      <Section className="!py-10 md:!py-14 bg-gray-50 border-t border-gray-200">
        <Container>
          <div className="space-y-16 md:space-y-20">
            {services.map((service) => (
              <div key={service.title} className="space-y-8 md:space-y-10">
                <div className="text-center max-w-4xl mx-auto">
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-black uppercase text-black tracking-tight leading-tight">
                    {service.title}
                  </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
                  <div className="lg:col-span-6 relative group w-full min-h-[260px] sm:min-h-[300px]">
                    <div
                      className="absolute inset-0 translate-x-3 translate-y-3 bg-primary hidden sm:block"
                      aria-hidden
                    />
                    <div className="relative h-full min-h-[260px] sm:min-h-[300px] border-2 border-black overflow-hidden bg-black z-10">
                      <Image
                        src={service.image}
                        alt={service.title}
                        fill
                        sizes="(max-width: 1024px) 90vw, 50vw"
                        className="object-cover opacity-95 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                      />
                    </div>
                  </div>

                  <div className="lg:col-span-6 flex items-center">
                    <div className="w-full max-w-xl">
                      <p className="text-gray-600 text-base md:text-[17px] font-normal leading-relaxed mb-7">
                        {service.description}
                      </p>
                      <Link
                        href={service.href}
                        className="inline-flex items-center justify-center gap-3 bg-primary text-black px-10 py-5 font-black uppercase tracking-[0.2em] text-[10px] hover:bg-orange-600 hover:text-white transition-colors"
                      >
                        {service.ctaText} <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Why Choose Us / Capabilities — hidden for now
      <Section className="bg-[#0a0a0a] py-32 border-y border-[#1a1a1a] relative overflow-hidden">
         <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "repeating-linear-gradient(0deg, #fff 0px, #fff 1px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, #fff 0px, #fff 1px, transparent 1px, transparent 40px)" }} />
         
         <Container className="relative z-10">
            <div className="max-w-4xl mb-20">
               <div className="flex items-center gap-3 mb-4">
                 <div className="w-1.5 h-1.5 bg-primary" />
                 <span className="text-primary font-black tracking-[0.2em] uppercase text-[10px]">Core Capabilities</span>
               </div>
               <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white mb-8 leading-[0.9]">
                  We build with <br className="hidden md:block"/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-600">No Compromises</span>
               </h2>
               <p className="text-gray-400 text-xl md:text-2xl leading-relaxed font-medium">
                  Our facility is equipped with state-of-the-art tools and staffed by master welders and electricians who specialize in mobile environments.
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {[
                 { icon: Award, title: "Master Welding", desc: "TIG and MIG stainless steel fabrication for hygienic and forever-durable interiors." },
                 { icon: Zap, title: "Electrical Systems", desc: "High-capacity power grids designed to handle multiple fryers, ranges, and refrigeration units simultaneously." },
                 { icon: ShieldCheck, title: "NSF Standards", desc: "Full adherence to National Sanitation Foundation standards for easy cleaning and inspection pass rates." }
               ].map((cap, i) => (
                 <div key={i} className="space-y-6 bg-transparent p-8 border border-[#1a1a1a] hover:border-primary transition-colors group">
                    <div className="text-primary">
                       <cap.icon size={48} className="group-hover:scale-110 transition-transform" />
                    </div>
                    <div>
                      <h4 className="text-2xl font-black uppercase tracking-tighter text-white mb-4">{cap.title}</h4>
                      <p className="text-sm text-gray-400 leading-relaxed font-bold uppercase tracking-wider">{cap.desc}</p>
                    </div>
                 </div>
               ))}
            </div>
         </Container>
      </Section>

      <Section className="bg-white border-b border-gray-200 py-32">
         <Container>
            <div className="text-center mb-20">
               <div className="flex items-center justify-center gap-3 mb-4">
                 <div className="w-1.5 h-1.5 bg-black" />
                 <span className="text-black font-black tracking-[0.2em] uppercase text-[10px]">Added Value</span>
               </div>
               <h2 className="text-5xl md:text-7xl font-black uppercase text-black tracking-tighter leading-none">Support <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-600">Services</span></h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               {[
                 { title: "Design", icon: PenTool, desc: "2D and 3D floor plans." },
                 { title: "Repairs", icon: Wrench, desc: "Fast fleet maintenance." },
                 { title: "Compliance", icon: ShieldCheck, desc: "Health code assistance." },
                 { title: "Sourcing", icon: MapPin, desc: "Vehicle & trailer locating." }
               ].map((item, i) => (
                  <div key={i} className="bg-white p-10 border border-black hover:bg-[#0a0a0a] hover:text-white transition-colors duration-300 text-center group">
                     <div className="w-20 h-20 bg-gray-50 flex items-center justify-center mx-auto mb-8 text-black border border-gray-200 group-hover:border-primary group-hover:bg-primary group-hover:text-black transition-colors duration-300">
                        <item.icon size={32} />
                     </div>
                     <h3 className="text-2xl font-black uppercase text-black group-hover:text-white mb-4 tracking-tighter leading-none">{item.title}</h3>
                     <p className="text-gray-500 group-hover:text-primary text-[10px] font-black uppercase tracking-[0.2em] transition-colors">{item.desc}</p>
                  </div>
               ))}
            </div>
         </Container>
      </Section>
      */}

      {/* Process at a Glance */}
      <Section className="!py-10 md:!py-14 bg-white overflow-hidden border-y border-gray-100">
        <Container>
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 md:mb-10 gap-5 md:gap-8">
            <div className="max-w-3xl">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase text-black tracking-tight mb-3 md:mb-4 leading-tight">
                ECS Building Process
              </h2>
              <p className="text-gray-500 text-sm sm:text-base md:text-lg font-medium leading-relaxed border-l-2 border-primary pl-4 md:pl-6">
                At ESC, we work with you from the first idea to the final handover, keeping every step clear and focused on your food business needs.
              </p>
            </div>
            <a
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-primary text-black px-7 py-3.5 md:px-10 md:py-5 font-black uppercase tracking-[0.2em] text-[10px] hover:bg-orange-600 hover:text-white transition-colors shrink-0"
            >
              Talk to Our Team <ArrowRight size={14} />
            </a>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
            {[
              { step: "01", title: "Consult" },
              { step: "02", title: "Design" },
              { step: "03", title: "Build" },
              { step: "04", title: "Keys" },
            ].map((item) => (
              <div
                key={item.step}
                className="group relative bg-gray-50/80 border border-gray-200 hover:border-primary/50 hover:bg-white hover:shadow-sm transition-all duration-300 p-4 sm:p-5 md:p-7 flex flex-col items-center text-center"
              >
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mb-3 sm:mb-4 bg-white border border-gray-200 group-hover:border-primary group-hover:bg-primary flex items-center justify-center transition-colors duration-300">
                  <span className="text-lg sm:text-xl md:text-2xl font-black text-black group-hover:text-white tracking-tight transition-colors">
                    {item.step}
                  </span>
                </div>

                <h4 className="text-xs sm:text-sm md:text-base font-black uppercase text-black tracking-wide group-hover:text-primary transition-colors">
                  {item.title}
                </h4>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* FAQ integration */}
      <FAQSection faqs={faqs} />

      {/* Final CTA */}
      <section className="py-12 md:py-16 bg-[#0a0a0a] overflow-hidden relative border-t border-[#1a1a1a]">
         <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "repeating-linear-gradient(45deg, #fff 0px, #fff 1px, transparent 1px, transparent 10px)" }} />
         
         <Container className="relative z-10 text-center">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tighter mb-8 max-w-5xl mx-auto leading-[0.9]">
               Ready to Build Your Custom Food Truck?
            </h2>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6">
               <a 
                  href="/quote" 
                  className="bg-primary text-black border border-primary px-10 py-5 font-black uppercase tracking-[0.2em] text-[10px] hover:bg-orange-600 hover:text-white hover:border-orange-600 transition-colors min-w-[240px] flex items-center justify-center gap-3"
               >
                  Get a Free Quote <ArrowRight size={14} />
               </a>
               <a 
                  href="/portfolio" 
                  className="bg-transparent text-white border border-white/20 px-10 py-5 font-black uppercase tracking-[0.2em] text-[10px] hover:bg-white hover:text-black transition-colors min-w-[240px]"
               >
                  View Our Work
               </a>
            </div>
         </Container>
      </section>
    </>
  );
}

const Globe = ({ size, className }: { size?: number, className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);
