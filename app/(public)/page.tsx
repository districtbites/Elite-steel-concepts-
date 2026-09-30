import Hero from "@/components/Hero";
import Container from "@/components/ui/Container";
import ServiceSelection from "@/components/ServiceSelection";
import WhyChooseSection from "@/components/WhyChooseSection";
import SizeSelection from "@/components/SizeSelection";
import Testimonials from "@/components/Testimonials";
import HomeBlogSection from "@/components/HomeBlogSection";
import ApplicationModal from "@/components/ui/ApplicationModal";
import CTASection from "@/components/ui/CTASection";
import FAQSection from "@/components/FAQSection";
import InteractiveFloorPlan from "@/components/ui/InteractiveFloorPlan";
import ReadMore from "@/components/ui/ReadMore";
import ProcessSteps from "@/components/ProcessSteps";
import QuoteStartSection from "@/components/QuoteStartSection";
import {
  CheckCircle2,
  MapPin,
  Shield,
  Zap,
  Award,
  Truck,
  ArrowRight,
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
  const [
    pageSeo,
    faqs,
    settings,
    rules,
    linkSettings,
    heroImage,
    homeTruckCard,
    homeTrailerCard,
  ] = await Promise.all([
    getPageSEO("home"),
    getFAQs(),
    getSettings(),
    getInternalLinkRules(),
    getInternalLinkSettings(),
    getMediaAsset(
      "home",
      "hero",
      "https://images.pexels.com/photos/2577274/pexels-photo-2577274.jpeg?auto=compress&cs=tinysrgb&w=1920",
    ),
    getMediaAsset(
      "home",
      "truck_card",
      "https://images.pexels.com/photos/4393021/pexels-photo-4393021.jpeg?auto=compress&cs=tinysrgb&w=1200",
    ),
    getMediaAsset("home", "trailer_card", "/concession-trailer.png"),
  ]);

  const activeRules = rules.filter((r) => r.enabled !== false);
  const alts = pageSeo.imageAlts || {};
  const sections = pageSeo.sections || {};

  // Auto-link section contents
  const introRaw =
    sections.intro?.content ||
    "We are experienced custom food truck builders creating food trucks, food trailers, and mobile kitchens for businesses of all kinds. As a trusted food truck manufacturer, we build each unit around your menu, equipment, space, and workflow. From a custom food trailer to a complete mobile kitchen, we help turn your idea into a practical, professional setup ready for your food business.";
  const introLinked = autoLinkMarkdown(
    introRaw,
    activeRules,
    linkSettings,
  ).updatedContent;

  const localCoverageRaw =
    sections.localcoverage?.content ||
    "Based in Manassas, Virginia, Elite Steel Concepts serves the entire Washington DC metropolitan area including Northern Virginia, Maryland, and the greater Mid-Atlantic region. Our custom food trucks, concession trailers, and mobile kitchens have been delivered to entrepreneurs across 48 states.";
  const localCoverageLinked = autoLinkMarkdown(
    localCoverageRaw,
    activeRules,
    linkSettings,
  ).updatedContent;

  const whyChooseUsLines = (sections.whychooseus?.content || "")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const whyChooseUsItems = [
    {
      icon: Shield,
      text: whyChooseUsLines[0] || "100% Health & Fire Code Compliant Builds",
    },
    {
      icon: Award,
      text: whyChooseUsLines[1] || "14+ Years of Expert Fabrication Experience",
    },
    {
      icon: Truck,
      text: whyChooseUsLines[2] || "Custom Designed to Your Menu & Workflow",
    },
    {
      icon: Zap,
      text: whyChooseUsLines[3] || "Precision TIG/MIG Welding & NSF Standards",
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
        whyChooseUsLines[5] || "Based in Manassas VA, Serving DMV & Nationwide",
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
      <section
        id="intro"
        className="bg-white py-20 md:py-28 border-b border-gray-100"
      >
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-stretch">
            {/* Left: headline */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-px w-12 bg-primary" />
                  <span className="text-primary text-xs font-black uppercase tracking-[0.25em]">
                    What We Build
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-black leading-[1.05] uppercase tracking-tight">
                  {sections.intro?.title ||
                    "Custom Food Trucks & Concession Trailers For Entrepreneurs"}
                </h2>
              </div>

              {/* Stat row */}
              <div className="flex items-center gap-8 md:gap-12 mt-10 pt-8 border-t border-gray-100">
                {[
                  { val: `${settings.experienceYears || 14}+`, lbl: "Yrs Exp" },
                  {
                    val: `${settings.trucksBuiltCount || 350}+`,
                    lbl: "Builds",
                  },
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
            <div className="lg:col-span-7 pl-0 lg:pl-12 border-l-0 lg:border-l-2 border-primary/30 flex flex-col justify-between py-1">
              <div className="mb-8">
                <ReadMore
                  text={introLinked}
                  maxLength={300}
                  className="text-base md:text-lg text-gray-600 leading-relaxed font-normal max-w-prose"
                />
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <Link
                  href="/about"
                  id="intro-about-btn"
                  className="group inline-flex items-center justify-center gap-2 bg-primary hover:bg-orange-600 text-white font-black uppercase tracking-wider text-xs px-7 py-4 transition-all shadow-sm"
                >
                  About ESC
                  <ArrowRight
                    size={14}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Link>
                <Link
                  href="/portfolio"
                  id="intro-portfolio-btn"
                  className="group inline-flex items-center justify-center gap-2 border-2 border-black hover:bg-black text-black hover:text-white font-black uppercase tracking-wider text-xs px-7 py-3.5 transition-all"
                >
                  See Our Work
                  <ArrowRight
                    size={14}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Link>
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

      {/* ═══ GET A QUOTE ═════════════════════════════════════ */}
      <QuoteStartSection />

      {/* ═══ WHY CHOOSE SECTION (CARDS) ══════════════════════ */}
      <WhyChooseSection />

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
                {sections.whychooseus?.title ||
                  "Why Choose Elite Steel Concepts?"}
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
                    value: `${settings.experienceYears || 14}+`,
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
                  {
                    value: "48",
                    label: "States Served",
                    sub: "Nationwide Delivery",
                  },
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
      <section
        id="local-coverage"
        className="bg-white py-20 md:py-28 border-t border-gray-100"
      >
        <Container>
          {/* Row 1: copy */}
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-12 bg-primary" />
              <span className="text-primary text-xs font-black uppercase tracking-[0.25em]">
                {sections.localcoverage?.subtitle || "Service Area"}
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-black uppercase tracking-tighter leading-tight mb-8">
              {sections.localcoverage?.title || "USA Area ESC Cover"}
            </h2>
            <ReadMore
              text={localCoverageLinked}
              maxLength={250}
              className="text-gray-500 text-lg leading-relaxed max-w-prose"
              buttonClassName="mt-4 text-[10px] font-black uppercase tracking-[0.2em] text-black border border-black px-4 py-2 hover:bg-primary hover:border-primary transition-colors flex items-center gap-2"
            />
          </div>

          {/* Row 2: area tiles */}
          <div className="mt-14 grid grid-cols-2 lg:grid-cols-4 border-y border-gray-100">
            {coverageAreas.map((area, i) => (
              <div
                key={area}
                className={`group hover:bg-[#0a0a0a] p-6 md:p-8 transition-all duration-300 cursor-default border-gray-100 ${
                  i % 2 === 0 ? "border-r" : ""
                } ${i < 2 ? "border-b lg:border-b-0" : ""} ${
                  i === 1 ? "lg:border-r" : ""
                }`}
              >
                <div className="size-12 bg-primary/10 border border-primary/30 group-hover:bg-primary group-hover:border-primary flex items-center justify-center mb-6 transition-colors">
                  <MapPin
                    size={22}
                    strokeWidth={2.25}
                    className="text-primary group-hover:text-white transition-colors"
                  />
                </div>
                <div className="text-sm font-black text-black group-hover:text-white uppercase tracking-tight transition-colors">
                  {area}
                </div>
                <div className="text-[10px] font-bold text-gray-500 group-hover:text-gray-400 uppercase tracking-widest mt-1 transition-colors">
                  {i === 3 ? "48 States" : "Full Coverage"}
                </div>
              </div>
            ))}
          </div>

          {/* Row 3: locations button */}
          <div className="mt-12 flex justify-center">
            <Link
              href="/locations"
              id="coverage-view-locations-btn"
              className="group inline-flex items-center gap-2 bg-primary hover:bg-orange-600 text-white font-black uppercase tracking-wider text-xs px-8 py-4 transition-all shadow-sm"
            >
              View All Locations We Serve
              <ArrowRight
                size={14}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>
        </Container>
      </section>

      {/* ═══ TESTIMONIALS ════════════════════════════════════ */}
      <Testimonials />

      {/* ═══ BLOG ════════════════════════════════════════════ */}
      <HomeBlogSection />

      {/* ═══ NEWSLETTER ══════════════════════════════════════ */}
      {/* <NewsletterSection /> */}

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

      {/* ═══ APPLICATION MODAL (ONE-TIME PER SESSION) ═══════ */}
      <ApplicationModal />
    </>
  );
}
