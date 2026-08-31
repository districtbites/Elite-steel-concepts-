"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { 
  MapPin, 
  ArrowRight, 
  Search, 
  Navigation, 
  LayoutGrid, 
  ListFilter, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  Truck,
  RotateCcw,
  SlidersHorizontal,
  Flame,
  Building2
} from "lucide-react";
import { LocationEntry } from "@/lib/db";

interface LocationsDirectoryProps {
  locations: LocationEntry[];
}

const STATE_META: Record<string, { name: string; dept: string; highlight: string }> = {
  VA: { 
    name: "Virginia", 
    dept: "Virginia Dept of Health (VDH 12VAC5-421)", 
    highlight: "Fabrication Headquarters & Statewide Delivery" 
  },
  DC: { 
    name: "Washington DC", 
    dept: "DC Health Mobile Food Vending Division (Title 25)", 
    highlight: "Direct DC Permitting & Fire Marshal Coordination" 
  },
  MD: { 
    name: "Maryland", 
    dept: "Maryland Dept of Health (COMAR 10.15.03)", 
    highlight: "Montgomery, PG, Howard & Baltimore Metro Delivery" 
  },
  WV: { 
    name: "West Virginia", 
    dept: "WV DHHR Bureau for Public Health (64 CSR 17)", 
    highlight: "Eastern Panhandle & Statewide Transport" 
  },
  PA: { 
    name: "Pennsylvania", 
    dept: "PA Dept of Agriculture Bureau of Food Safety (Title 7)", 
    highlight: "Greater Philadelphia, Central PA & Pittsburgh" 
  },
  DE: { 
    name: "Delaware", 
    dept: "Delaware DPH Office of Food Protection", 
    highlight: "First State & Delmarva Coastal Delivery" 
  },
  NC: { 
    name: "North Carolina", 
    dept: "NCDHHS Mobile Food Standards (15A NCAC 18A)", 
    highlight: "Research Triangle, Charlotte & Coastal NC" 
  },
  TN: { 
    name: "Tennessee", 
    dept: "Tennessee Dept of Health (Chapter 1200-23-01)", 
    highlight: "Tri-Cities, Knoxville & Nashville Corridor" 
  },
  SC: { 
    name: "South Carolina", 
    dept: "SCDPH Bureau of Environmental Health (Reg 61-25)", 
    highlight: "Upstate, Midlands & Lowcountry Delivery" 
  },
  KY: { 
    name: "Kentucky", 
    dept: "Kentucky CHFS Mobile Food Code (902 KAR 45:005)", 
    highlight: "Bluegrass Region & Ohio River Valley" 
  },
  NJ: { 
    name: "New Jersey", 
    dept: "NJDOH Public Health Sanitation (N.J.A.C. 8:24)", 
    highlight: "Garden State & Mid-Atlantic Express Transport" 
  },
  OH: { 
    name: "Ohio", 
    dept: "Ohio Dept of Health Uniform Food Safety Code", 
    highlight: "Buckeye State & Midwest Transport" 
  },
};

const STATE_ORDER = ["VA", "DC", "MD", "WV", "PA", "DE", "NC", "TN", "SC", "KY", "NJ", "OH"];

const FEATURED_HUBS = [
  { name: "Manassas, VA (HQ)", slug: "manassas-va" },
  { name: "Washington, DC", slug: "washington-dc" },
  { name: "Richmond, VA", slug: "richmond-va" },
  { name: "Baltimore, MD", slug: "baltimore-md" },
  { name: "Raleigh, NC", slug: "raleigh-nc" },
  { name: "Charlotte, NC", slug: "charlotte-nc" },
  { name: "Philadelphia, PA", slug: "philadelphia-pa" },
  { name: "Virginia Beach, VA", slug: "virginia-beach-va" },
];

