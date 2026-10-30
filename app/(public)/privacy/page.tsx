import React from "react";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";
import { getPageSEO, getSEO, getSettings } from "@/lib/db";
import type { Metadata } from "next";
import PageJsonLd from "@/components/PageJsonLd";
import { getSections } from "@/lib/pageContent";
import {
  PRIVACY_HEADER,
  PRIVACY_CONTENT,
  PRIVACY_LISTS,
  PRIVACY_POLICIES,
  PRIVACY_CONTACT,
} from "@/lib/pageContent/pages/privacy";

// Cached and regenerated every 5 minutes, or immediately when the admin saves changes (revalidatePath).
export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSEO();
  const pageSeo = await getPageSEO("privacy");
  
  return {
    title: pageSeo?.title || `Privacy Policy | ${seo.siteTitle}`,
    description: pageSeo?.description || seo.description,
    keywords: pageSeo?.keywords || seo.keywords,
    alternates: { canonical: '/privacy' },
  };
}

export default async function PrivacyPage() {
  const [settings, [header, content, lists, policies, contact]] = await Promise.all([
    getSettings(),
    getSections([PRIVACY_HEADER, PRIVACY_CONTENT, PRIVACY_LISTS, PRIVACY_POLICIES, PRIVACY_CONTACT] as const),
  ]);

  const lastUpdated = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <>
      <PageJsonLd pageId="privacy" />
      <PageHeader
        title={header.title}
        subtitle={header.subtitle}
      />

      <Section className="bg-white">
        <Container className="max-w-4xl">
          <div className="prose prose-lg max-w-none text-gray-600">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12 pb-6 border-b border-gray-100">
               <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-[0.3em]">
                  {content.revisionLabel} {lastUpdated}
               </p>
               <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-secondary">{content.statusLabel}</span>
               </div>
            </div>

            <section className="mb-12">
               <h2 className="text-3xl font-black text-secondary uppercase mb-6 tracking-tighter flex items-center gap-4">
                  <span className="w-8 h-8 bg-primary text-secondary flex items-center justify-center rounded-lg text-sm">01</span>
                  {content.title}
               </h2>
               <p className="text-lg leading-relaxed font-light">
                  {content.body}
               </p>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
               <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
                  <h3 className="text-sm font-black uppercase text-secondary mb-6 tracking-widest flex items-center gap-2">
                     <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                     {lists.collectionTitle}
                  </h3>
                  <ul className="space-y-4">
                     {lists.collectionItems.map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-sm font-bold text-gray-500">
                           <div className="w-1 h-1 rounded-full bg-gray-300"></div> {item}
                        </li>
                     ))}
                  </ul>
               </div>
               <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
                  <h3 className="text-sm font-black uppercase text-secondary mb-6 tracking-widest flex items-center gap-2">
                     <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                     {lists.usageTitle}
                  </h3>
                  <ul className="space-y-4">
                     {lists.usageItems.map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-sm font-bold text-gray-500">
                           <div className="w-1 h-1 rounded-full bg-gray-300"></div> {item}
                        </li>
                     ))}
                  </ul>
               </div>
            </section>

            <section className="mb-16 space-y-10">
               {policies.clauses.map((clause, i) => (
                  <div key={i}>
                     <h2 className="text-xl font-black text-secondary uppercase mb-4 tracking-tight">{clause.title}</h2>
                     <p className="font-light">{clause.body}</p>
                  </div>
               ))}
            </section>

            <section className="bg-secondary rounded-[2.5rem] p-10 text-white relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl -mr-16 -mt-16"></div>
               <h2 className="text-xl font-black uppercase mb-8 tracking-tighter relative z-10 text-primary">{contact.title}</h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                  <div className="space-y-1">
                     <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">{contact.entityLabel}</p>
                     <p className="font-bold text-lg">{contact.entityName}</p>
                  </div>
                  <div className="space-y-1">
                     <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">{contact.emailLabel}</p>
                     <p className="font-bold text-lg">{settings.email}</p>
                  </div>
                  <div className="space-y-1 md:col-span-2">
                     <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">{contact.addressLabel}</p>
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
