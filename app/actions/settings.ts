"use server";

import { getSettings, updateSettings, updateSEO } from "@/lib/db";
import { revalidatePath } from "next/cache";

// Helper to revalidate ALL public-facing pages so changes show up immediately
function revalidateAllPublicPages() {
    const publicPaths = [
        "/",
        "/about",
        "/services",
        "/services/custom-food-trucks",
        "/services/custom-food-trailers",
        "/portfolio",
        "/process",
        "/blog",
        "/contact",
        "/quote",
        "/testimonials",
        "/privacy",
        "/terms",
    ];
    publicPaths.forEach((p) => revalidatePath(p));
    // Also revalidate the layout tree for metadata inheritance
    revalidatePath("/", "layout");
}

/**
 * Save settings — ONLY updates fields that are actually present in the FormData.
 * This prevents hidden/inactive sections from being overwritten with null.
 * When a section is not rendered in the DOM, its inputs aren't in the FormData,
 * so we skip those keys entirely and preserve the existing DB values.
 */
export async function saveSettings(formData: FormData) {
    const currentSettings = await getSettings();

    // Build updates by merging current settings with only the fields present in formData
    const stringFields = [
        "email", "phone", "address", "businessHours", "logoUrl",
        "salesEmail", "supportEmail", "whatsappPhone",
        "instagram", "facebook", "twitter", "linkedin", "youtube",
        "taxId", "certifications",
        "primaryColor", "secondaryColor", "accentColor",
        "googleMapsLink", "mapEmbedUrl",
        "googleAnalyticsId", "facebookPixelId", "tiktokPixelId",
        "smtpHost", "smtpUser", "smtpPassword", "smtpFrom", "notificationEmail",
    ] as const;

    const numberFields = [
        "trucksBuiltCount", "experienceYears", "smtpPort",
    ] as const;

    const booleanFields = [
        "maintenanceMode", "smtpSecure",
    ] as const;

    // Start from current settings so nothing gets wiped
    const updates: Record<string, unknown> = { ...currentSettings };

    // Only override string fields that are ACTUALLY in the submitted formData
    for (const key of stringFields) {
        if (formData.has(key)) {
            updates[key] = formData.get(key) as string;
        }
    }

    // Only override number fields that are ACTUALLY in the submitted formData
    for (const key of numberFields) {
        if (formData.has(key)) {
            const raw = formData.get(key) as string;
            updates[key] = parseInt(raw || "0", 10);
        }
    }

    // Only override boolean fields that are ACTUALLY in the submitted formData
    for (const key of booleanFields) {
        if (formData.has(key)) {
            updates[key] = formData.get(key) === "true";
        }
    }

    await updateSettings(updates);
    revalidatePath("/admin/settings");
    revalidateAllPublicPages();
    return { success: true, message: "Global Settings Updated!" };
}

// FAQ Actions
export async function addFAQ(formData: FormData) {
    const { createFAQ } = await import("@/lib/db");
    const question = formData.get("question") as string;
    const answer = formData.get("answer") as string;
    const category = formData.get("category") as string;
    const order = parseInt(formData.get("order") as string || "0");

    await createFAQ({ question, answer, category, order });
    revalidatePath("/admin/faqs");
    revalidateAllPublicPages();
    return { success: true };
}

export async function editFAQ(formData: FormData) {
    const { updateFAQ } = await import("@/lib/db");
    const id = formData.get("id") as string;
    const question = formData.get("question") as string;
    const answer = formData.get("answer") as string;
    const category = formData.get("category") as string;
    const order = parseInt(formData.get("order") as string || "0");

    await updateFAQ(id, { question, answer, category, order });
    revalidatePath("/admin/faqs");
    revalidateAllPublicPages();
    return { success: true };
}

export async function removeFAQ(id: string) {
    const { deleteFAQ } = await import("@/lib/db");
    await deleteFAQ(id);
    revalidatePath("/admin/faqs");
    revalidateAllPublicPages();
    return { success: true };
}

export async function saveGlobalSEO(formData: FormData) {
    const { getSEO, updateSEO } = await import("@/lib/db");
    const currentSEO = await getSEO();

    const updates = {
        siteTitle: (formData.get("siteTitle") as string) ?? currentSEO.siteTitle,
        description: (formData.get("description") as string) ?? currentSEO.description,
        keywords: (formData.get("keywords") as string) ?? currentSEO.keywords,
        ogImage: (formData.get("ogImage") as string) ?? currentSEO.ogImage,
        twitterHandle: (formData.get("twitterHandle") as string) ?? currentSEO.twitterHandle,
        robotsTxt: (formData.get("robotsTxt") as string) ?? currentSEO.robotsTxt,
        canonicalUrl: (formData.get("canonicalUrl") as string) ?? currentSEO.canonicalUrl,
        pages: currentSEO.pages || {}
    };

    await updateSEO(updates);
    revalidatePath("/admin/seo");
    revalidateAllPublicPages();
    return { success: true, message: "Global SEO Master Config Synchronized!" };
}

