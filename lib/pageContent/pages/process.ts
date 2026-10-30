import { defineSection, type PageDef } from "../types";

export const PROCESS_HEADER = defineSection({
    key: "process.header",
    label: "Page Header",
    description: "Title and subtitle at the top of the page.",
    fields: [
        { name: "title", label: "Title", type: "text" },
        { name: "subtitle", label: "Subtitle", type: "textarea", rows: 2 }
    ],
    defaults: {
        title: "Our Process",
        subtitle: "Building Your Custom Food Truck or Trailer, Step by Step"
    }
});

export const PROCESS_INTRO = defineSection({
    key: "process.intro",
    label: "Intro",
    description: "Heading and intro sentence (with its inline link) above the timeline.",
    fields: [
        { name: "title", label: "Heading", type: "text" },
        { name: "textBefore", label: "Intro — Text Before Link", type: "text" },
        { name: "linkText", label: "Intro — Link Text", type: "text" },
        { name: "linkHref", label: "Intro — Link", type: "link" },
        { name: "textAfter", label: "Intro — Text After Link", type: "text" }
    ],
    defaults: {
        title: "ESC Custom Food Truck & Trailer Building Process",
        textBefore: "Create a mobile kitchen that works for you with a",
        linkText: "custom food truck manufacturer",
        linkHref: "/",
        textAfter: "you can trust."
    }
});

export const PROCESS_TIMELINE = defineSection({
    key: "process.timeline",
    label: "Process Timeline",
    description: "Numbered build phases (number and icon follow the order).",
    fields: [
        { name: "phaseLabel", label: "Phase Label", type: "text", help: "Shown before each phase number, e.g. \"Phase 01 / 05\"." },
        {
            name: "phases",
            label: "Phases",
            type: "list",
            itemLabel: "Phase",
            titleField: "title",
            fields: [
                { name: "title", label: "Title", type: "text" },
                { name: "tagline", label: "Tagline", type: "text" }
            ]
        }
    ],
    defaults: {
        phaseLabel: "Phase",
        phases: [
            { title: "Vision & Quote", tagline: "Start With Your Idea. Build With a Plan." },
            { title: "Strategic Design", tagline: "A Smarter Layout for a More Efficient Kitchen." },
            { title: "Project Approval & Agreement", tagline: "Clear Details. Clear Expectations." },
            { title: "Precision Fabrication", tagline: "Turning Your Approved Design Into Reality." },
            { title: "Final Inspection & Handover", tagline: "Your Mobile Kitchen, Ready for the Next Step." }
        ]
    }
});

export const PROCESS_CTA = defineSection({
    key: "process.cta",
    label: "Call to Action",
    description: "Dark banner at the bottom of the page.",
    fields: [
        { name: "title", label: "Title", type: "text" },
        { name: "subtitle", label: "Subtitle", type: "textarea", rows: 2 },
        { name: "buttonText", label: "Button Text", type: "text" },
        { name: "buttonLink", label: "Button Link", type: "link" }
    ],
    defaults: {
        title: "Ready to Start Your Custom Food Truck and Trailer Project?",
        subtitle: "Let's Discuss Your Dream Project With a Trusted Custom Food Truck Manufacturer!",
        buttonText: "Get a Free Quote",
        buttonLink: "/quote"
    }
});

export const processPage: PageDef = {
    id: "process",
    label: "Process",
    icon: "ListOrdered",
    path: "/process",
    builder: true,
    sections: [PROCESS_HEADER, PROCESS_INTRO, PROCESS_TIMELINE, PROCESS_CTA]
};
