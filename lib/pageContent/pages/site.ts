import { defineSection, type PageDef } from "../types";

export const SITE_HEADER = defineSection({
    key: "site.header",
    label: "Header & Navigation",
    description: "Main menu links, quote button and the mobile-menu tagline.",
    fields: [
        {
            name: "navLinks",
            label: "Menu Links",
            type: "list",
            itemLabel: "Link",
            titleField: "label",
            fields: [
                { name: "label", label: "Label", type: "text" },
                { name: "href", label: "Link", type: "link" }
            ]
        },
        { name: "ctaText", label: "Quote Button Text", type: "text" },
        { name: "ctaLink", label: "Quote Button Link", type: "link" },
        { name: "mobileTagline", label: "Mobile Menu Tagline", type: "text", help: "Small badge under the phone number in the mobile menu." }
    ],
    defaults: {
        navLinks: [
            { label: "Home", href: "/" },
            { label: "About", href: "/about" },
            { label: "Services", href: "/services" },
            { label: "Compliance", href: "/compliance" },
            { label: "Portfolio", href: "/portfolio" },
            { label: "Blog", href: "/blog" }
        ],
        ctaText: "Get a Free Quote",
        ctaLink: "/quote",
        mobileTagline: "Manassas HQ | Nationwide Delivery"
    }
});

const footerLinkList = (name: string, label: string) => ({
    name,
    label,
    type: "list" as const,
    itemLabel: "Link",
    titleField: "label",
    fields: [
        { name: "label", label: "Label", type: "text" as const },
        { name: "href", label: "Link", type: "link" as const }
    ]
});

export const SITE_FOOTER = defineSection({
    key: "site.footer",
    label: "Footer",
    description: "Brand blurb, link columns, column headings and the bottom bar. Contact details come from Settings.",
    fields: [
        { name: "about", label: "Brand Blurb", type: "textarea", rows: 3 },
        { name: "exploreHeading", label: "Column 1 Heading", type: "text" },
        footerLinkList("exploreLinks", "Column 1 Links"),
        { name: "servicesHeading", label: "Column 2 Heading", type: "text" },
        footerLinkList("serviceLinks", "Column 2 Links"),
        { name: "contactHeading", label: "Contact Column Heading", type: "text" },
        { name: "copyrightName", label: "Copyright Name", type: "text", help: "Shown as © <year> <name>. All rights reserved." },
        { name: "copyrightLink", label: "Copyright Name Link", type: "link" },
        footerLinkList("bottomLinks", "Bottom Bar Links")
    ],
    defaults: {
        about: "Elite Steel Concepts designs & builds custom food trucks and trailers in Manassas, VA. Premium mobile kitchens crafted for performance. Get a free quote today!",
        exploreHeading: "Explore",
        exploreLinks: [
            { label: "Home", href: "/" },
            { label: "About Us", href: "/about" },
            { label: "Services", href: "/services" },
            { label: "Locations Directory", href: "/locations" },
            { label: "Process", href: "/process" },
            { label: "Portfolio", href: "/portfolio" },
            { label: "Testimonials", href: "/testimonials" },
            { label: "Compliance", href: "/compliance" },
            { label: "Blog", href: "/blog" }
        ],
        servicesHeading: "Services",
        serviceLinks: [
            { label: "Custom Food Trucks", href: "/services/custom-food-trucks" },
            { label: "Custom Food Trailers", href: "/services/custom-food-trailers" },
            { label: "Repairs & Upgrades", href: "/services/repairs-and-upgrades" },
            { label: "Design & Consultation", href: "/services/design-and-consultation" },
            { label: "Fleet Expansion", href: "/services/fleet-expansion" }
        ],
        contactHeading: "Contact Us",
        copyrightName: "Elite Steel Concepts",
        copyrightLink: "https://www.facebook.com/EliteSteelConcepts",
        bottomLinks: [
            { label: "Locations", href: "/locations" },
            { label: "Privacy Policy", href: "/privacy" },
            { label: "Terms of Service", href: "/terms" },
            { label: "Sitemap", href: "/sitemap.xml" }
        ]
    }
});

export const SITE_FAQ = defineSection({
    key: "site.faq",
    label: "FAQ Section Copy",
    description: "Heading, intro and help box beside the FAQ accordion (questions are managed in Admin → FAQs).",
    fields: [
        { name: "eyebrow", label: "Eyebrow", type: "text" },
        { name: "title", label: "Heading", type: "text" },
        { name: "highlight", label: "Highlighted Word(s)", type: "text", help: "Shown after the heading in brand orange." },
        { name: "intro", label: "Intro Paragraph", type: "textarea", rows: 3 },
        { name: "helpTitle", label: "Help Box Title", type: "text" },
        { name: "helpText", label: "Help Box Text", type: "textarea", rows: 2 },
        { name: "helpLinkText", label: "Help Box Link Text", type: "text" },
        { name: "helpLink", label: "Help Box Link", type: "link" }
    ],
    defaults: {
        eyebrow: "Got Questions?",
        title: "Frequently Asked",
        highlight: "Questions",
        intro: "Everything you need to know about starting your custom build. If you don't find your answer here, feel free to contact us.",
        helpTitle: "Need Help?",
        helpText: "Our fabrication consultants are ready to discuss your project specifics.",
        helpLinkText: "Contact Support",
        helpLink: "/contact"
    }
});

export type SiteHeaderContent = typeof SITE_HEADER.defaults;
export type SiteFooterContent = typeof SITE_FOOTER.defaults;
export type SiteFaqContent = typeof SITE_FAQ.defaults;

export const sitePage: PageDef = {
    id: "site",
    label: "Site-wide",
    icon: "Globe",
    path: null,
    sections: [SITE_HEADER, SITE_FOOTER, SITE_FAQ]
};
