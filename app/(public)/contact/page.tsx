import React from "react";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";
import ContactForm from "@/components/ContactForm";
import FAQSection from "@/components/FAQSection";
import { Phone, Mail, MapPin, Clock, MessageSquare, ShieldCheck, Factory, Instagram, Facebook, Youtube, ArrowRight } from "lucide-react";
import { getSettings, getPageSEO, getSEO, getFAQs, getMediaAsset } from "@/lib/db";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSEO();
  const pageSeo = await getPageSEO("contact");
  
  return {
    title: pageSeo?.title || `Contact Elite Steel Concepts | Custom Food Trucks`,
    description: pageSeo?.description || seo.description,
    keywords: pageSeo?.keywords || seo.keywords,
    alternates: { canonical: '/contact' },
  };
}

export default async function ContactPage() {
  const [settings, faqs, contactHero] = await Promise.all([
    getSettings(),
    getFAQs(),
    getMediaAsset("contact", "hero", "https://images.pexels.com/photos/2577274/pexels-photo-2577274.jpeg?auto=compress&cs=tinysrgb&w=1200"),
  ]);

  const socialLinks = [
    { name: "Instagram", icon: Instagram, href: settings.instagram || "#" },
    { name: "Facebook", icon: Facebook, href: settings.facebook || "#" },
    { name: "Youtube", icon: Youtube, href: settings.youtube || "#" },
  ].filter(link => link.href && link.href !== "#");

  return (
    <>
      <PageHeader
        title="Command Center"
        subtitle="Secure your fabrication slot or schedule a design consultation with our engineering team."
      />

      <Section className="bg-white overflow-hidden pb-32">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
            {/* Intel Sidebar (5 Cols) */}
            <div className="lg:col-span-5 space-y-12 mt-8 lg:mt-0">
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-1.5 h-1.5 bg-primary" />
                  <span className="text-black font-black tracking-[0.2em] uppercase text-[10px]">Primary Channels</span>
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase text-black tracking-tighter leading-[0.9] mb-6">
                  Elite Steel <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-600">Direct Access</span>
                </h2>
                <p className="text-gray-500 text-sm font-bold uppercase tracking-widest leading-relaxed max-w-md">
                  Our fabrication shop is where the magic happens. We're ready to translate your culinary vision into a mobile powerhouse.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="bg-[#0a0a0a] p-8 border border-[#1a1a1a] group hover:border-primary transition-colors relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary scale-y-0 group-hover:scale-y-100 transition-transform origin-top" />
                  <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                    <div className="bg-[#1a1a1a] p-4 text-primary shrink-0">
                      <Phone size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em] mb-1">24/7 Hotline</p>
                      <a href={`tel:${settings.phone}`} className="text-xl md:text-2xl font-black text-white hover:text-primary transition-colors tracking-tight">
                        {settings.phone}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="bg-[#0a0a0a] p-8 border border-[#1a1a1a] group hover:border-primary transition-colors relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary scale-y-0 group-hover:scale-y-100 transition-transform origin-top" />
                  <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                    <div className="bg-[#1a1a1a] p-4 text-primary shrink-0">
                      <Mail size={24} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em] mb-1">Official Inquiry</p>
                      <a href={`mailto:${settings.email}`} className="text-lg md:text-xl font-black text-white hover:text-primary transition-colors truncate block">
                        {settings.email}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="bg-[#0a0a0a] p-8 border border-[#1a1a1a] group hover:border-primary transition-colors relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary scale-y-0 group-hover:scale-y-100 transition-transform origin-top" />
                  <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                    <div className="bg-[#1a1a1a] p-4 text-primary shrink-0">
                      <MapPin size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em] mb-1">Global HQ</p>
                      <p className="font-bold text-white text-sm md:text-base leading-tight uppercase tracking-widest">
                        {settings.address}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Channels */}
              {socialLinks.length > 0 && (
                 <div className="pt-8 border-t-2 border-black">
                   <h4 className="text-[10px] font-black uppercase text-black tracking-[0.2em] mb-6 flex items-center gap-2">
                     <div className="w-1.5 h-1.5 bg-primary" /> Connect via Social
                   </h4>
                   <div className="flex gap-4">
                     {socialLinks.map((social) => (
                       <a key={social.name} href={social.href} target="_blank" rel="noopener noreferrer" className="w-14 h-14 bg-gray-100 text-black border border-gray-200 flex items-center justify-center hover:bg-primary hover:text-black hover:border-primary transition-colors group">
                         <social.icon size={22} className="group-hover:scale-110 transition-transform" />
                       </a>
                     ))}
                   </div>
                 </div>
              )}
            </div>

            {/* Application Form Main (7 Cols) */}
            <div className="lg:col-span-7">
               <div className="sticky top-32">
                  <div className="bg-white p-8 md:p-14 border border-gray-200 relative group shadow-2xl">
                     <div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-colors" />
                     
                     <div className="mb-10 border-b-2 border-black pb-8 flex items-start justify-between gap-4">
                        <div>
                           <h3 className="text-3xl md:text-4xl font-black uppercase text-black tracking-tighter mb-3 leading-none">
                             Project Brief
                           </h3>
                           <p className="text-gray-500 font-bold text-[10px] uppercase tracking-[0.2em] flex items-center gap-3">
                             <span className="relative flex h-2 w-2">
                               <span className="animate-ping absolute inline-flex h-full w-full bg-primary opacity-75"></span>
                               <span className="relative inline-flex h-2 w-2 bg-primary"></span>
                             </span>
                             Comms Channel Open
                           </p>
                        </div>
                        <div className="hidden md:block bg-[#0a0a0a] text-primary p-4 border border-[#1a1a1a]">
                           <MessageSquare size={24} />
                        </div>
                     </div>
                     <ContactForm />
                  </div>

                  {/* Trust Badge */}
                  <div className="mt-12 flex flex-col md:flex-row items-center gap-8 px-4 opacity-70 hover:opacity-100 transition-opacity">
                     <div className="text-[10px] font-black uppercase text-black tracking-[0.2em] whitespace-nowrap">Authorized Partners</div>
                     <div className="w-full h-[2px] bg-black hidden md:block"></div>
                     <div className="flex gap-6 items-center shrink-0">
                        <span className="font-black text-[10px] uppercase tracking-widest text-gray-500 border border-gray-200 px-3 py-1">NFPA 96</span>
                        <span className="font-black text-[10px] uppercase tracking-widest text-gray-500 border border-gray-200 px-3 py-1">NSF CERT</span>
                        <span className="font-black text-[10px] uppercase tracking-widest text-gray-500 border border-gray-200 px-3 py-1">ANSI Std</span>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Map Integration */}
      {settings.mapEmbedUrl && (
        <Section className="py-0 overflow-hidden bg-gray-50 border-t border-gray-200">
          <div className="relative w-full h-[500px] lg:h-[600px] group">
            {/* Map iframe */}
            <iframe
              src={settings.mapEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0, display: "block" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Elite Steel Concepts Location"
              className="w-full h-full grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000"
            />
            {/* Floating address card */}
            <div className="absolute bottom-6 left-6 md:bottom-12 md:left-12 bg-[#0a0a0a] border border-[#1a1a1a] p-8 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center gap-8 z-10 max-w-lg">
              <div className="bg-primary p-4 shrink-0 text-black hidden sm:block">
                <MapPin size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-2">Fabrication HQ</p>
                <p className="text-sm font-bold text-white uppercase tracking-widest leading-relaxed">{settings.address}</p>
              </div>
              {settings.googleMapsLink && (
                <a
                  href={settings.googleMapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sm:ml-auto bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] px-6 py-4 hover:bg-primary transition-colors whitespace-nowrap"
                >
                  Directions
                </a>
              )}
            </div>
          </div>
        </Section>
      )}

      {/* Relevant FAQs */}
      <FAQSection faqs={faqs.filter(f => f.category === "General" || f.category === "Process").slice(0, 4)} />

      {/* Factory Tour Banner */}
      <Section className="bg-white py-24">
        <Container>
           <div className="relative bg-[#0a0a0a] border border-[#1a1a1a] p-12 md:p-24 overflow-hidden group">
              {/* Background texture */}
              <div className="absolute inset-0 z-0">
                 <Image 
                    src={contactHero.url} 
                    alt={contactHero.alt || "Elite Steel Factory"} 
                    fill 
                    className="object-cover opacity-20 grayscale group-hover:grayscale-0 transition-all duration-[2000ms]"
                 />
                 <div className="absolute inset-0 bg-[#0a0a0a]/80 mix-blend-multiply"></div>
                 {/* Industrial grid */}
                 <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "repeating-linear-gradient(45deg, #fff 0px, #fff 1px, transparent 1px, transparent 10px)" }}></div>
              </div>
              
              <div className="relative z-10 max-w-3xl">
                 <div className="flex items-center gap-3 mb-6">
                    <Factory size={16} className="text-primary" />
                    <span className="text-primary font-black tracking-[0.2em] uppercase text-[10px]">Visual Confirmation</span>
                 </div>
                 <h2 className="text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter leading-[0.9] mb-8 text-white">
                    Schedule Your <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-600">Factory Tour</span>
                 </h2>
                 <p className="text-gray-400 text-sm font-bold uppercase tracking-widest leading-relaxed mb-12 max-w-2xl border-l-2 border-primary/30 pl-6">
                    See our engineering excellence in person. Visit our Manassas facility to walk through builds in progress and meet the master fabricators behind the steel.
                 </p>
                 <Link href={`tel:${settings.phone}`} className="inline-flex items-center gap-4 bg-primary text-black border border-primary px-10 py-5 font-black uppercase tracking-[0.2em] text-[10px] hover:bg-transparent hover:text-primary transition-colors">
                    Call To Arrange <ArrowRight size={14} />
                 </Link>
              </div>
           </div>
        </Container>
      </Section>
    </>
  );
}
