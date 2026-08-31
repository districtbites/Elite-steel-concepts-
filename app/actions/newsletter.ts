"use server";

import { createNewsletter } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function submitNewsletter(formData: FormData) {
    const email = formData.get("email") as string;

    if (!email || !email.includes("@")) {
        return { error: "Please provide a valid email address." };
    }

    try {
        await createNewsletter(email);
        revalidatePath("/admin/newsletter");
        return { success: true, message: "Welcome to the club! Your email has been submitted." };
    } catch (error) {
        return { error: "Something went wrong. Please try again later." };
    }
}

export async function removeNewsletter(id: string) {
    const { deleteNewsletter } = await import("@/lib/db");
    await deleteNewsletter(id);
    revalidatePath("/admin/newsletter");
}

export async function sendNewsletterCampaign(formData: FormData) {
    const subject = formData.get("subject") as string;
    const headerOverride = formData.get("headerOverride") as string;
    const message = formData.get("message") as string;

    if (!subject || !message) {
        return { error: "Subject and message are required." };
    }

    const { getNewsletters, getSettings } = await import("@/lib/db");
    const { sendNewsletterBlast } = await import("@/lib/mailer");

    const subscribers = await getNewsletters();
    const emails = subscribers.map(s => s.email);

    if (emails.length === 0) {
        return { error: "No subscribers found to send to." };
    }

    const settings = await getSettings();

    try {
        const result = await sendNewsletterBlast(settings, subject, headerOverride, message, emails);
        if (!result.success) {
            return { error: result.error || "Failed to send blast." };
        }
        return { success: true, message: `Successfully sent to ${result.sent} subscribers.` };
    } catch (err) {
        console.error(err);
        return { error: "An unexpected error occurred while sending the campaign." };
    }
}
