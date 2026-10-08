"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ReelCard from "./ReelCard";

export interface Reel {
  id: string;
  title: string;
  client: string;
  location: string;
  videoUrl: string;
  views: string;
}

const ReelSlider = ({ reels }: { reels: Reel[] }) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  // Number of scroll positions: on desktop 3 cards are visible, so 4 reels give 2 positions
  const [pages, setPages] = useState(reels.length);

  const getStep = () => {
    const track = trackRef.current;
    const slide = track?.children[0] as HTMLElement | undefined;
    if (!track || !slide) return 1;
    return slide.offsetWidth + parseFloat(getComputedStyle(track).columnGap || "0");
  };

  const update = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const step = getStep();
    const visible = Math.max(1, Math.round((track.clientWidth + parseFloat(getComputedStyle(track).columnGap || "0")) / step));
    const total = Math.max(1, reels.length - visible + 1);
    setPages(total);
    // At the far end the last position may sit less than a full step from the previous one
    const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
    setActive(atEnd ? total - 1 : Math.min(total - 1, Math.round(track.scrollLeft / step)));
  }, [reels.length]);

  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [update]);

  const scrollToIndex = (index: number) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollTo({ left: index * getStep(), behavior: "smooth" });
  };

  // One card per click; wraps around so the arrows never dead-end
  const move = (dir: 1 | -1) => scrollToIndex((active + dir + pages) % pages);

  const arrowClass =
    "hidden md:flex absolute top-1/2 -translate-y-1/2 z-20 size-12 items-center justify-center rounded-full bg-white border border-gray-200 text-black shadow-lg hover:bg-primary hover:border-primary hover:text-white transition-all";

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => move(-1)}
        aria-label="Previous videos"
        className={`${arrowClass} -left-4 lg:-left-6`}
      >
        <ChevronLeft size={22} />
      </button>

      <div
        ref={trackRef}
        onScroll={update}
        className="flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {reels.map((reel) => (
          <div
            key={reel.id}
            className="snap-start shrink-0 w-[78%] sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
          >
            <ReelCard
              title={reel.title}
              client={reel.client}
              location={reel.location}
              videoUrl={reel.videoUrl}
              views={reel.views}
            />
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => move(1)}
        aria-label="Next videos"
        className={`${arrowClass} -right-4 lg:-right-6`}
      >
        <ChevronRight size={22} />
      </button>

      {/* Dots */}
      <div className="flex justify-center items-center gap-2.5 mt-8 md:mt-10">
        {Array.from({ length: pages }, (_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => scrollToIndex(i)}
            aria-label={`Go to video ${i + 1}`}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              i === active ? "w-10 bg-primary" : "w-2.5 bg-gray-300 hover:bg-primary/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ReelSlider;
