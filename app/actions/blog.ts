"use server";

import { createPost, deletePost, updatePost, getPostById } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import fs from "fs/promises";
import path from "path";

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

    try {
        await fs.mkdir(uploadDir, { recursive: true });
        await fs.writeFile(filepath, buffer);
    } catch (error: any) {
        throw new Error("Could not save the image on the server.");
    }

    return `/uploads/blog/${filename}`;
}

export async function createBlogPost(formData: FormData) {
    const title = formData.get("title") as string;
    const subtitle = formData.get("subtitle") as string;
    const content = formData.get("content") as string;
    const category = formData.get("category") as string;
    const status = formData.get("status") as "Published" | "Draft";
    const imageFile = formData.get("image") as File;
    const imageAlt = formData.get("imageAlt") as string;
    const tagsStr = formData.get("tags") as string;

    const tags = tagsStr ? tagsStr.split(",").map(t => t.trim()) : [];

    let imageUrl = "https://images.unsplash.com/photo-1565123409695-7b5ef63a48b9?q=80&w=800&auto=format&fit=crop";

    if (imageFile && imageFile.size > 0) {
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
    const existingImage = formData.get("existingImage") as string;
    const tagsStr = formData.get("tags") as string;

    const tags = tagsStr ? tagsStr.split(",").map(t => t.trim()) : [];

    let imageUrl = existingImage;
    if (imageFile && imageFile.size > 0) {
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
