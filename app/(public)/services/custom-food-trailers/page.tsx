import React from "react";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";
import FAQSection from "@/components/FAQSection";
import Image from "next/image";
import Link from "next/link";
import { 
  CheckCircle2, 
  Box, 
  DollarSign, 
  Maximize2, 
  Settings, 
  ChevronRight, 
  ArrowRight, 
  FastForward, 
  Anchor, 
  ShieldCheck, 
  Zap, 
  Compass,
  CornerUpRight,
  Monitor,
  PenTool,
  Hammer,
  BadgeCheck,
  Clock,
  Award,
  Truck,
  Coffee,
  IceCream,
  Flame,
  Pizza,
  UtensilsCrossed,
  Fish,
  type LucideIcon
} from "lucide-react";
import { getSEO, getPageSEO, getMediaAsset, getInternalLinkRules, getInternalLinkSettings } from "@/lib/db";
import { autoLinkMarkdown } from "@/lib/internalLinks";
import AutoLinkedText from "@/components/ui/AutoLinkedText";
import type { Metadata } from "next";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSEO();
  const pageSeo = await getPageSEO("custom-food-trailers");
  
  return {
    title: pageSeo?.title || `Elite Custom Food Trailers | Heavy Duty Fabrication`,
    description: pageSeo?.description || "Professional custom concession trailers. Engineered for stability, maximum volume, and long-term durability. Built for high-capacity culinary operations.",
    keywords: pageSeo?.keywords || seo.keywords,
    alternates: { canonical: '/services/custom-food-trailers' },
  };
}

