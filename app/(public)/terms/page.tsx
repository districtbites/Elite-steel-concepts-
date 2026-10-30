import React from "react";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";
import { getPageSEO, getSEO, getSettings } from "@/lib/db";
import type { Metadata } from "next";
import PageJsonLd from "@/components/PageJsonLd";
import { getSections } from "@/lib/pageContent";
import {
  TERMS_HEADER,
  TERMS_CONTENT,
  TERMS_PILLARS,
  TERMS_STANDARDS,
  TERMS_INQUIRY,
} from "@/lib/pageContent/pages/terms";

// Cached and regenerated every 5 minutes, or immediately when the admin saves changes (revalidatePath).
export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSEO();
  const pageSeo = await getPageSEO("terms");
  
  return {
    title: pageSeo?.title || `Terms of Service | ${seo.siteTitle}`,
    description: pageSeo?.description || seo.description,
    keywords: pageSeo?.keywords || seo.keywords,
    alternates: { canonical: '/terms' },
  };
}

export default async function TermsPage() {
  const [settings, [header, content, pillars, standards, inquiry]] = await Promise.all([
    getSettings(),
    getSections([TERMS_HEADER, TERMS_CONTENT, TERMS_PILLARS, TERMS_STANDARDS, TERMS_INQUIRY] as const),
  ]);

  const lastUpdated = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <>
      <PageJsonLd pageId="terms" />
      <PageHeader
        title={header.title}
        subtitle={header.subtitle}
      />

      <Section className="bg-white">
        <Container className="max-w-4xl">
          <div className="prose prose-lg max-w-none text-gray-600">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12 pb-6 border-b border-gray-100">
               <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-[0.3em]">
                  {content.dateLabel} {lastUpdated}
               </p>
               <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-secondary">{content.statusLabel}</span>
               </div>
            </div>

            <section className="mb-12">
               <h2 className="text-3xl font-black text-secondary uppercase mb-6 tracking-tighter flex items-center gap-4">
                  <span className="w-8 h-8 bg-primary text-secondary flex items-center justify-center rounded-lg text-sm">01</span>
                  {content.title}
               </h2>
               <p className="text-lg leading-relaxed font-light italic border-l-4 border-primary pl-6 py-2 bg-gray-50 rounded-r-xl">
                  {content.body}
               </p>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
               {pillars.pillars.map((pillar, i) => (
                  <div key={i} className="p-8 rounded-[2rem] border border-gray-100 hover:border-primary/20 hover:bg-gray-50 transition-all group">
                     <h3 className="text-sm font-black uppercase text-secondary mb-3 tracking-widest group-hover:text-primary transition-colors">{pillar.title}</h3>
                     <p className="text-sm font-light leading-relaxed">{pillar.description}</p>
                  </div>
               ))}
            </div>

            <section className="mb-16 space-y-8">
               <div className="bg-secondary p-8 rounded-3xl text-white">
                  <h3 className="text-lg font-black uppercase mb-4 tracking-tight text-primary underline decoration-2 underline-offset-8">{standards.title}</h3>
                  <p className="text-sm font-light text-gray-300">{standards.body}</p>
               </div>
            </section>

            <section className="text-center pt-8 border-t border-gray-100 group">
               <p className="text-[10px] font-black text-gray-400 mb-4 uppercase tracking-[0.4em]">{inquiry.eyebrow}</p>
               <h3 className="text-2xl font-black text-secondary uppercase mb-4 tracking-tighter">{inquiry.title}</h3>
               <p className="text-gray-500 font-light mb-8">{inquiry.body}</p>
               <a 
                  href={`mailto:${settings.email}`} 
                  className="inline-block bg-primary text-secondary px-10 py-4 rounded-full font-black uppercase tracking-widest text-xs hover:bg-secondary hover:text-white transition-all shadow-xl shadow-primary/20"
               >
                  {inquiry.ctaText}
               </a>
            </section>
          </div>
        </Container>
      </Section>
    </>
  );
}
