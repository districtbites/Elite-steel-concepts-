import React from "react";
import Container from "./ui/Container";
import Section from "./ui/Section";
import { FileText, Phone, PenTool, CheckSquare, Hammer } from "lucide-react";

const steps = [
  {
    title: "Quote",
    description: "The very first step to getting your project started is to fill out the quote request form.",
    icon: FileText,
  },
  {
    title: "Consultation",
    description: "After you fill out the quote request form, we call you to learn more about your project.",
    icon: Phone,
  },
  {
    title: "Design / Schematics",
    description: "We then review the design requirements and develop a floor plan.",
    icon: PenTool,
  },
  {
    title: "Agreement",
    description: "Once all of the details are finalized, a sales agreement is signed.",
    icon: CheckSquare,
  },
  {
    title: "Production",
    description: "Our production team gets to work to build your food truck or concession trailer.",
    icon: Hammer,
  },
];

const ProcessSteps = () => {
  return (
    <Section id="our-process" className="bg-white">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-tight text-secondary mb-4">
            Our Process
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto"></div>
        </div>

        <div className="relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden lg:block absolute top-12 left-0 w-full h-0.5 bg-gray-200 -z-10 transform -translate-y-1/2"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-4">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center text-center group">
                <div className="relative mb-6">
                  <div className="w-24 h-24 rounded-full bg-white border-4 border-gray-100 flex items-center justify-center group-hover:border-primary transition-colors duration-300 z-10">
                    <step.icon className="w-10 h-10 text-gray-400 group-hover:text-primary transition-colors duration-300" />
                  </div>
                  <div className="absolute top-0 right-0 bg-secondary text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-white">
                    {index + 1}
                  </div>
                </div>
                <h3 className="text-lg font-bold uppercase tracking-wide mb-3 text-secondary group-hover:text-primary transition-colors">
                  {step.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed max-w-[200px]">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
};

export default ProcessSteps;
