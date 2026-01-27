"use server";

import { createProject, updateProject, deleteProject } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function addProject(formData: FormData) {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const category = formData.get("category") as string;
    const image = formData.get("image") as string;
    const client = formData.get("client") as string;
    const completionDate = formData.get("completionDate") as string;

    if (!title || !image) {
        return { error: "Missing required fields" };
    }

    await createProject({
        title,
        description,
        category,
        image,
        client,
        completionDate
    });

    revalidatePath("/portfolio");
    revalidatePath("/admin/portfolio");
    return { success: true };
}

export async function editProject(formData: FormData) {
    const id = formData.get("id") as string;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const category = formData.get("category") as string;
    const image = formData.get("image") as string;
    const client = formData.get("client") as string;
    const completionDate = formData.get("completionDate") as string;

    if (!id) return { error: "Missing ID" };

    await updateProject(id, {
        title,
        description,
        category,
        image,
        client,
        completionDate
    });

    revalidatePath("/portfolio");
    revalidatePath("/admin/portfolio");
    // Also revalidate the specific project page if it exists (we might need to know the slug/ID in URL)
    // For now, revalidating the list is key.
    return { success: true };
}

export async function removeProject(id: string) {
    if (!id) return { error: "Missing ID" };

    await deleteProject(id);
    revalidatePath("/portfolio");
    revalidatePath("/admin/portfolio");
    return { success: true };
}
