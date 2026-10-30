/**
 * Modular page builder blocks ("<page>.custom_sections").
 * Shared by the admin builder (fields + blueprints) and the public renderer.
 */
import type { FieldDef, ScalarFieldDef } from "./types";

export const BLOCK_TYPES = ["features", "stats", "split", "cta", "faqs", "testimonials", "hero_banner", "rich_text"] as const;
export type BlockType = (typeof BLOCK_TYPES)[number];

export type BlockTheme = "dark" | "light" | "muted";

export interface BlockItem {
    title?: string;
    description?: string;
    icon?: string;
    value?: string;
    label?: string;
    question?: string;
    answer?: string;
    quote?: string;
    author?: string;
    role?: string;
    rating?: number;
    text?: string;
}

export interface CustomBlock {
    id: string;
    type: BlockType;
    enabled: boolean;
    eyebrow: string;
    title: string;
    subtitle: string;
    body: string;
    imageUrl: string;
    imageAlt: string;
    imagePosition: "left" | "right";
    theme: BlockTheme;
    primaryCtaText: string;
    primaryCtaLink: string;
    secondaryCtaText: string;
    secondaryCtaLink: string;
    columns: 2 | 3 | 4;
    items: BlockItem[];
}

/** Icons an admin can pick for feature cards (resolved to lucide components on render). */
export const BLOCK_ICONS = [
    "Wrench", "Shield", "Truck", "Flame", "Zap", "Award", "CheckCircle2", "Clock", "Ruler",
    "Settings", "Users", "MapPin", "Star", "Hammer", "ChefHat", "Utensils", "Droplets", "Snowflake",
    "BadgeCheck", "DollarSign", "Phone", "Sparkles", "Package", "Layers"
] as const;

const ITEM_FIELDS: Partial<Record<BlockType, ScalarFieldDef[]>> = {
    features: [
        { name: "title", label: "Title", type: "text" },
        { name: "description", label: "Description", type: "textarea", rows: 2 },
        { name: "icon", label: "Icon", type: "text", help: `One of: ${BLOCK_ICONS.join(", ")}` }
    ],
    stats: [
        { name: "value", label: "Value", type: "text", placeholder: "350+" },
        { name: "label", label: "Label", type: "text" },
        { name: "description", label: "Description", type: "text" }
    ],
    faqs: [
        { name: "question", label: "Question", type: "text" },
        { name: "answer", label: "Answer", type: "textarea", rows: 3 }
    ],
    testimonials: [
        { name: "quote", label: "Quote", type: "textarea", rows: 3 },
        { name: "author", label: "Author", type: "text" },
        { name: "role", label: "Role / Company", type: "text" },
        { name: "rating", label: "Rating (1-5)", type: "number" }
    ],
    split: [{ name: "text", label: "Bullet", type: "text" }]
};

const ITEM_TITLE_FIELD: Partial<Record<BlockType, string>> = {
    features: "title", stats: "label", faqs: "question", testimonials: "author", split: "text"
};

const f = {
    eyebrow: { name: "eyebrow", label: "Eyebrow", type: "text", placeholder: "Small label above the title" },
    title: { name: "title", label: "Title", type: "text" },
    subtitle: { name: "subtitle", label: "Subtitle", type: "textarea", rows: 2 },
    body: { name: "body", label: "Body", type: "textarea", rows: 5 },
    imageUrl: { name: "imageUrl", label: "Image", type: "image" },
    imageAlt: { name: "imageAlt", label: "Image Alt Text", type: "text" },
    primaryCtaText: { name: "primaryCtaText", label: "Primary Button Text", type: "text" },
    primaryCtaLink: { name: "primaryCtaLink", label: "Primary Button Link", type: "link" },
    secondaryCtaText: { name: "secondaryCtaText", label: "Secondary Button Text", type: "text" },
    secondaryCtaLink: { name: "secondaryCtaLink", label: "Secondary Button Link", type: "link" }
} satisfies Record<string, ScalarFieldDef>;

const ctas = [f.primaryCtaText, f.primaryCtaLink, f.secondaryCtaText, f.secondaryCtaLink];

