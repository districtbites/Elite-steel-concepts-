import React from "react";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import Link from "next/link";
import Image from "next/image";
import { Truck, Box, PenTool, Wrench, ShieldCheck, ArrowRight, Check, X } from "lucide-react";

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        title="Our Services"
        subtitle="We specialize in high-end mobile kitchen fabrication. Whether you need a ground-up build or a complex renovation, we have the expertise to deliver."
      />

      {/* Primary Services - Split Layouts */}
      <Section className="bg-white">
        <Container>
           {/* Food Trucks */}
           <div className="flex flex-col lg:flex-row items-center gap-12 mb-24">
              <div className="w-full lg:w-1/2 relative aspect-video rounded-xl overflow-hidden shadow-2xl hover-lift">
                 <Image 
                    src="https://images.unsplash.com/photo-1565123409695-7b5ef63a48b9?q=80&w=800&auto=format&fit=crop" 
                    alt="Custom Food Truck Build"
                    fill
                    className="object-cover"
                 />
              </div>
              <div className="w-full lg:w-1/2">
                 <div className="flex items-center mb-4">
                    <div className="bg-primary/10 p-3 rounded-full mr-4">
                      <Truck className="text-primary w-7 h-7" />
                    </div>
                    <h2 className="text-3xl font-black uppercase text-secondary tracking-tight">Custom Food Trucks</h2>
                 </div>
                 <p className="text-gray-600 text-lg leading-relaxed mb-6">
                    The ultimate mobile billboard. Our custom food trucks are engineered for performance and designed to turn heads. Built on reliable step-van chassis, they offer maximum mobility for hitting multiple locations in a single day.
                 </p>
                 <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
                    {["Step Van Conversions", "New & Used Chassis Sourcing", "Generator Installation", "Full Graphic Wraps"].map((item, i) => (
                       <li key={i} className="flex items-center text-gray-700 font-medium">
                          <Check size={18} className="text-primary mr-2 shrink-0" /> {item}
                       </li>
                    ))}
                 </ul>
                 <Button href="/services/custom-food-trucks" variant="outline" className="border-secondary text-secondary hover:bg-secondary hover:text-white">
                    Explore Food Trucks
                 </Button>
              </div>
           </div>

           {/* Concession Trailers */}
           <div className="flex flex-col lg:flex-row-reverse items-center gap-12">
              <div className="w-full lg:w-1/2 relative aspect-video rounded-xl overflow-hidden shadow-2xl hover-lift">
                 <Image 
                    src="https://images.unsplash.com/photo-1596792342371-d41c4849206c?q=80&w=800&auto=format&fit=crop" 
                    alt="Custom Concession Trailer"
                    fill
                    className="object-cover"
                 />
              </div>
              <div className="w-full lg:w-1/2">
                 <div className="flex items-center mb-4">
                    <div className="bg-primary/10 p-3 rounded-full mr-4">
                      <Box className="text-primary w-7 h-7" />
                    </div>
                    <h2 className="text-3xl font-black uppercase text-secondary tracking-tight">Concession Trailers</h2>
                 </div>
                 <p className="text-gray-600 text-lg leading-relaxed mb-6">
                    Maximize your kitchen space and lower your overhead. Trailers are perfect for semi-permanent locations, festivals, and high-volume events where you need more room to operate.
                 </p>
                 <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
                    {["Custom Sizes (10' - 30')", "Porch & Smoker Builds", "Lower Maintenance Costs", "Detachable Towing"].map((item, i) => (
                       <li key={i} className="flex items-center text-gray-700 font-medium">
                          <Check size={18} className="text-primary mr-2 shrink-0" /> {item}
                       </li>
                    ))}
                 </ul>
                 <Button href="/services/custom-food-trailers" variant="outline" className="border-secondary text-secondary hover:bg-secondary hover:text-white">
                    Explore Trailers
                 </Button>
              </div>
           </div>
        </Container>
      </Section>

      {/* Comparison Section */}
      <Section className="bg-gray-50 border-y border-gray-100">
         <Container>
            <div className="text-center mb-16">
               <span className="text-primary font-bold tracking-widest uppercase text-sm mb-2 block">Compare</span>
               <h2 className="text-3xl md:text-5xl font-black uppercase text-secondary mb-4 tracking-tight">Truck vs. Trailer</h2>
               <p className="text-gray-500 max-w-2xl mx-auto">Not sure which one is right for you? Compare the key differences to make an informed decision.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
               {/* Truck Card */}
               <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-secondary hover-lift">
                  <h3 className="text-2xl font-black uppercase text-secondary mb-6 text-center tracking-tight">Food Truck</h3>
                  <div className="space-y-4">
                     <div className="flex items-start">
                        <Check className="text-green-500 mr-3 shrink-0" />
                        <span className="text-gray-600"><strong>High Mobility:</strong> Drive from spot to spot instantly.</span>
                     </div>
                     <div className="flex items-start">
                        <Check className="text-green-500 mr-3 shrink-0" />
                        <span className="text-gray-600"><strong>Compact Footprint:</strong> Fits in standard parking spaces.</span>
                     </div>
                     <div className="flex items-start">
                        <X className="text-red-500 mr-3 shrink-0" />
                        <span className="text-gray-600"><strong>Higher Cost:</strong> Engine maintenance & insurance.</span>
                     </div>
                     <div className="flex items-start">
                        <X className="text-red-500 mr-3 shrink-0" />
                        <span className="text-gray-600"><strong>Less Space:</strong> Generally smaller kitchen area.</span>
                     </div>
                  </div>
               </div>

               {/* Trailer Card */}
               <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-primary hover-lift">
                  <h3 className="text-2xl font-black uppercase text-secondary mb-6 text-center tracking-tight">Concession Trailer</h3>
                  <div className="space-y-4">
                     <div className="flex items-start">
                        <Check className="text-green-500 mr-3 shrink-0" />
                        <span className="text-gray-600"><strong>Lower Cost:</strong> Less maintenance, cheaper insurance.</span>
                     </div>
                     <div className="flex items-start">
                        <Check className="text-green-500 mr-3 shrink-0" />
                        <span className="text-gray-600"><strong>More Space:</strong> Larger kitchens & storage options.</span>
                     </div>
                     <div className="flex items-start">
                        <X className="text-red-500 mr-3 shrink-0" />
                        <span className="text-gray-600"><strong>Towing Required:</strong> Need a heavy-duty truck.</span>
                     </div>
                     <div className="flex items-start">
                        <X className="text-red-500 mr-3 shrink-0" />
                        <span className="text-gray-600"><strong>Harder to Park:</strong> Difficult in tight city streets.</span>
                     </div>
                  </div>
               </div>
            </div>
         </Container>
      </Section>

      {/* Support Services */}
      <Section className="bg-white">
         <Container>
            <div className="text-center mb-16">
               <span className="text-primary font-bold tracking-widest uppercase text-sm mb-2 block">Additional Offerings</span>
               <h2 className="text-3xl md:text-5xl font-black uppercase text-secondary mb-4 tracking-tight">Support Services</h2>
               <div className="w-24 h-1 bg-primary mx-auto"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <div className="p-8 border border-gray-100 rounded-xl hover:shadow-xl hover-lift transition-all bg-gray-50 text-center group">
                  <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-primary shadow-sm group-hover:shadow-md transition-shadow">
                     <PenTool size={32} />
                  </div>
                  <h3 className="text-xl font-black uppercase text-secondary mb-3 tracking-tight">Kitchen Design</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                     Expert workflow analysis and 2D floor plans to maximize efficiency in your small space.
                  </p>
               </div>
               <div className="p-8 border border-gray-100 rounded-xl hover:shadow-xl hover-lift transition-all bg-gray-50 text-center group">
                  <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-primary shadow-sm group-hover:shadow-md transition-shadow">
                     <Wrench size={32} />
                  </div>
                  <h3 className="text-xl font-black uppercase text-secondary mb-3 tracking-tight">Repairs & Upgrades</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                     From hood system fixes to generator service, we keep your existing fleet running.
                  </p>
               </div>
               <div className="p-8 border border-gray-100 rounded-xl hover:shadow-xl hover-lift transition-all bg-gray-50 text-center group">
                  <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-primary shadow-sm group-hover:shadow-md transition-shadow">
                     <ShieldCheck size={32} />
                  </div>
                  <h3 className="text-xl font-black uppercase text-secondary mb-3 tracking-tight">Code Compliance</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                     We ensure all builds meet local health and fire safety codes for your specific county.
                  </p>
               </div>
            </div>
         </Container>
      </Section>
    </>
  );
}
