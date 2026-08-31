import React from "react";
export const dynamic = "force-dynamic";

import {
    getInternalLinkRules,
    getInternalLinkSettings,
    getPosts,
    getLocations,
    getProjects
} from "@/lib/db";
import { generateLinkAuditReport } from "@/lib/internalLinks";
import InternalLinksManager from "@/components/admin/InternalLinksManager";

export default async function AdminInternalLinksPage() {
    const rules = await getInternalLinkRules();
    const settings = await getInternalLinkSettings();
    const posts = await getPosts();
    const locations = await getLocations();
    const projects = await getProjects();

    const audit = generateLinkAuditReport(posts, rules, settings);

    // Build available target routes for easy selection
    const availableRoutes = [
        { name: "Homepage (/)", url: "/", category: "Core" },
        { name: "Quote Request (/quote)", url: "/quote", category: "Conversion" },
        { name: "Contact Us (/contact)", url: "/contact", category: "Conversion" },
        { name: "Compliance Hub (/compliance)", url: "/compliance", category: "Authority" },
        { name: "Build Process (/process)", url: "/process", category: "Authority" },
        { name: "Portfolio Hub (/portfolio)", url: "/portfolio", category: "Authority" },
        { name: "About Us (/about)", url: "/about", category: "Authority" },
        { name: "Testimonials (/testimonials)", url: "/testimonials", category: "Authority" },
        { name: "Locations Directory (/locations)", url: "/locations", category: "Locations" },

        // Service Subpages
        { name: "Custom Food Trucks", url: "/services/custom-food-trucks", category: "Services" },
        { name: "Custom Food Trailers", url: "/services/custom-food-trailers", category: "Services" },
        { name: "Repairs & Upgrades", url: "/services/repairs-and-upgrades", category: "Services" },
        { name: "Design & Consultation", url: "/services/design-and-consultation", category: "Services" },
        { name: "Fleet Expansion", url: "/services/fleet-expansion", category: "Services" },
        { name: "All Services (/services)", url: "/services", category: "Services" },

        // Key Locations
        ...locations.map(l => ({
            name: `${l.city}, ${l.state}`,
            url: `/locations/${l.slug}`,
            category: "Locations"
        })),

        // Key Projects
        ...projects.map(p => ({
            name: `Project: ${p.title}`,
            url: `/portfolio/${p.slug}`,
            category: "Portfolio"
        }))
    ];

    return (
        <div className="max-w-[1600px] mx-auto">
            <InternalLinksManager
                initialRules={rules}
                initialSettings={settings}
                initialAudit={audit}
                availableRoutes={availableRoutes}
            />
        </div>
    );
}
