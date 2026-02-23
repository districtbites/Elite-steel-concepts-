"use server";

import { createAsset, updateAsset, deleteAsset, getAssets } from "@/lib/db";
import { revalidatePath } from "next/cache";
import fs from "fs/promises";
import path from "path";

async function saveMediaAsset(file: File): Promise<string> {
    if (!file || file.size === 0) return "";

    // Strictly WebP as requested
    if (file.type !== "image/webp" && !file.name.toLowerCase().endsWith(".webp")) {
        throw new Error("Only WebP images are accepted. Please convert your images to .webp format.");
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const filename = `${Date.now()}-${file.name.toLowerCase().replace(/\s+/g, "-")}`;
    const projectRoot = process.cwd();
    const uploadDir = path.join(projectRoot, "public", "uploads", "media");
    const filepath = path.join(uploadDir, filename);

    try {
        await fs.mkdir(uploadDir, { recursive: true });
        await fs.writeFile(filepath, buffer);
    } catch (error: any) {
        throw new Error("Could not save the image on the server.");
    }

    return `/uploads/media/${filename}`;
}

export async function addMediaAsset(formData: FormData) {
    const alt = formData.get("alt") as string;
    const page = formData.get("page") as string;
    const location = formData.get("location") as string;
    const dimensions = formData.get("dimensions") as string;
    const imageFile = formData.get("image") as File;

    if (!imageFile || imageFile.size === 0) {
        return { error: "No image file provided" };
    }

    try {
        const url = await saveMediaAsset(imageFile);
        await createAsset({
            url,
            alt,
            page,
            location,
            dimensions
        });

        revalidatePath("/", "layout");
        revalidatePath("/admin/media");
        return { success: true };
    } catch (error: any) {
        return { error: error.message };
    }
}

export async function editMediaAsset(formData: FormData) {
    const id = formData.get("id") as string;
    const alt = formData.get("alt") as string;
    const page = formData.get("page") as string;
    const location = formData.get("location") as string;
    const dimensions = formData.get("dimensions") as string;

    if (!id) return { error: "Missing ID" };

    try {
        await updateAsset(id, {
            alt,
            page,
            location,
            dimensions
        });

        revalidatePath("/", "layout");
        revalidatePath("/admin/media");
        return { success: true };
    } catch (error: any) {
        return { error: error.message };
    }
}

export async function removeMediaAsset(id: string) {
    if (!id) return { error: "Missing ID" };

    try {
        const assets = await getAssets();
        const asset = assets.find(a => a.id === id);

        if (asset && asset.url.startsWith("/uploads/")) {
            const filepath = path.join(process.cwd(), "public", asset.url);
            await fs.unlink(filepath).catch(() => { });
        }

        await deleteAsset(id);
        revalidatePath("/", "layout");
        revalidatePath("/admin/media");
        return { success: true };
    } catch (error: any) {
        return { error: error.message };
    }
}
