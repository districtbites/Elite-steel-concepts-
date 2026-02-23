import React from "react";
import Image from "next/image";
import Container from "./ui/Container";
import Button from "./ui/Button";
import { PageSection } from "@/lib/db";

interface HeroProps {
  imageAlts?: { [key: string]: string };
  content?: PageSection;
}

const Hero = ({ imageAlts, content }: HeroProps) => {
  return (
    <section className="relative min-h-screen flex items-start justify-center bg-secondary pb-20">
      {/* Background Image / Overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/30 z-10" />
        <Image 
            src="https://images.unsplash.com/photo-1565123409695-7b5ef63a48b9?q=80&w=1920&auto=format&fit=crop"
            alt={imageAlts?.hero || "Elite Steel Concepts Custom Food Truck Construction"}
            fill
            priority
            className="object-cover opacity-60 transform scale-105 animate-slow-zoom"
        />
      </div>

      <Container className="relative z-20 text-center md:text-left h-full flex flex-col justify-start pt-32 md:pt-40">
        <div className="max-w-4xl space-y-8 animate-fade-in-up">
          {/* Location Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs md:text-sm font-semibold uppercase tracking-wider mb-4">
            <span className="w-2 h-2 rounded-full bg-primary mr-2 animate-pulse"></span>
            Based in Manassas, VA | Serving DMV & Nationwide
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight uppercase tracking-tight">
            {content?.title ? (
                <>
                    {content.title.split('<br/>').map((part, i) => (
                        <React.Fragment key={i}>
                            {part}
                            {i < content.title!.split('<br/>').length - 1 && <br className="hidden md:block"/>}
                        </React.Fragment>
                    ))}
                </>
            ) : (
                <>
                    Custom Food Trucks, <br className="hidden md:block"/>
                    Trailers & Mobile Kitchens <br className="hidden md:block"/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">
                      Built to Perform
                    </span>
                </>
            )}
          </h1>

          {/* Subheadline */}
          <div className="text-lg md:text-xl text-gray-300 max-w-2xl leading-relaxed md:mr-auto whitespace-pre-line">
            {content?.content || (
                <>
                    Design. Fabrication. Ready to Serve. <br className="hidden md:inline"/> 
                    We turn your culinary vision into a high-performance mobile business.
                </>
            )}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 pt-4">
            <Button href="/quote" variant="primary" size="lg" icon className="w-full sm:w-auto shadow-2xl shadow-primary/20">
              {content?.ctaText || "Request a Quote"}
            </Button>
            <Button href="/portfolio" variant="outline" size="lg" className="w-full sm:w-auto text-white border-white hover:bg-white hover:text-secondary">
              View Portfolio
            </Button>
          </div>
        </div>
      </Container>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex flex-col items-center animate-bounce">
        <span className="text-white/50 text-xs uppercase tracking-widest mb-2">Scroll</span>
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-1">
            <div className="w-1 h-3 bg-primary rounded-full animate-scroll-down"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
