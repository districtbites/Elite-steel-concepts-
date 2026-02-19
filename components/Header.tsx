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
    { name: "Process", href: "/process" },
    { name: "Portfolio", href: "/portfolio" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md py-2" : "bg-black/20 backdrop-blur-sm py-4 md:py-6"
      }`}
    >
      <Container>
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="relative z-50 flex items-center">
             <div className="relative w-48 h-12 md:w-64 md:h-16">
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
            className="lg:hidden relative z-50 p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className={`w-8 h-8 ${isScrolled ? "text-secondary" : "text-white"}`} /> : <Menu className={`w-8 h-8 ${isScrolled ? "text-secondary" : "text-white"}`} />}
          </button>
        </div>
      </Container>

      {/* Mobile Navigation Overlay */}
      <div
        className={`fixed inset-0 bg-white z-40 transform transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full space-y-8 p-4">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-2xl font-bold text-secondary uppercase tracking-widest hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <Button href="/quote" variant="primary" size="lg" className="w-full max-w-xs" onClick={() => setIsOpen(false)}>
            Request Quote
          </Button>
          
          <div className="mt-8 flex flex-col items-center text-gray-500">
             <span className="flex items-center mb-2"><Phone className="w-5 h-5 mr-2" /> {settings.phone}</span>
             <span className="text-sm">Manassas, VA</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
