import React from "react";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";
import QuoteForm from "@/components/QuoteForm";

import { getSEO } from "@/lib/db";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSEO();
  const pageSeo = seo.pages?.["quote"];
  
  return {
    title: pageSeo?.title || seo.siteTitle,
    description: pageSeo?.description || seo.description,
    keywords: pageSeo?.keywords || seo.keywords,
  };
}

export default function QuotePage() {
  return (
    <>
      <PageHeader
        title="Request A Quote"
        subtitle="Provide us with the details of your dream build, and we'll help you price it out."
      />

      <Section className="bg-gray-50">
        <Container>
          <div className="max-w-4xl mx-auto">
             <div className="mb-12 text-center">
                <h2 className="text-2xl font-black uppercase text-secondary mb-4 tracking-tight">
                  Let&apos;s Build Specific to Your Needs
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  Every food truck is unique. To give you the most accurate estimate, we need to know what you&apos;re cooking, what equipment you need, and your budget goals. The more detail, the better.
                </p>
             </div>
             
             <QuoteForm />
          </div>
        </Container>
      </Section>
    </>
  );
}
