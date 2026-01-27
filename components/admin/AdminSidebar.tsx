"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, Settings, Search, LogOut, MessageSquare, Mail, Star, Briefcase } from "lucide-react";

const menuItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Quote Requests", href: "/admin/quotes", icon: MessageSquare },
  { name: "Contact Msgs", href: "/admin/contacts", icon: Mail },
  { name: "Portfolio", href: "/admin/portfolio", icon: Briefcase },
  { name: "Blog Posts", href: "/admin/blog", icon: FileText },
  { name: "Testimonials", href: "/admin/testimonials", icon: Star },
  { name: "SEO Manager", href: "/admin/seo", icon: Search },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

const AdminSidebar = () => {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-secondary text-white h-screen fixed left-0 top-0 flex flex-col border-r border-white/10">
      <div className="p-6 border-b border-white/10">
        <h1 className="text-xl font-black uppercase tracking-tight text-primary">
          ESC Admin
        </h1>
        <p className="text-xs text-gray-400">Control Panel</p>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-4 py-3 rounded-md transition-all duration-200 group ${
                isActive
                  ? "bg-primary text-secondary font-bold"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <item.icon size={20} className={`mr-3 ${isActive ? "text-secondary" : "text-gray-500 group-hover:text-primary"}`} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <button className="flex items-center w-full px-4 py-3 text-gray-400 hover:bg-red-500/10 hover:text-red-400 rounded-md transition-colors">
          <LogOut size={20} className="mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
