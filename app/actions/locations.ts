"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { 
    createLocation, 
    updateLocation, 
    deleteLocation as dbDeleteLocation,
    type LocationEntry 
} from "@/lib/db";

export async function saveLocation(formData: FormData) {
    const id = formData.get("id") as string;
    
    // Parse FAQ (expecting JSON string)
    let faq = [];
    try {
        faq = JSON.parse((formData.get("faq") as string) || "[]");
    } catch (e) {
        faq = [];
    }
    
    // Parse Local Details (expecting JSON string)
    let localDetails = [];
    try {
        localDetails = JSON.parse((formData.get("localDetails") as string) || "[]");
    } catch (e) {
        localDetails = [];
    }

    const locationData: Omit<LocationEntry, 'id'> = {
        slug: (formData.get("slug") as string || "").toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
        city: formData.get("city") as string,
        state: formData.get("state") as string,
        h1: formData.get("h1") as string,
        intro: formData.get("intro") as string,
        ctaText: formData.get("ctaText") as string,
        distance: formData.get("distance") as string,
        whyEsc: formData.get("whyEsc") as string,
        localDetails: localDetails,
        faq: faq,
        sections: {
            design: {
                heading: formData.get("sections.design.heading") as string || "",
                content: formData.get("sections.design.content") as string || "",
            },
            fabrication: {
                heading: formData.get("sections.fabrication.heading") as string || "",
                content: formData.get("sections.fabrication.content") as string || "",
            },
            delivery: {
                heading: formData.get("sections.delivery.heading") as string || "",
                content: formData.get("sections.delivery.content") as string || "",
            }
        },
        titleTag: formData.get("titleTag") as string,
        metaDescription: formData.get("metaDescription") as string,
        // Checkbox: only present in FormData when checked
        published: formData.get("published") === "true",
    };

    if (id) {
        await updateLocation(id, locationData);
    } else {
        await createLocation(locationData);
    }

    revalidatePath("/admin/locations");
    revalidatePath(`/locations/${locationData.slug}`);
    revalidatePath("/locations");
    revalidatePath("/sitemap.xml");

    redirect("/admin/locations");
}

export async function deleteLocation(id: string) {
    await dbDeleteLocation(id);
    revalidatePath("/admin/locations");
    revalidatePath("/locations");
    revalidatePath("/sitemap.xml");
}
