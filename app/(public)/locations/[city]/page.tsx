import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Clock,
  CheckCircle2,
  ChevronDown,
  ArrowRight,
  Shield,
  Truck,
  Star,
  Wrench,
} from "lucide-react";
import Container from "@/components/ui/Container";
import { getLocations, getLocationBySlug, getSEO, getPageSEO, getSettings, getInternalLinkRules, getInternalLinkSettings } from "@/lib/db";
import { autoLinkMarkdown } from "@/lib/internalLinks";
import AutoLinkedText from "@/components/ui/AutoLinkedText";

interface PageProps {
  params: Promise<{ city: string }>;
}

export async function generateStaticParams() {
  const locations = await getLocations();
  return locations.map((loc) => ({ city: loc.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { city } = await params;
  const location = await getLocationBySlug(city);
  if (!location) return { title: "Location Not Found" };

  const seo = await getSEO();
  const pageSeo = await getPageSEO(`location-${city}`);

  return {
    title: pageSeo?.title || location.titleTag,
    description: pageSeo?.description || location.metaDescription,
    keywords:
      pageSeo?.keywords ||
      `custom food truck builder ${location.city} ${location.state}, food truck fabricator ${location.city}, concession trailer builder ${location.city}, mobile kitchen ${location.city}`,
    alternates: {
      canonical: `https://www.esteelconcepts.com/locations/${location.slug}`,
    },
    openGraph: {
      title: pageSeo?.title || location.titleTag,
      description: pageSeo?.description || location.metaDescription,
      type: "website",
    },
  };
}

const serviceIcons = [Wrench, Shield, Truck];

export default async function LocationPage({ params }: PageProps) {
  const { city } = await params;
  const location = await getLocationBySlug(city);
  if (!location) return notFound();

  const [settings, rules, linkSettings] = await Promise.all([
    getSettings(),
    getInternalLinkRules(),
    getInternalLinkSettings(),
  ]);
  const activeRules = rules.filter(r => r.enabled !== false);

  const addressParts = settings.address.split(',');
  const streetAddress = addressParts[0] || settings.address;
  const addressRegionLocality = addressParts.slice(1).join(',').trim() || '';

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Elite Steel Concepts",
    description: `Custom food truck and concession trailer builder serving ${location.city}, ${location.state}.`,
    url: `https://www.esteelconcepts.com/locations/${location.slug}`,
    telephone: "+15716510337",
    address: {
      "@type": "PostalAddress",
      streetAddress: streetAddress,
      addressLocality: addressRegionLocality,
      addressRegion: "VA",
      postalCode: "20110",
      addressCountry: "US",
    },
    areaServed: { "@type": "City", name: location.city },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Food Truck Building Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Custom Food Truck Fabrication",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Concession Trailer Building",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Food Truck Repair & Maintenance",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Fire Suppression System Installation",
          },
        },
      ],
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: location.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  // Nearby locations: prioritize same state, then regional neighbors
  const allLocations = await getLocations();
  const sameState = allLocations.filter(
    (l) => l.published && l.slug !== location.slug && l.state === location.state
  );
  const otherStates = allLocations.filter(
    (l) => l.published && l.slug !== location.slug && l.state !== location.state
  );
  const nearbyLocations = [...sameState.slice(0, 8), ...otherStates.slice(0, 4)];

  const trustPoints = [
    "14+ Years Experience",
    "350+ Builds Completed",
    "100% Code Compliant",
    "Nationwide Delivery",
  ];

  const marketP1 = autoLinkMarkdown(
    `The demand for high-quality, diverse street food and mobile catering in ${location.city}, ${location.state} has never been higher. However, breaking into this lucrative market requires more than just culinary skill; it demands a mobile kitchen that can handle relentless volume, extreme weather conditions, and strict municipal health codes.`,
    activeRules,
    linkSettings
  ).updatedContent;

  const marketP2 = autoLinkMarkdown(
    `At Elite Steel Concepts, we specialize in engineering heavy-duty, high-throughput food trucks and concession trailers specifically tailored for the ${location.city} demographic. Unlike generic out-of-state manufacturers who deliver non-compliant boxes, our proximity allows us to guarantee that your build will pass local ${location.state} health and fire inspections with zero friction.`,
    activeRules,
    linkSettings
  ).updatedContent;

  const marketP3 = autoLinkMarkdown(
    `Whether your strategy involves parking near bustling downtown office districts for the lunch rush, partnering with local breweries, or scaling a fleet for massive weekend festivals, your vehicle is the backbone of your revenue. We utilize premium, heavy-gauge stainless steel, NSF-certified equipment, and ergonomic layout designs to ensure your kitchen operates at peak efficiency during the busiest rushes ${location.city} has to offer.`,
    activeRules,
    linkSettings
  ).updatedContent;

  const whyEscLinked = autoLinkMarkdown(location.whyEsc || "", activeRules, linkSettings).updatedContent;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* ─── HERO ──────────────────────────────────────────────── */}
      <section className="relative bg-[#0a0a0a] text-white overflow-hidden">
        {/* Background grid texture */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, #fff 0px, #fff 1px, transparent 1px, transparent 60px), repeating-linear-gradient(90deg, #fff 0px, #fff 1px, transparent 1px, transparent 60px)",
          }}
        />
        {/* Orange diagonal accent */}
        <div className="absolute top-0 right-0 w-[40%] h-full bg-primary/5 skew-x-[-12deg] origin-top-right pointer-events-none" />
        <div className="absolute top-0 right-0 w-0.5 h-full bg-primary/30 pointer-events-none" />

        <Container>
          <div className="py-24 md:py-36">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs text-gray-600 font-bold uppercase tracking-widest mb-10">
              <Link href="/locations" className="hover:text-primary transition-colors">
                All Locations
              </Link>
              <span className="text-gray-700">/</span>
              <span className="text-primary">{location.city}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-16 items-start">
              {/* Left: Main copy */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <MapPin size={16} className="text-primary" />
                  <span className="text-primary text-xs font-black uppercase tracking-[0.25em]">
                    Serving {location.city}, {location.state}
                  </span>
                </div>

                <h1 className="text-5xl md:text-6xl xl:text-7xl font-black uppercase tracking-tighter leading-[0.9] mb-8">
                  {location.h1}
                </h1>

                <p className="text-gray-400 text-lg leading-relaxed max-w-xl mb-10">
                  {location.intro}
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href="tel:+15716510337"
                    id={`${location.slug}-hero-call-btn`}
                    className="inline-flex items-center gap-3 bg-primary hover:bg-orange-600 text-white font-black uppercase tracking-wider text-sm px-8 py-4 transition-all hover:-translate-y-0.5 shadow-lg shadow-primary/20"
                  >
                    <Phone size={16} />
                    (571) 651-0337
                  </a>
                  <Link
                    href="/quote"
                    id={`${location.slug}-hero-quote-btn`}
                    className="inline-flex items-center gap-3 border-2 border-white/20 hover:border-primary hover:text-primary text-white font-black uppercase tracking-wider text-sm px-8 py-4 transition-all"
                  >
                    Get a Free Quote
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>

              {/* Right: Info card */}
              <div className="border border-[#1a1a1a] bg-[#0f0f0f] divide-y divide-[#1a1a1a]">
                <div className="p-6">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-4">
                    Shop Details
                  </p>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <MapPin size={15} className="text-primary shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-400 leading-relaxed">
                        {settings.address}
                        {!location.distance.startsWith("0 miles") && (
                          <span className="block text-gray-600 text-xs mt-1">
                            {location.distance} from {location.city}
                          </span>
                        )}
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Phone size={15} className="text-primary shrink-0 mt-0.5" />
                      <a
                        href="tel:+15716510337"
                        className="text-sm text-gray-400 hover:text-primary transition-colors"
                      >
                        (571) 651-0337
                      </a>
                    </li>
                    <li className="flex items-start gap-3">
                      <Clock size={15} className="text-primary shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-400">
                        {settings.businessHours || "Mon-Sat | 09:00 AM - 05:00 PM"}
                      </span>
                    </li>
                  </ul>
                </div>
                <div className="p-6">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-4">
                    Trust Points
                  </p>
                  <ul className="space-y-3">
                    {trustPoints.map((point) => (
                      <li key={point} className="flex items-center gap-3">
                        <CheckCircle2 size={14} className="text-primary shrink-0" />
                        <span className="text-sm font-bold text-gray-300">
                          {point}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-6 bg-primary">
                  <Link
                    href="/quote"
                    id={`${location.slug}-sidebar-quote-btn`}
                    className="flex items-center justify-between group"
                  >
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.15em] text-white/70 mb-1">
                        Ready to Build?
                      </p>
                      <p className="font-black text-white text-lg uppercase tracking-tight">
                        Get a Free Quote
                      </p>
                    </div>
                    <ArrowRight
                      size={24}
                      className="text-white group-hover:translate-x-1.5 transition-transform"
                    />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Container>

        <div className="h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      </section>

      {/* ─── INFO BAR ──────────────────────────────────────────── */}
      <div className="bg-primary text-white">
        <Container>
          <div className="flex flex-wrap gap-x-8 gap-y-3 items-center py-4 text-sm font-black uppercase tracking-wider">
            <div className="flex items-center gap-2">
              <MapPin size={13} />
              <span>
                {settings.address}
                {!location.distance.startsWith("0 miles") && ` — ${location.distance} from ${location.city}`}
              </span>
            </div>
            <div className="w-px h-4 bg-white/30 hidden md:block" />
            <div className="flex items-center gap-2">
              <Phone size={13} />
              <a href="tel:+15716510337" className="hover:underline">
                (571) 651-0337
              </a>
            </div>
            <div className="w-px h-4 bg-white/30 hidden md:block" />
            <div className="flex items-center gap-2">
              <Clock size={13} />
              <span>{settings.businessHours || "Mon-Sat | 09:00 AM - 05:00 PM"}</span>
            </div>
          </div>
        </Container>
      </div>

      {/* ─── QUICK ANSWER ──────────────────────────────────────── */}
      <section className="bg-white py-16 md:py-20">
        <Container>
          <div className="max-w-4xl">
            <div className="flex items-start gap-6">
              <div className="w-1 shrink-0 self-stretch bg-primary" />
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-3">
                  Quick Answer
                </p>
                <h2 className="text-2xl md:text-3xl font-black text-black uppercase tracking-tight mb-4">
                  Is Elite Steel Concepts the right food truck builder for{" "}
                  {location.city}?
                </h2>
                <p className="text-gray-600 leading-relaxed text-lg">
                  Yes. Elite Steel Concepts at{" "}
                  <strong className="text-black">
                    {settings.address}
                  </strong>{" "}
                  {!location.distance.startsWith("0 miles") ? `is ${location.distance} from ${location.city}. ` : "is your local builder. "}
                  We've completed{" "}
                  <strong className="text-black">350+ custom food truck</strong>{" "}
                  and concession trailer builds over 14+ years, serving the entire
                  DMV region. Every build is{" "}
                  <strong className="text-black">
                    100% health code compliant
                  </strong>{" "}
                  for {location.state} regulations. Call{" "}
                  <a
                    href="tel:+15716510337"
                    className="text-primary hover:underline font-bold"
                  >
                    (571) 651-0337
                  </a>{" "}
                  for a free consultation.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ─── MARKET OVERVIEW (NEW SEO DENSITY BLOCK) ───────────── */}
      <section className="bg-[#f4f4f4] py-20 border-y border-gray-200">
        <Container>
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-px w-12 bg-primary" />
                  <span className="text-primary text-xs font-black uppercase tracking-[0.25em]">
                    Market Analysis
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-black uppercase tracking-tighter leading-tight mb-6">
                  Dominating the {location.city} <br/>
                  <span className="text-primary">Mobile Food Industry</span>
                </h2>
                <div className="space-y-6 text-gray-600 leading-relaxed">
                  <p>
                    <AutoLinkedText text={marketP1} />
                  </p>
                  <p>
                    <AutoLinkedText text={marketP2} />
                  </p>
                  <p>
                    <AutoLinkedText text={marketP3} />
                  </p>
                </div>
              </div>
              <div className="relative">
                {/* Decorative Tech-Grid Image Placeholder / Accent */}
                <div className="absolute inset-0 bg-primary/5 translate-x-4 translate-y-4 border border-primary/20 pointer-events-none" />
                <div className="bg-white p-10 border border-gray-100 shadow-xl relative z-10">
                  <h3 className="text-xl font-black text-black uppercase tracking-tight mb-6 border-b border-gray-100 pb-4">
                    The {location.city} Advantage
                  </h3>
                  <ul className="space-y-6">
                    <li className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <span className="font-black">01</span>
                      </div>
                      <div>
                        <strong className="block text-black uppercase tracking-tight mb-1">Local Compliance</strong>
                        <span className="text-sm text-gray-500 leading-relaxed">Guaranteed to meet {location.state} Department of Health requirements, preventing costly permitting delays.</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <span className="font-black">02</span>
                      </div>
                      <div>
                        <strong className="block text-black uppercase tracking-tight mb-1">High-Volume Engineering</strong>
                        <span className="text-sm text-gray-500 leading-relaxed">Custom layouts designed specifically to maximize output during peak {location.city} lunch and dinner rushes.</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <span className="font-black">03</span>
                      </div>
                      <div>
                        <strong className="block text-black uppercase tracking-tight mb-1">Proximity Support</strong>
                        <span className="text-sm text-gray-500 leading-relaxed">As a regional builder, we provide rapid maintenance, upgrades, and support to keep your truck on the road.</span>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ─── 3 CONTENT SECTIONS ────────────────────────────────── */}
      <section className="bg-[#0a0a0a] py-20 md:py-28">
        <Container>
          <div className="flex items-center gap-3 mb-16">
            <div className="h-px w-12 bg-primary" />
            <span className="text-primary text-xs font-black uppercase tracking-[0.25em]">
              Services & Expertise
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-[#1a1a1a]">
            {Object.values(location.sections).map((sec, i) => {
              const Icon = serviceIcons[i];
              return (
                <div
                  key={i}
                  className="relative bg-[#0a0a0a] p-10 group hover:bg-[#0f0f0f] transition-colors"
                >
                  {/* Top accent line */}
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

                  {/* Step number */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-10 h-10 border border-[#1a1a1a] group-hover:border-primary flex items-center justify-center transition-colors">
                      <Icon
                        size={18}
                        className="text-primary"
                      />
                    </div>
                    <span className="text-[60px] font-black text-white/[0.05] leading-none select-none">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <h2 className="text-xl font-black text-white uppercase tracking-tight leading-tight mb-5">
                    {sec.heading}
                  </h2>
                  <p className="text-gray-500 leading-relaxed text-sm">
                    {sec.content}
                  </p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ─── WHY ESC + LOCAL DETAILS ───────────────────────────── */}
      <section className="bg-white py-20 md:py-28">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Why ESC */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-12 bg-primary" />
                <span className="text-primary text-xs font-black uppercase tracking-[0.25em]">
                  Why Choose ESC
                </span>
              </div>

              <h2 className="text-4xl font-black text-black uppercase tracking-tighter leading-tight mb-8">
                Built for {location.city}.
                <span className="block text-primary">Built Right.</span>
              </h2>

              <p className="text-gray-600 leading-relaxed text-lg mb-10">
                <AutoLinkedText text={whyEscLinked} />
              </p>

              <div className="grid grid-cols-1 gap-3">
                {[
                  "14+ Years Experience",
                  "350+ Builds Completed",
                  "100% Code Compliant",
                  "Nationwide Delivery",
                ].map((stat) => (
                  <div
                    key={stat}
                    className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-b-0"
                  >
                    <CheckCircle2 size={16} className="text-primary shrink-0" />
                    <span className="text-sm font-black text-black uppercase tracking-wider">
                      {stat}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Local Details */}
            <div className="bg-[#0a0a0a] p-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-12 bg-primary" />
                <span className="text-primary text-xs font-black uppercase tracking-[0.25em]">
                  Local {location.city} Details
                </span>
              </div>

              <h3 className="text-2xl font-black text-white uppercase tracking-tight leading-tight mb-8">
                What You Need to Know for {location.city}
              </h3>

              <ul className="space-y-4">
                {location.localDetails.map((detail, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <div className="w-5 h-5 bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0 mt-0.5">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                    </div>
                    <span className="text-gray-400 leading-relaxed text-sm">
                      {detail}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* ─── MASSIVE SEO CONTENT BLOCK (STATIC FOR ALL CITIES) ─── */}
      <section className="bg-[#f9f9f9] py-20 md:py-28 border-y border-gray-200">
        <Container>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-black text-black uppercase tracking-tighter leading-tight mb-6">
                The Elite Steel Concepts Standard in {location.city}
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed max-w-3xl mx-auto">
                Launching a mobile food business in {location.city} requires more than just a great menu. You need a highly engineered, durable, and fully compliant mobile kitchen capable of withstanding the rigors of daily operation. Whether you're searching for a custom food truck builder or a concession trailer fabricator, Elite Steel Concepts delivers commercial-grade quality that outlasts the competition.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-black text-black uppercase tracking-tight mb-3">
                    Premium Custom Food Trucks
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-sm">
                    Our motorized custom food trucks are built on reliable step-van chassis (like Ford, Chevy, and Freightliner). Designed for extreme mobility, these trucks are perfect for catering corporate lunches, navigating tight urban streets, and participating in high-volume food truck festivals across {location.city}. We fully gut the interior and install a brand-new, NSF-certified commercial kitchen from the floor up.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-black text-black uppercase tracking-tight mb-3">
                    High-Capacity Concession Trailers
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-sm">
                    If you intend to park at local breweries, permanent food parks, or massive weekend festivals in {location.city}, a concession trailer offers maximum square footage at a lower entry price point. We build custom concession trailers ranging from 12 feet to massive 28-foot tandem-axle setups equipped with massive smoker porches, multiple service windows, and high-throughput cooking lines.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-black text-black uppercase tracking-tight mb-3">
                    Health Code & Fire Safety Compliance
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-sm">
                    Failing a health inspection in {location.city} means losing weeks of revenue. We eliminate that risk. Every Elite Steel Concepts build is engineered with commercial-grade stainless steel walls, diamond-plate aluminum flooring, 3-compartment sinks with designated hand-washing stations, and required fresh/gray water capacities. Furthermore, we install fully compliant commercial exhaust hoods equipped with Ansul fire suppression systems to meet all local fire codes.
                  </p>
                </div>
              </div>

              <div className="bg-white p-8 border border-gray-100 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[50px] -mr-10 -mt-10 pointer-events-none" />
                <h3 className="text-2xl font-black text-black uppercase tracking-tight mb-6">
                  What Goes Into Our Builds?
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-4 border-b border-gray-50 pb-4">
                    <CheckCircle2 size={18} className="text-primary shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-black text-sm uppercase tracking-wider mb-1">NSF-Certified Equipment</strong>
                      <span className="text-gray-500 text-xs leading-relaxed">We only install commercial-grade refrigeration, fryers, ranges, and prep tables that meet rigorous health department standards.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-4 border-b border-gray-50 pb-4">
                    <CheckCircle2 size={18} className="text-primary shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-black text-sm uppercase tracking-wider mb-1">Precision Fabrication</strong>
                      <span className="text-gray-500 text-xs leading-relaxed">Our in-house fabricators use TIG and MIG welding to construct durable interior framing that prevents equipment shifting on rough roads.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-4 border-b border-gray-50 pb-4">
                    <CheckCircle2 size={18} className="text-primary shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-black text-sm uppercase tracking-wider mb-1">Custom Workflow Design</strong>
                      <span className="text-gray-500 text-xs leading-relaxed">We design your kitchen layout specifically around your menu, ensuring your team can operate at maximum efficiency during peak rushes.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <CheckCircle2 size={18} className="text-primary shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-black text-sm uppercase tracking-wider mb-1">Electrical & Plumbing</strong>
                      <span className="text-gray-500 text-xs leading-relaxed">Robust electrical panels tailored for heavy commercial loads, integrated generators, and high-capacity PEX plumbing systems.</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ─── FAQ ───────────────────────────────────────────────── */}
      <section className="bg-[#0a0a0a] py-20 md:py-28">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-16">
            {/* Left label */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-12 bg-primary" />
                <span className="text-primary text-xs font-black uppercase tracking-[0.25em]">
                  FAQ
                </span>
              </div>
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter leading-tight">
                {location.city}
                <span className="block text-gray-600">Food Truck</span>
                <span className="block text-primary">Questions</span>
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed mt-6">
                Common questions from {location.city}-area food truck
                entrepreneurs. Don't see yours?{" "}
                <a
                  href="tel:+15716510337"
                  className="text-primary hover:underline"
                >
                  Call us directly.
                </a>
              </p>
            </div>

            {/* Right: FAQ accordion */}
            <div className="space-y-px">
              {location.faq.map((item, i) => (
                <details
                  key={i}
                  id={`faq-${location.slug}-${i}`}
                  className="group border-l-2 border-[#1a1a1a] open:border-primary bg-[#0f0f0f] overflow-hidden transition-all"
                >
                  <summary className="flex items-center justify-between px-8 py-6 cursor-pointer font-black text-white hover:text-primary transition-colors list-none">
                    <span className="text-sm uppercase tracking-tight pr-6">
                      {item.question}
                    </span>
                    <ChevronDown
                      size={16}
                      className="shrink-0 text-primary transition-transform duration-200 group-open:rotate-180"
                    />
                  </summary>
                  <div className="px-8 pb-6 text-gray-500 leading-relaxed text-sm border-t border-[#1a1a1a]">
                    <div className="pt-4">{item.answer}</div>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ─── CTA ───────────────────────────────────────────────── */}
      <section className="bg-primary py-20">
        <Container>
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Star size={16} className="text-white/70" />
                <span className="text-xs font-black uppercase tracking-[0.2em] text-white/70">
                  Ready to Build
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter leading-tight">
                Your {location.city}
                <span className="block">Food Truck Starts Here.</span>
              </h2>
              <p className="text-white/80 mt-4 leading-relaxed max-w-lg">
                {location.ctaText}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 shrink-0">
              <a
                href="tel:+15716510337"
                id={`${location.slug}-cta-call-btn`}
                className="inline-flex items-center gap-3 bg-black text-white hover:bg-white hover:text-black font-black uppercase tracking-wider text-sm px-8 py-4 transition-all whitespace-nowrap"
              >
                <Phone size={16} />
                Call Us Now
              </a>
              <Link
                href="/quote"
                id={`${location.slug}-cta-quote-btn`}
                className="inline-flex items-center gap-3 border-2 border-black hover:bg-black hover:text-white text-black font-black uppercase tracking-wider text-sm px-8 py-4 transition-all whitespace-nowrap"
              >
                Get a Free Quote
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* ─── NEARBY LOCATIONS ──────────────────────────────────── */}
      <section className="bg-white py-16 border-t border-gray-100">
        <Container>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-10">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-2">
                We Also Serve
              </p>
              <h2 className="text-2xl font-black text-black uppercase tracking-tighter">
                Other Service Areas
              </h2>
            </div>
            <Link
              href="/locations"
              className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-primary hover:underline"
            >
              View All Locations <ArrowRight size={12} />
            </Link>
          </div>

          <div className="flex flex-wrap gap-3">
            {nearbyLocations.map((l) => (
              <Link
                key={l.slug}
                href={`/locations/${l.slug}`}
                id={`nearby-${l.slug}`}
                className="group flex items-center gap-2 border border-gray-200 hover:border-primary px-5 py-2.5 transition-all"
              >
                <MapPin
                  size={12}
                  className="text-gray-400 group-hover:text-primary transition-colors"
                />
                <span className="text-sm font-black text-black group-hover:text-primary transition-colors uppercase tracking-tight">
                  {l.city}, {l.state}
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
