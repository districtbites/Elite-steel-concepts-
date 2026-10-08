import React from "react";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";
import QuoteForm from "@/components/QuoteForm";
import FAQSection from "@/components/FAQSection";
import { ShieldCheck, Zap, Factory, Award, CheckCircle2, ChevronRight } from "lucide-react";
import Link from "next/link";
import { getSEO, getPageSEO, getFAQs, getLocations } from "@/lib/db";
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
    alternates: { canonical: '/quote' },
  };
}

export default async function QuotePage() {
  const [faqs, locations] = await Promise.all([getFAQs(), getLocations()]);

  // Cities we serve, grouped by state code — powers the City suggestions in the form
  const citiesByState: Record<string, string[]> = {};
  for (const loc of locations) {
    if (loc.published === false || !loc.state || !loc.city) continue;
    const list = (citiesByState[loc.state] ||= []);
    if (!list.includes(loc.city.trim())) list.push(loc.city.trim());
  }
  Object.values(citiesByState).forEach((list) => list.sort());

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
        eyebrow="Elite Steel Concept"
        title="Get Your Free Food Truck & Trailer Quote"
        subtitle="Start Your Build With Trusted Custom Food Truck & Trailer Builders!"
        titleClassName="text-3xl md:text-5xl max-w-5xl mx-auto !leading-tight"
        normalCaseSubtitle
        className="!pb-10 md:!pb-12"
      />

      <Section className="bg-[#0a0a0a] overflow-hidden !py-10 md:!py-14 border-b border-[#1a1a1a] relative">
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "repeating-linear-gradient(45deg, #fff 0px, #fff 1px, transparent 1px, transparent 10px)" }} />
        <Container className="relative z-10">
          <div className="max-w-4xl mx-auto">
            
            {/* Form */}
            <div className="flex flex-col gap-8">
               <QuoteForm citiesByState={citiesByState} />
               
               {/* Hidden: Authorized Systems
               <div className="mt-2 flex flex-wrap items-center justify-center gap-6 opacity-80 hover:opacity-100 transition-opacity">
                  <span className="font-black text-[10px] uppercase tracking-[0.2em] text-gray-500 border border-[#1a1a1a] px-3 py-2 bg-black">Authorized Systems</span>
                  <span className="font-black text-xs uppercase text-black tracking-tighter">NFPA 96</span>
                  <span className="font-black text-xs uppercase text-black tracking-tighter">NSF</span>
                  <span className="font-black text-xs uppercase text-black tracking-tighter">ANSI</span>
               </div>
               */}
            </div>

            {/* Hidden: Right sidebar (Elite Advantage, Fabrication Metrics, Road To Handover)
            -- Right Column: High-Value Sidebar (5 Cols) --
            <div className="lg:col-span-5 space-y-12 mt-8 lg:mt-0 lg:sticky lg:top-32 h-fit">
               
               -- Elite Advantage --
               <div className="space-y-6">
                  <div className="inline-flex items-center gap-3 bg-primary border border-primary text-black px-5 py-3 text-[10px] font-black uppercase tracking-[0.2em]">
                     <div className="w-2 h-2 bg-black animate-pulse"></div>
                     Real-Time Response Cycle
                  </div>
                  
                  <div className="space-y-4 pt-6">
                     {advantages.map((adv, i) => (
                        <div key={i} className="flex gap-6 group bg-black p-6 border-2 border-[#1a1a1a] hover:border-primary transition-colors duration-300">
                           <div className="bg-[#1a1a1a] w-12 h-12 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-colors duration-300 shrink-0">
                              <adv.icon size={20} />
                           </div>
                           <div className="space-y-1.5">
                              <h4 className="text-lg font-black uppercase text-white tracking-tighter">{adv.title}</h4>
                              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest leading-relaxed">{adv.text}</p>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>

               -- Metrics Snapshot --
               <div className="bg-black p-10 border-2 border-[#1a1a1a] text-white relative overflow-hidden group">
                  <div className="relative z-10 space-y-10">
                     <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none">
                        Fabrication <br/> <span className="text-primary">Metrics</span>
                     </h3>
                     <div className="space-y-4">
                        {processMetrics.map((met, i) => (
                           <div key={i} className="flex justify-between items-center border-b border-[#1a1a1a] pb-4">
                              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">{met.label}</span>
                              <span className="text-sm font-black text-primary uppercase">{met.value}</span>
                           </div>
                        ))}
                     </div>
                     <div className="bg-[#0a0a0a] p-6 border border-[#1a1a1a]">
                        <div className="flex items-start gap-4">
                           <CheckCircle2 size={24} className="text-primary shrink-0 mt-1" />
                           <p className="text-xs text-gray-400 leading-relaxed font-bold uppercase tracking-widest">
                              "Elite Steel's quoting process was more detailed than the actual build from other shops. They found issues in my menu workflow before we even broke ground."
                           </p>
                        </div>
                        <div className="mt-4 text-[10px] font-black uppercase tracking-[0.2em] text-primary border-t border-[#1a1a1a] pt-4">MARCO'S PIZZA TRUCK</div>
                     </div>
                  </div>
               </div>

               -- Guided Path --
               <div className="bg-black p-10 border-2 border-[#1a1a1a] space-y-8 relative group hover:border-primary transition-colors">
                  <h4 className="text-[10px] font-black uppercase text-white tracking-[0.2em] flex items-center gap-3">
                     <Factory size={16} className="text-primary" /> The Road To Handover
                  </h4>
                  <div className="space-y-4">
                     {['Requirement Analysis', 'CAD Workflow Design', 'Precision Fabrication', 'Health Dept. Verification'].map((step, i) => (
                        <div key={i} className="flex items-center gap-4 text-gray-500 font-black uppercase text-[10px] tracking-[0.2em] transition-colors hover:text-white cursor-default bg-[#0a0a0a] p-4 border border-[#1a1a1a]">
                           <div className="w-2 h-2 bg-primary"></div>
                           {step}
                           {i < 3 && <ChevronRight size={14} className="ml-auto text-gray-600" />}
                        </div>
                     ))}
                  </div>
               </div>

            </div>
            */}
          </div>
        </Container>
      </Section>

      {/* Hidden: Before You Apply
      -- Preparation Guide Card --
      <Section className="bg-white py-32 border-b border-gray-100">
        <Container>
          <div className="border-4 border-black p-12 md:p-16 text-black relative bg-gray-50">
             <div className="flex flex-col lg:flex-row items-start gap-16">
                <div className="lg:col-span-1 space-y-6 max-w-sm">
                   <div className="w-16 h-16 bg-black flex items-center justify-center text-primary shadow-[4px_4px_0px_0px_rgba(247,147,30,1)]">
                      <Factory size={32} />
                   </div>
                   <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">
                      Before You <br/> <span className="text-primary">Apply</span>
                   </h2>
                   <p className="text-gray-500 text-xs font-bold uppercase tracking-widest leading-relaxed">
                      Ensure you have the following information ready to help our engineers provide the most accurate assessment.
                   </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-gray-200 flex-1">
                   {[
                     { title: "Menu Core", text: "Primary cooking method dictates exhaust hood size." },
                     { title: "Power Loads", text: "Estimate total wattage for generator sizing." },
                     { title: "Vehicle Specs", text: "Required VIN and structural photos if providing." },
                     { title: "Permit Zone", text: "City/County health codes vary. Note operations zone." }
                   ].map((item, i) => (
                     <div key={i} className="bg-white p-8 group hover:bg-black hover:text-white transition-colors border border-transparent hover:border-black">
                        <h4 className="text-black group-hover:text-primary font-black uppercase text-[10px] tracking-[0.2em] mb-4 transition-colors">{item.title}</h4>
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-widest leading-relaxed group-hover:text-gray-400 transition-colors">{item.text}</p>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        </Container>
      </Section>
      */}

      {/* Sticky Support CTA */}
      <section className="bg-primary border-y border-black py-10 md:py-12">
         <Container>
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
               <div>
                  <h3 className="text-3xl md:text-5xl font-black uppercase text-black tracking-tighter mb-2 leading-none">Need Technical Assistance?</h3>
                  <p className="text-xs text-black/80 font-black uppercase tracking-[0.2em]">Skip the form and talk to a master fabricator today.</p>
               </div>
               <Link href="/contact" className="px-10 py-5 bg-black text-white border-2 border-black font-black uppercase text-[10px] tracking-[0.2em] hover:bg-white hover:text-black transition-colors shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] hover:shadow-none hover:translate-x-2 hover:translate-y-2 shrink-0 whitespace-nowrap">
                  Schedule Consultation
               </Link>
            </div>
         </Container>
      </section>
    </>
  );
}
