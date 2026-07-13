import React from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      <AdminSidebar />
      <main className="flex-1 lg:ml-64 p-4 md:p-8 lg:p-12 overflow-y-auto h-screen">
        {children}
      </main>
    </div>
  );
}
