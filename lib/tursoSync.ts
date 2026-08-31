import fs from 'fs/promises';
import path from 'path';
import {
    isTursoConfigured,
    getTursoClient,
    tursoGet,
    tursoSet,
    tursoSaveMedia,
    tursoGetAllMedia,
    tursoGetMedia,
    initTursoTables
} from './turso';

const DB_PATH = path.join(process.cwd(), 'data/db.json');
const UPLOADS_DIR = path.join(process.cwd(), 'public/uploads');

const MIME_MAP: Record<string, string> = {
    '.webp': 'image/webp',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.jfif': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.gif': 'image/gif',
    '.avif': 'image/avif',
};

function getMimeType(filePath: string): string {
    const ext = path.extname(filePath).toLowerCase();
    return MIME_MAP[ext] || 'application/octet-stream';
}

/**
 * Recursively scans a directory and returns an array of relative file paths.
 */
async function getFilesRecursively(dir: string, baseDir = dir): Promise<string[]> {
    let results: string[] = [];
    try {
        const entries = await fs.readdir(dir, { withFileTypes: true });
        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                const subFiles = await getFilesRecursively(fullPath, baseDir);
                results = results.concat(subFiles);
            } else if (entry.isFile()) {
                const relativePath = path.relative(baseDir, fullPath);
                results.push(relativePath);
            }
        }
    } catch {
        // Directory does not exist yet
    }
    return results;
}

/**
 * Uploads all local data from `data/db.json` and all local images from `public/uploads/` into Turso.
 */
export async function syncLocalToTurso(): Promise<{
    success: boolean;
    syncedKeys: string[];
    uploadedMediaCount: number;
    totalMediaSize: number;
    error?: string;
}> {
    if (!isTursoConfigured()) {
        return {
            success: false,
            syncedKeys: [],
            uploadedMediaCount: 0,
            totalMediaSize: 0,
            error: "Turso credentials (TURSO_DATABASE_URL and TURSO_AUTH_TOKEN) are not set in environment variables.",
        };
    }

    try {
        await initTursoTables();
        const syncedKeys: string[] = [];

        // 1. Sync JSON database keys
        try {
            const raw = await fs.readFile(DB_PATH, 'utf-8');
            const data = JSON.parse(raw);

            for (const key of Object.keys(data)) {
                await tursoSet(key, data[key]);
                syncedKeys.push(key);
            }
        } catch (dbErr: any) {
            console.warn("Could not read local data/db.json during sync:", dbErr.message);
        }

        // 2. Sync all local media files to Turso
        let uploadedMediaCount = 0;
        let totalMediaSize = 0;

        const relativeFiles = await getFilesRecursively(UPLOADS_DIR);
        for (const relFile of relativeFiles) {
            try {
                const fullPath = path.join(UPLOADS_DIR, relFile);
                const fileBuffer = await fs.readFile(fullPath);
                const mediaPath = `/uploads/${relFile.split(path.sep).join('/')}`;
                const filename = path.basename(fullPath);
                const mimeType = getMimeType(filename);

                const saved = await tursoSaveMedia(mediaPath, filename, mimeType, fileBuffer);
                if (saved) {
                    uploadedMediaCount++;
                    totalMediaSize += fileBuffer.length;
                }
            } catch (fileErr: any) {
                console.warn(`Failed to upload media file ${relFile} to Turso:`, fileErr.message);
            }
        }

        // Save metadata record
        await tursoSet('_last_sync', {
            syncedAt: new Date().toISOString(),
            source: 'local_to_turso',
            syncedKeys,
            uploadedMediaCount,
            totalMediaSize,
        });

        return {
            success: true,
            syncedKeys,
            uploadedMediaCount,
            totalMediaSize,
        };
    } catch (error: any) {
        console.error("Error syncing local data to Turso:", error);
        return {
            success: false,
            syncedKeys: [],
            uploadedMediaCount: 0,
            totalMediaSize: 0,
            error: error.message || "Unknown error during sync",
        };
    }
}

/**
 * Downloads data from Turso into local `data/db.json` and downloads media files to `public/uploads/`.
 */
