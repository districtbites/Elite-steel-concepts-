import Hero from "@/components/Hero";
import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";
import ProcessSteps from "@/components/ProcessSteps";
import ServiceSelection from "@/components/ServiceSelection";
import SizeSelection from "@/components/SizeSelection";
import Testimonials from "@/components/Testimonials";
import HomeBlogSection from "@/components/HomeBlogSection";
import NewsletterSection from "@/components/sections/NewsletterSection";
import CTASection from "@/components/ui/CTASection";

import { getPageSEO, getSEO } from "@/lib/db";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSEO();
  const pageSeo = await getPageSEO("home");
  
  return {
    title: pageSeo?.title || seo.siteTitle,
    description: pageSeo?.description || seo.description,
    keywords: pageSeo?.keywords || seo.keywords,
  };
}

export default async function Home() {
  const pageSeo = await getPageSEO("home");
  const alts = pageSeo.imageAlts || {};
  const sections = pageSeo.sections || {};

  return (
    <>
      {pageSeo.structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: pageSeo.structuredData }}
        />
      )}
      <Hero imageAlts={alts} content={sections.hero} />
      <Section id="intro" className="bg-white">
         <Container className="text-center max-w-5xl">
            <h2 className="text-4xl md:text-6xl font-black text-secondary mb-10 leading-tight uppercase tracking-tight">
               {sections.intro?.title || "Building Custom Food Trucks & Concession Trailers For Entrepreneurs Since 2012"}
            </h2>
            <p className="mx-auto text-lg md:text-xl text-gray-500 leading-relaxed font-light">
               {sections.intro?.content || "If you're looking to get started on launching your very own mobile food truck, contact Elite Steel Concepts today! Though we're located in the Metro DC area, our services are nationwide. We provide opportunity for entrepreneurs to visualize and design their ideal mobile kitchen and make their dream a reality. We're skilled in the fabrication, assembly and creation of beautiful mobile kitchens, food trucks and concession trailers. Our ultimate goal is to roll out a beautiful mobile food business in record time to allow you to spread happiness with your menu! All our trucks and trailers are built specifically to your needs and goals."}
            </p>
         </Container>
      </Section>
      <ProcessSteps />
      <ServiceSelection imageAlts={alts} />
      <SizeSelection />
      <Testimonials />
      <HomeBlogSection />
      <NewsletterSection />
      <CTASection
        title={sections.cta?.title || "Ready to Start Your Build?"}
        subtitle={sections.cta?.subtitle || "Tell us about your vision and let's create the perfect mobile kitchen for your business."}
        buttonText={sections.cta?.ctaText || "Get a Free Quote"}
        buttonHref="/quote"
      />
    </>
  );
}
