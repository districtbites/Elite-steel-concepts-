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
  RotateCcw,
  SlidersHorizontal,
  Flame,
  ChevronDown,
  ChevronUp,
  ArrowUpRight,
} from "lucide-react";
import { LocationEntry } from "@/lib/db";

type DirectoryLocation = Pick<LocationEntry, "slug" | "city" | "state" | "distance">;

interface LocationsDirectoryProps {
  locations: DirectoryLocation[];
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

/** Cities shown per state before "Show all" is clicked (grid view, no search). */
const INITIAL_CITIES_PER_STATE = 8;

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
  const [expandedStates, setExpandedStates] = useState<Set<string>>(new Set());

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
    const groups: Record<string, DirectoryLocation[]> = {};
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

  const toggleState = (stateCode: string) => {
    setExpandedStates((prev) => {
      const next = new Set(prev);
      if (next.has(stateCode)) next.delete(stateCode);
      else next.add(stateCode);
      return next;
    });
  };

  const chipClass = (active: boolean) =>
    `shrink-0 whitespace-nowrap px-3.5 py-2 text-xs font-black uppercase tracking-wider transition-all duration-200 border flex items-center gap-2 ${
      active
        ? "bg-[#0a0a0a] text-white border-[#0a0a0a]"
        : "bg-white text-gray-600 border-gray-200 hover:border-black hover:text-black"
    }`;

  const chipCountClass = (active: boolean) =>
    `text-[10px] font-black ${active ? "text-primary" : "text-gray-400"}`;

  const toggleClass = (active: boolean) =>
    `px-3 py-1.5 text-[11px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${
      active ? "bg-[#0a0a0a] text-white" : "text-gray-500 hover:text-black"
    }`;

