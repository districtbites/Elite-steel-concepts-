import React from "react";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";
import PortfolioGallery from "@/components/PortfolioGallery";
import { getProjects } from "@/lib/db";

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
