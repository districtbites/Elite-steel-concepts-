"use server";

import { createQuote, Quote, getSettings } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { sendQuoteNotification } from "@/lib/mailer";

export async function submitQuoteForm(formData: FormData) {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const company = formData.get("company") as string;

    const projectType = formData.get("projectType") as string;
    const sourcing = formData.get("sourcing") as string;
    const budget = formData.get("budget") as string;
    const timeline = formData.get("timeline") as string;
    const menuType = formData.get("menuType") as string;
    const message = formData.get("message") as string;

    // New Fields
    const dimensions = formData.get("dimensions") as string;
    const equipment = formData.get("equipment") as string;
    const brandingNeeds = formData.get("brandingNeeds") as string;
    const powerRequirements = formData.get("powerRequirements") as string;
    const services = formData.getAll("services") as string[];

    if (!name || !email) {
        return { error: "Missing required fields" };
    }

    const newQuote = await createQuote({
        name,
        email,
        phone,
        company,
        projectType,
        sourcing,
        budget,
        timeline,
        menuType,
        message,
        dimensions,
        equipment,
        brandingNeeds,
        powerRequirements,
        services
    });

    // Send email notification (non-blocking — errors won't fail the request)
    try {
        const settings = await getSettings();
        await sendQuoteNotification(settings, newQuote);
    } catch (err) {
        console.error("[Quote] Email notification failed:", err);
    }

    revalidatePath("/admin");
    revalidatePath("/admin/quotes");

    return { success: true };
}

export async function updateQuoteStatus(id: string, status: Quote["status"]) {
    const { updateQuote } = await import("@/lib/db");
    await updateQuote(id, { status });
    revalidatePath("/admin");
    revalidatePath("/admin/quotes");
}

export async function removeQuote(id: string) {
    const { deleteQuote } = await import("@/lib/db");
    await deleteQuote(id);
    revalidatePath("/admin");
    revalidatePath("/admin/quotes");
}
