import React from "react";
import {
  FileText,
  MousePointer,
  Activity,
  Briefcase,
  TrendingUp,
  CheckCircle2,
  ArrowUpRight,
  MessageSquare,
  Image as ImageIcon,
  Zap,
  Inbox,
  PenTool,
  ChevronRight
} from "lucide-react";
import {
  getQuotes,
  getPosts,
  getProjects,
  getContacts,
} from "@/lib/db";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminDashboard() {
  const [quotes, posts, projects, contacts] = await Promise.all([
    getQuotes(),
    getPosts(),
    getProjects(),
    getContacts(),
  ]);

  const newQuotes = quotes.filter((q) => q.status === "New").length;
  const newContacts = contacts.filter((c) => c.status === "New").length;
  const urgentItems = newQuotes + newContacts;

  // Combined activity feed — sorted by date descending
  const allActivity = [
    ...quotes.map((q) => ({
      type: "quote" as const,
      label: "Quote Request",
      name: q.name,
      date: q.date,
      id: q.id,
      status: q.status,
    })),
    ...contacts.map((c) => ({
      type: "contact" as const,
      label: "Contact Message",
      name: c.name,
      date: c.date,
      id: c.id,
      status: c.status,
    })),
    ...posts.map((p) => ({
      type: "blog" as const,
      label: p.status === "Published" ? "Article Published" : "Draft Saved",
      name: p.title,
      date: p.date,
      id: p.id,
      status: p.status,
    })),
    ...projects.map((pj) => ({
      type: "project" as const,
      label: "Project Added",
      name: pj.title,
      date: pj.completionDate || "Recent",
      id: pj.id,
      status: "Active",
    })),
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  const quickNav = [
    { label: "New Blog Post", href: "/admin/blog/new", icon: PenTool },
    { label: "Add Project", href: "/admin/portfolio/new", icon: Briefcase },
    { label: "Media Library", href: "/admin/media", icon: ImageIcon },
    { label: "Settings", href: "/admin/settings", icon: Zap },
  ];

  return (
    <div className="space-y-12 pb-20 max-w-6xl">
      {/* HEADER SECTION */}
      <div className="border-b-4 border-admin-text pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-3 h-3 bg-primary animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">System Online // {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-admin-text leading-none">
            Command<br />Center.
          </h1>
        </div>
        
        {urgentItems > 0 ? (
          <Link href="/admin/quotes" className="bg-primary text-admin-text p-6 border-2 border-primary hover:bg-admin-bg transition-colors w-full md:w-auto text-center md:text-left">
             <Inbox size={24} className="mb-2 mx-auto md:mx-0" />
             <div className="text-3xl font-black">{urgentItems}</div>
             <div className="text-[10px] font-black uppercase tracking-widest mt-1">Urgent Leads</div>
          </Link>
        ) : (
          <div className="bg-admin-surface text-admin-muted p-6 border border-admin-border w-full md:w-auto text-center md:text-left">
             <CheckCircle2 size={24} className="mb-2 mx-auto md:mx-0" />
             <div className="text-xl font-black uppercase tracking-tighter">Zero Pending</div>
             <div className="text-[10px] font-black uppercase tracking-widest mt-1">Inbox Clear</div>
          </div>
        )}
      </div>

      {/* QUICK ACTIONS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickNav.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="p-6 bg-admin-surface border border-admin-border hover:bg-admin-text hover:text-admin-surface text-admin-text transition-colors flex flex-col items-center justify-center text-center group"
          >
            <item.icon size={24} className="mb-4 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">{item.label}</span>
          </Link>
        ))}
      </div>

      {/* CORE METRICS GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-admin-border border border-admin-border">
        {[
          { label: "Quote Requests", val: quotes.length, href: "/admin/quotes" },
          { label: "Contact Messages", val: contacts.length, href: "/admin/contacts" },
          { label: "Published Articles", val: posts.filter((p) => p.status === "Published").length, href: "/admin/blog" },
          { label: "Portfolio Items", val: projects.length, href: "/admin/portfolio" }
        ].map((stat, i) => (
          <Link key={i} href={stat.href} className="bg-admin-bg p-8 hover:bg-admin-surface transition-colors flex flex-col justify-between h-40">
             <span className="text-5xl font-black text-admin-text tracking-tighter">{stat.val}</span>
             <div className="text-[10px] font-black text-admin-muted uppercase tracking-[0.2em] flex items-center justify-between mt-auto">
                {stat.label} <ArrowUpRight size={12} />
             </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-8 border-t border-admin-border">
        {/* RECENT INBOUND */}
        <div className="space-y-6">
          <h3 className="text-xl font-black uppercase tracking-tighter text-admin-text flex items-center gap-3">
            <MousePointer size={18} className="text-primary" /> Active Inbound
          </h3>
          <div className="divide-y divide-admin-border border border-admin-border bg-admin-surface">
            {quotes.slice(0, 4).map(q => (
              <div key={q.id} className="p-4 flex items-center justify-between hover:bg-admin-bg transition-colors">
                <div>
                  <div className="text-sm font-black text-admin-text uppercase">{q.name}</div>
                  <div className="text-[10px] text-admin-muted font-bold tracking-widest">{q.date}</div>
                </div>
                <span className={`text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1 ${q.status === 'New' ? 'bg-primary text-admin-text' : 'bg-admin-border text-admin-muted'}`}>
                  {q.status}
                </span>
              </div>
            ))}
            {quotes.length === 0 && (
              <div className="p-8 text-center text-admin-muted text-[10px] font-black uppercase tracking-[0.2em]">No Recent Quotes</div>
            )}
          </div>
          <Link href="/admin/quotes" className="inline-block text-[10px] font-black uppercase text-admin-text tracking-[0.2em] hover:text-primary transition-colors">View All Quotes &rarr;</Link>
        </div>

        {/* RECENT ACTIVITY */}
        <div className="space-y-6">
          <h3 className="text-xl font-black uppercase tracking-tighter text-admin-text flex items-center gap-3">
            <Activity size={18} className="text-primary" /> System Logs
          </h3>
          <div className="divide-y divide-admin-border border border-admin-border bg-admin-surface">
             {allActivity.slice(0, 4).map((item, i) => (
                <div key={i} className="p-4 flex items-center gap-4 hover:bg-admin-bg transition-colors">
                   <div className="w-8 h-8 bg-admin-border flex items-center justify-center shrink-0 text-admin-text">
                      <ChevronRight size={14} />
                   </div>
                   <div>
                      <div className="text-[9px] font-black text-admin-muted uppercase tracking-[0.2em] mb-1">{item.label}</div>
                      <div className="text-xs font-black text-admin-text uppercase truncate max-w-[200px]">{item.name}</div>
                   </div>
                   <div className="ml-auto text-[9px] text-admin-muted font-bold tracking-widest">{item.date}</div>
                </div>
             ))}
             {allActivity.length === 0 && (
              <div className="p-8 text-center text-admin-muted text-[10px] font-black uppercase tracking-[0.2em]">No System Logs</div>
             )}
          </div>
        </div>
      </div>

    </div>
  );
}
