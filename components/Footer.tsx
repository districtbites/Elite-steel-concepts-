import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail, Youtube, Linkedin, Clock } from "lucide-react";
import Container from "./ui/Container";
import type { GlobalSettings } from "@/lib/db";
import { SITE_FOOTER, type SiteFooterContent } from "@/lib/pageContent/pages/site";

interface FooterProps {
  settings: GlobalSettings;
  /** Footer copy and links from Admin → Page Content (site.footer) */
  content?: SiteFooterContent;
}

const Footer = ({ settings, content = SITE_FOOTER.defaults }: FooterProps) => {
  return (
    <footer className="bg-secondary text-white pt-0 pb-8">
      {/* Gradient separator */}
      <div className="h-1 bg-primary mb-16" />
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link href="/" className="inline-block group">
              <div className="relative w-36 h-9 sm:w-40 sm:h-10 md:w-44 md:h-11 transition-transform duration-300 group-hover:scale-[1.02]">
                <Image
                  src="/logo-horizontal-white.webp"
                  alt="Elite Steel Concepts"
                  fill
                  sizes="(max-width: 640px) 144px, 176px"
                  className="object-contain object-left"
                />
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              {content.about}
            </p>
            <div className="flex space-x-4">
              {settings.facebook && (
                <a href={settings.facebook} target="_blank" rel="noopener noreferrer" aria-label="Elite Steel Concepts on Facebook" className="text-gray-400 hover:text-primary transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
              )}
              {settings.instagram && (
                <a href={settings.instagram} target="_blank" rel="noopener noreferrer" aria-label="Elite Steel Concepts on Instagram" className="text-gray-400 hover:text-primary transition-colors">
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
            <h3 className="text-lg font-bold uppercase tracking-wider mb-6 text-primary">{content.exploreHeading}</h3>
            <ul className="space-y-3">
              {content.exploreLinks.map((item, i) => (
                <li key={i}>
                  <Link href={item.href} className="text-gray-400 hover:text-white transition-colors text-sm">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-bold uppercase tracking-wider mb-6 text-primary">{content.servicesHeading}</h3>
             <ul className="space-y-3">
              {content.serviceLinks.map((item, i) => (
                <li key={i}>
                  <Link href={item.href} className="text-gray-400 hover:text-white transition-colors text-sm">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold uppercase tracking-wider mb-6 text-primary">{content.contactHeading}</h3>
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
              {settings.businessHours && (
                <li className="flex items-start">
                  <Clock className="w-5 h-5 text-primary mr-3 mt-0.5 shrink-0" />
                  <span className="text-gray-400 text-sm">{settings.businessHours}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center bg-secondary">
          <p className="text-gray-500 text-xs mb-4 md:mb-0">
            &copy; {new Date().getFullYear()}{" "}
            {content.copyrightLink ? (
              <a href={content.copyrightLink} className="text-white hover:text-primary transition-colors">{content.copyrightName}</a>
            ) : (
              <span className="text-white">{content.copyrightName}</span>
            )}
            . All rights reserved.
          </p>
          <div className="flex space-x-6">
            {content.bottomLinks.map((item, i) => (
              <Link key={i} href={item.href} className="text-gray-500 hover:text-white text-xs">{item.label}</Link>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
