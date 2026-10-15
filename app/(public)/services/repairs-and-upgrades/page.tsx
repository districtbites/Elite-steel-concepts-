import React from "react";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";
import CTASection from "@/components/ui/CTASection";
import { Wrench, Zap, Droplets, Wind, Flame, CookingPot, Hammer, Paintbrush, Check, ClipboardCheck, ScanSearch, Lightbulb, ArrowRight } from "lucide-react";
import { getSEO, getPageSEO } from "@/lib/db";
import type { Metadata } from "next";
import PageJsonLd from "@/components/PageJsonLd";

const repairServices = [
  {
    icon: Zap,
    title: "Electrical Repairs & Upgrades",
    intro: "We can diagnose and address electrical issues involving:",
    points: [
      "Outlets and electrical connections",
      "Interior and exterior lighting",
      "Shore-power connections",
      "Electrical system upgrades",
      "Generator-related electrical connections",
    ],
  },
  {
    icon: Droplets,
    title: "Plumbing & Water Systems",
    intro: "We can diagnose and address plumbing and water issues involving:",
    points: [
      "Sinks and plumbing lines",
      "Water heaters",
      "Water pumps",
      "Freshwater tanks",
      "Wastewater tanks",
      "Plumbing repairs and modifications",
    ],
  },
  {
    icon: Flame,
    title: "Propane System Repairs",
    intro: "We can repair and upgrade components of your propane system, including:",
    points: [
      "Propane lines",
      "Regulators",
      "Shutoff valves",
      "Tank cages",
      "Related propane system modifications",
    ],
  },
  {
    icon: Wind,
    title: "Hood & Ventilation Repairs",
    intro: "Proper ventilation is essential for a functional commercial kitchen. Our services include:",
    points: [
      "Hood repairs and upgrades",
      "Exhaust and ventilation improvements",
      "Hood fan repairs",
      "Ventilation modifications",
      "Coordination of fire-suppression work when required",
    ],
  },
  {
    icon: CookingPot,
    title: "Equipment Installation & Replacement",
    intro: "Need to replace outdated or damaged kitchen equipment? We can help with:",
    points: [
      "Equipment installation",
      "Equipment replacement",
      "Equipment swaps",
      "Kitchen equipment layout changes",
      "Workflow-focused modifications",
    ],
  },
  {
    icon: Hammer,
    title: "Interior Repairs & Rebuilds",
    intro: "We can repair or modify key areas inside your mobile kitchen, including:",
    points: [
      "Walls and ceilings",
      "Flooring",
      "Insulation",
      "Countertops",
      "Interior finishes",
      "Rebuilds required for specific inspection needs",
    ],
  },
  {
    icon: Paintbrush,
    title: "Exterior Updates & Branding",
    intro: "Your food truck or trailer is part of your brand. We can assist with modifications such as:",
    points: [
      "Exterior wrap and branding updates",
      "Concession window improvements",
      "Door replacements or modifications",
      "Generator cabinet work",
      "Exterior fabrication",
    ],
  },
  {
    icon: Wrench,
    title: "Custom Fabrication & Welding",
    intro: "Our fabrication and welding repair capabilities include:",
    points: [
      "Custom stainless-steel fabrication",
      "Cabinets and shelving",
      "Stainless-steel work surfaces",
      "Welding and structural modifications",
      "Concession windows",
      "Doors and access points",
      "Generator cabinets",
      "Custom kitchen components",
    ],
  },
];

const processSteps = [
  { icon: ClipboardCheck, title: "Assess", text: "We inspect your truck or trailer and review your existing setup." },
  { icon: ScanSearch, title: "Identify", text: "We pinpoint what's failing, outdated or slowing down your workflow." },
  { icon: Lightbulb, title: "Recommend", text: "We suggest the repairs and upgrades that fit your business needs." },
  { icon: Wrench, title: "Upgrade", text: "Our team completes the work so your kitchen runs more efficiently." },
];

