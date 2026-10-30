import { defineSection, type PageDef } from "../types";

export const FLEET_HEADER = defineSection({
    key: "fleet_expansion.header",
    label: "Page Header",
    description: "Title and subtitle at the top of the page.",
    fields: [
        { name: "title", label: "Title", type: "text" },
        { name: "subtitle", label: "Subtitle", type: "textarea", rows: 2 }
    ],
    defaults: {
        title: "Fleet Expansion",
        subtitle: "Scaling your mobile food empire? We offer standardized build processes for multi-unit operators and franchises."
    }
});

export const FLEET_INTRO = defineSection({
    key: "fleet_expansion.intro",
    label: "Intro & Benefits",
    description: "\"Consistent Quality at Scale\" copy, benefit checklist and \"Perfect For\" list.",
    fields: [
        { name: "eyebrow", label: "Eyebrow", type: "text" },
        { name: "title", label: "Heading", type: "text" },
        { name: "body", label: "Intro Paragraph", type: "textarea", rows: 5, help: "Internal-link keywords are linked automatically." },
        { name: "benefits", label: "Benefits Checklist", type: "strings", itemLabel: "Benefit" },
        { name: "audienceTitle", label: "Audience Box Title", type: "text" },
        { name: "audience", label: "Audience List", type: "strings", itemLabel: "Audience" }
    ],
    defaults: {
        eyebrow: "Scale With Confidence",
        title: "Consistent Quality at Scale",
        body: "Whether you need 5 custom food trucks or 50 concession trailers, Elite Steel Concepts delivers identical build quality, equipment layouts, and nationwide compliance. Streamline your multi-unit mobile kitchen operations with a standardized fleet program.",
        benefits: [
            "Volume Pricing Available",
            "Dedicated Project Management",
            "Rapid Deployment Schedules",
            "Consistent Build Standards",
            "Fleet Maintenance Packages"
        ],
        audienceTitle: "Perfect For",
        audience: [
            "Restaurant Chains going Mobile",
            "Corporate Promotional Vehicles",
            "Franchise Operations",
            "University & Campus Dining",
            "Catering Companies Scaling Up"
        ]
    }
});

export const FLEET_CTA = defineSection({
    key: "fleet_expansion.cta",
    label: "Call to Action",
    description: "Dark banner at the bottom of the page.",
    fields: [
        { name: "title", label: "Title", type: "text" },
        { name: "subtitle", label: "Subtitle", type: "textarea", rows: 2 },
        { name: "buttonText", label: "Button Text", type: "text" },
        { name: "buttonLink", label: "Button Link", type: "link" }
    ],
    defaults: {
        title: "Discuss Fleet Options",
        subtitle: "Let's discuss your multi-unit needs. We offer dedicated project management for fleet builds.",
        buttonText: "Contact Us",
        buttonLink: "/contact"
    }
});

export const fleetExpansionPage: PageDef = {
    id: "fleet_expansion",
    label: "Fleet Expansion",
    icon: "Layers",
    path: "/services/fleet-expansion",
    builder: true,
    sections: [FLEET_HEADER, FLEET_INTRO, FLEET_CTA]
};
