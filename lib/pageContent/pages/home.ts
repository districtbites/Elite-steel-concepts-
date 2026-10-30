import { defineSection, type PageDef } from "../types";

export const HOME_HERO = defineSection({
    key: "home.hero",
    label: "Hero",
    description: "Top banner: badge, rotating headline, intro, buttons and the stats row.",
    fields: [
        { name: "badge", label: "Badge", type: "text" },
        { name: "headlineScreenReader", label: "Headline (search engines & screen readers)", type: "text", help: "The visible headline rotates, so this sentence describes the business to Google and screen readers." },
        { name: "headlineStart", label: "Headline — First Line", type: "text" },
        { name: "cyclingWords", label: "Headline — Rotating Words", type: "strings", itemLabel: "Word" },
        { name: "headlineEnd", label: "Headline — Last Line", type: "text" },
        { name: "subheading", label: "Intro Paragraph", type: "textarea", rows: 4, help: "Long text is shortened with a \"Read more\" toggle after 180 characters." },
        { name: "primaryCtaText", label: "Primary Button Text", type: "text" },
        { name: "primaryCtaLink", label: "Primary Button Link", type: "link" },
        { name: "phoneText", label: "Phone Button Text", type: "text" },
        { name: "phoneLink", label: "Phone Button Link", type: "link", placeholder: "tel:+15716510337" },
        { name: "secondaryCtaText", label: "Secondary Button Text", type: "text" },
        { name: "secondaryCtaLink", label: "Secondary Button Link", type: "link" },
        {
            name: "stats",
            label: "Stats Row",
            type: "list",
            itemLabel: "Stat",
            titleField: "label",
            fields: [
                { name: "value", label: "Value", type: "text" },
                { name: "label", label: "Label", type: "text" }
            ]
        }
    ],
    defaults: {
        badge: "Based in Manassas, VA",
        headlineScreenReader: "Custom Food Trucks, Concession Trailers & Mobile Kitchens Built in Manassas, VA",
        headlineStart: "Custom",
        cyclingWords: ["Food Trucks", "Trailers", "Mobile Kitchens"],
        headlineEnd: "Built to Perform.",
        subheading: "Design. Fabrication. Ready to Serve. We turn your culinary vision into a high-performance mobile business — 100% health code compliant, on time, on budget.",
        primaryCtaText: "Get a Free Quote",
        primaryCtaLink: "/quote",
        phoneText: "(571) 651-0337",
        phoneLink: "tel:+15716510337",
        secondaryCtaText: "Explore Our Services",
        secondaryCtaLink: "/services",
        stats: [
            { value: "14+", label: "Years Experience" },
            { value: "350+", label: "Custom Builds" },
            { value: "100%", label: "Code Compliant" },
            { value: "48", label: "States Served" }
        ]
    },
    legacy: { seoPage: "home", seoSection: "hero", fields: { subheading: "content" } }
});

export const HOME_INTRO = defineSection({
    key: "home.intro",
    label: "Intro",
    description: "\"What We Build\" heading, intro paragraph and two buttons below the hero.",
    fields: [
        { name: "eyebrow", label: "Eyebrow", type: "text" },
        { name: "title", label: "Heading", type: "text" },
        { name: "body", label: "Intro Paragraph", type: "textarea", rows: 5, help: "Internal-link keywords are linked automatically." },
        { name: "primaryCtaText", label: "Primary Button Text", type: "text" },
        { name: "primaryCtaLink", label: "Primary Button Link", type: "link" },
        { name: "secondaryCtaText", label: "Secondary Button Text", type: "text" },
        { name: "secondaryCtaLink", label: "Secondary Button Link", type: "link" }
    ],
    defaults: {
        eyebrow: "What We Build",
        title: "Custom Food Trucks & Concession Trailers For Entrepreneurs",
        body: "We are experienced custom food truck builders creating food trucks, food trailers, and mobile kitchens for businesses of all kinds. As a trusted food truck manufacturer, we build each unit around your menu, equipment, space, and workflow. From a custom food trailer to a complete mobile kitchen, we help turn your idea into a practical, professional setup ready for your food business.",
        primaryCtaText: "About ESC",
        primaryCtaLink: "/about",
        secondaryCtaText: "See Our Work",
        secondaryCtaLink: "/portfolio"
    },
    legacy: { seoPage: "home", seoSection: "intro", fields: { title: "title", body: "content" } }
});

