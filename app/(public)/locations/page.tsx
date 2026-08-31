import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Phone, ArrowRight, Shield, Clock, Star, Truck } from "lucide-react";
import Container from "@/components/ui/Container";
import { getSEO, getPageSEO, getLocations, getInternalLinkRules, getInternalLinkSettings, getSettings } from "@/lib/db";
import { autoLinkMarkdown } from "@/lib/internalLinks";
import AutoLinkedText from "@/components/ui/AutoLinkedText";
import LocationsDirectory from "@/components/locations/LocationsDirectory";
export const dynamic = "force-dynamic";
export const revalidate = 0;

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

const stats = [
  { value: "12+", label: "Years in Business", icon: Clock },
  { value: "350+", label: "Custom Builds", icon: Truck },
  { value: "48", label: "States Served", icon: MapPin },
  { value: "100%", label: "Code Compliant", icon: Shield },
];

export default async function LocationsPage() {
  const [locations, rules, linkSettings, settings] = await Promise.all([
    getLocations(),
    getInternalLinkRules(),
    getInternalLinkSettings(),
    getSettings(),
  ]);
  const activeRules = rules.filter(r => r.enabled !== false);
  const publishedLocations = locations.filter(l => l.published);

  const heroDescRaw = "Elite Steel Concepts is based in Manassas, VA — centrally positioned to serve Virginia, Washington DC, Maryland, and surrounding states across the Mid-Atlantic and Southeast. 12+ years of custom food truck and concession trailer fabrication excellence. 350+ builds completed. Every truck built to 100% local health code standards.";
  const heroDescLinked = autoLinkMarkdown(heroDescRaw, activeRules, linkSettings).updatedContent;
  return (
    <>
      {/* ─── HERO ──────────────────────────────────────────────── */}
      <section className="relative bg-[#0a0a0a] text-white overflow-hidden">
        {/* Decorative angled orange bar */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 skew-x-[-12deg] origin-top-right pointer-events-none" />
        <div className="absolute top-0 right-0 w-1 h-full bg-primary/40 pointer-events-none" />

        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center py-24 md:py-36">
            {/* Left: Copy */}
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="h-px w-12 bg-primary" />
                <span className="text-primary text-xs font-black uppercase tracking-[0.25em]">
                  Service Area
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl xl:text-7xl font-black uppercase tracking-tighter leading-[0.9] mb-8">
                Custom Food Truck Builder
                <span className="block text-primary mt-2">
                  DC · Virginia · Maryland
                </span>
              </h1>

              <p className="text-lg text-gray-400 leading-relaxed max-w-xl mb-10">
                <AutoLinkedText text={heroDescLinked} />
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="tel:+15716510337"
                  id="locations-hero-call-btn"
                  className="inline-flex items-center gap-3 bg-primary hover:bg-orange-600 text-white font-black uppercase tracking-wider text-sm px-8 py-4 transition-all hover:-translate-y-0.5 shadow-lg shadow-primary/20"
                >
                  <Phone size={16} />
                  (571) 651-0337
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
            </div>

            {/* Right: Stats grid */}
            <div className="grid grid-cols-2 gap-4 relative z-10">
              {stats.map(({ value, label, icon: Icon }) => (
                <div
                  key={label}
                  className="border border-[#1a1a1a] hover:border-primary/50 bg-[#0f0f0f] p-8 group transition-all duration-300"
                >
                  <Icon
                    size={20}
                    className="text-primary mb-4 group-hover:scale-110 transition-transform"
                  />
                  <div className="text-4xl font-black text-white mb-1">
                    {value}
                  </div>
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>

        {/* Bottom border */}
        <div className="h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      </section>

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
                  Where does Elite Steel Concepts build food trucks?
                </h2>
                <p className="text-gray-600 leading-relaxed text-lg">
                  Our fabrication shop is at{" "}
                  <strong className="text-black">
                    {settings.address}
                  </strong>
                  . We primarily serve the DMV region (Washington DC, Northern
                  Virginia, and Maryland) and surrounding states, and deliver custom food trucks and
                  concession trailers{" "}
                  <strong className="text-black">
                    nationwide across all 48 contiguous states
                  </strong>
                  . Call{" "}
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

      {/* ─── REGIONAL LOCATIONS DIRECTORY ────────────────────────── */}
      <section className="bg-[#080808] py-20 md:py-28 border-t border-[#1a1a1a]" id="directory">
        <Container>
          {/* Section header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px w-12 bg-primary" />
                <span className="text-primary text-xs font-black uppercase tracking-[0.25em]">
                  Regional & Surrounding State Directory
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter leading-tight">
                Virginia & Surrounding
                <span className="block text-primary">Service Locations</span>
              </h2>
            </div>
            <div className="max-w-md lg:text-right space-y-2">
              <p className="text-gray-400 text-sm leading-relaxed">
                Browse all 330 custom-engineered city landing pages. Filter by state, search by proximity, or view local health code requirements.
              </p>
              <div className="flex items-center lg:justify-end gap-2 text-[11px] font-black uppercase tracking-wider text-emerald-400">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
                12 States & Territories &middot; 100% Permitting Support
              </div>
            </div>
          </div>

          {/* Interactive Directory */}
          <LocationsDirectory locations={publishedLocations} />
        </Container>
      </section>

      {/* ─── NATIONWIDE COVERAGE ───────────────────────────────── */}
      <section className="bg-white py-20 md:py-28">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-16 items-center">
            {/* Left */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-12 bg-primary" />
                <span className="text-primary text-xs font-black uppercase tracking-[0.25em]">
                  Nationwide
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-black uppercase tracking-tighter leading-tight mb-6">
                We Deliver to
                <span className="block text-primary">All 48 States</span>
              </h2>
              <p className="text-gray-600 leading-relaxed text-lg max-w-xl mb-10">
                While we're based in Manassas, VA, Elite Steel Concepts has
                delivered custom food trucks and concession trailers to
                entrepreneurs across 48 states. Distance is not a barrier — we
                handle logistics, coordinate delivery, and ensure your truck
                arrives ready for inspection.
              </p>
              <Link
                href="/quote"
                id="nationwide-quote-btn"
                className="inline-flex items-center gap-3 bg-primary hover:bg-orange-600 text-white font-black uppercase tracking-wider text-sm px-8 py-4 transition-all hover:-translate-y-0.5 shadow-lg shadow-primary/20"
              >
                Get a Free Quote
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* Right: Delivery promise cards */}
            <div className="grid grid-cols-1 gap-0 border border-gray-100 w-full lg:min-w-[340px]">
              {[
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
              ].map(({ icon: Icon, title, desc }, i) => (
                <div
                  key={i}
                  className="flex items-start gap-5 p-6 border-b border-gray-100 last:border-b-0 group hover:bg-gray-50 transition-colors"
                >
                  <div className="w-10 h-10 bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-all">
                    <Icon
                      size={18}
                      className="text-primary group-hover:text-white transition-colors"
                    />
                  </div>
                  <div>
                    <div className="font-black text-black text-sm uppercase tracking-tight mb-1">
                      {title}
                    </div>
                    <div className="text-xs text-gray-500 leading-relaxed">
                      {desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

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
                  Mon–Fri 9AM–5PM &middot; Sat 9AM–2PM &middot; Walk-ins
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
                className="inline-flex items-center gap-2 bg-black text-white hover:bg-white hover:text-black font-black uppercase tracking-wider text-xs px-6 py-3 transition-all"
              >
                Free Quote
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* ─── SEO RICH CONTENT BLOCK ────────────────────────────── */}
      <section className="bg-white py-20 md:py-28 border-t border-gray-100">
        <Container>
          <div className="max-w-5xl mx-auto space-y-16">
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="h-px w-12 bg-primary" />
                <span className="text-primary text-xs font-black uppercase tracking-[0.25em]">
                  Industry Experts
                </span>
                <div className="h-px w-12 bg-primary" />
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-black uppercase tracking-tighter leading-tight mb-8">
                The Mid-Atlantic's Premier <br className="hidden md:block" />
                <span className="text-primary">Custom Mobile Kitchen Builder</span>
              </h2>
              <p className="text-gray-600 leading-relaxed text-lg max-w-3xl mx-auto">
                Whether you are launching a high-end corporate catering truck in Washington DC, a sprawling BBQ concession trailer in Richmond, or expanding an established restaurant brand into the mobile food market across Maryland, Elite Steel Concepts possesses the fabrication expertise to execute your vision flawlessly. We don't just build boxes; we engineer high-throughput commercial culinary environments that pass strict health department inspections on the very first try.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-black text-black uppercase tracking-tight mb-4">
                  Navigating DMV Health Department Codes
                </h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Building a custom food truck isn't just about welding stainless steel—it's about compliance. The Washington DC Department of Health, the Maryland Department of Health, and the Virginia Department of Health (VDH) all maintain completely different standards for mobile food units. From specific commissary agreements to required gray-water holding capacities and Ansul fire suppression systems, navigating these municipal codes can be a nightmare for first-time operators.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  As the most prolific food truck builder in the DMV region, Elite Steel Concepts engineers compliance into every square inch of your build. Because we are centrally located in Manassas, Virginia, we have extensive, hands-on experience navigating the permitting processes of Arlington County, Fairfax County, Montgomery County, and beyond.
                </p>
              </div>
              <div>
                <h3 className="text-2xl font-black text-black uppercase tracking-tight mb-4">
                  Uncompromising Fabrication Standards
                </h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Your food truck is a rolling commercial kitchen subjected to potholes, vibrations, extreme temperatures, and intense daily grease output. A cheap build will rapidly deteriorate, leading to catastrophic equipment failure, costly downtime, and failed health inspections. We refuse to compromise on material integrity.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Every Elite Steel Concepts build features 100% commercial-grade stainless steel interiors, diamond-plate aluminum flooring, NSF-certified plumbing, heavy-duty commercial hoods, and precision TIG/MIG welding. When you buy from ESC, you are investing in a vehicle designed to outlast your competition and maximize your daily revenue potential.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ─── FINAL CTA ─────────────────────────────────────────── */}
      <section className="bg-primary py-20">
        <Container>
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-white/70 mb-3">
                Don't see your city?
              </p>
              <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter leading-tight">
                We Still Build for You — Nationwide.
              </h2>
              <p className="text-white/80 mt-4 text-base leading-relaxed max-w-lg">
                Call us or request a free quote. We serve the entire DMV region
                and deliver across all 48 contiguous states.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 shrink-0">
              <a
                href="tel:+15716510337"
                id="cta-call-btn"
                className="inline-flex items-center gap-3 bg-black text-white hover:bg-white hover:text-black font-black uppercase tracking-wider text-sm px-8 py-4 transition-all whitespace-nowrap"
              >
                <Phone size={16} />
                Call Us Now
              </a>
              <Link
                href="/quote"
                id="cta-quote-btn"
                className="inline-flex items-center gap-3 border-2 border-black hover:bg-black hover:text-white text-black font-black uppercase tracking-wider text-sm px-8 py-4 transition-all whitespace-nowrap"
              >
                Get a Free Quote
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
