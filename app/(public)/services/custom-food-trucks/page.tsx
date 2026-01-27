import React from "react";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";

export default function CustomFoodTrucksPage() {
  return (
    <div className="pt-24">
      <Section className="bg-white">
        <Container>
           <h1 className="text-5xl md:text-6xl font-black uppercase text-secondary mb-8">Custom Food Trucks</h1>
           <p className="text-xl text-gray-600 max-w-3xl mb-12">
             From 12ft step vans to 30ft heavy-duty kitchens, we design and build food trucks that maximize efficiency and visual appeal.
           </p>
           <Button href="/quote">Request a Quote</Button>
        </Container>
      </Section>
    </div>
  );
}
