import React from "react";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import CTASection from "@/components/ui/CTASection";
import { FileText, Phone, PenTool, CheckSquare, Hammer, ArrowRight, Lightbulb, Clock, ShieldCheck, Sparkles, Zap, MessageSquare } from "lucide-react";

import { getSEO, getPageSEO } from "@/lib/db";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSEO();
  const pageSeo = await getPageSEO("process");
  
  return {
    title: pageSeo?.title || `Our Process | ${seo.siteTitle}`,
    description: pageSeo?.description || seo.description,
    keywords: pageSeo?.keywords || seo.keywords,
  };
}

export default async function ProcessPage() {
  const steps = [
    {
      number: "01",
      title: "Vision & Quote",
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
      title: "The Handshake",
      icon: CheckSquare,
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
      title: "The Handover",
      icon: Award,
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
        title="The Fabrication Journey"
        subtitle="Crafting a world-class mobile kitchen requires more than just tools—it requires a disciplined, transparent, and masterfully executed system."
      />

      {/* Progress Journey Section */}
      <Section className="bg-white">
        <Container>
          <div className="max-w-5xl mx-auto relative">
             {/* Progress Line */}
             <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-secondary/20 to-primary/10 hidden md:block -ml-0.5"></div>

             <div className="space-y-32">
                {steps.map((step, index) => (
                   <div key={index} className={`relative flex flex-col md:flex-row gap-12 items-center ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
                      
                      {/* Connection Dot */}
                      <div className="absolute left-8 md:left-1/2 top-10 md:top-20 w-8 h-8 rounded-full bg-white border-4 border-primary shadow-lg z-10 hidden md:flex items-center justify-center -ml-4">
                         <div className="w-2 h-2 bg-secondary rounded-full"></div>
                      </div>

                      {/* Side A: Number & Visual */}
                      <div className="w-full md:w-5/12 text-center md:text-right">
                         <div className={`flex flex-col ${index % 2 !== 0 ? 'md:items-start md:text-left' : 'md:items-end md:text-right'} items-center`}>
                            <div className="text-[10rem] font-black text-gray-50/80 leading-none absolute -z-10 -mt-16 select-none tracking-tighter">
                               {step.number}
                            </div>
                            <div className="bg-secondary p-5 rounded-3xl text-primary shadow-2xl mb-6 transform hover:rotate-6 transition-transform">
                               <step.icon size={42} />
                            </div>
                            <h3 className="text-4xl font-black uppercase text-secondary tracking-tighter mb-4 leading-none">
                               {step.title}
                            </h3>
                            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100 mb-4">
                               <Clock size={16} className="text-primary" />
                               <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Phase {step.number}</span>
                            </div>
                         </div>
                      </div>

                      {/* Side B: Detailed Content Card */}
                      <div className="w-full md:w-6/12">
                         <div className="bg-white p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 hover:border-primary/30 transition-all group relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                               <step.icon size={120} />
                            </div>
                            
                            <p className="text-gray-600 text-lg leading-relaxed mb-8 font-light italic">
                               "{step.description}"
                            </p>
                            
                            <div className="grid grid-cols-1 gap-4 mb-8">
                               {step.items.map((item, i) => (
                                  <div key={i} className="flex items-start gap-4">
                                     <div className="mt-1 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                                        <ArrowRight size={10} className="text-secondary" />
                                     </div>
                                     <span className="text-sm font-bold text-secondary uppercase tracking-tight">{item}</span>
                                  </div>
                               ))}
                            </div>

                            {/* Pro Tip Bubble */}
                            <div className="bg-primary/5 border-l-4 border-primary p-4 rounded-r-2xl flex gap-3">
                               <Lightbulb size={20} className="text-primary shrink-0" />
                               <div>
                                  <span className="text-[10px] font-black uppercase text-primary block mb-1">Elite Pro-Tip</span>
                                  <p className="text-xs text-gray-600 leading-relaxed font-medium italic">{step.proTip}</p>
                               </div>
                            </div>
                         </div>
                      </div>
                   </div>
                ))}
             </div>
          </div>
        </Container>
      </Section>

      {/* Expectation / Reliability Section */}
      <Section className="bg-secondary py-32 overflow-hidden relative">
         <div className="absolute top-0 right-0 w-full h-full opacity-5 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
         </div>
         
         <Container className="relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
               <div>
                  <span className="text-primary font-bold tracking-[0.3em] uppercase text-xs mb-6 block">Beyond The Build</span>
                  <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-8 leading-[0.9]">
                     What to <br/> <span className="text-primary italic">Expect</span> <br/> From Us
                  </h2>
                  <div className="space-y-6 max-w-lg">
                     <p className="text-gray-400 text-lg leading-relaxed">
                        We believe quality fabrication is only half the battle. Professional communication and timeline integrity are what separate Elite Steel from the rest of the industry.
                     </p>
                     <div className="flex items-center gap-4 text-white font-black text-sm uppercase tracking-widest bg-white/5 p-4 rounded-2xl border border-white/10 w-fit">
                        <MessageSquare className="text-primary" /> Weekly Progress Updates
                     </div>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { title: "Transparency", icon: ShieldCheck, desc: "Detailed contracts and itemized pricing with no bait-and-switch." },
                    { title: "Speed", icon: Zap, desc: "Optimized workflow that gets you on the road weeks faster than competitors." },
                    { title: "Support", icon: Phone, desc: "Direct access to your project manager throughout the entire build phase." },
                    { title: "Precision", icon: Sparkles, desc: "Every rivet and weld is inspected by our quality control lead." }
                  ].map((item, i) => (
                     <div key={i} className="bg-white/5 p-8 rounded-[2rem] border border-white/10 backdrop-blur-sm group hover:bg-white/10 transition-all">
                        <item.icon className="text-primary mb-6 group-hover:scale-110 transition-transform" size={32} />
                        <h4 className="text-xl font-black text-white uppercase tracking-tighter mb-2">{item.title}</h4>
                        <p className="text-sm text-gray-400 leading-relaxed font-light">{item.desc}</p>
                     </div>
                  ))}
               </div>
            </div>
         </Container>
      </Section>

      <CTASection
        title="Ready to Secure Your Slot?"
        subtitle="Our production calendar fills up fast. Contact us today to lock in your fabrication date."
        buttonText="Get Started"
        buttonHref="/quote"
      />
    </>
  );
}

const Award = ({ size }: { size: number }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="m12 15 3.5 3.5L17 13.5 13.5 12 12 16Z"/>
    <path d="m12 15-3.5 3.5L7 13.5 10.5 12 12 16Z"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);
