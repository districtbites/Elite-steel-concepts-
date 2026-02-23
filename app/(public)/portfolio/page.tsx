import React from "react";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";
import PortfolioGallery from "@/components/PortfolioGallery";
import FAQSection from "@/components/FAQSection";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star, Award, Zap, Camera } from "lucide-react";
import { getProjects, getFAQs, getSEO, getPageSEO } from "@/lib/db";
import type { Metadata } from "next";

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
  const allProjects = await getProjects();
  const faqs = await getFAQs();
  
  // Filter for a featured project (e.g., the first one or one marked as featured if we had that flag)
  const featuredProject = allProjects.find(p => p.featured) || allProjects[0];
  
  // Stats
  const stats = [
    { label: "Builds Completed", value: "150+", icon: Award },
    { label: "Design Concepts", value: "300+", icon: Zap },
    { label: "Happy Clients", value: "100%", icon: Star },
    { label: "Project Gallery", value: `${allProjects.length} Units`, icon: Camera },
  ];

  return (
    <>
      <PageHeader
        title="Showcase of Excellence"
        subtitle="Explore our gallery of high-performance mobile kitchens. Every build represents a unique partnership between our engineering team and culinary visionaries."
      />

      {/* Featured Spotlight */}
      {featuredProject && (
        <Section className="bg-white overflow-hidden relative">
           <div className="absolute top-0 right-0 w-1/3 h-full bg-secondary/5 -skew-x-12 transform origin-top translate-x-1/2 hidden md:block"></div>
           <Container>
              <div className="flex flex-col lg:flex-row items-center gap-16">
                 <div className="w-full lg:w-1/2 relative group">
                    <div className="absolute -inset-2 bg-primary/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-700"></div>
                    <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                       <Image 
                          src={featuredProject.image} 
                          alt={featuredProject.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                       />
                       <div className="absolute top-4 left-4 bg-primary text-secondary px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg">
                          Featured Build
                       </div>
                    </div>
                 </div>
                 <div className="w-full lg:w-1/2">
                    <span className="text-primary font-bold tracking-widest uppercase text-sm mb-4 block underline decoration-secondary decoration-4 underline-offset-8">Spotlight Project</span>
                    <h2 className="text-4xl md:text-5xl font-black uppercase text-secondary tracking-tight mb-6 leading-tight">
                       {featuredProject.title}
                    </h2>
                    <p className="text-gray-600 text-lg leading-relaxed mb-8 font-light line-clamp-4">
                       {featuredProject.description}
                    </p>
                    <div className="flex flex-wrap gap-4 mb-10">
                       <div className="bg-gray-50 px-6 py-4 rounded-2xl border border-gray-100">
                          <span className="text-[10px] font-black uppercase text-gray-400 block mb-1">Category</span>
                          <span className="text-sm font-bold text-secondary uppercase">{featuredProject.category}</span>
                       </div>
                       <div className="bg-gray-50 px-6 py-4 rounded-2xl border border-gray-100">
                          <span className="text-[10px] font-black uppercase text-gray-400 block mb-1">Completion</span>
                          <span className="text-sm font-bold text-secondary uppercase">{featuredProject.completionDate}</span>
                       </div>
                    </div>
                    <Link 
                      href={`/portfolio/${featuredProject.slug}`}
                      className="inline-flex items-center gap-3 bg-secondary text-white px-8 py-4 rounded-full font-black uppercase tracking-widest text-xs hover:bg-primary hover:text-secondary transition-all shadow-xl"
                    >
                       View Project Details <ArrowRight size={18} />
                    </Link>
                 </div>
              </div>
           </Container>
        </Section>
      )}

      {/* Stats Divider */}
      <div className="bg-secondary py-12 border-y border-white/10">
         <Container>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
               {stats.map((stat, i) => (
                  <div key={i} className="text-center group">
                     <div className="flex justify-center mb-3">
                        <stat.icon className="text-primary group-hover:scale-110 transition-transform" size={24} />
                     </div>
                     <div className="text-3xl font-black text-white tracking-tighter mb-1">{stat.value}</div>
                     <div className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">{stat.label}</div>
                  </div>
               ))}
            </div>
         </Container>
      </div>

      {/* Main Gallery Section */}
      <Section className="bg-gray-50/50">
        <Container>
           <div className="text-center mb-20">
              <span className="text-primary font-bold tracking-widest uppercase text-sm mb-4 block">The Gallery</span>
              <h2 className="text-4xl md:text-5xl font-black uppercase text-secondary tracking-tighter mb-6">Our Diverse <span className="text-primary italic">Fleet</span></h2>
              <p className="text-gray-500 max-w-2xl mx-auto font-light leading-relaxed">
                 Use the filters below to browse our specific build categories. Each project represents our dedication to structural integrity and culinary innovation.
              </p>
           </div>
           <PortfolioGallery initialProjects={allProjects} />
        </Container>
      </Section>

      {/* FAQ integration */}
      <FAQSection faqs={faqs.filter(f => f.category === "Portfolio" || f.category === "General")} />

      {/* Final CTA */}
      <Section className="bg-white">
         <Container>
            <div className="bg-primary rounded-[3rem] p-12 md:p-20 flex flex-col items-center text-center relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_white/10_0%,_transparent_70%)]"></div>
               <h2 className="text-3xl md:text-5xl font-black text-secondary uppercase tracking-tighter mb-8 max-w-3xl relative z-10 leading-tight">
                  Your Dream Build <br/> <span className="opacity-50 underline decoration-4 underline-offset-8 uppercase">Starts With A Quote</span>
               </h2>
               <div className="flex flex-col md:flex-row gap-4 relative z-10">
                  <Link href="/quote" className="bg-secondary text-white px-12 py-5 rounded-full font-black uppercase tracking-widest text-sm hover:scale-105 active:scale-95 transition-all shadow-2xl">
                     Get A Custom Quote
                  </Link>
                  <Link href="/contact" className="bg-white text-secondary border-2 border-secondary px-12 py-5 rounded-full font-black uppercase tracking-widest text-sm hover:bg-secondary hover:text-white transition-all shadow-xl">
                     Schedule A Factory Tour
                  </Link>
               </div>
            </div>
         </Container>
      </Section>
    </>
  );
}
