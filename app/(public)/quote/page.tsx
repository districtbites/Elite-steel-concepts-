import React from "react";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";
import QuoteForm from "@/components/QuoteForm";
import FAQSection from "@/components/FAQSection";
import { ShieldCheck, Zap, Factory, Clock, Award, CheckCircle2, ChevronRight } from "lucide-react";

import Link from "next/link";

import Image from "next/image";
import { getSEO, getPageSEO, getFAQs } from "@/lib/db";
import type { Metadata } from "next";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSEO();
  const pageSeo = await getPageSEO("quote");
  
  return {
    title: pageSeo?.title || `Request A Quote | Elite Steel Concepts`,
    description: pageSeo?.description || seo.description,
    keywords: pageSeo?.keywords || seo.keywords,
  };
}

export default async function QuotePage() {
  const faqs = await getFAQs();

  const advantages = [
    { title: "Precision TIG Welding", text: "Structural integrity that exceeds industrial kitchen standards.", icon: Zap },
    { title: "NFPA 96 Compliance", text: "Built-in fire safety and ventilation that passes every inspection.", icon: ShieldCheck },
    { title: "Custom CAD Planning", text: "Optimize your workflow with 3D floor plans designed for speed.", icon: Award },
  ];

  const processMetrics = [
    { label: "Engineering Quality", value: "A++" },
    { label: "Design Blueprinting", value: "Included" },
    { label: "Health Code Approval", value: "Guaranteed" },
  ];

  return (
    <>
      <PageHeader
        title="Engineering Your Vision"
        subtitle="The blueprint for your culinary empire starts here. Provide your project specifications for a comprehensive fabrication analysis."
      />

      <Section className="bg-gray-50/50">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            
            {/* Left Column: Form (7 Cols) */}
            <div className="lg:col-span-7">
               <div className="bg-white p-8 md:p-16 rounded-[4rem] shadow-2xl relative border border-gray-100 overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                  
                  <div className="mb-12">
                     <span className="text-primary font-bold tracking-widest uppercase text-[10px] mb-4 block">Fabrication Request</span>
                     <h2 className="text-3xl md:text-5xl font-black uppercase text-secondary tracking-tighter leading-tight mb-6">
                        Build <span className="text-primary italic">Specifications</span>
                     </h2>
                     <p className="text-gray-500 font-light leading-relaxed">
                        To provide an accurate engineering estimate, please be as specific as possible regarding your equipment needs and menu concept.
                     </p>
                  </div>

                  <QuoteForm />
                  
                  <div className="mt-12 flex items-center justify-center gap-8 opacity-30 grayscale saturate-0">
                     <span className="font-black text-[10px] uppercase tracking-widest text-secondary">Authorized Systems:</span>
                     <span className="font-black text-xs uppercase text-secondary tracking-tighter">NFPA 96</span>
                     <span className="font-black text-xs uppercase text-secondary tracking-tighter">NSF</span>
                     <span className="font-black text-xs uppercase text-secondary tracking-tighter">ANSI</span>
                  </div>
               </div>
            </div>

            {/* Right Column: High-Value Sidebar (5 Cols) */}
            <div className="lg:col-span-5 space-y-12">
               
               {/* Elite Advantage */}
               <div className="space-y-10">
                  <div className="inline-flex items-center gap-2 bg-secondary text-primary px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                     <Clock size={12} /> Real-Time Response Cycle
                  </div>
                  
                  <div className="space-y-8">
                     {advantages.map((adv, i) => (
                        <div key={i} className="flex gap-6 group">
                           <div className="bg-white w-14 h-14 rounded-2xl shadow-sm flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-secondary transition-all duration-300 shrink-0">
                              <adv.icon size={24} />
                           </div>
                           <div className="space-y-2">
                              <h4 className="text-lg font-black uppercase text-secondary tracking-tight">{adv.title}</h4>
                              <p className="text-sm text-gray-500 leading-relaxed font-light">{adv.text}</p>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>

               {/* Metrics Snapshot */}
               <div className="bg-secondary p-12 rounded-[3.5rem] text-white relative overflow-hidden group">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--color-primary)_0%,_transparent_60%)] opacity-10"></div>
                  <div className="relative z-10 space-y-10">
                     <h3 className="text-2xl font-black uppercase tracking-tighter leading-none">
                        Fabrication <br/> <span className="text-primary">Integrity Metrics</span>
                     </h3>
                     <div className="space-y-6">
                        {processMetrics.map((met, i) => (
                           <div key={i} className="flex justify-between items-center border-b border-white/10 pb-4">
                              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{met.label}</span>
                              <span className="text-sm font-black text-primary uppercase">{met.value}</span>
                           </div>
                        ))}
                     </div>
                     <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                        <div className="flex items-start gap-4">
                           <CheckCircle2 size={24} className="text-primary shrink-0" />
                           <p className="text-xs text-gray-400 leading-relaxed">
                              "Elite Steel's quoting process was more detailed than the actual build from other shops. They found issues in my menu workflow before we even broke ground."
                           </p>
                        </div>
                        <div className="mt-4 text-[9px] font-black uppercase tracking-widest text-primary text-right">— Marco's Pizza Truck</div>
                     </div>
                  </div>
               </div>

               {/* Guided Path */}
               <div className="p-8 space-y-6">
                  <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] mb-6 flex items-center gap-2">
                     <Factory size={14} className="text-primary"/> The Road To Handover
                  </h4>
                  <div className="space-y-4">
                     {['Requirement Analysis', 'CAD Workflow Design', 'Precision Fabrication', 'Health Dept. Verification'].map((step, i) => (
                        <div key={i} className="flex items-center gap-4 text-secondary/40 font-black uppercase text-[10px] tracking-widest transition-all hover:text-secondary cursor-default">
                           <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                           {step}
                           {i < 3 && <ChevronRight size={12} className="ml-auto opacity-20" />}
                        </div>
                     ))}
                  </div>
               </div>

            </div>
          </div>
        </Container>
      </Section>


      {/* Preparation Guide Card */}
      <Section className="bg-gray-50 py-24">
        <Container>
          <div className="bg-secondary rounded-[4rem] p-12 md:p-20 text-white relative overflow-hidden">
             <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 -skew-x-12 translate-x-32 hidden lg:block"></div>
             <div className="relative z-10 flex flex-col lg:flex-row items-center gap-16">
                <div className="lg:col-span-1 space-y-6">
                   <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-secondary">
                      <Factory size={32} />
                   </div>
                   <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-tight">
                      Before You <br/> <span className="text-primary">Apply</span>
                   </h2>
                   <p className="text-gray-400 font-light leading-relaxed max-w-sm">
                      Ensure you have the following information ready to help our engineers provide the most accurate assessment.
                   </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1">
                   {[
                     { title: "Menu Core", text: "Knowing your primary cooking method (Grilling vs Frying) determines your exhaust hood size." },
                     { title: "Power Loads", text: "Estimate your total wattage for generator sizing and electrical circuit planning." },
                     { title: "Vehicle Specs", text: "If providing a vehicle, we require the VIN and current structural photos." },
                     { title: "Permit Zone", text: "City/County health codes vary significantly. Let us know where you'll be operating." }
                   ].map((item, i) => (
                     <div key={i} className="bg-white/5 p-8 rounded-3xl border border-white/10 hover:border-primary transition-all">
                        <h4 className="text-primary font-black uppercase text-xs tracking-widest mb-3">{item.title}</h4>
                        <p className="text-xs text-gray-400 leading-loose">{item.text}</p>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        </Container>
      </Section>

      {/* Sticky Support CTA */}
      <section className="bg-white border-t border-gray-100 py-12">
         <Container>
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
               <div>
                  <h3 className="text-xl font-black uppercase text-secondary tracking-tight">Need Immediate Technical Assistance?</h3>
                  <p className="text-sm text-gray-500 font-light">Skip the form and talk to a master fabricator today.</p>
               </div>
               <Link href="/contact" className="px-12 py-5 bg-secondary text-white rounded-full font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-all shadow-xl">
                  Schedule Consultation
               </Link>
            </div>
         </Container>
      </section>
    </>
  );
}