export const HOME_FLOOR_PLAN = defineSection({
    key: "home.floorplan",
    label: "Our Services (Floor Plan)",
    description: "Food truck / food trailer switcher with the interior images.",
    fields: [
        { name: "eyebrow", label: "Section Label", type: "text" },
        { name: "truckTab", label: "Truck Tab Label", type: "text" },
        { name: "truckBadge", label: "Truck Image Badge", type: "text" },
        { name: "truckImage", label: "Truck Image", type: "image" },
        { name: "truckImageAlt", label: "Truck Image Alt Text", type: "text" },
        { name: "trailerTab", label: "Trailer Tab Label", type: "text" },
        { name: "trailerBadge", label: "Trailer Image Badge", type: "text" },
        { name: "trailerImage", label: "Trailer Image", type: "image" },
        { name: "trailerImageAlt", label: "Trailer Image Alt Text", type: "text" }
    ],
    defaults: {
        eyebrow: "Our Services",
        truckTab: "Custom Food Truck",
        truckBadge: "SIDE 1: FOOD TRUCK",
        truckImage: "/uploads/home/floorplan-truck.jpg",
        truckImageAlt: "Custom Food Truck Interior",
        trailerTab: "Custom Food Trailer",
        trailerBadge: "SIDE 2: TRAILER",
        trailerImage: "/uploads/home/floorplan-trailer.jpg",
        trailerImageAlt: "Concession Trailer Interior"
    }
});

export const HOME_SIZES = defineSection({
    key: "home.sizes",
    label: "Size Guide",
    description: "\"Choose Your Ideal Food Truck Size\" cards (S / M / L / XL).",
    fields: [
        { name: "eyebrow", label: "Eyebrow", type: "text" },
        { name: "title", label: "Heading", type: "text" },
        { name: "titleNoWrap", label: "Heading — Last Words", type: "text", help: "Shown after the heading and kept together on one line." },
        { name: "intro", label: "Intro", type: "textarea", rows: 3 },
        {
            name: "sizes",
            label: "Size Cards",
            type: "list",
            itemLabel: "Size",
            titleField: "label",
            fields: [
                { name: "letter", label: "Background Letter", type: "text" },
                { name: "label", label: "Size Name", type: "text" },
                { name: "kitchen", label: "Kitchen Length", type: "text" },
                { name: "truck", label: "Truck Length", type: "text" }
            ]
        }
    ],
    defaults: {
        eyebrow: "Which Food Truck Size Is Right for You?",
        title: "Choose Your Ideal Food",
        titleNoWrap: "Truck Size",
        intro: "We'll help you choose the right size and layout for your menu, equipment, staff, storage, and operating needs.",
        sizes: [
            { letter: "S", label: "SMALL", kitchen: "10-11FT KITCHEN", truck: "18-21FT TRUCK" },
            { letter: "M", label: "MEDIUM", kitchen: "14-16FT KITCHEN", truck: "22-24FT TRUCK" },
            { letter: "L", label: "LARGE", kitchen: "17-18FT KITCHEN", truck: "25-27FT TRUCK" },
            { letter: "XL", label: "X-LARGE", kitchen: "20-22FT KITCHEN", truck: "29-30FT TRUCK" }
        ]
    }
});

export const HOME_QUOTE_START = defineSection({
    key: "home.quotestart",
    label: "Get a Quote Banner",
    description: "Dark \"Get A Quote\" banner with the logo and button.",
    fields: [
        { name: "title", label: "Heading", type: "text" },
        { name: "ctaText", label: "Button Text", type: "text" },
        { name: "ctaLink", label: "Button Link", type: "link" }
    ],
    defaults: {
        title: "Get A Quote",
        ctaText: "Get a Free Quote",
        ctaLink: "/quote"
    }
});

