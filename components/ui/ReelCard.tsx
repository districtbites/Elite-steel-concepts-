"use client";

import React, { useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";

interface ReelCardProps {
  title: string;
  client: string;
  location: string;
  videoUrl: string;
  views: string;
}

const formatDuration = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
};

const pauseOtherReels = (current: HTMLVideoElement) => {
  document.querySelectorAll<HTMLVideoElement>("video[data-reel]").forEach((v) => {
    if (v !== current && !v.paused) v.pause();
  });
};

const ReelCard = ({ title, location, videoUrl }: ReelCardProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState<string | null>(null);

  // Metadata can finish loading before hydration attaches onLoadedMetadata
  useEffect(() => {
    const video = videoRef.current;
    if (video && video.readyState >= 1) setDuration(formatDuration(video.duration));
  }, []);

  const handlePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    pauseOtherReels(video);
    video.muted = false;
    video.play();
    setPlaying(true);
  };

  return (
    <div className="group relative bg-[#0a0a0a] rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-primary/50">
      <div className="relative aspect-[9/16] w-full overflow-hidden bg-black">
        {/* Video — "#t=0.1" makes browsers paint the first frame as a poster */}
        <video
          ref={videoRef}
          data-reel
          src={`${videoUrl}#t=0.1`}
          preload="metadata"
          playsInline
          controls={playing}
          onLoadedMetadata={(e) => setDuration(formatDuration(e.currentTarget.duration))}
          onPlay={(e) => {
            pauseOtherReels(e.currentTarget);
            setPlaying(true);
          }}
          onPause={() => setPlaying(false)}
          onEnded={() => setPlaying(false)}
          className={`size-full object-cover transition-all duration-500 ${
            playing ? "opacity-100" : "opacity-80 group-hover:scale-105 group-hover:opacity-90"
          }`}
        />

        {!playing && (
          <>
            {/* Subtle Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/40 pointer-events-none" />

            {/* Top Badges */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-end z-10 pointer-events-none">
              {duration && (
                <span className="bg-black/60 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full border border-white/10">
                  {duration}
                </span>
              )}
            </div>

            {/* Center Play Button */}
            <button
              type="button"
              onClick={handlePlay}
              aria-label={`Play video: ${title}`}
              className="absolute inset-0 flex items-center justify-center z-10 cursor-pointer"
            >
              <span className="size-16 md:size-20 rounded-full bg-primary/90 text-white flex items-center justify-center shadow-[0_0_30px_rgba(255,165,0,0.6)] group-hover:scale-110 group-hover:bg-primary transition-all duration-300">
                <Play size={28} className="fill-white ml-1" />
              </span>
            </button>

            {/* Bottom — location only */}
            <div className="absolute bottom-0 inset-x-0 p-6 z-10 text-white pointer-events-none">
              <span className="text-primary font-bold text-xs uppercase tracking-widest block">
                {location}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ReelCard;
