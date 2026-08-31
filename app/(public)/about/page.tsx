import React from "react";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";
import CTASection from "@/components/ui/CTASection";
import ReadMore from "@/components/ui/ReadMore";
import Image from "next/image";
import { Check, Shield, Award, Users, Target, Zap, Settings2 } from "lucide-react";
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
  const [pageSeo, aboutHero, rules, linkSettings] = await Promise.all([
    getPageSEO("about"),
    getMediaAsset("about", "hero", "https://images.pexels.com/photos/2955819/pexels-photo-2955819.jpeg?auto=compress&cs=tinysrgb&w=800"),
    getInternalLinkRules(),
    getInternalLinkSettings(),
  ]);
  const activeRules = rules.filter(r => r.enabled !== false);
  const alts = pageSeo.imageAlts || {};
  const sections = pageSeo.sections || {};

  const storyRaw = typeof sections.story?.content === "string"
    ? sections.story.content
    : "At Elite Steel Concepts, we believe that every great chef deserves a kitchen that works as hard as they do. Founded on the principles of integrity and master craftsmanship, we have helped hundreds of entrepreneurs transition from dreamers to business owners.";
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
        subtitle={sections.header?.subtitle || "Crafting the heart of mobile commerce since 2012. We are more than fabricators; we are your partners in entrepreneurship."}
      />

      {/* Intro Section */}
      <Section className="bg-white py-24 md:py-32">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
            <div className="lg:col-span-5 relative group">
              {/* Sharp geometric accent */}
              <div className="absolute -left-4 -top-4 w-full h-full bg-primary translate-x-2 translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-500" />
              <div className="relative aspect-[4/5] border-2 border-black overflow-hidden bg-black z-10">
                <Image 
                  src={aboutHero.url}
                  alt={aboutHero.alt || alts["about-hero"] || "Elite Steel Concepts Workshop"}
                  fill
                  className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 grayscale group-hover:grayscale-0"
                />
              </div>
            </div>
            
            <div className="lg:col-span-7 space-y-12">
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-2 h-2 bg-primary" />
                  <span className="text-black font-black tracking-[0.2em] uppercase text-[10px]">
                    {sections.story?.subtitle || "Established 2012"}
                  </span>
                </div>
                <h2 className="text-5xl md:text-7xl font-black uppercase text-black tracking-tighter leading-[0.9]">
                  {sections.story?.title || (
                      <>Pioneers in <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-600">Mobile Food</span></>
                  )}
                </h2>
              </div>
              
              <div className="pl-6 border-l-[3px] border-black">
                <ReadMore 
                  text={storyLinked} 
                  maxLength={250} 
                  className="text-gray-600 text-lg md:text-xl font-medium leading-relaxed max-w-prose"
                  buttonClassName="mt-4 text-[10px] font-black uppercase tracking-[0.2em] text-black border border-black px-4 py-2 hover:bg-primary hover:border-primary transition-colors flex items-center gap-2"
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8 border-t-2 border-gray-100">
                 <div className="flex flex-col gap-3 group">
                    <div className="w-12 h-12 bg-[#0a0a0a] text-primary flex items-center justify-center border border-[#1a1a1a] group-hover:bg-primary group-hover:text-black transition-colors shrink-0">
                       <Settings2 size={24} />
                    </div>
                    <div>
                       <h4 className="font-black uppercase tracking-[0.2em] text-[10px] text-black mb-2">Expert Fabrication</h4>
                       <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">In-house welding and engineering team.</p>
                    </div>
                 </div>
                 <div className="flex flex-col gap-3 group">
                    <div className="w-12 h-12 bg-[#0a0a0a] text-primary flex items-center justify-center border border-[#1a1a1a] group-hover:bg-primary group-hover:text-black transition-colors shrink-0">
                       <Shield size={24} />
                    </div>
                    <div>
                       <h4 className="font-black uppercase tracking-[0.2em] text-[10px] text-black mb-2">Code Compliance</h4>
                       <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">Deep knowledge of local health regulations.</p>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Stats / Numbers */}
      <Section dark className="!bg-[#0a0a0a] py-24 border-y border-[#1a1a1a] relative overflow-hidden">
         {/* Industrial grid overlay */}
         <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "repeating-linear-gradient(0deg, #fff 0px, #fff 1px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, #fff 0px, #fff 1px, transparent 1px, transparent 40px)" }} />
         
         <Container className="relative z-10">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
               {[
                 { label: "Builds Completed", value: "350+", icon: Award },
                 { label: "Active Clients", value: "280+", icon: Users },
                 { label: "Years Experience", value: "12+", icon: Zap },
                 { label: "States Served", value: "48", icon: Globe }
               ].map((stat, i) => (
                 <div key={i} className="flex flex-col items-center justify-center group relative p-8">
                    {/* Corner accents */}
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

      {/* Values / DNA */}
      <Section className="bg-white py-32">
        <Container>
           <div className="max-w-4xl mb-24 relative">
              <div className="absolute -left-10 top-4 w-4 h-full bg-primary hidden lg:block" />
              <div className="flex items-center gap-3 mb-4">
                 <div className="w-1.5 h-1.5 bg-black" />
                 <span className="text-black font-black tracking-[0.2em] uppercase text-[10px]">Operational Standard</span>
              </div>
              <h2 className="text-6xl md:text-8xl font-black uppercase text-black tracking-tighter leading-[0.85]">
                 The Elite <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-600">DNA</span>
              </h2>
           </div>

           <div className="space-y-16 lg:space-y-24">
              {values.map((v, i) => (
                <div key={i} className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start group">
                   {/* Number Block */}
                   <div className="w-full lg:w-1/4 shrink-0">
                      <div className="bg-[#0a0a0a] text-white border border-[#1a1a1a] p-8 relative overflow-hidden group-hover:border-primary transition-colors">
                         <div className="absolute -right-4 -top-4 text-[100px] font-black text-[#1a1a1a] leading-none select-none">
                            0{i + 1}
                         </div>
                         <v.icon size={48} className="text-primary mb-6 relative z-10 group-hover:scale-110 transition-transform" />
                         <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white relative z-10">Pillar 0{i + 1}</h4>
                      </div>
                   </div>
                   
                   {/* Content */}
                   <div className="w-full lg:w-3/4 lg:pt-6">
                      <h3 className="text-3xl md:text-5xl font-black uppercase text-black mb-6 tracking-tighter">
                         {v.title}
                      </h3>
                      <p className="text-xl md:text-2xl text-gray-500 leading-relaxed font-medium">
                         {v.description}
                      </p>
                   </div>
                </div>
              ))}
           </div>
        </Container>
      </Section>

      <CTASection
        title={sections.cta?.title || "Ready to Execute?"}
        subtitle={sections.cta?.subtitle || "Let's build a business that moves with you. Initialize your custom quote today."}
        buttonText={sections.cta?.ctaText || "Request Quote"}
        buttonHref="/quote"
        secondaryButtonText="Read Intelligence Briefs"
        secondaryButtonHref="/blog"
      />
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
