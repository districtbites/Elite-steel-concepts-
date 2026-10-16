"use server";

import { createNewsletter, getNewsletters, getSettings } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { sendNewsletterWelcome, sendNewsletterNotification } from "@/lib/mailer";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function submitNewsletter(formData: FormData) {
    const email = ((formData.get("email") as string | null) || "").trim().toLowerCase();

    if (!EMAIL_PATTERN.test(email)) {
        return { error: "Please provide a valid email address." };
    }

    try {
        const existing = await getNewsletters();
        if (existing.some(n => n.email.toLowerCase() === email)) {
            return { success: true, message: "You're already subscribed — thanks for being part of the club!" };
        }

        await createNewsletter(email);
        revalidatePath("/admin/newsletter");

        // Welcome the subscriber and notify the team (errors are logged, never fail the request)
        try {
            const settings = await getSettings();
            const results = await Promise.allSettled([
                sendNewsletterWelcome(settings, email),
                sendNewsletterNotification(settings, email, existing.length + 1),
            ]);
            results.forEach((result, i) => {
                if (result.status === "rejected") {
                    console.error(`[Newsletter] ${i === 0 ? "Welcome" : "Team notification"} email failed:`, result.reason);
                }
            });
        } catch (err) {
            console.error("[Newsletter] Email sending failed:", err);
        }

        return { success: true, message: "Welcome to the club! Check your inbox for a confirmation email." };
    } catch (error) {
        console.error("[Newsletter] Subscription failed:", error);
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
