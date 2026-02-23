import React from "react";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";
import { getPageSEO, getSEO, getSettings } from "@/lib/db";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSEO();
  const pageSeo = await getPageSEO("privacy");
  
  return {
    title: pageSeo?.title || `Privacy Policy | ${seo.siteTitle}`,
    description: pageSeo?.description || seo.description,
    keywords: pageSeo?.keywords || seo.keywords,
  };
}

export default async function PrivacyPage() {
  const pageSeo = await getPageSEO("privacy");
  const settings = await getSettings();
  const sections = pageSeo.sections || {};

  const lastUpdated = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <>
      <PageHeader
        title={sections.header?.title || "Privacy Protocol"}
        subtitle={sections.header?.subtitle || "How we collect, use, and protect your information at Elite Steel Concepts."}
      />

      <Section className="bg-white">
        <Container className="max-w-4xl">
          <div className="prose prose-lg max-w-none text-gray-600">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12 pb-6 border-b border-gray-100">
               <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-[0.3em]">
                  Document Revision: {lastUpdated}
               </p>
               <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-secondary">Active Compliance</span>
               </div>
            </div>

            <section className="mb-12">
               <h2 className="text-3xl font-black text-secondary uppercase mb-6 tracking-tighter flex items-center gap-4">
                  <span className="w-8 h-8 bg-primary text-secondary flex items-center justify-center rounded-lg text-sm">01</span>
                  {sections.content?.title || "Information Governance"}
               </h2>
               <p className="text-lg leading-relaxed font-light">
                  {sections.content?.content || (
                    <>At <strong className="text-secondary font-bold">Elite Steel Concepts</strong>, we respect your privacy and are committed to protecting the personal data you share with us. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website.</>
                  )}
               </p>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
               <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
                  <h3 className="text-sm font-black uppercase text-secondary mb-6 tracking-widest flex items-center gap-2">
                     <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                     Collection Vectors
                  </h3>
                  <ul className="space-y-4">
                     {["In-bound Quote Requests", "Project Consultation Forms", "Email Communications", "Analytics & Pixels"].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-sm font-bold text-gray-500">
                           <div className="w-1 h-1 rounded-full bg-gray-300"></div> {item}
                        </li>
                     ))}
                  </ul>
               </div>
               <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
                  <h3 className="text-sm font-black uppercase text-secondary mb-6 tracking-widest flex items-center gap-2">
                     <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                     Utilization
                  </h3>
                  <ul className="space-y-4">
                     {["Accuracy in Fabrication Quotes", "Workflow Customization", "Safety & Compliance Notifications", "Security Auditing"].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-sm font-bold text-gray-500">
                           <div className="w-1 h-1 rounded-full bg-gray-300"></div> {item}
                        </li>
                     ))}
                  </ul>
               </div>
            </section>

            <section className="mb-16 space-y-10">
               <div>
                  <h2 className="text-xl font-black text-secondary uppercase mb-4 tracking-tight">Data Sovereignty</h2>
                  <p className="font-light">We do not sell, trade, or otherwise transfer your personal information to outside parties. This does not include trusted partners who assist in operating our environment, provided they maintain strict confidentiality.</p>
               </div>
               <div>
                  <h2 className="text-xl font-black text-secondary uppercase mb-4 tracking-tight">Technical Safeguards</h2>
                  <p className="font-light">We implement multi-layered security protocols to maintain the safety of your information. While we strive for 100% protection, digital transmission carries inherent risks we mitigate through regular audits.</p>
               </div>
            </section>

            <section className="bg-secondary rounded-[2.5rem] p-10 text-white relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl -mr-16 -mt-16"></div>
               <h2 className="text-xl font-black uppercase mb-8 tracking-tighter relative z-10 text-primary">Master Contact Interface</h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                  <div className="space-y-1">
                     <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Corporate Entity</p>
                     <p className="font-bold text-lg">Elite Steel Concepts</p>
                  </div>
                  <div className="space-y-1">
                     <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Global Email</p>
                     <p className="font-bold text-lg">{settings.email}</p>
                  </div>
                  <div className="space-y-1 md:col-span-2">
                     <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Physical Headquarters</p>
                     <p className="font-bold">{settings.address}</p>
                  </div>
               </div>
            </section>
          </div>
        </Container>
      </Section>
    </>
  );
}
