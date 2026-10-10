import { createClient, Client } from '@libsql/client';
import path from 'path';

let cachedClient: Client | null = null;
let tablesInitialized = false;

/**
 * Returns whether Turso database credentials are configured in the environment.
 */
export function isTursoConfigured(): boolean {
    const url = process.env.TURSO_DATABASE_URL || process.env.TURSO_DB_URL || process.env.LIBSQL_URL;
    const token = process.env.TURSO_AUTH_TOKEN || process.env.LIBSQL_AUTH_TOKEN;
    return Boolean(url && url.trim().length > 0);
}

/**
 * Returns the Turso database client or null if not configured.
 */
export function getTursoClient(): Client | null {
    if (!isTursoConfigured()) {
        return null;
    }

    if (cachedClient) {
        return cachedClient;
    }

    const url = (process.env.TURSO_DATABASE_URL || process.env.TURSO_DB_URL || process.env.LIBSQL_URL)!.trim();
    const authToken = (process.env.TURSO_AUTH_TOKEN || process.env.LIBSQL_AUTH_TOKEN || '').trim();

    cachedClient = createClient({
        url,
        authToken: authToken.length > 0 ? authToken : undefined,
    });

    return cachedClient;
}

const TRANSIENT_ERROR_CODES = new Set([
    'UND_ERR_SOCKET',
    'UND_ERR_CONNECT_TIMEOUT',
    'UND_ERR_HEADERS_TIMEOUT',
    'ECONNRESET',
    'ECONNREFUSED',
    'ETIMEDOUT',
    'EPIPE',
    'EAI_AGAIN',
]);

/**
 * Returns whether an error (or any error in its cause chain) is a transient network failure.
 */
function isTransientError(error: unknown): boolean {
    let current: any = error;
    for (let depth = 0; current && depth < 5; depth++) {
        if (TRANSIENT_ERROR_CODES.has(current.code)) return true;
        if (current instanceof TypeError && current.message === 'fetch failed') return true;
        current = current.cause;
    }
    return false;
}

/**
 * Runs a Turso operation, retrying with backoff on transient network errors
 * (e.g. "other side closed" from a stale keep-alive socket).
 */
async function withRetry<T>(operation: (client: Client) => Promise<T>, attempts = 3): Promise<T> {
    for (let attempt = 1; ; attempt++) {
        const client = getTursoClient();
        if (!client) throw new Error('Turso is not configured');

        try {
            return await operation(client);
        } catch (error) {
            if (attempt >= attempts || !isTransientError(error)) throw error;
            // Drop the cached client so the next attempt opens a fresh connection.
            if (cachedClient === client) cachedClient = null;
            await new Promise(resolve => setTimeout(resolve, 250 * 2 ** (attempt - 1)));
        }
    }
}

/**
 * Ensures the required tables exist in the Turso database.
 */
export async function initTursoTables(): Promise<boolean> {
    if (tablesInitialized) return true;
    const client = getTursoClient();
    if (!client) return false;

    try {
        await withRetry(c => c.batch([
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
        ], 'write'));

        tablesInitialized = true;
        return true;
    } catch (error) {
        console.error("Failed to initialize Turso tables:", error);
        return false;
    }
}

/**
 * Reads a JSON value by key from Turso kv_store.
 */
export async function tursoGet<T = any>(key: string): Promise<T | null> {
    const client = getTursoClient();
    if (!client) return null;

    try {
        const res = await withRetry(c => c.execute({
            sql: `SELECT value FROM kv_store WHERE key = ? LIMIT 1;`,
            args: [key],
        }));

        if (res.rows.length === 0) return null;
        const raw = res.rows[0].value as string;
        return JSON.parse(raw) as T;
    } catch (error) {
        console.error(`Error reading key "${key}" from Turso:`, error);
        return null;
    }
}

/**
 * Saves a JSON value by key in Turso kv_store.
 */
export async function tursoSet(key: string, value: any): Promise<boolean> {
    const client = getTursoClient();
    if (!client) return false;

    try {
        const jsonStr = JSON.stringify(value);
        const now = new Date().toISOString();

        await withRetry(c => c.execute({
            sql: `INSERT INTO kv_store (key, value, updated_at) 
                  VALUES (?, ?, ?) 
                  ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at;`,
            args: [key, jsonStr, now],
        }));

        return true;
    } catch (error) {
        console.error(`Error saving key "${key}" to Turso:`, error);
        return false;
    }
}

/**
 * Reads ALL key-value pairs from Turso kv_store in ONE single high-speed query.
 */
export async function tursoGetAllKV(): Promise<Record<string, any>> {
    const client = getTursoClient();
    if (!client) return {};

    try {
        const res = await withRetry(c => c.execute("SELECT key, value FROM kv_store;"));
        const result: Record<string, any> = {};
        for (const row of res.rows) {
            const key = row.key as string;
            const raw = row.value as string;
            try {
                result[key] = JSON.parse(raw);
            } catch {
                result[key] = raw;
            }
        }
        return result;
    } catch (error) {
        console.error("Error reading all KV from Turso:", error);
        return {};
    }
}

/**
 * Saves multiple key-value pairs to Turso in a single batch transaction.
 */
