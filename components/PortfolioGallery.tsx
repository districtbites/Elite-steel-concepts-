"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";

export interface GalleryItem {
  image: string;
  title: string;
}

interface PortfolioGalleryProps {
  items: GalleryItem[];
}

const PortfolioGallery = ({ items }: PortfolioGalleryProps) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const close = () => setActiveIndex(null);
  const prev = () =>
    setActiveIndex((i) => (i === null ? i : (i - 1 + items.length) % items.length));
  const next = () =>
    setActiveIndex((i) => (i === null ? i : (i + 1) % items.length));

  useEffect(() => {
    if (activeIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex]);

  const active = activeIndex !== null ? items[activeIndex] : null;

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {items.map((item, index) => (
          <button
            type="button"
            key={`${item.image}-${index}`}
            onClick={() => setActiveIndex(index)}
            className="group relative bg-white border-2 border-black overflow-hidden hover:border-primary transition-colors duration-300 text-left"
          >
            <div className="relative aspect-[4/3] overflow-hidden border-b-2 border-black bg-black">
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover opacity-90 transition-all duration-700 group-hover:scale-105 group-hover:opacity-100"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-colors duration-300">
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-primary text-black p-3">
                  <Maximize2 size={18} />
                </span>
              </div>
            </div>
            <div className="px-5 py-4">
              <h3 className="text-base md:text-lg font-black uppercase text-black tracking-tight group-hover:text-primary transition-colors leading-tight">
                {item.title}
              </h3>
            </div>
          </button>
        ))}
      </div>

      {active && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 md:p-10"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label={active.title}
        >
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute top-4 right-4 md:top-6 md:right-6 text-white hover:text-primary transition-colors p-2"
          >
            <X size={28} />
          </button>

          {items.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); prev(); }}
                aria-label="Previous image"
                className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-primary hover:text-black text-white p-3 transition-colors z-10"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); next(); }}
                aria-label="Next image"
                className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-primary hover:text-black text-white p-3 transition-colors z-10"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          <figure className="w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <div className="relative w-full h-[70vh]">
              <Image
                src={active.image}
                alt={active.title}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>
            <figcaption className="mt-4 text-center text-white font-black uppercase tracking-widest text-sm">
              {active.title}
              <span className="ml-3 text-primary">
                {activeIndex! + 1} / {items.length}
              </span>
            </figcaption>
          </figure>
        </div>
      )}
    </>
  );
};

export default PortfolioGallery;
