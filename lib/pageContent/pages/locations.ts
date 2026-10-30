import { defineSection, type PageDef } from "../types";

export const LOCATIONS_HEADER = defineSection({
    key: "locations.header",
    label: "Page Header",
    description: "Dark banner with heading, subheading, call and quote buttons.",
    fields: [
        { name: "eyebrow", label: "Eyebrow", type: "text" },
        { name: "title", label: "Heading", type: "text" },
        { name: "subtitle", label: "Subheading", type: "text" },
        { name: "callText", label: "Call Button Text", type: "text" },
        { name: "callLink", label: "Call Button Link", type: "link", placeholder: "tel:+15716510337" },
        { name: "ctaText", label: "Quote Button Text", type: "text" },
        { name: "ctaLink", label: "Quote Button Link", type: "link" }
    ],
    defaults: {
        eyebrow: "States ESC Serve",
        title: "Trusted Custom Food Truck Builder Serving Virginia, Washington, DC & Maryland",
        subtitle: "Find Custom Food Truck and Trailer Building Services Near You",
        callText: "Call: (571) 651-0337",
        callLink: "tel:+15716510337",
        ctaText: "Get a Free Quote",
        ctaLink: "/quote"
    }
});

export const LOCATIONS_DIRECTORY = defineSection({
    key: "locations.directory",
    label: "Locations Directory",
    description: "Heading above the searchable city directory (cities come from Admin → Locations).",
    fields: [
        { name: "eyebrow", label: "Eyebrow", type: "text" },
        { name: "title", label: "Heading", type: "text" },
        { name: "body", label: "Intro", type: "textarea", rows: 2 }
    ],
    defaults: {
        eyebrow: "Regional & Surrounding State Directory",
        title: "Virginia & Surrounding Service Locations",
        body: "Browse every city we serve. Filter by state, search for your city, or sort by distance from our Manassas shop."
    }
});

export const LOCATIONS_NATIONWIDE = defineSection({
    key: "locations.nationwide",
    label: "Nationwide Coverage",
    description: "\"We Deliver to All 48 States\" intro, promise cards and quote button.",
    fields: [
        { name: "eyebrow", label: "Eyebrow", type: "text" },
        { name: "title", label: "Heading", type: "text" },
        { name: "body", label: "Intro", type: "textarea", rows: 4, help: "Use [link text](/url) for a link." },
        {
            name: "cards",
            label: "Promise Cards",
            type: "list",
            itemLabel: "Card",
            titleField: "title",
            help: "Icons are assigned in order: star, shield, truck, clock.",
            fields: [
                { name: "title", label: "Title", type: "text" },
                { name: "description", label: "Description", type: "textarea", rows: 2 }
            ]
        },
        { name: "ctaText", label: "Button Text", type: "text" },
        { name: "ctaLink", label: "Button Link", type: "link" }
    ],
    defaults: {
        eyebrow: "Nationwide",
        title: "We Deliver to All 48 States",
        body: "While we're based in Manassas, VA, Elite Steel Concepts has delivered custom food trucks and [concession trailers](/) to entrepreneurs across 48 states. Distance is not a barrier — we handle logistics, coordinate delivery, and ensure your truck arrives ready for inspection.",
        cards: [
            { title: "White-Glove Build Quality", description: "Commercial-grade stainless steel, NSF-certified equipment throughout." },
            { title: "Compliance Guaranteed", description: "Every build passes health inspection on the first attempt — or we fix it free." },
            { title: "Door-to-Door Delivery", description: "We coordinate full logistics from our Manassas shop to your address." },
            { title: "8–12 Week Turnaround", description: "Consistent delivery timeline from signed design to shipped truck." }
        ],
        ctaText: "Get a Free Quote",
        ctaLink: "/quote"
    }
});

export const LOCATIONS_SHOP = defineSection({
    key: "locations.shop",
    label: "Shop Address Callout",
    description: "Dark shop-address strip with direct call and quote buttons (address and hours come from Settings).",
    fields: [
        { name: "eyebrow", label: "Address Label", type: "text" },
        { name: "hoursNote", label: "Note After Business Hours", type: "text" },
        { name: "callLabel", label: "Call Label", type: "text" },
        { name: "phoneText", label: "Phone Text", type: "text" },
        { name: "phoneLink", label: "Phone Link", type: "link", placeholder: "tel:+15716510337" },
        { name: "ctaText", label: "Button Text", type: "text" },
        { name: "ctaLink", label: "Button Link", type: "link" }
    ],
    defaults: {
        eyebrow: "Our Fabrication Shop",
        hoursNote: "Walk-ins welcome",
        callLabel: "Call Direct",
        phoneText: "(571) 651-0337",
        phoneLink: "tel:+15716510337",
        ctaText: "Get a Free Quote",
        ctaLink: "/quote"
    }
});

export const LOCATIONS_CTA = defineSection({
    key: "locations.cta",
    label: "Final Call to Action",
    description: "Orange \"Don't see your city?\" banner with call and quote buttons.",
    fields: [
        { name: "eyebrow", label: "Eyebrow", type: "text" },
        { name: "title", label: "Heading", type: "text" },
        { name: "callText", label: "Call Button Text", type: "text" },
        { name: "callLink", label: "Call Button Link", type: "link", placeholder: "tel:+15716510337" },
        { name: "ctaText", label: "Quote Button Text", type: "text" },
        { name: "ctaLink", label: "Quote Button Link", type: "link" }
    ],
    defaults: {
        eyebrow: "Don't see your city?",
        title: "We Still Build for You — Nationwide.",
        callText: "Call Us Now",
        callLink: "tel:+15716510337",
        ctaText: "Get a Free Quote",
        ctaLink: "/quote"
    }
});

export const locationsPage: PageDef = {
    id: "locations",
    label: "Locations",
    icon: "MapPin",
    path: "/locations",
    sections: [LOCATIONS_HEADER, LOCATIONS_DIRECTORY, LOCATIONS_NATIONWIDE, LOCATIONS_SHOP, LOCATIONS_CTA]
};
