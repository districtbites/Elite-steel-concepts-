import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { tursoGetMedia } from "@/lib/turso";

const MIME_MAP: Record<string, string> = {
    ".webp": "image/webp",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".jfif": "image/jpeg",
    ".svg": "image/svg+xml",
    ".gif": "image/gif",
    ".avif": "image/avif",
};

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ path: string[] }> }
) {
    const { path: pathSegments } = await context.params;
    const relPath = pathSegments.join("/");
    const normalizedPath = `/uploads/${relPath}`;
    const filename = pathSegments[pathSegments.length - 1] || "";
    const ext = path.extname(filename).toLowerCase();
    const mimeType = MIME_MAP[ext] || "application/octet-stream";

    // 1. Try serving from local disk if present
    const localFilePath = path.join(process.cwd(), "public", "uploads", relPath);
    try {
        const fileBuffer = await fs.readFile(localFilePath);
        return new NextResponse(fileBuffer, {
            headers: {
                "Content-Type": mimeType,
                "Cache-Control": "public, max-age=31536000, immutable",
                "Content-Length": fileBuffer.length.toString(),
            },
        });
    } catch {
        // Not on local disk, fall through to Turso database
    }

    // 2. Try fetching from Turso media_files table
    try {
        const mediaRecord = await tursoGetMedia(normalizedPath);
        if (mediaRecord && mediaRecord.dataBase64) {
            const buffer = Buffer.from(mediaRecord.dataBase64, "base64");

            // Optionally write to local disk cache for fast future reads
            fs.mkdir(path.dirname(localFilePath), { recursive: true })
                .then(() => fs.writeFile(localFilePath, buffer))
                .catch(() => { });

            return new NextResponse(buffer, {
                headers: {
                    "Content-Type": mediaRecord.mimeType || mimeType,
                    "Cache-Control": "public, max-age=31536000, immutable",
                    "Content-Length": buffer.length.toString(),
                },
            });
        }
    } catch (error) {
        console.error(`Error serving media for ${normalizedPath}:`, error);
    }

    return new NextResponse("File Not Found", { status: 404 });
}
