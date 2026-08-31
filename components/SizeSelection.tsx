import React from "react";
import Container from "./ui/Container";
import Section from "./ui/Section";
import Image from "next/image";

const sizes = [
  {
    letter: "S",
    kitchen: "10-11FT KITCHEN",
    truck: "18-21FT TRUCK",
    label: "SMALL",
    description: "SMALL ENTRY LEVEL TRUCK OR TRAILER SIZE.",
    scale: "scale-[0.75]",
  },
  {
    letter: "M",
    kitchen: "14-16FT KITCHEN",
    truck: "22-24FT TRUCK",
    label: "MEDIUM",
    description: "THIS IS THE MOST POPULAR FOOD TRUCK SIZE. VERY VERSATILE.",
    scale: "scale-[0.85]",
  },
  {
    letter: "L",
    kitchen: "17-18FT KITCHEN",
    truck: "25-27FT TRUCK",
    label: "LARGE",
    description: "GREAT SIZE IF YOU NEED SPACE OR HAVE A LARGE MENU.",
    scale: "scale-100",
  },
  {
    letter: "XL",
    kitchen: "20-22FT KITCHEN",
    truck: "29-30FT TRUCK",
    label: "X-LARGE",
    description: "IF YOU PLAN ON DOING A LOT OF VOLUME AT MAJOR EVENTS AND WANT ROOM TO GROW.",
    scale: "scale-[1.15]",
  },
];

const SizeSelection = () => {
  return (
    <Section className="bg-[#0a0a0a] border-y border-[#1a1a1a] relative overflow-hidden">
      {/* Background Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, #fff 0px, #fff 1px, transparent 1px, transparent 60px), repeating-linear-gradient(90deg, #fff 0px, #fff 1px, transparent 1px, transparent 60px)",
        }}
      />
      
      <Container className="relative z-10">
        <div className="text-center mb-20">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-12 bg-primary" />
            <span className="text-primary text-xs font-black uppercase tracking-[0.25em]">
              Not Sure How Much Space You Will Need?
            </span>
            <div className="h-px w-12 bg-primary" />
          </div>
          <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white mb-6">
            Size <span className="text-primary">Matters</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Whether you're new to the food truck business, or you're considering an upgrade, size does matter. Select the footprint that matches your menu and volume.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {sizes.map((item, index) => (
            <div 
              key={index} 
              className="group bg-[#0f0f0f] border border-[#1a1a1a] flex flex-col relative overflow-hidden transition-colors hover:bg-[#151515] hover:border-primary/50"
            >
              {/* Top Accent Line */}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left z-20" />

              {/* Image & Letter Section */}
              <div className="relative w-full aspect-square flex items-center justify-center overflow-hidden border-b border-[#1a1a1a] bg-[#111111]">
                {/* Background Large Letter */}
                <span className="absolute inset-0 flex items-center justify-center text-[12rem] font-black text-white/[0.02] select-none pointer-events-none transition-transform duration-700 group-hover:scale-110">
                  {item.letter}
                </span>
                
                {/* Truck Image Container - with dynamic scale */}
                <div className={`relative w-full h-full z-10 flex items-center justify-center transition-transform duration-500 ease-out group-hover:-translate-y-2 ${item.scale}`}>
                  <Image
                    src="/food-truck-transparent.png"
                    alt={`${item.label} Food Truck`}
                    fill
                    sizes="(max-width: 768px) 100vw, 300px"
                    className="object-contain p-6 drop-shadow-2xl"
                  />
                </div>
              </div>

              {/* Text Info */}
              <div className="flex-1 flex flex-col items-center text-center p-8 bg-black/20">
                <div className="mt-auto">
                  <p className="text-[10px] font-black tracking-[0.2em] text-primary mb-3 uppercase">
                    {item.kitchen} | {item.truck}
                  </p>
                  <h3 className="text-3xl font-black mb-4 tracking-tight text-white uppercase group-hover:text-primary transition-colors">
                    {item.label}
                  </h3>
                  <p className="text-[11px] leading-relaxed text-gray-500 font-bold tracking-wider max-w-[200px] mx-auto uppercase">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
};

export default SizeSelection;