/** Content fields per block type (theme, columns, image position and enabled are separate controls). */
export function blockFields(type: BlockType): FieldDef[] {
    const items = (label: string): FieldDef[] =>
        ITEM_FIELDS[type]
            ? [{ name: "items", label, type: "list", itemLabel: label.replace(/s$/, ""), fields: ITEM_FIELDS[type]!, titleField: ITEM_TITLE_FIELD[type] }]
            : [];
    switch (type) {
        case "features": return [f.eyebrow, f.title, f.subtitle, ...items("Cards")];
        case "stats": return [f.eyebrow, f.title, ...items("Stats")];
        case "split": return [f.eyebrow, f.title, f.body, f.imageUrl, f.imageAlt, ...items("Bullets"), ...ctas];
        case "cta": return [f.eyebrow, f.title, f.subtitle, ...ctas];
        case "faqs": return [f.eyebrow, f.title, f.subtitle, ...items("Questions")];
        case "testimonials": return [f.eyebrow, f.title, ...items("Testimonials")];
        case "hero_banner": return [f.eyebrow, f.title, f.subtitle, f.imageUrl, f.imageAlt, ...ctas];
        case "rich_text": return [f.eyebrow, f.title, { ...f.body, label: "Body (text or basic HTML)", rows: 10, help: "Allowed: paragraphs, headings, bold/italic, lists, links. Scripts and styles are removed." }];
    }
}

/** Which layout controls apply to a type. */
export const BLOCK_LAYOUT: Record<BlockType, { columns?: boolean; imagePosition?: boolean }> = {
    features: { columns: true },
    stats: { columns: true },
    split: { imagePosition: true },
    cta: {},
    faqs: {},
    testimonials: { columns: true },
    hero_banner: {},
    rich_text: {}
};

export const EMPTY_BLOCK: Omit<CustomBlock, "id" | "type"> = {
    enabled: true,
    eyebrow: "",
    title: "",
    subtitle: "",
    body: "",
    imageUrl: "",
    imageAlt: "",
    imagePosition: "left",
    theme: "light",
    primaryCtaText: "",
    primaryCtaLink: "",
    secondaryCtaText: "",
    secondaryCtaLink: "",
    columns: 3,
    items: []
};

export interface Blueprint {
    type: BlockType;
    name: string;
    description: string;
    icon: string;
    sample: Partial<CustomBlock>;
}

export const BLUEPRINTS: Blueprint[] = [
    {
        type: "features",
        name: "Feature Cards",
        description: "Grid of cards with an icon, title and short description.",
        icon: "LayoutGrid",
        sample: {
            eyebrow: "Why ESC",
            title: "Built for Real Service",
            subtitle: "Every unit is engineered around your menu, workflow and local health code.",
            columns: 3,
            items: [
                { icon: "Wrench", title: "In-House Fabrication", description: "Welded, wired and plumbed in our Manassas, VA shop." },
                { icon: "Shield", title: "Code Compliant", description: "Designed to pass health and fire inspections the first time." },
                { icon: "Truck", title: "Nationwide Delivery", description: "Delivered ready to serve, anywhere in the country." }
            ]
        }
    },
    {
        type: "stats",
        name: "Stats Bar",
        description: "Row of big numbers with labels.",
        icon: "BarChart3",
        sample: {
            theme: "dark",
            columns: 4,
            items: [
                { value: "{experienceYears}+", label: "Years Experience", description: "Since 2012" },
                { value: "{trucksBuiltCount}+", label: "Custom Builds", description: "Trucks & Trailers" },
                { value: "100%", label: "Code Compliant", description: "First-Inspection Pass" },
                { value: "48", label: "States Served", description: "Nationwide Delivery" }
            ]
        }
    },
    {
        type: "split",
        name: "Image + Text",
        description: "Image on one side; text, bullets and buttons on the other.",
        icon: "Columns2",
        sample: {
            eyebrow: "Our Shop",
            title: "Engineered In-House, Start to Finish",
            body: "From the first floor-plan sketch to the final inspection, your build never leaves our hands.",
            imageUrl: "/concession-trailer.png",
            imageAlt: "Custom concession trailer",
            imagePosition: "left",
            items: [{ text: "Stainless steel interiors" }, { text: "NSF-certified equipment" }, { text: "Fire suppression ready" }],
            primaryCtaText: "Get a Free Quote",
            primaryCtaLink: "/quote",
            secondaryCtaText: "See Our Work",
            secondaryCtaLink: "/portfolio"
        }
    },
    {
        type: "cta",
        name: "Call to Action",
        description: "Bold banner with two buttons.",
        icon: "Megaphone",
        sample: {
            theme: "dark",
            title: "Ready to Start Your Build?",
            subtitle: "Tell us about your vision and we'll design the perfect mobile kitchen for your business.",
            primaryCtaText: "Get a Free Quote",
            primaryCtaLink: "/quote",
            secondaryCtaText: "Contact Us",
            secondaryCtaLink: "/contact"
        }
    },
    {
        type: "faqs",
        name: "FAQ Accordion",
        description: "Questions and answers (also added as FAQ structured data).",
        icon: "HelpCircle",
        sample: {
            theme: "muted",
            eyebrow: "FAQ",
            title: "Common Questions",
            items: [
                { question: "How long does a custom build take?", answer: "Most builds take 8–12 weeks depending on size and equipment." },
                { question: "Do you deliver outside Virginia?", answer: "Yes. We deliver nationwide." }
            ]
        }
    },
    {
        type: "testimonials",
        name: "Testimonials",
        description: "Quote cards with author and star rating.",
        icon: "Quote",
        sample: {
            eyebrow: "Client Stories",
            title: "What Our Clients Say",
            columns: 2,
            items: [
                { quote: "The attention to detail is unmatched. Every inch of the kitchen was built exactly to my specs.", author: "Client Name", role: "Business Name", rating: 5 }
            ]
        }
    },
    {
        type: "hero_banner",
        name: "Hero Banner",
        description: "Full-width banner with a background image.",
        icon: "Image",
        sample: {
            theme: "dark",
            eyebrow: "Elite Steel Concepts",
            title: "Your Mobile Kitchen, Built to Perform",
            subtitle: "Custom food trucks and concession trailers engineered for high-volume service.",
            imageUrl: "https://images.pexels.com/photos/2577274/pexels-photo-2577274.jpeg?auto=compress&cs=tinysrgb&w=1920",
            imageAlt: "Custom food truck",
            primaryCtaText: "Start Your Build",
            primaryCtaLink: "/quote"
        }
    },
    {
        type: "rich_text",
        name: "Rich Text",
        description: "Free-form text with headings, lists and links.",
        icon: "AlignLeft",
        sample: {
            title: "Section Title",
            body: "<p>Write your content here. You can use <strong>bold</strong>, lists and <a href=\"/quote\">links</a>.</p>"
        }
    }
];

