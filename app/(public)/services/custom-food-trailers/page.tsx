import React from "react";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";
import CTASection from "@/components/ui/CTASection";
import { Check, Box, DollarSign, Maximize2, Settings } from "lucide-react";

export default function CustomFoodTrailersPage() {
  return (
    <>
      <PageHeader
        title="Custom Food Trailers"
        subtitle="Versatile, spacious, and cost-effective. Our custom trailers range from 10ft coffee units to 26ft full-service mobile kitchens."
      />

      <Section className="bg-white">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <span className="text-primary font-bold tracking-widest uppercase text-sm mb-2 block">Flexible & Spacious</span>
              <h2 className="text-3xl md:text-4xl font-black uppercase text-secondary mb-6 tracking-tight">
                More Space, Lower Cost
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                Concession trailers are the smart choice for entrepreneurs who want a larger kitchen, lower operating costs, and the flexibility to use their own tow vehicle. Perfect for festivals, semi-permanent locations, and high-volume events.
              </p>
              <ul className="space-y-4">
                {[
                  "Custom Sizes from 10ft to 30ft",
                  "Porch & Smoker Build Options",
                  "Full Commercial Kitchen Layouts",
                  "Lower Insurance & Maintenance Costs",
                  "Detachable Towing — Use Your Own Vehicle",
                  "NSF-Certified Equipment Integration"
                ].map((item, i) => (
                  <li key={i} className="flex items-center text-gray-700 font-medium">
                    <Check size={18} className="text-primary mr-3 shrink-0" /> {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-6">
              {[
                { icon: DollarSign, title: "Cost Effective", desc: "Lower initial investment with reduced insurance and maintenance costs compared to food trucks." },
                { icon: Maximize2, title: "Maximum Space", desc: "Up to 30ft of kitchen space. Perfect for large menus, catering operations, and high-volume events." },
                { icon: Box, title: "Flexible Setup", desc: "Use your own tow vehicle and set up in any location. Easy to reposition for different events." },
                { icon: Settings, title: "Custom Everything", desc: "From smoker porches to serving windows, every detail is built to your exact specifications." },
              ].map((feature, i) => (
                <div key={i} className="flex items-start bg-gray-50 p-6 rounded-xl border border-gray-100 hover:border-primary/30 transition-colors">
                  <div className="bg-primary/10 p-3 rounded-full mr-4 shrink-0 text-primary">
                    <feature.icon size={24} />
                  </div>
                  <div>
                    <h3 className="font-black uppercase text-secondary mb-1 tracking-tight">{feature.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <CTASection
        title="Ready to Build Your Trailer?"
        subtitle="Get a custom quote for a concession trailer built specifically for your business needs."
        buttonText="Request a Quote"
        buttonHref="/quote"
      />
    </>
  );
}
