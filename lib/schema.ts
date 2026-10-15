import type { GlobalSettings } from "@/lib/db";

/**
 * Schema.org (JSON-LD) builders. The business is described once, site-wide, under
 * BUSINESS_ID; page-level schemas reference it by @id instead of repeating it.
 */

export const SITE_URL = "https://www.esteelconcepts.com";
export const BUSINESS_ID = `${SITE_URL}/#business`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
const BUSINESS_NAME = "Elite Steel Concepts";

/** Reference to the site-wide business, with its name inline so validators don't need to resolve the @id. */
export const businessRef = () => ({ "@type": "LocalBusiness", "@id": BUSINESS_ID, name: BUSINESS_NAME, url: SITE_URL });

export const absoluteUrl = (path: string) =>
  path.startsWith("http") ? path : `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`;

/** "Mar 3, 2026" → "2026-03-03" (Google rejects non-ISO dates). Undefined if unparseable. */
export function toIsoDate(date: string | undefined) {
  if (!date) return undefined;
  const d = new Date(date);
  if (isNaN(d.getTime())) return undefined;
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** "(571) 651-0337" → "+15716510337" */
function toE164(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return digits.length === 10 ? `+1${digits}` : `+${digits}`;
}

/** "11200 Bertalice Ct, Manassas, VA 20110" → PostalAddress */
function parseAddress(address: string) {
  const [street = address, city = "", stateZip = ""] = address.split(",").map((p) => p.trim());
  const [region = "", postalCode = ""] = stateZip.split(/\s+/);
  return {
    "@type": "PostalAddress",
    streetAddress: street,
    addressLocality: city,
    addressRegion: region,
    postalCode,
    addressCountry: "US",
  };
}

/** Business + website, rendered on every public page. */
export function siteSchema(settings: GlobalSettings, description: string) {
  const sameAs = [settings.facebook, settings.instagram, settings.twitter, settings.linkedin, settings.youtube]
    .filter((u): u is string => Boolean(u && u.startsWith("http")));

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["LocalBusiness", "Manufacturer"],
        "@id": BUSINESS_ID,
        name: BUSINESS_NAME,
        alternateName: "ESC",
        description,
        url: SITE_URL,
        logo: absoluteUrl(settings.logoUrl || "/logo.png"),
        image: absoluteUrl(settings.logoUrl || "/logo.png"),
        telephone: toE164(settings.phone),
        email: settings.email,
        address: parseAddress(settings.address),
        hasMap: settings.googleMapsLink || undefined,
        foundingDate: "2012",
        priceRange: "$$$",
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            opens: "09:00",
            closes: "17:00",
          },
        ],
        areaServed: [
          { "@type": "State", name: "Virginia" },
          { "@type": "State", name: "Maryland" },
          { "@type": "City", name: "Washington, DC" },
          { "@type": "Country", name: "United States" },
        ],
        knowsAbout: [
          "Custom food truck fabrication",
          "Concession trailer manufacturing",
          "Mobile kitchen design",
          "Food truck repairs and upgrades",
          "Food truck health code compliance",
        ],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Food Truck & Trailer Services",
          itemListElement: SERVICES.map((s) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: s.name, url: absoluteUrl(s.path) },
          })),
        },
        sameAs: sameAs.length ? sameAs : undefined,
      },
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        url: SITE_URL,
        name: BUSINESS_NAME,
        publisher: { "@id": BUSINESS_ID },
        inLanguage: "en-US",
      },
    ],
  };
}

