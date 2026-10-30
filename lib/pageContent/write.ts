/**
 * Validation for page-content writes, kept free of Next.js/DB imports so it can be unit-tested.
 * The server actions in app/actions/pageContent.ts are thin wrappers around these checks.
 */
import type { AdminRole } from "@/lib/db";
import { getSectionDef, isCustomSectionsKey } from "./registry";
import { sanitizeSectionContent } from "./schema";
import { sanitizeBlocks } from "./blocks";
import { CONTENT_KEY_PATTERN } from "./types";

/** Roles allowed to change page content (the "seo" role is read-only). */
export const CONTENT_WRITE_ROLES: readonly AdminRole[] = ["super_admin", "admin", "manager"];

export const canWriteContent = (role: AdminRole | undefined | null) => !!role && CONTENT_WRITE_ROLES.includes(role);

export const MAX_CONTENT_BYTES = 200 * 1024;

export function validateContentKey(key: unknown): string | null {
    if (typeof key !== "string" || !CONTENT_KEY_PATTERN.test(key)) return "Invalid content key.";
    if (!getSectionDef(key) && !isCustomSectionsKey(key)) return `Unknown content key "${key}".`;
    return null;
}

export type PreparedWrite = { ok: true; clean: unknown } | { ok: false; error: string };

/** Validates the key and sanitizes content against the section's schema (or the block schema). */
export function prepareContentWrite(key: unknown, content: unknown): PreparedWrite {
    const keyError = validateContentKey(key);
    if (keyError) return { ok: false, error: keyError };

    const def = getSectionDef(key as string);
    let clean: unknown;
    if (def) {
        if (!content || typeof content !== "object" || Array.isArray(content)) return { ok: false, error: "Content must be an object." };
        clean = sanitizeSectionContent(def.fields, content);
    } else {
        if (!Array.isArray(content)) return { ok: false, error: "Custom sections must be a list of blocks." };
        clean = sanitizeBlocks(content);
    }

    if (JSON.stringify(clean).length > MAX_CONTENT_BYTES) return { ok: false, error: "Content is too large (limit 200 KB)." };
    return { ok: true, clean };
}
