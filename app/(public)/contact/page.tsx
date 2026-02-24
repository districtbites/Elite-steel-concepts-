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
  };
}

export default async function ContactPage() {
  const [settings, faqs, contactHero] = await Promise.all([
    getSettings(),
    getFAQs(),
    getMediaAsset("contact", "hero", "https://images.pexels.com/photos/2577274/pexels-photo-2577274.jpeg?auto=compress&cs=tinysrgb&w=1200"),
  ]);

  const stats = [
    { label: "Fabrication Time", value: "8-12 Weeks", icon: Clock },
    { label: "Code Guaranteed", value: "Health & Fire", icon: ShieldCheck },
    { label: "Facility tours", value: "By Appointment", icon: Factory },
  ];

  const socialLinks = [
    { name: "Instagram", icon: Instagram, href: "#" },
    { name: "Facebook", icon: Facebook, href: "#" },
    { name: "Youtube", icon: Youtube, href: "#" },
  ];

  return (
    <>
      <PageHeader
        title="Command Center"
        subtitle="Secure your fabrication slot or schedule a design consultation with our engineering team."
      />

      <Section className="bg-white overflow-hidden">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* Intel Sidebar (5 Cols) */}
            <div className="lg:col-span-5 space-y-12">
              <div className="relative">
                <span className="text-primary font-bold tracking-widest uppercase text-[10px] mb-4 block underline decoration-secondary decoration-4 underline-offset-8">Primary Channels</span>
                <h2 className="text-4xl font-black uppercase text-secondary tracking-tighter leading-tight mb-6">
                  Elite Steel <br/> <span className="text-primary italic">Direct Access</span>
                </h2>
                <p className="text-gray-500 text-lg font-light leading-relaxed">
                  Our fabrication shop is where the magic happens. We're ready to translate your culinary vision into a mobile powerhouse.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100 group hover:border-primary transition-all duration-300">
                  <div className="flex items-center gap-6">
                    <div className="bg-white p-4 rounded-2xl shadow-sm text-primary group-hover:scale-110 transition-transform">
                      <Phone size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">24/7 Hotline</p>
                      <a href={`tel:${settings.phone}`} className="text-xl font-black text-secondary hover:text-primary transition-colors">
                        {settings.phone}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100 group hover:border-primary transition-all duration-300">
                  <div className="flex items-center gap-6">
                    <div className="bg-white p-4 rounded-2xl shadow-sm text-primary group-hover:scale-110 transition-transform">
                      <Mail size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Official Inquiry</p>
                      <a href={`mailto:${settings.email}`} className="text-xl font-black text-secondary hover:text-primary transition-colors">
                        {settings.email}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100 group hover:border-primary transition-all duration-300">
                  <div className="flex items-center gap-6">
                    <div className="bg-white p-4 rounded-2xl shadow-sm text-primary group-hover:scale-110 transition-transform">
                      <MapPin size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Global HQ</p>
                      <p className="font-bold text-secondary text-sm">
                        {settings.address}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Channels */}
              <div className="pt-8 border-t border-gray-100">
                <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-6">Connect via Social</h4>
                <div className="flex gap-4">
                  {socialLinks.map((social) => (
                    <a key={social.name} href={social.href} className="w-12 h-12 bg-secondary text-white rounded-xl flex items-center justify-center hover:bg-primary hover:text-secondary transition-all shadow-lg group">
                      <social.icon size={20} className="group-hover:scale-110 transition-transform" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Stats / Indicators */}
              <div className="bg-secondary p-10 rounded-[3rem] text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                <div className="space-y-8 relative z-10">
                   {stats.map((stat, i) => (
                     <div key={i} className="flex items-center gap-4">
                        <div className="text-primary"><stat.icon size={24} /></div>
                        <div>
                           <div className="text-[8px] font-black uppercase tracking-widest text-gray-400 opacity-60">{stat.label}</div>
                           <div className="text-sm font-bold uppercase tracking-tight">{stat.value}</div>
                        </div>
                     </div>
                   ))}
                </div>
              </div>
            </div>

            {/* Application Form Main (7 Cols) */}
            <div className="lg:col-span-7">
               <div className="sticky top-32">
                  <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-2xl relative border border-gray-50">
                     <div className="absolute -top-6 -left-6 bg-primary text-secondary p-4 rounded-2xl shadow-xl hidden md:block">
                        <MessageSquare size={32} />
                     </div>
                     <div className="mb-10">
                        <h3 className="text-3xl font-black uppercase text-secondary tracking-tighter mb-2">
                          Project Brief Submission
                        </h3>
                        <p className="text-gray-400 font-light text-sm italic">
                          "Typically replied to within 4 business hours"
                        </p>
                     </div>
                     <ContactForm />
                  </div>

                  {/* Trust Badge */}
                  <div className="mt-12 flex flex-col md:flex-row items-center gap-8 px-4 opacity-50 grayscale hover:grayscale-0 transition-all">
                     <div className="text-[10px] font-black uppercase text-secondary tracking-[0.2em] whitespace-nowrap">Authorized Fabrication Partners</div>
                     <div className="w-full h-[1px] bg-gray-100 hidden md:block"></div>
                     <div className="flex gap-8 items-center">
                        {/* Use placeholders/logos if available */}
                        <span className="font-black text-xs uppercase tracking-tighter text-secondary">NFPA 96</span>
                        <span className="font-black text-xs uppercase tracking-tighter text-secondary">NSF CERT</span>
                        <span className="font-black text-xs uppercase tracking-tighter text-secondary">ANSI Standard</span>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Map Integration */}
      {settings.mapEmbedUrl && (
        <Section className="bg-gray-50 py-0">
           <div 
               className="w-full h-[500px] grayscale hover:grayscale-0 transition-all duration-1000 shadow-inner"
               dangerouslySetInnerHTML={{ __html: settings.mapEmbedUrl }}
           />
        </Section>
      )}

      {/* Relevant FAQs */}
      <FAQSection faqs={faqs.filter(f => f.category === "General" || f.category === "Process").slice(0, 4)} />

      {/* Factory Tour Banner */}
      <Section className="bg-white">
        <Container>
           <div className="relative rounded-[3rem] overflow-hidden bg-secondary text-white p-12 md:p-24 group">
              <div className="absolute inset-0">
                 <Image 
                    src={contactHero.url} 
                    alt={contactHero.alt || "Elite Steel Factory"} 
                    fill 
                    className="object-cover opacity-20 group-hover:scale-110 transition-transform duration-[2000ms]"
                 />
                 <div className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary/80 to-transparent"></div>
              </div>
              <div className="relative z-10 max-w-2xl">
                 <span className="text-primary font-bold tracking-widest uppercase text-xs mb-4 block">Visual Confirmation</span>
                 <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-tight mb-8">
                    Schedule Your <br/> <span className="text-primary italic">Factory Tour</span>
                 </h2>
                 <p className="text-gray-400 text-lg font-light leading-relaxed mb-10">
                    See our engineering excellence in person. Visit our Manassas facility to walk through builds in progress and meet the master fabricators behind the steel.
                 </p>
                 <Link href={`tel:${settings.phone}`} className="inline-flex items-center gap-3 bg-primary text-secondary px-10 py-5 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-white transition-all shadow-2xl">
                    Call To Arrange <ArrowRight size={18} />
                 </Link>
              </div>
           </div>
        </Container>
      </Section>
    </>
  );
}
