import { getPageSEO, getFAQs, getLocationBySlug, getSettings, getSEO } from "@/lib/db";
import {
  SERVICES,
  serviceSchema,
  cityServiceSchema,
  faqSchema,
  siteSchema,
  breadcrumbSchema,
  breadcrumbsForPath,
  pagePath,
  SERVICE_IDS,
} from "@/lib/schema";
import { TRUCK_FAQS, TRAILER_FAQS } from "@/lib/serviceFaqs";
import { checkSchemaJson, dedupeSchemas, type Schema } from "@/lib/schemaValidation";

/**
 * Page JSON-LD. Each page's schema is stored in the database
 * (seo.pages[id].structuredData) and edited in the admin SEO manager.
 * Pages with nothing saved yet fall back to the generated schema below,
 * which is also what the admin "Generate" button fills the editor with.
 */

export { pagePath };

/** Schema built from the site's current content for one page. */
export async function generatePageSchemas(pageId: string): Promise<Schema[]> {
  const out: Schema[] = [];
  const path = pagePath(pageId);
  const faqBlock = (faqs: { question: string; answer: string }[]) => {
    if (faqs.length > 0) out.push(faqSchema(faqs));
  };

  if (pageId === "home") {
    // The business + website entity lives on the homepage only
    const [settings, seo] = await Promise.all([getSettings(), getSEO()]);
    out.push(siteSchema(settings, seo.description));
  } else {
    out.push(breadcrumbSchema(breadcrumbsForPath(path)));
  }

  if (SERVICE_IDS.includes(pageId)) {
    out.push(serviceSchema(path as (typeof SERVICES)[number]["path"]));
    if (pageId === "custom-food-trucks") faqBlock(TRUCK_FAQS);
    if (pageId === "custom-food-trailers") faqBlock(TRAILER_FAQS);
  } else if (pageId.startsWith("location-")) {
    const location = await getLocationBySlug(pageId.slice("location-".length));
    if (location) {
      out.push(cityServiceSchema(location.city, location.state, location.slug));
      faqBlock(location.faq || []);
    }
  } else if (["home", "services", "locations"].includes(pageId)) {
    // Must match the FAQ list each page passes to a visible <FAQSection>
    // (portfolio's FAQ section is currently hidden, so it gets no FAQ schema)
    const faqs = await getFAQs();
    faqBlock(pageId === "home" ? faqs.slice(0, 5) : faqs);
  }
  return out;
}

/** What a page renders: its saved schema (de-duplicated), or the generated one if nothing valid is saved. */
export async function getPageSchemas(pageId: string): Promise<Schema[]> {
  const pageSeo = await getPageSEO(pageId);
  const saved = checkSchemaJson(pageSeo.structuredData || "");
  if (saved.schemas.length > 0) return saved.schemas;
  return dedupeSchemas(await generatePageSchemas(pageId)).schemas;
}
