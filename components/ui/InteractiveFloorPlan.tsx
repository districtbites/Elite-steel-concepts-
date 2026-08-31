"use client";

import React, { useState } from "react";
import Container from "@/components/ui/Container";
import { 
  Flame, 
  Droplets, 
  Wind, 
  Zap, 
  ShieldCheck, 
  Coffee,
  X
} from "lucide-react";
import Image from "next/image";

interface Hotspot {
  id: string;
  x: number; // percentage from left
  y: number; // percentage from top
  title: string;
  description: string;
  icon: React.ElementType;
}

const hotspots: Hotspot[] = [
  {
    id: "fire-suppression",
    x: 48,
    y: 40,
    title: "Ansul Fire Suppression",
    description: "Commercial-grade fire suppression system integrated directly into the exhaust hood, ensuring 100% compliance with strict municipal fire codes.",
    icon: Flame,
  },
  {
    id: "prep-area",
    x: 30,
    y: 40,
    title: "Sanitary Prep Zone",
    description: "NSF-certified stainless steel prep tables with integrated refrigeration underneath to maximize workflow efficiency during peak rushes.",
    icon: Coffee,
  },
  {
    id: "sinks",
    x: 17,
    y: 50,
    title: "3-Compartment Sink",
    description: "Mandatory health-code compliant 3-compartment sink setup with a dedicated separate hand-washing station and high-capacity water tanks.",
    icon: Droplets,
  },
  {
    id: "serving-window",
    x: 52,
    y: 69,
    title: "High-Throughput Window",
    description: "Oversized, tempered glass serving window with hydraulic awnings and exterior LED lighting to attract customers and speed up order handoffs.",
    icon: Wind,
  },
  {
    id: "generator",
    x: 19,
    y: 68,
    title: "Heavy-Duty Power",
    description: "Enclosed, ultra-quiet commercial generator compartment mounted securely to the reinforced chassis, wired to a high-capacity breaker panel.",
    icon: Zap,
  },
];

export default function InteractiveFloorPlan() {
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);

  const activeData = hotspots.find((h) => h.id === activeHotspot);

  return (
    <section className="bg-[#050505] py-20 md:py-32 relative overflow-hidden">
      {/* Blueprint Background Grid */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, #333 1px, transparent 1px),
            linear-gradient(to bottom, #333 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, #primary 1px, transparent 1px),
            linear-gradient(to bottom, #primary 1px, transparent 1px)
          `,
          backgroundSize: '200px 200px'
        }}
      />

      <Container>
        <div className="text-center mb-16 relative z-10">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-12 bg-primary" />
            <span className="text-primary text-xs font-black uppercase tracking-[0.25em]">
              Technical Excellence
            </span>
            <div className="h-px w-12 bg-primary" />
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter leading-tight mb-6">
            Interactive <span className="text-primary">Floor Plan</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Explore the anatomy of a fully compliant Elite Steel Concepts food truck. Click the glowing hotspots on the blueprint to see the commercial-grade equipment and engineering that goes into every build.
          </p>
        </div>

        <div className="relative max-w-6xl mx-auto flex flex-col lg:flex-row gap-12 items-center lg:items-start z-10">
          
          {/* Blueprint Area */}
          <div className="w-full lg:w-2/3 relative bg-[#0a0a0a] border-2 border-[#1a1a1a] shadow-2xl overflow-hidden rounded-xl">
            <div className="relative w-full">
              <Image 
                src="/blueprint.png" 
                alt="Food Truck Floor Plan Blueprint" 
                width={1024}
                height={1024}
                className="w-full h-auto object-cover opacity-90 mix-blend-screen"
                priority
              />
              
              {/* Hotspots */}
              {hotspots.map((spot) => (
                <button
                  key={spot.id}
                  onClick={() => setActiveHotspot(spot.id)}
                  className="absolute z-20 -translate-x-1/2 -translate-y-1/2 group"
                  style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                >
                  {/* Radar pulse effect */}
                  <div className="absolute inset-0 rounded-full bg-primary/60 animate-ping opacity-75 group-hover:bg-white/50" />
                  
                  {/* Core button */}
                  <div className={`relative w-8 h-8 md:w-12 md:h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 shadow-[0_0_15px_rgba(255,165,0,0.4)] ${
                    activeHotspot === spot.id 
                      ? 'bg-primary border-white text-white scale-110' 
                      : 'bg-[#0a0a0a]/80 backdrop-blur-sm border-primary text-primary hover:bg-primary hover:border-white hover:text-white hover:scale-110'
                  }`}>
                    <spot.icon size={18} className="md:w-6 md:h-6" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Details Panel */}
          <div className="w-full lg:w-1/3 min-h-[300px]">
            {activeData ? (
              <div className="bg-[#0f0f0f] border border-[#1a1a1a] p-8 h-full flex flex-col relative animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="w-16 h-16 bg-primary/10 flex items-center justify-center mb-6">
                  <activeData.icon size={32} className="text-primary" />
                </div>
                <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-4">
                  {activeData.title}
                </h3>
                <p className="text-gray-400 leading-relaxed text-sm">
                  {activeData.description}
                </p>
                <div className="mt-auto pt-8 flex items-center gap-2 text-xs font-black text-primary uppercase tracking-widest">
                  <ShieldCheck size={14} /> Code Compliant
                </div>
              </div>
            ) : (
              <div className="bg-[#0a0a0a] border border-dashed border-[#1a1a1a] p-8 h-full flex flex-col items-center justify-center text-center text-gray-600">
                <div className="w-16 h-16 rounded-full border-2 border-gray-800 flex items-center justify-center mb-4">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                </div>
                <p className="font-bold uppercase tracking-widest text-xs">
                  Select a glowing hotspot on the blueprint to view specifications.
                </p>
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
