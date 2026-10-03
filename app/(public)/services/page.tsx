import React from "react";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import ReadMore from "@/components/ui/ReadMore";
import Image from "next/image";
import { Truck, Box, PenTool, Wrench, ShieldCheck, ArrowRight, Check, X, Award, MapPin, Zap } from "lucide-react";
import FAQSection from "@/components/FAQSection";

import { getSEO, getPageSEO, getFAQs, getMediaAsset, getInternalLinkRules, getInternalLinkSettings } from "@/lib/db";
import { autoLinkMarkdown } from "@/lib/internalLinks";
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
  const [faqs, pageSeo, rules, linkSettings, servicesHero, truckImage, trailerImage] = await Promise.all([
    getFAQs(),
    getPageSEO("services"),
    getInternalLinkRules(),
    getInternalLinkSettings(),
    getMediaAsset("services", "hero", "https://images.pexels.com/photos/1855214/pexels-photo-1855214.jpeg?auto=compress&cs=tinysrgb&w=800"),
    getMediaAsset("services", "service_card_1", "https://images.pexels.com/photos/2577274/pexels-photo-2577274.jpeg?auto=compress&cs=tinysrgb&w=800"),
    getMediaAsset("services", "service_card_2", "https://images.pexels.com/photos/4393021/pexels-photo-4393021.jpeg?auto=compress&cs=tinysrgb&w=800"),
  ]);
  const activeRules = rules.filter(r => r.enabled !== false);
  const sections = pageSeo.sections || {};

  const introRaw = typeof sections.intro?.content === 'string'
    ? sections.intro.content
    : "At Elite Steel Concepts, we don't just build boxes with kitchens. We engineer high-performance commercial environments designed to maximize flow, sanitation, and safety while projecting a premium brand image.";
  const introLinked = autoLinkMarkdown(introRaw, activeRules, linkSettings).updatedContent;

  const services = [
    {
      title: "Custom Food Trucks",
      icon: Truck,
      image: truckImage.url,
      description: "The ultimate mobile billboard. Our custom food trucks are engineered for performance and designed to turn heads. Built on reliable step-van chassis, they offer maximum mobility.",
      features: ["Step Van Conversions", "New & Used Chassis", "Generator Installation", "Full Graphic Wraps"],
      href: "/services/custom-food-trucks",
    },
    {
      title: "Concession Trailers",
      icon: Box,
      image: trailerImage.url,
      description: "Maximize your kitchen space and lower your overhead. Trailers are perfect for semi-permanent locations and high-volume events where you need more room to operate.",
      features: ["Custom Sizes (10' - 30')", "Porch & Smoker Builds", "Lower Maintenance", "Detachable Towing"],
      href: "/services/custom-food-trailers",
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
        eyebrow="ECS Services"
        title="Expert Food Truck, Food Trailer & Mobile Kitchen Services Nationwide"
        subtitle="We build custom food trucks and trailers designed around your menu, equipment, and business goals."
      />

      {/* Intro / Stats Section */}
      <Section className="bg-white overflow-hidden py-24 md:py-32">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
             <div className="order-2 lg:order-1">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1.5 h-1.5 bg-primary" />
                  <span className="text-black font-black tracking-[0.2em] uppercase text-[10px]">
                      {sections.intro?.subtitle || "Precision Builds"}
                  </span>
                </div>
                <h2 className="text-5xl md:text-6xl lg:text-7xl font-black uppercase text-black tracking-tighter mb-8 leading-[0.9]">
                  {sections.intro?.title || (
                    <>Industry Leading <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-600">Mobile Kitchen</span></>
                  )}
                </h2>
                
                <div className="text-gray-600 text-lg md:text-xl font-medium leading-relaxed max-w-xl border-l-[3px] border-black pl-6 mb-12">
                  <ReadMore 
                    text={introLinked}
                    maxLength={250}
                    className="text-gray-600 text-lg md:text-xl font-medium leading-relaxed"
                    buttonClassName="mt-6 text-[10px] font-black uppercase tracking-[0.2em] text-black border border-black px-4 py-2 hover:bg-primary hover:border-primary transition-colors flex items-center gap-2"
                  />
                </div>

                <div className="grid grid-cols-2 gap-8 p-8 bg-[#0a0a0a] border border-[#1a1a1a]">
                   <div className="space-y-3">
                      <div className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-none">100%</div>
                      <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Code Compliant</p>
                   </div>
                   <div className="space-y-3">
                      <div className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-none">14+ YRS</div>
                      <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Engineering Exp.</p>
                   </div>
                </div>
             </div>
             
             <div className="order-1 lg:order-2 lg:sticky lg:top-32 relative group">
                <div className="absolute -left-4 -top-4 w-full h-full bg-primary translate-x-2 translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-500" />
                <div className="relative aspect-square border-2 border-black overflow-hidden bg-black z-10">
                   <Image 
                      src={servicesHero.url} 
                      alt={servicesHero.alt || "Workshop Fabrication"}
                      fill
                      className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 grayscale group-hover:grayscale-0"
                   />
                </div>
             </div>
          </div>
        </Container>
      </Section>

      {/* Main Services - Alternating */}
      <Section className="bg-gray-50 border-t border-gray-200 py-32">
        <Container>
           <div className="space-y-32">
             {services.map((service, index) => (
                <div key={index} className={`flex flex-col lg:flex-row items-center gap-16 lg:gap-24 ${index % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
                   <div className="w-full lg:w-1/2 relative group">
                      <div className="absolute -left-4 -top-4 w-full h-full bg-primary translate-x-2 translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-500" />
                      <div className="relative aspect-[4/3] border-2 border-black overflow-hidden bg-black z-10">
                         <Image 
                            src={service.image} 
                            alt={service.title}
                            fill
                            className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000 grayscale group-hover:grayscale-0"
                         />
                      </div>
                   </div>
                   <div className="w-full lg:w-1/2">
                      <div className="flex items-center gap-6 mb-8">
                         <div className="bg-[#0a0a0a] p-5 text-primary border border-[#1a1a1a] shrink-0">
                           <service.icon size={32} />
                         </div>
                         <h2 className="text-4xl lg:text-6xl font-black uppercase text-black tracking-tighter leading-none">{service.title}</h2>
                      </div>
                      <p className="text-gray-500 text-xl font-medium leading-relaxed mb-10">
                         {service.description}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
                         {service.features.map((feature, i) => (
                            <div key={i} className="flex items-center gap-3 bg-white px-5 py-4 border border-gray-200 hover:border-black transition-colors group/feature">
                               <Check size={16} className="text-primary shrink-0 group-hover/feature:scale-125 transition-transform" />
                               <span className="text-[10px] font-black text-black uppercase tracking-[0.2em]">{feature}</span>
                            </div>
                         ))}
                      </div>
                      <a 
                        href={service.href} 
                        className="inline-flex items-center justify-center gap-3 bg-primary text-black px-10 py-5 font-black uppercase tracking-[0.2em] text-[10px] hover:bg-orange-600 hover:text-white transition-colors"
                      >
                         Specifications <ArrowRight size={14} />
                      </a>
                   </div>
                </div>
             ))}
           </div>
        </Container>
      </Section>

      {/* Why Choose Us / Capabilities */}
      <Section className="bg-[#0a0a0a] py-32 border-y border-[#1a1a1a] relative overflow-hidden">
         {/* Industrial grid overlay */}
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

      {/* Support Services Grid */}
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

      {/* Process at a Glance */}
      <Section className="bg-gray-50 py-32 overflow-hidden border-b border-gray-200">
        <Container>
           <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-24 gap-10">
              <div className="max-w-3xl">
                 <h2 className="text-5xl md:text-6xl lg:text-7xl font-black uppercase text-black tracking-tighter mb-6 leading-[0.9]">The Build <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-600">Journey</span></h2>
                 <p className="text-gray-500 text-xl font-medium leading-relaxed border-l-[3px] border-black pl-6">From initial consultation to the first time you fire up the grill, we are with you every step of the way.</p>
              </div>
              <a href="/process" className="inline-flex items-center justify-center gap-3 bg-black text-white px-10 py-5 font-black uppercase tracking-[0.2em] text-[10px] hover:bg-primary hover:text-black transition-colors shrink-0">
                 Explore Process <ArrowRight size={14} />
              </a>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative">
              <div className="hidden md:block absolute top-12 left-0 w-full h-1 bg-black z-0"></div>
              {[
                 { step: "01", title: "Consult", desc: "Define your menu & needs." },
                 { step: "02", title: "Design", icon: PenTool, desc: "Blueprints & workflow." },
                 { step: "03", title: "Build", icon: Wrench, desc: "Fabrication & install." },
                 { step: "04", title: "Keys", icon: Award, desc: "Training & Handover." }
              ].map((item, i) => (
                 <div key={i} className="relative z-10 group bg-gray-50">
                    <div className="bg-white w-24 h-24 border-2 border-black flex items-center justify-center text-4xl font-black text-black mb-8 group-hover:border-primary group-hover:bg-primary transition-colors group-hover:-translate-y-2">
                       {item.step}
                    </div>
                    <h4 className="text-3xl font-black uppercase text-black mb-3 tracking-tighter leading-none">{item.title}</h4>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">{item.desc}</p>
                 </div>
              ))}
           </div>
        </Container>
      </Section>

      {/* FAQ integration */}
      <FAQSection faqs={faqs} />

      {/* Final CTA */}
      <section className="py-32 bg-[#0a0a0a] overflow-hidden relative border-t border-[#1a1a1a]">
         <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "repeating-linear-gradient(45deg, #fff 0px, #fff 1px, transparent 1px, transparent 10px)" }} />
         
         <Container className="relative z-10 text-center">
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-black text-white uppercase tracking-tighter mb-12 max-w-5xl mx-auto leading-[0.85]">
               {sections.cta?.title || (
                    <>Build Your Business On A <br className="hidden md:block"/><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-600">Foundation Of Steel</span></>
               )}
            </h2>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
               <a 
                  href="/quote" 
                  className="bg-primary text-black border border-primary px-12 py-6 font-black uppercase tracking-[0.2em] text-[10px] hover:bg-orange-600 hover:text-white hover:border-orange-600 transition-colors min-w-[260px] flex items-center justify-center gap-3"
               >
                  {sections.cta?.ctaText || "Initialize Quote"} <ArrowRight size={14} />
               </a>
               <a 
                  href="/portfolio" 
                  className="bg-transparent text-white border border-white/20 px-12 py-6 font-black uppercase tracking-[0.2em] text-[10px] hover:bg-white hover:text-black transition-colors min-w-[260px]"
               >
                  View Recent Builds
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
