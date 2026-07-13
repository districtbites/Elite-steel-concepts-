import React from "react";
import Link from "next/link";
import Image from "next/image";
import Container from "./ui/Container";
import Section from "./ui/Section";
import { ArrowRight, CheckCircle2 } from "lucide-react";

interface ServiceSelectionProps {
  imageAlts?: { [key: string]: string };
  truckImage?: { url: string; alt: string };
  trailerImage?: { url: string; alt: string };
}

const ServiceSelection = ({ imageAlts, truckImage, trailerImage }: ServiceSelectionProps) => {
  const truckSrc = truckImage?.url || "https://images.pexels.com/photos/4393021/pexels-photo-4393021.jpeg?auto=compress&cs=tinysrgb&w=1200";
  const truckAlt = truckImage?.alt || imageAlts?.["truck-platform"] || "Custom Food Truck";
  const trailerSrc = trailerImage?.url || "https://images.pexels.com/photos/5696001/pexels-photo-5696001.jpeg?auto=compress&cs=tinysrgb&w=1200";
  const trailerAlt = trailerImage?.alt || imageAlts?.["trailer-platform"] || "Custom Food Trailer";

  return (
    <Section className="bg-white py-24">
      <Container>
        <div className="text-center mb-16 space-y-4">
          <span className="text-primary font-bold tracking-widest uppercase text-sm">
            Start Your Build
          </span>
          <h2 className="text-4xl md:text-6xl font-black text-secondary uppercase tracking-tight">
            Choose Your Platform
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed">
            The foundation of your business starts here. Select the mobile kitchen that fits your vision and budget.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Truck Card */}
          <Link href="/services/custom-food-trucks" className="group relative block h-[500px] md:h-[600px] w-full overflow-hidden rounded-2xl">
             <Image 
                src={truckSrc} 
                alt={truckAlt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent transition-opacity duration-300" />
             
             <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 text-white">
                <h3 className="text-3xl md:text-4xl font-black uppercase mb-4 group-hover:text-primary transition-colors">
                  Food Trucks
                </h3>
                <p className="text-gray-300 mb-6 line-clamp-2 group-hover:line-clamp-none transition-all">
                   The ultimate all-in-one mobile kitchen. Perfect for high-mobility businesses and city streets.
                </p>
                
                {/* Features List */}
                <div className="mb-8 space-y-2 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                   <div className="flex items-center text-sm font-medium"><CheckCircle2 className="w-4 h-4 text-primary mr-2"/> Maximum Mobility</div>
                   <div className="flex items-center text-sm font-medium"><CheckCircle2 className="w-4 h-4 text-primary mr-2"/> Compact Footprint</div>
                   <div className="flex items-center text-sm font-medium"><CheckCircle2 className="w-4 h-4 text-primary mr-2"/> Iconic Brand Presence</div>
                </div>

                <span className="inline-flex items-center text-sm font-bold uppercase tracking-wider bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full hover:bg-primary hover:text-secondary transition-all">
                   Explore Trucks <ArrowRight className="ml-2 w-4 h-4" />
                </span>
             </div>
          </Link>

          {/* Trailer Card */}
          <Link href="/services/custom-food-trailers" className="group relative block h-[500px] md:h-[600px] w-full overflow-hidden rounded-2xl">
             <Image 
                src={trailerSrc} 
                alt={trailerAlt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent transition-opacity duration-300" />
             
             <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 text-white">
                <h3 className="text-3xl md:text-4xl font-black uppercase mb-4 group-hover:text-primary transition-colors">
                  Concession Trailers
                </h3>
                <p className="text-gray-300 mb-6 line-clamp-2 group-hover:line-clamp-none transition-all">
                   Spacious, flexible, and cost-effective. Ideal for stationary events, festivals, and large crews.
                </p>

                {/* Features List */}
                 <div className="mb-8 space-y-2 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                   <div className="flex items-center text-sm font-medium"><CheckCircle2 className="w-4 h-4 text-primary mr-2"/> Lower Initial Cost</div>
                   <div className="flex items-center text-sm font-medium"><CheckCircle2 className="w-4 h-4 text-primary mr-2"/> Flexible Towing Vehicle</div>
                   <div className="flex items-center text-sm font-medium"><CheckCircle2 className="w-4 h-4 text-primary mr-2"/> Larger Kitchen Space</div>
                </div>

                <span className="inline-flex items-center text-sm font-bold uppercase tracking-wider bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full hover:bg-primary hover:text-secondary transition-all">
                   Explore Trailers <ArrowRight className="ml-2 w-4 h-4" />
                </span>
             </div>
          </Link>
        </div>
      </Container>
    </Section>
  );
};

export default ServiceSelection;
