"use server";

import { createContact, getSettings } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { sendContactNotification, sendContactConfirmation } from "@/lib/mailer";

export async function submitContactForm(formData: FormData) {
    const name = (formData.get("name") as string | null)?.trim();
    const email = (formData.get("email") as string | null)?.trim();
    const phone = (formData.get("phone") as string | null)?.trim();
    const message = (formData.get("message") as string | null)?.trim();

    if (!name || !email || !phone || !message) {
        return { error: "Missing required fields" };
    }

    const newContact = await createContact({
        name,
        email,
        phone,
        message
    });

    // Notify the team and confirm to the customer (errors are logged, never fail the request)
    try {
        const settings = await getSettings();
        const results = await Promise.allSettled([
            sendContactNotification(settings, newContact),
            sendContactConfirmation(settings, newContact),
        ]);
        results.forEach((result, i) => {
            if (result.status === "rejected") {
                console.error(`[Contact] ${i === 0 ? "Team notification" : "Customer confirmation"} email failed:`, result.reason);
            }
        });
    } catch (err) {
        console.error("[Contact] Email sending failed:", err);
    }

    revalidatePath("/admin");
    revalidatePath("/admin/contacts");

    return { success: true };
}

export async function updateContactStatus(id: string, status: "New" | "Read") {
    const { updateContact } = await import("@/lib/db");
    await updateContact(id, { status });
    revalidatePath("/admin");
    revalidatePath("/admin/contacts");
}

export async function removeContact(id: string) {
    const { deleteContact } = await import("@/lib/db");
    await deleteContact(id);
    revalidatePath("/admin");
    revalidatePath("/admin/contacts");
}
