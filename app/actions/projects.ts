"use server";

import { createProject, updateProject, deleteProject } from "@/lib/db";
import { revalidatePath } from "next/cache";
import fs from "fs/promises";
import path from "path";

// Redundant UPLOAD_DIR removed

async function saveImage(file: File): Promise<string> {
    if (!file || file.size === 0) return "";

    const allowedTypes = ["image/webp", "image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
        throw new Error(`Only WebP, JPEG, and PNG images are allowed. Got: ${file.type}`);
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename while preserving extension
    const ext = path.extname(file.name) || (file.type === "image/webp" ? ".webp" : ".jpg");
    // Ensure extension is lowercase for consistency
    const cleanExt = ext.toLowerCase();
    const filename = `${Date.now()}-${file.name.toLowerCase().replace(/\s+/g, "-").replace(cleanExt, "")}${cleanExt}`;

    // Use absolute path for saving
    const projectRoot = process.cwd();
    const uploadDir = path.join(projectRoot, "public", "uploads", "projects");
    const filepath = path.join(uploadDir, filename);

    try {
        await fs.mkdir(uploadDir, { recursive: true });
        await fs.writeFile(filepath, buffer);
        console.log(`[Upload Success] Saved image to: ${filepath}`);
    } catch (error: any) {
        console.error(`[Upload Error] Failed to save image: ${error.message}`);
        throw new Error("Could not save the image on the server. Please check folder permissions.");
    }

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
    const tagline = formData.get("tagline") as string;
    const description = formData.get("description") as string;
    const category = formData.get("category") as string;
    const imageFile = formData.get("image") as File;
    const client = formData.get("client") as string;
    const completionDate = formData.get("completionDate") as string;
    const location = formData.get("location") as string;
    const featured = formData.get("featured") === "on";

    // Technical Specs
    const dimensions = formData.get("dimensions") as string;
    const chassis = formData.get("chassis") as string;
    const power = formData.get("power") as string;
    const equipmentStr = formData.get("equipment") as string;
    const equipment = equipmentStr ? JSON.parse(equipmentStr) : [];

    // Gallery Files
    const galleryFiles = formData.getAll("galleryFiles") as File[];

    if (!title || !imageFile) {
        return { error: "Missing required fields" };
    }

    let imageUrl = "";
    try {
        imageUrl = await saveImage(imageFile);
    } catch (error: any) {
        return { error: error.message };
    }

    const galleryUrls: string[] = [];
    for (const file of galleryFiles) {
        if (file.size > 0) {
            try {
                const url = await saveImage(file);
                galleryUrls.push(url);
            } catch (e) {
                console.error("Gallery upload error:", e);
            }
        }
    }

    const slug = generateSlug(title);

    await createProject({
        title,
        tagline,
        slug,
        description,
        category,
        image: imageUrl,
        gallery: galleryUrls,
        client,
        completionDate,
        location,
        featured,
        specifications: {
            dimensions,
            chassis,
            power,
            equipment
        }
    });

    revalidatePath("/portfolio");
    revalidatePath("/admin/portfolio");
    revalidatePath("/sitemap.xml");
    revalidatePath("/", "layout"); // Home might show featured projects
    return { success: true };
}

export async function editProject(formData: FormData) {
    const id = formData.get("id") as string;
    const title = formData.get("title") as string;
    const tagline = formData.get("tagline") as string;
    const description = formData.get("description") as string;
    const category = formData.get("category") as string;
    const imageFile = formData.get("image") as File;
    const client = formData.get("client") as string;
    const completionDate = formData.get("completionDate") as string;
    const location = formData.get("location") as string;
    const featured = formData.get("featured") === "on";
    const existingImage = formData.get("existingImage") as string;

    // Gallery Management
    const existingGalleryStr = formData.get("existingGallery") as string;
    const existingGallery = existingGalleryStr ? JSON.parse(existingGalleryStr) : [];
    const galleryFiles = formData.getAll("galleryFiles") as File[];

    // Technical Specs
    const dimensions = formData.get("dimensions") as string;
    const chassis = formData.get("chassis") as string;
    const power = formData.get("power") as string;
    const equipmentStr = formData.get("equipment") as string;
    const equipment = equipmentStr ? JSON.parse(equipmentStr) : [];

    if (!id) return { error: "Missing ID" };

    let imageUrl = existingImage;
    if (imageFile && imageFile.size > 0) {
        try {
            imageUrl = await saveImage(imageFile);
        } catch (error: any) {
            return { error: error.message };
        }
    }

    const newGalleryUrls: string[] = [...existingGallery];
    for (const file of galleryFiles) {
        if (file.size > 0) {
            try {
                const url = await saveImage(file);
                newGalleryUrls.push(url);
            } catch (e) {
                console.error("Gallery upload error:", e);
            }
        }
    }

    const slug = generateSlug(title);

    await updateProject(id, {
        title,
        tagline,
        slug,
        description,
        category,
        image: imageUrl,
        gallery: newGalleryUrls,
        client,
        completionDate,
        location,
        featured,
        specifications: {
            dimensions,
            chassis,
            power,
            equipment
        }
    });

    revalidatePath("/portfolio");
    revalidatePath(`/portfolio/${slug}`);
    revalidatePath("/admin/portfolio");
    revalidatePath("/sitemap.xml");
    revalidatePath("/", "layout");
    return { success: true };
}

export async function removeProject(id: string) {
    if (!id) return { error: "Missing ID" };

    const { getProjectById } = await import("@/lib/db");
    const project = await getProjectById(id);

    if (project) {
        // Delete main image
        if (project.image && project.image.startsWith("/uploads/")) {
            const imagePath = path.join(process.cwd(), "public", project.image);
            await fs.unlink(imagePath).catch(() => { });
        }
        // Delete gallery images
        if (project.gallery) {
            for (const img of project.gallery) {
                if (img.startsWith("/uploads/")) {
                    const imgPath = path.join(process.cwd(), "public", img);
                    await fs.unlink(imgPath).catch(() => { });
                }
            }
        }
    }

    await deleteProject(id);
    revalidatePath("/portfolio");
    revalidatePath("/admin/portfolio");
    revalidatePath("/sitemap.xml");
    revalidatePath("/", "layout");
    return { success: true };
}
