import React from "react";
import Link from "next/link";
import Image from "next/image";
import Container from "./ui/Container";
import Section from "./ui/Section";
import { ArrowRight } from "lucide-react";

const ServiceSelection = () => {
  return (
    <Section className="bg-white">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-secondary mb-4 font-serif">
            Truck or Trailer
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed">
            Food trucks provide more space and greater mobility, <br className="hidden md:block" />
            while food trailers involve lower costs and come in lots of different sizes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
          {/* Truck Card */}
          <Link href="/services/custom-food-trucks" className="group block">
            <div className="relative border border-gray-200 rounded-lg overflow-hidden transition-all duration-500 hover:shadow-2xl hover:border-primary/50 bg-gray-50 text-center p-8 h-full flex flex-col items-center">
              <div className="mb-6 relative w-full aspect-[4/3] flex items-center justify-center">
                 {/* Placeholder for Truck Image */}
                 {/* In a real scenario, we'd use a real image. Using a colored div/text for now if no image? 
                     Actually, I'll use a placeholder image URL. */}
                 <div className="w-full h-full bg-gray-200 rounded-md overflow-hidden relative">
                    <Image 
                        src="https://images.unsplash.com/photo-1565123409695-7b5ef63a48b9?q=80&w=800&auto=format&fit=crop" 
                        alt="Custom Food Truck"
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                 </div>
              </div>
              <h3 className="text-5xl md:text-6xl font-black uppercase text-secondary/10 group-hover:text-primary/20 transition-colors absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0 whitespace-nowrap pointer-events-none">
                TRUCK
              </h3>
              <div className="relative z-10 mt-auto">
                 <h3 className="text-3xl font-bold uppercase text-secondary group-hover:text-primary transition-colors mb-2">
                    Custom Trucks
                 </h3>
                 <span className="inline-flex items-center text-sm font-bold uppercase tracking-wider text-gray-400 group-hover:text-primary transition-colors">
                    View Options <ArrowRight className="ml-2 w-4 h-4" />
                 </span>
              </div>
            </div>
          </Link>

          {/* Trailer Card */}
          <Link href="/services/custom-food-trailers" className="group block">
             <div className="relative border border-gray-200 rounded-lg overflow-hidden transition-all duration-500 hover:shadow-2xl hover:border-primary/50 bg-gray-50 text-center p-8 h-full flex flex-col items-center">
              <div className="mb-6 relative w-full aspect-[4/3] flex items-center justify-center">
                 <div className="w-full h-full bg-gray-200 rounded-md overflow-hidden relative">
                    <Image 
                        src="https://images.unsplash.com/photo-1596792342371-d41c4849206c?q=80&w=800&auto=format&fit=crop" 
                        alt="Custom Food Trailer"
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                 </div>
              </div>
              <h3 className="text-5xl md:text-6xl font-black uppercase text-secondary/10 group-hover:text-primary/20 transition-colors absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0 whitespace-nowrap pointer-events-none">
                TRAILER
              </h3>
               <div className="relative z-10 mt-auto">
                 <h3 className="text-3xl font-bold uppercase text-secondary group-hover:text-primary transition-colors mb-2">
                    Custom Trailers
                 </h3>
                 <span className="inline-flex items-center text-sm font-bold uppercase tracking-wider text-gray-400 group-hover:text-primary transition-colors">
                    View Options <ArrowRight className="ml-2 w-4 h-4" />
                 </span>
              </div>
            </div>
          </Link>
        </div>
      </Container>
    </Section>
  );
};

export default ServiceSelection;
