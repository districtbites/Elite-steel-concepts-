import Hero from "@/components/Hero";
import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";
import ProcessSteps from "@/components/ProcessSteps";
import ServiceSelection from "@/components/ServiceSelection";
import SizeSelection from "@/components/SizeSelection";
import Testimonials from "@/components/Testimonials";
import HomeBlogSection from "@/components/HomeBlogSection";
import CTASection from "@/components/ui/CTASection";

import { getSEO } from "@/lib/db";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSEO();
  const pageSeo = seo.pages?.["home"];
  
  return {
    title: pageSeo?.title || seo.siteTitle,
    description: pageSeo?.description || seo.description,
    keywords: pageSeo?.keywords || seo.keywords,
  };
}

export default function Home() {
  return (
    <>
      <Hero />
      <Section id="intro" className="bg-white">
         <Container className="text-center max-w-5xl">
            <h2 className="text-4xl md:text-6xl font-black text-secondary mb-10 leading-tight uppercase tracking-tight">
               Building Custom Food Trucks & <br className="hidden md:block"/>
               Concession Trailers For <br className="hidden md:block"/>
               Entrepreneurs Since 2012
            </h2>
            <p className="mx-auto text-lg md:text-xl text-gray-500 leading-relaxed font-light">
               If you're looking to get started on launching your very own mobile food truck, contact <strong className="text-secondary font-bold">Elite Steel Concepts</strong> today! Though we're located in the Metro DC area, our services are nationwide. We provide opportunity for entrepreneurs to visualize and design their ideal mobile kitchen and make their dream a reality. We're skilled in the fabrication, assembly and creation of beautiful mobile kitchens, food trucks and concession trailers. Our ultimate goal is to roll out a beautiful mobile food business in record time to allow you to spread happiness with your menu! All our trucks and trailers are built specifically to your needs and goals.
            </p>
         </Container>
      </Section>
      <ProcessSteps />
      <ServiceSelection />
      <SizeSelection />
      <Testimonials />
      <HomeBlogSection />
      <CTASection
        title="Ready to Start Your Build?"
        subtitle="Tell us about your vision and let's create the perfect mobile kitchen for your business."
        buttonText="Get a Free Quote"
        buttonHref="/quote"
      />
    </>
  );
}
