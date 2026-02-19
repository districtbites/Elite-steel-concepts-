import React from "react";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";
import PortfolioGallery from "@/components/PortfolioGallery";
import { getProjects } from "@/lib/db";

import { getSEO } from "@/lib/db";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSEO();
  const pageSeo = seo.pages?.["portfolio"];
  
  return {
    title: pageSeo?.title || seo.siteTitle,
    description: pageSeo?.description || seo.description,
    keywords: pageSeo?.keywords || seo.keywords,
  };
}

export default async function PortfolioPage() {
  const projects = await getProjects();

  return (
    <>
      <PageHeader
        title="Our Portfolio"
        subtitle="Browse a selection of our recent custom builds. From food trucks to concession trailers, if you can dream it, we can build it."
      />

      <Section className="bg-gray-50">
        <Container>
           <PortfolioGallery initialProjects={projects} />
        </Container>
      </Section>
    </>
  );
}
