"use server";

import { createProject, updateProject, deleteProject } from "@/lib/db";
import { revalidatePath } from "next/cache";
import fs from "fs/promises";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "public/uploads/projects");

async function saveImage(file: File): Promise<string> {
    if (!file || file.size === 0) return "";

    // Validate webp
    if (file.type !== "image/webp") {
        throw new Error("Only WebP images are allowed.");
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const filename = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
    const filepath = path.join(UPLOAD_DIR, filename);

    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    await fs.writeFile(filepath, buffer);

    return `/uploads/projects/${filename}`;
}

function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "") // Remove non-word chars
        .replace(/\s+/g, "-") // Replace spaces with -
        .replace(/--+/g, "-") // Replace multiple - with single -
        .replace(/^-+|-+$/g, ""); // Remove trailing/leading dashes
}

export async function addProject(formData: FormData) {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const category = formData.get("category") as string;
    const imageFile = formData.get("image") as File;
    const client = formData.get("client") as string;
    const completionDate = formData.get("completionDate") as string;

    if (!title || !imageFile) {
        return { error: "Missing required fields" };
    }

    let imageUrl = "";
    try {
        imageUrl = await saveImage(imageFile);
    } catch (error: any) {
        return { error: error.message };
    }

    const slug = generateSlug(title);

    await createProject({
        title,
        slug,
        description,
        category,
        image: imageUrl,
        client,
        completionDate
    });

    revalidatePath("/portfolio");
    revalidatePath("/admin/portfolio");
    revalidatePath("/sitemap.xml");
    return { success: true };
}

export async function editProject(formData: FormData) {
    const id = formData.get("id") as string;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const category = formData.get("category") as string;
    const imageFile = formData.get("image") as File;
    const client = formData.get("client") as string;
    const completionDate = formData.get("completionDate") as string;
    const existingImage = formData.get("existingImage") as string;

    if (!id) return { error: "Missing ID" };

    let imageUrl = existingImage;
    if (imageFile && imageFile.size > 0) {
        try {
            imageUrl = await saveImage(imageFile);
            // Delete old image if it's a local file
            if (existingImage && existingImage.startsWith("/uploads/")) {
                const oldPath = path.join(process.cwd(), "public", existingImage);
                await fs.unlink(oldPath).catch(() => { }); // Ignore error if file doesn't exist
            }
        } catch (error: any) {
            return { error: error.message };
        }
    }

    const slug = generateSlug(title);

    await updateProject(id, {
        title,
        slug,
        description,
        category,
        image: imageUrl,
        client,
        completionDate
    });

    revalidatePath("/portfolio");
    revalidatePath("/admin/portfolio");
    revalidatePath("/sitemap.xml");
    return { success: true };
}

export async function removeProject(id: string) {
    if (!id) return { error: "Missing ID" };

    const { getProjectById } = await import("@/lib/db");
    const project = await getProjectById(id);

    if (project && project.image && project.image.startsWith("/uploads/")) {
        const imagePath = path.join(process.cwd(), "public", project.image);
        await fs.unlink(imagePath).catch(() => { });
    }

    await deleteProject(id);
    revalidatePath("/portfolio");
    revalidatePath("/admin/portfolio");
    revalidatePath("/sitemap.xml");
    return { success: true };
}
