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
