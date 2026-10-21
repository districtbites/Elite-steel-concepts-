import {
    getPageSEO,
    getLocations,
    getLocationBySlug,
    getTestimonials,
    getInternalLinkRules,
    getInternalLinkSettings
} from "./db";
import { autoLinkSections, getRulesForPage } from "./internalLinks";

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

export const FEATURED_TESTIMONIAL_TEXT =
    "When I first came to Elite Steel Concepts, I had a vision but no idea about technical specs or flow. They took my menu and designed a kitchen that allows our team to serve 200 portions an hour without breaking a sweat.";

const STATIC_PAGES: PageDefinition[] = [
    {
        key: "home",
        name: "Homepage",
        url: "/",
        group: "Core",
        getSections: async () => {
            const sections = (await getPageSEO("home"))?.sections || {};
            return [
                {
                    id: "intro",
                    label: "Intro",
                    text:
                        sections.intro?.content ||
                        "We are experienced custom food truck builders creating food trucks, food trailers, and mobile kitchens for businesses of all kinds. As a trusted food truck manufacturer, we build each unit around your menu, equipment, space, and workflow. From a custom food trailer to a complete mobile kitchen, we help turn your idea into a practical, professional setup ready for your food business."
                },
                {
                    id: "localcoverage",
                    label: "Local Coverage",
                    text:
                        sections.localcoverage?.content ||
                        "Based in Manassas, Virginia, Elite Steel Concepts serves the entire Washington DC metropolitan area including Northern Virginia, Maryland, and the greater Mid-Atlantic region. Our custom food trucks, concession trailers, and mobile kitchens have been delivered to entrepreneurs across 48 states."
                }
            ];
        }
    },
    {
        key: "services",
        name: "All Services",
        url: "/services",
        group: "Services",
        getSections: async () => {
            const sections = (await getPageSEO("services"))?.sections || {};
            return [
                {
                    id: "intro",
                    label: "Intro",
                    text:
                        typeof sections.intro?.content === "string"
                            ? sections.intro.content
                            : "At Elite Steel Concepts, we don't just build boxes with kitchens. We engineer high-performance commercial environments designed to maximize flow, sanitation, and safety while projecting a premium brand image."
                }
            ];
        }
    },
    {
        key: "custom-food-trucks",
        name: "Custom Food Trucks",
        url: "/services/custom-food-trucks",
        group: "Services",
        getSections: async () => [
            {
                id: "intro",
                label: "Intro",
                text: "A custom food truck from Elite Steel Concepts is a precision tool. We focus on commercial kitchen design, ergonomic safety, and health code compliance. Every weld and every corner is designed to withstand the rigors of 24/7 commercial operation. You can also explore our custom concession trailers or request a custom quote."
            }
        ]
    },
    {
        key: "custom-food-trailers",
        name: "Custom Food Trailers",
        url: "/services/custom-food-trailers",
        group: "Services",
        getSections: async () => [
            {
                id: "intro",
                label: "Intro",
                text: "A custom concession trailer from Elite Steel Concepts offers the highest ROI in the mobile food industry. More square footage for equipment and staff, without the engine maintenance of a truck. Learn about our custom food truck conversions or request an itemized build quote."
            }
        ]
    },
    {
        key: "fleet-expansion",
        name: "Fleet Expansion",
        url: "/services/fleet-expansion",
        group: "Services",
        getSections: async () => [
            {
                id: "intro",
                label: "Intro",
                text: "Whether you need 5 custom food trucks or 50 concession trailers, Elite Steel Concepts delivers identical build quality, equipment layouts, and nationwide compliance. Streamline your multi-unit mobile kitchen operations with a standardized fleet program."
            }
        ]
    },
    {
        key: "compliance",
        name: "Compliance Hub",
        url: "/compliance",
        group: "Authority",
        getSections: async () => [
            {
                id: "hero",
                label: "Hero Description",
                text: "Building a custom food truck or trailer requires more than installing kitchen equipment. Your mobile kitchen may need to meet applicable health, plumbing, electrical, sanitation, fire-safety, and local food-service requirements before it can operate."
            },
            {
                id: "why-1",
                label: "Why It Matters (paragraph 1)",
                text: "The right requirements start with the design compliance, which can affect almost every part of a mobile kitchen, from handwashing and dishwashing sinks to water systems, wastewater, equipment placement, food-preparation areas, and electrical systems."
            },
            {
                id: "why-2",
                label: "Why It Matters (paragraph 2)",
                text: "Understanding these requirements before fabrication can help you plan the right layout and avoid unnecessary design changes later. As a custom food truck builder, Elite Steel Concepts considers the requirements that may apply to your project based on your planned operation and location."
            },
            {
                id: "location-1",
                label: "Location Requirements (paragraph 1)",
                text: "Custom food truck starts with knowing where you plan to operate. Health, safety, plumbing, fire, and mobile food requirements can vary between states, counties, cities, and local authorities."
            },
            {
                id: "location-2",
                label: "Location Requirements (paragraph 2)",
                text: "Your location, menu, equipment, and type of food operation can all affect the requirements that apply to your mobile kitchen. A food truck operating in Virginia may have different requirements from one operating in Maryland or Washington, DC. At Elite Steel Concepts, we build custom food trucks and trailers throughout the DMV region with applicable location-specific requirements in mind."
            }
        ]
    },
    {
        key: "testimonials",
        name: "Testimonials",
        url: "/testimonials",
        group: "Authority",
        getSections: async () => {
            const testimonials = await getTestimonials();
            return [
                { id: "featured", label: "Featured Story", text: FEATURED_TESTIMONIAL_TEXT },
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