  return (
    <div className="space-y-14 md:space-y-20">
      {/* ─── DIRECTORY CONTROLS ───────────────────────────────── */}
      <div className="bg-white border border-gray-200 shadow-[0_24px_60px_-35px_rgba(0,0,0,0.35)] p-5 md:p-8">
        {/* Search & View Controls */}
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
          <div className="relative flex-1 max-w-2xl">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-primary">
              <Search size={18} />
            </div>
            <input
              type="text"
              placeholder="Search by city or state (e.g. Richmond, Raleigh)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#faf9f7] border border-gray-200 focus:border-black focus:bg-white text-black text-sm pl-11 pr-20 py-4 placeholder-gray-400 font-medium transition-all outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-xs text-primary font-bold uppercase hover:underline"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 self-end lg:self-center">
            <div className="flex items-center bg-gray-50 border border-gray-200 p-1">
              <button onClick={() => setSortBy("distance")} title="Sort by distance from Manassas HQ" className={toggleClass(sortBy === "distance")}>
                <Navigation size={12} />
                <span className="hidden sm:inline">Nearest</span>
              </button>
              <button onClick={() => setSortBy("alpha")} title="Sort alphabetically" className={toggleClass(sortBy === "alpha")}>
                <SlidersHorizontal size={12} />
                <span className="hidden sm:inline">A–Z</span>
              </button>
            </div>
            <div className="flex items-center bg-gray-50 border border-gray-200 p-1">
              <button onClick={() => setViewMode("grid")} title="Card view" className={`p-1.5 transition-all ${viewMode === "grid" ? "bg-[#0a0a0a] text-primary" : "text-gray-500 hover:text-black"}`}>
                <LayoutGrid size={16} />
              </button>
              <button onClick={() => setViewMode("compact")} title="List view" className={`p-1.5 transition-all ${viewMode === "compact" ? "bg-[#0a0a0a] text-primary" : "text-gray-500 hover:text-black"}`}>
                <ListFilter size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* State Filter Chips */}
        <div className="pt-6 mt-6 border-t border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-500 flex items-center gap-2">
              <MapPin size={12} className="text-primary" /> Filter by State
            </span>
            {selectedState !== "ALL" && (
              <button
                onClick={() => setSelectedState("ALL")}
                className="text-[11px] text-primary font-bold uppercase tracking-wider hover:underline flex items-center gap-1"
              >
                <RotateCcw size={11} /> Show All States
              </button>
            )}
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 -mx-5 px-5 md:mx-0 md:px-0 md:pb-0 md:flex-wrap md:overflow-visible">
            <button onClick={() => setSelectedState("ALL")} className={chipClass(selectedState === "ALL")}>
              <span>All Regions</span>
              <span className={chipCountClass(selectedState === "ALL")}>{stateCounts["ALL"] || 0}</span>
            </button>
            {STATE_ORDER.map((stateCode) => {
              const count = stateCounts[stateCode] || 0;
              if (count === 0) return null;
              const isSelected = selectedState === stateCode;
              return (
                <button key={stateCode} onClick={() => setSelectedState(stateCode)} className={chipClass(isSelected)}>
                  <span>{STATE_META[stateCode]?.name || stateCode}</span>
                  <span className={chipCountClass(isSelected)}>{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Major Hubs */}
        <div className="pt-6 mt-6 border-t border-gray-100 flex flex-col md:flex-row md:items-center gap-3">
          <span className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-500 shrink-0 flex items-center gap-1.5">
            <Flame size={12} className="text-primary" /> Major Hubs:
          </span>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {FEATURED_HUBS.map((hub) => (
              <Link
                key={hub.slug}
                href={`/locations/${hub.slug}`}
                className="text-sm font-semibold text-gray-600 hover:text-black border-b border-transparent hover:border-primary pb-0.5 transition-colors"
              >
                {hub.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-gray-500 -mt-8 md:-mt-12">
        Showing <strong className="text-black">{filteredLocations.length}</strong>{" "}
        {filteredLocations.length === 1 ? "location" : "locations"}
        {selectedState !== "ALL" && <> in <strong className="text-black">{STATE_META[selectedState]?.name || selectedState}</strong></>}
        {searchQuery && <> matching &ldquo;{searchQuery}&rdquo;</>}
      </p>

      {/* ─── ZERO SEARCH RESULTS ──────────────────────────────── */}
      {filteredLocations.length === 0 && (
        <div className="border border-dashed border-gray-300 p-12 md:p-16 text-center bg-white space-y-5">
          <MapPin size={40} className="mx-auto text-primary" />
          <h3 className="text-2xl font-black text-black uppercase tracking-tight">No Location Matches Found</h3>
          <p className="text-gray-600 text-sm max-w-lg mx-auto leading-relaxed">
            We couldn&apos;t find a dedicated page for &ldquo;{searchQuery}&rdquo;. However, Elite Steel Concepts delivers custom food trucks and concession trailers nationwide to every city across all 48 states.
          </p>
          <div className="pt-3 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => {
                setSelectedState("ALL");
                setSearchQuery("");
              }}
              className="inline-flex items-center gap-2 bg-white text-black hover:border-black font-black uppercase tracking-wider text-xs px-6 py-3.5 transition-colors border border-gray-300"
            >
              <RotateCcw size={14} /> Reset Filters
            </button>
            <Link
              href="/quote"
              className="inline-flex items-center gap-2 bg-primary text-black font-black uppercase tracking-wider text-xs px-8 py-3.5 transition-all shadow-lg shadow-primary/20 hover:-translate-y-0.5"
            >
              Get a Free Quote <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      )}

      {/* ─── STATE SECTIONS ───────────────────────────────────── */}
      {sortedStateKeys.map((stateCode, stateIndex) => {
        const stateLocs = groupedByState[stateCode];
        const meta = STATE_META[stateCode] || { name: stateCode, dept: `${stateCode} Health Dept`, highlight: "Regional Coverage" };
        const canCollapse = viewMode === "grid" && !searchQuery && stateLocs.length > INITIAL_CITIES_PER_STATE;
        const isExpanded = expandedStates.has(stateCode);
        const visibleLocs = canCollapse && !isExpanded ? stateLocs.slice(0, INITIAL_CITIES_PER_STATE) : stateLocs;

        return (
          <div key={stateCode}>
            {/* State header */}
            <div className="grid md:grid-cols-[1fr_auto] md:items-end gap-4 md:gap-8 pb-6 mb-8 border-b border-gray-300">
              <div>
                <p className="flex items-center gap-3 text-primary text-[11px] font-black uppercase tracking-[0.3em] mb-3">
                  <span className="h-px w-8 bg-primary" />
                  State {String(stateIndex + 1).padStart(2, "0")} &middot; {stateCode}
                </p>
                <h3 className="text-3xl md:text-5xl font-black text-black uppercase tracking-tighter leading-none">{meta.name}</h3>
                <p className="mt-3 text-sm text-gray-500 max-w-2xl leading-relaxed">
                  {meta.highlight}
                  <span className="hidden sm:inline text-gray-300 mx-2">|</span>
                  <span className="block sm:inline text-gray-400">{meta.dept}</span>
                </p>
              </div>
              <div className="flex items-baseline gap-2 md:justify-end">
                <span className="text-5xl md:text-6xl font-black text-black leading-none tracking-tighter">{stateLocs.length}</span>
                <span className="text-[11px] font-black uppercase tracking-[0.25em] text-gray-400">
                  {stateLocs.length === 1 ? "City" : "Cities"}
                </span>
              </div>
            </div>

            {/* ═══ VIEW MODE: CARD GRID ═══ */}
            {viewMode === "grid" && (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
                {visibleLocs.map((location) => {
                  const isHome = location.distance.startsWith("0 miles");
                  return (
                    <Link
                      key={location.slug}
                      href={`/locations/${location.slug}`}
                      id={`location-card-${location.slug}`}
                      className="group relative flex flex-col justify-between min-h-[118px] md:min-h-[140px] p-4 md:p-6 border transition-colors duration-500 bg-white border-gray-200 hover:bg-primary/5 hover:border-primary hover:shadow-[0_18px_40px_-26px_rgba(247,147,30,0.6)]"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-primary">
                          {isHome ? <><span className="md:hidden">HQ</span><span className="hidden md:inline">Fabrication HQ</span></> : location.state}
                        </span>
                        <ArrowUpRight
                          size={18}
                          className="shrink-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-gray-300 group-hover:text-primary"
                        />
                      </div>
                      <div className="min-w-0">
                        <h4
                          className="text-sm md:text-lg font-black uppercase tracking-tight leading-tight truncate transition-colors duration-500 text-black group-hover:text-primary"
                        >
                          {location.city}
                        </h4>
                        <div className="mt-2.5 h-px w-8 bg-primary transition-all duration-500 group-hover:w-14" />
                        <p
                          className="mt-2.5 text-[11px] md:text-xs transition-colors duration-500 text-gray-500"
                        >
                          {isHome ? "Our shop & showroom" : <>{location.distance}<span className="hidden md:inline"> from HQ</span></>}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* ═══ VIEW MODE: COMPACT LIST ═══ */}
            {viewMode === "compact" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6">
                {visibleLocs.map((location) => {
                  const isHome = location.distance.startsWith("0 miles");
                  return (
                    <Link
                      key={location.slug}
                      href={`/locations/${location.slug}`}
                      className="group flex items-center justify-between py-2.5 px-2 border-b border-gray-100 hover:border-primary hover:bg-gray-50 transition-all"
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        <MapPin size={13} className="text-primary shrink-0" />
                        <span className="text-sm font-semibold text-gray-800 group-hover:text-black truncate">{location.city}</span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0 ml-2">
                        {isHome ? (
                          <span className="text-[10px] font-black uppercase text-black bg-primary px-1.5 py-0.5">HQ</span>
                        ) : (
                          <span className="text-xs text-gray-400">{location.distance}</span>
                        )}
                        <ArrowRight size={12} className="text-gray-400 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

            {canCollapse && (
              <div className="mt-8 text-center">
                <button
                  onClick={() => toggleState(stateCode)}
                  className="inline-flex items-center gap-3 border border-black text-black hover:bg-black hover:text-white font-black uppercase tracking-[0.2em] text-[11px] px-8 py-4 transition-colors duration-300"
                >
                  {isExpanded ? (
                    <>Show Less <ChevronUp size={14} /></>
                  ) : (
                    <>Show All {stateLocs.length} {meta.name} Cities <ChevronDown size={14} /></>
                  )}
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
