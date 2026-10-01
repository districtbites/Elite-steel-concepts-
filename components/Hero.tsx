"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Phone, ArrowRight, MapPin, Truck, Shield, Star } from "lucide-react";
import Container from "./ui/Container";
import ReadMore from "./ui/ReadMore";
import HeroSlider, { HeroSlide } from "./ui/HeroSlider";
import { PageSection } from "@/lib/db";

interface HeroProps {
  imageAlts?: { [key: string]: string };
  content?: PageSection;
  heroImage?: { url: string; alt: string };
  slides?: HeroSlide[];
}

const CYCLING_WORDS = ["Food Trucks", "Trailers", "Mobile Kitchens"];

const STATS = [
  { value: "14+", label: "Years Experience", icon: Star },
  { value: "350+", label: "Custom Builds", icon: Truck },
  { value: "100%", label: "Code Compliant", icon: Shield },
  { value: "48", label: "States Served", icon: MapPin },
];

const Hero = ({ content, slides = [] }: HeroProps) => {
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
      <Container className="relative z-10 pt-32 md:pt-40 pb-14 md:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-16 items-center">
          {/* Left: copy + CTAs */}
          <div className="lg:col-span-7">
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
            <h1 className="text-[clamp(2.5rem,4.6vw,4.25rem)] font-black uppercase tracking-tighter leading-[0.92] mb-8">
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
            <div className="hero-cta flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-3">
              <Link
                href="/quote"
                id="hero-get-quote-btn"
                className="group inline-flex items-center gap-3 bg-primary hover:bg-orange-600 text-white font-black uppercase tracking-wider text-[13px] px-5 py-4 transition-all duration-200 hover:-translate-y-0.5 shadow-lg shadow-primary/25 hero-orange-pulse"
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
                className="inline-flex items-center gap-3 border border-white/30 hover:border-primary text-white hover:text-primary font-black uppercase tracking-wider text-[13px] px-5 py-4 transition-all duration-200"
              >
                <Phone size={16} />
                (571) 651-0337
              </a>

              <Link
                href="/services"
                id="hero-services-btn"
                className="group inline-flex items-center gap-3 bg-white hover:bg-primary text-black hover:text-white font-black uppercase tracking-wider text-[13px] px-5 py-4 transition-all duration-200 hover:-translate-y-0.5"
              >
                Explore Our Services
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </div>
          </div>

          {/* Right: truck / trailer slider */}
          <div className="hero-sub lg:col-span-5">
            <HeroSlider slides={slides} />
          </div>
        </div>

        {/* Stats — full-width row under both columns */}
        <div className="hero-stats mt-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10 border border-white/10 w-full">
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
      </Container>

      {/* ── Bottom hazard stripe ── */}
      <div className="hazard-stripe h-2.5 relative z-10" aria-hidden />
    </section>
  );
};

export default Hero;
