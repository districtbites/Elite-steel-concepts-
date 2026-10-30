"use server";

import { revalidatePath } from "next/cache";
import { setPageContentOverride, deletePageContentOverride } from "@/lib/db";
import { requireRole } from "@/lib/adminAuth";
import { getPageDef } from "@/lib/pageContent/registry";
import { CONTENT_WRITE_ROLES, prepareContentWrite, validateContentKey } from "@/lib/pageContent/write";
import type { PageContentEntry } from "@/lib/pageContent/types";

export interface PageContentActionResult {
    success: boolean;
    error?: string;
    entry?: PageContentEntry | null;
}

/** Revalidates the public page(s) showing this key, plus the admin screen. */
function revalidateFor(key: string) {
    const page = getPageDef(key.split(".")[0]);
    if (page?.path) revalidatePath(page.path);
    else revalidatePath("/", "layout"); // site-wide sections (header/footer) appear on every page
    revalidatePath("/admin/page-content");
}

/** Saves (upserts) a section override. Content is sanitized against the section's field schema. */
export async function savePageContentAction(key: string, content: unknown): Promise<PageContentActionResult> {
    const auth = await requireRole(CONTENT_WRITE_ROLES);
    if (!auth.ok) return { success: false, error: auth.error };

    const prepared = prepareContentWrite(key, content);
    if (!prepared.ok) return { success: false, error: prepared.error };

    const entry: PageContentEntry = { content: prepared.clean, updatedAt: new Date().toISOString(), updatedBy: auth.user.email };
    try {
        await setPageContentOverride(key, entry);
    } catch (error) {
        console.error(`[pageContent] save "${key}" failed:`, error);
        return { success: false, error: "Could not save. Please try again." };
    }
    revalidateFor(key);
    return { success: true, entry };
}

/** Deletes a section override so the default copy is shown again. */
export async function resetPageContentAction(key: string): Promise<PageContentActionResult> {
    const auth = await requireRole(CONTENT_WRITE_ROLES);
    if (!auth.ok) return { success: false, error: auth.error };

    const keyError = validateContentKey(key);
    if (keyError) return { success: false, error: keyError };

    try {
        await deletePageContentOverride(key);
    } catch (error) {
        console.error(`[pageContent] reset "${key}" failed:`, error);
        return { success: false, error: "Could not reset. Please try again." };
    }
    revalidateFor(key);
    return { success: true, entry: null };
}
