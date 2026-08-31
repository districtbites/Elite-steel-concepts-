import React from "react";
import Container from "./Container";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle }) => {
  return (
    <div className="relative bg-[#0a0a0a] pt-40 pb-20 md:pt-48 md:pb-24 overflow-hidden border-b border-[#1a1a1a]">
      {/* Brutalist Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "repeating-linear-gradient(0deg, #fff 0px, #fff 1px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, #fff 0px, #fff 1px, transparent 1px, transparent 40px)" }} />
      
      {/* Sharp Accent Line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-primary" />

      <Container className="relative z-10 text-center">
        <div className="inline-flex items-center gap-3 mb-6">
           <div className="w-2 h-2 bg-primary" />
           <span className="text-primary font-black uppercase tracking-[0.2em] text-[10px]">Elite Steel Concepts</span>
           <div className="w-2 h-2 bg-primary" />
        </div>
        <h1 className="text-5xl md:text-7xl font-black uppercase text-white mb-6 tracking-tighter leading-none">
          {title}
        </h1>
        {subtitle && (
          <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto font-bold uppercase tracking-widest leading-relaxed">
            {subtitle}
          </p>
        )}
      </Container>
    </div>
  );
};

export default PageHeader;
