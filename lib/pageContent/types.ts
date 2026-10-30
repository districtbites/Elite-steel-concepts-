/**
 * Page Content CMS: shared types.
 *
 * Every editable section is identified by a content key "<page>.<section>" (e.g. "home.hero").
 * Its content is a plain JSON object described by a list of FieldDefs. The admin editor renders
 * a form from those fields and the server sanitizes saved content against them, so a section's
 * shape is defined in exactly one place. Defaults live in code (lib/pageContent/pages/*);
 * the database only stores overrides.
 */

// ─── Field schema ──────────────────────────────────────────────────────────

interface FieldBase {
    name: string;
    label: string;
    help?: string;
    placeholder?: string;
}

export interface ScalarFieldDef extends FieldBase {
    type: "text" | "textarea" | "number" | "link" | "image";
    rows?: number; // textarea height
}

/** A list of plain strings (bullet points, area names...). */
export interface StringListFieldDef extends FieldBase {
    type: "strings";
    itemLabel: string;
}

/** A list of objects (cards, stats, steps...). Items only contain scalar fields. */
export interface ListFieldDef extends FieldBase {
    type: "list";
    itemLabel: string;
    fields: ScalarFieldDef[];
    /** Item field shown as the collapsed card title */
    titleField?: string;
}

export type FieldDef = ScalarFieldDef | StringListFieldDef | ListFieldDef;

export type ContentValue = string | number | string[] | Record<string, string | number>[];
export type SectionContent = Record<string, ContentValue>;

// ─── Sections & pages ──────────────────────────────────────────────────────

/** Maps content fields to a legacy SEO-Manager page section ("Page Sections" tab). */
export interface LegacySource {
    seoPage: string;
    seoSection: string;
    fields: Record<string, "title" | "subtitle" | "content" | "ctaText">;
}

export interface SectionDef<T extends SectionContent = SectionContent> {
    key: string;          // "<page>.<section>"
    label: string;
    description: string;
    fields: FieldDef[];
    defaults: T;
    /** Earlier copy saved in the SEO Manager wins over `defaults` until this section is saved here. */
    legacy?: LegacySource;
}

export interface PageDef {
    id: string;           // first part of the key: "home", "custom_food_trucks", "site"
    label: string;
    icon: string;         // lucide icon name, resolved in the admin
    path: string | null;  // public route used for preview + revalidation; null = site-wide
    /** Page supports the modular "<page>.custom_sections" builder */
    builder?: boolean;
    sections: SectionDef[];
}

// ─── Stored overrides ──────────────────────────────────────────────────────

export interface PageContentEntry {
    content: unknown;
    updatedAt: string;
    updatedBy?: string; // admin email
}

/** Typed helper so each section's defaults keep their literal shape for the page components. */
export function defineSection<T extends SectionContent>(def: SectionDef<T>): SectionDef<T> {
    return def;
}

export const CONTENT_KEY_PATTERN = /^[a-z0-9_]+\.[a-zA-Z0-9_]+$/;
export const CUSTOM_SECTIONS = "custom_sections";
export const customSectionsKey = (pageId: string) => `${pageId}.${CUSTOM_SECTIONS}`;
