"use server";

import { createContact, getSettings } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { sendContactNotification } from "@/lib/mailer";

export async function submitContactForm(formData: FormData) {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const message = formData.get("message") as string;

    if (!name || !email || !message) {
        return { error: "Missing required fields" };
    }

    const newContact = await createContact({
        name,
        email,
        phone,
        message
    });

    // Send email notification (non-blocking — errors won't fail the request)
    try {
        const settings = await getSettings();
        await sendContactNotification(settings, newContact);
    } catch (err) {
        console.error("[Contact] Email notification failed:", err);
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
