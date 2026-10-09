import React from "react";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";
import CTASection from "@/components/ui/CTASection";
import Button from "@/components/ui/Button";
import { getTestimonials, getSEO, getPageSEO, getMediaAsset, getInternalLinkRules, getInternalLinkSettings } from "@/lib/db";
import { autoLinkMarkdown } from "@/lib/internalLinks";
import AutoLinkedText from "@/components/ui/AutoLinkedText";
import { Star, Quote as QuoteIcon, Play, CheckCircle, ShieldCheck, Award, MessageSquare, Truck, CalendarCheck } from "lucide-react";
import type { Metadata } from "next";

export const dynamic = 'force-dynamic';
export const revalidate = 0;
import Image from "next/image";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSEO();
  const pageSeo = await getPageSEO("testimonials");
  
  return {
    title: pageSeo?.title || `Client Success Stories | ${seo.siteTitle}`,
    description: pageSeo?.description || seo.description,
    keywords: pageSeo?.keywords || seo.keywords,
    alternates: { canonical: '/testimonials' },
  };
}

export default async function TestimonialsPage() {
  const [testimonials, pageSeo, rules, linkSettings, testimonialsHero] = await Promise.all([
    getTestimonials(),
    getPageSEO("testimonials"),
    getInternalLinkRules(),
    getInternalLinkSettings(),
    getMediaAsset("testimonials", "hero", "https://images.pexels.com/photos/1766686/pexels-photo-1766686.jpeg?auto=compress&cs=tinysrgb&w=1200"),
  ]);
  const activeRules = rules.filter(r => r.enabled !== false);
  const sections = pageSeo.sections || {};

  return (
    <>
      {pageSeo.structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: pageSeo.structuredData }}
        />
      )}
      <PageHeader
        eyebrow="Elite Steel Concept"
        title="Customer Testimonials"
      />

      {/* Stats / Proof Section */}
      <Section className="!pt-10 md:!pt-14 !pb-10 md:!pb-14 bg-white">
        <Container>
          <div className="text-center max-w-5xl mx-auto mb-8 md:mb-10">
            <h2 className="text-2xl md:text-4xl font-black uppercase text-black tracking-tight leading-tight">
              Why Businesses Trust Elite Steel Concepts For Custom Food Trucks &amp; Trailer Builds
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 max-w-6xl mx-auto">
            {[
              { value: "350+", label: "Trucks Built", icon: Truck },
              { value: "14+", label: "Years Experience", icon: CalendarCheck },
              { value: "100%", label: "Inspection Pass Rate", icon: ShieldCheck },
              { value: "4.9/5", label: "Average Rating", icon: Star },
            ].map((stat) => (
              <div
                key={stat.label}
                className="group relative bg-white border border-gray-200 hover:border-primary hover:-translate-y-1 hover:shadow-xl transition-all duration-300 px-4 py-8 md:px-6 md:py-10 flex flex-col items-center text-center overflow-hidden"
              >
                <div className="absolute top-0 left-0 h-1 w-0 bg-primary group-hover:w-full transition-all duration-500" />
                <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/20 group-hover:bg-primary group-hover:border-primary flex items-center justify-center mb-5 transition-colors duration-300">
                  <stat.icon size={24} className="text-primary group-hover:text-white transition-colors duration-300" />
                </div>
                <div className="text-4xl md:text-5xl font-black text-primary leading-none mb-3">
                  {stat.value}
                </div>
                <div className="text-xs md:text-sm font-black uppercase tracking-wide text-black">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Video Testimonials / Featured Story */}
      <Section className="!pt-0 !pb-10 md:!pb-14 bg-white overflow-hidden">
        <Container>
           {/* Hidden: Featured Story (video + "They didn't just build a truck" quote)
           <div className="flex flex-col lg:flex-row items-center gap-16 mb-24">
              <div className="w-full lg:w-1/2 relative group">
                 <div className="absolute -inset-4 bg-primary/20 rounded-[2.5rem] rotate-3 group-hover:rotate-0 transition-transform duration-500"></div>
                 <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl bg-secondary">
                    <Image 
                       src={testimonialsHero.url} 
                       alt={testimonialsHero.alt || "Client Success Story"}
                       fill
                       className="object-cover opacity-60"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                       <button className="w-20 h-20 bg-primary text-secondary rounded-full flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform">
                          <Play size={32} fill="currentColor" />
                       </button>
                    </div>
                    <div className="absolute bottom-6 left-6 right-6">
                       <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl flex items-center gap-4">
                          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-secondary font-black">SJ</div>
                          <div>
                             <p className="text-white font-bold text-sm">Chef Marcus Johnson</p>
                             <p className="text-white/60 text-[10px] uppercase font-black tracking-widest leading-none">Smoke & Grill BBQ</p>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
              <div className="w-full lg:w-1/2">
                 <h1 className="text-primary font-black uppercase tracking-widest text-xs mb-4 block underline decoration-secondary decoration-4 underline-offset-8">Featured Story</h1>
                 <h2 className="text-4xl md:text-5xl font-black uppercase text-secondary tracking-tighter mb-8 leading-[0.9]">
                    "They didn't just build a truck, they built a <span className="text-primary italic">scalable business</span>."
                 </h2>
                 <p className="text-gray-600 text-lg leading-relaxed mb-8 font-light italic">
                    &ldquo;<AutoLinkedText text={autoLinkMarkdown("When I first came to Elite Steel Concepts, I had a vision but no idea about technical specs or flow. They took my menu and designed a kitchen that allows our team to serve 200 portions an hour without breaking a sweat.", activeRules, linkSettings).updatedContent} />&rdquo;
                 </p>
                 <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2 text-secondary font-bold text-xs uppercase tracking-widest bg-gray-50 px-5 py-3 rounded-full border border-gray-100">
                       <CheckCircle size={16} className="text-primary" /> Verified Build
                    </div>
                    <div className="flex items-center gap-2 text-secondary font-bold text-xs uppercase tracking-widest bg-gray-50 px-5 py-3 rounded-full border border-gray-100">
                       <ShieldCheck size={16} className="text-primary" /> Health Code Ready
                    </div>
                 </div>
              </div>
           </div>
           */}

           {/* Grid Layout for Others */}
           <div className="text-center mb-8 md:mb-10">
              <h3 className="text-2xl md:text-4xl font-black uppercase text-black tracking-tight leading-tight">Testimonials From Our Customers</h3>
              <p className="text-gray-600 text-base md:text-lg font-medium leading-relaxed max-w-2xl mx-auto mt-3">See why entrepreneurs choose ECS as the best food truck and trailer builder in USA for custom builds.</p>
           </div>

            {testimonials.length > 0 ? (
                <div className="columns-1 md:columns-2 lg:columns-3 gap-5 md:gap-6 max-w-6xl mx-auto">
                    {testimonials.map((testimonial, idx) => {
                        // Every 4th card gets a warm orange tint to break the rhythm
                        const accent = idx % 4 === 1;
                        // Stored content sometimes already carries its own quote marks
                        const text = testimonial.content.trim().replace(/^["“”]+|["“”]+$/g, "");
                        const initials = testimonial.clientName
                          .split(/\s+/)
                          .map((w) => w[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase();
                        return (
                        <figure
                           key={testimonial.id}
                           className={`break-inside-avoid mb-5 md:mb-6 relative overflow-hidden rounded-2xl border p-7 md:p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group ${
                             accent
                               ? "bg-gradient-to-br from-orange-50 via-white to-white border-primary/40 hover:border-primary"
                               : "bg-white border-gray-200 hover:border-primary"
                           }`}
                        >
                            <div className="absolute top-0 left-0 h-1 w-0 bg-primary group-hover:w-full transition-all duration-500" />

                            <div className="flex items-center justify-between mb-5">
                                <div className="flex gap-1 text-primary">
                                    {[...Array(testimonial.rating || 5)].map((_, i) => (
                                    <Star key={i} size={16} fill="currentColor" />
                                    ))}
                                </div>
                                <span className={`flex size-10 items-center justify-center rounded-full ${accent ? "bg-primary text-white" : "bg-primary/10 text-primary"}`}>
                                   <QuoteIcon size={18} fill="currentColor" />
                                </span>
                            </div>

                            <blockquote className="text-base leading-relaxed mb-7 text-gray-600">
                                &ldquo;{text}&rdquo;
                            </blockquote>

                            <figcaption className={`flex items-center gap-3 pt-5 border-t ${accent ? "border-primary/20" : "border-gray-100"}`}>
                                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-black text-black">
                                   {initials}
                                </span>
                                <div className="min-w-0">
                                   <div className="font-black uppercase tracking-tight leading-tight text-black">
                                      {testimonial.clientName}
                                   </div>
                                   {(testimonial.role || testimonial.company) && (
                                       <div className="text-xs font-semibold mt-0.5 text-gray-500">
                                          {testimonial.company || testimonial.role}
                                       </div>
                                   )}
                                </div>
                                <span className="ml-auto inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-primary">
                                   <CheckCircle size={14} /> Verified
                                </span>
                            </figcaption>
                        </figure>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-24 bg-gray-50 rounded-[3rem] border border-dashed border-gray-200">
                    <MessageSquare className="mx-auto text-gray-200 mb-6" size={64} />
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">Awaiting your success story.</p>
                </div>
            )}
        </Container>
      </Section>

      {/* Hidden: Proof / Brands Bar (Metro DC Health, NSF Certified, ...)
      <div className="bg-gray-50 py-8 md:py-10 border-y border-gray-100">
         <Container>
            <div className="flex flex-wrap justify-center items-center gap-12 grayscale opacity-40">
               <div className="text-xl font-black text-secondary tracking-tighter">METRO DC HEALTH</div>
               <div className="text-xl font-black text-secondary tracking-tighter">NSF CERTIFIED</div>
               <div className="text-xl font-black text-secondary tracking-tighter">VA DEPT OF HEALTH</div>
               <div className="text-xl font-black text-secondary tracking-tighter">MD FOOD SAFETY</div>
               <div className="text-xl font-black text-secondary tracking-tighter">CHASSIS PREP</div>
            </div>
         </Container>
      </div>
      */}

      <CTASection
        title="Ready to Build Your Dream Food Truck & Trailer?"
        subtitle="Tell us about your concept, and we’ll help you plan the right custom truck or trailer for your business."
        buttonText="Get a Free Quote Now!"
        titleClassName="text-2xl md:text-4xl tracking-tight leading-tight"
        buttonHref="/quote"
      />
    </>
  );
}