export async function tursoBatchSet(entries: { key: string; value: any }[]): Promise<boolean> {
    const client = getTursoClient();
    if (!client || entries.length === 0) return false;

    try {
        const now = new Date().toISOString();
        const statements = entries.map(e => ({
            sql: `INSERT INTO kv_store (key, value, updated_at) 
                  VALUES (?, ?, ?) 
                  ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at;`,
            args: [e.key, JSON.stringify(e.value), now]
        }));
        await withRetry(c => c.batch(statements, 'write'));
        return true;
    } catch (error) {
        console.error("Error in tursoBatchSet:", error);
        return false;
    }
}

/**
 * Deletes a key from Turso kv_store.
 */
export async function tursoDelete(key: string): Promise<boolean> {
    const client = getTursoClient();
    if (!client) return false;

    try {
        await withRetry(c => c.execute({
            sql: `DELETE FROM kv_store WHERE key = ?;`,
            args: [key],
        }));
        return true;
    } catch (error) {
        console.error(`Error deleting key "${key}" from Turso:`, error);
        return false;
    }
}

/**
 * Saves a media file buffer/base64 to Turso media_files table.
 */
export async function tursoSaveMedia(
    mediaPath: string,
    filename: string,
    mimeType: string,
    bufferOrBase64: Buffer | string
): Promise<boolean> {
    const client = getTursoClient();
    if (!client) return false;

    try {
        const normalizedPath = mediaPath.startsWith('/') ? mediaPath : `/${mediaPath}`;
        const base64Data = Buffer.isBuffer(bufferOrBase64)
            ? bufferOrBase64.toString('base64')
            : bufferOrBase64.replace(/^data:image\/\w+;base64,/, '');
        const size = Buffer.isBuffer(bufferOrBase64)
            ? bufferOrBase64.length
            : Buffer.from(base64Data, 'base64').length;
        const now = new Date().toISOString();

        await withRetry(c => c.execute({
            sql: `INSERT INTO media_files (path, filename, mime_type, data, size, updated_at)
                  VALUES (?, ?, ?, ?, ?, ?)
                  ON CONFLICT(path) DO UPDATE SET 
                      filename = excluded.filename,
                      mime_type = excluded.mime_type,
                      data = excluded.data,
                      size = excluded.size,
                      updated_at = excluded.updated_at;`,
            args: [normalizedPath, filename, mimeType, base64Data, size, now],
        }));

        return true;
    } catch (error) {
        console.error(`Error saving media "${mediaPath}" to Turso:`, error);
        return false;
    }
}

export interface TursoMediaRecord {
    path: string;
    filename: string;
    mimeType: string;
    dataBase64: string;
    size: number;
    updatedAt: string;
}

/**
 * Retrieves a media file by path from Turso media_files table.
 */
export async function tursoGetMedia(mediaPath: string): Promise<TursoMediaRecord | null> {
    const client = getTursoClient();
    if (!client) return null;

    try {
        const normalizedPath = mediaPath.startsWith('/') ? mediaPath : `/${mediaPath}`;

        const res = await withRetry(c => c.execute({
            sql: `SELECT path, filename, mime_type, data, size, updated_at 
                  FROM media_files 
                  WHERE path = ? OR filename = ? 
                  LIMIT 1;`,
            args: [normalizedPath, path.basename(normalizedPath)],
        }));

        if (res.rows.length === 0) return null;
        const row = res.rows[0];

        return {
            path: row.path as string,
            filename: row.filename as string,
            mimeType: row.mime_type as string,
            dataBase64: row.data as string,
            size: Number(row.size),
            updatedAt: row.updated_at as string,
        };
    } catch (error) {
        console.error(`Error retrieving media "${mediaPath}" from Turso:`, error);
        return null;
    }
}

/**
 * Deletes a media file from Turso media_files table.
 */
export async function tursoDeleteMedia(mediaPath: string): Promise<boolean> {
    const client = getTursoClient();
    if (!client) return false;

    try {
        await initTursoTables();
        const normalizedPath = mediaPath.startsWith('/') ? mediaPath : `/${mediaPath}`;
        await withRetry(c => c.execute({
            sql: `DELETE FROM media_files WHERE path = ? OR filename = ?;`,
            args: [normalizedPath, path.basename(normalizedPath)],
        }));
        return true;
    } catch (error) {
        console.error(`Error deleting media "${mediaPath}" from Turso:`, error);
        return false;
    }
}

/**
 * Retrieves a list of all media file records stored in Turso.
 */
export async function tursoGetAllMedia(): Promise<Omit<TursoMediaRecord, 'dataBase64'>[]> {
    const client = getTursoClient();
    if (!client) return [];

    try {
        await initTursoTables();
        const res = await withRetry(c => c.execute(`SELECT path, filename, mime_type, size, updated_at FROM media_files ORDER BY updated_at DESC;`));
        return res.rows.map(row => ({
            path: row.path as string,
            filename: row.filename as string,
            mimeType: row.mime_type as string,
            size: Number(row.size),
            updatedAt: row.updated_at as string,
        }));
    } catch (error) {
        console.error("Error retrieving all media from Turso:", error);
        return [];
    }
}
