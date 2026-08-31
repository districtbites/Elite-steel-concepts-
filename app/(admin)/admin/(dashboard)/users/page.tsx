import React from "react";
import { getUsers, deleteUser, createUser, updateUser, type AdminRole } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Shield, ShieldAlert, Plus, Trash2, Edit2, Key, Mail, User as UserIcon } from "lucide-react";
import Button from "@/components/ui/Button";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const cookieStore = await cookies();
  const role = cookieStore.get("admin_role")?.value;

  // Enforce Super Admin only access
  if (role !== "super_admin") {
    redirect("/admin");
  }

  const users = await getUsers();

  async function handleAddUser(formData: FormData) {
    "use server";
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const newRole = formData.get("role") as AdminRole;

    await createUser({ name, email, password, role: newRole });
    revalidatePath("/admin/users");
  }

  async function handleDeleteUser(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    await deleteUser(id);
    revalidatePath("/admin/users");
  }

  async function handleAdminResetPassword(formData: FormData) {
    "use server";
    const email = formData.get("email") as string;
    const { resetPassword } = await import("@/app/actions/auth");
    await resetPassword(email);
    revalidatePath("/admin/users");
  }

  return (
    <div className="space-y-12 max-w-6xl">
      {/* HEADER */}
      <div className="border-b-4 border-admin-text pb-8">
        <div className="flex items-center gap-3 mb-4">
          <ShieldAlert className="text-primary" size={24} />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">High Security Clearance</span>
        </div>
        <h1 className="text-5xl font-black uppercase tracking-tighter text-admin-text">
          Team Access Control
        </h1>
        <p className="text-admin-muted mt-4 font-bold text-sm tracking-wide">
          Manage system users, roles, and administrative privileges.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* ADD USER FORM */}
        <div className="lg:col-span-1 space-y-6">
          <h2 className="text-xl font-black uppercase tracking-tighter text-admin-text border-b border-admin-border pb-4 flex items-center gap-2">
            <Plus size={18} className="text-primary" /> New Operative
          </h2>
          
          <form action={handleAddUser} className="bg-admin-surface border border-admin-border p-6 space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-admin-text">Full Name</label>
              <input 
                type="text" 
                name="name" 
                required 
                className="w-full bg-admin-bg border border-admin-border p-3 outline-none focus:border-primary text-admin-text font-bold"
                placeholder="John Doe"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-admin-text">Email Address</label>
              <input 
                type="email" 
                name="email" 
                required 
                className="w-full bg-admin-bg border border-admin-border p-3 outline-none focus:border-primary text-admin-text font-bold"
                placeholder="operative@esc.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-admin-text">Access Level (Role)</label>
              <select 
                name="role" 
                required 
                className="w-full bg-admin-bg border border-admin-border p-3 outline-none focus:border-primary text-admin-text font-bold"
              >
                <option value="super_admin">Super Admin (Full Access)</option>
                <option value="admin">Admin (No User Management)</option>
                <option value="manager">Manager (No System Settings)</option>
                <option value="seo">SEO/Content (Blog & SEO Only)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-admin-text">Initial Password</label>
              <input 
                type="text" 
                name="password" 
                required 
                className="w-full bg-admin-bg border border-admin-border p-3 outline-none focus:border-primary text-admin-text font-bold"
                placeholder="Secure Password"
              />
            </div>

            <Button type="submit" className="w-full bg-primary text-admin-text hover:bg-admin-text hover:text-admin-surface">
              Authorize User
            </Button>
          </form>
        </div>

        {/* USERS LIST */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-black uppercase tracking-tighter text-admin-text border-b border-admin-border pb-4 flex items-center gap-2">
            <Shield size={18} className="text-primary" /> Active Personnel
          </h2>
          
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user.id} className="bg-admin-surface border border-admin-border p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-primary/50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-admin-bg border border-admin-border flex items-center justify-center shrink-0 text-admin-muted">
                    <UserIcon size={20} />
                  </div>
                  <div>
                    <div className="text-sm font-black uppercase tracking-widest text-admin-text flex items-center gap-2">
                      {user.name}
                      {user.role === "super_admin" && <ShieldAlert size={14} className="text-primary" />}
                    </div>
                    <div className="text-[10px] font-bold text-admin-muted uppercase tracking-widest flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-1"><Mail size={10} /> {user.email}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 border-t border-admin-border md:border-t-0 pt-4 md:pt-0">
                  <span className="px-3 py-1 bg-admin-bg border border-admin-border text-[9px] font-black text-primary uppercase tracking-[0.2em]">
                    {user.role.replace("_", " ")}
                  </span>

                  {user.role !== "super_admin" && (
                    <div className="flex items-center gap-1 border-l border-admin-border ml-2 pl-2">
                      <form action={handleAdminResetPassword}>
                        <input type="hidden" name="email" value={user.email} />
                        <button type="submit" className="text-admin-muted hover:text-primary transition-colors p-2" title="Force Password Reset via Email">
                          <Key size={16} />
                        </button>
                      </form>
                      
                      <form action={handleDeleteUser}>
                        <input type="hidden" name="id" value={user.id} />
                        <button type="submit" className="text-admin-muted hover:text-red-500 transition-colors p-2" title="Revoke Access">
                          <Trash2 size={16} />
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
