import { defineSection, type PageDef } from "../types";

export const QUOTE_HEADER = defineSection({
    key: "quote.header",
    label: "Page Header",
    description: "Dark banner with heading, intro line and trust badges above the quote form.",
    fields: [
        { name: "eyebrow", label: "Eyebrow", type: "text" },
        { name: "title", label: "Heading", type: "text" },
        { name: "subtitle", label: "Intro", type: "text", help: "Use [link text](/url) for a link." },
        { name: "badges", label: "Trust Badges", type: "strings", itemLabel: "Badge", help: "Icons are assigned in order: calendar, award, map pin, shield." }
    ],
    defaults: {
        eyebrow: "Elite Steel Concepts",
        title: "Get Your Free Food Truck & Trailer Quote",
        subtitle: "Start Your Build With [Trusted Custom Food Truck & Trailer Builders](/)!",
        badges: ["14+ Years Experience", "350+ Custom Builds", "Delivered to 48 States", "Health Code Focused"]
    }
});

export const QUOTE_SUPPORT = defineSection({
    key: "quote.support",
    label: "Support Banner",
    description: "Orange \"Need Technical Assistance?\" banner below the form.",
    fields: [
        { name: "title", label: "Heading", type: "text" },
        { name: "body", label: "Text", type: "text" },
        { name: "ctaText", label: "Button Text", type: "text" },
        { name: "ctaLink", label: "Button Link", type: "link" }
    ],
    defaults: {
        title: "Need Technical Assistance?",
        body: "Skip the form and talk to a master fabricator today.",
        ctaText: "Schedule Consultation",
        ctaLink: "/contact"
    }
});

export const quotePage: PageDef = {
    id: "quote",
    label: "Quote",
    icon: "ClipboardList",
    path: "/quote",
    sections: [QUOTE_HEADER, QUOTE_SUPPORT]
};
