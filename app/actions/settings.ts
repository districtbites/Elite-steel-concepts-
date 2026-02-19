"use server";

import { updateSettings, updateSEO } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function saveSettings(formData: FormData) {
    const updates = {
        email: formData.get("email") as string,
        phone: formData.get("phone") as string,
        address: formData.get("address") as string,
        instagram: formData.get("instagram") as string,
        facebook: formData.get("facebook") as string,
        twitter: formData.get("twitter") as string,
    };

    await updateSettings(updates);
    revalidatePath("/admin/settings");
}

export async function saveSEO(formData: FormData) {
    const pages: { [key: string]: { title: string; description: string; keywords: string } } = {};

    // Extract page specific SEO
    const pageKeys = ["home", "about", "services", "portfolio", "process", "blog", "contact", "quote"];
    pageKeys.forEach(key => {
        pages[key] = {
            title: formData.get(`page_${key}_title`) as string,
            description: formData.get(`page_${key}_description`) as string,
            keywords: formData.get(`page_${key}_keywords`) as string,
        };
    });

    const updates = {
        siteTitle: formData.get("siteTitle") as string,
        description: formData.get("description") as string,
        keywords: formData.get("keywords") as string,
        ogImage: formData.get("ogImage") as string,
        twitterHandle: formData.get("twitterHandle") as string,
        robotsTxt: formData.get("robotsTxt") as string,
        canonicalUrl: formData.get("canonicalUrl") as string,
        pages
    };

    await updateSEO(updates);
    revalidatePath("/admin/seo");
    revalidatePath("/", "layout"); // Revalidate all public pages

    return { success: true, message: "SEO Master Config Saved Successfully!" };
}
