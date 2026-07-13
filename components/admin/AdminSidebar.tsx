"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  FileText, 
  Settings, 
  Search, 
  LogOut, 
  MessageSquare, 
  Mail, 
  Star, 
  Briefcase, 
  HelpCircle, 
  Bell, 
  Image as ImageIcon,
  Menu,
  X
} from "lucide-react";

const menuItems = [
  // ... (menuItems same as before)
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Media Manager", href: "/admin/media", icon: ImageIcon },
  { name: "Quote Requests", href: "/admin/quotes", icon: MessageSquare },
  { name: "Contact Msgs", href: "/admin/contacts", icon: Mail },
  { name: "Portfolio", href: "/admin/portfolio", icon: Briefcase },
  { name: "Blog Posts", href: "/admin/blog", icon: FileText },
  { name: "Testimonials", href: "/admin/testimonials", icon: Star },
  { name: "FAQs", href: "/admin/faqs", icon: HelpCircle },
  { name: "Newsletter", href: "/admin/newsletter", icon: Bell },
  { name: "SEO Manager", href: "/admin/seo", icon: Search },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

const AdminSidebar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Trigger */}
      <button 
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-6 right-6 z-[60] p-4 bg-secondary text-primary rounded-2xl shadow-2xl border border-white/10 active:scale-95 transition-all"
      >
        <Menu size={24} />
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-secondary/60 backdrop-blur-md z-[70] lg:hidden animate-in fade-in duration-300"
        ></div>
      )}

      <div className={`
        w-64 bg-secondary text-white h-screen fixed left-0 top-0 flex flex-col border-r border-white/10 z-[80]
        transition-transform duration-500 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black uppercase tracking-tight text-primary">
              ESC Admin
            </h1>
            <p className="text-xs text-gray-400">Control Panel</p>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-2 text-gray-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center px-4 py-3 rounded-xl transition-all duration-300 group ${
                  isActive
                    ? "bg-primary text-secondary font-black shadow-lg shadow-primary/20"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <item.icon size={18} className={`mr-3 transition-colors ${isActive ? "text-secondary" : "text-gray-500 group-hover:text-primary"}`} />
                <span className="text-[11px] font-black uppercase tracking-widest">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-white/10">
          <button className="flex items-center w-full px-4 py-3 text-gray-400 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-all font-black uppercase tracking-widest text-[10px]">
            <LogOut size={18} className="mr-3" />
            Logout System
          </button>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;
