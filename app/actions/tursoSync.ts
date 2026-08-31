"use server";

import {
    getTursoStatus,
    syncLocalToTurso,
    syncTursoToLocal
} from "@/lib/tursoSync";
import { revalidatePath } from "next/cache";

export async function checkTursoConnection() {
    try {
        const status = await getTursoStatus();
        return { success: true, status };
    } catch (error: any) {
        return { success: false, error: error.message || "Failed to check Turso status" };
    }
}

export async function pushLocalToTurso() {
    try {
        const res = await syncLocalToTurso();
        if (res.success) {
            revalidatePath("/", "layout");
            return {
                success: true,
                message: `Successfully synced ${res.syncedKeys.length} collections and ${res.uploadedMediaCount} media files (${(res.totalMediaSize / (1024 * 1024)).toFixed(2)} MB) to Turso cloud.`,
                details: res
            };
        }
        return { success: false, error: res.error || "Sync failed" };
    } catch (error: any) {
        return { success: false, error: error.message || "Error pushing to Turso" };
    }
}

export async function pullTursoToLocal() {
    try {
        const res = await syncTursoToLocal();
        if (res.success) {
            revalidatePath("/", "layout");
            return {
                success: true,
                message: `Successfully downloaded ${res.downloadedKeys.length} collections and ${res.downloadedMediaCount} media files from Turso cloud to local storage.`,
                details: res
            };
        }
        return { success: false, error: res.error || "Sync failed" };
    } catch (error: any) {
        return { success: false, error: error.message || "Error pulling from Turso" };
    }
}
