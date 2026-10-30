import { defineSection, type PageDef } from "../types";

export const PORTFOLIO_HEADER = defineSection({
    key: "portfolio.header",
    label: "Page Header",
    description: "Dark banner with heading, intro line and quote button.",
    fields: [
        { name: "eyebrow", label: "Eyebrow", type: "text" },
        { name: "title", label: "Heading", type: "text" },
        { name: "subtitle", label: "Intro", type: "textarea", rows: 3, help: "Use [link text](/url) for a link." },
        { name: "ctaText", label: "Button Text", type: "text" },
        { name: "ctaLink", label: "Button Link", type: "link" }
    ],
    defaults: {
        eyebrow: "Portfolio of ECS",
        title: "Elite Steel Concepts Work Portfolio",
        subtitle: "Take a look at our completed custom food truck and trailer projects, built by an experienced [custom food truck builder](/) and designed around each business’s unique needs.",
        ctaText: "Get a Free Quote",
        ctaLink: "/quote"
    }
});

export const PORTFOLIO_GALLERY = defineSection({
    key: "portfolio.gallery",
    label: "Gallery Intro",
    description: "\"Our Diverse Fleet\" heading above the project gallery (projects come from Admin → Portfolio).",
    fields: [
        { name: "title", label: "Heading", type: "text" },
        { name: "body", label: "Intro", type: "textarea", rows: 3 }
    ],
    defaults: {
        title: "Our Diverse Fleet",
        body: "Browse our completed builds. Each project showcases our dedication to structural integrity and culinary innovation."
    }
});

export const portfolioPage: PageDef = {
    id: "portfolio",
    label: "Portfolio",
    icon: "Briefcase",
    path: "/portfolio",
    sections: [PORTFOLIO_HEADER, PORTFOLIO_GALLERY]
};
