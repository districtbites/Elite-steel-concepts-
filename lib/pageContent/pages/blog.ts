import { defineSection, type PageDef } from "../types";

export const BLOG_HEADER = defineSection({
    key: "blog.header",
    label: "Page Header",
    description: "Dark banner at the top of the blog listing.",
    fields: [
        { name: "eyebrow", label: "Eyebrow", type: "text" },
        { name: "title", label: "Heading", type: "text" },
        { name: "subtitle", label: "Subheading", type: "textarea", rows: 2 }
    ],
    defaults: {
        eyebrow: "Elite Steel Concepts",
        title: "Intelligence & Insights",
        subtitle: "Exclusive blueprints for success in the mobile kitchen industry. Expert analysis, maintenance guides, and entrepreneur success stories."
    }
});

export const BLOG_PROMO = defineSection({
    key: "blog.promo",
    label: "Sidebar Promo",
    description: "Orange promo card in the blog sidebar (Compliance Checklist).",
    fields: [
        { name: "title", label: "Heading", type: "text" },
        { name: "body", label: "Text", type: "textarea", rows: 2 },
        { name: "ctaText", label: "Button Text", type: "text" },
        { name: "link", label: "Card Link", type: "link" }
    ],
    defaults: {
        title: "Compliance Checklist",
        body: "See what your truck or trailer needs to pass fire and health inspections in VA, MD & DC.",
        ctaText: "View Requirements",
        link: "/compliance"
    }
});

export const BLOG_CTA = defineSection({
    key: "blog.cta",
    label: "Final Call to Action",
    description: "Dark \"Join the Elite Community\" banner at the bottom of the blog.",
    fields: [
        { name: "eyebrow", label: "Eyebrow", type: "text" },
        { name: "title", label: "Heading", type: "text" },
        { name: "titleHighlight", label: "Heading — Orange Line", type: "text" },
        { name: "body", label: "Text", type: "textarea", rows: 3 },
        { name: "ctaText", label: "Button Text", type: "text" },
        { name: "ctaLink", label: "Button Link", type: "link" }
    ],
    defaults: {
        eyebrow: "Got a Story?",
        title: "Join the",
        titleHighlight: "Elite Community",
        body: "We are always looking for culinary pioneers to feature in our success stories. If we built your truck, we want to share your journey.",
        ctaText: "Connect With Our Team",
        ctaLink: "/contact"
    }
});

export const blogPage: PageDef = {
    id: "blog",
    label: "Blog",
    icon: "FileText",
    path: "/blog",
    sections: [BLOG_HEADER, BLOG_PROMO, BLOG_CTA]
};
