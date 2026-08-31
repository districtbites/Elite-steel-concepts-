import { createClient } from '@libsql/client';
import { DEFAULT_INTERNAL_LINK_RULES, DEFAULT_INTERNAL_LINK_SETTINGS } from '../lib/internalLinks';

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

async function main() {
    const now = new Date().toISOString();
    await client.execute({
        sql: "INSERT INTO kv_store (key, value, updated_at) VALUES ('internalLinkRules', ?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at",
        args: [JSON.stringify(DEFAULT_INTERNAL_LINK_RULES), now],
    });
    await client.execute({
        sql: "INSERT INTO kv_store (key, value, updated_at) VALUES ('internalLinkSettings', ?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at",
        args: [JSON.stringify(DEFAULT_INTERNAL_LINK_SETTINGS), now],
    });
    console.log(`✅ Seeded ${DEFAULT_INTERNAL_LINK_RULES.length} internal linking rules into Turso.`);
}

main().catch(console.error);
