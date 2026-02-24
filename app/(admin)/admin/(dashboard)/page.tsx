import React from "react";
import StatCard from "@/components/admin/StatCard";
import {
  Users,
  FileText,
  MousePointer,
  Activity,
  Briefcase,
  Star,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  MessageSquare,
  Globe,
  Image as ImageIcon,
  Zap,
  BarChart3,
  Shield,
  Inbox,
  Layers,
  PenTool,
  Eye,
  Mail,
  Phone,
  Calendar,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import {
  getQuotes,
  getPosts,
  getProjects,
  getTestimonials,
  getContacts,
  getSEO,
  getAssets,
  getNewsletters,
  getFAQs,
  getSettings,
} from "@/lib/db";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminDashboard() {
  const [quotes, posts, projects, testimonials, contacts, seo, assets, newsletters, faqs, settings] =
    await Promise.all([
      getQuotes(),
      getPosts(),
      getProjects(),
      getTestimonials(),
      getContacts(),
      getSEO(),
      getAssets(),
      getNewsletters(),
      getFAQs(),
      getSettings(),
    ]);

  const newQuotes = quotes.filter((q) => q.status === "New").length;
  const newContacts = contacts.filter((c) => c.status === "New").length;
  const publishedPosts = posts.filter((p) => p.status === "Published").length;
  const draftPosts = posts.length - publishedPosts;
  const featuredProjects = projects.filter((p) => p.featured).length;

  // Metrics
  const totalLeads = quotes.length + contacts.length;
  const urgentItems = newQuotes + newContacts;
  const contentItems = posts.length + projects.length + faqs.length;
  const mediaPages = new Set(assets.map((a) => a.page)).size;

  // Combined activity feed — sorted by date descending
  const allActivity = [
    ...quotes.map((q) => ({
      type: "quote" as const,
      label: "Quote Request",
      name: q.name,
      date: q.date,
      id: q.id,
      status: q.status,
      icon: "💰",
      color: "text-primary",
    })),
    ...contacts.map((c) => ({
      type: "contact" as const,
      label: "Contact Message",
      name: c.name,
      date: c.date,
      id: c.id,
      status: c.status,
      icon: "💬",
      color: "text-blue-500",
    })),
    ...posts.map((p) => ({
      type: "blog" as const,
      label: p.status === "Published" ? "Article Published" : "Draft Saved",
      name: p.title,
      date: p.date,
      id: p.id,
      status: p.status,
      icon: "📝",
      color: "text-cyan-500",
    })),
    ...projects.map((pj) => ({
      type: "project" as const,
      label: "Project Added",
      name: pj.title,
      date: pj.completionDate || "Recent",
      id: pj.id,
      status: "Active",
      icon: "🏗️",
      color: "text-purple-500",
    })),
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  // Quick nav items for Admin
  const quickNav = [
    { label: "New Blog Post", href: "/admin/blog/new", icon: PenTool, color: "bg-secondary text-white hover:bg-primary hover:text-secondary" },
    { label: "Add Project", href: "/admin/portfolio/new", icon: Briefcase, color: "bg-white border border-gray-100 text-secondary hover:border-primary" },
    { label: "SEO Manager", href: "/admin/seo", icon: Globe, color: "bg-white border border-gray-100 text-secondary hover:border-primary" },
    { label: "Media Library", href: "/admin/media", icon: ImageIcon, color: "bg-white border border-gray-100 text-secondary hover:border-primary" },
    { label: "Settings", href: "/admin/settings", icon: Zap, color: "bg-white border border-gray-100 text-secondary hover:border-primary" },
  ];

  // Progress metrics
  const seoScore = Math.min(
    100,
    Math.round(
      ((seo.siteTitle ? 15 : 0) +
        (seo.description ? 15 : 0) +
        (seo.keywords ? 10 : 0) +
        (seo.ogImage ? 10 : 0) +
        (seo.robotsTxt ? 10 : 0) +
        (seo.canonicalUrl ? 10 : 0) +
        (Object.keys(seo.pages || {}).length > 3 ? 15 : Object.keys(seo.pages || {}).length * 5) +
        (posts.length > 0 ? 15 : 0))
    )
  );

  const portfolioScore = projects.length > 0 ? Math.min(100, projects.length * 10 + (featuredProjects > 0 ? 20 : 0)) : 0;
  const contentScore = Math.min(100, publishedPosts * 12 + projects.length * 8 + testimonials.length * 5);

  return (
    <div className="space-y-8 pb-20">
      {/* ═══════════════════════════════════════════════════════
          HERO HEADER
         ═══════════════════════════════════════════════════════ */}
      <div className="bg-secondary rounded-[2rem] p-8 md:p-10 text-white shadow-2xl relative overflow-hidden">
        {/* Decorative blurs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-primary/8 blur-[100px] rounded-full" />
        <div className="absolute top-1/2 right-1/4 w-40 h-40 bg-blue-500/5 blur-[80px] rounded-full" />

        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-3 bg-white/5 w-fit px-4 py-1.5 rounded-full border border-white/10">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-green-400">
                system online
              </span>
              <div className="h-3 w-[1px] bg-white/10" />
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500">
                {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter">
              Command <span className="text-primary italic">Center</span>
            </h1>
            <p className="text-gray-400 max-w-lg text-sm font-light leading-relaxed">
              Your operational headquarters for <strong className="text-white/70">Elite Steel Concepts</strong>.
              Monitor leads, manage content, and track performance — all in one place.
            </p>
          </div>

          {/* Urgent Alert Badge */}
          {urgentItems > 0 && (
            <div className="flex items-center gap-4 bg-gradient-to-r from-primary/20 to-primary/5 border border-primary/20 px-6 py-4 rounded-2xl backdrop-blur-md">
              <div className="relative">
                <Inbox size={24} className="text-primary" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-[7px] font-black text-white">{urgentItems}</span>
                </div>
              </div>
              <div>
                <p className="text-xs font-black text-white uppercase tracking-wider">
                  {urgentItems} New {urgentItems === 1 ? "Lead" : "Leads"}
                </p>
                <p className="text-[9px] text-gray-400 font-medium mt-0.5">
                  {newQuotes > 0 && `${newQuotes} quote${newQuotes > 1 ? "s" : ""}`}
                  {newQuotes > 0 && newContacts > 0 && " · "}
                  {newContacts > 0 && `${newContacts} message${newContacts > 1 ? "s" : ""}`}
                </p>
              </div>
              <Link
                href="/admin/quotes"
                className="ml-2 bg-primary text-secondary px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest hover:bg-white transition-all"
              >
                Review
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          QUICK ACTIONS
         ═══════════════════════════════════════════════════════ */}
      <div className="flex flex-wrap gap-3">
        {quickNav.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`px-5 py-3 rounded-xl font-black uppercase text-[9px] tracking-widest transition-all shadow-sm flex items-center gap-2.5 active:scale-95 ${item.color}`}
          >
            <item.icon size={13} /> {item.label}
          </Link>
        ))}
      </div>

      {/* ═══════════════════════════════════════════════════════
          MAIN STATS GRID
         ═══════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard label="Quote Requests" value={quotes.length.toString()} icon={TrendingUp} color="primary" trend={`${newQuotes} unread`} href="/admin/quotes" />
        <StatCard label="Messages" value={contacts.length.toString()} icon={MessageSquare} color="blue" trend={`${newContacts} new`} href="/admin/contacts" />
        <StatCard label="Blog Articles" value={posts.length.toString()} icon={FileText} color="green" trend={`${publishedPosts} published`} href="/admin/blog" />
        <StatCard label="Portfolio" value={projects.length.toString()} icon={Briefcase} color="purple" trend={`${featuredProjects} featured`} href="/admin/portfolio" />
        <StatCard label="Testimonials" value={testimonials.length.toString()} icon={Star} color="amber" trend="Client reviews" href="/admin/testimonials" />
        <StatCard label="Media Assets" value={assets.length.toString()} icon={ImageIcon} color="red" trend={`${mediaPages} pages`} href="/admin/media" />
      </div>

      {/* ═══════════════════════════════════════════════════════
          MAIN CONTENT GRID (3-Column)
         ═══════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* ─── LEFT: Recent Leads Table ─── */}
        <div className="lg:col-span-7 space-y-6">
          {/* Leads Table */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center">
                  <MousePointer size={14} className="text-primary" />
                </div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary">
                  Recent Inbound Leads
                </h3>
              </div>
              <Link
                href="/admin/quotes"
                className="text-[8px] font-black uppercase text-primary hover:text-secondary transition-colors tracking-widest flex items-center gap-1"
              >
                View All <ChevronRight size={10} />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50/80">
                    <th className="px-6 py-3 text-[8px] font-black uppercase tracking-[0.2em] text-gray-400 text-left">Source</th>
                    <th className="px-6 py-3 text-[8px] font-black uppercase tracking-[0.2em] text-gray-400 text-left">Client</th>
                    <th className="px-6 py-3 text-[8px] font-black uppercase tracking-[0.2em] text-gray-400 text-left hidden md:table-cell">Date</th>
                    <th className="px-6 py-3 text-[8px] font-black uppercase tracking-[0.2em] text-gray-400 text-left">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {quotes.slice(0, 5).map((q) => (
                    <tr key={q.id} className="group hover:bg-primary/3 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">💰</span>
                          <span className="text-[9px] font-bold text-secondary uppercase tracking-wider">Quote</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs font-bold text-secondary">{q.name}</div>
                        <div className="text-[9px] text-gray-400 font-medium truncate max-w-[160px]">{q.email}</div>
                      </td>
                      <td className="px-6 py-4 text-[10px] font-bold text-gray-400 hidden md:table-cell">{q.date}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-[7px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${
                            q.status === "New"
                              ? "bg-primary/10 text-primary ring-1 ring-primary/20"
                              : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          {q.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {contacts.slice(0, 3).map((c) => (
                    <tr key={c.id} className="group hover:bg-blue-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">💬</span>
                          <span className="text-[9px] font-bold text-secondary uppercase tracking-wider">Message</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs font-bold text-secondary">{c.name}</div>
                        <div className="text-[9px] text-gray-400 font-medium truncate max-w-[160px]">{c.email}</div>
                      </td>
                      <td className="px-6 py-4 text-[10px] font-bold text-gray-400 hidden md:table-cell">{c.date}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-[7px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${
                            c.status === "New"
                              ? "bg-blue-500/10 text-blue-500 ring-1 ring-blue-500/20"
                              : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          {c.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {quotes.length === 0 && contacts.length === 0 && (
              <div className="p-12 text-center">
                <Inbox size={32} className="mx-auto text-gray-200 mb-3" />
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">No leads yet — they&apos;re coming!</p>
              </div>
            )}
          </div>

          {/* Content Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Latest Blog Post */}
            <Link href="/admin/blog" className="group">
              <div className="bg-secondary p-7 rounded-2xl shadow-xl relative overflow-hidden h-full">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[60px] -mr-10 -mt-10" />
                <div className="absolute bottom-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform duration-700">
                  <FileText size={80} />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-4">
                    <FileText size={12} className="text-primary" />
                    <span className="text-[8px] font-black uppercase tracking-[0.3em] text-primary">Latest Article</span>
                  </div>
                  <h4 className="text-white text-lg font-black uppercase leading-tight tracking-tighter line-clamp-2 mb-3">
                    {posts[0]?.title || "No posts yet"}
                  </h4>
                  <div className="flex items-center gap-2">
                    {posts[0] && (
                      <span
                        className={`text-[7px] font-black uppercase px-2 py-0.5 rounded-full ${
                          posts[0].status === "Published"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-amber-500/20 text-amber-400"
                        }`}
                      >
                        {posts[0].status}
                      </span>
                    )}
                    <span className="text-[8px] text-gray-500 font-medium">{posts[0]?.date}</span>
                  </div>
                  <div className="mt-5 flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-white/60 group-hover:text-primary transition-colors">
                    Manage Blog <ArrowUpRight size={10} />
                  </div>
                </div>
              </div>
            </Link>

            {/* Latest Project */}
            <Link href="/admin/portfolio" className="group">
              <div className="bg-gradient-to-br from-primary via-primary to-amber-400 p-7 rounded-2xl shadow-xl relative overflow-hidden h-full">
                <div className="absolute bottom-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform duration-700">
                  <Briefcase size={80} />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-4">
                    <Briefcase size={12} className="text-secondary" />
                    <span className="text-[8px] font-black uppercase tracking-[0.3em] text-secondary/60">Latest Build</span>
                  </div>
                  <h4 className="text-secondary text-lg font-black uppercase leading-tight tracking-tighter line-clamp-2 mb-3">
                    {projects[0]?.title || "No projects yet"}
                  </h4>
                  <div className="flex items-center gap-2 flex-wrap">
                    {projects[0]?.category && (
                      <span className="text-[7px] font-black uppercase px-2 py-0.5 rounded-full bg-secondary/10 text-secondary">
                        {projects[0].category}
                      </span>
                    )}
                    {projects[0]?.featured && (
                      <span className="text-[7px] font-black uppercase px-2 py-0.5 rounded-full bg-secondary/10 text-secondary flex items-center gap-1">
                        <Sparkles size={8} /> Featured
                      </span>
                    )}
                  </div>
                  <div className="mt-5 flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-secondary/60 group-hover:text-secondary transition-colors">
                    Manage Portfolio <ArrowUpRight size={10} />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* ─── RIGHT COLUMN ─── */}
        <div className="lg:col-span-5 space-y-6">

          {/* Platform Health */}
          <div className="bg-white p-7 rounded-2xl border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-500/10 rounded-xl flex items-center justify-center">
                  <BarChart3 size={14} className="text-green-500" />
                </div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary">Platform Health</h3>
              </div>
              <div className="flex items-center gap-1.5 bg-green-50 px-2.5 py-1 rounded-full">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                <span className="text-[7px] font-black uppercase tracking-widest text-green-600">Healthy</span>
              </div>
            </div>

            <div className="space-y-5">
              {/* SEO Score */}
              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <div className="flex items-center gap-2">
                    <Globe size={12} className="text-green-500" />
                    <span className="text-[9px] font-black uppercase text-gray-500 tracking-widest">SEO Score</span>
                  </div>
                  <span className="text-sm font-black text-secondary">{seoScore}%</span>
                </div>
                <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${
                      seoScore >= 80 ? "bg-green-500" : seoScore >= 50 ? "bg-amber-500" : "bg-red-500"
                    }`}
                    style={{ width: `${seoScore}%` }}
                  />
                </div>
              </div>

              {/* Content Score */}
              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <div className="flex items-center gap-2">
                    <Layers size={12} className="text-blue-500" />
                    <span className="text-[9px] font-black uppercase text-gray-500 tracking-widest">Content Volume</span>
                  </div>
                  <span className="text-sm font-black text-secondary">{Math.min(contentScore, 100)}%</span>
                </div>
                <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all duration-1000"
                    style={{ width: `${Math.min(contentScore, 100)}%` }}
                  />
                </div>
              </div>

              {/* Portfolio Score */}
              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <div className="flex items-center gap-2">
                    <Briefcase size={12} className="text-purple-500" />
                    <span className="text-[9px] font-black uppercase text-gray-500 tracking-widest">Portfolio Depth</span>
                  </div>
                  <span className="text-sm font-black text-secondary">{Math.min(portfolioScore, 100)}%</span>
                </div>
                <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-500 rounded-full transition-all duration-1000"
                    style={{ width: `${Math.min(portfolioScore, 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-4 gap-2 pt-4 border-t border-gray-50">
              {[
                { label: "Reviews", value: testimonials.length, color: "text-amber-500" },
                { label: "FAQs", value: faqs.length, color: "text-cyan-500" },
                { label: "Media", value: assets.length, color: "text-red-500" },
                { label: "Subs", value: newsletters.length, color: "text-green-500" },
              ].map((m) => (
                <div key={m.label} className="text-center p-2 bg-gray-50/50 rounded-xl">
                  <div className={`text-lg font-black ${m.color}`}>{m.value}</div>
                  <div className="text-[7px] font-bold text-gray-400 uppercase tracking-widest">{m.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Feed */}
          <div className="bg-white p-7 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Activity size={14} className="text-primary" />
                </div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary">Activity Feed</h3>
              </div>
              <span className="text-[7px] font-black uppercase tracking-widest text-gray-400">Last 10</span>
            </div>

            <div className="space-y-1">
              {allActivity.map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-gray-50/50 transition-colors group"
                >
                  <div className="mt-0.5 text-base shrink-0">{item.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-0.5 flex items-center gap-2">
                      <span>{item.label}</span>
                      <span className="text-gray-300">·</span>
                      <span className="font-medium text-gray-300">{item.date}</span>
                    </div>
                    <p className="text-xs font-bold text-secondary truncate group-hover:text-primary transition-colors">
                      {item.name}
                    </p>
                  </div>
                  {(item.status === "New") && (
                    <span className="mt-1 text-[6px] font-black uppercase px-1.5 py-0.5 rounded bg-primary/10 text-primary tracking-wider shrink-0">
                      New
                    </span>
                  )}
                </div>
              ))}
            </div>

            {allActivity.length === 0 && (
              <div className="py-8 text-center">
                <Activity size={24} className="mx-auto text-gray-200 mb-2" />
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">No activity yet</p>
              </div>
            )}
          </div>

          {/* Business Info Card */}
          <div className="bg-secondary/5 p-6 rounded-2xl border border-secondary/10 space-y-4">
            <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-secondary flex items-center gap-2">
              <Shield size={12} className="text-primary" /> Business Details
            </h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone size={12} className="text-gray-400 shrink-0" />
                <span className="text-xs font-bold text-secondary">{settings.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={12} className="text-gray-400 shrink-0" />
                <span className="text-xs font-bold text-secondary truncate">{settings.email}</span>
              </div>
              {settings.address && (
                <div className="flex items-start gap-3">
                  <Globe size={12} className="text-gray-400 shrink-0 mt-0.5" />
                  <span className="text-xs font-bold text-secondary">{settings.address}</span>
                </div>
              )}
            </div>
            <Link
              href="/admin/settings"
              className="block text-center text-[8px] font-black uppercase tracking-widest text-primary hover:text-secondary transition-colors mt-3 pt-3 border-t border-secondary/10"
            >
              Edit Settings →
            </Link>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          ADMIN NAVIGATION GRID (Bottom)
         ═══════════════════════════════════════════════════════ */}
      <div>
        <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4 flex items-center gap-2">
          <Layers size={12} /> All Management Modules
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
          {[
            { label: "Quotes", href: "/admin/quotes", icon: TrendingUp, count: quotes.length, accent: "primary" },
            { label: "Messages", href: "/admin/contacts", icon: MessageSquare, count: contacts.length, accent: "blue" },
            { label: "Blog", href: "/admin/blog", icon: FileText, count: posts.length, accent: "green" },
            { label: "Portfolio", href: "/admin/portfolio", icon: Briefcase, count: projects.length, accent: "purple" },
            { label: "Testimonials", href: "/admin/testimonials", icon: Star, count: testimonials.length, accent: "amber" },
            { label: "Media", href: "/admin/media", icon: ImageIcon, count: assets.length, accent: "red" },
            { label: "SEO", href: "/admin/seo", icon: Globe, count: Object.keys(seo.pages || {}).length, accent: "green" },
            { label: "Settings", href: "/admin/settings", icon: Zap, count: null, accent: "primary" },
            { label: "FAQs", href: "/admin/faqs", icon: AlertCircle, count: faqs.length, accent: "blue" },
            { label: "Newsletter", href: "/admin/newsletters", icon: Mail, count: newsletters.length, accent: "purple" },
          ].map((mod) => (
            <Link
              key={mod.label}
              href={mod.href}
              className="group bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-primary/20 transition-all flex flex-col items-center text-center"
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-all group-hover:scale-110 ${
                  mod.accent === "primary" ? "bg-primary/10 text-primary" :
                  mod.accent === "blue" ? "bg-blue-500/10 text-blue-500" :
                  mod.accent === "green" ? "bg-green-500/10 text-green-500" :
                  mod.accent === "purple" ? "bg-purple-500/10 text-purple-500" :
                  mod.accent === "amber" ? "bg-amber-500/10 text-amber-500" :
                  "bg-red-500/10 text-red-500"
                }`}
              >
                <mod.icon size={18} />
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest text-secondary">{mod.label}</span>
              {mod.count !== null && (
                <span className="text-[8px] font-bold text-gray-400 mt-1">{mod.count} items</span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
