/**
 * test-page-content.mjs — Page Content CMS tests
 * Run: npm run test:page-content
 *
 * Runs against a throw-away local db.json in a temp folder with Turso disabled,
 * so it never touches the real database.
 */
import { register } from "node:module";
import { pathToFileURL, fileURLToPath } from "node:url";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import assert from "node:assert/strict";

register(pathToFileURL(path.join(path.dirname(fileURLToPath(import.meta.url)), "lib/ts-hooks.mjs")).href);

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const lib = (p) => pathToFileURL(path.join(ROOT, p)).href;

// Isolated database: no Turso, empty db.json in a temp working directory
for (const k of ["TURSO_DATABASE_URL", "TURSO_DB_URL", "LIBSQL_URL", "TURSO_AUTH_TOKEN", "LIBSQL_AUTH_TOKEN"]) delete process.env[k];
const tmp = await fs.mkdtemp(path.join(os.tmpdir(), "page-content-test-"));
await fs.mkdir(path.join(tmp, "data"));
await fs.writeFile(path.join(tmp, "data/db.json"), "{}");
process.chdir(tmp);

const write = await import(lib("lib/pageContent/write.ts"));
const schema = await import(lib("lib/pageContent/schema.ts"));
const blocks = await import(lib("lib/pageContent/blocks.ts"));
const { sanitizeHtml } = await import(lib("lib/sanitizeHtml.ts"));
const db = await import(lib("lib/db.ts"));
const { PAGES } = await import(lib("lib/pageContent/registry.ts"));
const { HOME_INTRO } = await import(lib("lib/pageContent/pages/home.ts"));

let passed = 0;
const failures = [];
async function test(name, fn) {
    try {
        await fn();
        passed++;
        console.log(`  ✓ ${name}`);
    } catch (err) {
        failures.push(name);
        console.log(`  ✗ ${name}\n    ${err.message}`);
    }
}

console.log("\nPage Content CMS\n");

await test("registry: every key is valid, unique and prefixed with its page id", () => {
    const seen = new Set();
    for (const page of PAGES) {
        for (const s of page.sections) {
            assert.match(s.key, /^[a-z0-9_]+\.[a-zA-Z0-9_]+$/, s.key);
            assert.ok(s.key.startsWith(`${page.id}.`), `${s.key} is not under page "${page.id}"`);
            assert.ok(!seen.has(s.key), `duplicate key ${s.key}`);
            seen.add(s.key);
            for (const f of s.fields) assert.ok(f.name in s.defaults, `${s.key}: field "${f.name}" has no default`);
        }
    }
});

await test("permissions: seo and anonymous users cannot write", () => {
    assert.equal(write.canWriteContent("super_admin"), true);
    assert.equal(write.canWriteContent("admin"), true);
    assert.equal(write.canWriteContent("manager"), true);
    assert.equal(write.canWriteContent("seo"), false);
    assert.equal(write.canWriteContent(undefined), false);
    assert.equal(write.canWriteContent(null), false);
});

await test("validation: rejects malformed and unknown keys", () => {
    assert.equal(write.prepareContentWrite("Home Hero", {}).ok, false);
    assert.equal(write.prepareContentWrite("home", {}).ok, false);
    assert.equal(write.prepareContentWrite("home.nope", {}).ok, false);
    assert.equal(write.prepareContentWrite("site.custom_sections", []).ok, false); // site has no builder
    assert.equal(write.prepareContentWrite(42, {}).ok, false);
});

await test("validation: section content must be an object; builder content must be an array", () => {
    assert.equal(write.prepareContentWrite("home.intro", "text").ok, false);
    assert.equal(write.prepareContentWrite("home.intro", [1, 2]).ok, false);
    assert.equal(write.prepareContentWrite("home.intro", null).ok, false);
    assert.equal(write.prepareContentWrite("home.custom_sections", { a: 1 }).ok, false);
    assert.equal(write.prepareContentWrite("home.custom_sections", []).ok, true);
});

await test("sanitize: unknown fields are dropped and types coerced", () => {
    const r = write.prepareContentWrite("home.localcoverage", { title: "New", areas: ["A", 5], evil: "<x>", ctaLink: 12 });
    assert.equal(r.ok, true);
    assert.deepEqual(r.clean, { title: "New", areas: ["A", "5"], ctaLink: "12" });
});

