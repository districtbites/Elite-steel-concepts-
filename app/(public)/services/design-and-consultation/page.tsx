import React from "react";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";
import CTASection from "@/components/ui/CTASection";
import { Workflow, FileCode, ShieldCheck, CookingPot, MessagesSquare, ClipboardList, PencilRuler, RefreshCw, ArrowRight } from "lucide-react";
import { getSEO, getPageSEO } from "@/lib/db";
import type { Metadata } from "next";

const designServices = [
  { icon: Workflow, title: "Workflow & Kitchen Layout Planning" },
  { icon: FileCode, title: "Professional 3D & CAD Layouts" },
  { icon: ShieldCheck, title: "Health & Fire Code Planning" },
  { icon: CookingPot, title: "Equipment Selection & Space Optimization" },
];

const consultationSteps = [
  { icon: MessagesSquare, title: "Discuss Your Concept", text: "We learn about your food business idea, menu, target customers, and operational goals." },
  { icon: ClipboardList, title: "Evaluate Your Requirements", text: "We review your space, equipment needs, workflow, utilities, and relevant compliance considerations." },
  { icon: PencilRuler, title: "Develop Your Layout", text: "We plan a practical kitchen arrangement and, where appropriate, prepare CAD drawings for review." },
  { icon: RefreshCw, title: "Review & Refine", text: "We work through design details with you to address concerns and finalize the proposed layout before the next stage." },
];

// Cached and regenerated every 5 minutes, or immediately when the admin saves changes (revalidatePath).
export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSEO();
  const pageSeo = await getPageSEO("design-and-consultation");
  
  return {
    title: pageSeo?.title || `Design & Consultation | ${seo.siteTitle}`,
    description: pageSeo?.description || seo.description,
    keywords: pageSeo?.keywords || seo.keywords,
    alternates: { canonical: '/services/design-and-consultation' },
  };
}

export default async function DesignAndConsultationPage() {
  return (
    <>
      <PageHeader
        title="Design & Consultation Service"
        subtitle="Smart Custom Food Truck & Trailer Design Starts With the Right Plan Consultation"
        normalCaseSubtitle
      />

      {/* Design & Consultation Services */}
      <Section className="bg-gray-50! py-14! md:py-20!">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-10 md:mb-12">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-black leading-none mb-5">
              Our Food Truck & Trailer Design & Consultation Services
            </h2>
            <p className="text-gray-600 text-base md:text-lg leading-relaxed">
              Plan your mobile kitchen with expert guidance from our custom food builders and design team.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {designServices.map(({ icon: Icon, title }) => (
              <div
                key={title}
                className="group relative bg-white border border-gray-200 p-7 flex flex-col items-center text-center hover:border-primary hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="absolute top-0 left-0 h-1 w-full bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
                <div className="w-16 h-16 bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                  <Icon size={28} />
                </div>
                <h3 className="text-lg font-black uppercase tracking-tight text-black leading-tight">{title}</h3>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Design & Consultation Process */}
      <Section className="py-14! md:py-20!">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-10 md:mb-14">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-black leading-none">
              Our Design & Consultation Process
            </h2>
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

            {consultationSteps.map((step, i) => (
              <li key={step.title} className="group relative text-center px-2">
                <div className="relative w-20 h-20 mx-auto mb-7 rounded-full bg-white">
                  <div className="w-full h-full flex items-center justify-center rounded-full bg-primary/10 border-2 border-primary text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <step.icon size={30} />
                  </div>
                  <span className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-primary text-black text-xs font-black flex items-center justify-center ring-4 ring-white">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <p className="text-primary font-black uppercase tracking-[0.25em] text-[11px] mb-2">Step {i + 1}</p>
                <h3 className="text-xl font-black uppercase tracking-tight text-black leading-tight mb-3">{step.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed max-w-[260px] mx-auto">{step.text}</p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>


      <CTASection
        title="Book a Design Consultation Today"
        subtitle="Get expert design guidance and a free consultation to plan an efficient, functional food truck and trailer."
        buttonText="Get a Free Quote"
        buttonHref="/quote"
      />
    </>
  );
}
