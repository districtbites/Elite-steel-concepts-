"use client";

import React, { useState } from"react";
import Link from"next/link";
import { usePathname } from"next/navigation";
import { logout } from"@/app/actions/auth";
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
 X,
 ChevronRight,
 Zap,
 ExternalLink,
 Moon,
 Sun,
 Monitor,
 Users,
 MapPin,
 Link2,
 Database
} from"lucide-react";
import { useAdminTheme } from"@/app/(admin)/admin/ThemeProvider";
import type { AdminRole } from "@/lib/db";

// ─── Menu Config ────────────────────────────────────────────────────────────

interface MenuItem {
 name: string;
 href: string;
 icon: React.ElementType;
 group:"main" |"content" |"config";
 roles: AdminRole[];
}

const menuItems: MenuItem[] = [
 // Main
 { name:"Dashboard", href:"/admin", icon: LayoutDashboard, group:"main", roles: ["super_admin", "admin", "manager", "seo"] },
 { name:"Quote Requests", href:"/admin/quotes", icon: MessageSquare, group:"main", roles: ["super_admin", "admin", "manager"] },
 { name:"Contact Messages", href:"/admin/contacts", icon: Mail, group:"main", roles: ["super_admin", "admin", "manager"] },

 // Content
 { name:"Locations & Service Areas", href:"/admin/locations", icon: MapPin, group:"content", roles: ["super_admin", "admin", "manager", "seo"] },
 { name:"Portfolio", href:"/admin/portfolio", icon: Briefcase, group:"content", roles: ["super_admin", "admin", "manager"] },
 { name:"Blog Posts", href:"/admin/blog", icon: FileText, group:"content", roles: ["super_admin", "admin", "manager", "seo"] },
 { name: "Internal Linking", href: "/admin/internal-links", icon: Link2, group: "content", roles: ["super_admin", "admin", "seo"] },
 { name:"Testimonials", href:"/admin/testimonials", icon: Star, group:"content", roles: ["super_admin", "admin", "manager"] },
 { name:"FAQs", href:"/admin/faqs", icon: HelpCircle, group:"content", roles: ["super_admin", "admin", "manager"] },
 { name:"Media Library", href:"/admin/media", icon: ImageIcon, group:"content", roles: ["super_admin", "admin", "manager", "seo"] },

 // Config
 { name:"Team & Access", href:"/admin/users", icon: Users, group:"config", roles: ["super_admin"] },
 { name:"Newsletter", href:"/admin/newsletter", icon: Bell, group:"config", roles: ["super_admin", "admin", "manager"] },
 { name:"SEO Manager", href:"/admin/seo", icon: Search, group:"config", roles: ["super_admin", "admin", "seo"] },
 { name: "Turso & Cloud Sync", href: "/admin/settings?tab=database", icon: Database, group: "config", roles: ["super_admin", "admin"] },
 { name:"Settings", href:"/admin/settings", icon: Settings, group:"config", roles: ["super_admin", "admin"] },
];

const groupLabels: Record<string, string> = {
 main:"Operations",
 content:"Content",
 config:"Configuration",
};

// ─── Component ──────────────────────────────────────────────────────────────

