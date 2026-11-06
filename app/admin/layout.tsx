import React from"react";
import AdminChrome from "@/components/admin/AdminChrome";

import { cookies } from "next/headers";
import { getUserByEmail, type AdminRole } from "@/lib/db";
import { changePassword } from "@/app/actions/auth";
import Button from "@/components/ui/Button";
import { ShieldAlert } from "lucide-react";

export default async function AdminLayout({
 children,
}: {
 children: React.ReactNode;
}) {
 const cookieStore = await cookies();
 const email = cookieStore.get("admin_email")?.value;
 const user = email ? await getUserByEmail(email) : null;

 const role = (cookieStore.get("admin_role")?.value || "admin") as AdminRole;
 const name = cookieStore.get("admin_name")?.value || "System Admin";

 const passwordGate = user?.forcePasswordChange ? (
    <div className="min-h-screen bg-admin-bg flex items-center justify-center p-4">
      <div className="bg-admin-surface border border-admin-border max-w-lg w-full p-8 space-y-6">
         <div className="border-b border-admin-border pb-6 text-center">
            <ShieldAlert size={48} className="text-primary mx-auto mb-4 animate-pulse" />
            <h1 className="text-2xl font-black uppercase text-admin-text tracking-tighter">Security Protocol Initiated</h1>
            <p className="text-admin-muted text-xs font-bold uppercase tracking-widest mt-2">Mandatory Password Update Required</p>
         </div>
         <form action={changePassword} className="space-y-6">
            <div className="space-y-2">
               <label className="text-xs font-black uppercase tracking-widest text-admin-text">New Password</label>
               <input 
                 type="password" 
                 name="newPassword" 
                 required 
                 minLength={8}
                 className="w-full bg-admin-bg border border-admin-border p-4 outline-none focus:border-primary text-admin-text font-bold"
                 placeholder="Enter at least 8 characters"
               />
            </div>
            <Button type="submit" className="w-full bg-primary text-admin-text py-4 uppercase font-black tracking-widest hover:bg-admin-text hover:text-admin-surface">
               Secure Account & Continue
            </Button>
         </form>
      </div>
    </div>
 ) : undefined;

 return (
 <AdminChrome role={role} name={name} passwordGate={passwordGate}>
 {children}
 </AdminChrome>
 );
}
