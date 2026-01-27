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
  },
  {
    letter: "M",
    kitchen: "14-16FT KITCHEN",
    truck: "22-24FT TRUCK",
    label: "MEDIUM",
    description: "THIS IS THE MOST POPULAR FOOD TRUCK SIZE. VERY VERSATILE.",
  },
  {
    letter: "L",
    kitchen: "17-18FT KITCHEN",
    truck: "25-27FT TRUCK",
    label: "LARGE",
    description: "GREAT SIZE IF YOU NEED SPACE OR HAVE A LARGE MENU.",
  },
  {
    letter: "XL",
    kitchen: "20-22FT KITCHEN",
    truck: "29-30FT TRUCK",
    label: "X-LARGE",
    description: "IF YOU PLAN ON DOING A LOT OF VOLUME AT MAJOR EVENTS AND WANT ROOM TO GROW.",
  },
];

const SizeSelection = () => {
  return (
    <Section className="bg-white text-secondary py-24">
      <Container>
        <div className="text-center mb-20">
          <p className="text-primary uppercase tracking-widest text-sm mb-4 font-bold">
            Not Sure How Much Space You Will Need?
          </p>
          <h2 className="text-6xl md:text-7xl font-sans font-black uppercase italic mb-6 text-secondary tracking-tighter">
            Size Matters
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            Whether you're new to the food truck business, or you're considering an upgrade, size does matter.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-t border-gray-200">
          {sizes.map((item, index) => (
            <div 
              key={index} 
              className={`flex flex-col border-gray-200 ${
                index !== sizes.length - 1 ? "lg:border-r" : ""
              } ${
                index % 2 !== 1 ? "md:border-r lg:border-r-0" : ""
              } border-b lg:border-b-0`}
            >
              {/* Image & Letter Section - White Background */}
              <div className="relative w-full aspect-square bg-white flex items-center justify-center overflow-hidden">
                {/* Background Large Letter */}
                <span className="absolute inset-0 flex items-center justify-center text-[12rem] font-black text-primary/10 select-none pointer-events-none">
                  {item.letter}
                </span>
                
                {/* Truck Image */}
                <div className="relative w-full h-full z-10 flex items-center justify-center">
                  <Image
                    src="/food-truck-base.png"
                    alt={`${item.label} Food Truck`}
                    width={500}
                    height={300}
                    className="object-contain w-[90%] drop-shadow-xl"
                  />
                </div>
              </div>

              {/* Text Info - Black Background */}
              <div className="flex-1 flex flex-col items-center text-center p-8 bg-secondary">
                <div className="mt-auto">
                  <p className="text-[10px] font-bold tracking-[0.2em] text-primary mb-2 uppercase">
                    {item.kitchen} | {item.truck}
                  </p>
                  <h3 className="text-3xl font-black mb-6 tracking-tight text-white">
                    {item.label}
                  </h3>
                  <p className="text-[11px] leading-relaxed text-gray-400 font-bold tracking-wider max-w-[200px] mx-auto uppercase">
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