export async function syncTursoToLocal(): Promise<{
    success: boolean;
    downloadedKeys: string[];
    downloadedMediaCount: number;
    error?: string;
}> {
    if (!isTursoConfigured()) {
        return {
            success: false,
            downloadedKeys: [],
            downloadedMediaCount: 0,
            error: "Turso credentials are not configured.",
        };
    }

    try {
        const client = getTursoClient();
        if (!client) throw new Error("Could not initialize Turso client");

        await initTursoTables();

        // 1. Fetch all kv_store keys
        const res = await client.execute(`SELECT key, value FROM kv_store;`);
        const downloadedKeys: string[] = [];
        const localDbData: Record<string, any> = {};

        for (const row of res.rows) {
            const key = row.key as string;
            if (key.startsWith('_')) continue; // Skip internal metadata
            try {
                localDbData[key] = JSON.parse(row.value as string);
                downloadedKeys.push(key);
            } catch {
                // Ignore parse errors
            }
        }

        if (downloadedKeys.length > 0) {
            await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
            await fs.writeFile(DB_PATH, JSON.stringify(localDbData, null, 2), 'utf-8');
        }

        // 2. Download all media files to local public/uploads/
        let downloadedMediaCount = 0;
        const allMedia = await tursoGetAllMedia();

        for (const m of allMedia) {
            try {
                const fullRecord = await tursoGetMedia(m.path);
                if (!fullRecord || !fullRecord.dataBase64) continue;

                // Path like /uploads/blog/filename.jpg -> remove leading /uploads/
                const cleanRelPath = m.path.replace(/^\/?uploads\//, '');
                const targetFilePath = path.join(UPLOADS_DIR, cleanRelPath);

                await fs.mkdir(path.dirname(targetFilePath), { recursive: true });
                const buffer = Buffer.from(fullRecord.dataBase64, 'base64');
                await fs.writeFile(targetFilePath, buffer);
                downloadedMediaCount++;
            } catch (err: any) {
                console.warn(`Failed to write local media file ${m.path}:`, err.message);
            }
        }

        return {
            success: true,
            downloadedKeys,
            downloadedMediaCount,
        };
    } catch (error: any) {
        console.error("Error syncing Turso to local:", error);
        return {
            success: false,
            downloadedKeys: [],
            downloadedMediaCount: 0,
            error: error.message || "Unknown error during sync",
        };
    }
}

/**
 * Checks Turso status and returns connection details.
 */
export async function getTursoStatus(): Promise<{
    isConfigured: boolean;
    isConnected: boolean;
    databaseUrl: string;
    totalPosts: number;
    totalMedia: number;
    lastSync?: any;
    error?: string;
}> {
    const isConfigured = isTursoConfigured();
    if (!isConfigured) {
        return {
            isConfigured: false,
            isConnected: false,
            databaseUrl: '',
            totalPosts: 0,
            totalMedia: 0,
        };
    }

    const rawUrl = (process.env.TURSO_DATABASE_URL || process.env.TURSO_DB_URL || process.env.LIBSQL_URL || '').trim();
    // Mask URL for display e.g. libsql://esc-db-***.turso.io
    const maskedUrl = rawUrl.replace(/\/\/(.*?):.*?@/, '//$1:***@');

    try {
        const client = getTursoClient();
        if (!client) throw new Error("Client initialization failed");

        await initTursoTables();
        const testRes = await client.execute(`SELECT 1 as ping;`);
        const isConnected = testRes.rows.length > 0;

        const posts = await tursoGet<any[]>('posts');
        const mediaList = await tursoGetAllMedia();
        const lastSync = await tursoGet<any>('_last_sync');

        return {
            isConfigured: true,
            isConnected,
            databaseUrl: maskedUrl,
            totalPosts: posts ? posts.length : 0,
            totalMedia: mediaList.length,
            lastSync,
        };
    } catch (error: any) {
        return {
            isConfigured: true,
            isConnected: false,
            databaseUrl: maskedUrl,
            totalPosts: 0,
            totalMedia: 0,
            error: error.message || "Connection failed",
        };
    }
}

let autoInitChecked = false;

/**
 * Automatically seeds Turso from local data on first run if Turso database is empty.
 */
export async function autoInitializeTursoIfEmpty(): Promise<void> {
    if (autoInitChecked) return;
    if (!isTursoConfigured()) return;

    try {
        const client = getTursoClient();
        if (!client) return;

        await initTursoTables();
        const existingPosts = await tursoGet<any[]>('posts');

        if (!existingPosts || existingPosts.length === 0) {
            console.log("⚡ Turso database is empty. Auto-seeding existing website data and images into Turso cloud...");
            await syncLocalToTurso();
            console.log("✅ Auto-seeding completed. All blogs, SEO, and images are now stored in Turso!");
        }
        autoInitChecked = true;
    } catch (error) {
        console.warn("Could not auto-initialize Turso:", error);
    }
}
