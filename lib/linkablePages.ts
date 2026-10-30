import {
    getLocations,
    getLocationBySlug,
    getTestimonials,
    getInternalLinkRules,
    getInternalLinkSettings
} from "./db";
import { autoLinkSections, getRulesForPage } from "./internalLinks";
import { getSection, getSections } from "./pageContent";
import { SERVICES_INTRO } from "./pageContent/pages/services";
import { TRUCKS_INTRO } from "./pageContent/pages/custom-food-trucks";
import { TRAILERS_INTRO } from "./pageContent/pages/custom-food-trailers";
import { TESTIMONIALS_FEATURED } from "./pageContent/pages/testimonials";
import { FLEET_INTRO } from "./pageContent/pages/fleet-expansion";
import { COMPLIANCE_HERO, COMPLIANCE_WHY, COMPLIANCE_LOCATION } from "./pageContent/pages/compliance";
import { HOME_INTRO, HOME_LOCAL_COVERAGE } from "./pageContent/pages/home";

/**
 * Registry of static pages whose copy is auto-linked.
 *
 * Every page lists its linkable sections in render order. Public pages read their copy from here
 * (via getLinkedPageSections) and the admin occurrence picker scans the very same text, so
 * "occurrence #2 in section X" always points at the same words on the live page.
 *
 * To make a new page linkable: add a definition here, then render
 * `(await getLinkedPageSections(key)).<sectionId>` with <AutoLinkedText /> in the page.
 */

export interface LinkableSection {
    id: string;
    label: string;
    text: string;
}

export interface LinkablePage {
    key: string;
    name: string;
    url: string;
    group: string;
}

interface PageDefinition extends LinkablePage {
    getSections: () => Promise<LinkableSection[]>;
}

// Strip quote marks some stored testimonials carry around their text
export const cleanTestimonialText = (text: string) => text.trim().replace(/^["“”]+|["“”]+$/g, "");

const STATIC_PAGES: PageDefinition[] = [
    {
        key: "home",
        name: "Homepage",
        url: "/",
        group: "Core",
        getSections: async () => {
            // Copy is edited in Admin → Page Content (falls back to the defaults in lib/pageContent)
            const [intro, coverage] = await getSections([HOME_INTRO, HOME_LOCAL_COVERAGE] as const);
            return [
                { id: "intro", label: "Intro", text: intro.body },
                { id: "localcoverage", label: "Local Coverage", text: coverage.body }
            ];
        }
    },
    {
        key: "services",
        name: "All Services",
        url: "/services",
        group: "Services",
        getSections: async () => {
            const intro = await getSection(SERVICES_INTRO);
            return [{ id: "intro", label: "Intro", text: intro.body }];
        }
    },
    {
        key: "custom-food-trucks",
        name: "Custom Food Trucks",
        url: "/services/custom-food-trucks",
        group: "Services",
        getSections: async () => {
            const intro = await getSection(TRUCKS_INTRO);
            return [{ id: "intro", label: "Intro", text: intro.body }];
        }
    },
    {
        key: "custom-food-trailers",
        name: "Custom Food Trailers",
        url: "/services/custom-food-trailers",
        group: "Services",
        getSections: async () => {
            const intro = await getSection(TRAILERS_INTRO);
            return [{ id: "intro", label: "Intro", text: intro.body }];
        }
    },
    {
        key: "fleet-expansion",
        name: "Fleet Expansion",
        url: "/services/fleet-expansion",
        group: "Services",
        getSections: async () => {
            const intro = await getSection(FLEET_INTRO);
            return [{ id: "intro", label: "Intro", text: intro.body }];
        }
    },
    {
        key: "compliance",
        name: "Compliance Hub",
        url: "/compliance",
        group: "Authority",
        getSections: async () => {
            const [hero, why, location] = await getSections([COMPLIANCE_HERO, COMPLIANCE_WHY, COMPLIANCE_LOCATION] as const);
            return [
                { id: "hero", label: "Hero Description", text: hero.description },
                { id: "why-1", label: "Why It Matters (paragraph 1)", text: why.paragraph1 },
                { id: "why-2", label: "Why It Matters (paragraph 2)", text: why.paragraph2 },
                { id: "location-1", label: "Location Requirements (paragraph 1)", text: location.paragraph1 },
                { id: "location-2", label: "Location Requirements (paragraph 2)", text: location.paragraph2 }
            ];
        }
    },
    {
        key: "testimonials",
        name: "Testimonials",
        url: "/testimonials",
        group: "Authority",
        getSections: async () => {
            const testimonials = await getTestimonials();
            return [
                { id: "featured", label: "Featured Story", text: (await getSection(TESTIMONIALS_FEATURED)).text },
                ...testimonials.map(t => ({
                    id: `t-${t.id}`,
                    label: `Testimonial: ${t.clientName}`,
                    text: cleanTestimonialText(t.content || "")
                }))
            ];
        }
    }
];

