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
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const update = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const slide = track.children[0] as HTMLElement | undefined;
    const step = slide ? slide.offsetWidth + parseFloat(getComputedStyle(track).columnGap || "0") : 1;
    setActive(Math.min(reels.length - 1, Math.round(track.scrollLeft / step)));
    setCanPrev(track.scrollLeft > 4);
    setCanNext(track.scrollLeft + track.clientWidth < track.scrollWidth - 4);
  }, [reels.length]);

  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [update]);

  const scrollToIndex = (index: number) => {
    const track = trackRef.current;
    const slide = track?.children[index] as HTMLElement | undefined;
    if (!track || !slide) return;
    track.scrollTo({ left: slide.offsetLeft - track.offsetLeft, behavior: "smooth" });
  };

  const scrollByPage = (dir: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: dir * track.clientWidth * 0.9, behavior: "smooth" });
  };

  const arrowClass =
    "hidden md:flex absolute top-1/2 -translate-y-1/2 z-20 size-12 items-center justify-center rounded-full bg-white border border-gray-200 text-black shadow-lg hover:bg-primary hover:border-primary hover:text-white transition-all disabled:opacity-0 disabled:pointer-events-none";

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => scrollByPage(-1)}
        disabled={!canPrev}
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
        onClick={() => scrollByPage(1)}
        disabled={!canNext}
        aria-label="Next videos"
        className={`${arrowClass} -right-4 lg:-right-6`}
      >
        <ChevronRight size={22} />
      </button>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-6">
        {reels.map((reel, i) => (
          <button
            key={reel.id}
            type="button"
            onClick={() => scrollToIndex(i)}
            aria-label={`Go to video ${i + 1}`}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === active ? "w-8 bg-primary" : "w-2 bg-gray-300 hover:bg-primary/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ReelSlider;
