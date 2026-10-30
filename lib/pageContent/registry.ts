/**
 * Catalogue of every editable page and section (admin sidebar order).
 * Each page's sections and their default copy live in ./pages/<page>.ts.
 */
import type { PageDef, SectionDef } from "./types";
import { CUSTOM_SECTIONS } from "./types";
import { sitePage } from "./pages/site";
import { homePage } from "./pages/home";
import { aboutPage } from "./pages/about";
import { servicesPage } from "./pages/services";
import { customFoodTrucksPage } from "./pages/custom-food-trucks";
import { customFoodTrailersPage } from "./pages/custom-food-trailers";
import { fleetExpansionPage } from "./pages/fleet-expansion";
import { designAndConsultationPage } from "./pages/design-and-consultation";
import { repairsAndUpgradesPage } from "./pages/repairs-and-upgrades";
import { processPage } from "./pages/process";
import { compliancePage } from "./pages/compliance";
import { testimonialsPage } from "./pages/testimonials";
import { portfolioPage } from "./pages/portfolio";
import { locationsPage } from "./pages/locations";
import { blogPage } from "./pages/blog";
import { contactPage } from "./pages/contact";
import { quotePage } from "./pages/quote";
import { privacyPage } from "./pages/privacy";
import { termsPage } from "./pages/terms";

export const PAGES: PageDef[] = [
    sitePage,
    homePage,
    aboutPage,
    servicesPage,
    customFoodTrucksPage,
    customFoodTrailersPage,
    fleetExpansionPage,
    designAndConsultationPage,
    repairsAndUpgradesPage,
    processPage,
    compliancePage,
    testimonialsPage,
    portfolioPage,
    locationsPage,
    blogPage,
    contactPage,
    quotePage,
    privacyPage,
    termsPage
];

const SECTIONS = new Map<string, SectionDef>(PAGES.flatMap(p => p.sections.map(s => [s.key, s] as const)));

export const getSectionDef = (key: string) => SECTIONS.get(key);
export const getPageDef = (pageId: string) => PAGES.find(p => p.id === pageId);

/** True when the key is a builder key ("<page>.custom_sections") of a builder-enabled page. */
export function isCustomSectionsKey(key: string): boolean {
    const [pageId, section] = key.split(".");
    return section === CUSTOM_SECTIONS && !!getPageDef(pageId)?.builder;
}
