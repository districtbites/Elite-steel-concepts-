"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, Phone } from "lucide-react";
import Container from "./ui/Container";
import Button from "./ui/Button";
import { GlobalSettings } from "@/lib/db";

interface HeaderProps {
  settings: GlobalSettings;
}

const Header = ({ settings }: HeaderProps) => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Little truck that drives along the stripe as the page scrolls
  const truckRef = useRef<HTMLDivElement>(null);
  const truckBodyRef = useRef<SVGGElement>(null);
  const wheelRefs = useRef<(SVGGElement | null)[]>([]);

  useEffect(() => {
    let frame = 0;
    let lastY = window.scrollY;

    const update = () => {
      frame = 0;
      const truck = truckRef.current;
      if (!truck) return;
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(Math.max(y / max, 0), 1) : 0;
      const travel = window.innerWidth - truck.offsetWidth;
      truck.style.transform = `translateX(${progress * travel}px)`;

      // Face the direction of travel
      if (y !== lastY && truckBodyRef.current) {
        truckBodyRef.current.style.transform = y < lastY ? "scaleX(-1)" : "scaleX(1)";
      }
      // Spin wheels in proportion to distance driven
      const angle = (progress * travel) / 5 * (180 / Math.PI);
      wheelRefs.current.forEach((w) => {
        if (w) w.style.transform = `rotate(${angle}deg)`;
      });
      lastY = y;
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

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Compliance", href: "/compliance" },
    { name: "Portfolio", href: "/portfolio" },
    { name: "Blog", href: "/blog" },
  ];

  // Lock scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[100] bg-[#0a0a0a] transition-shadow duration-300 ${
          isScrolled || isOpen ? "shadow-lg shadow-black/50" : ""
        }`}
      >
        <Container>
          <div className="flex items-center justify-between py-3 md:py-4">
            {/* Logo */}
            <Link href="/" className="relative z-[110] flex items-center group shrink-0">
              <div className="relative w-36 h-9 sm:w-40 sm:h-10 md:w-44 md:h-11 transition-transform duration-300 group-hover:scale-[1.02]">
                <Image
                  src="/logo-horizontal-white.png"
                  alt="Elite Steel Concepts"
                  fill
                  sizes="(max-width: 640px) 144px, (max-width: 1024px) 176px, 176px"
                  className="object-contain object-left"
                  priority
                />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-7 xl:gap-9 relative z-[105]">
              {navLinks.map((link) => {
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname === link.href || pathname.startsWith(link.href + "/");

                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`relative text-[15px] font-bold transition-colors py-1 group ${
                      isActive ? "text-primary" : "text-white hover:text-primary"
                    }`}
                  >
                    {link.name}
                    <span
                      className={`absolute -bottom-1 left-0 w-full h-[2px] bg-primary transition-transform origin-left ${
                        isActive
                          ? "scale-x-100"
                          : "scale-x-0 group-hover:scale-x-100"
                      }`}
                    />
                  </Link>
                );
              })}
              <Link
                href="/quote"
                id="header-quote-btn"
                className="ml-2 inline-flex items-center bg-primary hover:bg-orange-600 text-white text-sm font-bold px-5 py-2.5 transition-colors"
              >
                Get a Free Quote
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden relative z-[110] p-3 border border-white/20 hover:border-primary hover:text-primary transition-colors bg-black text-white"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </Container>

        {/* Hazard stripe + scroll-driven truck */}
        <div className="relative z-[105]">
          <div className="hazard-stripe h-2.5" aria-hidden />
          <div
            ref={truckRef}
            aria-hidden
            className="absolute left-0 -bottom-[3px] w-10 h-[22px] pointer-events-none will-change-transform drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]"
          >
            <svg viewBox="0 0 44 24" className="size-full overflow-visible">
              <g
                ref={truckBodyRef}
                style={{ transformBox: "fill-box", transformOrigin: "center", transition: "transform 0.25s ease" }}
              >
                {/* Box */}
                <rect x="1" y="3" width="27" height="15" rx="1.5" fill="#111111" stroke="#F7931E" strokeWidth="1" />
                {/* Serving window */}
                <rect x="6" y="6" width="15" height="6" fill="#F7931E" />
                <rect x="5" y="5" width="17" height="1.5" fill="#ffffff" />
                {/* Cab */}
                <path d="M28 18 V7 H35 L41 13 V18 Z" fill="#111111" stroke="#F7931E" strokeWidth="1" />
                <path d="M30 8.5 H34.3 L38.5 12.8 H30 Z" fill="#9ca3af" />
                {/* Stripe + bumper */}
                <rect x="1" y="14.5" width="40" height="1.5" fill="#F7931E" />
                <rect x="40" y="15.5" width="3" height="2.5" fill="#374151" />
                {/* Wheels */}
                {[9, 33].map((cx, i) => (
                  <g
                    key={cx}
                    ref={(el) => {
                      wheelRefs.current[i] = el;
                    }}
                    style={{ transformBox: "fill-box", transformOrigin: "center" }}
                  >
                    <circle cx={cx} cy="19" r="4" fill="#111" stroke="#e5e7eb" strokeWidth="1" />
                    <rect x={cx - 0.5} y="15.8" width="1" height="2.4" fill="#9ca3af" />
                  </g>
                ))}
              </g>
            </svg>
          </div>
        </div>

        {/* Mobile Navigation Overlay */}
        <div
          className={`fixed inset-0 bg-[#0a0a0a] z-[90] lg:hidden transition-all duration-500 ease-in-out ${
            isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"
          }`}
        >
          {/* Industrial Grid Texture for Menu */}
          <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "repeating-linear-gradient(45deg, #fff 0px, #fff 1px, transparent 1px, transparent 10px)" }} />

          <div className="relative z-10 flex flex-col items-center justify-center h-screen space-y-8 p-8">
            {navLinks.map((link, idx) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname === link.href || pathname.startsWith(link.href + "/");

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-4xl font-black uppercase tracking-tighter transition-all duration-300 transform ${
                    isActive ? "text-primary" : "text-white hover:text-primary"
                  } ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
                  style={{ transitionDelay: `${idx * 50}ms` }}
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              );
            })}
            
            <div className={`pt-10 w-full max-w-xs transition-all duration-500 delay-300 transform ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <Button href="/quote" variant="primary" size="lg" className="w-full" onClick={() => setIsOpen(false)}>
                Get a Free Quote
              </Button>
            </div>
            
            <div className={`mt-12 flex flex-col items-center text-gray-500 border-t border-[#1a1a1a] pt-8 w-full max-w-xs transition-all duration-500 delay-400 transform ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
               <a href={`tel:${settings.phone}`} className="flex items-center mb-4 font-black text-white hover:text-primary transition-colors text-xl tracking-tight">
                 <Phone className="w-5 h-5 mr-3 text-primary" /> {settings.phone}
               </a>
               <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] border border-primary px-3 py-1">Manassas HQ | Nationwide Delivery</span>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

export default Header;
