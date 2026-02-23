import React from "react";
import Container from "./Container";
import Button from "./Button";

interface CTASectionProps {
  title: string;
  subtitle?: string;
  buttonText?: string;
  buttonHref?: string;
  secondaryButtonText?: string;
  secondaryButtonHref?: string;
}

const CTASection: React.FC<CTASectionProps> = ({
  title,
  subtitle,
  buttonText = "Request a Quote",
  buttonHref = "/quote",
  secondaryButtonText,
  secondaryButtonHref,
}) => {
  return (
    <section className="relative bg-secondary py-20 md:py-28 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />

      <Container className="relative text-center">
        <h2 className="text-3xl md:text-5xl font-black uppercase text-white mb-6 tracking-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="text-gray-400 max-w-2xl mx-auto text-lg mb-10 leading-relaxed">
            {subtitle}
          </p>
        )}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button href={buttonHref} variant="primary" size="lg" icon className="shadow-2xl shadow-primary/20 min-w-[200px]">
                {buttonText}
            </Button>
            {secondaryButtonText && secondaryButtonHref && (
                <Button href={secondaryButtonHref} variant="outline" size="lg" className="text-white border-white hover:bg-white hover:text-secondary min-w-[200px]">
                    {secondaryButtonText}
                </Button>
            )}
        </div>
      </Container>
    </section>
  );
};

export default CTASection;
