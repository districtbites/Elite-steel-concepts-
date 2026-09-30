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
  Truck,
  Layers,
  Thermometer,
  Sparkles,
  Box,
  Compass,
} from "lucide-react";
import Image from "next/image";

interface Hotspot {
  id: string;
  x: number;
  y: number;
  title: string;
  description: string;
  icon: React.ElementType;
}

interface VehicleLayout {
  id: "truck" | "trailer";
  name: string;
  subtitle: string;
  tagline: string;
  image: string;
  badge: string;
  specs: { label: string; value: string }[];
  hotspots: Hotspot[];
}

const truckData: VehicleLayout = {
  id: "truck",
  name: "Custom Food Truck Interior",
  subtitle: "Integrated Engine & Self-Contained Mobile Kitchen",
  tagline:
    "Designed for high mobility, compact footprint, and fast urban setup.",
  image: "/blueprint.png",
  badge: "Self-Propelled Build",
  specs: [
    { label: "Typical Length", value: "18ft - 30ft Total" },
    { label: "Power Source", value: "Onboard Generator & Engine Auxiliary" },
    { label: "Best For", value: "Urban vending, daily route mobility" },
  ],
  hotspots: [
    {
      id: "truck-driver-cabin",
      x: 84,
      y: 50,
      title: "Driver Cabin & Pass-Through",
      description:
        "Direct walk-through partition between the driving cab and rear commercial cooking area for quick parking-to-cooking transition.",
      icon: Compass,
    },
    {
      id: "truck-fire-suppression",
      x: 48,
      y: 38,
      title: "Ansul Fire Suppression Hood",
      description:
        "Commercial stainless steel exhaust hood integrated with Ansul automatic fire suppression and roof-mounted upblast exhauster.",
      icon: Flame,
    },
    {
      id: "truck-prep-area",
      x: 32,
      y: 38,
      title: "Sanitary Workstation & Underbar Cold Storage",
      description:
        "NSF-certified food grade 304 stainless steel prep counters with heavy-duty undercounter refrigerated drawers.",
      icon: Coffee,
    },
    {
      id: "truck-sinks",
      x: 18,
      y: 48,
      title: "3-Compartment & Hand Sinks",
      description:
        "Health-department required 3-basin dish washing sink plus dedicated hand sink with automatic splash guards and dual water tanks.",
      icon: Droplets,
    },
    {
      id: "truck-serving-window",
      x: 52,
      y: 72,
      title: "Service Window & Order Counter",
      description:
        "Tempered glass sliding window with exterior fold-down customer shelf, hydraulic awnings, and dimmable LED canopy lights.",
      icon: Wind,
    },
    {
      id: "truck-generator",
      x: 18,
      y: 72,
      title: "Enclosed Commercial Power Generator",
      description:
        "Vibration-isolated chassis compartment housing a high-kw commercial generator wired into a 50A breaker distribution panel.",
      icon: Zap,
    },
  ],
};

const trailerData: VehicleLayout = {
  id: "trailer",
  name: "Concession Trailer Interior",
  subtitle: "Spacious Dedicated Kitchen Chassis & Towable Rig",
  tagline:
    "Maximizes interior floor space, ceiling height, and dual service lines.",
  image: "/concession-trailer.png",
  badge: "Towable Heavy Duty",
  specs: [
    { label: "Typical Length", value: "14ft - 32ft Box" },
    { label: "Power Source", value: "Tongue Mount / External Shore Power" },
    { label: "Best For", value: "Festivals, catering, stationary pods" },
  ],
  hotspots: [
    {
      id: "trailer-hitch-tongue",
      x: 88,
      y: 50,
      title: "Propane & Generator Tongue Storage",
      description:
        "Reinforced front V-nose hitch platform designed for dual 100lb propane tanks and enclosed generator mounting.",
      icon: Box,
    },
    {
      id: "trailer-cooking-line",
      x: 52,
      y: 30,
      title: "Expanded Main Cooking Line",
      description:
        "Allows placement of dual deep fryers, flat-top griddles, charbroilers, and full convection ovens under continuous stainless hood canopy.",
      icon: Flame,
    },
    {
      id: "trailer-dual-service",
      x: 52,
      y: 75,
      title: "Dual Serving Windows & POS Bays",
      description:
        "Wide dual awning window setup enabling simultaneous order taking and order pickup for high-volume festival crowds.",
      icon: Wind,
    },
    {
      id: "trailer-wash-station",
      x: 15,
      y: 32,
      title: "High-Capacity Pot & Warewashing",
      description:
        "Deep-bowl NSF stainless steel sink array with integrated drainboards, water heater, and 50+ gallon fresh/gray tanks.",
      icon: Droplets,
    },
    {
      id: "trailer-climate-ac",
      x: 50,
      y: 50,
      title: "Rooftop Commercial HVAC Units",
      description:
        "High-output rooftop heat pump/AC units keeping the interior comfortable even during peak summer high-heat cooking operations.",
      icon: Thermometer,
    },
    {
      id: "trailer-storage-racks",
      x: 15,
      y: 72,
      title: "Bulk Storage & Stand-up Reach-in Cold Room",
      description:
        "Full-height vertical reach-in refrigerator & freezer storage, plus overhead aluminum shelving across the rear wall.",
      icon: Layers,
    },
  ],
};

