import React from "react";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PortfolioGallery from "@/components/PortfolioGallery";
import { getProjects } from "@/lib/db";

export default async function PortfolioPage() {
  const projects = await getProjects();

  return (
    <>
      {/* Page Header */}
      <div className="bg-secondary pt-32 pb-16 md:pt-40 md:pb-24">
        <Container className="text-center">
          <h1 className="text-4xl md:text-6xl font-black uppercase text-white mb-4 tracking-tight">
            Our Portfolio
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
             Browse a selection of our recent custom builds. From food trucks to concession trailers, if you can dream it, we can build it.
          </p>
        </Container>
      </div>

      <Section className="bg-gray-50">
        <Container>
           <PortfolioGallery initialProjects={projects} />
        </Container>
      </Section>
    </>
  );
}
