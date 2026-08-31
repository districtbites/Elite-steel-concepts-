import { createClient } from '@libsql/client';
import fs from 'fs/promises';
import path from 'path';

const TURSO_URL = process.env.TURSO_DATABASE_URL;
const TURSO_TOKEN = process.env.TURSO_AUTH_TOKEN || process.env.LIBSQL_AUTH_TOKEN;

if (!TURSO_URL || !TURSO_TOKEN) {
    console.error('❌ Error: TURSO_DATABASE_URL and TURSO_AUTH_TOKEN environment variables are required.');
    process.exit(1);
}

const client = createClient({
    url: TURSO_URL,
    authToken: TURSO_TOKEN,
});

const DB_PATH = path.join(process.cwd(), 'data/db.json');
const UPLOADS_DIR = path.join(process.cwd(), 'public/uploads');

const MIME_MAP = {
    '.webp': 'image/webp',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.jfif': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.gif': 'image/gif',
    '.avif': 'image/avif',
};

function getMimeType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    return MIME_MAP[ext] || 'application/octet-stream';
}

async function getFilesRecursively(dir, baseDir = dir) {
    let results = [];
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
        // Dir doesn't exist
    }
    return results;
}

async function main() {
    console.log('🚀 Connecting to Turso Cloud Database at:', TURSO_URL);

    // 1. Create tables
    console.log('📦 Initializing Turso tables (kv_store & media_files)...');
    await client.batch([
        `CREATE TABLE IF NOT EXISTS kv_store (
            key TEXT PRIMARY KEY,
            value TEXT NOT NULL,
            updated_at TEXT NOT NULL
        );`,
        `CREATE TABLE IF NOT EXISTS media_files (
            path TEXT PRIMARY KEY,
            filename TEXT NOT NULL,
            mime_type TEXT NOT NULL,
            data TEXT NOT NULL,
            size INTEGER NOT NULL,
            updated_at TEXT NOT NULL
        );`,
        `CREATE INDEX IF NOT EXISTS idx_media_filename ON media_files(filename);`
    ], 'write');
    console.log('✅ Tables initialized successfully.');

    // 2. Sync data/db.json
    console.log('\n📄 Reading local data/db.json...');
    const rawDb = await fs.readFile(DB_PATH, 'utf-8');
    const dbData = JSON.parse(rawDb);
    const keys = Object.keys(dbData);
    console.log(`Found ${keys.length} collections:`, keys.join(', '));

    const now = new Date().toISOString();
    for (const key of keys) {
        const valueJson = JSON.stringify(dbData[key]);
        await client.execute({
            sql: `INSERT INTO kv_store (key, value, updated_at)
                  VALUES (?, ?, ?)
                  ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at;`,
            args: [key, valueJson, now],
        });
        const count = Array.isArray(dbData[key]) ? `${dbData[key].length} items` : '1 object';
        console.log(`  ✓ Synced collection [${key}] (${count})`);
    }

    // 3. Sync media files
    console.log('\n🖼️  Scanning local public/uploads/ directory for media files...');
    const files = await getFilesRecursively(UPLOADS_DIR);
    console.log(`Found ${files.length} images to upload to Turso media storage.`);

    let uploadedCount = 0;
    let totalBytes = 0;

    for (let i = 0; i < files.length; i++) {
        const relFile = files[i];
        const fullPath = path.join(UPLOADS_DIR, relFile);
        const fileBuffer = await fs.readFile(fullPath);
        const mediaPath = `/uploads/${relFile.split(path.sep).join('/')}`;
        const filename = path.basename(fullPath);
        const mimeType = getMimeType(filename);
        const base64Data = fileBuffer.toString('base64');
        const size = fileBuffer.length;

        await client.execute({
            sql: `INSERT INTO media_files (path, filename, mime_type, data, size, updated_at)
                  VALUES (?, ?, ?, ?, ?, ?)
                  ON CONFLICT(path) DO UPDATE SET
                      filename = excluded.filename,
                      mime_type = excluded.mime_type,
                      data = excluded.data,
                      size = excluded.size,
                      updated_at = excluded.updated_at;`,
            args: [mediaPath, filename, mimeType, base64Data, size, now],
        });

        uploadedCount++;
        totalBytes += size;

        if (uploadedCount % 10 === 0 || uploadedCount === files.length) {
            console.log(`  ✓ Uploaded ${uploadedCount}/${files.length} images (${(totalBytes / (1024 * 1024)).toFixed(2)} MB)`);
        }
    }

    // 4. Save metadata
    await client.execute({
        sql: `INSERT INTO kv_store (key, value, updated_at)
              VALUES ('_last_sync', ?, ?)
              ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at;`,
        args: [
            JSON.stringify({
                syncedAt: now,
                source: 'migration_script',
                syncedKeys: keys,
                uploadedMediaCount: uploadedCount,
                totalMediaBytes: totalBytes,
            }),
            now,
        ],
    });

    console.log('\n======================================================');
    console.log('🎉 SYNC COMPLETE!');
    console.log(`- Collections Synced: ${keys.length}`);
    console.log(`- Media Images Stored: ${uploadedCount} (${(totalBytes / (1024 * 1024)).toFixed(2)} MB)`);
    console.log('- Turso Database is 100% up to date and live!');
    console.log('======================================================');
}

main().catch(err => {
    console.error('❌ Sync failed:', err);
    process.exit(1);
});
