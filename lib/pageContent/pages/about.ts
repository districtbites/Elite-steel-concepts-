import { defineSection, type PageDef } from "../types";

export const ABOUT_HEADER = defineSection({
    key: "about.header",
    label: "Page Header",
    description: "Big \"About Us\" title and subtitle at the top of the page.",
    fields: [
        { name: "title", label: "Title", type: "text" },
        { name: "subtitle", label: "Subtitle", type: "textarea", rows: 3 }
    ],
    defaults: {
        title: "About Us",
        subtitle: "With {experienceYears}+ years of experience, Elite Steel Concepts builds custom food trucks, trailers & mobile kitchens designed for food businesses. Based in Manassas, Virginia, we proudly serve entrepreneurs nationwide."
    }
});

export const ABOUT_MISSION = defineSection({
    key: "about.mission",
    label: "Our Mission",
    description: "Mission heading, image and story paragraph.",
    fields: [
        { name: "eyebrow", label: "Eyebrow", type: "text" },
        { name: "title", label: "Heading", type: "text" },
        { name: "body", label: "Story Paragraph", type: "textarea", rows: 6 },
        { name: "image", label: "Image", type: "image" },
        { name: "imageAlt", label: "Image Alt Text", type: "text" }
    ],
    defaults: {
        eyebrow: "Our Mission",
        title: "Built Custom Food Trucks & Trailers for Entrepreneurs With Big Ideas",
        body: "Our mission is to build high-quality custom food trailers and trucks using durable, commercial-grade materials, reliable equipment, expert construction, and practical kitchen layouts. Every build is carefully designed around the client's menu, workflow, and business needs, with a strong focus on durability, functionality, professional finishing, and applicable code requirements. We use quality materials and thoughtful designs to create dependable mobile kitchen solutions that support entrepreneurs from their first launch through long-term business growth.",
        image: "/uploads/about/about-mission-worker.jpg",
        imageAlt: "Elite Steel Concepts fabricator building a custom food truck"
    }
});

export const ABOUT_MANUFACTURE = defineSection({
    key: "about.manufacture",
    label: "What We Manufacture",
    description: "Heading and the Truck / Trailer image cards.",
    fields: [
        { name: "eyebrow", label: "Heading", type: "text" },
        {
            name: "cards",
            label: "Cards",
            type: "list",
            itemLabel: "Card",
            titleField: "title",
            fields: [
                { name: "title", label: "Title", type: "text" },
                { name: "href", label: "Link", type: "link" },
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
                href: "/services/custom-food-trucks",
                image: "/uploads/about/about-manufacture-truck.jpg",
                imageAlt: "Custom white food truck built by Elite Steel Concepts"
            },
            {
                title: "Trailer",
                href: "/services/custom-food-trailers",
                image: "/uploads/about/about-manufacture-trailer.jpg",
                imageAlt: "Custom black and yellow concession trailer by Elite Steel Concepts"
            }
        ]
    }
});

export const ABOUT_PROCESS = defineSection({
    key: "about.process",
    label: "Building Process",
    description: "\"Our Building Process\" heading, steps and closing line.",
    fields: [
        { name: "eyebrow", label: "Eyebrow", type: "text" },
        { name: "title", label: "Heading (line 1)", type: "text" },
        { name: "titleLine2", label: "Heading (line 2)", type: "text" },
        {
            name: "steps",
            label: "Steps",
            type: "list",
            itemLabel: "Step",
            titleField: "title",
            fields: [
                { name: "title", label: "Title", type: "text" },
                { name: "description", label: "Description", type: "textarea", rows: 3 }
            ]
        },
        { name: "ctaText", label: "Closing Line", type: "text" }
    ],
    defaults: {
        eyebrow: "How We Build",
        title: "Our Building",
        titleLine2: "Process",
        steps: [
            { title: "Share Your Business Idea", description: "Tell us about your food concept, menu, equipment needs, and business goals. We learn what you need before planning your custom build." },
            { title: "Plan Your Custom Build", description: "We plan the kitchen layout, equipment placement, storage, serving areas, and workflow around your specific business needs." },
            { title: "Build Your Food Truck or Trailer", description: "Our team turns the approved design into a custom food truck or trailer using quality materials, reliable equipment, and professional construction." },
            { title: "Quality & Compliance Checks", description: "We review the completed build to ensure the important details, functionality, and applicable requirements are properly addressed." },
            { title: "Ready for Your Business", description: "Once your custom food truck or trailer is complete, it is ready to help you take your food business on the road and start serving your customers." }
        ],
        ctaText: "Ready to share your idea? Start with a free quote."
    }
});

export const ABOUT_WHY = defineSection({
    key: "about.why",
    label: "Why Choose Us",
    description: "\"Why Entrepreneurs Choose Elite Steel Concepts\" heading, intro and reason cards.",
    fields: [
        { name: "eyebrow", label: "Eyebrow", type: "text" },
        { name: "title", label: "Heading", type: "text" },
        { name: "intro", label: "Intro Paragraph", type: "textarea", rows: 3 },
        { name: "reasons", label: "Reason Cards", type: "strings", itemLabel: "Reason", help: "Icons are assigned in order and repeat after 8." }
    ],
    defaults: {
        eyebrow: "Why Choose Us",
        title: "Why Entrepreneurs Choose Elite Steel Concepts",
        intro: "Entrepreneurs choose ECS as their trusted custom food truck builder for quality craftsmanship, durable builds, and mobile kitchens designed to support long-term business success.",
        reasons: [
            "{experienceYears}+ Years of Industry Experience",
            "{trucksBuiltCount}+ Custom Builds Completed",
            "Quality Materials & Reliable Equipment",
            "Custom Designs Built Around Your Business",
            "Compliance-Focused Construction",
            "Nationwide Service — 48 States Served",
            "Built for Long-Term Business Use",
            "Start-to-Finish Project Support"
        ]
    }
});

export const ABOUT_CTA = defineSection({
    key: "about.cta",
    label: "Closing Call to Action",
    description: "Dark banner at the bottom of the page.",
    fields: [
        { name: "title", label: "Heading", type: "text" },
        { name: "subtitle", label: "Subtitle", type: "textarea", rows: 2 },
        { name: "buttonText", label: "Button Text", type: "text" },
        { name: "buttonLink", label: "Button Link", type: "link" }
    ],
    defaults: {
        title: "Ready to Build Your Custom Food Business?",
        subtitle: "Your food business starts with the right build. Elite Steel Concepts is ready to help bring your idea to reality. Contact us today!",
        buttonText: "Get a Free Quote",
        buttonLink: "/quote"
    }
});

export const aboutPage: PageDef = {
    id: "about",
    label: "About",
    icon: "Info",
    path: "/about",
    builder: true,
    sections: [ABOUT_HEADER, ABOUT_MISSION, ABOUT_MANUFACTURE, ABOUT_PROCESS, ABOUT_WHY, ABOUT_CTA]
};
