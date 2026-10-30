import { defineSection, type PageDef } from "../types";

export const TERMS_HEADER = defineSection({
    key: "terms.header",
    label: "Page Header",
    description: "Dark banner at the top of the Terms of Service.",
    fields: [
        { name: "title", label: "Heading", type: "text" },
        { name: "subtitle", label: "Subheading", type: "text" }
    ],
    defaults: {
        title: "Legal Architecture",
        subtitle: "The legal terms and conditions for working with Elite Steel Concepts."
    },
    legacy: { seoPage: "terms", seoSection: "header", fields: { title: "title", subtitle: "subtitle" } }
});

export const TERMS_CONTENT = defineSection({
    key: "terms.content",
    label: "Main Terms Text",
    description: "Effective-date line, numbered heading and the main terms paragraph.",
    fields: [
        { name: "dateLabel", label: "Date Label", type: "text", help: "Today's date is shown after this label." },
        { name: "statusLabel", label: "Status Badge", type: "text" },
        { name: "title", label: "Heading", type: "text" },
        { name: "body", label: "Terms Text", type: "textarea", rows: 16 }
    ],
    defaults: {
        dateLabel: "Effective Agreement Date:",
        statusLabel: "Legally Binding",
        title: "Contractual Framework",
        body: "By accessing this environment, you are agreeing to be bound by these Terms of Service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws."
    },
    legacy: { seoPage: "terms", seoSection: "content", fields: { title: "title", body: "content" } }
});

export const TERMS_PILLARS = defineSection({
    key: "terms.pillars",
    label: "Key Terms Cards",
    description: "Grid of short term cards (Project Estimates, Use License…).",
    fields: [
        {
            name: "pillars",
            label: "Cards",
            type: "list",
            itemLabel: "Card",
            titleField: "title",
            fields: [
                { name: "title", label: "Title", type: "text" },
                { name: "description", label: "Text", type: "textarea", rows: 2 }
            ]
        }
    ],
    defaults: {
        pillars: [
            { title: "Project Estimates", description: "Quotes are preliminary and subject to final design specs, material costs, and labor shifts." },
            { title: "Use License", description: "Temporary viewing permission is granted for personal, non-commercial transitory use only." },
            { title: "Liability Shield", description: "Elite Steel Concepts is not liable for data loss or profit interruption during digital use." },
            { title: "Governing Law", description: "Agreement is governed by and construed in accordance with the laws of the Commonwealth of Virginia." }
        ]
    }
});

export const TERMS_STANDARDS = defineSection({
    key: "terms.standards",
    label: "Execution Standards",
    description: "Dark notice box below the term cards.",
    fields: [
        { name: "title", label: "Heading", type: "text" },
        { name: "body", label: "Text", type: "textarea", rows: 3 }
    ],
    defaults: {
        title: "Execution Standards",
        body: "Materials appearing on the website could include technical or photographic errors. We do not warrant that all site materials are accurate, complete or current. A formal signed contract is required for all physical fabrication starts."
    }
});

export const TERMS_INQUIRY = defineSection({
    key: "terms.inquiry",
    label: "Questions Box",
    description: "\"Questions regarding terms?\" block with the email button (email comes from Settings).",
    fields: [
        { name: "eyebrow", label: "Eyebrow", type: "text" },
        { name: "title", label: "Heading", type: "text" },
        { name: "body", label: "Text", type: "text" },
        { name: "ctaText", label: "Button Text", type: "text" }
    ],
    defaults: {
        eyebrow: "Inquiry Protocol",
        title: "Questions regarding terms?",
        body: "Professional inquiries regarding legal standing or project contracts.",
        ctaText: "Contact Legal Support"
    }
});

export const termsPage: PageDef = {
    id: "terms",
    label: "Terms of Service",
    icon: "Scale",
    path: "/terms",
    sections: [TERMS_HEADER, TERMS_CONTENT, TERMS_PILLARS, TERMS_STANDARDS, TERMS_INQUIRY]
};
