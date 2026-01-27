"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {
    const password = formData.get("password");

    // Simple hardcoded password for now - In production use env vars
    if (password === "admin123") {
        // Set cookie
        (await cookies()).set("admin_session", "true", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: "/",
        });

        redirect("/admin");
    } else {
        return { error: "Invalid Password" };
    }
}

export async function logout() {
    (await cookies()).delete("admin_session");
    redirect("/admin/login");
}
