import { defineSection, type PageDef } from "../types";

export const SERVICES_HEADER = defineSection({
    key: "services.header",
    label: "Page Header",
    description: "Dark banner at the top of the Services page.",
    fields: [
        { name: "eyebrow", label: "Eyebrow", type: "text" },
        { name: "title", label: "Title", type: "text" },
        { name: "subtitle", label: "Subtitle", type: "textarea", rows: 2 }
    ],
    defaults: {
        eyebrow: "ECS Services",
        title: "Expert Food Truck, Food Trailer & Mobile Kitchen Services Nationwide",
        subtitle: "We build custom food trucks and trailers designed around your menu, equipment, and business goals."
    }
});

export const SERVICES_MANUFACTURE = defineSection({
    key: "services.manufacture",
    label: "What We Manufacture",
    description: "Truck / Trailer image cards linking to the service pages.",
    fields: [
        { name: "eyebrow", label: "Eyebrow", type: "text" },
        {
            name: "cards",
            label: "Cards",
            type: "list",
            itemLabel: "Card",
            titleField: "title",
            fields: [
                { name: "title", label: "Title", type: "text" },
                { name: "link", label: "Link", type: "link" },
                { name: "image", label: "Image", type: "image" },
                { name: "imageAlt", label: "Image Alt Text", type: "text" }
            ]
        }
    ],
    defaults: {
        eyebrow: "What We Manufacture",
        cards: [
            {
                title: "Truck",
                link: "/services/custom-food-trucks",
                image: "/uploads/about/about-manufacture-truck.jpg",
                imageAlt: "Custom white food truck built by Elite Steel Concepts"
            },
            {
                title: "Trailer",
                link: "/services/custom-food-trailers",
                image: "/uploads/about/about-manufacture-trailer.jpg",
                imageAlt: "Custom black and yellow concession trailer by Elite Steel Concepts"
            }
        ]
    }
});

export const SERVICES_INTRO = defineSection({
    key: "services.intro",
    label: "Intro",
    description: "\"Precision Builds\" heading, intro paragraph and quote button (image is set in Media Library).",
    fields: [
        { name: "eyebrow", label: "Eyebrow", type: "text" },
        { name: "title", label: "Heading", type: "text" },
        { name: "body", label: "Intro Paragraph", type: "textarea", rows: 5, help: "Internal-link keywords are linked automatically." },
        { name: "ctaText", label: "Button Text", type: "text" },
        { name: "ctaLink", label: "Button Link", type: "link" }
    ],
    defaults: {
        eyebrow: "Precision Builds",
        title: "Industry Leading Mobile Kitchen",
        body: "At Elite Steel Concepts, we don't just build boxes with kitchens. We engineer high-performance commercial environments designed to maximize flow, sanitation, and safety while projecting a premium brand image.",
        ctaText: "Get a Free Quote",
        ctaLink: "/quote"
    },
    legacy: { seoPage: "services", seoSection: "intro", fields: { eyebrow: "subtitle", title: "title", body: "content" } }
});

export const SERVICES_MAIN = defineSection({
    key: "services.main",
    label: "Main Services",
    description: "Service blocks with heading, description and button (images are set in Media Library).",
    fields: [
        {
            name: "services",
            label: "Services",
            type: "list",
            itemLabel: "Service",
            titleField: "title",
            fields: [
                { name: "title", label: "Title", type: "text" },
                { name: "description", label: "Description", type: "textarea", rows: 4 },
                { name: "ctaText", label: "Button Text", type: "text" },
                { name: "ctaLink", label: "Button Link", type: "link" }
            ]
        }
    ],
    defaults: {
        services: [
            {
                // non-breaking space keeps "Mobile Kitchens" on one line
                title: "Custom Food Trailers, Concession Trailers & Mobile Kitchens Services",
                description:
                    "At ESC, we build custom food trailers, concession trailers, and mobile kitchens designed around your menu, equipment, workflow, and business needs, with durable construction, practical layouts, quality materials, and compliance-focused designs.",
                ctaText: "Get a Free Quote",
                ctaLink: "/quote"
            }
        ]
    }
});

export const SERVICES_PROCESS = defineSection({
    key: "services.process",
    label: "Building Process",
    description: "\"ECS Building Process\" heading, intro, button and step tiles.",
    fields: [
        { name: "title", label: "Heading", type: "text" },
        { name: "body", label: "Intro", type: "textarea", rows: 3 },
        { name: "ctaText", label: "Button Text", type: "text" },
        { name: "ctaLink", label: "Button Link", type: "link" },
        {
            name: "steps",
            label: "Steps",
            type: "list",
            itemLabel: "Step",
            titleField: "title",
            fields: [
                { name: "step", label: "Number", type: "text" },
                { name: "title", label: "Title", type: "text" }
            ]
        }
    ],
    defaults: {
        title: "ECS Building Process",
        body: "At ESC, we work with you from the first idea to the final handover, keeping every step clear and focused on your food business needs.",
        ctaText: "Talk to Our Team",
        ctaLink: "/contact",
        steps: [
            { step: "01", title: "Consult" },
            { step: "02", title: "Design" },
            { step: "03", title: "Build" },
            { step: "04", title: "Keys" }
        ]
    }
});

export const SERVICES_CTA = defineSection({
    key: "services.cta",
    label: "Final CTA",
    description: "Dark call-to-action banner at the bottom of the page.",
    fields: [
        { name: "title", label: "Heading", type: "text" },
        { name: "primaryCtaText", label: "Primary Button Text", type: "text" },
        { name: "primaryCtaLink", label: "Primary Button Link", type: "link" },
        { name: "secondaryCtaText", label: "Secondary Button Text", type: "text" },
        { name: "secondaryCtaLink", label: "Secondary Button Link", type: "link" }
    ],
    defaults: {
        title: "Ready to Build Your Custom Food Truck?",
        primaryCtaText: "Get a Free Quote",
        primaryCtaLink: "/quote",
        secondaryCtaText: "View Our Work",
        secondaryCtaLink: "/portfolio"
    }
});

export const servicesPage: PageDef = {
    id: "services",
    label: "Services",
    icon: "Wrench",
    path: "/services",
    builder: true,
    sections: [SERVICES_HEADER, SERVICES_MANUFACTURE, SERVICES_INTRO, SERVICES_MAIN, SERVICES_PROCESS, SERVICES_CTA]
};
