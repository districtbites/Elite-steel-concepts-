import Hero from "@/components/Hero";
import Container from "@/components/ui/Container";
import ProcessSteps from "@/components/ProcessSteps";
import ServiceSelection from "@/components/ServiceSelection";
import SizeSelection from "@/components/SizeSelection";
import Testimonials from "@/components/Testimonials";
import HomeBlogSection from "@/components/HomeBlogSection";
import NewsletterSection from "@/components/sections/NewsletterSection";
import CTASection from "@/components/ui/CTASection";
import FAQSection from "@/components/FAQSection";
import InteractiveFloorPlan from "@/components/ui/InteractiveFloorPlan";
import ReadMore from "@/components/ui/ReadMore";
import {
  CheckCircle2,
  MapPin,
  Shield,
  Zap,
  Award,
  Truck,
  ArrowRight,
  Phone,
} from "lucide-react";
import Link from "next/link";

import {
  getPageSEO,
  getSEO,
  getFAQs,
  getSettings,
  getMediaAsset,
  getInternalLinkRules,
  getInternalLinkSettings,
} from "@/lib/db";
import { autoLinkMarkdown } from "@/lib/internalLinks";
import AutoLinkedText from "@/components/ui/AutoLinkedText";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSEO();
  const pageSeo = await getPageSEO("home");

  return {
    title: pageSeo?.title || seo.siteTitle,
    description: pageSeo?.description || seo.description,
    keywords: pageSeo?.keywords || seo.keywords,
    alternates: { canonical: "/" },
  };
}

