"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
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

const Hero = ({ imageAlts, content, heroImage }: HeroProps) => {
  const defaultImage =
    "https://images.pexels.com/photos/2577274/pexels-photo-2577274.jpeg?auto=compress&cs=tinysrgb&w=1920";
  const bgSrc = heroImage?.url || defaultImage;
  const bgAlt =
    heroImage?.alt ||
    imageAlts?.hero ||
    "Elite Steel Concepts Custom Food Truck Construction";

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
    <section className="relative min-h-screen flex flex-col bg-[#0a0a0a] overflow-hidden">
      {/* ── Background Image with slow-zoom ── */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Image
          src={bgSrc}
          alt={bgAlt}
          fill
          priority
          sizes="100vw"
          quality={85}
          className="object-cover opacity-30 animate-slow-zoom"
        />
        {/* Multi-layer gradient for depth */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/85 to-[#0a0a0a]/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
      </div>

      {/* ── Grid texture overlay ── */}
      <div
        className="absolute inset-0 z-1 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, #fff 0px, #fff 1px, transparent 1px, transparent 60px), repeating-linear-gradient(90deg, #fff 0px, #fff 1px, transparent 1px, transparent 60px)",
        }}
      />

      {/* ── Diagonal scan line animation ── */}
      <div className="absolute inset-0 z-1 pointer-events-none overflow-hidden">
        <div className="absolute inset-y-0 w-[60%] bg-white hero-diag-scan" />
      </div>

      {/* ── Orange accent particles ── */}
      <div className="absolute inset-0 z-1 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 right-[15%] w-2 h-2 bg-primary rounded-full hero-particle-1" />
        <div className="absolute top-1/2 right-[30%] w-1.5 h-1.5 bg-primary/60 rounded-full hero-particle-2" />
        <div className="absolute top-3/4 right-[10%] w-1 h-1 bg-primary/40 rounded-full hero-particle-3" />
      </div>

      {/* ── Right-side vertical orange rule ── */}
      <div className="absolute top-0 right-[38%] h-full w-px bg-gradient-to-b from-transparent via-primary/20 to-transparent z-1 hidden lg:block" />

      {/* ── Main Content ── */}
      <Container className="relative z-10 flex-1 flex flex-col justify-center pt-28 pb-12 md:pt-36 md:pb-20">
        <div className="max-w-5xl">

          {/* Badge */}
          <div className="hero-badge flex items-center gap-3 mb-8">
            <div className="flex items-center gap-2 bg-primary/10 border border-primary/30 px-4 py-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-primary text-xs font-black uppercase tracking-[0.25em]">
                Based in Manassas, VA
              </span>
            </div>
            <div className="h-px flex-1 max-w-[80px] bg-gradient-to-r from-primary/40 to-transparent" />
          </div>

          {/* Headline — line 1 */}
          <div className="overflow-hidden mb-1">
            <div className="hero-line-1 text-[clamp(2.8rem,7vw,6rem)] font-black text-white uppercase tracking-tighter leading-[0.88]">
              Custom
            </div>
          </div>

          {/* Headline — line 2: cycling word */}
          <div className="overflow-hidden mb-1">
            <div className="hero-line-2 text-[clamp(2.8rem,7vw,6rem)] font-black uppercase tracking-tighter leading-[0.88]">
              <span
                className="text-primary inline-block transition-all duration-300"
                style={{
                  opacity: animating ? 0 : 1,
                  transform: animating ? "translateY(-10px)" : "translateY(0)",
                }}
              >
                {CYCLING_WORDS[wordIndex]}
              </span>
            </div>
          </div>

          {/* Headline — line 3 */}
          <div className="overflow-hidden mb-10">
            <div className="hero-line-3 text-[clamp(2.8rem,7vw,6rem)] font-black text-white uppercase tracking-tighter leading-[0.88] flex items-baseline gap-4 flex-wrap">
              Built to Perform
              <span className="inline-block w-16 md:w-24 h-1.5 bg-primary translate-y-[-10px]" />
            </div>
          </div>

          {/* Subheading */}
          <div className="hero-sub max-w-xl mb-10">
            <ReadMore 
              text={content?.content || "Design. Fabrication. Ready to Serve. We turn your culinary vision into a high-performance mobile business — 100% health code compliant, on time, on budget."}
              maxLength={180}
              className="text-gray-400 text-lg leading-relaxed font-light"
            />
          </div>

          {/* CTAs */}
          <div className="hero-cta flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-14">
            <Link
              href="/quote"
              id="hero-get-quote-btn"
              className="group inline-flex items-center gap-3 bg-primary hover:bg-orange-600 text-white font-black uppercase tracking-wider text-sm px-8 py-4 transition-all duration-200 hover:-translate-y-0.5 shadow-lg shadow-primary/25 hero-orange-pulse"
            >
              {content?.ctaText || "Request a Free Quote"}
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>

            <a
              href="tel:+15716510337"
              id="hero-call-btn"
              className="inline-flex items-center gap-3 border border-white/20 hover:border-primary text-white hover:text-primary font-black uppercase tracking-wider text-sm px-8 py-4 transition-all duration-200"
            >
              <Phone size={16} />
              (571) 651-0337
            </a>

            <Link
              href="/portfolio"
              id="hero-portfolio-btn"
              className="hidden sm:inline-flex items-center gap-2 text-gray-500 hover:text-white font-bold uppercase tracking-wider text-xs transition-colors underline-offset-4 hover:underline"
            >
              View Portfolio
            </Link>
          </div>

          {/* Stats ticker row */}
          <div className="hero-stats">
            <div className="flex items-stretch gap-px bg-[#1a1a1a] w-fit">
              {STATS.map(({ value, label, icon: Icon }, i) => (
                <div
                  key={label}
                  className="flex items-center gap-3 bg-[#0f0f0f] hover:bg-[#141414] px-6 py-4 transition-colors group"
                  style={{ animationDelay: `${1 + i * 0.12}s` }}
                >
                  <Icon
                    size={14}
                    className="text-primary shrink-0 group-hover:scale-110 transition-transform"
                  />
                  <div>
                    <div className="text-lg font-black text-white leading-none">
                      {value}
                    </div>
                    <div className="text-[9px] font-bold text-gray-600 uppercase tracking-widest mt-0.5">
                      {label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>

      {/* ── Scroll indicator ── */}
      <div className="relative z-10 flex flex-col items-center pb-8 gap-2">
        <span className="text-[10px] text-gray-600 font-black uppercase tracking-[0.3em]">
          Scroll
        </span>
        <div className="w-5 h-8 border border-white/10 rounded-full flex justify-center p-1">
          <div className="w-0.5 h-2 bg-primary rounded-full animate-scroll-down" />
        </div>
      </div>

      {/* ── Bottom edge divider ── */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <div className="h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      </div>
    </section>
  );
};

export default Hero;