type LocationRecord = NonNullable<Awaited<ReturnType<typeof getLocationBySlug>>>;

const locationKey = (slug: string) => `location:${slug}`;

function locationSections(location: LocationRecord): LinkableSection[] {
    const { city, state } = location;
    return [
        {
            id: "market-1",
            label: "Market Overview (paragraph 1)",
            text: `The demand for high-quality, diverse street food and mobile catering in ${city}, ${state} has never been higher. However, breaking into this lucrative market requires more than just culinary skill; it demands a mobile kitchen that can handle relentless volume, extreme weather conditions, and strict municipal health codes.`
        },
        {
            id: "market-2",
            label: "Market Overview (paragraph 2)",
            text: `At Elite Steel Concepts, we specialize in engineering heavy-duty, high-throughput food trucks and concession trailers specifically tailored for the ${city} demographic. Unlike generic out-of-state manufacturers who deliver non-compliant boxes, our proximity allows us to guarantee that your build will pass local ${state} health and fire inspections with zero friction.`
        },
        {
            id: "market-3",
            label: "Market Overview (paragraph 3)",
            text: `Whether your strategy involves parking near bustling downtown office districts for the lunch rush, partnering with local breweries, or scaling a fleet for massive weekend festivals, your vehicle is the backbone of your revenue. We utilize premium, heavy-gauge stainless steel, NSF-certified equipment, and ergonomic layout designs to ensure your kitchen operates at peak efficiency during the busiest rushes ${city} has to offer.`
        },
        { id: "why-esc", label: "Why Elite Steel Concepts", text: location.whyEsc || "" }
    ];
}

/** Every linkable static page (for the admin page picker). */
export async function listLinkablePages(): Promise<LinkablePage[]> {
    const locations = await getLocations();
    return [
        ...STATIC_PAGES.map(({ key, name, url, group }) => ({ key, name, url, group })),
        ...locations.map(l => ({
            key: locationKey(l.slug),
            name: `${l.city}, ${l.state}`,
            url: `/locations/${l.slug}`,
            group: "Locations"
        }))
    ];
}

/** Raw (unlinked) sections of a page, in render order. */
export async function getPageSections(key: string): Promise<LinkableSection[] | null> {
    if (key.startsWith("location:")) {
        const location = await getLocationBySlug(key.slice("location:".length));
        return location ? locationSections(location) : null;
    }
    const page = STATIC_PAGES.find(p => p.key === key);
    return page ? page.getSections() : null;
}

/**
 * Linked copy of every section on a page, keyed by section id.
 * Applies only rules allowed on this page, honours pinned placements,
 * and enforces link limits across the whole page.
 */
export async function getLinkedPageSections(key: string): Promise<Record<string, string>> {
    const [sections, rules, settings] = await Promise.all([
        getPageSections(key),
        getInternalLinkRules(),
        getInternalLinkSettings()
    ]);
    if (!sections) return {};
    return autoLinkSections(sections, getRulesForPage(rules, key), settings, key);
}