export const SERVICES = [
  {
    path: "/services/custom-food-trucks",
    name: "Custom Food Truck Building",
    serviceType: "Custom food truck fabrication",
    description:
      "Custom food trucks built around your menu, equipment, layout, brand, and business needs, with durable construction and compliance-focused designs.",
  },
  {
    path: "/services/custom-food-trailers",
    name: "Custom Food Trailers & Concession Trailers",
    serviceType: "Concession trailer manufacturing",
    description:
      "Custom food trailers, concession trailers, and mobile kitchens designed around your menu, equipment, workflow, and business needs.",
  },
  {
    path: "/services/design-and-consultation",
    name: "Food Truck Design & Consultation",
    serviceType: "Mobile kitchen design consultation",
    description:
      "Kitchen layout planning, equipment selection, and compliance guidance for custom food trucks and trailers before fabrication begins.",
  },
  {
    path: "/services/repairs-and-upgrades",
    name: "Food Truck Repairs & Upgrades",
    serviceType: "Food truck repair and upgrade",
    description:
      "Repairs and upgrades for food trucks and trailers, including electrical, plumbing, ventilation, fire suppression, equipment, and interior work.",
  },
  {
    path: "/services/fleet-expansion",
    name: "Food Truck Fleet Expansion",
    serviceType: "Multi-unit food truck fabrication",
    description:
      "Consistent, multi-unit food truck and trailer builds for businesses expanding their mobile kitchen fleet.",
  },
] as const;

/** Service schema for one of the /services/* pages. */
export function serviceSchema(path: (typeof SERVICES)[number]["path"]) {
  const s = SERVICES.find((x) => x.path === path)!;
  const url = absoluteUrl(s.path);
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    name: s.name,
    serviceType: s.serviceType,
    description: s.description,
    url,
    provider: businessRef(),
    areaServed: { "@type": "Country", name: "United States" },
  };
}

/** Food truck building services offered in one city (location landing pages). */
export function cityServiceSchema(city: string, state: string, slug: string) {
  const url = absoluteUrl(`/locations/${slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    name: `Custom Food Trucks & Trailers in ${city}, ${state}`,
    serviceType: "Custom food truck and concession trailer fabrication",
    description: `Custom food truck and concession trailer builder serving ${city}, ${state}.`,
    url,
    provider: businessRef(),
    areaServed: {
      "@type": "City",
      name: city,
      containedInPlace: { "@type": "State", name: state },
    },
  };
}

export function faqSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      // Answers may carry markdown links — keep only the anchor text
      acceptedAnswer: { "@type": "Answer", text: f.answer.replace(/\[(.*?)\]\((.*?)\)/g, "$1") },
    })),
  };
}

const SEGMENT_NAMES: Record<string, string> = {
  about: "About Us",
  services: "Services",
  "custom-food-trucks": "Custom Food Trucks",
  "custom-food-trailers": "Custom Food Trailers",
  "design-and-consultation": "Design & Consultation",
  "repairs-and-upgrades": "Repairs & Upgrades",
  "fleet-expansion": "Fleet Expansion",
  compliance: "Compliance",
  contact: "Contact",
  locations: "Locations",
  portfolio: "Portfolio",
  process: "Our Process",
  quote: "Get a Quote",
  testimonials: "Testimonials",
  blog: "Blog",
  privacy: "Privacy Policy",
  terms: "Terms of Service",
};

/** "washington-dc" → "Washington Dc"; used for dynamic slugs (blog posts, projects, cities). */
const titleCase = (slug: string) =>
  decodeURIComponent(slug).replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

/** "/services/custom-food-trucks" → Home › Services › Custom Food Trucks */
export function breadcrumbsForPath(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  return [
    { name: "Home", path: "/" },
    ...segments.map((seg, i) => ({
      name: SEGMENT_NAMES[seg] || titleCase(seg),
      path: "/" + segments.slice(0, i + 1).join("/"),
    })),
  ];
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export const SERVICE_IDS: string[] = SERVICES.map((s) => s.path.replace("/services/", ""));

/** Public URL path for an SEO page id ("home" → "/", "location-x" → "/locations/x"). */
export function pagePath(pageId: string) {
  if (pageId === "home") return "/";
  if (pageId.startsWith("location-")) return `/locations/${pageId.slice("location-".length)}`;
  if (SERVICE_IDS.includes(pageId)) return `/services/${pageId}`;
  return `/${pageId}`;
}
