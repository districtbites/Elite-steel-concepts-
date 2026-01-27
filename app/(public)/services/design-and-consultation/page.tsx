import React from "react";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";

export default function DesignAndConsultationPage() {
  return (
    <div className="pt-24">
      <Section className="bg-white">
        <Container>
           <h1 className="text-5xl md:text-6xl font-black uppercase text-secondary mb-8">Design & Consultation</h1>
           <p className="text-xl text-gray-600 max-w-3xl mb-12 leading-relaxed">
             A successful food truck starts with a smart design. Our team of experts works with you to optimize workflow, ensure code compliance, and create a kitchen that maximizes output in a compact space.
           </p>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="border-l-4 border-primary pl-6 py-2">
                  <h3 className="text-xl font-bold uppercase text-secondary mb-2">Workflow Analysis</h3>
                  <p className="text-gray-600 text-sm">We analyze your menu and volume to design a kitchen flow that minimizes steps and maximizes speed.</p>
              </div>
              <div className="border-l-4 border-primary pl-6 py-2">
                  <h3 className="text-xl font-bold uppercase text-secondary mb-2">3D / CAD Layouts</h3>
                  <p className="text-gray-600 text-sm">Visualize your truck before build begins. We provide professional CAD drawings for Health Department submission.</p>
              </div>
              <div className="border-l-4 border-primary pl-6 py-2">
                  <h3 className="text-xl font-bold uppercase text-secondary mb-2">Health Code Expert</h3>
                  <p className="text-gray-600 text-sm">Navigate complex regulations with confidence. We ensure your build meets local health and fire codes.</p>
              </div>
           </div>

           <Button href="/contact">Book a Consultation</Button>
        </Container>
      </Section>
    </div>
  );
}
