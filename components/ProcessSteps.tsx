import React from "react";
import Container from "./ui/Container";
import { FileText, Phone, PenTool, CheckSquare, Hammer, ArrowRight } from "lucide-react";
import Link from "next/link";

const steps = [
  {
    title: "Quote Request",
    description:
      "Fill out our quote form with your build requirements. Takes 3 minutes — we respond within 24 hours.",
    icon: FileText,
  },
  {
    title: "Consultation",
    description:
      "We call you to deep-dive into your menu, workflow, and budget. No pressure, just precision.",
    icon: Phone,
  },
  {
    title: "Design & Schematics",
    description:
      "Our engineers develop a full floor plan with equipment placement, power layout, and material spec.",
    icon: PenTool,
  },
  {
    title: "Agreement",
    description:
      "Once details are locked, we sign a production agreement with a clear timeline and milestones.",
    icon: CheckSquare,
  },
  {
    title: "Production",
    description:
      "Our fabrication team builds your truck. You can visit the shop at any stage — walk-ins welcome.",
    icon: Hammer,
  },
];

const ProcessSteps = () => {
  return (
    <section id="our-process" className="bg-[#0a0a0a] py-20 md:py-28">
      <Container>
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-12 bg-primary" />
              <span className="text-primary text-xs font-black uppercase tracking-[0.25em]">
                How It Works
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter leading-tight">
              Our Build
              <span className="block text-gray-500">Process</span>
            </h2>
          </div>
          <Link
            href="/process"
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-primary hover:underline"
          >
            See Full Process <ArrowRight size={12} />
          </Link>
        </div>

        {/* Steps — horizontal on desktop, stacked on mobile */}
        <div className="relative">
          {/* Connector line desktop */}
          <div className="hidden lg:block absolute top-[52px] left-0 right-0 h-px bg-[#1a1a1a] z-0" />

          <div className="grid grid-cols-1 md:grid-cols-5 gap-px bg-[#1a1a1a] relative z-10">
            {steps.map((step, i) => (
              <div
                key={i}
                className="group relative bg-[#0a0a0a] hover:bg-[#0f0f0f] transition-colors p-8 flex flex-col"
              >
                {/* Top accent on hover */}
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

                {/* Icon + number */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 border border-[#1a1a1a] group-hover:border-primary flex items-center justify-center transition-colors">
                    <step.icon
                      size={20}
                      className="text-primary"
                    />
                  </div>
                  <span className="text-[56px] font-black text-white/[0.04] leading-none select-none">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                {/* Content */}
                <h3 className="text-sm font-black text-white uppercase tracking-wide mb-3 group-hover:text-primary transition-colors">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-xs leading-relaxed flex-1">
                  {step.description}
                </p>

                {/* Step connector arrow (except last) */}
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute -right-px top-1/2 -translate-y-1/2 z-20">
                    <div className="w-2 h-2 border-t border-r border-primary/30 rotate-45 bg-[#0a0a0a]" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA strip */}
        <div className="mt-px bg-primary/5 border border-[#1a1a1a] border-t-primary/20 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400">
            Ready to start? Step 1 takes <strong className="text-white">3 minutes.</strong>
          </p>
          <Link
            href="/quote"
            id="process-start-quote-btn"
            className="inline-flex items-center gap-2 bg-primary hover:bg-orange-600 text-white font-black uppercase tracking-wider text-xs px-6 py-3 transition-all"
          >
            Start With a Quote <ArrowRight size={14} />
          </Link>
        </div>
      </Container>
    </section>
  );
};

export default ProcessSteps;
