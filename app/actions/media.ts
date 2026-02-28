"use server";

import { createAsset, updateAsset, deleteAsset, getAssets } from "@/lib/db";
import { revalidatePath } from "next/cache";
import fs from "fs/promises";
import path from "path";

// ─── All public paths that consume media assets ───
const MEDIA_CONSUMING_PATHS = [
    "/",
    "/about",
    "/services",
    "/services/custom-food-trucks",
    "/services/custom-food-trailers",
    "/portfolio",
    "/blog",
    "/contact",
    "/testimonials",
    "/quote",
    "/process",
];

/** Revalidate every page that could display a media asset */
function revalidateAllMediaPaths() {
    // Broad layout-level revalidation
    revalidatePath("/", "layout");
    // Revalidate the admin media page
    revalidatePath("/admin/media");
    // Revalidate each individual public page
    for (const p of MEDIA_CONSUMING_PATHS) {
        revalidatePath(p, "page");
    }
}

/**
 * Optimize WebP image buffer using Sharp (resize large images, re-compress).
 * Since we only accept WebP, no format conversion is needed — just resize & compress.
 */
async function optimizeImage(buffer: Buffer): Promise<Buffer> {
    try {
        const sharp = (await import("sharp")).default;
        const metadata = await sharp(buffer).metadata();
        const width = metadata.width || 0;

        // If image is larger than 2000px wide, resize proportionally
        let pipeline = sharp(buffer);
        if (width > 2000) {
            pipeline = pipeline.resize({ width: 2000, withoutEnlargement: true });
        }

        // Re-compress WebP (quality 82 is a good balance of size vs quality)
        const optimized = await pipeline
            .webp({ quality: 82, effort: 4 })
            .toBuffer();

        return optimized;
    } catch {
        // Sharp not available — return raw buffer unchanged
        return buffer;
    }
}

async function saveMediaAsset(file: File): Promise<string> {
    if (!file || file.size === 0) return "";

    // Only accept WebP images
    const ext = path.extname(file.name).toLowerCase();
    if (file.type !== "image/webp" && ext !== ".webp") {
        throw new Error("Only WebP images are accepted. Please convert your image to .webp format before uploading.");
    }

    const bytes = await file.arrayBuffer();
    const rawBuffer = Buffer.from(bytes);

    // Optimize: resize large images & re-compress
    const optimized = await optimizeImage(rawBuffer);
    const baseName = file.name.toLowerCase().replace(/\.[^.]+$/, "").replace(/\s+/g, "-");
    const filename = `${Date.now()}-${baseName}.webp`;

    const projectRoot = process.cwd();
    const uploadDir = path.join(projectRoot, "public", "uploads", "media");
    const filepath = path.join(uploadDir, filename);

    try {
        await fs.mkdir(uploadDir, { recursive: true });
        await fs.writeFile(filepath, optimized);
    } catch (error: any) {
        throw new Error("Could not save the image on the server.");
    }

    return `/uploads/media/${filename}`;
}

/**
 * Delete an old file from the uploads directory (fire & forget).
 */
async function cleanupOldFile(url: string) {
    if (url && url.startsWith("/uploads/")) {
        const filepath = path.join(process.cwd(), "public", url);
        await fs.unlink(filepath).catch(() => { });
    }
}

export async function addMediaAsset(formData: FormData) {
    const alt = (formData.get("alt") as string)?.trim() || "";
    const page = (formData.get("page") as string)?.trim() || "";
    const location = (formData.get("location") as string)?.trim() || "";
    const dimensions = (formData.get("dimensions") as string)?.trim() || "";
    const imageFile = formData.get("image") as File;

    if (!imageFile || imageFile.size === 0) {
        return { error: "No image file provided" };
    }

    if (!alt) {
        return { error: "Alt text is required for SEO. Please provide a description for this image." };
    }

    try {
        const url = await saveMediaAsset(imageFile);

        // ─── KEY FIX: Replace existing image in the same page+location slot ───
        // getMediaAsset() uses .find() which returns the FIRST match.
        // If we keep creating new entries, the old stale entry is always returned.
        const existingAssets = await getAssets();
        const existingAsset = existingAssets.find(
            (a) => a.page === page && a.location === location
        );

        if (existingAsset) {
            // Replace the existing asset: update its URL, alt, dimensions
            await cleanupOldFile(existingAsset.url);
            await updateAsset(existingAsset.id, {
                url,
                alt,
                page,
                location,
                dimensions,
            });
        } else {
            // No existing asset for this slot — create new
            await createAsset({
                url,
                alt,
                page,
                location,
                dimensions,
            });
        }

        revalidateAllMediaPaths();
        return { success: true };
    } catch (error: any) {
        return { error: error.message };
    }
}

export async function editMediaAsset(formData: FormData) {
    const id = (formData.get("id") as string)?.trim();
    const alt = (formData.get("alt") as string)?.trim() || "";
    const page = (formData.get("page") as string)?.trim() || "";
    const location = (formData.get("location") as string)?.trim() || "";
    const dimensions = (formData.get("dimensions") as string)?.trim() || "";

    if (!id) return { error: "Missing ID" };

    if (!alt) {
        return { error: "Alt text is required for SEO. Please provide a description." };
    }

    try {
        await updateAsset(id, {
            alt,
            page,
            location,
            dimensions,
        });

        revalidateAllMediaPaths();
        return { success: true };
    } catch (error: any) {
        return { error: error.message };
    }
}

export async function removeMediaAsset(id: string) {
    if (!id) return { error: "Missing ID" };

    try {
        const assets = await getAssets();
        const asset = assets.find((a) => a.id === id);

        if (asset) {
            await cleanupOldFile(asset.url);
        }

        await deleteAsset(id);
        revalidateAllMediaPaths();
        return { success: true };
    } catch (error: any) {
        return { error: error.message };
    }
}
