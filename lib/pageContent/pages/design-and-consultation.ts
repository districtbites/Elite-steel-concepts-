import { defineSection, type PageDef } from "../types";

export const DESIGN_HEADER = defineSection({
    key: "design_and_consultation.header",
    label: "Page Header",
    description: "Title and subtitle at the top of the page.",
    fields: [
        { name: "title", label: "Title", type: "text" },
        { name: "subtitle", label: "Subtitle", type: "textarea", rows: 2 }
    ],
    defaults: {
        title: "Design & Consultation Service",
        subtitle: "Smart Custom Food Truck & Trailer Design Starts With the Right Plan Consultation"
    }
});

export const DESIGN_SERVICES = defineSection({
    key: "design_and_consultation.services",
    label: "Design Services",
    description: "Heading, intro and the four service cards (icons stay in order).",
    fields: [
        { name: "title", label: "Heading", type: "text" },
        { name: "intro", label: "Intro", type: "textarea", rows: 2 },
        { name: "items", label: "Service Cards", type: "strings", itemLabel: "Service" }
    ],
    defaults: {
        title: "Our Food Truck & Trailer Design & Consultation Services",
        intro: "Plan your mobile kitchen with expert guidance from our custom food builders and design team.",
        items: [
            "Workflow & Kitchen Layout Planning",
            "Professional 3D & CAD Layouts",
            "Health & Fire Code Planning",
            "Equipment Selection & Space Optimization"
        ]
    }
});

export const DESIGN_PROCESS = defineSection({
    key: "design_and_consultation.process",
    label: "Consultation Process",
    description: "Numbered process steps (icons stay in order).",
    fields: [
        { name: "title", label: "Heading", type: "text" },
        {
            name: "steps",
            label: "Steps",
            type: "list",
            itemLabel: "Step",
            titleField: "title",
            fields: [
                { name: "title", label: "Title", type: "text" },
                { name: "text", label: "Description", type: "textarea", rows: 3 }
            ]
        }
    ],
    defaults: {
        title: "Our Design & Consultation Process",
        steps: [
            { title: "Discuss Your Concept", text: "We learn about your food business idea, menu, target customers, and operational goals." },
            { title: "Evaluate Your Requirements", text: "We review your space, equipment needs, workflow, utilities, and relevant compliance considerations." },
            { title: "Develop Your Layout", text: "We plan a practical kitchen arrangement and, where appropriate, prepare CAD drawings for review." },
            { title: "Review & Refine", text: "We work through design details with you to address concerns and finalize the proposed layout before the next stage." }
        ]
    }
});

export const DESIGN_CTA = defineSection({
    key: "design_and_consultation.cta",
    label: "Call to Action",
    description: "Dark banner at the bottom of the page.",
    fields: [
        { name: "title", label: "Title", type: "text" },
        { name: "subtitle", label: "Subtitle", type: "textarea", rows: 2 },
        { name: "buttonText", label: "Button Text", type: "text" },
        { name: "buttonLink", label: "Button Link", type: "link" }
    ],
    defaults: {
        title: "Book a Design Consultation Today",
        subtitle: "Get expert design guidance and a free consultation to plan an efficient, functional food truck and trailer.",
        buttonText: "Get a Free Quote",
        buttonLink: "/quote"
    }
});

export const designAndConsultationPage: PageDef = {
    id: "design_and_consultation",
    label: "Design & Consultation",
    icon: "PenTool",
    path: "/services/design-and-consultation",
    builder: true,
    sections: [DESIGN_HEADER, DESIGN_SERVICES, DESIGN_PROCESS, DESIGN_CTA]
};
