"use client";

import React, { useEffect, useState } from "react";

interface CyclingWordProps {
  words: string[];
  className?: string;
  intervalMs?: number;
}

/**
 * Rotates through `words` in place. All words share one grid cell (kept on one
 * line), so the line height never changes while the words switch — no layout shift.
 */
export default function CyclingWord({ words, className = "", intervalMs = 3200 }: CyclingWordProps) {
  const [wordIndex, setWordIndex] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    let swap: ReturnType<typeof setTimeout>;
    const interval = setInterval(() => {
      setAnimating(true);
      swap = setTimeout(() => {
        setWordIndex((prev) => (prev + 1) % words.length);
        setAnimating(false);
      }, 350);
    }, intervalMs);
    return () => {
      clearInterval(interval);
      clearTimeout(swap);
    };
  }, [words.length, intervalMs]);

  return (
    <span className={`grid whitespace-nowrap ${className}`}>
      {words.map((word, i) => (
        <span
          key={word}
          aria-hidden={i !== wordIndex}
          className="[grid-area:1/1] transition-all duration-300"
          style={{
            visibility: i === wordIndex ? "visible" : "hidden",
            opacity: i === wordIndex && !animating ? 1 : 0,
            transform: i === wordIndex && !animating ? "translateY(0)" : "translateY(-10px)",
          }}
        >
          {word}
        </span>
      ))}
    </span>
  );
}