await test("sanitize: oversized content is rejected", () => {
    const r = write.prepareContentWrite("home.intro", { body: "x".repeat(19000), title: "y".repeat(19000), eyebrow: "z".repeat(19000), primaryCtaText: "a".repeat(19000), secondaryCtaText: "b".repeat(19000), primaryCtaLink: "c".repeat(19000), secondaryCtaLink: "d".repeat(19000), extra: "" });
    assert.equal(r.ok, true); // 7 × 19 KB = 133 KB is fine
    const blocksList = Array.from({ length: 50 }, (_, i) => ({ type: "rich_text", id: `b${i}`, body: "x".repeat(10000) }));
    assert.equal(write.prepareContentWrite("home.custom_sections", blocksList).ok, false);
});

await test("blocks: invalid blocks dropped, fields normalized", () => {
    const out = blocks.sanitizeBlocks([
        { type: "features", title: "T", columns: 7, theme: "neon", items: [{ title: "A", junk: 1 }], onclick: "x" },
        { type: "unknown" },
        "nope",
        { type: "testimonials", items: [{ quote: "Q", rating: 9 }] }
    ]);
    assert.equal(out.length, 2);
    assert.equal(out[0].columns, 3);
    assert.equal(out[0].theme, "light");
    assert.deepEqual(out[0].items, [{ title: "A" }]);
    assert.equal(out[0].enabled, true);
    assert.ok(!("onclick" in out[0]));
    assert.equal(out[1].items[0].rating, 5);
});

await test("blueprints: every block type has one and it sanitizes cleanly", () => {
    for (const type of blocks.BLOCK_TYPES) {
        const b = blocks.blockFromBlueprint(type);
        assert.equal(b.type, type);
        assert.equal(blocks.sanitizeBlocks([b]).length, 1, type);
    }
});

await test("rich text: scripts, handlers and javascript: URLs are removed", () => {
    const html = sanitizeHtml(`<p onclick="x()">Hi <a href="javascript:alert(1)">bad</a> <a href="/quote" target="_blank">ok</a></p><script>alert(1)</script><img src=x onerror=alert(1)><iframe src="//evil"></iframe><style>*{}</style>`);
    assert.ok(!/script|onclick|onerror|javascript:|iframe|style/i.test(html), html);
    assert.ok(html.includes('<a href="/quote" target="_blank" rel="noopener noreferrer">ok</a>'), html);
    assert.equal(sanitizeHtml("a < b <b>bold</b> <unknown>"), "a &lt; b <b>bold</b> ");
});

await test("tokens: {placeholders} resolve deeply, unknown tokens stay", () => {
    const r = schema.resolveTokens({ a: "{x}+ builds", b: ["{y}"], c: [{ d: "{zz}" }] }, { x: "350", y: "14" });
    assert.deepEqual(r, { a: "350+ builds", b: ["14"], c: [{ d: "{zz}" }] });
});

await test("db: upsert stores an override and reading it back merges with defaults", async () => {
    const r = write.prepareContentWrite("home.intro", { title: "Saved Title" });
    assert.equal(r.ok, true);
    await db.setPageContentOverride("home.intro", { content: r.clean, updatedAt: new Date().toISOString(), updatedBy: "t@test" });
    await db.setPageContentOverride("home.intro", { content: { title: "Updated Title" }, updatedAt: new Date().toISOString() });
    const overrides = await db.getPageContentOverrides();
    assert.deepEqual(overrides["home.intro"].content, { title: "Updated Title" }); // upsert replaced, not duplicated
    const merged = { ...HOME_INTRO.defaults, ...overrides["home.intro"].content };
    assert.equal(merged.title, "Updated Title");
    assert.equal(merged.primaryCtaLink, HOME_INTRO.defaults.primaryCtaLink); // missing fields fall back
    const onDisk = JSON.parse(await fs.readFile(path.join(tmp, "data/db.json"), "utf-8"));
    assert.equal(onDisk.pageContent["home.intro"].content.title, "Updated Title");
});

await test("db: reset deletes the override (default comes back)", async () => {
    assert.equal(await db.deletePageContentOverride("home.intro"), true);
    assert.equal((await db.getPageContentOverrides())["home.intro"], undefined);
    assert.equal(await db.deletePageContentOverride("home.intro"), false); // idempotent
});

await test("sameContent: key order does not matter", () => {
    assert.equal(schema.sameContent({ a: 1, b: [1, { c: 2, d: 3 }] }, { b: [1, { d: 3, c: 2 }], a: 1 }), true);
    assert.equal(schema.sameContent({ a: 1 }, { a: 2 }), false);
});

await fs.rm(tmp, { recursive: true, force: true });
console.log(`\n${passed} passed, ${failures.length} failed\n`);
process.exit(failures.length ? 1 : 0);
