import React from "react";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";
import CTASection from "@/components/ui/CTASection";
import Image from "next/image";
import { Check, Shield, Award, Users, Target, Zap } from "lucide-react";
import { getSEO } from "@/lib/db";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSEO();
  const pageSeo = seo.pages?.["about"]; // I'll add this to DB later
  
  return {
    title: pageSeo?.title || `About Us | ${seo.siteTitle}`,
    description: pageSeo?.description || "Learn about Elite Steel Concepts, the premier custom food truck and trailer manufacturer in the DMV area.",
    keywords: pageSeo?.keywords || seo.keywords,
  };
}

export default function AboutPage() {
  const values = [
    {
      title: "Precision Engineering",
      description: "We don't just build; we engineer. Every weld and every wire is placed with surgical precision.",
      icon: Zap
    },
    {
      title: "Client-Centric Design",
      description: "Your workflow is our priority. We design layouts that make your staff 30% faster on the line.",
      icon: Target
    },
    {
      title: "Code Compliance",
      description: "We guarantee that every build meets local health and fire safety regulations or we make it right.",
      icon: Shield
    }
  ];

  return (
    <>
      <PageHeader
        title="Our Story"
        subtitle="Crafting the heart of mobile commerce since 2012. We are more than fabricators; we are your partners in entrepreneurship."
      />

      {/* Intro Section */}
      <Section className="bg-white">
        <Container>
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="w-full lg:w-1/2 relative aspect-square rounded-2xl overflow-hidden shadow-2xl">
              <Image 
                src="https://images.unsplash.com/photo-1590402444816-a118f0951307?q=80&w=800&auto=format&fit=crop"
                alt="Elite Steel Concepts Workshop"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-secondary/10" />
            </div>
            <div className="w-full lg:w-1/2 space-y-8">
              <span className="text-primary font-bold tracking-widest uppercase text-sm block">Since 2012</span>
              <h2 className="text-4xl md:text-5xl font-black uppercase text-secondary tracking-tight leading-tight">
                Empowering the Next Generation of <span className="text-primary">Food Pioneers</span>
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed font-light">
                 At <strong className="text-secondary font-bold">Elite Steel Concepts</strong>, we believe that every great chef deserves a kitchen that works as hard as they do. Founded on the principles of integrity and master craftsmanship, we have helped hundreds of entrepreneurs transition from dreamers to business owners.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                 <div className="flex items-start gap-3">
                    <div className="bg-primary/10 p-2 rounded-lg text-primary mt-1">
                       <Check size={20} />
                    </div>
                    <div>
                       <h4 className="font-bold text-secondary">Expert Fabrication</h4>
                       <p className="text-sm text-gray-500">In-house welding and design team.</p>
                    </div>
                 </div>
                 <div className="flex items-start gap-3">
                    <div className="bg-primary/10 p-2 rounded-lg text-primary mt-1">
                       <Check size={20} />
                    </div>
                    <div>
                       <h4 className="font-bold text-secondary">DMV Specialists</h4>
                       <p className="text-sm text-gray-500">Deep knowledge of local health codes.</p>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Stats / Numbers */}
      <Section className="bg-secondary py-20 overflow-hidden relative">
         <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 -skew-x-12 translate-x-20" />
         <Container className="relative z-10">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
               {[
                 { label: "Builds Completed", value: "350+", icon: Award },
                 { label: "Happy Clients", value: "280+", icon: Users },
                 { label: "Years Experience", value: "12+", icon: Zap },
                 { label: "States Served", value: "48", icon: Globe }
               ].map((stat, i) => (
                 <div key={i} className="text-center group">
                    <div className="bg-white/5 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary group-hover:text-secondary transition-all duration-300">
                       <stat.icon className="text-primary group-hover:text-secondary" size={28} />
                    </div>
                    <div className="text-4xl md:text-5xl font-black text-white mb-2">{stat.value}</div>
                    <div className="text-gray-400 text-xs font-bold uppercase tracking-widest">{stat.label}</div>
                 </div>
               ))}
            </div>
         </Container>
      </Section>

      {/* Values */}
      <Section className="bg-gray-50">
        <Container>
           <div className="text-center mb-20">
              <span className="text-primary font-bold tracking-widest uppercase text-sm mb-2 block">Our DNA</span>
              <h2 className="text-3xl md:text-5xl font-black uppercase text-secondary mb-4 tracking-tight">The Elite Standard</h2>
              <div className="w-24 h-1 bg-primary mx-auto"></div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {values.map((v, i) => (
                <div key={i} className="bg-white p-10 rounded-2xl shadow-xl hover-lift border-b-4 border-transparent hover:border-primary transition-all duration-300">
                   <div className="bg-secondary/5 w-14 h-14 rounded-xl flex items-center justify-center mb-8 text-primary">
                      <v.icon size={30} />
                   </div>
                   <h3 className="text-2xl font-black uppercase text-secondary mb-4 tracking-tight">{v.title}</h3>
                   <p className="text-gray-500 leading-loose">
                      {v.description}
                   </p>
                </div>
              ))}
           </div>
        </Container>
      </Section>

      <CTASection
        title="Ready to Start Your Journey?"
        subtitle="Let's build a business that moves with you. Get your custom quote started today."
        buttonText="Get Free Quote"
        buttonHref="/quote"
      />
    </>
  );
}

const Globe = ({ size, className }: { size?: number, className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);
