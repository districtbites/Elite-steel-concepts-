import React from "react";
import Container from "./ui/Container";
import {
  PenTool,
  Utensils,
  ShieldCheck,
  PlugZap,
  Flame,
  Truck,
} from "lucide-react";
import { HOME_WHY_CHOOSE } from "@/lib/pageContent/pages/home";

// Card icons are assigned in order (and repeat if more cards are added in the admin)
const FEATURE_ICONS = [PenTool, Utensils, ShieldCheck, PlugZap, Flame, Truck];

const WhyChooseSection = ({ content = HOME_WHY_CHOOSE.defaults }: { content?: typeof HOME_WHY_CHOOSE.defaults }) => {
  const whyChooseFeatures = content.features.map((title, i) => ({
    title,
    icon: FEATURE_ICONS[i % FEATURE_ICONS.length],
  }));

  return (
    <section className="bg-gray-50/70 py-8 md:py-12 border-b border-gray-100">
      <Container>
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-8 bg-primary" />
            <p className="text-primary text-xs font-black uppercase tracking-[0.25em]">
              {content.eyebrow}
            </p>
            <div className="h-px w-8 bg-primary" />
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-black uppercase tracking-tight leading-tight">
            {content.title}
          </h2>
        </div>

        {/* 3x2 Grid of Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {whyChooseFeatures.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={i}
                className="group bg-white rounded-3xl p-8 md:p-10 border border-gray-100 shadow-sm hover:shadow-xl hover:border-gray-200 transition-all duration-300 flex flex-col items-center justify-center text-center"
              >
                {/* Icon Box */}
                <div className="size-16 bg-black text-white rounded-2xl flex items-center justify-center mb-6 shadow-md group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                  <Icon size={28} strokeWidth={2} />
                </div>

                {/* Title */}
                <h3 className="text-xl font-black text-black tracking-tight group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};

export default WhyChooseSection;
