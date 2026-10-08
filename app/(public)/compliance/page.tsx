import type { Metadata } from "next";
import Link from "next/link";
import { 
  ShieldCheck, 
  MapPin, 
  ArrowRight, 
  Flame, 
  Droplets,
  ClipboardCheck,
  Building2,
  FileText,
  Zap,
  Wind,
  ChefHat,
  Refrigerator,
  Workflow
} from "lucide-react";
import Container from "@/components/ui/Container";
import CTASection from "@/components/ui/CTASection";
import { getInternalLinkRules, getInternalLinkSettings } from "@/lib/db";
import { autoLinkMarkdown } from "@/lib/internalLinks";
import AutoLinkedText from "@/components/ui/AutoLinkedText";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: "DMV Food Truck Compliance Hub | Health & Fire Codes",
  description: "The ultimate guide to Washington DC, Maryland, and Virginia food truck health department codes, fire suppression requirements, and commissary kitchen regulations.",
  keywords: "food truck compliance, DMV health codes, DC food truck requirements, Maryland food truck permit, Virginia VDH mobile food unit",
};

export default async function ComplianceHub() {
  const [rules, linkSettings] = await Promise.all([
    getInternalLinkRules(),
    getInternalLinkSettings(),
  ]);
  const activeRules = rules.filter(r => r.enabled !== false);

  const heroDescRaw = "Building a custom food truck or trailer requires more than installing kitchen equipment. Your mobile kitchen may need to meet applicable health, plumbing, electrical, sanitation, fire-safety, and local food-service requirements before it can operate.";
  const heroDescLinked = autoLinkMarkdown(heroDescRaw, activeRules, linkSettings).updatedContent;

  const whyDescRaw = "The right requirements start with the design compliance, which can affect almost every part of a mobile kitchen, from handwashing and dishwashing sinks to water systems, wastewater, equipment placement, food-preparation areas, and electrical systems.";

  const whyDesc2Raw = "Understanding these requirements before fabrication can help you plan the right layout and avoid unnecessary design changes later. As a custom food truck builder, Elite Steel Concepts considers the requirements that may apply to your project based on your planned operation and location.";

  const locationDescRaw = "Custom food truck starts with knowing where you plan to operate. Health, safety, plumbing, fire, and mobile food requirements can vary between states, counties, cities, and local authorities.";
  const locationDescLinked = autoLinkMarkdown(locationDescRaw, activeRules, linkSettings).updatedContent;

  const locationDesc2Raw = "Your location, menu, equipment, and type of food operation can all affect the requirements that apply to your mobile kitchen. A food truck operating in Virginia may have different requirements from one operating in Maryland or Washington, DC. At Elite Steel Concepts, we build custom food trucks and trailers throughout the DMV region with applicable location-specific requirements in mind.";
  const locationDesc2Linked = autoLinkMarkdown(locationDesc2Raw, activeRules, linkSettings).updatedContent;

  const considerations = [
    { icon: Droplets, bg: "bg-blue-50", fg: "text-blue-500", title: "Plumbing & Water Systems", desc: "We plan water, sinks, wastewater, and related plumbing around the requirements of your mobile kitchen and intended food operation." },
    { icon: Zap, bg: "bg-yellow-50", fg: "text-yellow-600", title: "Electrical Systems", desc: "We plan your electrical layout and power needs around the equipment used in your mobile kitchen." },
    { icon: Wind, bg: "bg-gray-100", fg: "text-gray-600", title: "Ventilation & Exhaust", desc: "We consider your cooking equipment, menu, and kitchen layout when planning ventilation and exhaust." },
    { icon: Flame, bg: "bg-orange-50", fg: "text-orange-500", title: "Gas & Fire Safety Considerations", desc: "We consider gas systems, equipment placement, and applicable fire-safety requirements throughout the build." },
  ];

  const buildChecks = [
    { icon: ChefHat, title: "Your Menu", desc: "We review what you plan to cook and serve to understand the type of kitchen and food-preparation setup you need." },
    { icon: Refrigerator, title: "Your Equipment", desc: "We consider your cooking equipment, refrigeration, sinks, storage, and other essential systems when planning the kitchen layout." },
    { icon: MapPin, title: "Your Operating Location", desc: "We consider where you plan to operate because food truck regulations and health requirements can vary by state, county, and local authority." },
    { icon: Workflow, title: "Your Kitchen Workflow", desc: "We plan the layout around how your team will prepare, cook, store, and serve food inside the truck or trailer." },
    { icon: ClipboardCheck, title: "Applicable Requirements", desc: "We consider the relevant health, sanitation, plumbing, electrical, ventilation, and fire-safety requirements that may apply to your build." },
  ];

  return (
    <>
      {/* ─── HERO ──────────────────────────────────────────────── */}
      <section className="relative bg-[#0a0a0a] text-white pt-32 pb-12 md:pt-40 md:pb-16 overflow-hidden border-b border-[#1a1a1a]">
        {/* Same grid background + top accent line as PageHeader */}
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "repeating-linear-gradient(0deg, #fff 0px, #fff 1px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, #fff 0px, #fff 1px, transparent 1px, transparent 40px)" }} />
        <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
        
        <Container>
          <div className="relative z-10 max-w-5xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-px w-12 bg-primary" />
              <h1 className="text-primary text-xs font-black uppercase tracking-[0.25em]">
                Smart Compliance Planning
              </h1>
              <div className="h-px w-12 bg-primary" />
            </div>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight leading-tight mb-6 max-w-5xl mx-auto">
              Food Truck & Trailer Compliance &{" "}
              Custom Build Requirements
            </h2>
            <p className="text-gray-400 text-lg md:text-xl leading-relaxed mb-10 max-w-2xl mx-auto font-light">
              <AutoLinkedText text={heroDescLinked} />
            </p>
            <Link
              href="/quote"
              className="inline-flex items-center justify-center gap-3 bg-primary text-black px-10 py-5 font-black uppercase tracking-[0.2em] text-[10px] hover:bg-orange-600 hover:text-white transition-colors shadow-[0_0_40px_rgba(247,147,30,0.25)]"
            >
              Start Your Custom Build <ArrowRight size={14} />
            </Link>
          </div>
        </Container>
      </section>

      {/* ─── WHY COMPLIANCE MATTERS ────────────────────────────── */}
      <section className="bg-white py-10 md:py-14">
        <Container>
          <div className="text-center max-w-4xl mx-auto space-y-4">
            <h2 className="text-2xl md:text-4xl font-black uppercase text-black tracking-tighter leading-tight">
              Why Food Truck Compliance Matters
            </h2>
            <p className="text-gray-600 text-base leading-relaxed max-w-3xl mx-auto">
              {whyDescRaw}
            </p>
            <p className="text-gray-600 text-base leading-relaxed max-w-3xl mx-auto">
              {whyDesc2Raw}
            </p>
          </div>
        </Container>
      </section>

      {/* ─── WHAT ESC CONSIDERS ────────────────────────────────── */}
      <section className="bg-white py-10 md:py-14">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-8 md:mb-10">
            <h2 className="text-2xl md:text-4xl font-black uppercase text-black tracking-tighter leading-tight mb-3">
              What ESC Considers in Mobile Kitchen Compliances
            </h2>
            <p className="text-gray-500 text-base leading-relaxed">
              We consider key health, safety, plumbing, electrical, and food-service requirements when designing your custom mobile kitchen.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {considerations.map((item) => (
              <div key={item.title} className="flex items-start gap-4">
                <div className={`w-12 h-12 ${item.bg} ${item.fg} flex items-center justify-center shrink-0`}>
                  <item.icon size={24} />
                </div>
                <div>
                  <h3 className="font-black text-black uppercase tracking-tight mb-2">{item.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ─── COMPLIANCE STARTS WITH YOUR LOCATION ─────────────── */}
      <section className="bg-white py-10 md:py-14">
        <Container>
          <div className="text-center max-w-4xl mx-auto mb-8 md:mb-10">
            <h2 className="text-2xl md:text-4xl font-black uppercase text-black tracking-tighter leading-tight mb-3">
              Food Truck Compliance Starts With Your Location
            </h2>
            <p className="text-gray-500 text-base md:text-lg font-medium">
              Different Locations, Different Requirements
            </p>
          </div>

          <div className="max-w-3xl mx-auto text-center space-y-4 mb-8 md:mb-10">
            <p className="text-gray-600 text-base leading-relaxed">
              <AutoLinkedText text={locationDescLinked} />
            </p>
            <p className="text-gray-600 text-base leading-relaxed">
              <AutoLinkedText text={locationDesc2Linked} />
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {["Virginia", "Maryland", "Washington, DC"].map((region) => (
                <div
                  key={region}
                  className="group flex items-center gap-4 bg-white border border-gray-200 hover:border-primary px-5 py-4 transition-colors duration-300"
                >
                  <div className="w-11 h-11 bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-black transition-colors duration-300">
                    <MapPin size={20} />
                  </div>
                  <span className="font-black uppercase tracking-tight text-black text-sm md:text-base">
                    {region}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ─── WHAT ESC CHECKS BEFORE BUILD ──────────────────────── */}
      <section className="relative bg-white text-black py-10 md:py-14 overflow-hidden">

        <Container className="relative z-10">
          <div className="text-center max-w-4xl mx-auto mb-8 md:mb-10">
            <h2 className="text-2xl md:text-4xl font-black uppercase text-black tracking-tighter leading-tight mb-3">
              What Elite Steel Concept Checks Before Building Your Trailer
            </h2>
            <p className="text-gray-500 text-base md:text-lg font-medium">
              Key Details We Consider for Your Mobile Kitchen Compliance
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-5 max-w-6xl mx-auto">
            {buildChecks.map((item, i) => (
              <div
                key={item.title}
                className="group relative w-full sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)] bg-white border border-gray-200 hover:border-primary hover:shadow-lg p-7 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute top-0 left-0 h-1 w-0 bg-primary group-hover:w-full transition-all duration-500" />
                <div className="flex items-start justify-between mb-6">
                  <div className="w-12 h-12 bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-black transition-colors duration-300">
                    <item.icon size={22} />
                  </div>
                  <span className="text-4xl font-black leading-none text-gray-300 group-hover:text-primary transition-colors duration-300">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="text-base md:text-lg font-black uppercase tracking-tight text-black mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Hidden: DC, Maryland, Virginia code sections
      -- ─── DC CODES ──────────────────────────────────────────── --
      <section id="dc-codes" className="py-24 bg-[#0a0a0a] text-white">
        <Container>
          <div className="flex flex-col lg:flex-row gap-16">
            <div className="lg:w-1/3">
              <div className="sticky top-24">
                <div className="w-16 h-16 bg-white/5 border border-white/10 flex items-center justify-center mb-6 text-primary">
                  <Building2 size={32} />
                </div>
                <h2 className="text-4xl font-black uppercase tracking-tighter mb-4">Washington DC</h2>
                <p className="text-gray-400 text-sm leading-relaxed mb-8">
                  The District of Columbia Department of Health (DC Health) maintains some of the most rigorous Mobile Food Vendor regulations on the East Coast. Navigating DCRA and DOH simultaneously requires precise engineering.
                </p>
                <div className="p-6 bg-primary/10 border border-primary/20">
                  <h4 className="text-xs font-black uppercase tracking-widest text-primary mb-2">Crucial DC Metric</h4>
                  <p className="text-sm font-medium">All mobile units operating in DC must have a Depôt (Commissary) agreement filed with DC Health prior to inspection.</p>
                </div>
              </div>
            </div>
            <div className="lg:w-2/3 space-y-8">
              -- Requirement Cards --
              <div className="bg-[#111] border border-[#222] p-8 hover:border-primary/50 transition-colors">
                <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-3 mb-4">
                  <Droplets className="text-primary" size={20} /> Water Capacity Ratios
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  DC Health requires strict adherence to water holding ratios to prevent street dumping.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-sm text-gray-300">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 shrink-0" />
                    Potable (Fresh) water tank must be adequately sized for the menu type (min. 15-30 gallons depending on operation).
                  </li>
                  <li className="flex items-start gap-3 text-sm text-gray-300">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 shrink-0" />
                    Wastewater (Gray) tank MUST be sized exactly 15% larger than the total fresh water capacity.
                  </li>
                  <li className="flex items-start gap-3 text-sm text-gray-300">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 shrink-0" />
                    Water heater must be capable of generating 120°F water constantly for the 3-compartment sink.
                  </li>
                </ul>
              </div>

              <div className="bg-[#111] border border-[#222] p-8 hover:border-primary/50 transition-colors">
                <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-3 mb-4">
                  <Flame className="text-primary" size={20} /> Fire & Exhaust (FEMS)
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  DC Fire and EMS requires specific commercial hood systems for any truck producing grease-laden vapors.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-sm text-gray-300">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 shrink-0" />
                    Type 1 Commercial Exhaust Hood is mandatory if operating fryers, flat tops, or grills.
                  </li>
                  <li className="flex items-start gap-3 text-sm text-gray-300">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 shrink-0" />
                    Ansul R-102 (or equivalent) wet chemical fire suppression system must be installed and certified.
                  </li>
                  <li className="flex items-start gap-3 text-sm text-gray-300">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 shrink-0" />
                    Propane tanks must be securely mounted on the exterior with DOT compliance and crash protection.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </section>

      -- ─── MARYLAND CODES ────────────────────────────────────── --
      <section id="md-codes" className="py-24 bg-white text-black border-y border-gray-200">
        <Container>
          <div className="flex flex-col lg:flex-row gap-16">
            <div className="lg:w-1/3">
              <div className="sticky top-24">
                <div className="w-16 h-16 bg-gray-100 border border-gray-200 flex items-center justify-center mb-6 text-primary">
                  <MapPin size={32} />
                </div>
                <h2 className="text-4xl font-black uppercase tracking-tighter mb-4">Maryland (MD)</h2>
                <p className="text-gray-600 text-sm leading-relaxed mb-8">
                  Maryland does not have a single statewide permit; instead, food trucks must be permitted at the county level (e.g., Montgomery County, Prince George's County, Baltimore City). Each has specific nuances.
                </p>
              </div>
            </div>
            <div className="lg:w-2/3 space-y-8">
              <div className="bg-gray-50 border border-gray-200 p-8 hover:border-primary/30 transition-colors">
                <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-3 mb-4">
                  <ClipboardCheck className="text-primary" size={20} /> Montgomery County Specifics
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-sm text-gray-700">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 shrink-0" />
                    Requires highly detailed, scaled floor plan schematics submitted prior to physical inspection.
                  </li>
                  <li className="flex items-start gap-3 text-sm text-gray-700">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 shrink-0" />
                    All equipment MUST bear the NSF (National Sanitation Foundation) certification mark.
                  </li>
                  <li className="flex items-start gap-3 text-sm text-gray-700">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 shrink-0" />
                    Surfaces (walls, floors, ceilings) must be smooth, durable, easily cleanable, and non-absorbent (FRP or Stainless Steel walls required).
                  </li>
                </ul>
              </div>

              <div className="bg-gray-50 border border-gray-200 p-8 hover:border-primary/30 transition-colors">
                <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-3 mb-4">
                  <FileText className="text-primary" size={20} /> Baltimore & PG County
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-sm text-gray-700">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 shrink-0" />
                    Baltimore City mandates strict adherence to the City Fire Code regarding placement of fryers away from egress doors.
                  </li>
                  <li className="flex items-start gap-3 text-sm text-gray-700">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 shrink-0" />
                    Prince George's County requires specific Base of Operations (Commissary) licensing and itinerary submittals.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </section>

      -- ─── VIRGINIA CODES ────────────────────────────────────── --
      <section id="va-codes" className="py-24 bg-[#050505] text-white">
        <Container>
          <div className="flex flex-col lg:flex-row gap-16">
            <div className="lg:w-1/3">
              <div className="sticky top-24">
                <div className="w-16 h-16 bg-white/5 border border-white/10 flex items-center justify-center mb-6 text-primary">
                  <ShieldCheck size={32} />
                </div>
                <h2 className="text-4xl font-black uppercase tracking-tighter mb-4">Virginia (VDH)</h2>
                <p className="text-gray-400 text-sm leading-relaxed mb-8">
                  The Virginia Department of Health (VDH) categorizes food trucks as "Mobile Food Units." Because our fabrication shop is located in Manassas, VA, we have mastered the VDH requirements for Fairfax, Arlington, Loudoun, and Prince William counties.
                </p>
              </div>
            </div>
            <div className="lg:w-2/3 space-y-8">
              <div className="bg-[#111] border border-[#222] p-8 hover:border-primary/50 transition-colors">
                <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-3 mb-4">
                  <Droplets className="text-primary" size={20} /> Sanitation & Plumbing
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-sm text-gray-300">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 shrink-0" />
                    Hand-washing sink must be separate from the 3-compartment sink, easily accessible, and equipped with splash guards.
                  </li>
                  <li className="flex items-start gap-3 text-sm text-gray-300">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 shrink-0" />
                    VDH mandates specific backflow prevention devices (vacuum breakers) on all water inlets.
                  </li>
                </ul>
              </div>
              <div className="bg-[#111] border border-[#222] p-8 hover:border-primary/50 transition-colors">
                <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-3 mb-4">
                  <Building2 className="text-primary" size={20} /> Exterior & Mobility
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-sm text-gray-300">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 shrink-0" />
                    Serving windows must be equipped with screens (at least 16 mesh) or air curtains to prevent pests.
                  </li>
                  <li className="flex items-start gap-3 text-sm text-gray-300">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 shrink-0" />
                    Power sources (generators) must be isolated from food prep areas to prevent carbon monoxide contamination.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </section>
      */}

      {/* ─── CTA ───────────────────────────────────────────────── */}
      <CTASection 
        title="Ready to Plan Your Build With the Right Compliance?"
        subtitle="Build With Confidence. Start With Right Compliance."
        buttonText="Request a Free Quote"
        buttonHref="/quote"
      />
    </>
  );
}
