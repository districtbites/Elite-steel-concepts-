import React from "react";
import Container from "./Container";
import Button from "./Button";
import { ArrowRight } from "lucide-react";

interface CTASectionProps {
  title: string;
  subtitle?: string;
  buttonText?: string;
  buttonHref?: string;
  secondaryButtonText?: string;
  secondaryButtonHref?: string;
  titleClassName?: string;
}

const CTASection: React.FC<CTASectionProps> = ({
  title,
  subtitle,
  buttonText = "Request a Quote",
  buttonHref = "/quote",
  secondaryButtonText,
  secondaryButtonHref,
  titleClassName = "text-3xl md:text-5xl lg:text-6xl tracking-tighter leading-none",
}) => {
  return (
    <section className="relative bg-[#0a0a0a] border-y border-[#1a1a1a] py-12 md:py-16 overflow-hidden group">
      {/* Industrial Grid Background */}
      <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "repeating-linear-gradient(45deg, #fff 0px, #fff 1px, transparent 1px, transparent 10px)" }} />
      
      {/* Accent Lines */}
      <div className="absolute top-0 left-0 w-full h-1 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-1000 origin-left" />
      <div className="absolute top-0 right-0 w-1 h-full bg-primary scale-y-0 group-hover:scale-y-100 transition-transform duration-1000 origin-top" />

      <Container className="relative z-10 text-center max-w-4xl">
        <h2 className={`${titleClassName} font-black uppercase text-white mb-4`}>
          {title}
        </h2>
        {subtitle && (
          <p className="text-white/80 text-sm md:text-base font-medium tracking-normal max-w-2xl mx-auto mb-8 leading-relaxed normal-case">
            {subtitle}
          </p>
        )}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href={buttonHref} 
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-primary text-black px-10 py-5 font-black uppercase tracking-[0.2em] text-[10px] hover:bg-orange-600 hover:text-white transition-colors"
            >
                {buttonText} <ArrowRight size={14} />
            </a>
            {secondaryButtonText && secondaryButtonHref && (
                <a 
                  href={secondaryButtonHref} 
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-transparent border border-white/20 text-white px-10 py-5 font-black uppercase tracking-[0.2em] text-[10px] hover:bg-white hover:text-black transition-colors"
                >
                    {secondaryButtonText}
                </a>
            )}
        </div>
      </Container>
    </section>
  );
};

export default CTASection;