export async function savePageSEO(pageId: string, formData: FormData) {
    const { getSEO, updateSEO } = await import("@/lib/db");
    const currentSEO = await getSEO();
    const pages = { ...(currentSEO.pages || {}) };

    pages[pageId] = {
        title: (formData.get(`page_${pageId}_title`) as string) || "",
        description: (formData.get(`page_${pageId}_description`) as string) || "",
        keywords: (formData.get(`page_${pageId}_keywords`) as string) || "",
        imageAlts: {},
        sections: {},
        structuredData: (formData.get(`page_${pageId}_structuredData`) as string) || ""
    };

    // Extract image alts and sections
    for (const [key, value] of formData.entries()) {
        const strVal = value as string;
        if (key.startsWith(`page_${pageId}_alt_`)) {
            const altKey = key.replace(`page_${pageId}_alt_`, "");
            if (!pages[pageId].imageAlts) pages[pageId].imageAlts = {};
            pages[pageId].imageAlts![altKey] = strVal;
        }

        // Example key: page_home_section_hero_title
        const sectionMatch = key.match(new RegExp(`^page_${pageId}_section_(.*)_(title|subtitle|content|ctaText)$`));
        if (sectionMatch) {
            const sectionKey = sectionMatch[1];
            const field = sectionMatch[2];
            if (!pages[pageId].sections) pages[pageId].sections = {};
            if (!pages[pageId].sections![sectionKey]) pages[pageId].sections![sectionKey] = {};
            (pages[pageId].sections![sectionKey] as any)[field] = strVal;
        }
    }

    await updateSEO({ ...currentSEO, pages });
    revalidatePath("/admin/seo");
    revalidateAllPublicPages();
    return { success: true, message: `SEO Config for "${pageId}" deployed to live site!` };
}

export async function saveSEO(formData: FormData) {
    const { getSEO, updateSEO } = await import("@/lib/db");
    const currentSEO = await getSEO();
    const pages = { ...(currentSEO.pages || {}) };

    for (const [key, value] of formData.entries()) {
        const strValue = value as string;
        if (key.startsWith("page_") && key.endsWith("_title")) {
            const pageId = key.replace("page_", "").replace("_title", "");
            if (!pages[pageId]) pages[pageId] = { title: "", description: "", keywords: "", imageAlts: {} };
            pages[pageId].title = strValue;
        }
        if (key.startsWith("page_") && key.endsWith("_description")) {
            const pageId = key.replace("page_", "").replace("_description", "");
            if (!pages[pageId]) pages[pageId] = { title: "", description: "", keywords: "", imageAlts: {} };
            pages[pageId].description = strValue;
        }
        if (key.startsWith("page_") && key.endsWith("_keywords")) {
            const pageId = key.replace("page_", "").replace("_keywords", "");
            if (!pages[pageId]) pages[pageId] = { title: "", description: "", keywords: "", imageAlts: {} };
            pages[pageId].keywords = strValue;
        }
        if (key.startsWith("page_") && key.includes("_alt_")) {
            const match = key.match(/^page_(.*)_alt_(.*)$/);
            if (match) {
                const pageId = match[1];
                const altKey = match[2];
                if (!pages[pageId]) pages[pageId] = { title: "", description: "", keywords: "", imageAlts: {} };
                if (!pages[pageId].imageAlts) pages[pageId].imageAlts = {};
                pages[pageId].imageAlts[altKey] = strValue;
            }
        }
    }

    const updates = {
        ...currentSEO,
        siteTitle: (formData.get("siteTitle") as string) || currentSEO.siteTitle,
        description: (formData.get("description") as string) || currentSEO.description,
        keywords: (formData.get("keywords") as string) || currentSEO.keywords,
        ogImage: (formData.get("ogImage") as string) || currentSEO.ogImage,
        twitterHandle: (formData.get("twitterHandle") as string) || currentSEO.twitterHandle,
        robotsTxt: (formData.get("robotsTxt") as string) || currentSEO.robotsTxt,
        canonicalUrl: (formData.get("canonicalUrl") as string) || currentSEO.canonicalUrl,
        pages
    };

    await updateSEO(updates);
    revalidatePath("/admin/seo");
    revalidateAllPublicPages();
    return { success: true, message: "SEO Master Config Synchronized Successfully!" };
}

/**
 * Test SMTP connection by sending a test email
 */
export async function testSmtpConnection() {
    try {
        const settings = await getSettings();

        if (!settings.smtpUser || !settings.smtpPassword) {
            return { success: false, message: "SMTP credentials are not configured. Save your SMTP settings first." };
        }

        const { sendTestEmail } = await import("@/lib/mailer");
        await sendTestEmail(settings);

        return { success: true, message: `Test email sent to ${settings.notificationEmail || "esteelquotes@gmail.com"}!` };
    } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        console.error("[SMTP Test] Failed:", errorMessage);
        return { success: false, message: `SMTP test failed: ${errorMessage}` };
    }
}

/**
 * Force refresh the sitemap
 */
export async function updateSitemap() {
    revalidatePath("/sitemap.xml");
    revalidatePath("/sitemap.ts");
    revalidatePath("/", "layout");
    return { success: true, message: "Sitemap updated successfully with all new links!" };
}
