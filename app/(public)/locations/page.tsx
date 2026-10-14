import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Phone, ArrowRight, Shield, Clock, Star, Truck } from "lucide-react";
import Container from "@/components/ui/Container";
import PageHeader from "@/components/ui/PageHeader";
import FAQSection from "@/components/FAQSection";
import { getSEO, getPageSEO, getLocations, getSettings, getFAQs } from "@/lib/db";
import LocationsDirectory from "@/components/locations/LocationsDirectory";
// Cached and regenerated every 5 minutes, or immediately when the admin saves changes (revalidatePath).
export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSEO();
  const pageSeo = await getPageSEO("locations");

  return {
    title: pageSeo?.title || `Locations | ${seo.siteTitle}`,
    description: pageSeo?.description || seo.description,
    keywords: pageSeo?.keywords || seo.keywords,
    alternates: { canonical: "/locations" },
  };
}

const nationwidePromises = [
  {
    icon: Star,
    title: "White-Glove Build Quality",
    desc: "Commercial-grade stainless steel, NSF-certified equipment throughout.",
  },
  {
    icon: Shield,
    title: "Compliance Guaranteed",
    desc: "Every build passes health inspection on the first attempt — or we fix it free.",
  },
  {
    icon: Truck,
    title: "Door-to-Door Delivery",
    desc: "We coordinate full logistics from our Manassas shop to your address.",
  },
  {
    icon: Clock,
    title: "8–12 Week Turnaround",
    desc: "Consistent delivery timeline from signed design to shipped truck.",
  },
];