export const HOME_PROCESS = defineSection({
    key: "home.process",
    label: "Build Process",
    description: "\"Our Build Process\" five-step strip with the quote call-to-action.",
    fields: [
        { name: "eyebrow", label: "Eyebrow", type: "text" },
        { name: "titleLine1", label: "Heading — Line 1", type: "text" },
        { name: "titleLine2", label: "Heading — Line 2", type: "text" },
        { name: "fullProcessText", label: "Process Link Text", type: "text" },
        { name: "fullProcessLink", label: "Process Link", type: "link" },
        {
            name: "steps",
            label: "Steps",
            type: "list",
            itemLabel: "Step",
            titleField: "title",
            help: "Icons are assigned in order.",
            fields: [
                { name: "title", label: "Title", type: "text" },
                { name: "description", label: "Description", type: "textarea", rows: 3 }
            ]
        },
        { name: "ctaText", label: "Call-to-Action Text", type: "text" },
        { name: "ctaButtonText", label: "Button Text", type: "text" },
        { name: "ctaButtonLink", label: "Button Link", type: "link" }
    ],
    defaults: {
        eyebrow: "How We Work",
        titleLine1: "Our Build",
        titleLine2: "Process",
        fullProcessText: "See Full Process",
        fullProcessLink: "/process",
        steps: [
            { title: "Quote Request", description: "Fill out our quote form with your build requirements. We respond within 24 hours." },
            { title: "Consultation", description: "We call you to deep-dive into your menu, workflow, and budget. No pressure, just precision." },
            { title: "Design & Schematics", description: "Our engineers develop a full floor plan with equipment placement, power layout, and material spec." },
            { title: "Agreement", description: "Once details are locked, we sign a production agreement with a clear timeline and milestones." },
            { title: "Production", description: "Our fabrication team builds your truck. You can visit the shop at any stage — walk-ins welcome." }
        ],
        ctaText: "Ready to start? Begin with a free quote.",
        ctaButtonText: "Get a Free Quote",
        ctaButtonLink: "/quote"
    }
});

export const HOME_WHY_CHOOSE = defineSection({
    key: "home.whychoose",
    label: "Why Choose ESC",
    description: "\"The Elite Advantage\" heading and the six feature cards.",
    fields: [
        { name: "eyebrow", label: "Eyebrow", type: "text" },
        { name: "title", label: "Heading", type: "text" },
        { name: "features", label: "Feature Cards", type: "strings", itemLabel: "Card", help: "Icons are assigned in order." }
    ],
    defaults: {
        eyebrow: "The Elite Advantage",
        title: "Why Choose Elite Steel Concepts?",
        features: [
            "Custom Built Designs",
            "Quality Equipment Installation",
            "1-Year Limited Electrical & Plumbing Warranty",
            "Electrical & Plumbing Installation",
            "Fire Safety Installation",
            "Nationwide Service"
        ]
    }
});

export const HOME_LOCAL_COVERAGE = defineSection({
    key: "home.localcoverage",
    label: "Local Coverage",
    description: "\"Where We Build and Deliver\" service-area section with area tiles.",
    fields: [
        { name: "eyebrow", label: "Eyebrow", type: "text" },
        { name: "title", label: "Heading", type: "text" },
        { name: "body", label: "Paragraph", type: "textarea", rows: 5, help: "Internal-link keywords are linked automatically." },
        { name: "areas", label: "Area Tiles", type: "strings", itemLabel: "Area" },
        { name: "areaCaption", label: "Tile Caption", type: "text" },
        { name: "ctaText", label: "Button Text", type: "text" },
        { name: "ctaLink", label: "Button Link", type: "link" }
    ],
    defaults: {
        eyebrow: "Service Area",
        title: "Where We Build and Deliver",
        body: "Based in Manassas, Virginia, Elite Steel Concepts serves the entire Washington DC metropolitan area including Northern Virginia, Maryland, and the greater Mid-Atlantic region. Our custom food trucks, concession trailers, and mobile kitchens have been delivered to entrepreneurs across 48 states.",
        areas: ["Washington DC", "Northern Virginia", "Maryland", "Pennsylvania"],
        areaCaption: "Full Coverage",
        ctaText: "View All Locations We Serve",
        ctaLink: "/locations"
    },
    legacy: { seoPage: "home", seoSection: "localcoverage", fields: { eyebrow: "subtitle", title: "title", body: "content" } }
});