export const newBlockId = () => `blk_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;

export function blockFromBlueprint(type: BlockType): CustomBlock {
    const bp = BLUEPRINTS.find(b => b.type === type);
    return { ...EMPTY_BLOCK, ...structuredClone(bp?.sample || {}), id: newBlockId(), type };
}

const str = (v: unknown, max = 5000) => (typeof v === "string" ? v.slice(0, max) : "");

/** Coerces untrusted input into a valid block list (unknown fields and invalid types are dropped). */
export function sanitizeBlocks(input: unknown): CustomBlock[] {
    if (!Array.isArray(input)) return [];
    return input.slice(0, 50).flatMap((raw): CustomBlock[] => {
        if (!raw || typeof raw !== "object") return [];
        const b = raw as Record<string, unknown>;
        if (!BLOCK_TYPES.includes(b.type as BlockType)) return [];
        const items = Array.isArray(b.items) ? b.items.slice(0, 40) : [];
        return [{
            id: str(b.id, 60) || newBlockId(),
            type: b.type as BlockType,
            enabled: b.enabled !== false,
            eyebrow: str(b.eyebrow, 200),
            title: str(b.title, 300),
            subtitle: str(b.subtitle, 1000),
            body: str(b.body, 50000),
            imageUrl: str(b.imageUrl, 2000),
            imageAlt: str(b.imageAlt, 300),
            imagePosition: b.imagePosition === "right" ? "right" : "left",
            theme: b.theme === "dark" || b.theme === "muted" ? b.theme : "light",
            primaryCtaText: str(b.primaryCtaText, 100),
            primaryCtaLink: str(b.primaryCtaLink, 2000),
            secondaryCtaText: str(b.secondaryCtaText, 100),
            secondaryCtaLink: str(b.secondaryCtaLink, 2000),
            columns: b.columns === 2 || b.columns === 4 ? b.columns : 3,
            items: items.flatMap((it): BlockItem[] => {
                if (!it || typeof it !== "object") return [];
                const i = it as Record<string, unknown>;
                const out: BlockItem = {};
                for (const k of ["title", "description", "icon", "value", "label", "question", "answer", "quote", "author", "role", "text"] as const) {
                    if (typeof i[k] === "string") out[k] = str(i[k], 5000);
                }
                if (i.rating !== undefined && i.rating !== "") {
                    const r = Math.round(Number(i.rating));
                    if (Number.isFinite(r)) out.rating = Math.min(5, Math.max(1, r));
                }
                return [out];
            })
        }];
    });
}
