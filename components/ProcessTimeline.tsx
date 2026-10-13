"use client";

import React, { useEffect, useRef, useState } from "react";
import { FileText, PenTool, Handshake, Hammer, KeyRound, ArrowDown } from "lucide-react";

const ICONS = { FileText, PenTool, Handshake, Hammer, KeyRound };

export interface ProcessPhase {
  number: string;
  title: string;
  tagline: string;
  icon: keyof typeof ICONS;
}

const EASE_OUT = "cubic-bezier(0.22, 1, 0.36, 1)";
const EASE_POP = "cubic-bezier(0.34, 1.56, 0.64, 1)";
/** Gap between phases that come into view at the same moment, so they still open one by one. */
const STAGGER_MS = 210;
/** Multiplier for every duration/delay below — lower is faster. */
const SPEED = 0.8;

/**
 * Vertical build-process timeline. Phases are separate cards joined by an arrow
 * connector. Each phase plays its opening sequence once, when it scrolls ~12% into
 * the screen: the connector line draws down, the arrow pops in, the card rises
 * into place and its content follows in a short stagger. All text is in the HTML.
 */
export default function ProcessTimeline({ phases }: { phases: ProcessPhase[] }) {
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  // index → start delay (ms) of its opening sequence; absent = not opened yet.
  const [openDelay, setOpenDelay] = useState<Record<number, number>>({});
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      setReduceMotion(true);
      setOpenDelay(Object.fromEntries(phases.map((_, i) => [i, 0])));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .map((e) => Number((e.target as HTMLElement).dataset.index))
          .sort((a, b) => a - b);
        if (!visible.length) return;
        visible.forEach((i) => observer.unobserve(itemRefs.current[i]!));
        setOpenDelay((prev) => {
          const next = { ...prev };
          visible.forEach((i, k) => {
            if (!(i in next)) next[i] = k * STAGGER_MS;
          });
          return next;
        });
      },
      // Open once the phase's top has moved 12% up from the bottom of the screen.
      { rootMargin: "0px 0px -12% 0px", threshold: 0 },
    );
    itemRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [phases]);

  /** Inline transition for one animated element, `offset` ms into its phase's sequence. */
  const anim = (isOpen: boolean, base: number, offset: number, duration = 700, ease = EASE_OUT): React.CSSProperties =>
    reduceMotion
      ? {}
      : {
          transitionProperty: "opacity, transform",
          transitionDuration: `${duration * SPEED}ms`,
          transitionTimingFunction: ease,
          transitionDelay: isOpen ? `${base + offset * SPEED}ms` : "0ms",
        };

  return (
    <ol className="max-w-3xl mx-auto">
      {phases.map((phase, i) => {
        const Icon = ICONS[phase.icon];
        const isOpen = i in openDelay;
        const base = openDelay[i] ?? 0;
        const dark = i % 2 === 0;
        // Card starts after the connector has drawn (first card has no connector).
        const card = i === 0 ? 0 : 620;
        const hidden = (transform: string): React.CSSProperties =>
          isOpen ? { opacity: 1, transform: "none" } : { opacity: 0, transform };

        return (
          <li
            key={phase.number}
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
            data-index={i}
          >
            {/* Arrow connector from the previous phase */}
            {i > 0 && (
              <div className="flex flex-col items-center" aria-hidden="true">
                <div
                  className="w-0.5 h-10 md:h-12 bg-gradient-to-b from-primary/30 to-primary origin-top"
                  style={{ ...anim(isOpen, base, 0, 450), ...hidden("scaleY(0)") }}
                />
                <div
                  className="w-11 h-11 rounded-full bg-primary text-black flex items-center justify-center shadow-lg shadow-primary/30 ring-4 ring-primary/15"
                  style={{ ...anim(isOpen, base, 330, 500, EASE_POP), ...hidden("scale(0.3) translateY(-10px)") }}
                >
                  <ArrowDown size={20} strokeWidth={2.5} />
                </div>
                <div
                  className="w-0.5 h-6 bg-primary origin-top"
                  style={{ ...anim(isOpen, base, 520, 250), ...hidden("scaleY(0)") }}
                />
              </div>
            )}

            {/* Phase card */}
            <div
              className={`relative overflow-hidden flex flex-col md:flex-row items-center gap-4 md:gap-8 text-center md:text-left px-6 py-8 md:px-12 md:py-10 shadow-[0_20px_50px_-25px_rgba(0,0,0,0.45)] ${
                dark ? "bg-[#0a0a0a] text-white" : "bg-primary text-black"
              }`}
              style={{ ...anim(isOpen, base, card, 850), ...hidden("translateY(40px) scale(0.96)") }}
            >
              {/* Accent bar fills down the left edge */}
              <span
                className={`absolute left-0 top-0 bottom-0 w-1.5 origin-top ${dark ? "bg-primary" : "bg-black"}`}
                style={{ ...anim(isOpen, base, card + 250, 700), ...hidden("scaleY(0)") }}
                aria-hidden="true"
              />

              <div className="flex items-center gap-3 shrink-0 md:w-44">
                <span
                  className={`text-5xl md:text-6xl font-black leading-none tracking-tighter ${dark ? "text-primary" : "text-black"}`}
                  style={{ ...anim(isOpen, base, card + 200), ...hidden("translateX(-24px)") }}
                >
                  {phase.number}
                </span>
                <span
                  className={`w-11 h-11 flex items-center justify-center rounded-full ${
                    dark ? "bg-primary/15 text-primary" : "bg-black/10 text-black"
                  }`}
                  style={{ ...anim(isOpen, base, card + 380, 500, EASE_POP), ...hidden("scale(0.4) rotate(-45deg)") }}
                >
                  <Icon size={20} />
                </span>
              </div>

              <div className="min-w-0">
                <p
                  className={`text-[10px] font-black uppercase tracking-[0.3em] mb-2 ${dark ? "text-gray-400" : "text-black/60"}`}
                  style={{ ...anim(isOpen, base, card + 300), ...hidden("translateY(12px)") }}
                >
                  Phase {phase.number} <span className="opacity-60">/ {String(phases.length).padStart(2, "0")}</span>
                </p>
                <h3
                  className="text-xl md:text-2xl font-black uppercase tracking-tight leading-tight mb-2"
                  style={{ ...anim(isOpen, base, card + 380), ...hidden("translateY(14px)") }}
                >
                  {phase.title}
                </h3>
                <p
                  className={`text-sm md:text-base leading-relaxed ${dark ? "text-gray-300" : "text-black/75"}`}
                  style={{ ...anim(isOpen, base, card + 460), ...hidden("translateY(14px)") }}
                >
                  {phase.tagline}
                </p>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
