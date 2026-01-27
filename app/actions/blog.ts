"use server";

import { createPost, deletePost, updatePost } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createBlogPost(formData: FormData) {
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const category = formData.get("category") as string;
    const status = formData.get("status") as "Published" | "Draft";
    const image = formData.get("image") as string;

    // Basic Slug generation
    const slug = title.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");

    // Mock Read Time calculation
    const readTime = `${Math.ceil(content.length / 1000)} Min Read`;

    // Create Date
    const date = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

    await createPost({
        title,
        content,
        category,
        status,
        image: image || "https://images.unsplash.com/photo-1565123409695-7b5ef63a48b9?q=80&w=800&auto=format&fit=crop", // Default image
        slug,
        date,
        readTime,
        excerpt: content.substring(0, 150) + "..."
    });

    revalidatePath("/blog");
    revalidatePath("/admin/blog");
    redirect("/admin/blog");
}

export async function deleteBlogPost(id: string) {
    await deletePost(id);
    revalidatePath("/blog");
    revalidatePath("/admin/blog");
}

export async function updateBlogPost(id: string, formData: FormData) {
    // Implementation similar to create but with updatePost
    // For now we just focus on Create/Delete for the verification flow
}
