"use client";

import React from "react";
import { usePathname } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { ThemeProvider } from "@/app/admin/ThemeProvider";
import type { AdminRole } from "@/lib/db";

/** Pages shown before signing in: no sidebar and no password gate. */
const SIGNED_OUT_PATHS = ["/admin/login", "/admin/forgot-password"];

/** Admin screen frame. `passwordGate` replaces the page when the user must change their password. */
export default function AdminChrome({
  role,
  name,
  passwordGate,
  children,
}: {
  role: AdminRole;
  name: string;
  passwordGate?: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  if (SIGNED_OUT_PATHS.includes(pathname)) return <>{children}</>;
  if (passwordGate) return <ThemeProvider>{passwordGate}</ThemeProvider>;

  return (
    <ThemeProvider>
      <div className="flex min-h-screen bg-admin-bg font-sans selection:bg-primary/20 selection:text-primary transition-colors duration-300 text-admin-text">
        <AdminSidebar role={role} name={name} />
        <main className="flex-1 lg:ml-[280px] p-6 md:p-8 lg:p-12 overflow-y-auto h-screen w-full relative">
          <div className="max-w-[1600px] mx-auto">{children}</div>
        </main>
      </div>
    </ThemeProvider>
  );
}
