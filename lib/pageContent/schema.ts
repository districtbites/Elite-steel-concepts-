/**
 * Pure helpers shared by the admin editor, server actions and public renderer
 * (no server-only imports here).
 */
import type { ContentValue, FieldDef, SectionContent } from "./types";

const MAX_TEXT = 20000;
const MAX_ITEMS = 60;

const toText = (v: unknown) => (typeof v === "string" ? v : typeof v === "number" ? String(v) : "").slice(0, MAX_TEXT);
const toNumber = (v: unknown) => {
    const n = typeof v === "number" ? v : parseFloat(String(v ?? ""));
    return Number.isFinite(n) ? n : 0;
};

/**
 * Keeps only the fields a section declares, coerced to their declared type.
 * Fields missing from the input are omitted, so they fall back to the default when merged.
 */
export function sanitizeSectionContent(fields: FieldDef[], input: unknown): SectionContent {
    const src = input && typeof input === "object" && !Array.isArray(input) ? (input as Record<string, unknown>) : {};
    const out: SectionContent = {};
    for (const field of fields) {
        if (!(field.name in src)) continue;
        const value = src[field.name];
        switch (field.type) {
            case "number":
                out[field.name] = toNumber(value);
                break;
            case "strings":
                out[field.name] = (Array.isArray(value) ? value : []).slice(0, MAX_ITEMS).map(toText);
                break;
            case "list":
                out[field.name] = (Array.isArray(value) ? value : []).slice(0, MAX_ITEMS).map(item => {
                    const it = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
                    const row: Record<string, string | number> = {};
                    for (const sub of field.fields) row[sub.name] = sub.type === "number" ? toNumber(it[sub.name]) : toText(it[sub.name]);
                    return row;
                });
                break;
            default:
                out[field.name] = toText(value);
        }
    }
    return out;
}

/** Order-insensitive deep equality for JSON content (used for the "unsaved changes" badge). */
export function sameContent(a: unknown, b: unknown): boolean {
    return stableStringify(a) === stableStringify(b);
}

function stableStringify(v: unknown): string {
    if (Array.isArray(v)) return `[${v.map(stableStringify).join(",")}]`;
    if (v && typeof v === "object") {
        return `{${Object.keys(v as object)
            .sort()
            .map(k => `${JSON.stringify(k)}:${stableStringify((v as Record<string, unknown>)[k])}`)
            .join(",")}}`;
    }
    return JSON.stringify(v ?? null);
}

/**
 * Replaces "{token}" placeholders in every string of a value (deeply).
 * Lets copy like "{trucksBuiltCount}+ builds" follow the numbers in Settings.
 */
export function resolveTokens<T>(value: T, tokens: Record<string, string>): T {
    if (typeof value === "string") {
        return value.replace(/\{(\w+)\}/g, (m, name) => (name in tokens ? tokens[name] : m)) as T;
    }
    if (Array.isArray(value)) return value.map(v => resolveTokens(v, tokens)) as T;
    if (value && typeof value === "object") {
        return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, resolveTokens(v, tokens)])) as T;
    }
    return value;
}

/** Splits a multi-paragraph textarea value into paragraphs (blank-line separated). */
export const paragraphs = (text: ContentValue | undefined) =>
    String(text ?? "")
        .replace(/\r\n/g, "\n")
        .split(/\n\s*\n/)
        .map(p => p.trim())
        .filter(Boolean);
