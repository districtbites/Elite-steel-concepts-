import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail, Youtube, Linkedin, Clock } from "lucide-react";
import Container from "./ui/Container";
import type { GlobalSettings } from "@/lib/db";
import { SITE_FOOTER, type SiteFooterContent } from "@/lib/pageContent/pages/site";
import AutoLinkedText from "@/components/ui/AutoLinkedText";

interface FooterProps {
  settings: GlobalSettings;
  /** Footer copy and links from Admin → Page Content (site.footer) */
  content?: SiteFooterContent;
}

/** lucide-react has no Google mark. */
const GoogleIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
  </svg>
);

const Footer = ({ settings, content = SITE_FOOTER.defaults }: FooterProps) => {
  // Only profiles with a URL in Admin → Settings are shown
  const socialLinks = [
    { name: "Facebook", url: settings.facebook, icon: Facebook },
    { name: "Instagram", url: settings.instagram, icon: Instagram },
    { name: "Twitter", url: settings.twitter, icon: Twitter },
    { name: "LinkedIn", url: settings.linkedin, icon: Linkedin },
    { name: "YouTube", url: settings.youtube, icon: Youtube },
    { name: "Google", url: settings.googleBusiness, icon: GoogleIcon },
  ].filter(link => link.url?.trim());

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
              <AutoLinkedText text={content.about} />
            </p>
            {socialLinks.length > 0 && (
              <div className="flex space-x-4">
                {socialLinks.map(({ name, url, icon: Icon }) => (
                  <a
                    key={name}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Elite Steel Concepts on ${name}`}
                    className="text-gray-400 hover:text-primary transition-colors"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            )}
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
