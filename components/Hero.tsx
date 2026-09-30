"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Phone, ArrowRight, MapPin, Truck, Shield, Star } from "lucide-react";
import Container from "./ui/Container";
import ReadMore from "./ui/ReadMore";
import { PageSection } from "@/lib/db";

interface HeroProps {
  imageAlts?: { [key: string]: string };
  content?: PageSection;
  heroImage?: { url: string; alt: string };
}

const CYCLING_WORDS = ["Food Trucks", "Trailers", "Mobile Kitchens"];

const STATS = [
  { value: "14+", label: "Years Experience", icon: Star },
  { value: "350+", label: "Custom Builds", icon: Truck },
  { value: "100%", label: "Code Compliant", icon: Shield },
  { value: "48", label: "States Served", icon: MapPin },
];

const Hero = ({ content }: HeroProps) => {
  const [wordIndex, setWordIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setWordIndex((prev) => (prev + 1) % CYCLING_WORDS.length);
        setAnimating(false);
      }, 350);
    }, 3200);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <section className="relative flex flex-col bg-gradient-to-b from-[#1c1c1c] to-[#0a0a0a] overflow-hidden">
      {/* ── Main Content ── */}
      <Container className="relative z-10 pt-32 md:pt-40 pb-10 md:pb-12">
        <div className="max-w-5xl">
          {/* Badge */}
          <div className="hero-badge flex items-center gap-3 mb-8">
            <div className="flex items-center gap-2 bg-primary/10 border border-primary/30 px-4 py-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-primary text-xs font-black uppercase tracking-[0.25em]">
                Based in Manassas, VA
              </span>
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-[clamp(2.5rem,5.2vw,4.75rem)] font-black uppercase tracking-tighter leading-[0.92] mb-8">
            <span className="hero-line-1 block text-white">Custom</span>
            <span className="hero-line-2 block">
              <span
                className="text-primary inline-block transition-all duration-300"
                style={{
                  opacity: animating ? 0 : 1,
                  transform: animating ? "translateY(-10px)" : "translateY(0)",
                }}
              >
                {CYCLING_WORDS[wordIndex]}
              </span>
            </span>
            <span className="hero-line-3 block text-white">
              Built to Perform.
            </span>
          </h1>

          {/* Subheading */}
          <div className="hero-sub max-w-xl mb-8">
            <ReadMore
              text={content?.content || "Design. Fabrication. Ready to Serve. We turn your culinary vision into a high-performance mobile business — 100% health code compliant, on time, on budget."}
              maxLength={180}
              className="text-gray-300 text-lg leading-relaxed"
            />
          </div>

          {/* CTAs */}
          <div className="hero-cta flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-4">
            <Link
              href="/quote"
              id="hero-get-quote-btn"
              className="group inline-flex items-center gap-3 bg-primary hover:bg-orange-600 text-white font-black uppercase tracking-wider text-sm px-8 py-4 transition-all duration-200 hover:-translate-y-0.5 shadow-lg shadow-primary/25 hero-orange-pulse"
            >
              Get a Free Quote
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>

            <a
              href="tel:+15716510337"
              id="hero-call-btn"
              className="inline-flex items-center gap-3 border border-white/30 hover:border-primary text-white hover:text-primary font-black uppercase tracking-wider text-sm px-8 py-4 transition-all duration-200"
            >
              <Phone size={16} />
              (571) 651-0337
            </a>

            <Link
              href="/services"
              id="hero-services-btn"
              className="group inline-flex items-center gap-3 bg-white hover:bg-primary text-black hover:text-white font-black uppercase tracking-wider text-sm px-8 py-4 transition-all duration-200 hover:-translate-y-0.5"
            >
              Explore Our Services
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>

          {/* Stats — row under the buttons */}
          <div className="hero-stats mt-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10 border border-white/10 w-full md:w-fit">
              {STATS.map(({ value, label, icon: Icon }) => (
                <div
                  key={label}
                  className="flex items-center gap-4 bg-[#141414] hover:bg-[#1a1a1a] px-6 py-4 transition-colors group"
                >
                  <Icon
                    size={18}
                    className="text-primary shrink-0 group-hover:scale-110 transition-transform"
                  />
                  <div>
                    <div className="text-2xl font-black text-white leading-none">
                      {value}
                    </div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                      {label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>

      {/* ── Food trailer + truck illustration on the road ── */}
      <Container className="relative z-10">
        <div className="relative mx-auto max-w-4xl overflow-hidden">
          <svg
            viewBox="0 0 960 190"
            className="w-full h-auto block"
            role="img"
            aria-label="Custom food trailer towed by a food truck"
          >
            <g className="hero-rig">
              {/* Concession trailer */}
              <rect x="20" y="10" width="540" height="124" fill="#d1d5db" />
              {/* Serving window + awning */}
              <rect x="150" y="34" width="250" height="56" fill="#1f2937" />
              <polygon points="138,34 412,34 396,18 154,18" fill="#F7931E" />
              <rect x="150" y="84" width="250" height="8" fill="#9ca3af" />
              {/* Brand stripes */}
              <rect x="20" y="104" width="540" height="10" fill="#F7931E" />
              <rect x="20" y="118" width="540" height="6" fill="#ffffff" />
              <rect x="20" y="128" width="540" height="12" fill="#374151" />
              {/* Hitch */}
              <rect x="560" y="122" width="80" height="6" fill="#4b5563" />

              {/* Food truck */}
              <rect x="640" y="30" width="190" height="112" fill="#F7931E" />
              <rect x="664" y="50" width="120" height="44" fill="#1f2937" />
              <rect x="640" y="116" width="190" height="6" fill="#ffffff" />
              <path d="M830 142 V60 H880 L930 104 V142 Z" fill="#F7931E" />
              <path d="M842 70 H876 L912 104 H842 Z" fill="#1f2937" />
              <rect x="920" y="118" width="30" height="24" fill="#374151" />

              {/* Wheels */}
              {[200, 262, 690, 780, 890].map((cx) => (
                <g key={cx} className="wheel">
                  <circle cx={cx} cy="150" r="24" fill="#111" stroke="#e5e7eb" strokeWidth="3" />
                  <circle cx={cx} cy="150" r="8" fill="#6b7280" />
                  <rect x={cx - 1.5} y="130" width="3" height="12" fill="#6b7280" />
                </g>
              ))}
            </g>
            {/* Road */}
            <rect x="0" y="174" width="960" height="4" fill="#3f3f46" />
          </svg>
        </div>
      </Container>

      {/* ── Bottom hazard stripe ── */}
      <div className="hazard-stripe h-2.5 relative z-10" aria-hidden />
    </section>
  );
};

export default Hero;
