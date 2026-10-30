import { defineSection, type PageDef } from "../types";

export const TRUCKS_HEADER = defineSection({
    key: "custom_food_trucks.header",
    label: "Page Header",
    description: "Dark banner at the top of the Custom Food Trucks page.",
    fields: [
        { name: "eyebrow", label: "Eyebrow", type: "text" },
        { name: "title", label: "Title", type: "text" },
        { name: "subtitle", label: "Subtitle", type: "textarea", rows: 2 }
    ],
    defaults: {
        eyebrow: "Food Truck Services",
        title: "Custom Food Trucks",
        subtitle: "Build a Food Truck That Fits Your Business"
    }
});

export const TRUCKS_TYPES = defineSection({
    key: "custom_food_trucks.types",
    label: "Food Truck Types",
    description: "Animated truck cards (colors and icons follow the card order).",
    fields: [
        { name: "eyebrow", label: "Eyebrow", type: "text" },
        { name: "title", label: "Heading", type: "text" },
        { name: "subtitle", label: "Subheading", type: "text" },
        {
            name: "types",
            label: "Truck Types",
            type: "list",
            itemLabel: "Type",
            titleField: "title",
            fields: [
                { name: "title", label: "Title", type: "text" },
                { name: "tagline", label: "Tagline", type: "text" }
            ]
        }
    ],
    defaults: {
        eyebrow: "Food Truck Concepts",
        title: "Custom Food Truck Types ESC Build",
        subtitle: "Build a Food Truck That Fits Your Business",
        types: [
            { title: "Asian Food Truck", tagline: "Ramen, bao & dumplings" },
            { title: "BBQ Truck", tagline: "Smoked & slow-cooked" },
            { title: "American Food Truck", tagline: "Burgers, fries & shakes" },
            { title: "Chicken Food Truck", tagline: "Fried, grilled & wings" },
            { title: "Coffee Food Truck", tagline: "Espresso & specialty drinks" },
            { title: "Dessert Food Truck", tagline: "Sweets, cakes & treats" },
            { title: "Halal Food Truck", tagline: "Authentic halal street food" },
            { title: "Mexican Food Truck", tagline: "Tacos, burritos & more" },
            { title: "Pizza Food Truck", tagline: "Fresh-fired pizza" },
            { title: "Seafood Food Truck", tagline: "Fresh catch & seafood" },
            { title: "Soul Food Truck", tagline: "Classic comfort food" },
            { title: "Breakfast & Brunch Food Truck", tagline: "Pancakes, waffles & egg sandwiches" }
        ]
    }
});

export const TRUCKS_WHY = defineSection({
    key: "custom_food_trucks.why",
    label: "Why Choose ESC",
    description: "\"Why Entrepreneurs Choose\" heading, paragraph and benefit tiles.",
    fields: [
        { name: "title", label: "Heading", type: "text" },
        { name: "body", label: "Paragraph", type: "textarea", rows: 4, help: "Use [link text](/url) to add a link." },
        { name: "points", label: "Benefit Tiles", type: "strings", itemLabel: "Benefit" }
    ],
    defaults: {
        title: "Why Entrepreneurs Choose Elite Steel Concepts for Custom Food Truck Builds",
        body: "Elite Steel Concepts makes it simple to turn your idea into a real mobile kitchen. As [experienced food truck builders](/), we create custom trucks around your menu, equipment, space, and brand so your truck works the way you need it to.",
        points: [
            "Custom & Professional Designs",
            "Quality Craftsmanship",
            "Built to Code",
            "8–12 Week Build Time",
            "1-Year Limited Electrical & Plumbing Warranty",
            "Shipping Across 48 States"
        ]
    }
});

export const TRUCKS_CTA = defineSection({
    key: "custom_food_trucks.cta",
    label: "Call to Action",
    description: "Dark \"Ready to Build\" banner after the benefits.",
    fields: [
        { name: "eyebrow", label: "Eyebrow", type: "text" },
        { name: "title", label: "Heading", type: "text" },
        { name: "body", label: "Paragraph", type: "textarea", rows: 3 },
        { name: "ctaText", label: "Button Text", type: "text" },
        { name: "ctaLink", label: "Button Link", type: "link" }
    ],
    defaults: {
        eyebrow: "Start Your Build",
        title: "Ready to Build Your Custom Food Truck?",
        body: "Contact Elite Steel Concepts today to discuss your custom food truck project or request a free quote.",
        ctaText: "Get a Free Quote",
        ctaLink: "/quote"
    }
});

export const TRUCKS_INTRO = defineSection({
    key: "custom_food_trucks.intro",
    label: "Intro (Engineering Philosophy)",
    description: "Intro paragraph used by internal linking (its section is currently hidden on the page).",
    fields: [
        { name: "body", label: "Intro Paragraph", type: "textarea", rows: 5, help: "Internal-link keywords are linked automatically." }
    ],
    defaults: {
        body: "A custom food truck from Elite Steel Concepts is a precision tool. We focus on commercial kitchen design, ergonomic safety, and health code compliance. Every weld and every corner is designed to withstand the rigors of 24/7 commercial operation. You can also explore our custom concession trailers or request a custom quote."
    }
});

export const customFoodTrucksPage: PageDef = {
    id: "custom_food_trucks",
    label: "Custom Food Trucks",
    icon: "Truck",
    path: "/services/custom-food-trucks",
    builder: true,
    sections: [TRUCKS_HEADER, TRUCKS_TYPES, TRUCKS_WHY, TRUCKS_CTA, TRUCKS_INTRO]
};
