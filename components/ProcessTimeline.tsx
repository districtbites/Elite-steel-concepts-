"use client";

import React, { useEffect, useRef, useState } from "react";
import { FileText, PenTool, Handshake, Hammer, KeyRound, Lightbulb, Check } from "lucide-react";
import AutoLinkedText from "@/components/ui/AutoLinkedText";

const ICONS = { FileText, PenTool, Handshake, Hammer, KeyRound };

export interface ProcessPhase {
  number: string;
  title: string;
  tagline: string;
  icon: keyof typeof ICONS;
  /** Description with internal links already applied (markdown link syntax). */
  description: string;
  items: string[];
  proTip: string;
}

/**
 * Vertical build-process timeline. As the visitor scrolls, the rail fills with
 * orange, each phase card opens (fades/slides in) when it reaches the viewport,
 * and the phase in the middle of the screen is highlighted.
 * All content is in the server-rendered HTML; only its reveal is animated.
 */
export default function ProcessTimeline({ phases }: { phases: ProcessPhase[] }) {
  const listRef = useRef<HTMLOListElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const [active, setActive] = useState(-1);
  const [progress, setProgress] = useState(0);

  // Open each phase the first time it scrolls into view.
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || !("IntersectionObserver" in window)) {
      setRevealed(new Set(phases.map((_, i) => i)));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const index = Number((entry.target as HTMLElement).dataset.index);
          setRevealed((prev) => (prev.has(index) ? prev : new Set(prev).add(index)));
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -15% 0px", threshold: 0.1 },
    );
    itemRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [phases]);

  // Fill the rail and track the phase at the middle of the viewport.
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const list = listRef.current;
      if (!list) return;
      const focusLine = window.innerHeight * 0.55;
      const rect = list.getBoundingClientRect();
      setProgress(Math.min(1, Math.max(0, (focusLine - rect.top) / rect.height)));

      let current = -1;
      itemRefs.current.forEach((el, i) => {
        if (el && el.getBoundingClientRect().top <= focusLine) current = i;
      });
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <ol ref={listRef} className="relative max-w-4xl mx-auto space-y-8 md:space-y-10">
      {/* Rail: grey track with an orange fill that follows the scroll */}
      <div className="absolute left-5 md:left-7 top-5 md:top-7 bottom-7 w-0.5 -ml-px bg-gray-200" aria-hidden="true">
        <div
          className="w-full bg-primary origin-top transition-transform duration-150 ease-out"
          style={{ height: "100%", transform: `scaleY(${progress})` }}
        />
      </div>

      {phases.map((phase, i) => {
        const Icon = ICONS[phase.icon];
        const isOpen = revealed.has(i);
        const isActive = active === i;
        const isPassed = active >= i;

        return (
          <li
            key={phase.number}
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
            data-index={i}
            className="relative pl-14 md:pl-24"
          >
            {/* Phase node on the rail */}
            <div
              className={`absolute left-0 top-0 z-10 w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center text-sm md:text-lg font-black ring-4 md:ring-8 ring-white transition-colors duration-500 ${
                isPassed ? "bg-primary text-black" : "bg-white text-gray-400 border-2 border-gray-200"
              }`}
            >
              {phase.number}
              {isActive && <span className="absolute inset-0 rounded-full border-2 border-primary animate-ping opacity-40" aria-hidden="true" />}
            </div>

            {/* Phase card */}
            <article
              className={`relative bg-white border transition-all duration-700 ease-out ${
                isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              } ${isActive ? "border-primary shadow-[0_24px_60px_-30px_rgba(247,147,30,0.45)]" : "border-gray-200 shadow-sm"}`}
            >
              <div
                className={`absolute top-0 left-0 h-1 bg-primary transition-all duration-700 ${isActive ? "w-full" : "w-0"}`}
                aria-hidden="true"
              />

              {/* Header */}
              <header className="flex items-start gap-4 md:gap-5 p-5 md:p-8 border-b border-gray-100">
                <div className="hidden sm:flex w-12 h-12 md:w-14 md:h-14 shrink-0 bg-primary/10 text-primary items-center justify-center">
                  <Icon size={24} />
                </div>
                <div className="min-w-0">
                  <p className="text-primary font-black uppercase tracking-[0.25em] text-[11px] mb-2">
                    Phase {phase.number} <span className="text-gray-300">/ {String(phases.length).padStart(2, "0")}</span>
                  </p>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-tighter text-black leading-none mb-2">
                    {phase.title}
                  </h3>
                  <p className="text-sm sm:text-base md:text-lg font-semibold text-gray-500">{phase.tagline}</p>
                </div>
              </header>

              {/* Body: opens with a slight delay after the card */}
              <div
                className={`grid md:grid-cols-[1.25fr_1fr] gap-6 md:gap-8 p-5 md:p-8 transition-all duration-700 delay-200 ${
                  isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                <div className="space-y-5">
                  <p className="text-gray-600 leading-relaxed">
                    <AutoLinkedText text={phase.description} />
                  </p>
                  <div className="bg-primary/5 border-l-4 border-primary p-4 flex gap-3">
                    <Lightbulb size={18} className="text-primary shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-primary block mb-1">Elite Pro-Tip</span>
                      <p className="text-sm text-gray-600 leading-relaxed">{phase.proTip}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4">What&apos;s Included</p>
                  <ul className="space-y-3">
                    {phase.items.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm font-medium text-gray-800">
                        <span className="mt-0.5 w-5 h-5 shrink-0 rounded-full bg-primary/15 text-primary flex items-center justify-center">
                          <Check size={12} strokeWidth={3} />
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          </li>
        );
      })}
    </ol>
  );
}
