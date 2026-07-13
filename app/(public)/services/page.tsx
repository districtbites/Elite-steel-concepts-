import React from "react";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";

export const dynamic = 'force-dynamic';
export const revalidate = 0;
import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import Image from "next/image";
import { Truck, Box, PenTool, Wrench, ShieldCheck, ArrowRight, Check, X, Award, MapPin, Zap } from "lucide-react";
import FAQSection from "@/components/FAQSection";

import { getSEO, getPageSEO, getFAQs, getMediaAsset } from "@/lib/db";
import type { Metadata } from "next";

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

  const services = [
    {
      title: "Custom Food Trucks",
      icon: Truck,
      image: truckImage.url,
      description: "The ultimate mobile billboard. Our custom food trucks are engineered for performance and designed to turn heads. Built on reliable step-van chassis, they offer maximum mobility.",
      features: ["Step Van Conversions", "New & Used Chassis", "Generator Installation", "Full Graphic Wraps"],
      href: "/services/custom-food-trucks",
      color: "secondary"
    },
    {
      title: "Concession Trailers",
      icon: Box,
      image: trailerImage.url,
      description: "Maximize your kitchen space and lower your overhead. Trailers are perfect for semi-permanent locations and high-volume events where you need more room to operate.",
      features: ["Custom Sizes (10' - 30')", "Porch & Smoker Builds", "Lower Maintenance", "Detachable Towing"],
      href: "/services/custom-food-trailers",
      color: "primary"
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
        title={sections.header?.title || "Expert Fabrication"}
        subtitle={sections.header?.subtitle || "Master craftsmanship applied to the art of mobile kitchens. From ground-up builds to advanced engineering, we deliver the elite standard."}
      />

      {/* Intro / Stats Section */}
      <Section className="bg-white">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
             <div>
                <span className="text-primary font-bold tracking-widest uppercase text-sm mb-4 block underline decoration-secondary decoration-4 underline-offset-8">
                    {sections.intro?.subtitle || "Precision Builds"}
                </span>
                <h2 className="text-4xl md:text-5xl font-black uppercase text-secondary tracking-tight mb-8 leading-tight">
                  {sections.intro?.title || (
                    <>Industry Leading <br/><span className="text-primary italic">Mobile Kitchen</span> Solutions</>
                  )}
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed mb-8 font-light">
                  {sections.intro?.content || (
                    <>At Elite Steel Concepts, we don't just build boxes with kitchens. We engineer <strong className="text-secondary font-bold">high-performance commercial environments</strong> designed to maximize flow, sanitation, and safety while projecting a premium brand image.</>
                  )}
                </p>
                <div className="grid grid-cols-2 gap-8">
                   <div className="space-y-2">
                      <div className="text-3xl font-black text-secondary tracking-tighter">100%</div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-loose">Code Compliant</p>
                   </div>
                   <div className="space-y-2">
                      <div className="text-3xl font-black text-secondary tracking-tighter">12+ YRS</div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-loose">Engineering Exp.</p>
                   </div>
                </div>
             </div>
             <div className="relative group">
                <div className="absolute -inset-4 bg-primary/20 rounded-[2rem] -rotate-3 group-hover:rotate-0 transition-transform duration-500"></div>
                <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl">
                   <Image 
                      src={servicesHero.url} 
                      alt={servicesHero.alt || "Workshop Fabrication"}
                      fill
                      className="object-cover"
                   />
                </div>
             </div>
          </div>
        </Container>
      </Section>

      {/* Main Services - Alternating */}
      <Section className="bg-gray-50/50">
        <Container>
           {services.map((service, index) => (
              <div key={index} className={`flex flex-col lg:flex-row items-center gap-16 ${index === 0 ? 'mb-32' : ''} ${index % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
                 <div className="w-full lg:w-1/2 relative group">
                    <div className="absolute inset-0 bg-secondary/10 group-hover:bg-transparent transition-colors z-10"></div>
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                       <Image 
                          src={service.image} 
                          alt={service.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                       />
                    </div>
                 </div>
                 <div className="w-full lg:w-1/2">
                    <div className="flex items-center mb-6">
                       <div className="bg-primary p-4 rounded-2xl text-secondary shadow-lg mr-6">
                         <service.icon size={32} />
                       </div>
                       <h2 className="text-3xl md:text-4xl font-black uppercase text-secondary tracking-tight leading-none">{service.title}</h2>
                    </div>
                    <p className="text-gray-600 text-lg leading-relaxed mb-8">
                       {service.description}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                       {service.features.map((feature, i) => (
                          <div key={i} className="flex items-center gap-2 bg-white px-4 py-3 rounded-xl border border-gray-100 shadow-sm">
                             <Check size={18} className="text-primary shrink-0" />
                             <span className="text-sm font-bold text-gray-700 uppercase tracking-tighter">{feature}</span>
                          </div>
                       ))}
                    </div>
                    <Button 
                      href={service.href} 
                      className="bg-secondary text-white border-2 border-secondary px-8 py-4 uppercase font-black tracking-widest text-xs hover:bg-transparent hover:text-secondary transition-all"
                    >
                       Learn More About {service.title}
                    </Button>
                 </div>
              </div>
           ))}
        </Container>
      </Section>

      {/* Why Choose Us / Capabilities */}
      <Section className="bg-white">
         <Container>
            <div className="bg-secondary rounded-[3rem] p-12 md:p-20 text-white relative overflow-hidden">
               <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 blur-[120px] -mr-48 -mt-48 rounded-full"></div>
               <div className="relative z-10">
                  <div className="max-w-3xl mb-16">
                     <span className="text-primary font-bold tracking-widest uppercase text-sm mb-4 block underline decoration-primary/30 decoration-2 underline-offset-8">Core Capabilities</span>
                     <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-6 leading-tight">
                        We build with <br className="hidden md:block"/>
                        <span className="text-primary italic">No Compromises</span>
                     </h2>
                     <p className="text-gray-300 text-lg leading-relaxed font-light">
                        Our facility is equipped with state-of-the-art tools and staffed by master welders and electricians who specialize in mobile environments.
                     </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                     <div className="space-y-4">
                        <div className="bg-white/5 w-14 h-14 rounded-2xl flex items-center justify-center text-primary border border-white/10 group-hover:bg-primary transition-colors">
                           <Award size={28} />
                        </div>
                        <h4 className="text-xl font-black uppercase tracking-tight">Master Welding</h4>
                        <p className="text-sm text-gray-400 leading-relaxed font-light">TIG and MIG stainless steel fabrication for hygienic and forever-durable interiors.</p>
                     </div>
                     <div className="space-y-4">
                        <div className="bg-white/5 w-14 h-14 rounded-2xl flex items-center justify-center text-primary border border-white/10">
                           <Zap size={28} />
                        </div>
                        <h4 className="text-xl font-black uppercase tracking-tight">Electrical Systems</h4>
                        <p className="text-sm text-gray-400 leading-relaxed font-light">High-capacity power grids designed to handle multiple fryers, ranges, and refrigeration units simultaneously.</p>
                     </div>
                     <div className="space-y-4">
                        <div className="bg-white/5 w-14 h-14 rounded-2xl flex items-center justify-center text-primary border border-white/10">
                           <ShieldCheck size={28} />
                        </div>
                        <h4 className="text-xl font-black uppercase tracking-tight">NSF Standards</h4>
                        <p className="text-sm text-gray-400 leading-relaxed font-light">Full adherence to National Sanitation Foundation standards for easy cleaning and inspection pass rates.</p>
                     </div>
                  </div>
               </div>
            </div>
         </Container>
      </Section>

      {/* Support Services Grid */}
      <Section className="bg-gray-50/50">
         <Container>
            <div className="text-center mb-20">
               <span className="text-primary font-bold tracking-widest uppercase text-sm mb-4 block">Added Value</span>
               <h2 className="text-4xl md:text-5xl font-black uppercase text-secondary tracking-tighter">Support Services</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
               {[
                 { title: "Design", icon: PenTool, desc: "2D and 3D floor plans." },
                 { title: "Repairs", icon: Wrench, desc: "Fast fleet maintenance." },
                 { title: "Compliance", icon: ShieldCheck, desc: "Health code assistance." },
                 { title: "Sourcing", icon: MapPin, desc: "Vehicle & trailer locating." }
               ].map((item, i) => (
                  <div key={i} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover-lift transition-all text-center">
                     <div className="bg-secondary/5 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                        <item.icon size={28} />
                     </div>
                     <h3 className="text-lg font-black uppercase text-secondary mb-2 tracking-tighter">{item.title}</h3>
                     <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">{item.desc}</p>
                  </div>
               ))}
            </div>
         </Container>
      </Section>

      {/* Process at a Glance */}
      <Section className="bg-white overflow-hidden">
        <Container>
           <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
              <div className="max-w-xl">
                 <h2 className="text-4xl font-black uppercase text-secondary tracking-tighter mb-4">The Build <span className="text-primary italic">Journey</span></h2>
                 <p className="text-gray-500 font-light">From initial consultation to the first time you fire up the grill, we are with you every step of the way.</p>
              </div>
              <Button href="/process" className="border-2 border-secondary text-secondary hover:bg-secondary hover:text-white px-8 py-3 rounded-full font-bold uppercase text-xs tracking-widest transition-all">
                 Explore Full Process
              </Button>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
              <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gray-100 z-0"></div>
              {[
                 { step: "01", title: "Consult", desc: "Define your menu & needs." },
                 { step: "02", title: "Design", icon: PenTool, desc: "Blueprints & workflow." },
                 { step: "03", title: "Build", icon: Wrench, desc: "Fabrication & install." },
                 { step: "04", title: "Keys", icon: Award, desc: "Training & Handover." }
              ].map((item, i) => (
                 <div key={i} className="relative z-10 group">
                    <div className="bg-white w-24 h-24 rounded-full border-4 border-gray-50 flex items-center justify-center text-2xl font-black text-primary mb-6 group-hover:border-primary transition-colors shadow-sm">
                       {item.step}
                    </div>
                    <h4 className="text-xl font-black uppercase text-secondary mb-2 tracking-tight">{item.title}</h4>
                    <p className="text-sm text-gray-500 font-light leading-relaxed">{item.desc}</p>
                 </div>
              ))}
           </div>
        </Container>
      </Section>

      {/* FAQ integration */}
      <FAQSection faqs={faqs} />

      {/* Final CTA */}
      <section className="py-20 bg-secondary overflow-hidden relative">
         <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute -top-1/2 -left-1/4 w-[150%] h-[150%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary via-transparent to-transparent"></div>
         </div>
         <Container className="relative z-10 text-center">
            <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mb-8 max-w-4xl mx-auto leading-tight">
               {sections.cta?.title || (
                    <>Build Your Business On A <br className="hidden md:block"/><span className="text-primary italic">Foundation Of Steel</span></>
               )}
            </h2>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
               <Button 
                  href="/quote" 
                  className="bg-primary text-secondary px-12 py-5 rounded-full font-black uppercase tracking-widest text-sm hover:bg-white transition-colors min-w-[240px]"
               >
                  {sections.cta?.ctaText || "Get Custom Quote"}
               </Button>
               <Button 
                  href="/portfolio" 
                  className="bg-white/10 text-white border border-white/20 backdrop-blur-md px-12 py-5 rounded-full font-black uppercase tracking-widest text-sm hover:bg-white/20 transition-colors min-w-[240px]"
               >
                  View Recent Builds
               </Button>
            </div>
         </Container>
      </section>
    </>
  );
}
