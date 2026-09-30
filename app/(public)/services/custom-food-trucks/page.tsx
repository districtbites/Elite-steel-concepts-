import React from "react";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";
import FAQSection from "@/components/FAQSection";
import Image from "next/image";
import Link from "next/link";
import { 
  CheckCircle2, 
  Truck, 
  Wrench, 
  ShieldCheck, 
  Zap, 
  Layers, 
  Layout, 
  Flame, 
  Droplets, 
  Battery, 
  ArrowRight,
  Maximize2,
  HardHat,
  Smartphone
} from "lucide-react";
import { getSEO, getPageSEO, getFAQs, getMediaAsset, getInternalLinkRules, getInternalLinkSettings } from "@/lib/db";
import { autoLinkMarkdown } from "@/lib/internalLinks";
import AutoLinkedText from "@/components/ui/AutoLinkedText";
import type { Metadata } from "next";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSEO();
  const pageSeo = await getPageSEO("custom-food-trucks");
  
  return {
    title: pageSeo?.title || `Elite Custom Food Trucks | Fabrication & Design`,
    description: pageSeo?.description || "High-performance custom food truck fabrication. From step vans to heavy-duty mobile kitchens, engineered for speed and compliance.",
    keywords: pageSeo?.keywords || seo.keywords,
    alternates: { canonical: '/services/custom-food-trucks' },
  };
}

