import { defineSection, type PageDef } from "../types";

const LINKED = "Internal-link keywords are linked automatically.";

export const COMPLIANCE_HERO = defineSection({
    key: "compliance.hero",
    label: "Hero",
    description: "Dark top banner: eyebrow, page heading, description and button.",
    fields: [
        { name: "eyebrow", label: "Eyebrow", type: "text" },
        { name: "title", label: "Heading (H1)", type: "text" },
        { name: "description", label: "Description", type: "textarea", rows: 4, help: LINKED },
        { name: "ctaText", label: "Button Text", type: "text" },
        { name: "ctaLink", label: "Button Link", type: "link" }
    ],
    defaults: {
        eyebrow: "Smart Compliance Planning",
        title: "Food Truck & Trailer Compliance & Custom Build Requirements",
        description: "Building a custom food truck or trailer requires more than installing kitchen equipment. Your mobile kitchen may need to meet applicable health, plumbing, electrical, sanitation, fire-safety, and local food-service requirements before it can operate.",
        ctaText: "Get a Free Quote",
        ctaLink: "/quote"
    }
});

export const COMPLIANCE_WHY = defineSection({
    key: "compliance.why",
    label: "Why Compliance Matters",
    description: "Heading and two paragraphs explaining why compliance matters.",
    fields: [
        { name: "title", label: "Heading", type: "text" },
        { name: "paragraph1", label: "Paragraph 1", type: "textarea", rows: 4, help: LINKED },
        { name: "paragraph2", label: "Paragraph 2", type: "textarea", rows: 4, help: LINKED }
    ],
    defaults: {
        title: "Why Food Truck Compliance Matters",
        paragraph1: "The right requirements start with the design compliance, which can affect almost every part of a mobile kitchen, from handwashing and dishwashing sinks to water systems, wastewater, equipment placement, food-preparation areas, and electrical systems.",
        paragraph2: "Understanding these requirements before fabrication can help you plan the right layout and avoid unnecessary design changes later. As a custom food truck builder, Elite Steel Concepts considers the requirements that may apply to your project based on your planned operation and location."
    }
});

export const COMPLIANCE_CONSIDERATIONS = defineSection({
    key: "compliance.considerations",
    label: "What ESC Considers",
    description: "Heading, intro and the four consideration items (icons and colours stay in order).",
    fields: [
        { name: "title", label: "Heading", type: "text" },
        { name: "intro", label: "Intro", type: "textarea", rows: 2 },
        {
            name: "items",
            label: "Items",
            type: "list",
            itemLabel: "Item",
            titleField: "title",
            fields: [
                { name: "title", label: "Title", type: "text" },
                { name: "desc", label: "Description", type: "textarea", rows: 3 }
            ]
        }
    ],
    defaults: {
        title: "What ESC Considers in Mobile Kitchen Compliances",
        intro: "We consider key health, safety, plumbing, electrical, and food-service requirements when designing your custom mobile kitchen.",
        items: [
            { title: "Plumbing & Water Systems", desc: "We plan water, sinks, wastewater, and related plumbing around the requirements of your mobile kitchen and intended food operation." },
            { title: "Electrical Systems", desc: "We plan your electrical layout and power needs around the equipment used in your mobile kitchen." },
            { title: "Ventilation & Exhaust", desc: "We consider your cooking equipment, menu, and kitchen layout when planning ventilation and exhaust." },
            { title: "Gas & Fire Safety Considerations", desc: "We consider gas systems, equipment placement, and applicable fire-safety requirements throughout the build." }
        ]
    }
});

export const COMPLIANCE_LOCATION = defineSection({
    key: "compliance.location",
    label: "Compliance Starts With Your Location",
    description: "Location heading, subtitle, two paragraphs and the region tiles.",
    fields: [
        { name: "title", label: "Heading", type: "text" },
        { name: "subtitle", label: "Subtitle", type: "text" },
        { name: "paragraph1", label: "Paragraph 1", type: "textarea", rows: 4, help: LINKED },
        { name: "paragraph2", label: "Paragraph 2", type: "textarea", rows: 5, help: LINKED },
        { name: "regions", label: "Region Tiles", type: "strings", itemLabel: "Region" }
    ],
    defaults: {
        title: "Food Truck Compliance Starts With Your Location",
        subtitle: "Different Locations, Different Requirements",
        paragraph1: "Custom food truck starts with knowing where you plan to operate. Health, safety, plumbing, fire, and mobile food requirements can vary between states, counties, cities, and local authorities.",
        paragraph2: "Your location, menu, equipment, and type of food operation can all affect the requirements that apply to your mobile kitchen. A food truck operating in Virginia may have different requirements from one operating in Maryland or Washington, DC. At Elite Steel Concepts, we build custom food trucks and trailers throughout the DMV region with applicable location-specific requirements in mind.",
        regions: ["Virginia", "Maryland", "Washington, DC"]
    }
});

export const COMPLIANCE_CHECKS = defineSection({
    key: "compliance.checks",
    label: "What ESC Checks Before Building",
    description: "Numbered pre-build check cards (icons stay in order).",
    fields: [
        { name: "title", label: "Heading", type: "text" },
        { name: "subtitle", label: "Subtitle", type: "text" },
        {
            name: "items",
            label: "Check Cards",
            type: "list",
            itemLabel: "Check",
            titleField: "title",
            fields: [
                { name: "title", label: "Title", type: "text" },
                { name: "desc", label: "Description", type: "textarea", rows: 3 }
            ]
        }
    ],
    defaults: {
        title: "What Elite Steel Concepts Checks Before Building Your Trailer",
        subtitle: "Key Details We Consider for Your Mobile Kitchen Compliance",
        items: [
            { title: "Your Menu", desc: "We review what you plan to cook and serve to understand the type of kitchen and food-preparation setup you need." },
            { title: "Your Equipment", desc: "We consider your cooking equipment, refrigeration, sinks, storage, and other essential systems when planning the kitchen layout." },
            { title: "Your Operating Location", desc: "We consider where you plan to operate because food truck regulations and health requirements can vary by state, county, and local authority." },
            { title: "Your Kitchen Workflow", desc: "We plan the layout around how your team will prepare, cook, store, and serve food inside the truck or trailer." },
            { title: "Applicable Requirements", desc: "We consider the relevant health, sanitation, plumbing, electrical, ventilation, and fire-safety requirements that may apply to your build." }
        ]
    }
});

export const COMPLIANCE_CTA = defineSection({
    key: "compliance.cta",
    label: "Call to Action",
    description: "Dark banner at the bottom of the page.",
    fields: [
        { name: "title", label: "Title", type: "text" },
        { name: "subtitle", label: "Subtitle", type: "textarea", rows: 2 },
        { name: "buttonText", label: "Button Text", type: "text" },
        { name: "buttonLink", label: "Button Link", type: "link" }
    ],
    defaults: {
        title: "Ready to Plan Your Build With the Right Compliance?",
        subtitle: "Build With Confidence. Start With Right Compliance.",
        buttonText: "Get a Free Quote",
        buttonLink: "/quote"
    }
});

export const compliancePage: PageDef = {
    id: "compliance",
    label: "Compliance",
    icon: "ShieldCheck",
    path: "/compliance",
    builder: true,
    sections: [COMPLIANCE_HERO, COMPLIANCE_WHY, COMPLIANCE_CONSIDERATIONS, COMPLIANCE_LOCATION, COMPLIANCE_CHECKS, COMPLIANCE_CTA]
};
