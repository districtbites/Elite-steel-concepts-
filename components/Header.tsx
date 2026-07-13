"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Phone } from "lucide-react";
import Container from "./ui/Container";
import Button from "./ui/Button";
import { GlobalSettings } from "@/lib/db";

interface HeaderProps {
  settings: GlobalSettings;
}

const Header = ({ settings }: HeaderProps) => {
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
    { name: "About Us", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Locations", href: "/locations" },
    { name: "Portfolio", href: "/portfolio" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
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
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
          isScrolled || isOpen ? "bg-white shadow-md py-2" : "bg-black/20 backdrop-blur-sm py-4 md:py-6"
        }`}
      >
        <Container>
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="relative z-[110] flex items-center">
              <div className="relative w-40 h-10 md:w-64 md:h-16 transition-all duration-300">
                <Image
                  src="/logo.png"
                  alt="Elite Steel Concepts"
                  fill
                  className="object-contain object-left"
                  priority
                />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-bold uppercase tracking-wider hover:text-primary transition-colors ${
                    isScrolled ? "text-secondary" : "text-white drop-shadow-md"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <Button href="/quote" variant="primary">
                Request Quote
              </Button>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden relative z-[110] p-2"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="w-8 h-8 text-secondary" />
              ) : (
                <Menu className={`w-8 h-8 ${isScrolled ? "text-secondary" : "text-white"}`} />
              )}
            </button>
          </div>
        </Container>

        {/* Mobile Navigation Overlay */}
        <div
          className={`fixed inset-0 bg-white z-[90] lg:hidden transition-all duration-500 ease-in-out ${
            isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"
          }`}
        >
          <div className="flex flex-col items-center justify-center h-screen space-y-6 p-8">
            {navLinks.map((link, idx) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-3xl font-black text-secondary uppercase tracking-tighter hover:text-primary transition-all duration-300 transform ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                style={{ transitionDelay: `${idx * 50}ms` }}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className={`pt-6 w-full max-w-xs transition-all duration-500 delay-300 transform ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              <Button href="/quote" variant="primary" size="lg" className="w-full shadow-xl" onClick={() => setIsOpen(false)}>
                Request Quote
              </Button>
            </div>
            
            <div className={`mt-12 flex flex-col items-center text-gray-500 transition-all duration-500 delay-400 transform ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
               <a href={`tel:${settings.phone}`} className="flex items-center mb-3 font-bold text-secondary hover:text-primary transition-colors">
                 <Phone className="w-5 h-5 mr-3 text-primary" /> {settings.phone}
               </a>
               <span className="text-xs uppercase tracking-widest font-medium">Manassas, VA | Serving Nationwide</span>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

export default Header;
