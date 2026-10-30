import { defineSection, type PageDef } from "../types";

export const PRIVACY_HEADER = defineSection({
    key: "privacy.header",
    label: "Page Header",
    description: "Dark banner at the top of the Privacy Policy.",
    fields: [
        { name: "title", label: "Heading", type: "text" },
        { name: "subtitle", label: "Subheading", type: "text" }
    ],
    defaults: {
        title: "Privacy Protocol",
        subtitle: "How we collect, use, and protect your information at Elite Steel Concepts."
    },
    legacy: { seoPage: "privacy", seoSection: "header", fields: { title: "title", subtitle: "subtitle" } }
});

export const PRIVACY_CONTENT = defineSection({
    key: "privacy.content",
    label: "Main Policy Text",
    description: "Revision line, numbered heading and the main policy paragraph.",
    fields: [
        { name: "revisionLabel", label: "Revision Label", type: "text", help: "Today's date is shown after this label." },
        { name: "statusLabel", label: "Status Badge", type: "text" },
        { name: "title", label: "Heading", type: "text" },
        { name: "body", label: "Policy Text", type: "textarea", rows: 16 }
    ],
    defaults: {
        revisionLabel: "Document Revision:",
        statusLabel: "Active Compliance",
        title: "Information Governance",
        body: "At Elite Steel Concepts, we respect your privacy and are committed to protecting the personal data you share with us. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website."
    },
    legacy: { seoPage: "privacy", seoSection: "content", fields: { title: "title", body: "content" } }
});

export const PRIVACY_LISTS = defineSection({
    key: "privacy.lists",
    label: "Collection & Use Lists",
    description: "The two grey cards listing how data is collected and used.",
    fields: [
        { name: "collectionTitle", label: "Left Card Title", type: "text" },
        { name: "collectionItems", label: "Left Card Items", type: "strings", itemLabel: "Item" },
        { name: "usageTitle", label: "Right Card Title", type: "text" },
        { name: "usageItems", label: "Right Card Items", type: "strings", itemLabel: "Item" }
    ],
    defaults: {
        collectionTitle: "Collection Vectors",
        collectionItems: ["In-bound Quote Requests", "Project Consultation Forms", "Email Communications", "Analytics & Pixels"],
        usageTitle: "Utilization",
        usageItems: ["Accuracy in Fabrication Quotes", "Workflow Customization", "Safety & Compliance Notifications", "Security Auditing"]
    }
});

export const PRIVACY_POLICIES = defineSection({
    key: "privacy.policies",
    label: "Policy Clauses",
    description: "Short headed paragraphs (Data Sovereignty, Technical Safeguards…).",
    fields: [
        {
            name: "clauses",
            label: "Clauses",
            type: "list",
            itemLabel: "Clause",
            titleField: "title",
            fields: [
                { name: "title", label: "Heading", type: "text" },
                { name: "body", label: "Text", type: "textarea", rows: 3 }
            ]
        }
    ],
    defaults: {
        clauses: [
            { title: "Data Sovereignty", body: "We do not sell, trade, or otherwise transfer your personal information to outside parties. This does not include trusted partners who assist in operating our environment, provided they maintain strict confidentiality." },
            { title: "Technical Safeguards", body: "We implement multi-layered security protocols to maintain the safety of your information. While we strive for 100% protection, digital transmission carries inherent risks we mitigate through regular audits." }
        ]
    }
});

export const PRIVACY_CONTACT = defineSection({
    key: "privacy.contact",
    label: "Contact Box",
    description: "Dark contact box at the end of the policy (email and address come from Settings).",
    fields: [
        { name: "title", label: "Heading", type: "text" },
        { name: "entityLabel", label: "Company Label", type: "text" },
        { name: "entityName", label: "Company Name", type: "text" },
        { name: "emailLabel", label: "Email Label", type: "text" },
        { name: "addressLabel", label: "Address Label", type: "text" }
    ],
    defaults: {
        title: "Master Contact Interface",
        entityLabel: "Corporate Entity",
        entityName: "Elite Steel Concepts",
        emailLabel: "Global Email",
        addressLabel: "Physical Headquarters"
    }
});

export const privacyPage: PageDef = {
    id: "privacy",
    label: "Privacy Policy",
    icon: "Lock",
    path: "/privacy",
    sections: [PRIVACY_HEADER, PRIVACY_CONTENT, PRIVACY_LISTS, PRIVACY_POLICIES, PRIVACY_CONTACT]
};
