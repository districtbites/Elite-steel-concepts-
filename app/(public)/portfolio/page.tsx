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
    { label: "Builds Completed", value: settings.trucksBuiltCount || "150+", icon: Award },
    { label: "Categories", value: `${categories} Types`, icon: Zap },
    { label: "Client Satisfaction", value: "100%", icon: Star },
    { label: "Gallery Projects", value: `${allProjects.length} Units`, icon: Camera },
  ];

  return (
    <>
      <PageHeader
        title="Showcase of Excellence"
        subtitle="Explore our gallery of high-performance mobile kitchens. Every build represents a unique partnership between our engineering team and culinary visionaries."
      />

      {/* ═══════ FEATURED SPOTLIGHT ═══════ */}
      {featuredProject && (
        <Section className="bg-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent hidden lg:block" />
          <Container>
            <div className="flex flex-col lg:flex-row items-center gap-16">
              {/* Image */}
              <div className="w-full lg:w-1/2 relative group">
                <div className="absolute -inset-3 bg-gradient-to-br from-primary/30 to-primary/10 rounded-[2.5rem] blur-xl opacity-50 group-hover:opacity-80 transition-opacity duration-700" />
                <div className="relative aspect-video rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white">
                  <Image
                    src={featuredProject.image}
                    alt={featuredProject.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    unoptimized
                  />
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="bg-primary text-secondary px-4 py-2 rounded-full text-[8px] font-black uppercase tracking-[0.2em] shadow-lg flex items-center gap-1.5">
                      <Sparkles size={10} /> Featured Build
                    </span>
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="w-full lg:w-1/2 space-y-6">
                <div>
                  <span className="text-primary font-bold tracking-widest uppercase text-[10px] mb-3 block underline decoration-secondary decoration-4 underline-offset-8">
                    Spotlight Project
                  </span>
                  <h2 className="text-4xl md:text-5xl font-black uppercase text-secondary tracking-tighter mb-4 leading-tight">
                    {featuredProject.title}
                  </h2>
                  {featuredProject.tagline && (
                    <p className="text-sm text-gray-400 italic font-medium mb-4">
                      &ldquo;{featuredProject.tagline}&rdquo;
                    </p>
                  )}
                  <p className="text-gray-600 text-lg leading-relaxed font-light line-clamp-4">
                    {featuredProject.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <div className="bg-gray-50 px-5 py-3 rounded-2xl border border-gray-100">
                    <span className="text-[8px] font-black uppercase text-gray-400 tracking-widest block mb-0.5">
                      Category
                    </span>
                    <span className="text-sm font-bold text-secondary uppercase">
                      {featuredProject.category}
                    </span>
                  </div>
                  <div className="bg-gray-50 px-5 py-3 rounded-2xl border border-gray-100">
                    <span className="text-[8px] font-black uppercase text-gray-400 tracking-widest block mb-0.5">
                      Completed
                    </span>
                    <span className="text-sm font-bold text-secondary uppercase">
                      {featuredProject.completionDate || "Recent"}
                    </span>
                  </div>
                  {featuredProject.client && (
                    <div className="bg-gray-50 px-5 py-3 rounded-2xl border border-gray-100">
                      <span className="text-[8px] font-black uppercase text-gray-400 tracking-widest block mb-0.5">
                        Client
                      </span>
                      <span className="text-sm font-bold text-secondary uppercase">
                        {featuredProject.client}
                      </span>
                    </div>
                  )}
                </div>

                <Link
                  href={`/portfolio/${featuredProject.slug}`}
                  className="inline-flex items-center gap-3 bg-secondary text-white px-8 py-4 rounded-full font-black uppercase tracking-widest text-xs hover:bg-primary hover:text-secondary transition-all shadow-xl"
                >
                  View Full Project <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </Container>
        </Section>
      )}

      {/* ═══════ STATS DIVIDER ═══════ */}
      <div className="bg-secondary py-14 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[120px] rounded-full -mr-48 -mt-48" />
        <Container className="relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center group">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:bg-primary group-hover:border-primary transition-all">
                    <stat.icon
                      className="text-primary group-hover:text-secondary transition-colors"
                      size={22}
                    />
                  </div>
                </div>
                <div className="text-3xl md:text-4xl font-black text-white tracking-tighter mb-1">
                  {stat.value}
                </div>
                <div className="text-[9px] font-bold text-gray-500 uppercase tracking-[0.2em]">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </div>

      {/* ═══════ MAIN GALLERY ═══════ */}
      <Section className="bg-gray-50/50">
        <Container>
          <div className="text-center mb-16">
            <span className="text-primary font-bold tracking-widest uppercase text-[10px] mb-3 block">
              The Gallery
            </span>
            <h2 className="text-4xl md:text-5xl font-black uppercase text-secondary tracking-tighter mb-4">
              Our Diverse <span className="text-primary italic">Fleet</span>
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto font-light leading-relaxed text-sm">
              Filter by category to browse specific build types. Each project showcases our
              dedication to structural integrity and culinary innovation.
            </p>
          </div>
          <PortfolioGallery initialProjects={allProjects} />
        </Container>
      </Section>

      {/* ═══════ WHY CHOOSE US (mini) ═══════ */}
      <Section className="bg-white">
        <Container>
          <div className="bg-gradient-to-br from-secondary via-secondary to-gray-900 rounded-[3rem] p-12 md:p-16 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-primary/15 blur-[100px] rounded-full" />
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-10">
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
                <div key={i} className="space-y-4 group">
                  <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all">
                    <item.icon size={22} className="text-primary group-hover:text-secondary transition-colors" />
                  </div>
                  <h4 className="text-lg font-black uppercase tracking-tight">{item.title}</h4>
                  <p className="text-sm text-gray-400 font-light leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* FAQ */}
      <FAQSection faqs={faqs.filter((f) => f.category === "Portfolio" || f.category === "General")} />

      {/* ═══════ FINAL CTA ═══════ */}
      <Section className="bg-gray-50">
        <Container>
          <div className="bg-primary rounded-[3rem] p-12 md:p-20 flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_white/10_0%,_transparent_70%)]" />
            <h2 className="text-3xl md:text-5xl font-black text-secondary uppercase tracking-tighter mb-8 max-w-3xl relative z-10 leading-tight">
              Your Dream Build <br />
              <span className="opacity-50 underline decoration-4 underline-offset-8 uppercase">
                Starts With A Quote
              </span>
            </h2>
            <div className="flex flex-col md:flex-row gap-4 relative z-10">
              <Link
                href="/quote"
                className="bg-secondary text-white px-12 py-5 rounded-full font-black uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all shadow-2xl"
              >
                Get A Custom Quote
              </Link>
              <Link
                href="/contact"
                className="bg-white text-secondary border-2 border-secondary px-12 py-5 rounded-full font-black uppercase tracking-widest text-xs hover:bg-secondary hover:text-white transition-all shadow-xl"
              >
                Schedule A Factory Tour
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
