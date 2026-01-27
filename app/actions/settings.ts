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
    return { success: true };
}

export async function saveSEO(formData: FormData) {
    const updates = {
        siteTitle: formData.get("siteTitle") as string,
        description: formData.get("description") as string,
        keywords: formData.get("keywords") as string,
        ogImage: formData.get("ogImage") as string,
        twitterHandle: formData.get("twitterHandle") as string,
        robotsTxt: formData.get("robotsTxt") as string,
        canonicalUrl: formData.get("canonicalUrl") as string,
    };

    await updateSEO(updates);
    revalidatePath("/admin/seo");
    return { success: true };
}
