import React from "react";
import Container from "./ui/Container";
import {
  PenTool,
  Utensils,
  Headset,
  PlugZap,
  Flame,
  Truck,
  ArrowRight,
} from "lucide-react";

const whyChooseFeatures = [
  {
    icon: PenTool,
    title: "Custom Built Designs",
    description:
      "Every food truck and trailer is designed around your menu, equipment, and workflow, with detailed layouts you approve before fabrication starts.",
  },
  {
    icon: Utensils,
    title: "Quality Equipment Installation",
    description:
      "We install commercial-grade kitchen equipment built for heavy daily operations, meeting NSF standards and safety codes where required.",
  },
  {
    icon: Headset,
    title: "24/7 support + 1-year warranty",
    description:
      "Our team is available around the clock, and every build is backed by a 1-year warranty for complete peace of mind on the road.",
  },
  {
    icon: PlugZap,
    title: "Electrical & Plumbing Installation",
    description:
      "Custom electrical systems with proper breaker distribution and clean wiring, plus plumbing and water systems built to health department code.",
  },
  {
    icon: Flame,
    title: "Fire Safety Installation",
    description:
      "Certified fire suppression systems installed with automatic heat sensors, micro-switches, and precision-placed nozzles.",
  },
  {
    icon: Truck,
    title: "Nationwide Service",
    description:
      "Based in Manassas, VA, we build and deliver custom food trucks and concession trailers to entrepreneurs across the country.",
  },
];

const WhyChooseSection: React.FC = () => {
  return (
    <section className="bg-gray-50/70 py-20 md:py-28 border-b border-gray-100">
      <Container>
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-8 bg-primary" />
            <span className="text-primary text-xs font-black uppercase tracking-[0.25em]">
              The Elite Advantage
            </span>
            <div className="h-px w-8 bg-primary" />
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-black uppercase tracking-tight leading-tight">
            Why Choose Elite Steel Concepts?
          </h2>
        </div>

        {/* 3x2 Grid of Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {whyChooseFeatures.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group bg-white rounded-3xl p-8 md:p-10 border border-gray-100 shadow-sm hover:shadow-xl hover:border-gray-200 transition-all duration-300 flex flex-col items-center text-center justify-between"
              >
                <div className="flex flex-col items-center">
                  {/* Icon Box */}
                  <div className="size-16 bg-black text-white rounded-2xl flex items-center justify-center mb-6 shadow-md group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                    <Icon size={28} strokeWidth={2} />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-black text-black tracking-tight mb-4">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-500 text-sm leading-relaxed font-normal mb-6">
                    {feature.description}
                  </p>
                </div>

                {/* Learn More footer link */}
                <div className="inline-flex items-center gap-1 text-xs font-bold text-gray-400 group-hover:text-primary transition-colors cursor-pointer mt-auto">
                  <span>Learn more</span>
                  <ArrowRight
                    size={12}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};

export default WhyChooseSection;