export default async function CustomFoodTrucksPage() {
  const [faqs, rules, linkSettings] = await Promise.all([
    getFAQs(),
    getInternalLinkRules(),
    getInternalLinkSettings(),
  ]);
  const activeRules = rules.filter(r => r.enabled !== false);
  const truckFaqs = faqs.filter(f => f.category === "Fabrication" || f.category === "Process").slice(0, 5);

  const introDescRaw = "A custom food truck from Elite Steel Concepts is a precision tool. We focus on commercial kitchen design, ergonomic safety, and health code compliance. Every weld and every corner is designed to withstand the rigors of 24/7 commercial operation. You can also explore our custom concession trailers or request a custom quote.";
  const introDescLinked = autoLinkMarkdown(introDescRaw, activeRules, linkSettings).updatedContent;

  // Dynamic Assets from Media Manager
  const philosophyHero = await getMediaAsset("custom-food-trucks", "philosophy_hero", "https://images.pexels.com/photos/1855214/pexels-photo-1855214.jpeg?auto=compress&cs=tinysrgb&w=1200");
  const coreInterior = await getMediaAsset("custom-food-trucks", "core_interior", "https://images.pexels.com/photos/2577274/pexels-photo-2577274.jpeg?auto=compress&cs=tinysrgb&w=1200");
  const platformCompact = await getMediaAsset("custom-food-trucks", "platform_compact", "https://images.pexels.com/photos/887751/pexels-photo-887751.jpeg?auto=compress&cs=tinysrgb&w=800");
  const platformStandard = await getMediaAsset("custom-food-trucks", "platform_standard", "https://images.pexels.com/photos/2955819/pexels-photo-2955819.jpeg?auto=compress&cs=tinysrgb&w=800");
  const platformHeavy = await getMediaAsset("custom-food-trucks", "platform_heavy", "https://images.pexels.com/photos/2577274/pexels-photo-2577274.jpeg?auto=compress&cs=tinysrgb&w=800");

  const platforms = [
    { 
      size: "14-16ft Compact", 
      ideal: "Coffee, Pastries, Ice Cream", 
      advantage: "Maximum agility for city tight-spots.",
      image: platformCompact.url,
      imageAlt: platformCompact.alt
    },
    { 
      size: "18-20ft Standard", 
      ideal: "Burgers, Tacos, Fried Chicken", 
      advantage: "The perfect balance of space and mobility.",
      image: platformStandard.url,
      imageAlt: platformStandard.alt
    },
    { 
      size: "22ft+ Heavy Duty", 
      ideal: "Pizza (Wood-fired), Full BBQ, High Volume", 
      advantage: "Industrial capacity for massive crowds.",
      image: platformHeavy.url,
      imageAlt: platformHeavy.alt
    }
  ];

  const engineeringCore = [
    { 
      icon: Flame, 
      title: "Thermal Management", 
      desc: "NFPA 96 compliant exhaust hoods with high-velocity extraction and fire suppression integration." 
    },
    { 
      icon: Droplets, 
      title: "Advanced Plumbing", 
      desc: "NSF-certified stainless sinks with PEX manifold systems and automated grey-water discharge." 
    },
    { 
      icon: Battery, 
      title: "Power Architecture", 
      desc: "Silent diesel generator integration or full lithium-ion battery arrays for eco-friendly operations." 
    },
    { 
      icon: Layers, 
      title: "Structural Integrity", 
      desc: "Re-enforced chassis and heavy-duty wall supports for high-weight equipment like pizza ovens." 
    }
  ];

  return (
    <>
      <PageHeader
        title="Custom Food Trucks"
        subtitle="Industrial-grade fabrication meet culinary vision. We don't just build trucks; we engineer high-performance mobile kitchen assets."
      />

      {/* Intro Section - The Philosophy */}
      <Section className="bg-white overflow-hidden">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-6 space-y-8">
              <span className="text-primary font-bold tracking-widest uppercase text-[10px] mb-4 block underline decoration-secondary decoration-4 underline-offset-8">Engineering Philosophy</span>
              <h2 className="text-4xl md:text-6xl font-black uppercase text-secondary tracking-tighter leading-none mb-6">
                Redefining The <br/> <span className="text-primary italic">Mobile Kitchen</span>
              </h2>
              <p className="text-gray-500 text-xl font-light leading-relaxed">
                <AutoLinkedText text={introDescLinked} />
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                 <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl text-[10px] font-black uppercase text-secondary border border-gray-100">
                    <CheckCircle2 size={14} className="text-primary" /> Health Dept. Guaranteed
                 </div>
                 <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl text-[10px] font-black uppercase text-secondary border border-gray-100">
                    <CheckCircle2 size={14} className="text-primary" /> NFPA COMPLIANT
                 </div>
                 <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl text-[10px] font-black uppercase text-secondary border border-gray-100">
                    <CheckCircle2 size={14} className="text-primary" /> 2-YEAR WARRANTY
                 </div>
              </div>
            </div>
            <div className="lg:col-span-6 relative group">
               <div className="absolute -inset-4 bg-primary/20 rounded-[4rem] blur-3xl opacity-30 group-hover:opacity-50 transition-all duration-700"></div>
               <div className="relative aspect-square md:aspect-video lg:aspect-square rounded-[3rem] overflow-hidden shadow-2xl border border-secondary">
                  <Image 
                    src={philosophyHero.url} 
                    alt={philosophyHero.alt} 
                    fill 
                    className="object-cover group-hover:scale-110 transition-transform duration-[2000ms]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 to-transparent"></div>
                  <div className="absolute bottom-12 left-12 right-12 text-white">
                     <p className="text-sm font-light mb-2 italic">"Precision at every stage of the build process."</p>
                     <p className="text-xs font-black uppercase tracking-widest text-primary">— FABRICATION TEAM</p>
                  </div>
               </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Platform Options Section */}
      <Section className="bg-gray-50">
        <Container>
           <div className="mb-16">
              <span className="text-primary font-bold tracking-widest uppercase text-[10px] mb-4 block">Foundation Selection</span>
              <h2 className="text-3xl md:text-5xl font-black uppercase text-secondary tracking-tighter">
                Platform <span className="text-primary italic">Verticals</span>
              </h2>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {platforms.map((p, i) => (
                <div key={i} className="bg-white rounded-[3rem] overflow-hidden border border-gray-100 shadow-sm group hover:shadow-2xl transition-all duration-500">
                   <div className="relative h-64 overflow-hidden">
                      <Image 
                        src={p.image} 
                        alt={p.imageAlt || p.size} 
                        fill 
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute top-6 left-6 bg-secondary text-primary px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">
                         {p.size}
                      </div>
                   </div>
                   <div className="p-10 space-y-4">
                      <h3 className="text-xl font-black uppercase text-secondary tracking-tight">Ideal for: {p.ideal}</h3>
                      <p className="text-sm text-gray-500 font-light leading-relaxed">{p.advantage}</p>
                      <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                         <span className="text-[10px] font-black uppercase text-primary tracking-widest">Specs Included</span>
                         <ArrowRight size={16} className="text-secondary opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all" />
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </Container>
      </Section>

      {/* Engineering Excellence - Feature Grid */}
      <Section className="bg-secondary text-white overflow-hidden">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-5 space-y-12">
               <div>
                  <span className="text-primary font-bold tracking-widest uppercase text-xs mb-4 block">Industrial Bio-Sphere</span>
                  <h2 className="text-4xl text-black font-black uppercase tracking-tighter leading-tight mb-8">
                    The Engineering <br/> Core
                  </h2>
                  <p className="text-gray-400 font-light text-lg leading-relaxed">
                    Aesthetics are temporary, engineering is forever. We focus on the invisible systems that keep your business running when the heat is on.
                  </p>
               </div>
               
               <div className="grid grid-cols-1 gap-8">
                  {engineeringCore.map((core, i) => (
                    <div key={i} className="flex gap-6 group">
                       <div className="bg-white/10 w-16 h-16 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-secondary transition-all">
                          <core.icon size={28} />
                       </div>
                       <div className="space-y-2 flex-1">
                          <h4 className="text-lg font-black uppercase tracking-tight text-primary">{core.title}</h4>
                          <p className="text-xs text-gray-400 leading-relaxed font-light">{core.desc}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
            
            <div className="lg:col-span-7 relative">
               <div className="aspect-[4/5] md:aspect-square relative rounded-[4rem] overflow-hidden border-8 border-white/5">
                  <Image 
                    src={coreInterior.url} 
                    alt={coreInterior.alt} 
                    fill 
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-secondary/40 backdrop-blur-[2px]"></div>
                  
                  {/* Callout Pins for interactive feel */}
                  <div className="absolute top-1/4 left-1/3 group cursor-pointer">
                    <div className="w-8 h-8 bg-primary rounded-full animate-pulse shadow-xl shadow-primary/40 flex items-center justify-center text-secondary">
                        <Maximize2 size={16} />
                    </div>
                    <div className="absolute left-10 top-0 bg-white p-4 rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none w-48 border border-gray-100">
                        <p className="text-secondary font-black text-[10px] uppercase mb-1">Seamless Stainless</p>
                        <p className="text-gray-500 text-[9px] font-medium italic">Custom radius corners for easy cleaning and high hygiene standards.</p>
                    </div>
                  </div>

                  <div className="absolute bottom-1/3 right-1/4 group cursor-pointer">
                    <div className="w-8 h-8 bg-primary rounded-full animate-pulse shadow-xl shadow-primary/40 flex items-center justify-center text-secondary">
                        <Flame size={16} />
                    </div>
                    <div className="absolute right-10 bottom-0 bg-white p-4 rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none w-48 border border-gray-100">
                        <p className="text-secondary font-black text-[10px] uppercase mb-1">Class K Suppression</p>
                        <p className="text-gray-500 text-[9px] font-medium italic">Integrated fire safety systems tailored to your specific cooking line.</p>
                    </div>
                  </div>
               </div>
               
               <div className="absolute -bottom-8 -right-8 bg-primary text-secondary p-12 rounded-[3.5rem] shadow-2xl hidden md:block">
                  <div className="text-5xl font-black mb-2">100%</div>
                  <div className="text-[10px] font-black uppercase tracking-widest leading-tight opacity-70">Inspection Pass Rate <br/> Since 2018</div>
               </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Workflow & Architecture Section */}
      <Section className="bg-white">
        <Container>
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <span className="text-primary font-bold tracking-widest uppercase text-xs">Architectural Prowess</span>
            <h2 className="text-4xl md:text-6xl font-black uppercase text-secondary tracking-tighter leading-none">
              Workflow <span className="text-primary italic">Architecture</span>
            </h2>
            <p className="text-gray-500 text-lg font-light leading-relaxed max-w-2xl mx-auto">
              We design interiors using movement mapping. Every reach, every step, and every hand-off is optimized to reduce friction during peak hours. **Speed of service is built into the blueprint.**
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-12">
               <div className="space-y-4">
                  <div className="text-primary"><Layout size={40} className="mx-auto" /></div>
                  <h4 className="text-xl font-black uppercase text-secondary">Modular Prep Zones</h4>
                  <p className="text-sm text-gray-500 font-light">Interchangeable station layouts that grow with your menu evolution.</p>
               </div>
               <div className="space-y-4">
                  <div className="text-primary"><Smartphone size={40} className="mx-auto" /></div>
                  <h4 className="text-xl font-black uppercase text-secondary">Smart Integration</h4>
                  <p className="text-sm text-gray-500 font-light">Built-in mounting and power for POS, KDS, and outdoor digital menu boards.</p>
               </div>
               <div className="space-y-4">
                  <div className="text-primary"><HardHat size={40} className="mx-auto" /></div>
                  <h4 className="text-xl font-black uppercase text-secondary">Operator Safety</h4>
                  <p className="text-sm text-gray-500 font-light">Non-slip flooring, rounded counter tips, and advanced ventilation air-flow.</p>
               </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* FAQ Integration */}
      <FAQSection faqs={truckFaqs} />

      {/* Final CTA */}
      <section className="py-24 bg-secondary">
        <Container>
           <div className="relative rounded-[4rem] overflow-hidden bg-white p-12 md:p-24 shadow-2xl text-center md:text-left">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                 <div className="max-w-xl space-y-6">
                    <h3 className="text-3xl md:text-5xl font-black uppercase text-secondary tracking-tighter leading-tight">
                       Secure Your <span className="text-primary underline decoration-secondary decoration-8 underline-offset-8">Fabrication Slot</span>
                    </h3>
                    <p className="text-gray-500 text-lg font-light leading-relaxed">
                       Our build queue fills up quickly. Schedule your design consultation today to lock in your timeline and start your journey with Elite Steel.
                    </p>
                 </div>
                 <div className="flex flex-col gap-4">
                    <Link href="/quote" className="inline-flex items-center gap-3 bg-secondary text-white px-10 py-5 rounded-full font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-2xl">
                       Request Full Specs <ArrowRight size={18} />
                    </Link>
                    <Link href="/contact" className="text-center text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] hover:text-primary transition-all">
                       Or Call Our Engineering Team
                    </Link>
                 </div>
              </div>
           </div>
        </Container>
      </section>
    </>
  );
}

