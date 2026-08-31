"use server";

import { createPost, deletePost, updatePost, getPostById } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import fs from "fs/promises";
import path from "path";
import { tursoSaveMedia, tursoDeleteMedia } from "@/lib/turso";

async function saveBlogImage(file: File): Promise<string> {
    if (!file || file.size === 0) return "";

    const allowedTypes = ["image/webp", "image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
        throw new Error(`Only WebP, JPEG, and PNG images are allowed.`);
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = path.extname(file.name) || (file.type === "image/webp" ? ".webp" : ".jpg");
    const cleanExt = ext.toLowerCase();
    const filename = `${Date.now()}-${file.name.toLowerCase().replace(/\s+/g, "-").replace(cleanExt, "")}${cleanExt}`;

    const projectRoot = process.cwd();
    const uploadDir = path.join(projectRoot, "public", "uploads", "blog");
    const filepath = path.join(uploadDir, filename);
    const mediaPath = `/uploads/blog/${filename}`;

    try {
        await fs.mkdir(uploadDir, { recursive: true });
        await fs.writeFile(filepath, buffer);
    } catch {
        // Read-only serverless filesystem
    }

    try {
        await tursoSaveMedia(mediaPath, filename, file.type || "image/jpeg", buffer);
    } catch (error: any) {
        console.warn("Could not save blog image to Turso:", error?.message);
    }

    return mediaPath;
}

export async function createBlogPost(formData: FormData) {
    const title = formData.get("title") as string;
    const subtitle = formData.get("subtitle") as string;
    const content = formData.get("content") as string;
    const category = formData.get("category") as string;
    const status = formData.get("status") as "Published" | "Draft";
    const imageFile = formData.get("image") as File;
    const imageAlt = formData.get("imageAlt") as string;
    const metaDescription = formData.get("metaDescription") as string;
    const tagsStr = formData.get("tags") as string;
    const imageUrlInput = formData.get("imageUrl") as string;

    const tags = tagsStr ? tagsStr.split(",").map(t => t.trim()) : [];

    let imageUrl = "https://images.pexels.com/photos/2577274/pexels-photo-2577274.jpeg?auto=compress&cs=tinysrgb&w=800";

    if (imageUrlInput && imageUrlInput.trim().length > 0) {
        imageUrl = imageUrlInput.trim();
    } else if (imageFile && imageFile.size > 0) {
        imageUrl = await saveBlogImage(imageFile);
    }

    const slug = title.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
    const readTime = `${Math.ceil(content.length / 1000) || 1} Min Read`;
    const date = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

    await createPost({
        title,
        subtitle,
        content,
        category,
        tags,
        status,
        image: imageUrl,
        imageAlt,
        metaDescription,
        slug,
        date,
        readTime,
        excerpt: content.substring(0, 150).replace(/[#*`]/g, "") + "..."
    });

    revalidatePath("/blog");
    revalidatePath("/admin/blog");
    revalidatePath("/sitemap.xml");
    revalidatePath("/", "layout");
    redirect("/admin/blog");
}

export async function updateBlogPost(id: string, formData: FormData) {
    const title = formData.get("title") as string;
    const subtitle = formData.get("subtitle") as string;
    const content = formData.get("content") as string;
    const category = formData.get("category") as string;
    const status = formData.get("status") as "Published" | "Draft";
    const imageFile = formData.get("image") as File;
    const imageAlt = formData.get("imageAlt") as string;
    const metaDescription = formData.get("metaDescription") as string;
    const existingImage = formData.get("existingImage") as string;
    const tagsStr = formData.get("tags") as string;
    const imageUrlInput = formData.get("imageUrl") as string;

    const tags = tagsStr ? tagsStr.split(",").map(t => t.trim()) : [];

    let imageUrl = existingImage;
    if (imageUrlInput && imageUrlInput.trim().length > 0) {
        imageUrl = imageUrlInput.trim();
    } else if (imageFile && imageFile.size > 0) {
        imageUrl = await saveBlogImage(imageFile);
    }

    const updates: any = {
        title,
        subtitle,
        content,
        category,
        tags,
        status,
        image: imageUrl,
        imageAlt,
        metaDescription,
        excerpt: content.substring(0, 150).replace(/[#*`]/g, "") + "..."
    };

    await updatePost(id, updates);

    revalidatePath("/blog");
    revalidatePath(`/blog/${formData.get("slug")}`);
    revalidatePath("/admin/blog");
    revalidatePath("/sitemap.xml");
    revalidatePath("/", "layout");
}

export async function deleteBlogPost(id: string) {
    const post = await getPostById(id);
    if (post && post.image && post.image.startsWith("/uploads/blog/")) {
        const imagePath = path.join(process.cwd(), "public", post.image);
        await fs.unlink(imagePath).catch(() => { });
        await tursoDeleteMedia(post.image).catch(() => { });
    }

    await deletePost(id);
    revalidatePath("/blog");
    revalidatePath("/admin/blog");
    revalidatePath("/sitemap.xml");
    revalidatePath("/", "layout");
}

export async function quickUploadImage(formData: FormData) {
    const file = formData.get("file") as File;
    if (!file) return { error: "No file" };
    try {
        const url = await saveBlogImage(file);
        return { url };
    } catch (e: any) {
        return { error: e.message };
    }
}
