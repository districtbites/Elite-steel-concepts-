import { createClient } from '@libsql/client';
import { DEFAULT_INTERNAL_LINK_RULES, DEFAULT_INTERNAL_LINK_SETTINGS } from '../lib/internalLinks';

const TURSO_URL = process.env.TURSO_DATABASE_URL || 'libsql://elite-steel-concepts-districtbites.aws-us-east-1.turso.io';
const TURSO_TOKEN = process.env.TURSO_AUTH_TOKEN || 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3ODcxNjU3MjMsImlkIjoiMDFhMDFiNjAtNDYwMS03ODkxLTljOTYtOTQ1MTc4MTc5MWRmIiwia2lkIjoiaWs5TEZzWV9WY1VKWGVFcEItbFlJVnFkcDVIRnNFVWkwRFZLSHhaTTBxayIsInJpZCI6IjA5ZTU2NzYyLWIwMmQtNDU5Mi05Nzc0LWUzOTQ2ODg5Yzc3ZCJ9.dsUWyozzUBLzSKPrVTIUFy5V6Nq-2w9A54ZM86djYrHdG937Ypw9JMUEqydqsqXJBa8Dg7gNAVDshQLFoK5tBQ';

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
