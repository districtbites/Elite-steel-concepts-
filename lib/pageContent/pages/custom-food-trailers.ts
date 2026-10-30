import { defineSection, type PageDef } from "../types";

export const TRAILERS_HEADER = defineSection({
    key: "custom_food_trailers.header",
    label: "Page Header",
    description: "Dark banner at the top of the Custom Food Trailers page.",
    fields: [
        { name: "eyebrow", label: "Eyebrow", type: "text" },
        { name: "title", label: "Title", type: "text" },
        { name: "subtitle", label: "Subtitle", type: "textarea", rows: 2 }
    ],
    defaults: {
        eyebrow: "Food Trailer Services",
        title: "Custom Food Trailer",
        subtitle: "Get a custom food trailer that fits your business"
    }
});

export const TRAILERS_TYPES = defineSection({
    key: "custom_food_trailers.types",
    label: "Trailer Types",
    description: "Animated trailer cards (colors and icons follow the card order).",
    fields: [
        { name: "title", label: "Heading", type: "text" },
        { name: "types", label: "Trailer Types", type: "strings", itemLabel: "Type" }
    ],
    defaults: {
        title: "Custom Concession Trailer Types ESC Build",
        types: ["Coffee Trailer", "Dessert Trailer", "BBQ Trailer", "Pizza Trailer", "Halal Food Trailer", "Seafood Trailer"]
    }
});

export const TRAILERS_WHY = defineSection({
    key: "custom_food_trailers.why",
    label: "Why Choose ESC",
    description: "\"Why Entrepreneurs Pick\" heading, paragraph and numbered benefit tiles.",
    fields: [
        { name: "title", label: "Heading", type: "text" },
        { name: "body", label: "Paragraph", type: "textarea", rows: 4, help: "Use [link text](/url) to add a link." },
        { name: "points", label: "Benefit Tiles", type: "strings", itemLabel: "Benefit" }
    ],
    defaults: {
        title: "Why Entrepreneurs Pick Elite Steel Concepts for Custom Food Trailer Builder",
        body: "Elite Steel Concepts makes it simple to turn your idea into a real mobile kitchen. As [experienced concession trailer manufacturers](/), we create custom trailers customized to your menu, equipment, space, and brand, so your trailer works the way you need it to.",
        points: [
            "Custom & Professional Designs",
            "Quality Craftsmanship",
            "Built to Code",
            "8–12 Week Build Time",
            "1-Year Limited Electrical & Plumbing Warranty",
            "Shipping Across 48 States"
        ]
    }
});

export const TRAILERS_CTA = defineSection({
    key: "custom_food_trailers.cta",
    label: "Call to Action",
    description: "Dark \"Ready to Build\" banner after the benefits.",
    fields: [
        { name: "title", label: "Heading", type: "text" },
        { name: "body", label: "Paragraph", type: "textarea", rows: 3 },
        { name: "ctaText", label: "Button Text", type: "text" },
        { name: "ctaLink", label: "Button Link", type: "link" }
    ],
    defaults: {
        title: "Ready to Build Your Custom Food Trailer?",
        body: "Contact Elite Steel Concepts today to discuss your custom concession trailer project or request a free quote.",
        ctaText: "Get a Free Quote",
        ctaLink: "/quote"
    }
});

export const TRAILERS_INTRO = defineSection({
    key: "custom_food_trailers.intro",
    label: "Intro (Volume & Precision)",
    description: "Intro paragraph used by internal linking (its section is currently hidden on the page).",
    fields: [
        { name: "body", label: "Intro Paragraph", type: "textarea", rows: 5, help: "Internal-link keywords are linked automatically." }
    ],
    defaults: {
        body: "A custom concession trailer from Elite Steel Concepts offers the highest ROI in the mobile food industry. More square footage for equipment and staff, without the engine maintenance of a truck. Learn about our custom food truck conversions or request an itemized build quote."
    }
});

export const customFoodTrailersPage: PageDef = {
    id: "custom_food_trailers",
    label: "Custom Food Trailers",
    icon: "Caravan",
    path: "/services/custom-food-trailers",
    builder: true,
    sections: [TRAILERS_HEADER, TRAILERS_TYPES, TRAILERS_WHY, TRAILERS_CTA, TRAILERS_INTRO]
};
