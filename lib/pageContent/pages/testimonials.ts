import { defineSection, type PageDef } from "../types";

export const TESTIMONIALS_HEADER = defineSection({
    key: "testimonials.header",
    label: "Page Header",
    description: "Dark banner at the top of the Testimonials page.",
    fields: [
        { name: "eyebrow", label: "Eyebrow", type: "text" },
        { name: "title", label: "Heading", type: "text" }
    ],
    defaults: {
        eyebrow: "Elite Steel Concepts",
        title: "Customer Testimonials"
    }
});

export const TESTIMONIALS_STATS = defineSection({
    key: "testimonials.stats",
    label: "Trust Stats",
    description: "\"Why Businesses Trust…\" heading and the four stat cards.",
    fields: [
        { name: "title", label: "Heading", type: "text" },
        {
            name: "stats",
            label: "Stat Cards",
            type: "list",
            itemLabel: "Stat",
            titleField: "label",
            help: "Icons are assigned in order: truck, calendar, shield, star.",
            fields: [
                { name: "value", label: "Value", type: "text" },
                { name: "label", label: "Label", type: "text" }
            ]
        }
    ],
    defaults: {
        title: "Why Businesses Trust Elite Steel Concepts For Custom Food Trucks & Trailer Builds",
        stats: [
            { value: "350+", label: "Trucks Built" },
            { value: "14+", label: "Years Experience" },
            { value: "100%", label: "Inspection Pass Rate" },
            { value: "4.9/5", label: "Average Rating" }
        ]
    }
});

export const TESTIMONIALS_FEATURED = defineSection({
    key: "testimonials.featured",
    label: "Featured Story",
    description: "Featured client quote (section currently hidden on the page; scanned for internal links).",
    fields: [
        { name: "text", label: "Story Quote", type: "textarea", rows: 4, help: "Internal-link keywords are linked automatically." }
    ],
    defaults: {
        text: "When I first came to Elite Steel Concepts, I had a vision but no idea about technical specs or flow. They took my menu and designed a kitchen that allows our team to serve 200 portions an hour without breaking a sweat."
    }
});

export const TESTIMONIALS_GRID = defineSection({
    key: "testimonials.grid",
    label: "Testimonials Grid",
    description: "Heading above the client testimonial cards (cards come from Admin → Testimonials).",
    fields: [
        { name: "title", label: "Heading", type: "text" },
        { name: "subtitle", label: "Subheading", type: "textarea", rows: 2 },
        { name: "emptyText", label: "Empty State Text", type: "text", help: "Shown when no testimonials are published." }
    ],
    defaults: {
        title: "Testimonials From Our Customers",
        subtitle: "See why entrepreneurs choose ECS as the best food truck and trailer builder in USA for custom builds.",
        emptyText: "Awaiting your success story."
    }
});

export const TESTIMONIALS_CTA = defineSection({
    key: "testimonials.cta",
    label: "Call to Action",
    description: "Dark call-to-action banner at the bottom of the page.",
    fields: [
        { name: "title", label: "Heading", type: "text" },
        { name: "subtitle", label: "Subheading", type: "textarea", rows: 2 },
        { name: "ctaText", label: "Button Text", type: "text" },
        { name: "ctaLink", label: "Button Link", type: "link" }
    ],
    defaults: {
        title: "Ready to Build Your Dream Food Truck & Trailer?",
        subtitle: "Tell us about your concept, and we’ll help you plan the right custom truck or trailer for your business.",
        ctaText: "Get a Free Quote",
        ctaLink: "/quote"
    }
});

export const testimonialsPage: PageDef = {
    id: "testimonials",
    label: "Testimonials",
    icon: "Star",
    path: "/testimonials",
    sections: [TESTIMONIALS_HEADER, TESTIMONIALS_STATS, TESTIMONIALS_FEATURED, TESTIMONIALS_GRID, TESTIMONIALS_CTA]
};
