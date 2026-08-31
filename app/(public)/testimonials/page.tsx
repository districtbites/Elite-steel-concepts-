import React from "react";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";
import CTASection from "@/components/ui/CTASection";
import Button from "@/components/ui/Button";
import { getTestimonials, getSEO, getPageSEO, getMediaAsset, getInternalLinkRules, getInternalLinkSettings } from "@/lib/db";
import { autoLinkMarkdown } from "@/lib/internalLinks";
import AutoLinkedText from "@/components/ui/AutoLinkedText";
import { Star, Quote as QuoteIcon, Play, CheckCircle, ShieldCheck, Award, MessageSquare } from "lucide-react";
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
        title={sections.header?.title || "Elite Success Stories"}
        subtitle={sections.header?.subtitle || "Hear from the entrepreneurs and culinary visionaries who built their dreams on a foundation of Elite Steel."}
      />

      {/* Stats / Proof Section */}
      <Section className="bg-white pb-0">
         <Container>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 bg-secondary rounded-[3rem] p-12 text-white items-center shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full -mr-32 -mt-32"></div>
               <div className="text-center space-y-2 relative z-10">
                  <div className="text-4xl md:text-5xl font-black text-primary">500+</div>
                  <div className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Trucks Built</div>
               </div>
               <div className="text-center space-y-2 relative z-10 border-l border-white/10">
                  <div className="text-4xl md:text-5xl font-black text-primary">12+</div>
                  <div className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Years Exp</div>
               </div>
               <div className="text-center space-y-2 relative z-10 border-l border-white/10">
                  <div className="text-4xl md:text-5xl font-black text-primary">100%</div>
                  <div className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Pass Rate</div>
               </div>
               <div className="text-center space-y-2 relative z-10 border-l border-white/10">
                  <div className="text-4xl md:text-5xl font-black text-primary">4.9/5</div>
                  <div className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Avg Rating</div>
               </div>
            </div>
         </Container>
      </Section>

      {/* Video Testimonials / Featured Story */}
      <Section className="bg-white overflow-hidden">
        <Container>
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
                 <span className="text-primary font-black uppercase tracking-widest text-xs mb-4 block underline decoration-secondary decoration-4 underline-offset-8">Featured Story</span>
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

           {/* Grid Layout for Others */}
           <div className="text-center mb-16">
              <h3 className="text-2xl font-black uppercase text-secondary tracking-tight">Verified <span className="text-primary italic">Owner</span> Reviews</h3>
              <p className="text-gray-400 text-xs font-black uppercase tracking-[0.3em] mt-2">Authentic Experiences from the DMV & Nationwide</p>
           </div>

            {testimonials.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {testimonials.map((testimonial, idx) => (
                        <div 
                           key={testimonial.id} 
                           className={`bg-white border border-gray-100 p-10 rounded-[2.5rem] relative flex flex-col shadow-sm hover:shadow-2xl transition-all duration-500 group ${idx % 2 === 0 ? 'md:translate-y-8' : ''}`}
                        >
                            <div className="absolute top-8 right-8 text-gray-100 group-hover:text-primary/10 transition-colors">
                               <QuoteIcon size={48} />
                            </div>

                            <div className="flex gap-1 mb-6 text-primary">
                                {[...Array(testimonial.rating || 5)].map((_, i) => (
                                <Star key={i} size={16} fill="currentColor" />
                                ))}
                            </div>

                            <p className="text-gray-600 mb-10 text-md leading-relaxed flex-grow font-light">
                                &ldquo;<AutoLinkedText text={autoLinkMarkdown(testimonial.content, activeRules, linkSettings).updatedContent} />&rdquo;
                            </p>

                            <div className="pt-8 border-t border-gray-50 flex items-center justify-between">
                                <div>
                                   <h4 className="font-black text-secondary uppercase tracking-tight text-lg mb-1 leading-none">
                                      {testimonial.clientName}
                                   </h4>
                                   {(testimonial.role || testimonial.company) && (
                                       <p className="text-primary text-[10px] uppercase tracking-widest font-black leading-none">
                                          {testimonial.company || testimonial.role}
                                       </p>
                                   )}
                                </div>
                                <div className="w-10 h-10 bg-secondary/5 rounded-full flex items-center justify-center text-primary border border-primary/10">
                                   <Award size={20} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-24 bg-gray-50 rounded-[3rem] border border-dashed border-gray-200">
                    <MessageSquare className="mx-auto text-gray-200 mb-6" size={64} />
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">Awaiting your success story.</p>
                </div>
            )}
        </Container>
      </Section>

      {/* Proof / Brands Bar */}
      <div className="bg-gray-50 py-12 border-y border-gray-100">
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

      <CTASection
        title={sections.cta?.title || "Ready to Start Your Success Story?"}
        subtitle={sections.cta?.subtitle || "Join hundreds of successful entrepreneurs who started their journey with Elite Steel Concepts."}
        buttonText={sections.cta?.ctaText || "Get Custom Quote"}
        buttonHref="/quote"
      />
    </>
  );
}
