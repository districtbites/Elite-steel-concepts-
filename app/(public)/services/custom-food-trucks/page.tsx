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
  Smartphone,
  PenTool,
  Award,
  Clock,
  MapPin,
} from "lucide-react";
import { getSEO, getPageSEO, getMediaAsset, getInternalLinkRules, getInternalLinkSettings } from "@/lib/db";
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
  const [rules, linkSettings] = await Promise.all([
    getInternalLinkRules(),
    getInternalLinkSettings(),
  ]);
  const activeRules = rules.filter(r => r.enabled !== false);
  const truckFaqs = [
    {
      id: "cft-faq-1",
      question: "How long does it take to build a custom food truck?",
      answer:
        "ECS typical build time is around 8–12 weeks, depending on the design, equipment, and customization required for your project.",
    },
    {
      id: "cft-faq-2",
      question: "Can I add my own cooking equipment?",
      answer:
        "Yes. Your food truck can be designed around the equipment you already have or the equipment you plan to install.",
    },
    {
      id: "cft-faq-3",
      question: "Do you build food trucks for new businesses?",
      answer:
        "Yes. Whether you're launching your first food truck or expanding an established food business, we can build a mobile kitchen around your business needs.",
    },
    {
      id: "cft-faq-4",
      question: "Can you help with the food truck design?",
      answer:
        "Yes. The Elite Steel Concepts expert team can help create a practical layout that makes it easier to prepare, cook, store, and serve food while using your available space efficiently.",
    },
    {
      id: "cft-faq-5",
      question: "Do you offer custom branding and exterior designs?",
      answer:
        "Yes. ESC can customize your truck with exterior finishes and branding elements to help create a professional look for your food business.",
    },
    {
      id: "cft-faq-6",
      question: "What makes a custom food truck different from a standard food truck?",
      answer:
        "A custom food truck is designed around your specific business needs. You can select the layout, equipment, storage, serving setup, branding, and other features instead of working with a one-size-fits-all design.",
    },
  ];

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

  const truckTypes = [
    "Asian Food Truck",
    "BBQ Truck",
    "American Food Truck",
    "Chicken Food Truck",
    "Coffee Food Truck",
    "Dessert Food Truck",
    "Halal Food Truck",
    "Mexican Food Truck",
    "Pizza Food Truck",
    "Seafood Food Truck",
    "Soul Food Truck",
  ];

  const whyChoosePoints = [
    { title: "Custom & Professional Designs", icon: PenTool },
    { title: "Quality Craftsmanship", icon: Award },
    { title: "Built to Code", icon: ShieldCheck },
    { title: "8–12 Week Build Time", icon: Clock },
    { title: "1-Year Structural Warranty", icon: HardHat },
    { title: "Shipping Across 48 States", icon: MapPin },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Food Truck Services"
        title="Custom Food Trucks"
        subtitle="Build a Food Truck That Fits Your Business"
        className="!pb-10 md:!pb-12"
      />

      {/* Custom Food Truck Types */}
      <Section className="!py-10 md:!py-14 bg-white border-b border-gray-100">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-6 md:mb-8">
            <div className="inline-flex items-center justify-center gap-3 mb-3">
              <div className="h-px w-8 bg-primary" />
              <span className="text-primary text-xs font-black uppercase tracking-[0.25em]">
                Food Truck Concepts
              </span>
              <div className="h-px w-8 bg-primary" />
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black uppercase text-black tracking-tight leading-tight mb-2">
              Custom Food Trucks
            </h2>
            <p className="text-gray-500 text-base md:text-lg font-medium leading-relaxed">
              Build a Food Truck That Fits Your Business
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 max-w-6xl mx-auto">
            {truckTypes.map((type) => (
              <div
                key={type}
                className="group relative flex items-center justify-center min-h-[96px] sm:min-h-[110px] md:min-h-[128px] border-2 border-dashed border-primary/50 bg-white hover:border-primary hover:bg-primary/5 transition-all duration-300 px-3 py-5"
              >
                <span className="text-center text-xs sm:text-sm md:text-base font-black uppercase tracking-wide text-primary group-hover:text-black transition-colors leading-snug">
                  {type}
                </span>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Why Entrepreneurs Choose ESC */}
      <Section className="!py-10 md:!py-14 bg-gray-50/80 border-b border-gray-100">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-6 md:mb-8">
            <div className="inline-flex items-center justify-center gap-3 mb-3">
              <div className="h-px w-8 bg-primary" />
              <span className="text-primary text-xs font-black uppercase tracking-[0.25em]">
                Why Choose ESC
              </span>
              <div className="h-px w-8 bg-primary" />
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase text-black tracking-tight leading-tight mb-4">
              Why Entrepreneurs Choose{" "}
              <span className="text-primary">Elite Steel Concepts</span> for
              Custom Food Truck Builds
            </h2>
            <p className="text-gray-600 text-base md:text-lg font-medium leading-relaxed">
              Elite Steel Concepts makes it simple to turn your idea into a real
              mobile kitchen. As{" "}
              <Link
                href="/about"
                className="text-primary font-semibold underline underline-offset-2 hover:text-orange-600 transition-colors"
              >
                experienced food truck builders
              </Link>
              , we create custom trucks around your menu, equipment, space, and
              brand so your truck works the way you need it to.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-200 border border-gray-200 max-w-5xl mx-auto">
            {whyChoosePoints.map((point) => (
              <div
                key={point.title}
                className="group relative bg-white hover:bg-gray-50 transition-colors p-6 md:p-8 flex flex-col items-center text-center"
              >
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                <div className="w-12 h-12 mb-4 bg-primary/10 border border-primary/20 group-hover:bg-primary group-hover:border-primary flex items-center justify-center transition-colors">
                  <point.icon
                    size={22}
                    className="text-primary group-hover:text-white transition-colors"
                  />
                </div>
                <h3 className="text-sm md:text-base font-black uppercase text-black tracking-wide leading-snug group-hover:text-primary transition-colors">
                  {point.title}
                </h3>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Luxury CTA — after Why Choose ESC */}
      <section className="relative py-12 md:py-16 bg-[#0a0a0a] overflow-hidden border-y border-[#1a1a1a]">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, #fff 0px, #fff 1px, transparent 1px, transparent 12px)",
          }}
        />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-80" />
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[480px] h-[480px] bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        <Container className="relative z-10 text-center max-w-4xl">
          <div className="inline-flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-8 bg-primary" />
            <span className="text-primary text-[10px] font-black uppercase tracking-[0.3em]">
              Start Your Build
            </span>
            <div className="h-px w-8 bg-primary" />
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase text-white tracking-tighter leading-[0.95] mb-5">
            Ready to Build Your{" "}
            <span className="text-primary">Custom Food Truck?</span>
          </h2>

          <p className="text-gray-400 text-base md:text-lg font-medium leading-relaxed max-w-2xl mx-auto mb-8">
            Contact Elite Steel Concepts today to discuss your custom food truck
            project or request a free quote.
          </p>

          <Link
            href="/quote"
            className="inline-flex items-center justify-center gap-3 bg-primary text-black px-10 py-5 font-black uppercase tracking-[0.2em] text-[10px] hover:bg-orange-600 hover:text-white transition-colors shadow-[0_0_40px_rgba(247,147,30,0.25)]"
          >
            Get a Free Quote <ArrowRight size={14} />
          </Link>
        </Container>
      </section>

      {/* Intro Section - The Philosophy */}
      <Section className="!py-10 md:!py-14 bg-white overflow-hidden border-b border-gray-100">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-primary font-bold tracking-widest uppercase text-[10px] mb-3 block underline decoration-secondary decoration-4 underline-offset-8">Engineering Philosophy</span>
              <h2 className="text-3xl md:text-5xl font-black uppercase text-secondary tracking-tighter leading-none mb-4">
                Redefining The <br/> <span className="text-primary italic">Mobile Kitchen</span>
              </h2>
              <p className="text-gray-500 text-lg font-light leading-relaxed">
                <AutoLinkedText text={introDescLinked} />
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
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
      <Section className="!py-10 md:!py-14 bg-gray-50 border-b border-gray-100">
        <Container>
           <div className="mb-8 md:mb-10">
              <span className="text-primary font-bold tracking-widest uppercase text-[10px] mb-3 block">Foundation Selection</span>
              <h2 className="text-3xl md:text-5xl font-black uppercase text-secondary tracking-tighter">
                Platform <span className="text-primary italic">Verticals</span>
              </h2>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
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
      <Section className="!py-10 md:!py-14 bg-secondary text-white overflow-hidden border-y border-[#1a1a1a]">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            <div className="lg:col-span-5 space-y-8">
               <div>
                  <span className="text-primary font-bold tracking-widest uppercase text-xs mb-3 block">Industrial Bio-Sphere</span>
                  <h2 className="text-3xl md:text-4xl text-black font-black uppercase tracking-tighter leading-tight mb-5">
                    The Engineering <br/> Core
                  </h2>
                  <p className="text-gray-400 font-light text-base md:text-lg leading-relaxed">
                    Aesthetics are temporary, engineering is forever. We focus on the invisible systems that keep your business running when the heat is on.
                  </p>
               </div>
               
               <div className="grid grid-cols-1 gap-6">
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
      <Section className="!py-10 md:!py-14 bg-white border-b border-gray-100">
        <Container>
          <div className="max-w-4xl mx-auto text-center space-y-5 md:space-y-6">
            <span className="text-primary font-bold tracking-widest uppercase text-xs">Architectural Prowess</span>
            <h2 className="text-3xl md:text-5xl font-black uppercase text-secondary tracking-tighter leading-none">
              Workflow <span className="text-primary italic">Architecture</span>
            </h2>
            <p className="text-gray-500 text-base md:text-lg font-light leading-relaxed max-w-2xl mx-auto">
              We design interiors using movement mapping. Every reach, every step, and every hand-off is optimized to reduce friction during peak hours. **Speed of service is built into the blueprint.**
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 pt-6 md:pt-8">
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
    </>
  );
}

