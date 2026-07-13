import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Phone, Clock, CheckCircle2, ChevronDown } from "lucide-react";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import { getLocationBySlug, getAllLocationSlugs } from "../data";

interface PageProps {
  params: Promise<{ city: string }>;
}

export async function generateStaticParams() {
  return getAllLocationSlugs().map((slug) => ({ city: slug }));
}

import { getSEO, getPageSEO } from "@/lib/db";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { city } = await params;
  const location = getLocationBySlug(city);
  if (!location) return { title: "Location Not Found" };

  const seo = await getSEO();
  const pageSeo = await getPageSEO(`location-${city}`);

  return {
    title: pageSeo?.title || location.titleTag,
    description: pageSeo?.description || location.metaDescription,
    keywords: pageSeo?.keywords || `custom food truck builder ${location.city} ${location.state}, food truck fabricator ${location.city}, concession trailer builder ${location.city}, mobile kitchen ${location.city}`,
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

export default async function LocationPage({ params }: PageProps) {
  const { city } = await params;
  const location = getLocationBySlug(city);
  if (!location) return notFound();

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Elite Steel Concepts",
    description: `Custom food truck and concession trailer builder serving ${location.city}, ${location.state}.`,
    url: `https://www.esteelconcepts.com/locations/${location.slug}`,
    telephone: "+15716510337",
    address: {
      "@type": "PostalAddress",
      streetAddress: "8303 Rugby Rd",
      addressLocality: "Manassas Park",
      addressRegion: "VA",
      postalCode: "20111",
      addressCountry: "US",
    },
    areaServed: {
      "@type": "City",
      name: location.city,
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Food Truck Building Services",
      itemListElement: [
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Custom Food Truck Fabrication" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Concession Trailer Building" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Food Truck Repair & Maintenance" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Fire Suppression System Installation" } },
      ],
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: location.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Hero */}
      <div className="bg-secondary text-white py-20 md:py-28">
        <Container>
          <div className="max-w-4xl">
            <div className="flex items-center gap-2 text-primary text-xs font-black uppercase tracking-widest mb-6">
              <MapPin size={14} />
              <span>Serving {location.city}, {location.state}</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-tight mb-6">
              {location.h1}
            </h1>
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-3xl mb-10">
              {location.intro}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="tel:+15716510337"
                className="inline-flex items-center gap-2 bg-primary hover:bg-orange-600 text-white font-black uppercase tracking-wider text-sm px-8 py-4 rounded-sm transition-all hover:-translate-y-0.5 shadow-lg"
              >
                <Phone size={16} />
                (571) 651-0337
              </a>
              <Link
                href="/quote"
                className="inline-flex items-center gap-2 border-2 border-white hover:bg-white hover:text-secondary text-white font-black uppercase tracking-wider text-sm px-8 py-4 rounded-sm transition-all"
              >
                Get a Free Quote
              </Link>
            </div>
          </div>
        </Container>
      </div>

      {/* Quick Info Bar */}
      <div className="bg-primary text-white py-4">
        <Container>
          <div className="flex flex-wrap gap-6 items-center text-sm font-bold uppercase tracking-wider">
            <div className="flex items-center gap-2">
              <MapPin size={14} />
              <span>8303 Rugby Rd, Manassas Park VA — {location.distance} from {location.city}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={14} />
              <a href="tel:+15716510337" className="hover:underline">(571) 651-0337</a>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={14} />
              <span>Mon–Fri 9AM–5PM · Sat 9AM–2PM</span>
            </div>
          </div>
        </Container>
      </div>

      {/* Quick Answer Box */}
      <Section className="bg-gray-50">
        <Container>
          <div className="bg-white border-l-4 border-primary rounded-r-2xl p-8 shadow-sm max-w-4xl">
            <p className="text-xs font-black uppercase tracking-widest text-primary mb-2">Quick Answer</p>
            <h2 className="text-2xl font-black text-secondary mb-3">
              Is Elite Steel Concepts the right food truck builder for {location.city}?
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Yes. Elite Steel Concepts at 8303 Rugby Rd, Manassas Park VA is {location.distance} from {location.city}.
              We've completed 350+ custom food truck and concession trailer builds over 12+ years, serving the entire DMV region.
              Every build is 100% health code compliant for {location.state} regulations.
              Call (571) 651-0337 for a free consultation.
            </p>
          </div>
        </Container>
      </Section>

      {/* 3 Content Sections */}
      <Section className="bg-white">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {Object.values(location.sections).map((sec, i) => (
              <div key={i} className="border border-gray-100 rounded-2xl p-8 hover:shadow-md transition-shadow">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-primary font-black text-lg">{i + 1}</span>
                </div>
                <h2 className="text-xl font-black text-secondary uppercase tracking-tight mb-4">{sec.heading}</h2>
                <p className="text-gray-600 leading-relaxed">{sec.content}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Why ESC + Local Details */}
      <Section className="bg-secondary text-white">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-primary mb-4">Why Choose ESC</p>
              <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-6">
                Built for {location.city}. Built Right.
              </h2>
              <p className="text-gray-300 leading-relaxed text-lg">{location.whyEsc}</p>
              <div className="mt-8 grid grid-cols-2 gap-4">
                {["12+ Years Experience", "350+ Builds Completed", "100% Code Compliant", "Nationwide Delivery"].map((stat) => (
                  <div key={stat} className="flex items-center gap-3">
                    <CheckCircle2 size={18} className="text-primary shrink-0" />
                    <span className="text-sm font-bold text-gray-200">{stat}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-primary mb-4">
                Local {location.city} Details
              </p>
              <h3 className="text-2xl font-black uppercase tracking-tight mb-6">
                What You Need to Know for {location.city}
              </h3>
              <ul className="space-y-3">
                {location.localDetails.map((detail, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    <span className="text-gray-300 leading-relaxed">{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </Section>

      {/* FAQ */}
      <Section className="bg-gray-50">
        <Container className="max-w-3xl">
          <h2 className="text-3xl font-black text-secondary uppercase tracking-tight text-center mb-12">
            {location.city} Food Truck FAQ
          </h2>
          <div className="space-y-4">
            {location.faq.map((item, i) => (
              <details key={i} className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                <summary className="flex items-center justify-between p-6 cursor-pointer font-bold text-secondary hover:text-primary transition-colors list-none">
                  <span>{item.question}</span>
                  <ChevronDown size={18} className="shrink-0 transition-transform group-open:rotate-180" />
                </summary>
                <div className="px-6 pb-6 text-gray-600 leading-relaxed">{item.answer}</div>
              </details>
            ))}
          </div>
        </Container>
      </Section>

      {/* CTA Section */}
      <Section className="bg-primary">
        <Container className="text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight mb-6">
            Ready to Build Your {location.city} Food Truck?
          </h2>
          <p className="text-white/90 text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
            {location.ctaText}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+15716510337"
              className="inline-flex items-center gap-2 bg-white text-primary hover:bg-gray-100 font-black uppercase tracking-wider text-sm px-8 py-4 rounded-sm transition-all shadow-lg"
            >
              <Phone size={16} />
              Call (571) 651-0337
            </a>
            <Link
              href="/quote"
              className="inline-flex items-center gap-2 border-2 border-white hover:bg-white hover:text-primary text-white font-black uppercase tracking-wider text-sm px-8 py-4 rounded-sm transition-all"
            >
              Get a Free Quote
            </Link>
          </div>
        </Container>
      </Section>

      {/* Internal Links to Other Locations */}
      <Section className="bg-white">
        <Container>
          <h2 className="text-xl font-black text-secondary uppercase tracking-tight text-center mb-8">
            We Also Serve These Areas
          </h2>
          <div className="flex flex-wrap gap-3 justify-center">
            {[
              { slug: "washington-dc", name: "Washington DC" },
              { slug: "arlington-va", name: "Arlington, VA" },
              { slug: "alexandria-va", name: "Alexandria, VA" },
              { slug: "fairfax-va", name: "Fairfax, VA" },
              { slug: "manassas-va", name: "Manassas, VA" },
              { slug: "rockville-md", name: "Rockville, MD" },
              { slug: "bethesda-md", name: "Bethesda, MD" },
              { slug: "silver-spring-md", name: "Silver Spring, MD" },
            ]
              .filter((l) => l.slug !== location.slug)
              .map((l) => (
                <Link
                  key={l.slug}
                  href={`/locations/${l.slug}`}
                  className="text-sm font-bold text-secondary hover:text-primary border border-gray-200 hover:border-primary px-4 py-2 rounded-full transition-all"
                >
                  {l.name}
                </Link>
              ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
