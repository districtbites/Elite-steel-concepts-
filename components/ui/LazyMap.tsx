"use client";

import React, { useEffect, useState } from "react";
import { MapPin } from "lucide-react";

interface LazyMapProps {
  src: string;
  title: string;
  address: string;
  mapsLink?: string;
  className?: string;
}

/**
 * Google Maps embed that loads only after the visitor interacts with the page
 * (scroll, touch, mouse or keyboard). The embed pulls ~400 KB of Google Maps
 * JavaScript, so deferring it keeps the initial page load fast. Until then an
 * address card with a link to Google Maps is shown in its place.
 */
export default function LazyMap({ src, title, address, mapsLink, className = "" }: LazyMapProps) {
  const [load, setLoad] = useState(false);

  useEffect(() => {
    const events = ["scroll", "pointerdown", "pointermove", "touchstart", "keydown"] as const;
    const start = () => setLoad(true);
    events.forEach((e) => window.addEventListener(e, start, { once: true, passive: true }));
    return () => events.forEach((e) => window.removeEventListener(e, start));
  }, []);

  return (
    <div className={`relative ${className}`}>
      {load ? (
        <iframe
          src={src}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={title}
          className="absolute inset-0 w-full h-full"
        />
      ) : (
        <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center gap-4 p-6 text-center bg-gray-100">
          <span className="w-14 h-14 rounded-full bg-primary text-black flex items-center justify-center">
            <MapPin size={26} />
          </span>
          <span className="font-bold text-black max-w-xs">{address}</span>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => setLoad(true)}
              className="text-sm font-black uppercase tracking-wider text-black border-2 border-black px-4 py-2 hover:bg-black hover:text-white transition-colors"
            >
              Show Map
            </button>
            {mapsLink && (
              <a
                href={mapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-black uppercase tracking-wider text-primary hover:underline"
              >
                Open in Google Maps
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
