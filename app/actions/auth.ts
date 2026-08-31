"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getUserByEmail, updateUser, type User } from "@/lib/db";
import { sendEmail } from "@/lib/mailer";

export async function login(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const user = await getUserByEmail(email);

    if (user && user.password === password) {
        // Set cookies
        const cookieStore = await cookies();
        
        cookieStore.set("admin_session", "true", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: "/",
        });

        // Store role in a separate cookie to easily read it on the client
        cookieStore.set("admin_role", user.role, {
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: "/",
        });

        cookieStore.set("admin_name", user.name, {
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: "/",
        });

        cookieStore.set("admin_email", user.email, {
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: "/",
        });


        redirect("/admin");
    } else {
        return { error: "Invalid Credentials" };
    }
}

export async function logout() {
    const cookieStore = await cookies();
    cookieStore.delete("admin_session");
    cookieStore.delete("admin_role");
    cookieStore.delete("admin_name");
    cookieStore.delete("admin_email");
    redirect("/admin/login");
}

export async function changePassword(formData: FormData) {
    const cookieStore = await cookies();
    const email = cookieStore.get("admin_email")?.value;
    const newPassword = formData.get("newPassword") as string;

    if (!email) throw new Error("Not authenticated");

    const user = await getUserByEmail(email);
    if (!user) throw new Error("User not found");

    await updateUser(user.id, { password: newPassword, forcePasswordChange: false });
    revalidatePath("/admin", "layout");
    redirect("/admin");
}

function generateRandomPassword() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789@#$*";
    let password = "Esc-";
    for (let i = 0; i < 8; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
}

export async function resetPassword(email: string) {
    const user = await getUserByEmail(email);
    if (!user) return { error: "No account found with that email." };

    const newPassword = generateRandomPassword();
    await updateUser(user.id, { password: newPassword, forcePasswordChange: true });

    const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ccc;">
            <h2 style="color: #d32f2f; text-transform: uppercase;">System Access Reset</h2>
            <p>Hello ${user.name},</p>
            <p>Your Elite Steel Concepts administrative password has been reset.</p>
            <p><strong>Your Temporary Password:</strong> <span style="background: #eee; padding: 4px 8px; font-weight: bold; font-family: monospace;">${newPassword}</span></p>
            <p>You will be required to change this password immediately upon logging in.</p>
            <a href="https://esteelconcepts.com/admin/login" style="display: inline-block; background: #000; color: #fff; padding: 10px 20px; text-decoration: none; margin-top: 20px;">Access Command Center</a>
        </div>
    `;

    try {
        await sendEmail({
            to: email,
            subject: "ESC Admin - Temporary Password Issued",
            html: htmlContent
        });
        return { success: "A temporary password has been emailed to you." };
    } catch (e) {
        return { error: "Failed to send reset email. Please contact an administrator." };
    }
}