export default async function CustomFoodTrailersPage() {
  const [rules, linkSettings] = await Promise.all([
    getInternalLinkRules(),
    getInternalLinkSettings(),
  ]);
  const activeRules = rules.filter(r => r.enabled !== false);
  const trailerFaqs = [
    {
      id: "cftr-faq-1",
      question: "What is a custom food trailer?",
      answer:
        "A custom food trailer is a mobile kitchen designed and built around your menu, equipment, workflow, and business needs.",
    },
    {
      id: "cftr-faq-2",
      question: "Do you build concession trailers for different types of businesses?",
      answer:
        "Yes. We build custom concession trailers for businesses such as coffee, BBQ, dessert, catering, and other mobile food concepts.",
    },
    {
      id: "cftr-faq-3",
      question: "Are your food trailers designed with health and safety requirements in mind?",
      answer:
        "Yes. We consider applicable health, electrical, plumbing, ventilation, gas, and fire-safety requirements during the design and build process.",
    },
    {
      id: "cftr-faq-4",
      question: "How long does a custom food truck build take?",
      answer:
        "A typical ground-up build takes between 8 to 12 weeks, depending on the complexity of the design and equipment lead times. We prioritize quality fabrication to ensure your kitchen is built to last.",
    },
  ];

  const introDescRaw = "A custom concession trailer from Elite Steel Concepts offers the highest ROI in the mobile food industry. More square footage for equipment and staff, without the engine maintenance of a truck. Learn about our custom food truck conversions or request an itemized build quote.";
  const introDescLinked = autoLinkMarkdown(introDescRaw, activeRules, linkSettings).updatedContent;

  // Dynamic Assets
  const trailerHero = await getMediaAsset("custom-food-trailers", "hero", "https://images.pexels.com/photos/4393021/pexels-photo-4393021.jpeg?auto=compress&cs=tinysrgb&w=1200");
  const trailerDetail = await getMediaAsset("custom-food-trailers", "fabrication_detail", "https://images.pexels.com/photos/1855214/pexels-photo-1855214.jpeg?auto=compress&cs=tinysrgb&w=1200");
  const platformPod = await getMediaAsset("custom-food-trailers", "platform_pod", "https://images.pexels.com/photos/2577274/pexels-photo-2577274.jpeg?auto=compress&cs=tinysrgb&w=800");
  const platformWorkhorse = await getMediaAsset("custom-food-trailers", "platform_workhorse", "https://images.pexels.com/photos/2955819/pexels-photo-2955819.jpeg?auto=compress&cs=tinysrgb&w=800");
  const platformTitan = await getMediaAsset("custom-food-trailers", "platform_titan", "https://images.pexels.com/photos/4393021/pexels-photo-4393021.jpeg?auto=compress&cs=tinysrgb&w=800");
  const ctaBackground = await getMediaAsset("custom-food-trailers", "cta_background", "https://images.pexels.com/photos/1855214/pexels-photo-1855214.jpeg?auto=compress&cs=tinysrgb&w=1200");

  const trailerPlatforms = [
    { 
      size: "10-14ft Pod", 
      ideal: "Specialty Coffee, Juices, Desserts", 
      advantage: "The ultimate solution for high-margin, low-footprint business models.",
      image: platformPod.url,
      imageAlt: platformPod.alt
    },
    { 
      size: "18-24ft Workhorse", 
      ideal: "Full Commercial Kitchens, BBQ Porches", 
      advantage: "Maximum interior volume for multi-chef lines and heavy equipment.",
      image: platformWorkhorse.url,
      imageAlt: platformWorkhorse.alt
    },
    { 
      size: "26ft+ Event Titan", 
      ideal: "Catering operations, Festival high-volume", 
      advantage: "Dual-axle stability for mobile kitchens that never quit.",
      image: platformTitan.url,
      imageAlt: platformTitan.alt
    }
  ];

  const trailerIntel = [
    { 
      icon: Anchor, 
      title: "Chassis Engineering", 
      desc: "Reinforced steel frames with dual-axle configurations and electric braking systems for safe towing." 
    },
    { 
      icon: Maximize2, 
      title: "Vertical Optimization", 
      desc: "Higher ceiling clearances and custom storage systems that outclass standard truck dimensions." 
    },
    { 
      icon: Zap, 
      title: "Thermal Efficiency", 
      desc: "Triple-insulated walls and high-capacity AC systems to keep staff comfortable in extreme environments." 
    },
    { 
      icon: Compass, 
      title: "Strategic Towing", 
      desc: "Optimized weight distribution for better fuel economy and reduced wear on your tow vehicle." 
    }
  ];

  const trailerTypes: {
    title: string;
    color: string;
    accent: string;
    icon: LucideIcon;
  }[] = [
    { title: "Coffee Trailer", color: "#4E342E", accent: "#EFEBE9", icon: Coffee },
    { title: "Dessert Trailer", color: "#D81B60", accent: "#FCE4EC", icon: IceCream },
    { title: "BBQ Trailer", color: "#5D4037", accent: "#EFEBE9", icon: Flame },
    { title: "Pizza Trailer", color: "#E53935", accent: "#FFEBEE", icon: Pizza },
    { title: "Halal Food Trailer", color: "#2E7D32", accent: "#E8F5E9", icon: UtensilsCrossed },
    { title: "Seafood Trailer", color: "#00838F", accent: "#E0F7FA", icon: Fish },
  ];

  const whyUs = [
    { icon: PenTool, title: "Custom & Professional Designs" },
    { icon: Hammer, title: "Quality Craftsmanship" },
    { icon: BadgeCheck, title: "Built to Code" },
    { icon: Clock, title: "8–12 Week Build Time" },
    { icon: Award, title: "1-Year Structural Warranty" },
    { icon: Truck, title: "Shipping Across 48 States" },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Food Trailer Services"
        title="Custom Food Trailer"
        subtitle="Get a custom food trailer that fits your business"
        className="!pb-10 md:!pb-12"
      />

      {/* Custom Concession Trailer Types */}
      <Section className="!py-10 md:!py-14 bg-white border-b border-gray-100">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-8 md:mb-10">
            <h2 className="text-2xl md:text-4xl font-black uppercase text-black tracking-tighter leading-tight">
              Custom Concession Trailer Types ESC Build
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 max-w-6xl mx-auto">
            {trailerTypes.map((type, index) => (
              <div
                key={type.title}
                className="group relative flex flex-col items-center text-center border-2 border-dashed border-primary/40 hover:border-primary bg-white hover:bg-primary/[0.04] transition-all duration-300 px-5 py-8 md:px-6 md:py-10 hover:shadow-md overflow-hidden"
              >
                {/* Trailer on road */}
                <div className="relative mb-5 md:mb-6 w-full max-w-[240px] pt-4 h-[100px]">
                  {/* Animated road dashes */}
                  <svg
                    viewBox="0 0 240 20"
                    className="absolute bottom-0 left-0 w-full h-5"
                    aria-hidden
                  >
                    <line
                      x1="0"
                      y1="10"
                      x2="480"
                      y2="10"
                      className="stroke-primary/50 road-scroll"
                      strokeWidth="2"
                      strokeDasharray="10 8"
                      style={{ animationDelay: `${index * 0.15}s` }}
                    />
                  </svg>

                  {/* Moving trailer + badge */}
                  <div
                    className="truck-drive absolute bottom-3 left-0 right-0 flex justify-center"
                    style={{ animationDelay: `${index * 0.35}s` }}
                  >
                    <div className="relative w-[200px]">
                      <svg viewBox="0 0 200 78" className="w-full h-auto drop-shadow-md" aria-hidden>
                        {/* Body */}
                        <rect x="8" y="14" width="150" height="44" rx="6" fill={type.color} />
                        {/* Accent roof stripe */}
                        <rect x="8" y="14" width="150" height="5" rx="2" fill="#F7931E" />
                        {/* Awning */}
                        <path d="M40 24h66l4 7H36z" fill="#F7931E" />
                        <path d="M50 24h10l1 7H49zM72 24h10l1 7H71zM94 24h10l2 7H95z" fill="#ffffff" opacity="0.85" />
                        {/* Service window */}
                        <rect x="40" y="31" width="66" height="16" rx="1.5" fill={type.accent} />
                        {/* Door */}
                        <rect x="124" y="24" width="22" height="30" rx="1.5" fill="rgba(0,0,0,0.22)" />
                        <circle cx="141" cy="40" r="1.6" fill="#F7931E" />
                        {/* Fender line */}
                        <rect x="8" y="52" width="150" height="3" fill="rgba(0,0,0,0.2)" />
                        {/* Hitch / A-frame tongue */}
                        <path d="M158 50 L190 56 M158 58 L190 56" stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round" />
                        <circle cx="192" cy="56" r="4" fill="#F7931E" />
                        <rect x="172" y="56" width="3" height="10" fill="#1a1a1a" />
                        {/* Wheels (dual axle) */}
                        <circle cx="66" cy="62" r="10" fill="#1a1a1a" />
                        <circle cx="66" cy="62" r="4.5" fill="#F7931E" />
                        <circle cx="92" cy="62" r="10" fill="#1a1a1a" />
                        <circle cx="92" cy="62" r="4.5" fill="#F7931E" />
                      </svg>

                      {/* Food icon badge */}
                      <div className="absolute -top-3 left-[6%] size-10 sm:size-11 rounded-full bg-white border-[2.5px] border-primary flex items-center justify-center shadow-md">
                        <type.icon
                          size={20}
                          strokeWidth={2.25}
                          style={{ color: type.color }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <h3 className="text-sm md:text-base font-black uppercase tracking-wide text-black leading-snug">
                  {type.title}
                </h3>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Why Entrepreneurs Pick Us */}
      <Section className="!py-10 md:!py-14 bg-white relative overflow-hidden border-b border-gray-100">
        <Container className="relative z-10">
          <div className="text-center max-w-4xl mx-auto space-y-4 mb-8 md:mb-10">
              <h2 className="text-2xl md:text-4xl font-black uppercase text-secondary tracking-tighter leading-tight">
                Why Entrepreneurs Pick Elite Steel Concepts for Custom Food Trailer Builder
              </h2>
              <p className="text-gray-500 text-lg font-light leading-relaxed max-w-3xl mx-auto">
                Elite Steel Concepts makes it simple to turn your idea into a real mobile kitchen. As experienced concession trailer manufacturers, we create custom trailers customized to your menu, equipment, space, and brand, so your trailer works the way you need it to.
              </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-200 border border-gray-200 max-w-6xl mx-auto">
              {whyUs.map((item, i) => (
                <div key={item.title} className="relative bg-white p-8 group hover:bg-secondary transition-colors duration-500">
                  <div className="absolute top-0 left-0 h-1 w-0 bg-primary group-hover:w-full transition-all duration-500" />
                  <div className="flex items-start justify-between mb-8">
                    <div className="w-12 h-12 bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-secondary transition-colors duration-500">
                      <item.icon size={22} />
                    </div>
                    <span className="text-4xl font-black text-gray-300 group-hover:text-primary/60 transition-colors duration-500 leading-none">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-secondary group-hover:text-white transition-colors duration-500 leading-snug">
                    {item.title}
                  </h3>
                </div>
              ))}
          </div>
        </Container>
      </Section>

      {/* CTA — after Why Entrepreneurs Pick Us */}
      <section className="relative py-10 md:py-12 bg-[#0a0a0a] overflow-hidden border-y border-[#1a1a1a]">
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
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase text-white tracking-tighter leading-[0.95] mb-5">
            Ready to Build Your Custom Food Trailer?
          </h2>

          <p className="text-gray-400 text-base md:text-lg font-medium leading-relaxed max-w-2xl mx-auto mb-8">
            Contact Elite Steel Concepts today to discuss your custom concession
            trailer project or request a free quote.
          </p>

          <Link
            href="/quote"
            className="inline-flex items-center justify-center gap-3 bg-primary text-black px-10 py-5 font-black uppercase tracking-[0.2em] text-[10px] hover:bg-orange-600 hover:text-white transition-colors shadow-[0_0_40px_rgba(247,147,30,0.25)]"
          >
            Get a Free Quote <ArrowRight size={14} />
          </Link>
        </Container>
      </section>

      {/* Hidden sections: Hero Breakdown, Trailer Foundations, Towing Intelligence, Interior Dynamics
      -- Hero Breakdown --
      <Section className="bg-white overflow-hidden">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
             <div className="lg:col-span-7 relative group">
                <div className="absolute -inset-4 bg-primary/20 rounded-[4rem] blur-3xl opacity-30 group-hover:opacity-50 transition-all duration-1000"></div>
                <div className="relative aspect-video lg:aspect-square rounded-[3rem] overflow-hidden shadow-2xl border border-secondary/20">
                   <Image 
                     src={trailerHero.url} 
                     alt={trailerHero.alt} 
                     fill 
                     className="object-cover group-hover:scale-105 transition-transform duration-[2000ms]"
                   />
                   <div className="absolute inset-0 bg-gradient-to-r from-secondary/60 via-transparent to-transparent"></div>
                   <div className="absolute top-12 left-12">
                      <div className="bg-primary text-secondary px-6 py-3 rounded-2xl shadow-xl flex items-center gap-3">
                         <ShieldCheck size={24} />
                         <span className="text-xs font-black uppercase tracking-widest">Built For Duty</span>
                      </div>
                   </div>
                </div>
             </div>
             <div className="lg:col-span-5 space-y-10">
                <div className="space-y-4">
                   <span className="text-primary font-bold tracking-widest uppercase text-[10px] block decoration-secondary decoration-4 underline-offset-8">Concession Intelligence</span>
                   <h2 className="text-4xl md:text-5xl font-black uppercase text-secondary tracking-tighter leading-tight">
                     Volume & <br/> <span className="text-primary italic">Precision</span>
                   </h2>
                   <p className="text-gray-500 text-lg font-light leading-relaxed">
                     <AutoLinkedText text={introDescLinked} />
                   </p>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                   {['Dual-Axle Stability', 'Porch & Smoker Builds', 'NSF-Certified Plumbing', 'High-Load Suspension'].map((item) => (
                     <div key={item} className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100 font-black uppercase text-[10px] text-secondary tracking-widest shadow-sm">
                        <CheckCircle2 size={16} className="text-primary" /> {item}
                     </div>
                   ))}
                </div>
             </div>
          </div>
        </Container>
      </Section>

      -- Specialized Platforms --
      <Section className="bg-gray-50">
        <Container>
           <div className="max-w-3xl mb-16">
              <span className="text-primary font-bold tracking-widest uppercase text-[10px] mb-4 block">Foundation Architecture</span>
              <h2 className="text-3xl md:text-5xl font-black uppercase text-secondary tracking-tighter">
                Trailer <span className="text-primary italic">Foundations</span>
              </h2>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {trailerPlatforms.map((p, i) => (
                <div key={i} className="bg-white rounded-[3rem] overflow-hidden border border-gray-100 shadow-sm group hover:shadow-2xl transition-all duration-500 flex flex-col">
                   <div className="relative h-60 overflow-hidden">
                      <Image 
                        src={p.image} 
                        alt={p.imageAlt || p.size} 
                        fill 
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-secondary/10"></div>
                      <div className="absolute bottom-6 left-6">
                         <span className="bg-secondary text-primary px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">{p.size}</span>
                      </div>
                   </div>
                   <div className="p-10 space-y-4 flex-grow">
                      <h3 className="text-xl font-black uppercase text-secondary tracking-tight">Best Use: {p.ideal}</h3>
                      <p className="text-sm text-gray-500 font-light leading-relaxed">{p.advantage}</p>
                   </div>
                   <div className="p-10 pt-0">
                      <Link href="/quote" className="flex items-center gap-2 text-[10px] font-black uppercase text-primary tracking-widest group/btn">
                         Explore Build Paths <ArrowRight size={14} className="group-hover/btn:translate-x-2 transition-transform" />
                      </Link>
                   </div>
                </div>
              ))}
           </div>
        </Container>
      </Section>

      -- Towing Intelligence & System Integration --
      <Section className="bg-secondary text-white relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
               <path d="M0 100 L100 0 L100 100 Z" fill="currentColor"></path>
            </svg>
         </div>
         <Container>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
               <div className="space-y-12">
                  <div className="space-y-6">
                     <span className="text-primary font-bold tracking-widest uppercase text-xs block">Engineering Core</span>
                     <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-tight italic">
                        The Towing <br/> <span className="text-primary">Intelligence</span>
                     </h2>
                     <p className="text-gray-400 font-light text-xl leading-relaxed max-w-lg">
                        We don't just build kitchens; we build vehicles. Every trailer is balanced for optimal center-of-gravity.
                     </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                     {trailerIntel.map((intel, i) => (
                       <div key={i} className="space-y-4 group">
                          <div className="bg-white/10 w-14 h-14 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-secondary transition-all">
                             <intel.icon size={28} />
                          </div>
                          <h4 className="text-lg font-black uppercase tracking-tight">{intel.title}</h4>
                          <p className="text-xs text-gray-400 leading-relaxed font-light">{intel.desc}</p>
                       </div>
                     ))}
                  </div>
               </div>
               
               <div className="relative">
                  <div className="aspect-[3/4] rounded-[4rem] overflow-hidden border-4 border-white/10 relative group">
                     <Image 
                       src={trailerDetail.url} 
                       alt={trailerDetail.alt} 
                       fill 
                       className="object-cover opacity-80"
                     />
                     <div className="absolute inset-0 bg-secondary/30"></div>
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <div className="bg-primary text-secondary p-8 rounded-full shadow-2xl animate-pulse">
                           <Monitor size={40} />
                        </div>
                     </div>
                  </div>
                  <div className="absolute -top-10 -right-10 bg-white p-10 rounded-[3rem] shadow-2xl hidden lg:block">
                     <div className="text-secondary">
                        <div className="text-4xl font-black mb-1">20-FT</div>
                        <div className="text-[10px] font-black uppercase tracking-widest opacity-50">Operational Line <br/> (Typical Yield)</div>
                     </div>
                  </div>
               </div>
            </div>
         </Container>
      </Section>

      -- Operational Dynamics --
      <Section className="bg-white">
        <Container>
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
              <div className="lg:col-span-12 text-center max-w-4xl mx-auto space-y-6">
                 <h2 className="text-4xl md:text-5xl font-black uppercase text-secondary tracking-tighter leading-tight">
                    Interior <span className="text-primary italic">Dynamics</span>
                 </h2>
                 <p className="text-gray-500 text-lg font-light leading-relaxed">
                    Trailer builds allow for specialized floor plans that are impossible in a truck. From massive hood systems to open-concept smoker porches, your workflow defines the layout.
                 </p>
              </div>
              
              <div className="lg:col-span-4 p-8 bg-gray-50 rounded-[3rem] border border-gray-100 hover:border-primary transition-all group">
                 <div className="bg-white w-14 h-14 rounded-2xl shadow-sm flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                    <Maximize2 size={24} />
                 </div>
                 <h4 className="text-xl font-black uppercase text-secondary tracking-tight mb-4">Volume Optimized</h4>
                 <p className="text-sm text-gray-500 font-light leading-relaxed">Wider wheel wells and custom storage bins to keep prep surfaces clear during high-volume rush hours.</p>
              </div>

              <div className="lg:col-span-4 p-8 bg-gray-50 rounded-[3rem] border border-gray-100 hover:border-primary transition-all group">
                 <div className="bg-white w-14 h-14 rounded-2xl shadow-sm flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                    <Settings size={24} />
                 </div>
                 <h4 className="text-xl font-black uppercase text-secondary tracking-tight mb-4">Custom Porches</h4>
                 <p className="text-sm text-gray-500 font-light leading-relaxed">Integrated rear or side porches for smokers, pizza ovens, or secure generator storage systems.</p>
              </div>

              <div className="lg:col-span-4 p-8 bg-gray-50 rounded-[3rem] border border-gray-100 hover:border-primary transition-all group">
                 <div className="bg-white w-14 h-14 rounded-2xl shadow-sm flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                    <CornerUpRight size={24} />
                 </div>
                 <h4 className="text-xl font-black uppercase text-secondary tracking-tight mb-4">Dual Entries</h4>
                 <p className="text-sm text-gray-500 font-light leading-relaxed">Separate service and supply doors to maintain health safety standards and efficient restock cycles.</p>
              </div>
           </div>
        </Container>
      </Section>
      */}

      {/* Trailer specific FAQs */}
      <FAQSection faqs={trailerFaqs} plainHeading />

      {/* Hidden: CTA Section
      -- CTA Section --
      <section className="py-24 bg-white border-t border-gray-100">
        <Container>
           <div className="relative rounded-[4rem] overflow-hidden bg-secondary text-white p-12 md:p-24 shadow-2xl">
              <div className="absolute inset-0">
                 <Image 
                   src={ctaBackground.url} 
                   alt={ctaBackground.alt || "Elite Steel Team"} 
                   fill 
                   className="object-cover opacity-10"
                 />
                 <div className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary to-transparent"></div>
              </div>
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                 <div className="max-w-xl space-y-6">
                    <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-tight">
                       Build Your <span className="text-primary">Custom Concession</span> Hub
                    </h3>
                    <p className="text-gray-400 text-lg font-light leading-relaxed">
                       From conceptual CAD to physical metal, we engineer the foundation of your success. Get a detailed fabrication quote within 24 hours.
                    </p>
                 </div>
                 <div className="flex flex-col gap-6">
                    <Link href="/quote" className="inline-flex items-center gap-3 bg-primary text-secondary px-10 py-5 rounded-full font-black uppercase tracking-widest text-xs hover:bg-white transition-all shadow-2xl">
                       Start Your Quote <ArrowRight size={18} />
                    </Link>
                    <div className="flex items-center gap-4 text-[10px] font-black uppercase text-gray-500 tracking-widest pl-4">
                       <FastForward size={14} className="text-primary"/> 8-Week Typical Build Time
                    </div>
                 </div>
              </div>
           </div>
        </Container>
      </section>
      */}
    </>
  );
}

