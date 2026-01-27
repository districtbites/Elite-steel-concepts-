import React from "react";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";
import Link from "next/link";
import Image from "next/image";
import { Truck, Box, PenTool, Wrench, ShieldCheck, ArrowRight, Check, X } from "lucide-react";

export default function ServicesPage() {
  return (
    <>
      {/* Page Header */}
      <div className="bg-secondary pt-32 pb-16 md:pt-40 md:pb-24">
        <Container className="text-center">
          <h1 className="text-4xl md:text-6xl font-black uppercase text-white mb-4 tracking-tight">
            Our Services
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
             We specialize in high-end mobile kitchen fabrication. Whether you need a ground-up build or a complex renovation, we have the expertise to deliver.
          </p>
        </Container>
      </div>

      {/* Primary Services - Split Layouts */}
      <Section className="bg-white">
        <Container>
           {/* Food Trucks */}
           <div className="flex flex-col lg:flex-row items-center gap-12 mb-24">
              <div className="w-full lg:w-1/2 relative aspect-video rounded-lg overflow-hidden shadow-2xl">
                 <Image 
                   src="https://images.unsplash.com/photo-1565123409695-7b5ef63a48b9?q=80&w=800&auto=format&fit=crop" 
                   alt="Custom Food Truck Build"
                   fill
                   className="object-cover"
                 />
              </div>
              <div className="w-full lg:w-1/2">
                 <div className="flex items-center mb-4">
                    <Truck className="text-primary w-8 h-8 mr-3" />
                    <h2 className="text-3xl font-black uppercase text-secondary">Custom Food Trucks</h2>
                 </div>
                 <p className="text-gray-600 text-lg leading-relaxed mb-6">
                    The ultimate mobile billboard. Our custom food trucks are engineered for performance and designed to turn heads. Built on reliable step-van chassis, they offer maximum mobility for hitting multiple locations in a single day.
                 </p>
                 <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
                    {["Step Van Conversions", "New & Used Chassis Sourcing", "Generator Installation", "Full Graphic Wraps"].map((item, i) => (
                       <li key={i} className="flex items-center text-gray-700 font-medium">
                          <Check size={18} className="text-primary mr-2" /> {item}
                       </li>
                    ))}
                 </ul>
                 <Link href="/services/custom-food-trucks">
                    <Button variant="outline" className="border-secondary text-secondary hover:bg-secondary hover:text-white">
                       Explore Food Trucks
                    </Button>
                 </Link>
              </div>
           </div>

           {/* Concession Trailers */}
           <div className="flex flex-col lg:flex-row-reverse items-center gap-12">
              <div className="w-full lg:w-1/2 relative aspect-video rounded-lg overflow-hidden shadow-2xl">
                 <Image 
                   src="https://images.unsplash.com/photo-1596792342371-d41c4849206c?q=80&w=800&auto=format&fit=crop" 
                   alt="Custom Concession Trailer"
                   fill
                   className="object-cover"
                 />
              </div>
              <div className="w-full lg:w-1/2">
                 <div className="flex items-center mb-4">
                    <Box className="text-primary w-8 h-8 mr-3" />
                    <h2 className="text-3xl font-black uppercase text-secondary">Concession Trailers</h2>
                 </div>
                 <p className="text-gray-600 text-lg leading-relaxed mb-6">
                    Maximize your kitchen space and lower your overhead. Trailers are perfect for semi-permanent locations, festivals, and high-volume events where you need more room to operate.
                 </p>
                 <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
                    {["Custom Sizes (10' - 30')", "Porch & Smoker Builds", "Lower Maintenance Costs", "Detachable Towing"].map((item, i) => (
                       <li key={i} className="flex items-center text-gray-700 font-medium">
                          <Check size={18} className="text-primary mr-2" /> {item}
                       </li>
                    ))}
                 </ul>
                 <Link href="/services/custom-food-trailers">
                    <Button variant="outline" className="border-secondary text-secondary hover:bg-secondary hover:text-white">
                       Explore Trailers
                    </Button>
                 </Link>
              </div>
           </div>
        </Container>
      </Section>

      {/* Comparison Section */}
      <Section className="bg-gray-50 border-y border-gray-200">
         <Container>
            <div className="text-center mb-16">
               <h2 className="text-3xl font-black uppercase text-secondary mb-4">Truck vs. Trailer</h2>
               <p className="text-gray-500 max-w-2xl mx-auto">Not sure which one is right for you? Compare the key differences to make an informed decision.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
               {/* Truck Card */}
               <div className="bg-white p-8 rounded-lg shadow-lg border-t-4 border-secondary">
                  <h3 className="text-2xl font-bold uppercase text-secondary mb-6 text-center">Food Truck</h3>
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
               <div className="bg-white p-8 rounded-lg shadow-lg border-t-4 border-primary">
                  <h3 className="text-2xl font-bold uppercase text-secondary mb-6 text-center">Concession Trailer</h3>
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
               <h2 className="text-3xl font-black uppercase text-secondary mb-4">Support Services</h2>
               <div className="w-24 h-1 bg-primary mx-auto"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <div className="p-6 border border-gray-100 rounded-lg hover:shadow-lg transition-shadow bg-gray-50 text-center">
                  <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-primary shadow-sm">
                     <PenTool size={32} />
                  </div>
                  <h3 className="text-xl font-bold uppercase text-secondary mb-3">Kitchen Design</h3>
                  <p className="text-gray-500 text-sm">
                     Expert workflow analysis and 2D floor plans to maximize efficiency in your small space.
                  </p>
               </div>
               <div className="p-6 border border-gray-100 rounded-lg hover:shadow-lg transition-shadow bg-gray-50 text-center">
                  <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-primary shadow-sm">
                     <Wrench size={32} />
                  </div>
                  <h3 className="text-xl font-bold uppercase text-secondary mb-3">Repairs & Upgrades</h3>
                  <p className="text-gray-500 text-sm">
                     From hood system fixes to generator service, we keep your existing fleet running.
                  </p>
               </div>
               <div className="p-6 border border-gray-100 rounded-lg hover:shadow-lg transition-shadow bg-gray-50 text-center">
                  <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-primary shadow-sm">
                     <ShieldCheck size={32} />
                  </div>
                  <h3 className="text-xl font-bold uppercase text-secondary mb-3">Code Compliance</h3>
                  <p className="text-gray-500 text-sm">
                     We ensure all builds meet local health and fire safety codes for your specific county.
                  </p>
               </div>
            </div>
         </Container>
      </Section>
    </>
  );
}
