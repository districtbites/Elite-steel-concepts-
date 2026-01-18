import Hero from "@/components/Hero";
import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";
import ProcessSteps from "@/components/ProcessSteps";
import ServiceSelection from "@/components/ServiceSelection";

export default function Home() {
  return (
    <>
      <Hero />
      <Section id="intro">
         <Container className="text-center">
            <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-tight mb-6">Master Craftsmanship</h2>
            <p className="max-w-3xl mx-auto text-lg text-gray-600 leading-relaxed">
               Elite Steel Concepts is the premier builder for custom food trucks and trailers in the DMV area. 
               We combine heavy-duty fabrication with modern design to create mobile kitchens that stand out and perform under pressure.
            </p>
         </Container>
      </Section>
      <ServiceSelection />
      <ProcessSteps />
    </>
  );
}