export default function AdminSidebar({ role = "admin", name = "Admin" }: { role?: AdminRole; name?: string }) {
 const pathname = usePathname();
 const [isOpen, setIsOpen] = useState(false);
 const [isLoggingOut, setIsLoggingOut] = useState(false);
 const { theme, setTheme } = useAdminTheme();

 const handleLogout = async () => {
 setIsLoggingOut(true);
 await logout();
 };

 const groups = ["main","content","config"] as const;

 return (
 <>
 {/* ──── Mobile Trigger ──── */}
 <button
 onClick={() => setIsOpen(true)}
 className="lg:hidden fixed top-5 right-5 z-[60] p-4 bg-admin-bg text-primary border-2 border-primary active:scale-95 transition-transform"
 aria-label="Open navigation"
 >
 <Menu size={24} />
 </button>

 {/* ──── Backdrop ──── */}
 {isOpen && (
 <div
 onClick={() => setIsOpen(false)}
 className="fixed inset-0 bg-admin-bg/90 backdrop-blur-sm z-[70] lg:hidden"
 />
 )}

 {/* ──── Sidebar ──── */}
 <aside
 className={`
 w-[280px] bg-admin-surface text-admin-text h-screen fixed left-0 top-0
 flex flex-col z-[80] border-r-2 border-admin-border transition-all duration-300
 ${isOpen ?"translate-x-0" :"-translate-x-full lg:translate-x-0"}
 `}
 >
 {/* ─── Brand Header ─── */}
 <div className="px-6 py-8 border-b-2 border-admin-border flex items-center justify-between">
 <div className="flex items-center gap-4">
 <div className="w-12 h-12 bg-primary flex items-center justify-center text-admin-text border-2 border-black">
 <Zap size={24} />
 </div>
 <div>
 <h1 className="text-[14px] font-black uppercase tracking-[0.2em] text-admin-text leading-none">
 ESC Admin
 </h1>
 <p className="text-[9px] font-bold text-primary uppercase tracking-widest mt-2 flex flex-col gap-1">
 <span>{name}</span>
 <span className="opacity-70 text-[8px] bg-primary/20 text-primary px-1.5 py-0.5 inline-block w-fit border border-primary/30">{role.replace("_", " ")}</span>
 </p>
 </div>
 </div>
 <button
 onClick={() => setIsOpen(false)}
 className="lg:hidden p-2 text-admin-muted hover:text-primary transition-colors"
 aria-label="Close navigation"
 >
 <X size={24} />
 </button>
 </div>

 {/* ─── Navigation ─── */}
 <nav className="flex-1 px-4 py-6 overflow-y-auto space-y-8 custom-scrollbar">
 {groups.map((group) => {
 const items = menuItems.filter((i) => i.group === group && i.roles.includes(role));
 if (items.length === 0) return null;

 return (
 <div key={group}>
 {/* Group Label */}
 <div className="px-3 mb-4 flex items-center gap-3">
 <div className="w-1.5 h-1.5 bg-primary" />
 <span className="text-[10px] font-black uppercase tracking-[0.2em] text-admin-muted">
 {groupLabels[group]}
 </span>
 </div>

 {/* Items */}
 <div className="space-y-1">
 {items.map((item) => {
 const isActive =
 item.href ==="/admin"
 ? pathname ==="/admin"
 : pathname.startsWith(item.href);

 return (
 <Link
 key={item.href}
 href={item.href}
 onClick={() => setIsOpen(false)}
 className={`
 group/item relative flex items-center gap-4 px-4 py-3
 transition-all duration-200 text-xs font-black uppercase tracking-widest
 ${
 isActive
 ?"bg-admin-text text-admin-surface border border-admin-text"
 :"text-admin-muted hover:text-admin-text hover:bg-admin-border border border-transparent hover:border-admin-border-hover"
 }
 `}
 >
 <item.icon
 size={18}
 className={`shrink-0 transition-colors duration-200 ${
 isActive ?"text-primary" :"text-admin-muted group-hover/item:text-primary"
 }`}
 />

 <span className="truncate">{item.name}</span>

 <ChevronRight
 size={14}
 className={`ml-auto shrink-0 transition-all duration-200 ${
 isActive
 ?"opacity-100"
 :"opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0"
 }`}
 />
 </Link>
 );
 })}
 </div>
 </div>
 );
 })}
 </nav>

 {/* ─── Footer & Theme Toggle ─── */}
 <div className="p-6 border-t-2 border-admin-border space-y-4">
 {/* Theme Selector */}
 <div className="grid grid-cols-3 gap-1 bg-admin-border p-1">
 <button onClick={() => setTheme("light")} className={`flex items-center justify-center py-2 transition-colors ${theme ==="light" ?"bg-admin-text text-admin-surface" :"text-admin-muted hover:text-admin-text"}`} title="Light Theme">
 <Sun size={14} />
 </button>
 <button onClick={() => setTheme("dark")} className={`flex items-center justify-center py-2 transition-colors ${theme ==="dark" ?"bg-admin-text text-admin-surface" :"text-admin-muted hover:text-admin-text"}`} title="Dark Theme">
 <Moon size={14} />
 </button>
 <button onClick={() => setTheme("midnight")} className={`flex items-center justify-center py-2 transition-colors ${theme ==="midnight" ?"bg-admin-text text-admin-surface" :"text-admin-muted hover:text-admin-text"}`} title="Midnight Theme">
 <Monitor size={14} />
 </button>
 </div>

 <Link
 href="/"
 target="_blank"
 className="flex items-center justify-center gap-3 w-full px-4 py-3 border border-admin-border-hover text-admin-muted hover:text-admin-text hover:bg-admin-border hover:border-admin-text transition-all text-[10px] font-black uppercase tracking-[0.2em]"
 >
 <ExternalLink size={14} />
 <span>View Live Site</span>
 </Link>

 <button
 onClick={handleLogout}
 disabled={isLoggingOut}
 className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-admin-border text-red-500 border border-red-500/30 hover:bg-red-500 hover:text-admin-text hover:border-red-500 transition-all text-[10px] font-black uppercase tracking-[0.2em] disabled:opacity-50"
 >
 <LogOut size={14} className={isLoggingOut ?"animate-spin" :""} />
 <span>{isLoggingOut ?"Signing Out..." :"Sign Out"}</span>
 </button>
 </div>
 </aside>
 </>
 );
};


