import React from "react";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";

export default function CustomFoodTrailersPage() {
  return (
    <div className="pt-24">
      <Section className="bg-white">
        <Container>
           <h1 className="text-5xl md:text-6xl font-black uppercase text-secondary mb-8">Custom Food Trailers</h1>
           <p className="text-xl text-gray-600 max-w-3xl mb-12">
             Versatile, spacious, and cost-effective. Our custom trailers range from 10ft coffee units to 26ft full-service mobile kitchens.
           </p>
           <Button href="/quote">Request a Quote</Button>
        </Container>
      </Section>
    </div>
  );
}
