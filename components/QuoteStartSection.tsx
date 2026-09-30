import React from "react";
import Link from "next/link";
import Image from "next/image";
import Container from "./ui/Container";
import { ArrowRight, Clock } from "lucide-react";

const QuoteStartSection = () => {
  return (
    <section
      id="get-a-quote"
      className="relative overflow-hidden bg-[#050505] py-24 md:py-32 border-b border-[#1a1a1a]"
    >
      {/* Blueprint grid backdrop */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      {/* Warm glow behind the logo */}
      <div
        aria-hidden
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[720px] max-w-[140vw] rounded-full bg-primary/15 blur-[120px]"
      />
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />

      <Container>
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-12 bg-primary" />
            <span className="text-primary text-xs font-black uppercase tracking-[0.25em]">
              Free Quote
            </span>
            <div className="h-px w-12 bg-primary" />
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight leading-[1.05] mb-12">
            Get A Quote
          </h2>

          <div className="relative w-full max-w-[520px] aspect-[1167/494] mb-10">
            <Image
              src="/logo-horizontal-white.png"
              alt="Elite Steel Concepts"
              fill
              sizes="(max-width: 640px) 90vw, 520px"
              className="object-contain drop-shadow-[0_10px_40px_rgba(0,0,0,0.6)]"
            />
          </div>

          <p className="text-gray-300 text-lg md:text-2xl font-light mb-10 max-w-xl">
            Let&apos;s get your project off the ground!
          </p>

          <Link
            href="/quote"
            id="quote-start-btn"
            className="group inline-flex items-center gap-3 bg-primary hover:bg-orange-600 text-white font-black uppercase tracking-wider text-sm px-12 py-4 transition-all duration-200 hover:-translate-y-0.5 shadow-lg shadow-primary/25"
          >
            Get a Free Quote
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>

          <div className="mt-4 inline-flex items-center gap-2 text-gray-500 text-xs font-bold uppercase tracking-widest">
            <Clock size={13} className="text-primary" />
            Takes 4 minutes
          </div>
        </div>
      </Container>
    </section>
  );
};

export default QuoteStartSection;
