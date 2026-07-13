"use server";

import { createTestimonial, updateTestimonial, deleteTestimonial } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function addTestimonial(formData: FormData) {
    const clientName = formData.get("clientName") as string;
    const content = formData.get("content") as string;
    const rating = Number(formData.get("rating"));
    const role = formData.get("role") as string;
    const company = formData.get("company") as string;
    const image = formData.get("image") as string; // Optional image URL

    if (!clientName || !content || !rating) {
        return { error: "Missing required fields" };
    }

    await createTestimonial({
        clientName,
        content,
        rating,
        role,
        company,
        image
    });

    revalidatePath("/testimonials");
    revalidatePath("/admin/testimonials");
    revalidatePath("/");
    return { success: true };
}

export async function editTestimonial(formData: FormData) {
    const id = formData.get("id") as string;
    const clientName = formData.get("clientName") as string;
    const content = formData.get("content") as string;
    const rating = Number(formData.get("rating"));
    const role = formData.get("role") as string;
    const company = formData.get("company") as string;
    const image = formData.get("image") as string;

    if (!id) return { error: "Missing ID" };

    await updateTestimonial(id, {
        clientName,
        content,
        rating,
        role,
        company,
        image
    });

    revalidatePath("/testimonials");
    revalidatePath("/admin/testimonials");
    revalidatePath("/");
    return { success: true };
}

export async function removeTestimonial(id: string) {
    if (!id) return { error: "Missing ID" };

    await deleteTestimonial(id);
    revalidatePath("/testimonials");
    revalidatePath("/admin/testimonials");
    revalidatePath("/");
    return { success: true };
}
