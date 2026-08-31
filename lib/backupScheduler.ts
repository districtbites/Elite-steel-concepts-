/**
 * lib/backupScheduler.ts
 *
 * Automatic daily database backup scheduler.
 * Called once at server startup from instrumentation.ts.
 *
 * What it does:
 *  1. Runs a backup immediately on startup (catches up if the server was down overnight)
 *  2. Then schedules the next backup to fire exactly at midnight PKT (UTC+5)
 *  3. After that, runs every 24 hours precisely at midnight
 *
 * Zero dependencies — pure Node.js timers only.
 */

import fs from 'fs/promises';
import path from 'path';

const BACKUP_DIR = path.join(process.cwd(), 'data', 'backups');
const DB_PATH = path.join(process.cwd(), 'data', 'db.json');
const KEEP_DAYS = 7;
const PKT_OFFSET_MS = 5 * 60 * 60 * 1000; // UTC+5

// ─── Exported entry point ─────────────────────────────────────────────────────

export function scheduleBackup() {
    console.log('[Backup] Scheduler started — daily backup at midnight PKT');

    // Run once immediately on boot (catches any missed overnight backup)
    runBackup().catch(err =>
        console.error('[Backup] Startup backup failed:', err.message)
    );

    // Schedule the first midnight firing
    scheduleNextMidnight();
}

// ─── Scheduling logic ─────────────────────────────────────────────────────────

function scheduleNextMidnight() {
    const msUntilMidnight = getMsUntilMidnightPKT();
    console.log(
        `[Backup] Next backup scheduled in ${Math.round(msUntilMidnight / 1000 / 60)} minutes ` +
        `(midnight PKT)`
    );

    setTimeout(() => {
        runBackup().catch(err =>
            console.error('[Backup] Midnight backup failed:', err.message)
        );
        // After the first midnight, repeat every 24 hours
        setInterval(() => {
            runBackup().catch(err =>
                console.error('[Backup] Scheduled backup failed:', err.message)
            );
        }, 24 * 60 * 60 * 1000);
    }, msUntilMidnight);
}

/** Returns milliseconds until the next midnight in PKT (UTC+5) */
function getMsUntilMidnightPKT(): number {
    const nowUtcMs = Date.now();
    const nowPktMs = nowUtcMs + PKT_OFFSET_MS;
    const midnightPktMs = Math.ceil(nowPktMs / (24 * 60 * 60 * 1000)) * (24 * 60 * 60 * 1000);
    return midnightPktMs - nowPktMs;
}

// ─── Core backup logic ────────────────────────────────────────────────────────

async function runBackup() {
    const startMs = Date.now();
    const now = new Date();
    const timestamp = now.toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const label = now.toLocaleString('en-US', { timeZone: 'Asia/Karachi' });

    console.log(`\n[Backup] ══ Starting daily backup — ${label} PKT ══`);

    try {
        // Pull everything from Turso in one query
        const data = await pullFromTurso();
        const postCount = Array.isArray(data.posts) ? data.posts.length : 0;

        if (postCount === 0) {
            console.warn('[Backup] ⚠️  Turso returned 0 posts — skipping overwrite to be safe');
            return;
        }

        // Safety: never overwrite with significantly fewer posts than we currently have
        const existingCount = await getExistingPostCount();
        if (existingCount > 0 && postCount < existingCount - 5) {
            console.warn(
                `[Backup] ⚠️  Turso has ${postCount} posts but db.json has ${existingCount}. ` +
                'Skipping overwrite — data looks wrong.'
            );
            return;
        }

        // Write db.json
        await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
        await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');

        // Write timestamped backup
        await fs.mkdir(BACKUP_DIR, { recursive: true });
        const backupPath = path.join(BACKUP_DIR, `db-${timestamp}.json`);
        await fs.writeFile(backupPath, JSON.stringify(data, null, 2), 'utf-8');

        // Prune old backups
        await pruneOldBackups();

        const elapsed = Date.now() - startMs;
        console.log(
            `[Backup] ✅ Done in ${elapsed}ms — ${postCount} posts saved to ` +
            `db.json + backups/db-${timestamp}.json\n`
        );
    } catch (err: any) {
        console.error('[Backup] ❌ Backup failed:', err.message);
    }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function pullFromTurso(): Promise<Record<string, any>> {
    // Dynamic import so it uses the existing Turso client setup
    const { tursoGetAllKV } = await import('./turso');
    const kvMap = await tursoGetAllKV();

    // Strip internal meta keys (prefixed with _)
    for (const key of Object.keys(kvMap)) {
        if (key.startsWith('_')) delete kvMap[key];
    }

    if (Object.keys(kvMap).length === 0) {
        throw new Error('Turso returned empty data');
    }

    return kvMap;
}

async function getExistingPostCount(): Promise<number> {
    try {
        const raw = await fs.readFile(DB_PATH, 'utf-8');
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed.posts) ? parsed.posts.length : 0;
    } catch {
        return 0;
    }
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
            console.log(`[Backup] 🗑️  Pruned old backup: ${file}`);
        }
        if (backups.length > 0) {
            console.log(
                `[Backup] 📁 Keeping ${Math.min(backups.length, KEEP_DAYS)}/${KEEP_DAYS} backups in data/backups/`
            );
        }
    } catch {
        // Ignore — backup dir may not exist on first run
    }
}
