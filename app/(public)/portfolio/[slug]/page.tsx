import React from "react";
import { getProjectBySlug, getProjects, getMediaAsset } from "@/lib/db";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  User,
  Truck,
  MapPin,
  Ruler,
  Zap,
  ShieldCheck,
  Star,
  ArrowRight,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Project Not Found" };
  return {
    title: `${project.title} | Portfolio | Elite Steel Concepts`,
    description: project.description || `Custom food truck build: ${project.title}. See the full build details from Elite Steel Concepts — 14+ years, 350+ builds.`,
    alternates: {
      canonical: `/portfolio/${slug}`,
    },
    openGraph: {
      title: project.title,
      images: [project.image],
      type: "website",
    },
  };
}

export default async function ProjectDetailsPage({ params }: PageProps) {
  const { slug } = await params;
  const [project, allProjects] = await Promise.all([
    getProjectBySlug(slug),
    getProjects(),
  ]);

  if (!project) {
    return notFound();
  }

  // Related projects (same category, excluding current)
  const related = allProjects
    .filter((p) => p.category === project.category && p.id !== project.id)
    .slice(0, 3);

  const specs = project.specifications;

  return (
    <>
      {/* ═══════ HERO IMAGE ═══════ */}
      <div className="relative h-[55vh] md:h-[65vh] bg-secondary overflow-hidden">
        <Image
          src={project.image}
          unoptimized
          alt={project.title}
          fill
          className="object-cover opacity-70 scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/40 to-transparent" />

        <Container className="relative h-full flex flex-col justify-end pb-12 md:pb-16 pt-32">
          <Link
            href="/portfolio"
            className="inline-flex items-center text-white/60 hover:text-primary transition-colors mb-6 text-[10px] font-black uppercase tracking-[0.2em] group"
          >
            <ArrowLeft size={14} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Portfolio
          </Link>

          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="bg-primary text-secondary text-[8px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full shadow-lg">
              {project.category}
            </span>
            {project.featured && (
              <span className="bg-white/10 backdrop-blur-md text-primary text-[8px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full border border-white/20 flex items-center gap-1">
                <Sparkles size={10} /> Featured Build
              </span>
            )}
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase text-white tracking-tighter leading-[0.9] mb-3">
            {project.title}
          </h1>
          {project.tagline && (
            <p className="text-lg text-white/50 font-light italic">&ldquo;{project.tagline}&rdquo;</p>
          )}
        </Container>
      </div>

      {/* ═══════ MAIN CONTENT ═══════ */}
      <Section className="bg-white">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            {/* Main Content */}
            <div className="lg:col-span-7 space-y-10">
              {/* Project Overview */}
              <div>
                <span className="text-primary font-bold tracking-widest uppercase text-[10px] mb-3 block">
                  Project Overview
                </span>
                <h2 className="text-3xl md:text-4xl font-black uppercase text-secondary tracking-tighter mb-6 leading-tight">
                  About This Build
                </h2>
                <div className="text-gray-600 text-lg leading-loose whitespace-pre-wrap font-light">
                  {project.description}
                </div>
              </div>

              {/* Gallery */}
              {project.gallery && project.gallery.length > 0 && (
                <div>
                  <span className="text-primary font-bold tracking-widest uppercase text-[10px] mb-3 block">
                    Build Gallery
                  </span>
                  <h3 className="text-2xl font-black uppercase text-secondary tracking-tighter mb-6">
                    Detailed Views
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {project.gallery.map((img, i) => (
                      <div
                        key={i}
                        className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 group shadow-sm hover:shadow-xl transition-all"
                      >
                        <Image
                          src={img}
                          alt={`${project.title} - View ${i + 1}`}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                          unoptimized
                        />
                        <div className="absolute inset-0 bg-secondary/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-white text-[9px] font-black uppercase tracking-widest">
                            View {i + 1}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-5 space-y-6">
              {/* Specs Card */}
              <div className="bg-gray-50 border border-gray-100 p-8 rounded-[2rem] sticky top-32">
                <h3 className="text-sm font-black uppercase text-secondary tracking-[0.15em] mb-6 pb-4 border-b border-gray-200 flex items-center gap-2">
                  <ShieldCheck size={16} className="text-primary" /> Project Specifications
                </h3>

                <div className="space-y-5">
                  {/* Client */}
                  <div className="flex items-start gap-4 group">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0 group-hover:bg-primary/10 transition-colors">
                      <User size={18} className="text-primary" />
                    </div>
                    <div>
                      <h4 className="text-[9px] font-black uppercase text-gray-400 tracking-widest mb-0.5">Client</h4>
                      <p className="text-sm font-bold text-secondary">{project.client || "Private Client"}</p>
                    </div>
                  </div>

                  {/* Completion */}
                  <div className="flex items-start gap-4 group">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0 group-hover:bg-primary/10 transition-colors">
                      <Calendar size={18} className="text-primary" />
                    </div>
                    <div>
                      <h4 className="text-[9px] font-black uppercase text-gray-400 tracking-widest mb-0.5">Completed</h4>
                      <p className="text-sm font-bold text-secondary">{project.completionDate || "Recently Completed"}</p>
                    </div>
                  </div>

                  {/* Category */}
                  <div className="flex items-start gap-4 group">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0 group-hover:bg-primary/10 transition-colors">
                      <Truck size={18} className="text-primary" />
                    </div>
                    <div>
                      <h4 className="text-[9px] font-black uppercase text-gray-400 tracking-widest mb-0.5">Vehicle Type</h4>
                      <p className="text-sm font-bold text-secondary">{project.category}</p>
                    </div>
                  </div>

                  {/* Location */}
                  {project.location && (
                    <div className="flex items-start gap-4 group">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0 group-hover:bg-primary/10 transition-colors">
                        <MapPin size={18} className="text-primary" />
                      </div>
                      <div>
                        <h4 className="text-[9px] font-black uppercase text-gray-400 tracking-widest mb-0.5">Location</h4>
                        <p className="text-sm font-bold text-secondary">{project.location}</p>
                      </div>
                    </div>
                  )}

                  {/* Technical Specs */}
                  {specs && (
                    <>
                      <div className="border-t border-gray-200 pt-5 mt-5">
                        <h4 className="text-[9px] font-black uppercase text-gray-400 tracking-widest mb-4">Technical Details</h4>
                        <div className="grid grid-cols-1 gap-3">
                          {specs.dimensions && (
                            <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-xl border border-gray-100 shadow-sm">
                              <Ruler size={14} className="text-primary shrink-0" />
                              <div>
                                <span className="text-[7px] font-black uppercase text-gray-400 tracking-widest block">Dimensions</span>
                                <span className="text-xs font-bold text-secondary">{specs.dimensions}</span>
                              </div>
                            </div>
                          )}
                          {specs.chassis && (
                            <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-xl border border-gray-100 shadow-sm">
                              <Truck size={14} className="text-primary shrink-0" />
                              <div>
                                <span className="text-[7px] font-black uppercase text-gray-400 tracking-widest block">Chassis</span>
                                <span className="text-xs font-bold text-secondary">{specs.chassis}</span>
                              </div>
                            </div>
                          )}
                          {specs.power && (
                            <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-xl border border-gray-100 shadow-sm">
                              <Zap size={14} className="text-primary shrink-0" />
                              <div>
                                <span className="text-[7px] font-black uppercase text-gray-400 tracking-widest block">Power</span>
                                <span className="text-xs font-bold text-secondary">{specs.power}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {specs.equipment && specs.equipment.length > 0 && (
                        <div>
                          <h4 className="text-[9px] font-black uppercase text-gray-400 tracking-widest mb-3">Equipment Manifest</h4>
                          <div className="flex flex-wrap gap-2">
                            {specs.equipment.map((item, i) => (
                              <span
                                key={i}
                                className="bg-white border border-gray-100 text-[9px] font-bold uppercase text-secondary px-3 py-1.5 rounded-full shadow-sm"
                              >
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* CTA */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h4 className="text-sm font-black uppercase text-secondary tracking-tight mb-2">Inspired by this build?</h4>
                  <p className="text-xs text-gray-400 font-medium mb-4 leading-relaxed">
                    Get a custom quote for a similar project. We&apos;ll match your menu, branding, and budget.
                  </p>
                  <Link
                    href="/quote"
                    className="block w-full text-center bg-primary text-secondary py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-secondary hover:text-white transition-all shadow-xl"
                  >
                    Request Custom Quote
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* ═══════ RELATED PROJECTS ═══════ */}
      {related.length > 0 && (
        <Section className="bg-gray-50">
          <Container>
            <div className="text-center mb-12">
              <span className="text-primary font-bold tracking-widest uppercase text-[10px] mb-3 block">
                Similar Builds
              </span>
              <h2 className="text-3xl md:text-4xl font-black uppercase text-secondary tracking-tighter">
                More <span className="text-primary italic">{project.category}</span> Projects
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {related.map((rp) => (
                <Link
                  key={rp.id}
                  href={`/portfolio/${rp.slug}`}
                  className="group bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={rp.image}
                      alt={rp.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                      unoptimized
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-primary text-secondary text-[7px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full shadow-lg">
                        {rp.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-black uppercase text-secondary tracking-tighter group-hover:text-primary transition-colors leading-tight mb-2">
                      {rp.title}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                        {rp.completionDate || "Recent"}
                      </span>
                      <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest group-hover:text-primary transition-colors flex items-center gap-1">
                        View <ChevronRight size={10} />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* ═══════ FINAL CTA ═══════ */}
      <Section className="bg-white">
        <Container>
          <div className="bg-secondary rounded-[3rem] p-12 md:p-20 flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[120px] rounded-full" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary/5 blur-[80px] rounded-full" />
            <div className="relative z-10 max-w-3xl">
              <Star size={32} className="text-primary mx-auto mb-6" />
              <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mb-6 leading-tight">
                Ready to Start{" "}
                <span className="text-primary italic">Your Build?</span>
              </h2>
              <p className="text-gray-400 text-lg font-light mb-10 max-w-xl mx-auto leading-relaxed">
                Every great mobile business starts with a conversation.
                Tell us about your vision and we&apos;ll engineer the perfect kitchen.
              </p>
              <div className="flex flex-col md:flex-row gap-4 justify-center">
                <Link
                  href="/quote"
                  className="bg-primary text-secondary px-12 py-5 rounded-full font-black uppercase tracking-widest text-xs hover:bg-white transition-all shadow-2xl"
                >
                  Get Custom Quote
                </Link>
                <Link
                  href="/portfolio"
                  className="bg-white/10 text-white border border-white/20 backdrop-blur-md px-12 py-5 rounded-full font-black uppercase tracking-widest text-xs hover:bg-white/20 transition-all"
                >
                  Back to Gallery
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
