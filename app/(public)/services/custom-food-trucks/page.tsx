import React from "react";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";
import CTASection from "@/components/ui/CTASection";
import { Check, Truck, Wrench, Shield, Zap } from "lucide-react";

export default function CustomFoodTrucksPage() {
  return (
    <>
      <PageHeader
        title="Custom Food Trucks"
        subtitle="From 12ft step vans to 30ft heavy-duty kitchens, we design and build food trucks that maximize efficiency and visual appeal."
      />

      <Section className="bg-white">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <span className="text-primary font-bold tracking-widest uppercase text-sm mb-2 block">Our Specialty</span>
              <h2 className="text-3xl md:text-4xl font-black uppercase text-secondary mb-6 tracking-tight">
                The Ultimate Mobile Kitchen
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                Our food trucks are built for entrepreneurs who need maximum mobility without sacrificing kitchen capability. Every truck is engineered from the ground up with commercial-grade equipment, health code compliance, and your unique brand identity in mind.
              </p>
              <ul className="space-y-4">
                {[
                  "Step Van Conversions (New & Used)",
                  "Full Stainless Steel Interiors",
                  "Commercial-Grade Equipment Installation",
                  "Generator Systems & Electrical",
                  "Full Graphic Wraps & Branding",
                  "Health Department Compliant Builds"
                ].map((item, i) => (
                  <li key={i} className="flex items-center text-gray-700 font-medium">
                    <Check size={18} className="text-primary mr-3 shrink-0" /> {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-6">
              {[
                { icon: Truck, title: "Maximum Mobility", desc: "Drive from location to location. Hit multiple spots in a single day and reach customers wherever they are." },
                { icon: Zap, title: "Compact Powerhouse", desc: "Every inch is optimized. Our layout designs ensure maximum efficiency in a compact footprint." },
                { icon: Wrench, title: "Built to Last", desc: "Commercial-grade stainless steel, heavy-duty frames, and professional electrical systems built for years of service." },
                { icon: Shield, title: "Code Compliant", desc: "We build to your county's specific health and fire safety codes so you pass inspection the first time." },
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
        title="Ready to Build Your Food Truck?"
        subtitle="Tell us about your concept, menu, and goals — we'll design a truck that's perfect for your business."
        buttonText="Request a Quote"
        buttonHref="/quote"
      />
    </>
  );
}
