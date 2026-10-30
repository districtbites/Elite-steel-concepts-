import { defineSection, type PageDef } from "../types";

export const REPAIRS_HEADER = defineSection({
    key: "repairs_and_upgrades.header",
    label: "Page Header",
    description: "Title and subtitle at the top of the page.",
    fields: [
        { name: "title", label: "Title", type: "text" },
        { name: "subtitle", label: "Subtitle", type: "textarea", rows: 2 }
    ],
    defaults: {
        title: "Repairs & Upgrades for Food Trucks & Trailers",
        subtitle: "Repair. Upgrade. We’ve Got You Covered."
    }
});

export const REPAIRS_SERVICES = defineSection({
    key: "repairs_and_upgrades.services",
    label: "Repair Services",
    description: "\"What ESC Fixes\" heading and the repair service cards (icons stay in order).",
    fields: [
        { name: "eyebrow", label: "Eyebrow", type: "text" },
        { name: "title", label: "Heading", type: "text" },
        {
            name: "services",
            label: "Service Cards",
            type: "list",
            itemLabel: "Service",
            titleField: "title",
            fields: [
                { name: "title", label: "Title", type: "text" },
                { name: "intro", label: "Intro", type: "textarea", rows: 2 },
                { name: "points", label: "Points", type: "textarea", rows: 6, help: "One point per line." }
            ]
        }
    ],
    defaults: {
        eyebrow: "What ESC Fixes",
        title: "ESC Food Truck & Trailer Repair Services",
        services: [
            { title: "Electrical Repairs & Upgrades", intro: "We can diagnose and address electrical issues involving:", points: "Outlets and electrical connections\nInterior and exterior lighting\nShore-power connections\nElectrical system upgrades\nGenerator-related electrical connections" },
            { title: "Plumbing & Water Systems", intro: "We can diagnose and address plumbing and water issues involving:", points: "Sinks and plumbing lines\nWater heaters\nWater pumps\nFreshwater tanks\nWastewater tanks\nPlumbing repairs and modifications" },
            { title: "Propane System Repairs", intro: "We can repair and upgrade components of your propane system, including:", points: "Propane lines\nRegulators\nShutoff valves\nTank cages\nRelated propane system modifications" },
            { title: "Hood & Ventilation Repairs", intro: "Proper ventilation is essential for a functional commercial kitchen. Our services include:", points: "Hood repairs and upgrades\nExhaust and ventilation improvements\nHood fan repairs\nVentilation modifications\nCoordination of fire-suppression work when required" },
            { title: "Equipment Installation & Replacement", intro: "Need to replace outdated or damaged kitchen equipment? We can help with:", points: "Equipment installation\nEquipment replacement\nEquipment swaps\nKitchen equipment layout changes\nWorkflow-focused modifications" },
            { title: "Interior Repairs & Rebuilds", intro: "We can repair or modify key areas inside your mobile kitchen, including:", points: "Walls and ceilings\nFlooring\nInsulation\nCountertops\nInterior finishes\nRebuilds required for specific inspection needs" },
            { title: "Exterior Updates & Branding", intro: "Your food truck or trailer is part of your brand. We can assist with modifications such as:", points: "Exterior wrap and branding updates\nConcession window improvements\nDoor replacements or modifications\nGenerator cabinet work\nExterior fabrication" },
            { title: "Custom Fabrication & Welding", intro: "Our fabrication and welding repair capabilities include:", points: "Custom stainless-steel fabrication\nCabinets and shelving\nStainless-steel work surfaces\nWelding and structural modifications\nConcession windows\nDoors and access points\nGenerator cabinets\nCustom kitchen components" }
        ]
    }
});

export const REPAIRS_PROCESS = defineSection({
    key: "repairs_and_upgrades.process",
    label: "Repair Process",
    description: "Process heading, intro and numbered steps (icons stay in order).",
    fields: [
        { name: "title", label: "Heading", type: "text" },
        { name: "intro", label: "Intro", type: "textarea", rows: 3 },
        {
            name: "steps",
            label: "Steps",
            type: "list",
            itemLabel: "Step",
            titleField: "title",
            fields: [
                { name: "title", label: "Title", type: "text" },
                { name: "text", label: "Description", type: "textarea", rows: 2 }
            ]
        }
    ],
    defaults: {
        title: "Repair & Upgrade Solutions Built Around Your Mobile Kitchen",
        intro: "We assess your existing setup, understand your business needs, and recommend repairs or upgrades that make your mobile kitchen more functional and efficient.",
        steps: [
            { title: "Assess", text: "We inspect your truck or trailer and review your existing setup." },
            { title: "Identify", text: "We pinpoint what's failing, outdated or slowing down your workflow." },
            { title: "Recommend", text: "We suggest the repairs and upgrades that fit your business needs." },
            { title: "Upgrade", text: "Our team completes the work so your kitchen runs more efficiently." }
        ]
    }
});

export const REPAIRS_CTA = defineSection({
    key: "repairs_and_upgrades.cta",
    label: "Call to Action",
    description: "Dark banner at the bottom of the page.",
    fields: [
        { name: "title", label: "Title", type: "text" },
        { name: "subtitle", label: "Subtitle", type: "textarea", rows: 3 },
        { name: "buttonText", label: "Button Text", type: "text" },
        { name: "buttonLink", label: "Button Link", type: "link" }
    ],
    defaults: {
        title: "Ready to Upgrade Your Food Truck?",
        subtitle: "Tell us about your food truck or trailer, the problems you're experiencing, and the upgrades you're considering. Our expert team will assess the project and help determine the next steps.",
        buttonText: "Get a Free Quote",
        buttonLink: "/quote"
    }
});

export const repairsAndUpgradesPage: PageDef = {
    id: "repairs_and_upgrades",
    label: "Repairs & Upgrades",
    icon: "Hammer",
    path: "/services/repairs-and-upgrades",
    builder: true,
    sections: [REPAIRS_HEADER, REPAIRS_SERVICES, REPAIRS_PROCESS, REPAIRS_CTA]
};
