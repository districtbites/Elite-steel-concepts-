import React from "react";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";
import CTASection from "@/components/ui/CTASection";
import { FileText, Phone, PenTool, CheckSquare, Hammer, ArrowRight } from "lucide-react";

export default function ProcessPage() {
  const steps = [
    {
      number: "01",
      title: "Request A Quote",
      icon: FileText,
      description: "Everything starts with your vision. Fill out our detailed quote form to tell us about your menu, equipment needs, and budget. This gives us a baseline to understand the scope of your project.",
      details: [
        "Submit vehicle preference (Truck vs Trailer)",
        "Outline kitchen equipment requirements",
        "Define budget and timeline goals"
      ]
    },
    {
      number: "02",
      title: "Consultation Call",
      icon: Phone,
      description: "Once we review your quote request, our team will schedule a call to discuss the feasibility and fine-tune the details. We'll offer expert advice on layout efficiency and code compliance.",
      details: [
        "Review project feasibility",
        "Discuss health department codes",
        "Refine equipment list"
      ]
    },
    {
      number: "03",
      title: "Design & Schematics",
      icon: PenTool,
      description: "This is where it gets real. We create a 2D floor plan layout to ensure every inch of space is optimized. We review this with you to make sure it fits your workflow perfectly.",
      details: [
        "Custom floor plan creation",
        "Workflow optimization analysis",
        "Electrical and plumbing layout planning"
      ]
    },
    {
      number: "04",
      title: "Agreement & Deposit",
      icon: CheckSquare,
      description: "With the design approved and the final price set, we sign the sales agreement. A deposit secures your production slot and allows us to begin ordering materials.",
      details: [
        "Finalize contract terms",
        "Secure production slot",
        "Order major components"
      ]
    },
    {
      number: "05",
      title: "Production & Build",
      icon: Hammer,
      description: "Our master fabricators get to work. From reinforcing the frame to installing the hood system, we handle everything in-house. We keep you updated with photos as your kitchen comes to life.",
      details: [
        "Structural fabrication & wall installation",
        "Systems installation (Gas, Electric, Plumbing)",
        "Final equipment mount & testing"
      ]
    }
  ];

  return (
    <>
      <PageHeader
        title="Our Build Process"
        subtitle="From concept to keys in hand, we have a proven system to deliver high-quality mobile kitchens on time and on budget."
      />

      {/* Steps Breakdown */}
      <Section className="bg-white">
        <Container>
          <div className="space-y-24">
             {steps.map((step, index) => (
                <div key={index} className={`flex flex-col md:flex-row gap-12 items-start ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
                   
                   {/* Visual / Number Side */}
                   <div className="w-full md:w-1/3 flex flex-col items-center md:items-start text-center md:text-left relative">
                      <div className="text-[8rem] leading-none font-black text-gray-100 absolute -top-12 -left-4 -z-10 select-none">
                        {step.number}
                      </div>
                      <div className="bg-primary/10 p-6 rounded-full inline-block mb-6 text-primary relative z-10">
                        <step.icon size={48} strokeWidth={1.5} />
                      </div>
                      <h3 className="text-3xl font-black uppercase text-secondary mb-2 relative z-10 tracking-tight">
                        {step.title}
                      </h3>
                      <div className="w-12 h-1 bg-primary mb-4 md:mr-auto mx-auto md:mx-0"></div>
                   </div>

                   {/* Content Side */}
                   <div className="w-full md:w-2/3 bg-gray-50 p-8 rounded-xl border border-gray-100 hover:border-primary/30 transition-colors duration-300">
                      <p className="text-gray-600 text-lg leading-relaxed mb-8">
                        {step.description}
                      </p>
                      <h4 className="text-sm font-bold uppercase text-gray-400 tracking-wider mb-4">
                        Key Activities
                      </h4>
                      <ul className="space-y-3">
                        {step.details.map((detail, i) => (
                          <li key={i} className="flex items-center text-secondary font-medium">
                            <ArrowRight size={16} className="text-primary mr-3 shrink-0" />
                            {detail}
                          </li>
                        ))}
                      </ul>
                   </div>
                </div>
             ))}
          </div>
        </Container>
      </Section>

      <CTASection
        title="Ready to Start Your Journey?"
        subtitle="The first step is the easiest. Tell us about your project and let's see if we're a good fit."
        buttonText="Start A Quote Request"
        buttonHref="/quote"
      />
    </>
  );
}
