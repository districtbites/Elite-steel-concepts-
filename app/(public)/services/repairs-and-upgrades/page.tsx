import React from "react";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";

export default function RepairsAndUpgradesPage() {
  return (
    <div className="pt-24">
      <Section className="bg-white">
        <Container>
           <h1 className="text-5xl md:text-6xl font-black uppercase text-secondary mb-8">Repairs & Upgrades</h1>
           <p className="text-xl text-gray-600 max-w-3xl mb-12 leading-relaxed">
             Keep your mobile kitchen running at peak performance. We specialize in generator maintenance, kitchen equipment upgrades, Health Department code compliance updates, and structural repairs.
           </p>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              <div className="bg-gray-50 p-8 rounded-lg border border-gray-100">
                  <h3 className="text-2xl font-bold uppercase text-secondary mb-4">Maintenance & Repairs</h3>
                  <ul className="space-y-3 text-gray-600">
                      <li>• Generator Service & Replacement</li>
                      <li>• Electrical System Diagnostics</li>
                      <li>• Plumbing & Water System Fixes</li>
                      <li>• Hood Fan & Ventilation Repair</li>
                  </ul>
              </div>
              <div className="bg-gray-50 p-8 rounded-lg border border-gray-100">
                  <h3 className="text-2xl font-bold uppercase text-secondary mb-4">Upgrades & Refits</h3>
                  <ul className="space-y-3 text-gray-600">
                      <li>• Equipment Swaps & Upgrades</li>
                      <li>• Interior Layout Optimization</li>
                      <li>• Exterior Wrap & Branding Updates</li>
                      <li>• Code Compliance Retrofits</li>
                  </ul>
              </div>
           </div>

           <Button href="/contact">Schedule Service</Button>
        </Container>
      </Section>
    </div>
  );
}
