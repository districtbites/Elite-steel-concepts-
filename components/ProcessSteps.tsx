import React from "react";
import Container from "./ui/Container";
import {
  FileText,
  Phone,
  PenTool,
  CheckSquare,
  Hammer,
  Lightbulb,
  Layout,
  Truck,
  ShieldCheck,
  Rocket,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { HOME_PROCESS } from "@/lib/pageContent/pages/home";

export type ProcessStep = {
  title: string;
  description: string;
  icon: LucideIcon;
};

/** Icons for the homepage steps, assigned in order. */
export const DEFAULT_STEP_ICONS: LucideIcon[] = [FileText, Phone, PenTool, CheckSquare, Hammer];

/** Turns editable step copy into steps with icons (icons repeat if more steps are added). */
export const withStepIcons = (
  items: { title: string; description: string }[],
  icons: LucideIcon[] = DEFAULT_STEP_ICONS,
): ProcessStep[] => items.map((s, i) => ({ ...s, icon: icons[i % icons.length] }));

const defaultSteps = withStepIcons(HOME_PROCESS.defaults.steps);

interface ProcessStepsProps {
  eyebrow?: string;
  title?: React.ReactNode;
  steps?: ProcessStep[];
  showFullProcessLink?: boolean;
  fullProcessText?: string;
  fullProcessLink?: string;
  ctaText?: React.ReactNode;
  ctaButtonText?: string;
  ctaButtonLink?: string;
}

const ProcessSteps = ({
  eyebrow = HOME_PROCESS.defaults.eyebrow,
  title = (
    <>
      {HOME_PROCESS.defaults.titleLine1}
      <span className="block">{HOME_PROCESS.defaults.titleLine2}</span>
    </>
  ),
  steps = defaultSteps,
  showFullProcessLink = true,
  fullProcessText = HOME_PROCESS.defaults.fullProcessText,
  fullProcessLink = HOME_PROCESS.defaults.fullProcessLink,
  ctaText = HOME_PROCESS.defaults.ctaText,
  ctaButtonText = HOME_PROCESS.defaults.ctaButtonText,
  ctaButtonLink = HOME_PROCESS.defaults.ctaButtonLink,
}: ProcessStepsProps) => {
  return (
    <section id="our-process" className="bg-white border-y border-gray-100 py-8 md:py-12">
      <Container>
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-4 mb-8">
          <div>
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-12 bg-primary" />
              <span className="text-primary text-xs font-black uppercase tracking-[0.25em]">
                {eyebrow}
              </span>
              <div className="h-px w-12 bg-primary" />
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-black uppercase tracking-tighter leading-tight">
              {title}
            </h2>
          </div>
          {showFullProcessLink && (
            <Link
              href={fullProcessLink}
              className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-primary hover:underline"
            >
              {fullProcessText} <ArrowRight size={12} />
            </Link>
          )}
        </div>

        {/* Steps — horizontal on desktop, stacked on mobile */}
        <div className="relative">
          <div className="hidden lg:block absolute top-[52px] left-0 right-0 h-px bg-gray-200 z-0" />

          <div
            className={`grid grid-cols-1 gap-px bg-gray-200 border border-gray-200 relative z-10 ${
              steps.length === 5 ? "md:grid-cols-5" : "md:grid-cols-2 lg:grid-cols-5"
            }`}
          >
            {steps.map((step, i) => (
              <div
                key={i}
                className="group relative bg-white hover:bg-gray-50 transition-colors p-8 flex flex-col"
              >
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 bg-primary/10 border border-primary/20 group-hover:bg-primary group-hover:border-primary flex items-center justify-center transition-colors">
                    <step.icon
                      size={20}
                      className="text-primary group-hover:text-white transition-colors"
                    />
                  </div>
                  <span className="text-[56px] font-black text-gray-900 group-hover:text-primary leading-none select-none transition-colors">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                <h3 className="text-sm font-black text-black uppercase tracking-wide mb-3 group-hover:text-primary transition-colors">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed flex-1">
                  {step.description}
                </p>

                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute -right-px top-1/2 -translate-y-1/2 z-20">
                    <div className="w-2 h-2 border-t border-r border-primary/60 rotate-45 bg-white" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA strip */}
        <div className="mt-6 bg-primary/5 border border-primary/20 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-600">{ctaText}</p>
          <Link
            href={ctaButtonLink}
            id="process-start-quote-btn"
            className="group inline-flex items-center gap-4 bg-primary text-black pl-8 pr-3 py-3 font-black uppercase tracking-wider text-sm shadow-lg shadow-primary/25 hover:-translate-y-0.5 hover:shadow-xl transition-all whitespace-nowrap"
          >
            {ctaButtonText}
            <span className="w-10 h-10 rounded-full bg-black text-primary flex items-center justify-center group-hover:translate-x-1 transition-transform">
              <ArrowRight size={16} />
            </span>
          </Link>
        </div>
      </Container>
    </section>
  );
};

/** Icons for the About page steps, assigned in order. */
export const ABOUT_STEP_ICONS: LucideIcon[] = [Lightbulb, Layout, Truck, ShieldCheck, Rocket];

export default ProcessSteps;
