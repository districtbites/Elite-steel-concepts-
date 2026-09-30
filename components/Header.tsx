"use client";

import React, { useState, useEffect } from "react";
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
              <div className="relative w-44 h-11 sm:w-52 sm:h-13 md:w-56 md:h-14 transition-transform duration-300 group-hover:scale-[1.02]">
                <Image
                  src="/logo-horizontal-white.png"
                  alt="Elite Steel Concepts"
                  fill
                  sizes="(max-width: 640px) 200px, (max-width: 1024px) 260px, 300px"
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

        {/* Hazard stripe */}
        <div className="hazard-stripe h-2.5 relative z-[105]" aria-hidden />

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
