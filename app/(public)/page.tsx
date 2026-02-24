import Hero from "@/components/Hero";
import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";
import ProcessSteps from "@/components/ProcessSteps";
import ServiceSelection from "@/components/ServiceSelection";
import SizeSelection from "@/components/SizeSelection";
import Testimonials from "@/components/Testimonials";
import HomeBlogSection from "@/components/HomeBlogSection";
import NewsletterSection from "@/components/sections/NewsletterSection";
import CTASection from "@/components/ui/CTASection";
import FAQSection from "@/components/FAQSection";
import { CheckCircle2, MapPin, Shield, Zap, Award, Truck } from "lucide-react";

import { getPageSEO, getSEO, getFAQs, getSettings, getTestimonials, getMediaAsset } from "@/lib/db";
import type { Metadata } from "next";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSEO();
  const pageSeo = await getPageSEO("home");
  
  return {
    title: pageSeo?.title || seo.siteTitle,
    description: pageSeo?.description || seo.description,
    keywords: pageSeo?.keywords || seo.keywords,
  };
}

export default async function Home() {
  const [pageSeo, faqs, settings, heroImage] = await Promise.all([
    getPageSEO("home"),
    getFAQs(),
    getSettings(),
    getMediaAsset("home", "hero", "https://images.pexels.com/photos/2577274/pexels-photo-2577274.jpeg?auto=compress&cs=tinysrgb&w=1920"),
  ]);
  const alts = pageSeo.imageAlts || {};
  const sections = pageSeo.sections || {};

  // Why Choose Us bullet points (admin-editable via "whychooseus" section)
  const whyChooseUsItems = [
    { icon: Shield, text: sections.whychooseus?.content?.split("\n")[0] || "100% Health & Fire Code Compliant Builds" },
    { icon: Award, text: sections.whychooseus?.content?.split("\n")[1] || "12+ Years of Expert Fabrication Experience" },
    { icon: Truck, text: sections.whychooseus?.content?.split("\n")[2] || "Custom Designed to Your Menu & Workflow" },
    { icon: Zap, text: sections.whychooseus?.content?.split("\n")[3] || "Precision TIG/MIG Welding & NSF Standards" },
    { icon: CheckCircle2, text: sections.whychooseus?.content?.split("\n")[4] || "End-to-End Support: Design → Fabrication → Handover" },
    { icon: MapPin, text: sections.whychooseus?.content?.split("\n")[5] || "Based in Manassas VA, Serving DMV & Nationwide" },
  ];

  return (
    <>
      {pageSeo.structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: pageSeo.structuredData }}
        />
      )}

      {/* ═══════ HERO SECTION – H1 + Subheading + CTA ═══════ */}
      <Hero imageAlts={alts} content={sections.hero} heroImage={heroImage} />

      {/* ═══════ INTRO SECTION – H2 + Paragraph ═══════ */}
      <Section id="intro" className="bg-white">
         <Container className="text-center max-w-5xl">
            <h2 className="text-4xl md:text-6xl font-black text-secondary mb-10 leading-tight uppercase tracking-tight">
               {sections.intro?.title || "Building Custom Food Trucks & Concession Trailers For Entrepreneurs Since 2012"}
            </h2>
            <p className="mx-auto text-lg md:text-xl text-gray-500 leading-relaxed font-light">
               {sections.intro?.content || "If you're looking to get started on launching your very own mobile food truck, contact Elite Steel Concepts today! Though we're located in the Metro DC area, our services are nationwide. We provide opportunity for entrepreneurs to visualize and design their ideal mobile kitchen and make their dream a reality. We're skilled in the fabrication, assembly and creation of beautiful mobile kitchens, food trucks and concession trailers. Our ultimate goal is to roll out a beautiful mobile food business in record time to allow you to spread happiness with your menu! All our trucks and trailers are built specifically to your needs and goals."}
            </p>
         </Container>
      </Section>

      {/* ═══════ SERVICES SECTION – H2 + H3 for each service ═══════ */}
      <ServiceSelection imageAlts={alts} />

      {/* ═══════ WHY CHOOSE US SECTION – H2 + Bullet Points ═══════ */}
      <Section id="why-choose-us" className="bg-gray-50">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-primary font-bold tracking-widest uppercase text-sm mb-4 block">
                {sections.whychooseus?.subtitle || "The Elite Advantage"}
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-secondary uppercase tracking-tight mb-8 leading-tight">
                {sections.whychooseus?.title || "Why Choose Elite Steel Concepts?"}
              </h2>
              <ul className="space-y-5">
                {whyChooseUsItems.map((item, i) => (
                  <li key={i} className="flex items-start gap-4 group">
                    <div className="bg-primary/10 p-2.5 rounded-xl text-primary group-hover:bg-primary group-hover:text-secondary transition-all shrink-0 mt-0.5">
                      <item.icon size={20} />
                    </div>
                    <span className="text-lg text-gray-700 font-medium leading-relaxed">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-primary/20 rounded-[2rem] -rotate-3 pointer-events-none"></div>
              <div className="relative bg-secondary rounded-[2rem] p-10 md:p-14 text-white space-y-8 shadow-2xl">
                <div className="grid grid-cols-2 gap-8">
                  <div className="text-center space-y-2">
                    <div className="text-4xl font-black text-primary">{settings.experienceYears || 12}+</div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">Years Exp</div>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="text-4xl font-black text-primary">{settings.trucksBuiltCount || 350}+</div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">Builds Done</div>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="text-4xl font-black text-primary">100%</div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">Code Pass</div>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="text-4xl font-black text-primary">48</div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">States Served</div>
                  </div>
                </div>
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                  <p className="text-sm text-gray-400 font-light italic leading-relaxed">
                    "Elite Steel Concepts completely transformed my business. The attention to detail is unmatched."
                  </p>
                  <p className="text-primary text-[10px] font-black uppercase tracking-widest mt-3">— Marcus Johnson, Smoke & Grill</p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* ═══════ OUR PROCESS ═══════ */}
      <ProcessSteps />

      {/* ═══════ SIZE GUIDE ═══════ */}
      <SizeSelection />

      {/* ═══════ LOCAL COVERAGE SECTION – H2 + Paragraph ═══════ */}
      <Section id="local-coverage" className="bg-white">
        <Container className="text-center max-w-5xl">
          <span className="text-primary font-bold tracking-widest uppercase text-sm mb-4 block">
            {sections.localcoverage?.subtitle || "Service Area"}
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-secondary uppercase tracking-tight mb-8">
            {sections.localcoverage?.title || "Proudly Serving the DMV & Beyond"}
          </h2>
          <p className="mx-auto text-lg text-gray-500 leading-relaxed font-light max-w-3xl mb-10">
            {sections.localcoverage?.content || "Based in Manassas, Virginia, Elite Steel Concepts serves the entire Washington DC metropolitan area including Northern Virginia, Maryland, and the greater Mid-Atlantic region. Our custom food trucks, concession trailers, and mobile kitchens have been delivered to entrepreneurs across 48 states. Whether you're launching in DC, Baltimore, Richmond, or anywhere nationwide — we build and deliver to your location."}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {["Washington DC", "Northern Virginia", "Maryland", "Nationwide"].map((area, i) => (
              <div key={i} className="flex items-center gap-2 bg-gray-50 px-6 py-3 rounded-full border border-gray-100">
                <MapPin size={14} className="text-primary" />
                <span className="text-sm font-bold text-secondary uppercase tracking-wider">{area}</span>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* ═══════ TESTIMONIALS ═══════ */}
      <Testimonials />

      {/* ═══════ BLOG HIGHLIGHTS ═══════ */}
      <HomeBlogSection />

      {/* ═══════ NEWSLETTER ═══════ */}
      <NewsletterSection />

      {/* ═══════ FAQ SECTION – Optional ═══════ */}
      {faqs.length > 0 && <FAQSection faqs={faqs.slice(0, 5)} />}

      {/* ═══════ CTA SECTION – H2 + Button ═══════ */}
      <CTASection
        title={sections.cta?.title || "Ready to Start Your Build?"}
        subtitle={sections.cta?.subtitle || "Tell us about your vision and let's create the perfect mobile kitchen for your business."}
        buttonText={sections.cta?.ctaText || "Get a Free Quote"}
        buttonHref="/quote"
      />
    </>
  );
}
