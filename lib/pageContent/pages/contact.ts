import { defineSection, type PageDef } from "../types";

export const CONTACT_HEADER = defineSection({
    key: "contact.header",
    label: "Page Header",
    description: "Dark banner at the top of the Contact page.",
    fields: [
        { name: "eyebrow", label: "Eyebrow", type: "text" },
        { name: "title", label: "Heading", type: "text" },
        { name: "subtitle", label: "Subheading", type: "textarea", rows: 2 }
    ],
    defaults: {
        eyebrow: "Elite Steel Concepts",
        title: "Contact Us",
        subtitle: "Discuss your custom food truck or trailer. Fill out the form below. Our team member will get back to you shortly."
    }
});

export const CONTACT_DETAILS = defineSection({
    key: "contact.details",
    label: "Contact Cards & Form",
    description: "Titles of the address / phone / email cards and the form heading (values come from Settings).",
    fields: [
        { name: "addressTitle", label: "Address Card Title", type: "text" },
        { name: "phoneTitle", label: "Phone Card Title", type: "text" },
        { name: "emailTitle", label: "Email Card Title", type: "text" },
        { name: "formTitle", label: "Form Heading", type: "text" },
        { name: "formTitleHighlight", label: "Form Heading — Orange Word", type: "text" }
    ],
    defaults: {
        addressTitle: "Our Address",
        phoneTitle: "Phone Number",
        emailTitle: "Email",
        formTitle: "Let's Discuss Your",
        formTitleHighlight: "Build"
    }
});

export const contactPage: PageDef = {
    id: "contact",
    label: "Contact",
    icon: "Mail",
    path: "/contact",
    sections: [CONTACT_HEADER, CONTACT_DETAILS]
};
