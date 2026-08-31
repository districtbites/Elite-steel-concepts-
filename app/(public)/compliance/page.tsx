import type { Metadata } from "next";
import Link from "next/link";
import { 
  ShieldCheck, 
  MapPin, 
  ArrowRight, 
  Flame, 
  Droplets,
  AlertTriangle,
  ClipboardCheck,
  Building2,
  FileText
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

  const heroDescRaw = "Failing a health inspection means losing weeks of revenue. Elite Steel Concepts engineers 100% health code compliance into every custom food truck and concession trailer build. Use this hub to navigate the complex web of municipal codes across Washington DC, Maryland, and Virginia.";
  const heroDescLinked = autoLinkMarkdown(heroDescRaw, activeRules, linkSettings).updatedContent;

  const costDescRaw = "Generic, out-of-state builders often construct 'pretty boxes' that immediately fail Department of Health (DOH) inspections in the DMV area. When you buy from Elite Steel Concepts, you are buying a guarantee of regional compliance, fire suppression installation, and first-time inspection pass.";
  const costDescLinked = autoLinkMarkdown(costDescRaw, activeRules, linkSettings).updatedContent;

  return (
    <>
      {/* ─── HERO ──────────────────────────────────────────────── */}
      <section className="relative bg-[#0a0a0a] text-white pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "repeating-linear-gradient(45deg, #fff 0px, #fff 1px, transparent 1px, transparent 10px)" }} />
        <div className="absolute top-0 right-0 w-[40%] h-full bg-primary/5 skew-x-[-12deg] origin-top-right pointer-events-none" />
        
        <Container>
          <div className="relative z-10 max-w-4xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-12 bg-primary" />
              <span className="text-primary text-xs font-black uppercase tracking-[0.25em]">
                The Compliance Hub
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9] mb-8">
              DMV Health & Fire <br/>
              <span className="text-primary">Code Regulations</span>
            </h1>
            <p className="text-gray-400 text-lg md:text-xl leading-relaxed mb-10 max-w-2xl font-light">
              <AutoLinkedText text={heroDescLinked} />
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#dc-codes" className="inline-flex items-center justify-center gap-2 border border-white/20 hover:border-primary hover:text-primary text-white font-black uppercase tracking-wider text-xs px-6 py-4 transition-all">
                DC Codes
              </a>
              <a href="#md-codes" className="inline-flex items-center justify-center gap-2 border border-white/20 hover:border-primary hover:text-primary text-white font-black uppercase tracking-wider text-xs px-6 py-4 transition-all">
                MD Codes
              </a>
              <a href="#va-codes" className="inline-flex items-center justify-center gap-2 border border-white/20 hover:border-primary hover:text-primary text-white font-black uppercase tracking-wider text-xs px-6 py-4 transition-all">
                VA Codes
              </a>
            </div>
          </div>
        </Container>
      </section>

      {/* ─── WHY COMPLIANCE MATTERS ────────────────────────────── */}
      <section className="bg-white py-20 border-b border-gray-100">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="md:col-span-1">
              <h2 className="text-3xl font-black text-black uppercase tracking-tighter leading-tight mb-4">
                The Cost of <br/><span className="text-primary">Non-Compliance</span>
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                <AutoLinkedText text={costDescLinked} />
              </p>
            </div>
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-red-50 text-red-500 flex items-center justify-center shrink-0">
                  <AlertTriangle size={24} />
                </div>
                <div>
                  <h3 className="font-black text-black uppercase tracking-tight mb-2">Permitting Delays</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">Failing an initial inspection can result in a 30-45 day wait for a re-inspection, costing thousands in lost daily revenue.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
                  <Flame size={24} />
                </div>
                <div>
                  <h3 className="font-black text-black uppercase tracking-tight mb-2">Fire Marshal Fines</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">Improperly installed exhaust hoods and lack of certified Ansul systems can lead to immediate shutdown by local Fire Marshals.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                  <Droplets size={24} />
                </div>
                <div>
                  <h3 className="font-black text-black uppercase tracking-tight mb-2">Plumbing Violations</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">Insufficient gray water retention (must be 15% larger than fresh water capacity in most counties) is the #1 reason trucks fail.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-50 text-green-500 flex items-center justify-center shrink-0">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h3 className="font-black text-black uppercase tracking-tight mb-2">The ESC Guarantee</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">Every truck we build is engineered specifically for the county you plan to operate in. If it fails due to our fabrication, we fix it free.</p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ─── DC CODES ──────────────────────────────────────────── */}
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
              {/* Requirement Cards */}
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

      {/* ─── MARYLAND CODES ────────────────────────────────────── */}
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

      {/* ─── VIRGINIA CODES ────────────────────────────────────── */}
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

      {/* ─── CTA ───────────────────────────────────────────────── */}
      <CTASection 
        title="Stop Guessing. Build With The Experts."
        subtitle="Don't risk your capital on a builder who doesn't understand your local codes. We guarantee compliance."
        buttonText="Get a Free Consultation"
        buttonHref="/quote"
      />
    </>
  );
}
