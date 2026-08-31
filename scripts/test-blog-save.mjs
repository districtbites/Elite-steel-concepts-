/**
 * test-blog-save.mjs — End-to-end blog save verification
 * Run: node scripts/test-blog-save.mjs
 */
import { createClient } from '@libsql/client';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT    = path.join(__dirname, '..');
const DB_PATH = path.join(ROOT, 'data', 'db.json');

const TURSO_URL   = process.env.TURSO_DATABASE_URL;
const TURSO_TOKEN = process.env.TURSO_AUTH_TOKEN || process.env.LIBSQL_AUTH_TOKEN;

if (!TURSO_URL || !TURSO_TOKEN) {
  console.error('❌ Error: TURSO_DATABASE_URL and TURSO_AUTH_TOKEN environment variables are required.');
  process.exit(1);
}

const db = createClient({ url: TURSO_URL, authToken: TURSO_TOKEN });

async function readJson()  { return JSON.parse(await fs.readFile(DB_PATH, 'utf-8')); }
async function readTurso() {
  const r = await db.execute("SELECT value FROM kv_store WHERE key='posts'");
  if (!r.rows.length) return [];
  return JSON.parse(r.rows[0][0]);
}
async function writeDb(data) {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  await db.execute({ sql: `INSERT OR REPLACE INTO kv_store(key,value,updated_at) VALUES(?,?,?)`, args: ['posts', JSON.stringify(data.posts), new Date().toISOString()] });
}

const TEST_ID    = `TEST-${Date.now()}`;
const TEST_TITLE = `[AUTO-TEST] Blog Save Verification — ${new Date().toLocaleString('en-US',{timeZone:'Asia/Karachi'})}`;

(async () => {
  console.log('\n╔════════════════════════════════════════════╗');
  console.log('  Blog Save — End-to-End Verification Test   ');
  console.log('╚════════════════════════════════════════════╝\n');

  // 1. Snapshot before
  const before  = await readJson();
  const tBefore = await readTurso();
  const newest  = [...tBefore].sort((a,b) => a.date < b.date ? 1 : -1)[0];
  console.log(`📊 BEFORE:  db.json=${before.posts.length}  Turso=${tBefore.length}`);
  console.log(`   Newest:  [${newest?.date}] ${newest?.title?.substring(0,60)}`);

  // 2. Create test post (same payload shape as admin)
  const post = {
    id: TEST_ID, title: TEST_TITLE, subtitle: 'Automated dual-write verification',
    excerpt: 'Auto-test post — deleted immediately.', category: 'Testing', tags: ['auto-test'],
    date: new Date().toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}),
    readTime: '1 Min Read', image: 'https://images.pexels.com/photos/2577274/pexels-photo-2577274.jpeg',
    imageAlt: 'Test', slug: `auto-test-${Date.now()}`, status: 'Draft',
    content: 'Automated test content.', metaDescription: 'Test.'
  };

  console.log(`\n✍️  WRITING test post → ID: ${TEST_ID}`);
  await writeDb({ ...before, posts: [...before.posts, post] });
  console.log('   Dual-write done (db.json + Turso)');

  // 3. Read back from both independently
  await new Promise(r => setTimeout(r, 800));
  const after  = await readJson();
  const tAfter = await readTurso();
  const inDb    = after.posts.find(p => p.id === TEST_ID);
  const inTurso = tAfter.find(p => p.id === TEST_ID);
  const counts  = after.posts.length === tAfter.length;

  console.log(`\n🔎 VERIFICATION:`);
  console.log(`   db.json: ${after.posts.length} posts  | Test post: ${inDb    ? '✅ FOUND' : '❌ MISSING'}`);
  console.log(`   Turso:   ${tAfter.length} posts  | Test post: ${inTurso ? '✅ FOUND' : '❌ MISSING'}`);
  console.log(`   Counts match: ${counts ? '✅ YES' : '⚠️  NO'} (${after.posts.length} vs ${tAfter.length})`);

  // 4. Cleanup
  console.log('\n🧹 CLEANUP: Removing test post...');
  const clean = { ...after, posts: after.posts.filter(p => p.id !== TEST_ID) };
  await writeDb(clean);
  const final  = await readJson();
  const tFinal = await readTurso();
  console.log(`   db.json restored: ${final.posts.length} posts  leftover: ${final.posts.find(p=>p.id===TEST_ID) ? '❌' : '✅ none'}`);
  console.log(`   Turso   restored: ${tFinal.length} posts  leftover: ${tFinal.find(p=>p.id===TEST_ID)  ? '❌' : '✅ none'}`);

  // 5. Result
  const pass = !!inDb && !!inTurso && counts;
  console.log('\n╔════════════════════════════════════════════╗');
  if (pass) {
    console.log('  ✅  RESULT: PASS');
    console.log('  Blogs save correctly to BOTH db.json AND Turso.');
  } else {
    console.log('  ❌  RESULT: FAIL');
    if (!inDb)    console.log('  → Post NOT found in db.json');
    if (!inTurso) console.log('  → Post NOT found in Turso');
    if (!counts)  console.log('  → db.json and Turso counts differ');
  }
  console.log('╚════════════════════════════════════════════╝\n');
  process.exit(pass ? 0 : 1);
})().catch(e => { console.error('❌ Test crashed:', e.message); process.exit(1); });