export default async function LocationsPage() {
  const [locations, settings, faqs] = await Promise.all([
    getLocations(),
    getSettings(),
    getFAQs(),
  ]);
  const publishedLocations = locations.filter(l => l.published);
  // The directory is a client component — send only the fields it renders, not the full page content of 330 cities.
  const directoryLocations = publishedLocations.map(({ slug, city, state, distance }) => ({ slug, city, state, distance }));

  return (
    <>
      {/* ─── HERO ──────────────────────────────────────────────── */}
      <PageHeader
        eyebrow="States ESC Serve"
        title="Trusted Custom Food Truck Builder Serving Virginia, Washington, DC & Maryland"
        titleClassName="text-3xl md:text-5xl lg:text-6xl"
        subtitle="Find Custom Food Truck and Trailer Building Services Near You"
        normalCaseSubtitle
      >
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="tel:+15716510337"
            id="locations-hero-call-btn"
            className="inline-flex items-center gap-3 bg-primary hover:bg-orange-600 text-black hover:text-white font-black uppercase tracking-wider text-sm px-8 py-4 transition-all hover:-translate-y-0.5 shadow-lg shadow-primary/20"
          >
            <Phone size={16} />
            Call: (571) 651-0337
          </a>
          <Link
            href="/quote"
            id="locations-hero-quote-btn"
            className="inline-flex items-center gap-3 border-2 border-white/30 hover:border-primary hover:text-primary text-white font-black uppercase tracking-wider text-sm px-8 py-4 transition-all"
          >
            Get a Free Quote
            <ArrowRight size={16} />
          </Link>
        </div>
      </PageHeader>

      {/* ─── REGIONAL LOCATIONS DIRECTORY ────────────────────────── */}
      <section className="bg-[#faf9f7] py-16 md:py-24 border-t border-gray-200" id="directory">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-10 md:mb-12">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-2 h-2 bg-primary" />
              <p className="text-primary font-black uppercase tracking-[0.2em] text-xs">Regional & Surrounding State Directory</p>
              <div className="w-2 h-2 bg-primary" />
            </div>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-black leading-none mb-5">
              Virginia & Surrounding Service Locations
            </h2>
            <p className="text-gray-600 text-base md:text-lg leading-relaxed">
              Browse every city we serve. Filter by state, search for your city, or sort by distance from our Manassas shop.
            </p>
          </div>

          <LocationsDirectory locations={directoryLocations} />
        </Container>
      </section>

      {/* ─── NATIONWIDE COVERAGE ───────────────────────────────── */}
      <section className="bg-white py-14 md:py-20">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-10 md:mb-12">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-2 h-2 bg-primary" />
              <p className="text-primary font-black uppercase tracking-[0.2em] text-xs">Nationwide</p>
              <div className="w-2 h-2 bg-primary" />
            </div>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-black leading-none mb-5">
              We Deliver to All 48 States
            </h2>
            <p className="text-gray-600 text-base md:text-lg leading-relaxed">
              While we&apos;re based in Manassas, VA, Elite Steel Concepts has delivered custom food trucks and{" "}
              <Link
                href="/services/custom-food-trailers"
                className="text-primary font-bold underline underline-offset-4 hover:text-orange-600 transition-colors"
              >
                concession trailers
              </Link>{" "}
              to entrepreneurs across 48 states. Distance is not a barrier — we handle
              logistics, coordinate delivery, and ensure your truck arrives ready for inspection.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {nationwidePromises.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="group relative bg-white border border-gray-200 p-7 hover:border-primary hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="absolute top-0 left-0 h-1 w-full bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
                <div className="w-14 h-14 bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                  <Icon size={24} />
                </div>
                <h3 className="text-lg font-black uppercase tracking-tight text-black leading-tight mb-3">{title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 md:mt-12 text-center">
            <Link
              href="/quote"
              id="nationwide-quote-btn"
              className="group inline-flex items-center gap-4 bg-primary text-black pl-8 pr-3 py-3 font-black uppercase tracking-wider text-sm shadow-lg shadow-primary/25 hover:-translate-y-0.5 hover:shadow-xl transition-all"
            >
              Get a Free Quote
              <span className="w-10 h-10 rounded-full bg-black text-primary flex items-center justify-center group-hover:translate-x-1 transition-transform">
                <ArrowRight size={16} />
              </span>
            </Link>
          </div>
        </Container>
      </section>

      {/* ─── FAQS ───────────────────────────────────────────────── */}
      <FAQSection faqs={faqs} plainHeading eyebrowAsH1={false} />

      {/* ─── SHOP ADDRESS CALLOUT ──────────────────────────────── */}
      <section className="bg-[#0a0a0a] py-20 border-t border-[#1a1a1a]">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#1a1a1a]">
            <div className="bg-[#0a0a0a] p-10 md:col-span-2 flex items-center gap-6">
              <MapPin size={32} className="text-primary shrink-0" />
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-2">
                  Our Fabrication Shop
                </p>
                <p className="text-2xl font-black text-white uppercase tracking-tight">
                  {settings.address}
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  {settings.businessHours || "Mon-Sat | 09:00 AM - 05:00 PM"} &middot; Walk-ins
                  welcome
                </p>
              </div>
            </div>
            <div className="bg-primary p-10 flex flex-col justify-center">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-white/70 mb-3">
                Call Direct
              </p>
              <a
                href="tel:+15716510337"
                id="shop-address-call-btn"
                className="text-2xl font-black text-white hover:text-black transition-colors block mb-6"
              >
                (571) 651-0337
              </a>
              <Link
                href="/quote"
                id="shop-address-quote-btn"
                className="group inline-flex items-center justify-center gap-4 bg-white text-black pl-8 pr-3 py-3 font-black uppercase tracking-wider text-sm shadow-xl shadow-black/10 hover:-translate-y-0.5 hover:shadow-2xl transition-all whitespace-nowrap"
              >
                Get a Free Quote
                <span className="w-10 h-10 rounded-full bg-black text-primary flex items-center justify-center group-hover:translate-x-1 transition-transform">
                  <ArrowRight size={16} />
                </span>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* ─── FINAL CTA ─────────────────────────────────────────── */}
      <section className="bg-primary py-20">
        <Container>
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-white/70 mb-3">
                Don't see your city?
              </p>
              <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter leading-tight">
                We Still Build for You — Nationwide.
              </h2>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 shrink-0 w-full md:w-auto">
              <a
                href="tel:+15716510337"
                id="cta-call-btn"
                className="group inline-flex items-center justify-center gap-4 bg-black text-white pl-3 pr-8 py-3 font-black uppercase tracking-wider text-sm shadow-xl shadow-black/20 hover:-translate-y-0.5 hover:shadow-2xl transition-all whitespace-nowrap"
              >
                <span className="w-10 h-10 rounded-full bg-primary text-black flex items-center justify-center group-hover:rotate-12 transition-transform">
                  <Phone size={16} />
                </span>
                Call Us Now
              </a>
              <Link
                href="/quote"
                id="cta-quote-btn"
                className="group inline-flex items-center justify-center gap-4 bg-white text-black pl-8 pr-3 py-3 font-black uppercase tracking-wider text-sm shadow-xl shadow-black/10 hover:-translate-y-0.5 hover:shadow-2xl transition-all whitespace-nowrap"
              >
                Get a Free Quote
                <span className="w-10 h-10 rounded-full bg-black text-primary flex items-center justify-center group-hover:translate-x-1 transition-transform">
                  <ArrowRight size={16} />
                </span>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