// Cached and regenerated every 5 minutes, or immediately when the admin saves changes (revalidatePath).
export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSEO();
  const pageSeo = await getPageSEO("repairs-and-upgrades");
  
  return {
    title: pageSeo?.title || `Repairs & Upgrades | ${seo.siteTitle}`,
    description: pageSeo?.description || seo.description,
    keywords: pageSeo?.keywords || seo.keywords,
    alternates: { canonical: '/services/repairs-and-upgrades' },
  };
}

export default async function RepairsAndUpgradesPage() {
  return (
    <>
      <PageJsonLd pageId="repairs-and-upgrades" />
      <PageHeader
        title="Repairs & Upgrades for Food Trucks & Trailers"
        subtitle="Repair. Upgrade. We’ve Got You Covered."
        normalCaseSubtitle
      />

      {/* What ESC Fixes */}
      <Section className="bg-gray-50! py-14! md:py-20!">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-10 md:mb-12">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-2 h-2 bg-primary" />
              <p className="text-primary font-black uppercase tracking-[0.2em] text-xs">What ESC Fixes</p>
              <div className="w-2 h-2 bg-primary" />
            </div>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-black leading-none">
              ESC Food Truck & Trailer Repair Services
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {repairServices.map((service) => (
              <div
                key={service.title}
                className="group relative bg-white border border-gray-200 p-7 flex flex-col hover:border-primary hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="absolute top-0 left-0 h-1 w-full bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
                <div className="w-14 h-14 bg-[#0a0a0a] text-primary flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-black transition-colors">
                  <service.icon size={26} />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight text-black leading-tight mb-3">
                  {service.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-5">{service.intro}</p>
                <ul className="space-y-3">
                  {service.points.map((point) => (
                    <li key={point} className="flex items-start gap-3 text-sm font-medium text-gray-800">
                      <span className="mt-0.5 w-5 h-5 shrink-0 rounded-full bg-primary/15 text-primary flex items-center justify-center">
                        <Check size={12} strokeWidth={3} />
                      </span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Repair Process */}
      <Section className="relative overflow-hidden py-14! md:py-20!">
        <Container className="relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-10 md:mb-12">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-black leading-none mb-6">
              Repair & Upgrade Solutions Built Around Your Mobile Kitchen
            </h2>
            <p className="text-gray-600 text-base md:text-lg leading-relaxed">
              We assess your existing setup, understand your business needs, and recommend repairs or upgrades that make your mobile kitchen more functional and efficient.
            </p>
          </div>

          <ol className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
            {/* Connector line + arrows between steps (desktop) */}
            <div className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] border-t-2 border-dashed border-primary/50" aria-hidden="true" />
            {[25, 50, 75].map((pos) => (
              <div
                key={pos}
                className="hidden lg:flex absolute top-10 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white border border-primary/50 text-primary shadow-sm items-center justify-center"
                style={{ left: `${pos}%` }}
                aria-hidden="true"
              >
                <ArrowRight size={14} />
              </div>
            ))}

            {processSteps.map((step, i) => (
              <li key={step.title} className="group relative text-center px-2">
                <div className="relative w-20 h-20 mx-auto mb-7 rounded-full bg-white">
                  <div className="w-full h-full flex items-center justify-center rounded-full bg-primary/10 border-2 border-primary text-primary group-hover:bg-primary group-hover:text-black transition-colors">
                    <step.icon size={30} />
                  </div>
                  <span className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-primary text-black text-xs font-black flex items-center justify-center ring-4 ring-white">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tight text-black mb-3">{step.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed max-w-[240px] mx-auto">{step.text}</p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <CTASection
        title="Ready to Upgrade Your Food Truck?"
        subtitle="Tell us about your food truck or trailer, the problems you're experiencing, and the upgrades you're considering. Our expert team will assess the project and help determine the next steps."
        buttonText="Get a Free Quote"
        buttonHref="/quote"
      />
    </>
  );
}
