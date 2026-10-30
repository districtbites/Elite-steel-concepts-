import { cookies } from "next/headers";
import { getUserByEmail, type AdminRole, type User } from "@/lib/db";

/**
 * Returns the signed-in admin, looked up on the server.
 * The role always comes from the user record, never from the client-readable `admin_role` cookie.
 */
export async function getCurrentAdmin(): Promise<User | null> {
    const cookieStore = await cookies();
    if (!cookieStore.get("admin_session")) return null;
    const email = cookieStore.get("admin_email")?.value;
    return email ? (await getUserByEmail(email)) ?? null : null;
}

export type RoleCheck = { ok: true; user: User } | { ok: false; error: string };

/** Checks that the current admin has one of `allowed` roles. */
export async function requireRole(allowed: readonly AdminRole[]): Promise<RoleCheck> {
    const user = await getCurrentAdmin();
    if (!user) return { ok: false, error: "You are not signed in." };
    if (!allowed.includes(user.role)) return { ok: false, error: "Your role does not have permission for this action." };
    return { ok: true, user };
}
