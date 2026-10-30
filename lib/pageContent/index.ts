/**
 * Page Content CMS: server-side data helpers.
 *
 * Effective content of a section = { ...defaults, ...legacy SEO-Manager copy, ...saved override },
 * with "{token}" placeholders resolved from Settings. Public pages call getSection() and always
 * get a complete object, so a page never breaks when a field or the database is missing.
 */
import { getPageContentOverrides, getPageSEO, getSettings, type GlobalSettings } from "@/lib/db";
import { PAGES, getSectionDef, getPageDef } from "./registry";
import { resolveTokens } from "./schema";
import { sanitizeBlocks, type CustomBlock } from "./blocks";
import { customSectionsKey, type PageContentEntry, type SectionContent, type SectionDef } from "./types";

/** Values available as "{name}" tokens in any text field. */
export function contentTokens(settings: GlobalSettings): Record<string, string> {
    return {
        experienceYears: String(settings.experienceYears || 14),
        trucksBuiltCount: String(settings.trucksBuiltCount || 350),
        phone: settings.phone || "",
        email: settings.email || "",
        address: settings.address || ""
    };
}

/** Defaults merged with copy previously saved in the SEO Manager's page sections (unresolved tokens). */
async function baseContent<T extends SectionContent>(def: SectionDef<T>): Promise<T> {
    if (!def.legacy) return def.defaults;
    const section = (await getPageSEO(def.legacy.seoPage)).sections?.[def.legacy.seoSection];
    if (!section) return def.defaults;
    const merged: SectionContent = { ...def.defaults };
    for (const [field, source] of Object.entries(def.legacy.fields)) {
        const value = section[source];
        if (typeof value === "string" && value.trim()) merged[field] = value.replace(/\r\n/g, "\n");
    }
    return merged as T;
}

function applyOverride<T extends SectionContent>(base: T, entry: PageContentEntry | undefined): T {
    const saved = entry?.content;
    return saved && typeof saved === "object" && !Array.isArray(saved) ? { ...base, ...(saved as Partial<T>) } : base;
}

/** Effective content of one section, ready to render. */
export async function getSection<T extends SectionContent>(def: SectionDef<T>): Promise<T> {
    const [overrides, settings, base] = await Promise.all([getPageContentOverrides(), getSettings(), baseContent(def)]);
    return resolveTokens(applyOverride(base, overrides[def.key]), contentTokens(settings));
}

/** Effective content of several sections at once (same order as `defs`). */
export async function getSections<D extends readonly SectionDef<SectionContent>[]>(
    defs: D
): Promise<{ [I in keyof D]: D[I] extends SectionDef<infer T> ? T : never }> {
    return Promise.all(defs.map(d => getSection(d))) as never;
}

/** Effective content by key (null for unknown keys). */
export async function getPageContent(key: string): Promise<SectionContent | null> {
    const def = getSectionDef(key);
    return def ? getSection(def) : null;
}

/** Enabled modular blocks of a page, in order, ready to render. */
export async function getCustomSections(pageId: string): Promise<CustomBlock[]> {
    if (!getPageDef(pageId)?.builder) return [];
    const [overrides, settings] = await Promise.all([getPageContentOverrides(), getSettings()]);
    const blocks = sanitizeBlocks(overrides[customSectionsKey(pageId)]?.content).filter(b => b.enabled);
    return resolveTokens(blocks, contentTokens(settings));
}

export interface AdminSectionState {
    base: unknown;                 // default (incl. legacy copy) — what "Reset to default" restores
    saved: PageContentEntry | null;
}

/** Everything the admin editor needs: base + saved override for every key (tokens unresolved). */
export async function getAdminPageContentState(): Promise<Record<string, AdminSectionState>> {
    const overrides = await getPageContentOverrides();
    const state: Record<string, AdminSectionState> = {};
    for (const page of PAGES) {
        for (const def of page.sections) {
            state[def.key] = { base: await baseContent(def), saved: overrides[def.key] ?? null };
        }
        if (page.builder) {
            const key = customSectionsKey(page.id);
            state[key] = { base: [], saved: overrides[key] ?? null };
        }
    }
    return state;
}
