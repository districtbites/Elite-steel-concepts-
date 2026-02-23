import React from "react";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";
import CTASection from "@/components/ui/CTASection";
import { Workflow, FileCode, ShieldCheck } from "lucide-react";
import { getSEO, getPageSEO } from "@/lib/db";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSEO();
  const pageSeo = await getPageSEO("design-and-consultation");
  
  return {
    title: pageSeo?.title || `Design & Consultation | ${seo.siteTitle}`,
    description: pageSeo?.description || seo.description,
    keywords: pageSeo?.keywords || seo.keywords,
  };
}

export default function DesignAndConsultationPage() {
  return (
    <>
      <PageHeader
        title="Design & Consultation"
        subtitle="A successful food truck starts with a smart design. Our team works with you to optimize workflow, ensure code compliance, and maximize output."
      />

      <Section className="bg-white">
        <Container>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {[
                {
                  icon: Workflow,
                  title: "Workflow Analysis",
                  desc: "We analyze your menu and volume to design a kitchen flow that minimizes steps and maximizes speed."
                },
                {
                  icon: FileCode,
                  title: "3D / CAD Layouts",
                  desc: "Visualize your truck before build begins. We provide professional CAD drawings for Health Department submission."
                },
                {
                  icon: ShieldCheck,
                  title: "Health Code Expert",
                  desc: "Navigate complex regulations with confidence. We ensure your build meets local health and fire codes."
                },
              ].map((item, i) => (
                <div key={i} className="border-l-4 border-primary pl-6 py-4 hover:bg-gray-50 transition-colors rounded-r-xl">
                  <div className="bg-primary/10 p-3 rounded-full inline-block mb-4 text-primary">
                    <item.icon size={28} />
                  </div>
                  <h3 className="text-xl font-black uppercase text-secondary mb-3 tracking-tight">{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
           </div>

           <div className="bg-gray-50 p-8 md:p-12 rounded-xl border border-gray-100 text-center">
             <h3 className="text-2xl font-black uppercase text-secondary mb-4 tracking-tight">Why Design Matters</h3>
             <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
               A well-designed kitchen layout can increase your output by 30% or more. From reducing steps between stations to ensuring proper ventilation flow, every detail counts. Our design consultations have helped hundreds of entrepreneurs avoid costly mistakes and build more efficient kitchens.
             </p>
           </div>
        </Container>
      </Section>

      <CTASection
        title="Book a Consultation"
        subtitle="Get expert guidance on your mobile kitchen design. Let's build something optimized for your success."
        buttonText="Contact Us"
        buttonHref="/contact"
      />
    </>
  );
}