export default function LocationsDirectory({ locations }: LocationsDirectoryProps) {
  const [selectedState, setSelectedState] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [viewMode, setViewMode] = useState<"grid" | "compact">("grid");
  const [sortBy, setSortBy] = useState<"distance" | "alpha">("distance");

  // Calculate available states and counts
  const stateCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: locations.length };
    locations.forEach((loc) => {
      counts[loc.state] = (counts[loc.state] || 0) + 1;
    });
    return counts;
  }, [locations]);

  // Filter locations by state & query
  const filteredLocations = useMemo(() => {
    return locations.filter((loc) => {
      const matchesState = selectedState === "ALL" || loc.state === selectedState;
      const q = searchQuery.toLowerCase().trim();
      const stateName = STATE_META[loc.state]?.name || loc.state;
      const matchesQuery =
        !q ||
        loc.city.toLowerCase().includes(q) ||
        loc.state.toLowerCase().includes(q) ||
        stateName.toLowerCase().includes(q) ||
        loc.distance.toLowerCase().includes(q);
      return matchesState && matchesQuery;
    });
  }, [locations, selectedState, searchQuery]);

  // Group and sort filtered locations by state
  const groupedByState = useMemo(() => {
    const groups: Record<string, LocationEntry[]> = {};
    filteredLocations.forEach((loc) => {
      if (!groups[loc.state]) groups[loc.state] = [];
      groups[loc.state].push(loc);
    });

    // Sort items within each state group
    Object.keys(groups).forEach((st) => {
      groups[st].sort((a, b) => {
        if (sortBy === "alpha") {
          return a.city.localeCompare(b.city);
        }
        // Sort by approximate distance number
        const distA = parseInt(a.distance) || 0;
        const distB = parseInt(b.distance) || 0;
        return distA - distB;
      });
    });

    return groups;
  }, [filteredLocations, sortBy]);

  const sortedStateKeys = useMemo(() => {
    return Object.keys(groupedByState).sort((a, b) => {
      const idxA = STATE_ORDER.indexOf(a);
      const idxB = STATE_ORDER.indexOf(b);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return a.localeCompare(b);
    });
  }, [groupedByState]);

  return (
    <div className="space-y-10">
      {/* ─── DIRECTORY CONTROL CENTER ─────────────────────────── */}
      <div className="bg-[#0e0e0e] border border-[#222222] p-6 md:p-8 rounded-sm shadow-2xl relative overflow-hidden">
        {/* Subtle accent glow */}
        <div className="absolute top-0 right-0 w-96 h-32 bg-primary/5 blur-3xl pointer-events-none" />

        {/* Top: Search & View Controls */}
        <div className="flex flex-col lg:flex-row gap-5 items-stretch lg:items-center justify-between pb-6 border-b border-[#1c1c1c]">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-2xl">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-primary">
              <Search size={18} />
            </div>
            <input
              type="text"
              placeholder="Search by city, state, or distance (e.g. Richmond, Raleigh, 15 miles)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#161616] border border-[#2c2c2c] focus:border-primary focus:ring-1 focus:ring-primary text-white text-sm pl-11 pr-24 py-3.5 placeholder-gray-500 font-medium tracking-wide transition-all outline-none rounded-none"
            />
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-xs text-primary font-bold uppercase hover:underline"
              >
                Clear
              </button>
            ) : (
              <span className="absolute inset-y-0 right-0 pr-4 flex items-center text-[10px] uppercase font-black tracking-widest text-gray-500 pointer-events-none">
                330 Cities
              </span>
            )}
          </div>

          {/* View Mode & Sort Switches */}
          <div className="flex items-center gap-3 self-end lg:self-center">
            {/* Sort Toggle */}
            <div className="flex items-center bg-[#161616] border border-[#2c2c2c] p-1">
              <button
                onClick={() => setSortBy("distance")}
                title="Sort by Proximity to Manassas HQ"
                className={`px-3 py-1.5 text-[11px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                  sortBy === "distance"
                    ? "bg-primary text-white shadow-sm"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <Navigation size={12} />
                <span className="hidden sm:inline">Proximity</span>
              </button>
              <button
                onClick={() => setSortBy("alpha")}
                title="Sort Alphabetically (A to Z)"
                className={`px-3 py-1.5 text-[11px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                  sortBy === "alpha"
                    ? "bg-primary text-white shadow-sm"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <SlidersHorizontal size={12} />
                <span className="hidden sm:inline">A–Z</span>
              </button>
            </div>

            {/* View Layout Toggle */}
            <div className="flex items-center bg-[#161616] border border-[#2c2c2c] p-1">
              <button
                onClick={() => setViewMode("grid")}
                title="Card Grid View"
                className={`p-1.5 transition-all ${
                  viewMode === "grid"
                    ? "bg-primary text-white shadow-sm"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <LayoutGrid size={16} />
              </button>
              <button
                onClick={() => setViewMode("compact")}
                title="Compact Directory View"
                className={`p-1.5 transition-all ${
                  viewMode === "compact"
                    ? "bg-primary text-white shadow-sm"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <ListFilter size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Middle: State Category Filter Chips */}
        <div className="pt-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
              <MapPin size={12} className="text-primary" /> Filter by State & Territory
            </span>
            {selectedState !== "ALL" && (
              <button
                onClick={() => setSelectedState("ALL")}
                className="text-[11px] text-primary font-bold uppercase tracking-wider hover:underline flex items-center gap-1"
              >
                <RotateCcw size={11} /> Reset State Filter
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedState("ALL")}
              className={`px-4 py-2 text-xs font-black uppercase tracking-wider transition-all duration-200 border flex items-center gap-2 ${
                selectedState === "ALL"
                  ? "bg-primary text-white border-primary shadow-md shadow-primary/20"
                  : "bg-[#141414] text-gray-300 border-[#262626] hover:border-gray-500 hover:text-white"
              }`}
            >
              <span>All Regions</span>
              <span
                className={`px-1.5 py-0.5 text-[10px] font-bold ${
                  selectedState === "ALL" ? "bg-black/40 text-white" : "bg-[#222222] text-gray-400"
                }`}
              >
                {stateCounts["ALL"] || 0}
              </span>
            </button>

            {STATE_ORDER.map((stateCode) => {
              const count = stateCounts[stateCode] || 0;
              if (count === 0) return null;
              const isSelected = selectedState === stateCode;
              const meta = STATE_META[stateCode];

              return (
                <button
                  key={stateCode}
                  onClick={() => setSelectedState(stateCode)}
                  className={`px-3.5 py-2 text-xs font-black uppercase tracking-wider transition-all duration-200 border flex items-center gap-2 ${
                    isSelected
                      ? "bg-primary text-white border-primary shadow-md shadow-primary/20"
                      : "bg-[#141414] text-gray-300 border-[#262626] hover:border-gray-500 hover:text-white"
                  }`}
                >
                  <span>{meta?.name || stateCode}</span>
                  <span
                    className={`px-1.5 py-0.5 text-[10px] font-bold ${
                      isSelected ? "bg-black/40 text-white" : "bg-[#222222] text-gray-400"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom: Popular Quick-Jump Hubs */}
        <div className="pt-6 mt-6 border-t border-[#1c1c1c] flex flex-col md:flex-row md:items-center gap-3">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 shrink-0 flex items-center gap-1.5">
            <Flame size={12} className="text-primary" /> Major Hubs:
          </span>
          <div className="flex flex-wrap items-center gap-1.5">
            {FEATURED_HUBS.map((hub) => (
              <Link
                key={hub.slug}
                href={`/locations/${hub.slug}`}
                className="text-[11px] font-bold text-gray-400 hover:text-primary hover:border-primary/40 bg-[#161616] border border-[#2a2a2a] px-2.5 py-1 transition-all"
              >
                {hub.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ─── LIVE RESULTS SUMMARY BAR ─────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#111111] border border-[#202020] px-6 py-4 rounded-sm">
        <div className="text-xs font-black uppercase tracking-widest text-gray-300 flex items-center gap-2">
          <Building2 size={15} className="text-primary shrink-0" />
          <span>
            Displaying <span className="text-primary font-black">{filteredLocations.length}</span>{" "}
            Active Service {filteredLocations.length === 1 ? "Location" : "Locations"}
            {selectedState !== "ALL" && (
              <span> across <strong className="text-white">{STATE_META[selectedState]?.name || selectedState}</strong></span>
            )}
            {searchQuery && <span> matching "{searchQuery}"</span>}
          </span>
        </div>
        
        <div className="flex items-center gap-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
          <span className="flex items-center gap-1 text-emerald-400">
            <ShieldCheck size={14} /> 100% Health Code Guaranteed
          </span>
          <span className="hidden md:inline text-gray-600">&bull;</span>
          <span className="hidden md:flex items-center gap-1 text-gray-400">
            <Truck size={14} className="text-primary" /> Turnkey Delivery
          </span>
        </div>
      </div>

      {/* ─── ZERO SEARCH RESULTS ──────────────────────────────── */}
      {filteredLocations.length === 0 && (
        <div className="border border-dashed border-[#2d2d2d] p-16 text-center bg-[#0d0d0d] space-y-5 rounded-sm">
          <MapPin size={42} className="mx-auto text-primary opacity-70 animate-bounce" />
          <h3 className="text-2xl font-black text-white uppercase tracking-tight">
            No Location Matches Found
          </h3>
          <p className="text-gray-400 text-sm max-w-lg mx-auto leading-relaxed">
            We couldn't find a dedicated page for "{searchQuery}". However, Elite Steel Concepts delivers custom food trucks and concession trailers nationwide to every city across all 48 states.
          </p>
          <div className="pt-3 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => {
                setSelectedState("ALL");
                setSearchQuery("");
              }}
              className="inline-flex items-center gap-2 bg-[#1f1f1f] text-white hover:bg-gray-700 font-black uppercase tracking-wider text-xs px-6 py-3.5 transition-colors border border-gray-700"
            >
              <RotateCcw size={14} /> Reset Filters
            </button>
            <Link
              href="/quote"
              className="inline-flex items-center gap-2 bg-primary hover:bg-orange-600 text-white font-black uppercase tracking-wider text-xs px-8 py-3.5 transition-all shadow-lg shadow-primary/20"
            >
              Request City Quote <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      )}

      {/* ─── STATE SECTIONS ───────────────────────────────────── */}
      {sortedStateKeys.map((stateCode) => {
        const stateLocs = groupedByState[stateCode];
        const meta = STATE_META[stateCode] || { name: stateCode, dept: `${stateCode} Health Dept`, highlight: "Regional Coverage" };

        return (
          <div key={stateCode} className="space-y-6 pt-4 first:pt-0">
            {/* Enhanced State Section Header Banner */}
            <div className="bg-gradient-to-r from-[#141414] via-[#111111] to-[#0d0d0d] border border-[#242424] border-l-4 border-l-primary p-6 rounded-sm shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">
                    {meta.name}
                  </h3>
                  <span className="text-[11px] font-black uppercase tracking-widest bg-primary/10 text-primary border border-primary/30 px-2.5 py-0.5">
                    {stateCode}
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-wider bg-[#1f1f1f] text-gray-400 px-2.5 py-0.5">
                    {stateLocs.length} {stateLocs.length === 1 ? "City Page" : "City Pages"}
                  </span>
                </div>
                <p className="text-xs text-gray-400 font-medium">
                  {meta.highlight} &middot; <span className="text-gray-500">{meta.dept}</span>
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest hidden sm:inline">
                  Logistics from Manassas HQ
                </span>
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
            </div>

            {/* ═══ VIEW MODE: CARD GRID ═══ */}
            {viewMode === "grid" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {stateLocs.map((location) => {
                  const isHome = location.distance.startsWith("0 miles");

                  return (
                    <Link
                      key={location.slug}
                      href={`/locations/${location.slug}`}
                      id={`location-card-${location.slug}`}
                      className="group relative bg-[#0e0e0e] hover:bg-[#151515] border border-[#222222] hover:border-primary/60 p-5 rounded-sm transition-all duration-300 flex flex-col justify-between hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-0.5"
                    >
                      {/* Top subtle highlight line */}
                      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                      <div>
                        {/* Card Header: State badge & Distance */}
                        <div className="flex items-center justify-between mb-3.5">
                          <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-none">
                            {location.state}
                          </span>
                          
                          {isHome ? (
                            <span className="text-[9px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/40 px-2 py-0.5 flex items-center gap-1">
                              <Sparkles size={10} /> Fabrication HQ
                            </span>
                          ) : (
                            <span className="text-[10px] text-gray-400 font-semibold flex items-center gap-1">
                              <Navigation size={10} className="text-primary/70 shrink-0" />
                              {location.distance}
                            </span>
                          )}
                        </div>

                        {/* City Title */}
                        <h4 className="text-lg font-black text-white uppercase tracking-tight group-hover:text-primary transition-colors leading-snug mb-2">
                          {location.city}
                        </h4>

                        {/* Health Code Tag */}
                        <p className="text-[11px] text-gray-500 leading-relaxed line-clamp-2 mb-4">
                          Turnkey food truck builds & 100% {location.state} health department approval.
                        </p>
                      </div>

                      {/* Card Footer: Action */}
                      <div className="pt-3 border-t border-[#1c1c1c] flex items-center justify-between text-[11px] font-black uppercase tracking-wider text-primary group-hover:text-white transition-colors">
                        <span>View City Specs</span>
                        <ArrowRight
                          size={13}
                          className="text-primary group-hover:text-white group-hover:translate-x-1 transition-all"
                        />
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* ═══ VIEW MODE: COMPACT DIRECTORY LIST ═══ */}
            {viewMode === "compact" && (
              <div className="bg-[#0e0e0e] border border-[#222222] p-6 rounded-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-3">
                  {stateLocs.map((location) => {
                    const isHome = location.distance.startsWith("0 miles");

                    return (
                      <Link
                        key={location.slug}
                        href={`/locations/${location.slug}`}
                        className="group flex items-center justify-between py-2 px-3 border-b border-[#1a1a1a] hover:border-primary/40 hover:bg-[#161616] transition-all rounded-sm"
                      >
                        <div className="flex items-center gap-2 overflow-hidden">
                          <MapPin size={12} className="text-primary shrink-0 group-hover:scale-110 transition-transform" />
                          <span className="text-xs font-bold text-gray-200 group-hover:text-primary transition-colors truncate">
                            {location.city}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-1.5 shrink-0 ml-2">
                          {isHome ? (
                            <span className="text-[9px] font-black uppercase text-amber-400 bg-amber-500/10 px-1.5 py-0.5">
                              HQ
                            </span>
                          ) : (
                            <span className="text-[10px] text-gray-500 font-medium group-hover:text-gray-400">
                              {location.distance}
                            </span>
                          )}
                          <ArrowRight size={11} className="text-gray-600 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