export default async function Home() {
  const [pageSeo, faqs, settings, rules, linkSettings, heroImage, homeTruckCard, homeTrailerCard] =
    await Promise.all([
      getPageSEO("home"),
      getFAQs(),
      getSettings(),
      getInternalLinkRules(),
      getInternalLinkSettings(),
      getMediaAsset(
        "home",
        "hero",
        "https://images.pexels.com/photos/2577274/pexels-photo-2577274.jpeg?auto=compress&cs=tinysrgb&w=1920"
      ),
      getMediaAsset(
        "home",
        "truck_card",
        "https://images.pexels.com/photos/4393021/pexels-photo-4393021.jpeg?auto=compress&cs=tinysrgb&w=1200"
      ),
      getMediaAsset(
        "home",
        "trailer_card",
        "/concession-trailer.png"
      ),
    ]);

  const activeRules = rules.filter(r => r.enabled !== false);
  const alts = pageSeo.imageAlts || {};
  const sections = pageSeo.sections || {};

  // Auto-link section contents
  const introRaw = sections.intro?.content || "If you're looking to get started on launching your very own mobile food truck, contact Elite Steel Concepts today! Though we're located in the Metro DC area, our services are nationwide. We provide opportunity for entrepreneurs to visualize and design their ideal mobile kitchen and make their dream a reality. We're skilled in the fabrication, assembly and creation of beautiful mobile kitchens, food trucks and concession trailers.";
  const introLinked = autoLinkMarkdown(introRaw, activeRules, linkSettings).updatedContent;

  const localCoverageRaw = sections.localcoverage?.content || "Based in Manassas, Virginia, Elite Steel Concepts serves the entire Washington DC metropolitan area including Northern Virginia, Maryland, and the greater Mid-Atlantic region. Our custom food trucks, concession trailers, and mobile kitchens have been delivered to entrepreneurs across 48 states.";
  const localCoverageLinked = autoLinkMarkdown(localCoverageRaw, activeRules, linkSettings).updatedContent;

  const whyChooseUsLines = (sections.whychooseus?.content || "")
    .split("\n")
    .map(line => line.trim())
    .filter(line => line.length > 0);

  const whyChooseUsItems = [
    {
      icon: Shield,
      text:
        whyChooseUsLines[0] ||
        "100% Health & Fire Code Compliant Builds",
    },
    {
      icon: Award,
      text:
        whyChooseUsLines[1] ||
        "12+ Years of Expert Fabrication Experience",
    },
    {
      icon: Truck,
      text:
        whyChooseUsLines[2] ||
        "Custom Designed to Your Menu & Workflow",
    },
    {
      icon: Zap,
      text:
        whyChooseUsLines[3] ||
        "Precision TIG/MIG Welding & NSF Standards",
    },
    {
      icon: CheckCircle2,
      text:
        whyChooseUsLines[4] ||
        "End-to-End Support: Design → Fabrication → Handover",
    },
    {
      icon: MapPin,
      text:
        whyChooseUsLines[5] ||
        "Based in Manassas VA, Serving DMV & Nationwide",
    },
  ];

  const coverageAreas = [
    "Washington DC",
    "Northern Virginia",
    "Maryland",
    "Nationwide",
  ];

  return (
    <>
      {pageSeo.structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: pageSeo.structuredData }}
        />
      )}

      {/* ═══ HERO ════════════════════════════════════════════ */}
      <Hero imageAlts={alts} content={sections.hero} heroImage={heroImage} />

      {/* ═══ INTRO ═══════════════════════════════════════════ */}
      <section id="intro" className="bg-white py-20 md:py-28 border-b border-gray-100">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
            {/* Left: headline */}
            <div className="lg:col-span-5">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-12 bg-primary" />
                <span className="text-primary text-xs font-black uppercase tracking-[0.25em]">
                  Our Mission
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-black leading-[0.9] uppercase tracking-tighter">
                {sections.intro?.title ||
                  "Building Custom Food Trucks For Entrepreneurs"}
              </h2>

              {/* Stat row */}
              <div className="flex items-center gap-8 mt-10 pt-10 border-t border-gray-100">
                {[
                  { val: `${settings.experienceYears || 12}+`, lbl: "Yrs Exp" },
                  { val: `${settings.trucksBuiltCount || 350}+`, lbl: "Builds" },
                  { val: "48", lbl: "States" },
                ].map(({ val, lbl }) => (
                  <div key={lbl}>
                    <div className="text-3xl font-black text-black">{val}</div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      {lbl}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: copy + CTA */}
            <div className="lg:col-span-7 lg:pt-6">
              <div className="pl-0 lg:pl-12 border-l-0 lg:border-l-2 border-primary/30">
                <div className="mb-8">
                  <ReadMore 
                    text={introLinked}
                    maxLength={300}
                    className="text-lg text-gray-500 leading-relaxed font-light max-w-prose"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/about"
                    id="intro-learn-more-btn"
                    className="inline-flex items-center gap-2 border border-gray-200 hover:border-primary text-black hover:text-primary font-black uppercase tracking-wider text-xs px-6 py-3 transition-all"
                  >
                    Learn About ESC <ArrowRight size={14} />
                  </Link>
                  <a
                    href="tel:+15716510337"
                    id="intro-call-btn"
                    className="inline-flex items-center gap-2 text-gray-500 hover:text-primary font-bold uppercase tracking-wider text-xs transition-colors"
                  >
                    <Phone size={14} />
                    (571) 651-0337
                  </a>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ═══ SERVICES ════════════════════════════════════════ */}
      <ServiceSelection
        imageAlts={alts}
        truckImage={homeTruckCard}
        trailerImage={homeTrailerCard}
      />

      {/* ═══ WHY CHOOSE US ═══════════════════════════════════ */}
      <section id="why-choose-us" className="bg-[#0a0a0a] py-20 md:py-28">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Left: feature list */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-12 bg-primary" />
                <span className="text-primary text-xs font-black uppercase tracking-[0.25em]">
                  {sections.whychooseus?.subtitle || "The Elite Advantage"}
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter leading-tight mb-12">
                {sections.whychooseus?.title || "Why Choose Elite Steel Concepts?"}
              </h2>

              <div className="space-y-px">
                {whyChooseUsItems.map((item, i) => (
                  <div
                    key={i}
                    className="group flex items-start gap-5 bg-[#0f0f0f] hover:bg-[#141414] border-l-2 border-[#1a1a1a] hover:border-primary p-5 transition-all duration-200"
                  >
                    <div className="w-8 h-8 bg-primary/10 group-hover:bg-primary flex items-center justify-center shrink-0 transition-colors duration-200">
                      <item.icon
                        size={15}
                        className="text-primary group-hover:text-white transition-colors"
                      />
                    </div>
                    <span className="text-sm text-gray-400 group-hover:text-gray-200 font-medium leading-relaxed transition-colors">
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: dark stat card + testimonial quote */}
            <div className="space-y-px">
              {/* Stats 2x2 grid */}
              <div className="grid grid-cols-2 gap-px bg-[#1a1a1a]">
                {[
                  {
                    value: `${settings.experienceYears || 12}+`,
                    label: "Years Experience",
                    sub: "Since 2012",
                  },
                  {
                    value: `${settings.trucksBuiltCount || 350}+`,
                    label: "Custom Builds",
                    sub: "Trucks & Trailers",
                  },
                  {
                    value: "100%",
                    label: "Code Compliant",
                    sub: "First-Inspection Pass",
                  },
                  { value: "48", label: "States Served", sub: "Nationwide Delivery" },
                ].map(({ value, label, sub }) => (
                  <div key={label} className="bg-[#0a0a0a] p-8 text-center">
                    <div className="text-4xl font-black text-primary mb-1">
                      {value}
                    </div>
                    <div className="text-xs font-black text-white uppercase tracking-wider mb-1">
                      {label}
                    </div>
                    <div className="text-[10px] text-gray-600 uppercase tracking-widest">
                      {sub}
                    </div>
                  </div>
                ))}
              </div>

              {/* Testimonial quote */}
              <div className="bg-primary p-8">
                <div className="text-4xl text-white/20 font-serif leading-none mb-4">
                  &ldquo;
                </div>
                <p className="text-white text-base leading-relaxed italic mb-6">
                  Elite Steel Concepts completely transformed my business. The
                  attention to detail is unmatched — every inch of the kitchen
                  was built exactly to my specs.
                </p>
                <p className="text-white/60 text-xs font-black uppercase tracking-widest">
                  — Marcus Johnson, Smoke &amp; Grill DC
                </p>
              </div>

              {/* CTA button */}
              <div className="bg-[#0f0f0f] p-6 flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Ready to join 350+ successful builds?
                </p>
                <Link
                  href="/quote"
                  id="why-esc-quote-btn"
                  className="inline-flex items-center gap-2 bg-primary hover:bg-orange-600 text-white font-black uppercase tracking-wider text-xs px-5 py-3 transition-all"
                >
                  Quote <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ═══ PROCESS ═════════════════════════════════════════ */}
      <ProcessSteps />

      {/* ═══ FLOOR PLAN EXPLORER ═════════════════════════════ */}
      <InteractiveFloorPlan />

      {/* ═══ SIZE GUIDE ══════════════════════════════════════ */}
      <SizeSelection />

      {/* ═══ LOCAL COVERAGE ══════════════════════════════════ */}
      <section id="local-coverage" className="bg-white py-20 md:py-28 border-t border-gray-100">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: copy */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-12 bg-primary" />
                <span className="text-primary text-xs font-black uppercase tracking-[0.25em]">
                  {sections.localcoverage?.subtitle || "Service Area"}
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-black uppercase tracking-tighter leading-tight mb-8">
                {sections.localcoverage?.title ||
                  "Proudly Serving the DMV & Beyond"}
              </h2>
              <div className="mb-10">
                <ReadMore 
                  text={localCoverageLinked}
                  maxLength={250}
                  className="text-gray-500 text-lg leading-relaxed max-w-prose"
                  buttonClassName="mt-4 text-[10px] font-black uppercase tracking-[0.2em] text-black border border-black px-4 py-2 hover:bg-primary hover:border-primary transition-colors flex items-center gap-2"
                />
              </div>
              <Link
                href="/locations"
                id="coverage-view-locations-btn"
                className="inline-flex items-center gap-2 border border-gray-200 hover:border-primary text-black hover:text-primary font-black uppercase tracking-wider text-xs px-6 py-3 transition-all"
              >
                View All Locations <ArrowRight size={14} />
              </Link>
            </div>

            {/* Right: area tiles */}
            <div className="grid grid-cols-2 gap-px bg-gray-100">
              {coverageAreas.map((area, i) => (
                <div
                  key={area}
                  className="group bg-white hover:bg-[#0a0a0a] p-8 transition-all duration-300 cursor-default"
                >
                  <div className="w-8 h-8 border border-gray-100 group-hover:border-primary flex items-center justify-center mb-4 transition-colors">
                    <MapPin
                      size={14}
                      className="text-gray-300 group-hover:text-primary transition-colors"
                    />
                  </div>
                  <div className="text-sm font-black text-black group-hover:text-white uppercase tracking-tight transition-colors">
                    {area}
                  </div>
                  <div className="text-[10px] text-gray-400 group-hover:text-gray-500 uppercase tracking-widest mt-1 transition-colors">
                    {i === 3 ? "48 States" : "Full Coverage"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ═══ TESTIMONIALS ════════════════════════════════════ */}
      <Testimonials />

      {/* ═══ BLOG ════════════════════════════════════════════ */}
      <HomeBlogSection />

      {/* ═══ NEWSLETTER ══════════════════════════════════════ */}
      <NewsletterSection />

      {/* ═══ FAQ ═════════════════════════════════════════════ */}
      {faqs.length > 0 && <FAQSection faqs={faqs.slice(0, 5)} />}

      {/* ═══ FINAL CTA ═══════════════════════════════════════ */}
      <CTASection
        title={sections.cta?.title || "Ready to Start Your Build?"}
        subtitle={
          sections.cta?.subtitle ||
          "Tell us about your vision and let's create the perfect mobile kitchen for your business."
        }
        buttonText={sections.cta?.ctaText || "Get a Free Quote"}
        buttonHref="/quote"
      />
    </>
  );
}
