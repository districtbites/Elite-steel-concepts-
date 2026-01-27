"use server";

import { createContact } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function submitContactForm(formData: FormData) {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const message = formData.get("message") as string;

    if (!name || !email || !message) {
        return { error: "Missing required fields" };
    }

    await createContact({
        name,
        email,
        phone,
        message
    });

    revalidatePath("/admin");
    revalidatePath("/admin/contacts");

    return { success: true };
}
