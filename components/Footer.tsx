import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail, Youtube, Linkedin } from "lucide-react";
import Container from "./ui/Container";
import { GlobalSettings } from "@/lib/db";

interface FooterProps {
  settings: GlobalSettings;
}

const Footer = ({ settings }: FooterProps) => {
  return (
    <footer className="bg-secondary text-white pt-0 pb-8">
      {/* Gradient separator */}
      <div className="h-1 bg-gradient-to-r from-transparent via-primary to-transparent mb-16" />
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="space-y-6">
            <div className="relative w-48 h-12">
                 <Image
                  src={settings.logoUrl || "/logo.png"}
                  alt="Elite Steel Concepts"
                  fill
                  className="object-contain object-left grayscale brightness-200" 
                />
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Elite Steel Concepts designs & builds custom food trucks and trailers in Manassas, VA. Premium mobile kitchens crafted for performance. Get a free quote today!
            </p>
            <div className="flex space-x-4">
              {settings.facebook && (
                <a href={settings.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
              )}
              {settings.instagram && (
                <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
              )}
              {settings.twitter && (
                <a href={settings.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
              )}
              {settings.linkedin && (
                <a href={settings.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
              )}
              {settings.youtube && (
                <a href={settings.youtube} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors">
                  <Youtube className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold uppercase tracking-wider mb-6 text-primary">Explore</h3>
            <ul className="space-y-3">
              {[
                { name: "Home", href: "/" },
                { name: "About Us", href: "/about" },
                { name: "Process", href: "/process" },
                { name: "Portfolio", href: "/portfolio" },
                { name: "Testimonials", href: "/testimonials" },
                { name: "Blog", href: "/blog" }
              ].map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-gray-400 hover:text-white transition-colors text-sm">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-bold uppercase tracking-wider mb-6 text-primary">Services</h3>
             <ul className="space-y-3">
              {[
                "Custom Food Trucks",
                "Custom Food Trailers",
                "Repairs & Upgrades",
                "Design & Consultation",
                "Fleet Expansion"
              ].map((item) => (
                <li key={item}>
                  <Link href="/services" className="text-gray-400 hover:text-white transition-colors text-sm">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold uppercase tracking-wider mb-6 text-primary">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 text-primary mr-3 mt-0.5 shrink-0" />
                <span className="text-gray-400 text-sm whitespace-pre-line">{settings.address}</span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 text-primary mr-3 shrink-0" />
                <span className="text-gray-400 text-sm">{settings.phone}</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 text-primary mr-3 shrink-0" />
                <span className="text-gray-400 text-sm">{settings.email}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center bg-secondary">
          <p className="text-gray-500 text-xs mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} <a href="https://www.facebook.com/EliteSteelConcepts" className="text-white hover:text-primary transition-colors">Elite Steel Concepts</a> All rights reserved. Created by <a href="http://districtbites.com/" className="text-white hover:text-primary transition-colors">District Bites</a>
          </p>
          <div className="flex space-x-6">
            <Link href="/privacy" className="text-gray-500 hover:text-white text-xs">Privacy Policy</Link>
            <Link href="/terms" className="text-gray-500 hover:text-white text-xs">Terms of Service</Link>
            <Link href="/sitemap.xml" className="text-gray-500 hover:text-white text-xs">Sitemap</Link>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
