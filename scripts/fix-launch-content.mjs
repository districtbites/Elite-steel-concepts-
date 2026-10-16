/**
 * fix-launch-content.mjs — Pre-launch content corrections applied directly in Turso
 *
 * Reads the live `posts`, `faqs` and `seo` values from Turso, applies only the
 * targeted text fixes below, and writes back the keys that changed. Anything
 * else edited in the admin since the last sync is left untouched.
 *
 * Dry run (default):  node --env-file=.env scripts/fix-launch-content.mjs
 * Apply:              node --env-file=.env scripts/fix-launch-content.mjs --apply
 */
import { createClient } from '@libsql/client';

const APPLY = process.argv.includes('--apply');

const TURSO_URL   = process.env.TURSO_DATABASE_URL || process.env.TURSO_DB_URL || process.env.LIBSQL_URL;
const TURSO_TOKEN = process.env.TURSO_AUTH_TOKEN || process.env.LIBSQL_AUTH_TOKEN;

if (!TURSO_URL) {
  console.error('❌ Error: TURSO_DATABASE_URL environment variable is required.');
  process.exit(1);
}

const db = createClient({ url: TURSO_URL.trim(), authToken: TURSO_TOKEN?.trim() || undefined });

const OLD_SLUG = 'food-truck-equipment-layout-where-shwhy-food-truck-equipment-layout-mattersould-every-appliance-go';
const NEW_SLUG = 'food-truck-equipment-layout-where-should-every-appliance-go';
const NEW_TITLE = 'Food Truck Equipment Layout: Where Should Every Appliance Go?';

const OLD_WARRANTY_Q = 'What kind of warranty do you offer?';
const NEW_WARRANTY_Q = 'What warranty do you offer?';
const OLD_WARRANTY_A = 'We provide a 1-year structural warranty on the fabrication of the kitchen. Individual appliances and generators are covered by their respective manufacturer warranties, which we help you register.';
const NEW_WARRANTY_A = 'Equipment is covered by the applicable manufacturer’s warranty, subject to that manufacturer’s terms and exclusions. Elite Steel Concepts provides a one-year limited warranty on electrical and plumbing work performed by our team. Exclusions and limitations apply. Please refer to your written warranty agreement for complete coverage details.';

// Plain-text replacements applied to every string inside `seo`
const SEO_REPLACEMENTS = [
  ['USA AREA ESC COVER', 'Where We Build and Deliver'],
  ['Elite Steel Concept Work Portfolio', 'Elite Steel Concepts Work Portfolio'],
  [OLD_WARRANTY_Q, NEW_WARRANTY_Q],
  [OLD_WARRANTY_A, NEW_WARRANTY_A],
];

const changes = [];

async function read(key) {
  const r = await db.execute({ sql: 'SELECT value FROM kv_store WHERE key = ? LIMIT 1', args: [key] });
  return r.rows.length ? JSON.parse(r.rows[0].value) : null;
}

function fixPosts(posts) {
  let changed = false;
  for (const post of posts) {
    if (post.slug === OLD_SLUG || post.title?.includes('ShWhy')) {
      changes.push(`posts: "${post.title}" → "${NEW_TITLE}" (slug → ${NEW_SLUG})`);
      post.title = NEW_TITLE;
      post.slug = NEW_SLUG;
      changed = true;
    }
  }
  return changed;
}

function fixFaqs(faqs) {
  let changed = false;
  for (const faq of faqs) {
    if (faq.question === OLD_WARRANTY_Q || faq.answer === OLD_WARRANTY_A) {
      changes.push(`faqs: warranty FAQ (id ${faq.id}) → new wording`);
      faq.question = NEW_WARRANTY_Q;
      faq.answer = NEW_WARRANTY_A;
      changed = true;
    }
  }
  return changed;
}

// Walks the seo object. structuredData values are JSON strings, so the
// replacement text is escaped the same way before matching.
function fixSeo(node, trail = 'seo') {
  let changed = false;
  for (const [key, value] of Object.entries(node)) {
    if (typeof value === 'string') {
      let next = value;
      for (const [from, to] of SEO_REPLACEMENTS) {
        const [a, b] = key === 'structuredData'
          ? [JSON.stringify(from).slice(1, -1), JSON.stringify(to).slice(1, -1)]
          : [from, to];
        if (next.includes(a)) {
          next = next.split(a).join(b);
          changes.push(`${trail}.${key}: "${from.slice(0, 40)}" → "${to.slice(0, 40)}"`);
        }
      }
      if (next !== value) {
        if (key === 'structuredData') JSON.parse(next); // must remain valid JSON
        node[key] = next;
        changed = true;
      }
    } else if (value && typeof value === 'object') {
      changed = fixSeo(value, `${trail}.${key}`) || changed;
    }
  }
  return changed;
}

const [posts, faqs, seo] = await Promise.all([read('posts'), read('faqs'), read('seo')]);
const updates = [];
if (posts && fixPosts(posts)) updates.push(['posts', posts]);
if (faqs && fixFaqs(faqs)) updates.push(['faqs', faqs]);
if (seo && fixSeo(seo)) updates.push(['seo', seo]);

if (changes.length === 0) {
  console.log('✅ Nothing to change — Turso already has the corrected content.');
  process.exit(0);
}

console.log(changes.map(c => `  • ${c}`).join('\n'));

if (!APPLY) {
  console.log(`\nDry run: ${updates.length} key(s) would be updated. Re-run with --apply to write.`);
  process.exit(0);
}

const now = new Date().toISOString();
await db.batch(updates.map(([key, value]) => ({
  sql: 'UPDATE kv_store SET value = ?, updated_at = ? WHERE key = ?',
  args: [JSON.stringify(value), now, key],
})), 'write');
console.log(`\n✅ Updated ${updates.map(([k]) => k).join(', ')} in Turso. Live pages refresh within ~60s (cache TTL).`);
