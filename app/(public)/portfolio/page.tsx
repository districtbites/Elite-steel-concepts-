import React from "react";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";
import PortfolioGallery from "@/components/PortfolioGallery";
import FAQSection from "@/components/FAQSection";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star, Award, Zap, Camera, Sparkles, Shield, CheckCircle2 } from "lucide-react";
import { getProjects, getFAQs, getSEO, getPageSEO, getSettings } from "@/lib/db";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSEO();
  const pageSeo = await getPageSEO("portfolio");

  return {
    title: pageSeo?.title || `Our Portfolio | ${seo.siteTitle}`,
    description: pageSeo?.description || seo.description,
    keywords: pageSeo?.keywords || seo.keywords,
    alternates: { canonical: '/portfolio' },
  };
}

export default async function PortfolioPage() {
  const [allProjects, faqs, settings] = await Promise.all([
    getProjects(),
    getFAQs(),
    getSettings(),
  ]);

  const featuredProject = allProjects.find((p) => p.featured) || allProjects[0];
  const categories = new Set(allProjects.map((p) => p.category)).size;

  const stats = [
    { label: "Builds Completed", value: settings.trucksBuiltCount ? `${settings.trucksBuiltCount}+` : "350+", icon: Award },
    { label: "Categories", value: `${categories} Types`, icon: Zap },
    { label: "Client Satisfaction", value: "100%", icon: Star },
    { label: "Gallery Projects", value: `${allProjects.length} Units`, icon: Camera },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Portfolio of ECS"
        title="Elite Steel Concept Work Portfolio"
        subtitle="Take a look at our completed custom food truck and trailer projects, built by an experienced custom food truck builder and designed around each business’s unique needs."
      >
        <Link
          href="/quote"
          className="inline-flex items-center justify-center gap-3 mt-8 bg-primary text-black px-10 py-5 font-black uppercase tracking-[0.2em] text-[10px] hover:bg-orange-600 hover:text-white transition-colors shadow-[0_0_40px_rgba(247,147,30,0.25)]"
        >
          Get a free quote today! <ArrowRight size={14} />
        </Link>
      </PageHeader>

      {/* ═══════ FEATURED SPOTLIGHT ═══════ */}
      {featuredProject && (
        <Section className="bg-white overflow-hidden relative py-24 md:py-32">
          <Container>
            <div className="flex flex-col lg:flex-row items-center gap-16">
              {/* Image */}
              <div className="w-full lg:w-1/2 relative group">
                <div className="absolute -left-4 -top-4 w-full h-full bg-primary translate-x-2 translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-500" />
                <div className="relative aspect-video border-2 border-black overflow-hidden bg-black z-10">
                  <Image
                    src={featuredProject.image}
                    alt={featuredProject.title}
                    fill
                    className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 grayscale group-hover:grayscale-0"
                    unoptimized
                  />
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="bg-primary text-black px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] border border-black flex items-center gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                      <Sparkles size={12} /> Featured Build
                    </span>
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="w-full lg:w-1/2 space-y-8">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-1.5 h-1.5 bg-primary" />
                    <span className="text-black font-black tracking-[0.2em] uppercase text-[10px]">
                      Spotlight Project
                    </span>
                  </div>
                  <h2 className="text-5xl md:text-6xl font-black uppercase text-black tracking-tighter mb-4 leading-none">
                    {featuredProject.title}
                  </h2>
                  {featuredProject.tagline && (
                    <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mb-6">
                      &ldquo;{featuredProject.tagline}&rdquo;
                    </p>
                  )}
                  <div className="pl-6 border-l-[3px] border-black">
                     <p className="text-gray-600 text-lg leading-relaxed font-medium line-clamp-4">
                       {featuredProject.description}
                     </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 border border-gray-200">
                    <span className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em] block mb-1">
                      Category
                    </span>
                    <span className="text-sm font-black text-black uppercase tracking-tight">
                      {featuredProject.category}
                    </span>
                  </div>
                  <div className="bg-gray-50 p-4 border border-gray-200">
                    <span className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em] block mb-1">
                      Completed
                    </span>
                    <span className="text-sm font-black text-black uppercase tracking-tight">
                      {featuredProject.completionDate || "Recent"}
                    </span>
                  </div>
                  {featuredProject.client && (
                    <div className="bg-gray-50 p-4 border border-gray-200">
                      <span className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em] block mb-1">
                        Client
                      </span>
                      <span className="text-sm font-black text-black uppercase tracking-tight">
                        {featuredProject.client}
                      </span>
                    </div>
                  )}
                </div>

                <Link
                  href={`/portfolio/${featuredProject.slug}`}
                  className="inline-flex items-center justify-center gap-3 bg-black text-white px-10 py-5 font-black uppercase tracking-[0.2em] text-[10px] hover:bg-primary hover:text-black transition-colors"
                >
                  View Full Project <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </Container>
        </Section>
      )}

      {/* ═══════ STATS DIVIDER ═══════ */}
      <div className="bg-[#0a0a0a] py-16 border-y border-[#1a1a1a] relative overflow-hidden">
        {/* Industrial grid overlay */}
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "repeating-linear-gradient(0deg, #fff 0px, #fff 1px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, #fff 0px, #fff 1px, transparent 1px, transparent 40px)" }} />
        
        <Container className="relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="flex flex-col items-center justify-center group relative p-6">
                <stat.icon
                  className="text-primary mb-4 group-hover:scale-125 transition-transform duration-500"
                  size={24}
                />
                <div className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-2 leading-none">
                  {stat.value}
                </div>
                <div className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </div>

      {/* ═══════ MAIN GALLERY ═══════ */}
      <Section className="bg-white py-24 md:py-32">
        <Container>
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-1.5 h-1.5 bg-black" />
              <span className="text-black font-black tracking-[0.2em] uppercase text-[10px]">The Gallery</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-black uppercase text-black tracking-tighter mb-6 leading-none">
              Our Diverse <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-600">Fleet</span>
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed text-sm md:text-base border-l-2 border-black pl-4 text-left">
              Filter by category to browse specific build types. Each project showcases our
              dedication to structural integrity and culinary innovation.
            </p>
          </div>
          {/* Note: PortfolioGallery component itself needs to match the design system. Assuming it's already updated or uses standard components. */}
          <PortfolioGallery initialProjects={allProjects} />
        </Container>
      </Section>

      {/* ═══════ WHY CHOOSE US (mini) ═══════ */}
      <Section className="bg-[#0a0a0a] py-32 border-y border-[#1a1a1a] relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "repeating-linear-gradient(45deg, #fff 0px, #fff 1px, transparent 1px, transparent 10px)" }} />
        
        <Container className="relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "100% Code Compliant",
                desc: "Every build passes health and fire safety inspections — guaranteed.",
              },
              {
                icon: CheckCircle2,
                title: "End-to-End Service",
                desc: "From initial design consultation to final handover and training.",
              },
              {
                icon: Award,
                title: "Award-Winning Quality",
                desc: "Master welding and precision engineering that lasts a lifetime.",
              },
            ].map((item, i) => (
              <div key={i} className="space-y-6 bg-transparent p-8 border border-[#1a1a1a] hover:border-primary transition-colors group">
                <div className="text-primary">
                  <item.icon size={48} className="group-hover:scale-110 transition-transform" />
                </div>
                <h4 className="text-2xl font-black text-white uppercase tracking-tighter leading-none">{item.title}</h4>
                <p className="text-sm text-gray-400 font-bold uppercase tracking-wider leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* FAQ */}
      <FAQSection faqs={faqs.filter((f) => f.category === "Portfolio" || f.category === "General")} />

      {/* ═══════ FINAL CTA ═══════ */}
      <Section className="bg-primary py-32 border-t border-black">
        <Container>
          <div className="flex flex-col items-center text-center relative">
            <h2 className="text-6xl md:text-8xl font-black text-black uppercase tracking-tighter mb-12 max-w-4xl relative z-10 leading-[0.85]">
               Initialize Your <br />
              <span className="text-white">Custom Build</span>
            </h2>
            <div className="flex flex-col sm:flex-row gap-6 relative z-10">
              <Link
                href="/quote"
                className="bg-black text-white px-12 py-6 font-black uppercase tracking-[0.2em] text-[10px] hover:bg-white hover:text-black transition-colors shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] hover:shadow-none hover:translate-x-2 hover:translate-y-2 min-w-[260px]"
              >
                Get A Custom Quote
              </Link>
              <Link
                href="/contact"
                className="bg-transparent text-black border-2 border-black px-12 py-6 font-black uppercase tracking-[0.2em] text-[10px] hover:bg-black hover:text-white transition-colors min-w-[260px]"
              >
                Schedule Factory Tour
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
