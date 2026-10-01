"use client";

import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

export interface HeroSlide {
  url: string;
  alt: string;
  label: string;
  title: string;
  href: string;
}

const INTERVAL_MS = 5000;

const HeroSlider = ({ slides }: { slides: HeroSlide[] }) => {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = useCallback(
    (next: number) => setIndex((next + slides.length) % slides.length),
    [slides.length],
  );

  useEffect(() => {
    if (paused || slides.length < 2) return;
    const t = setTimeout(() => go(index + 1), INTERVAL_MS);
    return () => clearTimeout(t);
  }, [index, paused, go, slides.length]);

  if (slides.length === 0) return null;

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Offset orange frame behind the slider */}
      <div
        aria-hidden
        className="absolute -top-4 -right-4 w-2/3 h-2/3 border-t-4 border-r-4 border-primary hidden md:block"
      />
      <div
        aria-hidden
        className="absolute -bottom-4 -left-4 w-1/3 h-1/3 border-b-4 border-l-4 border-primary/40 hidden md:block"
      />

      <div className="relative aspect-[4/3] lg:aspect-square overflow-hidden bg-[#141414] border border-white/10 shadow-2xl shadow-black/60">
        {slides.map((slide, i) => (
          <div
            key={slide.url + i}
            aria-hidden={i !== index}
            className={`absolute inset-0 transition-opacity duration-700 ease-out ${
              i === index ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <Image
              src={slide.url}
              alt={slide.alt}
              fill
              priority={i === 0}
              sizes="(max-width: 1024px) 100vw, 42vw"
              className={`object-cover transition-transform duration-[6000ms] ease-out ${
                i === index ? "scale-105" : "scale-100"
              }`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />

            {/* Caption */}
            <div className="absolute bottom-0 inset-x-0 p-6 md:p-8 flex items-end justify-between gap-4">
              <div>
                <span className="text-primary text-[11px] font-black uppercase tracking-[0.25em] block mb-1">
                  {slide.label}
                </span>
                <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight leading-none">
                  {slide.title}
                </h2>
              </div>
              <Link
                href={slide.href}
                tabIndex={i === index ? 0 : -1}
                aria-label={`View ${slide.title}`}
                className="shrink-0 size-11 bg-primary hover:bg-orange-600 text-white flex items-center justify-center transition-colors"
              >
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        ))}

        {/* Prev / next */}
        {slides.length > 1 && (
          <div className="absolute top-4 right-4 z-20 flex gap-2">
            <button
              type="button"
              onClick={() => go(index - 1)}
              aria-label="Previous slide"
              className="size-10 bg-black/60 hover:bg-primary border border-white/15 hover:border-primary text-white flex items-center justify-center backdrop-blur-sm transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => go(index + 1)}
              aria-label="Next slide"
              className="size-10 bg-black/60 hover:bg-primary border border-white/15 hover:border-primary text-white flex items-center justify-center backdrop-blur-sm transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}

        {/* Progress bars */}
        {slides.length > 1 && (
          <div className="absolute top-4 left-4 z-20 flex gap-2">
            {slides.map((slide, i) => (
              <button
                key={slide.url + i}
                type="button"
                onClick={() => go(i)}
                aria-label={`Go to slide ${i + 1}: ${slide.title}`}
                className="flex items-center"
              >
                <span className="block h-1 w-10 bg-white/25 overflow-hidden">
                <span
                  key={i === index ? `active-${index}` : `idle-${i}`}
                  className="block h-full bg-primary origin-left"
                  style={
                    i === index
                      ? {
                          animation: paused
                            ? "none"
                            : `heroSlideProgress ${INTERVAL_MS}ms linear forwards`,
                          transform: paused ? "scaleX(1)" : undefined,
                        }
                      : { transform: i < index ? "scaleX(1)" : "scaleX(0)" }
                  }
                />
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HeroSlider;
