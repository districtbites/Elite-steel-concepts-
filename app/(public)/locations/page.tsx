import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Phone, ArrowRight } from "lucide-react";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import { locationData } from "./data";

import { getSEO, getPageSEO } from "@/lib/db";
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSEO();
  const pageSeo = await getPageSEO("locations");
  
  return {
    title: pageSeo?.title || `Locations | ${seo.siteTitle}`,
    description: pageSeo?.description || seo.description,
    keywords: pageSeo?.keywords || seo.keywords,
    alternates: { canonical: '/locations' },
  };
}

const tierLabels: Record<number, string> = {
  1: "Core DMV Market",
  2: "Virginia Secondary Markets",
  3: "Extended Coverage",
  4: "National Delivery",
};

export default async function LocationsPage() {
  const tier1 = locationData.filter((l) => l.tier === 1);

  return (
    <>
      {/* Hero */}
      <div className="bg-secondary text-white py-20 md:py-28">
        <Container>
          <div className="max-w-4xl">
            <div className="flex items-center gap-2 text-primary text-xs font-black uppercase tracking-widest mb-6">
              <MapPin size={14} />
              <span>Service Area</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-tight mb-6">
              Custom Food Truck Builder Serving DC, Virginia & Maryland
            </h1>
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-3xl mb-10">
              Elite Steel Concepts is based in Manassas Park, VA — centrally located to serve the entire DMV region,
              Northern Virginia, and Maryland. 12+ years of experience. 350+ builds. 100% health code compliant.
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

      {/* Quick Answer */}
      <Section className="bg-gray-50">
        <Container>
          <div className="bg-white border-l-4 border-primary rounded-r-2xl p-8 shadow-sm max-w-4xl">
            <p className="text-xs font-black uppercase tracking-widest text-primary mb-2">Quick Answer</p>
            <h2 className="text-2xl font-black text-secondary mb-3">
              Where does Elite Steel Concepts build food trucks?
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Our fabrication shop is at 8303 Rugby Rd, Manassas Park, VA 20111. We primarily serve the DMV region
              (Washington DC, Northern Virginia, and Maryland) but deliver custom food trucks and concession trailers
              nationwide across all 48 contiguous states. Call (571) 651-0337 for a free consultation.
            </p>
          </div>
        </Container>
      </Section>

      {/* Tier 1 Locations */}
      <Section className="bg-white">
        <Container>
          <div className="text-center mb-12">
            <p className="text-xs font-black uppercase tracking-widest text-primary mb-4">Core Service Area</p>
            <h2 className="text-3xl md:text-4xl font-black text-secondary uppercase tracking-tight">
              DC Metro Area Locations
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tier1.map((location) => (
              <Link
                key={location.slug}
                href={`/locations/${location.slug}`}
                className="group border border-gray-100 rounded-2xl p-6 hover:shadow-lg hover:border-primary transition-all"
              >
                <div className="flex items-center gap-2 text-primary text-xs font-black uppercase tracking-widest mb-3">
                  <MapPin size={14} />
                  <span>{location.state}</span>
                </div>
                <h3 className="text-xl font-black text-secondary uppercase tracking-tight mb-2 group-hover:text-primary transition-colors">
                  {location.city}
                </h3>
                <p className="text-sm text-gray-500 mb-4">{location.distance} from our shop</p>
                <div className="flex items-center gap-1 text-primary text-xs font-black uppercase tracking-wider">
                  <span>View Location</span>
                  <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      {/* Nationwide Coverage */}
      <Section className="bg-secondary text-white">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-primary mb-4">Nationwide</p>
              <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-6">
                We Deliver Nationwide — All 48 States
              </h2>
              <p className="text-gray-300 leading-relaxed text-lg mb-8">
                While we're based in Manassas Park, VA, Elite Steel Concepts has delivered custom food trucks and
                concession trailers to entrepreneurs in 48 states. Distance is not a barrier. We handle logistics,
                coordinate delivery, and ensure your truck arrives ready for inspection.
              </p>
              <Link
                href="/quote"
                className="inline-flex items-center gap-2 bg-primary hover:bg-orange-600 text-white font-black uppercase tracking-wider text-sm px-8 py-4 rounded-sm transition-all"
              >
                Get a Free Quote <ArrowRight size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "12+", sub: "Years in Business" },
                { label: "350+", sub: "Custom Builds" },
                { label: "48", sub: "States Served" },
                { label: "100%", sub: "Code Compliant" },
              ].map((stat) => (
                <div key={stat.label} className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
                  <div className="text-4xl font-black text-primary mb-2">{stat.label}</div>
                  <div className="text-sm font-bold text-gray-300 uppercase tracking-wider">{stat.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* CTA */}
      <Section className="bg-primary">
        <Container className="text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight mb-6">
            Don't See Your City? We Still Build for You.
          </h2>
          <p className="text-white/90 text-lg max-w-2xl mx-auto mb-8">
            Call us or request a free quote — we serve the entire DMV region and deliver nationwide.
            Our team at 8303 Rugby Rd, Manassas Park VA is ready to start your build.
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
    </>
  );
}
