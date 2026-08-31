/**
 * backup-db.mjs
 *
 * Daily backup script for ESC website database.
 * - Pulls ALL data from Turso (source of truth)
 * - Overwrites data/db.json with the latest data
 * - Saves a timestamped backup in data/backups/
 * - Keeps the last 7 daily backups (auto-deletes older ones)
 *
 * Run manually:   node scripts/backup-db.mjs
 * Scheduled via:  pm2 (ecosystem.config.cjs) or crontab
 */

import { createClient } from '@libsql/client';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const DB_PATH = path.join(ROOT, 'data', 'db.json');
const BACKUP_DIR = path.join(ROOT, 'data', 'backups');
const KEEP_DAYS = 7;

const TURSO_URL = process.env.TURSO_DATABASE_URL;
const TURSO_TOKEN = process.env.TURSO_AUTH_TOKEN || process.env.LIBSQL_AUTH_TOKEN;

async function main() {
    const now = new Date();
    const timestamp = now.toISOString().replace(/[:.]/g, '-').slice(0, 19); // 2026-08-26T23-11-00
    const dateLabel = now.toLocaleString('en-US', { timeZone: 'Asia/Karachi' });

    console.log(`\n📦 ESC Daily Backup — ${dateLabel} PKT`);
    console.log('══════════════════════════════════════════');

    if (!TURSO_URL || !TURSO_TOKEN) {
        throw new Error('TURSO_DATABASE_URL and TURSO_AUTH_TOKEN environment variables are required.');
    }

    // ── 1. Connect to Turso ──────────────────────────────────────────────────
    const client = createClient({ url: TURSO_URL, authToken: TURSO_TOKEN });
    console.log('🔌 Connecting to Turso...');

    const res = await client.execute('SELECT key, value FROM kv_store;');
    if (res.rows.length === 0) {
        throw new Error('Turso returned 0 rows — aborting to avoid overwriting with empty data!');
    }

    // ── 2. Build merged DB object ────────────────────────────────────────────
    const kvMap = {};
    for (const row of res.rows) {
        const key = row.key;
        if (key.startsWith('_')) continue; // skip internal meta keys like _last_sync
        try { kvMap[key] = JSON.parse(row.value); }
        catch { kvMap[key] = row.value; }
    }

    const postCount = Array.isArray(kvMap.posts) ? kvMap.posts.length : 0;
    console.log(`✅ Pulled ${res.rows.length} collections from Turso (${postCount} posts)`);

    // ── 3. Safety check — never overwrite with fewer posts than we have ───────
    try {
        const existing = JSON.parse(await fs.readFile(DB_PATH, 'utf-8'));
        const existingCount = Array.isArray(existing.posts) ? existing.posts.length : 0;
        if (postCount < existingCount - 5) {
            console.warn(`⚠️  WARNING: Turso has ${postCount} posts but db.json has ${existingCount}.`);
            console.warn('   Skipping db.json overwrite. Run with --force to override.');
            if (!process.argv.includes('--force')) {
                await saveBackup(kvMap, timestamp);
                await pruneOldBackups();
                return;
            }
        }
    } catch {
        // db.json doesn't exist yet — fine, we'll create it
    }

    // ── 4. Overwrite data/db.json with latest Turso data ────────────────────
    await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
    await fs.writeFile(DB_PATH, JSON.stringify(kvMap, null, 2), 'utf-8');
    console.log(`✅ data/db.json updated (${postCount} posts)`);

    // ── 5. Save timestamped backup ───────────────────────────────────────────
    await saveBackup(kvMap, timestamp);

    // ── 6. Prune old backups (keep KEEP_DAYS most recent) ───────────────────
    await pruneOldBackups();

    console.log('\n✅ Backup complete!\n');
}

async function saveBackup(data, timestamp) {
    await fs.mkdir(BACKUP_DIR, { recursive: true });
    const backupPath = path.join(BACKUP_DIR, `db-${timestamp}.json`);
    await fs.writeFile(backupPath, JSON.stringify(data, null, 2), 'utf-8');
    const postCount = Array.isArray(data.posts) ? data.posts.length : 0;
    console.log(`💾 Saved: data/backups/db-${timestamp}.json (${postCount} posts)`);
}

async function pruneOldBackups() {
    try {
        const files = await fs.readdir(BACKUP_DIR);
        const backups = files
            .filter(f => f.startsWith('db-') && f.endsWith('.json'))
            .sort()    // ISO timestamps sort oldest→newest alphabetically
            .reverse(); // newest first

        const toDelete = backups.slice(KEEP_DAYS);
        for (const file of toDelete) {
            await fs.unlink(path.join(BACKUP_DIR, file));
            console.log(`🗑️  Pruned old backup: ${file}`);
        }
        console.log(`📁 Keeping ${Math.min(backups.length, KEEP_DAYS)} backup(s) in data/backups/`);
    } catch {
        // Ignore if backup dir doesn't exist yet
    }
}

main().catch(err => {
    console.error('\n❌ Backup FAILED:', err.message);
    process.exit(1);
});