export default function InteractiveFloorPlan() {
  const [activeSide, setActiveSide] = useState<"truck" | "trailer">("truck");
  const [activeHotspotId, setActiveHotspotId] = useState<string | null>(
    "truck-fire-suppression",
  );

  const activeVehicle = activeSide === "truck" ? truckData : trailerData;
  const activeHotspot =
    activeVehicle.hotspots.find((h) => h.id === activeHotspotId) ||
    activeVehicle.hotspots[0];

  const handleSideSwitch = (side: "truck" | "trailer") => {
    setActiveSide(side);
    const newVehicle = side === "truck" ? truckData : trailerData;
    setActiveHotspotId(newVehicle.hotspots[0].id);
  };

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
          backgroundSize: "40px 40px",
        }}
      />

      <Container>
        <div className="text-center mb-12 relative z-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-12 bg-primary" />
            <span className="text-primary text-xs font-black uppercase tracking-[0.25em]">
              Custom Engineering & Architecture
            </span>
            <div className="h-px w-12 bg-primary" />
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter leading-tight mb-6">
            Interactive{" "}
            <span className="text-primary">Interior Floor Plans</span>
          </h2>
          <p className="text-gray-400 max-w-3xl mx-auto text-base md:text-lg leading-relaxed">
            Compare our precision engineered kitchen layouts. Select between{" "}
            <strong className="text-white">Side 1 (Food Truck Interior)</strong>{" "}
            and{" "}
            <strong className="text-white">
              Side 2 (Concession Trailer Interior)
            </strong>{" "}
            to explore custom equipment placement, code compliance features, and
            workflow ergonomics.
          </p>
        </div>

        {/* Side Selection Selector (Truck Interior vs Trailer Interior) */}
        <div className="relative z-10 max-w-4xl mx-auto mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2 bg-[#0c0c0c] border border-[#222] rounded-2xl shadow-xl">
            {/* Side 1: Truck Interior */}
            <button
              onClick={() => handleSideSwitch("truck")}
              className={`flex items-center justify-between p-4 md:p-6 rounded-xl transition-all duration-300 text-left border ${
                activeSide === "truck"
                  ? "bg-[#161616] border-primary shadow-[0_0_25px_rgba(255,165,0,0.15)]"
                  : "bg-transparent border-transparent hover:bg-[#121212] opacity-70 hover:opacity-100"
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`p-3 rounded-lg ${activeSide === "truck" ? "bg-primary text-black" : "bg-[#1f1f1f] text-gray-400"}`}
                >
                  <Truck size={24} />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-primary mb-1">
                    Side 1
                  </div>
                  <div className="text-lg font-black text-white uppercase tracking-tight">
                    Food Truck Interior
                  </div>
                  <div className="text-xs text-gray-400">
                    Self-Contained Driveable Mobile Kitchen
                  </div>
                </div>
              </div>
              <div
                className={`size-4 rounded-full border-2 flex items-center justify-center ${activeSide === "truck" ? "border-primary bg-primary" : "border-gray-600"}`}
              >
                {activeSide === "truck" && (
                  <div className="size-1.5 rounded-full bg-black" />
                )}
              </div>
            </button>

            {/* Side 2: Trailer Interior */}
            <button
              onClick={() => handleSideSwitch("trailer")}
              className={`flex items-center justify-between p-4 md:p-6 rounded-xl transition-all duration-300 text-left border ${
                activeSide === "trailer"
                  ? "bg-[#161616] border-primary shadow-[0_0_25px_rgba(255,165,0,0.15)]"
                  : "bg-transparent border-transparent hover:bg-[#121212] opacity-70 hover:opacity-100"
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`p-3 rounded-lg ${activeSide === "trailer" ? "bg-primary text-black" : "bg-[#1f1f1f] text-gray-400"}`}
                >
                  <Layers size={24} />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-primary mb-1">
                    Side 2
                  </div>
                  <div className="text-lg font-black text-white uppercase tracking-tight">
                    Trailer Interior
                  </div>
                  <div className="text-xs text-gray-400">
                    Expanded Towable Commercial Kitchen
                  </div>
                </div>
              </div>
              <div
                className={`size-4 rounded-full border-2 flex items-center justify-center ${activeSide === "trailer" ? "border-primary bg-primary" : "border-gray-600"}`}
              >
                {activeSide === "trailer" && (
                  <div className="size-1.5 rounded-full bg-black" />
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Layout Specs Banner */}
        <div className="relative z-10 bg-[#0a0a0a]/80 backdrop-blur-md border border-[#1f1f1f] rounded-xl p-6 mb-10 max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles size={12} /> {activeVehicle.badge}
            </div>
            <h3 className="text-2xl font-black text-white uppercase tracking-tight">
              {activeVehicle.name}
            </h3>
            <p className="text-sm text-gray-400 mt-1">
              {activeVehicle.tagline}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full md:w-auto text-left border-t md:border-t-0 md:border-l border-[#1f1f1f] pt-4 md:pt-0 md:pl-6">
            {activeVehicle.specs.map((spec, idx) => (
              <div
                key={idx}
                className="bg-[#121212] p-3 rounded-lg border border-[#1a1a1a]"
              >
                <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                  {spec.label}
                </div>
                <div className="text-xs font-bold text-white mt-1">
                  {spec.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Blueprint and Specs Grid */}
        <div className="relative max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 items-start z-10">
          {/* Blueprint Area */}
          <div className="w-full lg:w-2/3 relative bg-[#0a0a0a] border-2 border-[#1a1a1a] shadow-2xl overflow-hidden rounded-xl">
            {/* Header overlay badge */}
            <div className="absolute top-4 left-4 z-20 bg-black/80 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-lg text-xs font-bold text-white flex items-center gap-2">
              <span className="size-2 rounded-full bg-primary animate-pulse" />
              <span>
                {activeSide === "truck"
                  ? "SIDE 1: FOOD TRUCK BLUEPRINT"
                  : "SIDE 2: TRAILER BLUEPRINT"}
              </span>
            </div>

            <div className="relative w-full aspect-[16/9] md:aspect-[4/3] min-h-[340px] flex items-center justify-center p-4">
              <Image
                src={activeVehicle.image}
                alt={activeVehicle.name}
                width={1024}
                height={1024}
                className="w-full h-full object-contain opacity-90 mix-blend-screen transition-all duration-500"
                priority
              />

              {/* Hotspots */}
              {activeVehicle.hotspots.map((spot) => (
                <button
                  key={spot.id}
                  onClick={() => setActiveHotspotId(spot.id)}
                  className="absolute z-20 -translate-x-1/2 -translate-y-1/2 group"
                  style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                >
                  {/* Radar pulse effect */}
                  <div className="absolute inset-0 rounded-full bg-primary/60 animate-ping opacity-75 group-hover:bg-white/50" />

                  {/* Core button */}
                  <div
                    className={`relative size-8 md:w-11 md:h-11 rounded-full border-2 flex items-center justify-center transition-all duration-300 shadow-[0_0_15px_rgba(255,165,0,0.4)] ${
                      activeHotspotId === spot.id
                        ? "bg-primary border-white text-white scale-110"
                        : "bg-[#0a0a0a]/80 backdrop-blur-sm border-primary text-primary hover:bg-primary hover:border-white hover:text-white hover:scale-110"
                    }`}
                  >
                    <spot.icon size={18} className="md:size-5" />
                  </div>
                </button>
              ))}
            </div>

            <div className="bg-[#0e0e0e] border-t border-[#1a1a1a] px-6 py-3 flex flex-wrap items-center justify-between text-xs text-gray-500 gap-2">
              <span>Click hotspots on floor plan to view equipment specs</span>
              <span className="text-primary font-bold">
                {activeVehicle.hotspots.length} Key Systems Marked
              </span>
            </div>
          </div>

          {/* Details Panel */}
          <div className="w-full lg:w-1/3 min-h-[360px] flex flex-col">
            <div className="bg-[#0f0f0f] border border-[#1a1a1a] p-8 h-full flex flex-col relative rounded-xl shadow-xl animate-in fade-in duration-300">
              <div className="flex items-center justify-between mb-6">
                <div className="size-14 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
                  <activeHotspot.icon size={28} className="text-primary" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 bg-[#171717] px-3 py-1.5 rounded-full border border-[#222]">
                  {activeSide === "truck"
                    ? "Truck Interior Detail"
                    : "Trailer Interior Detail"}
                </span>
              </div>

              <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-4 leading-tight">
                {activeHotspot.title}
              </h3>

              <p className="text-gray-400 leading-relaxed text-sm mb-6">
                {activeHotspot.description}
              </p>

              <div className="mt-auto pt-6 border-t border-[#1a1a1a] flex flex-col gap-3">
                <div className="flex items-center gap-2 text-xs font-black text-primary uppercase tracking-widest">
                  <ShieldCheck size={16} /> 100% Health & Fire Code Compliant
                </div>
                <p className="text-[11px] text-gray-500 italic">
                  Fabricated using heavy-duty 304 food-grade stainless steel
                  with precision TIG welds.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