export const HOME_TESTIMONIALS = defineSection({
    key: "home.testimonials",
    label: "Video Testimonials",
    description: "\"Client Testimonials\" heading and the video reels slider.",
    fields: [
        { name: "eyebrow", label: "Heading", type: "text" },
        {
            name: "reels",
            label: "Video Reels",
            type: "list",
            itemLabel: "Reel",
            titleField: "title",
            fields: [
                { name: "title", label: "Title", type: "text" },
                { name: "client", label: "Client", type: "text" },
                { name: "location", label: "Location", type: "text" },
                { name: "videoUrl", label: "Video URL (.mp4)", type: "link" },
                { name: "poster", label: "Poster Image", type: "image" },
                { name: "durationSeconds", label: "Duration (seconds)", type: "number" },
                { name: "views", label: "Views Label", type: "text", placeholder: "14.2K" }
            ]
        }
    ],
    defaults: {
        eyebrow: "Client Testimonials",
        reels: [
            { title: "Inside Taco Fiesta 24ft Custom Food Truck Build", client: "Carlos & Maria R.", location: "Washington, DC", videoUrl: "/videos/reels/reel-1.mp4", poster: "/videos/reels/reel-1-poster.webp", durationSeconds: 39, views: "14.2K" },
            { title: "Full Walkthrough: 20ft Smokehouse BBQ Concession Trailer", client: "Chef Marcus Vance", location: "Richmond, VA", videoUrl: "/videos/reels/reel-2.mp4", poster: "/videos/reels/reel-2-poster.webp", durationSeconds: 20, views: "28.9K" },
            { title: "Handover Day! Custom Mobile Espresso & Bakery Truck", client: "Sarah's Artisan Coffee", location: "Baltimore, MD", videoUrl: "/videos/reels/reel-3.mp4", poster: "/videos/reels/reel-3-poster.webp", durationSeconds: 14, views: "19.5K" },
            { title: "Client Testimonial: Custom Food Truck Build", client: "ESC Client", location: "Fairfax, VA", videoUrl: "/videos/reels/reel-4.mp4", poster: "/videos/reels/reel-4-poster.webp", durationSeconds: 25, views: "" }
        ]
    }
});

export const HOME_BLOG = defineSection({
    key: "home.blog",
    label: "Latest Blog Posts",
    description: "Heading and link above the three latest blog posts (posts come from Blog Posts).",
    fields: [
        { name: "eyebrow", label: "Eyebrow", type: "text" },
        { name: "title", label: "Heading", type: "text" },
        { name: "linkText", label: "Link Text", type: "text" },
        { name: "linkHref", label: "Link", type: "link" }
    ],
    defaults: {
        eyebrow: "News & Insights",
        title: "Latest from the Blog",
        linkText: "View All Articles",
        linkHref: "/blog"
    }
});

export const homePage: PageDef = {
    id: "home",
    label: "Homepage",
    icon: "Home",
    path: "/",
    builder: true,
    sections: [
        HOME_HERO,
        HOME_INTRO,
        HOME_FLOOR_PLAN,
        HOME_SIZES,
        HOME_QUOTE_START,
        HOME_PROCESS,
        HOME_WHY_CHOOSE,
        HOME_LOCAL_COVERAGE,
        HOME_TESTIMONIALS,
        HOME_BLOG
    ]
};
