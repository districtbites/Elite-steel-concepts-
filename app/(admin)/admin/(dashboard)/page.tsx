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
    Globe
} from "lucide-react";
import { getQuotes, getPosts, getProjects, getTestimonials, getContacts, getSEO } from "@/lib/db";
import Link from "next/link";

export default async function AdminDashboard() {
  const [quotes, posts, projects, testimonials, contacts, seo] = await Promise.all([
    getQuotes(),
    getPosts(),
    getProjects(),
    getTestimonials(),
    getContacts(),
    getSEO()
  ]);

  const newQuotes = quotes.filter(q => q.status === "New").length;
  const newContacts = contacts.filter(c => c.status === "New").length;
  const publishedPosts = posts.filter(p => p.status === "Published").length;

  // Calculate some "Advanced" Metrics
  const totalLeads = quotes.length + contacts.length;
  const conversionRate = totalLeads > 0 ? ((quotes.length / totalLeads) * 100).toFixed(1) : "0";
  
  // Combine items for a "Recent Activity" feed
  const allActivity = [
      ...quotes.map(q => ({ type: 'quote', name: q.name, date: q.date, id: q.id, status: q.status })),
      ...contacts.map(c => ({ type: 'contact', name: c.name, date: c.date, id: c.id, status: c.status })),
      ...posts.map(p => ({ type: 'blog', name: p.title, date: p.date, id: p.id, status: p.status })),
      ...projects.map(pj => ({ type: 'project', name: pj.title, date: pj.completionDate || 'Recent', id: pj.id }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 8);

  return (
    <div className="space-y-10 pb-20">
      {/* Premium Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h1 className="text-5xl font-black uppercase text-secondary tracking-tighter">Command Center</h1>
            <p className="text-gray-400 font-medium mt-1">Operational intelligence for Elite Steel Concepts.</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-secondary">System Online</span>
            <div className="h-4 w-[1px] bg-gray-100 mx-2" />
            <span className="text-[10px] font-bold text-gray-400 uppercase">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</span>
        </div>
      </div>

      {/* Quick Actions Row */}
      <div className="flex flex-wrap gap-4">
          <Link href="/admin/blog/new" className="px-6 py-3 bg-secondary text-white rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-primary hover:text-secondary transition-all shadow-lg flex items-center gap-2">
              <FileText size={14} /> New Insight
          </Link>
          <Link href="/admin/portfolio/new" className="px-6 py-3 bg-white border border-gray-100 text-secondary rounded-xl font-black uppercase text-[10px] tracking-widest hover:border-primary transition-all shadow-sm flex items-center gap-2">
              <Briefcase size={14} /> Add Project
          </Link>
          <Link href="/admin/seo" className="px-6 py-3 bg-white border border-gray-100 text-secondary rounded-xl font-black uppercase text-[10px] tracking-widest hover:border-primary transition-all shadow-sm flex items-center gap-2">
              <Globe size={14} /> SEO Master
          </Link>
      </div>

      {/* Main Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Quote Requests" value={quotes.length.toString()} icon={TrendingUp} color="primary" trend={`${newQuotes} unread`} />
        <StatCard label="Live Articles" value={publishedPosts.toString()} icon={FileText} color="blue" trend={`${posts.length - publishedPosts} drafts`} />
        <StatCard label="Portfolio Builds" value={projects.length.toString()} icon={Briefcase} color="purple" trend="Showcased projects" />
        <StatCard label="Lead Volume" value={totalLeads.toString()} icon={Activity} color="green" trend={`${conversionRate}% Conv. Rate`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Leads & Activity */}
        <div className="lg:col-span-8 space-y-8">
            {/* Recent Leads Table */}
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] text-secondary flex items-center">
                        <MousePointer size={16} className="mr-3 text-primary" /> Recent Inbound Leads
                    </h3>
                    <Link href="/admin/quotes" className="text-[10px] font-black uppercase text-primary hover:text-secondary transition-colors tracking-widest">
                        View All
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50/50">
                            <tr>
                                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-left">Source</th>
                                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-left">Client</th>
                                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-left">Date</th>
                                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-left">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {quotes.slice(0, 5).map((q) => (
                                <tr key={q.id} className="group hover:bg-gray-50/50 transition-colors">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-primary" />
                                            <span className="text-xs font-bold text-secondary uppercase tracking-tighter">Quote Request</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="text-sm font-bold text-secondary">{q.name}</div>
                                        <div className="text-[10px] text-gray-400 font-medium">{q.email}</div>
                                    </td>
                                    <td className="px-8 py-5 text-xs font-bold text-gray-400">{q.date}</td>
                                    <td className="px-8 py-5">
                                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                                            q.status === 'New' ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-400'
                                        }`}>
                                            {q.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {contacts.slice(0, 3).map((c) => (
                                <tr key={c.id} className="group hover:bg-gray-50/50 transition-colors">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-blue-500" />
                                            <span className="text-xs font-bold text-secondary uppercase tracking-tighter">Direct Msg</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="text-sm font-bold text-secondary">{c.name}</div>
                                        <div className="text-[10px] text-gray-400 font-medium">{c.email}</div>
                                    </td>
                                    <td className="px-8 py-5 text-xs font-bold text-gray-400">{c.date}</td>
                                    <td className="px-8 py-5">
                                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                                            c.status === 'New' ? 'bg-blue-100 text-blue-500' : 'bg-gray-100 text-gray-400'
                                        }`}>
                                            {c.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Content Synergy */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-white">
                <div className="bg-secondary p-8 rounded-[2rem] shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                        <FileText size={80} />
                    </div>
                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-4">Latest Insight</h4>
                    <h5 className="text-xl font-bold uppercase leading-tight mb-4 tracking-tighter line-clamp-2">
                        {posts[0]?.title || "No posts yet"}
                    </h5>
                    <Link href="/admin/blog" className="inline-flex items-center text-[10px] font-black uppercase tracking-widest hover:text-primary transition-colors">
                        Manage Articles <ArrowUpRight size={14} className="ml-1" />
                    </Link>
                </div>
                <div className="bg-primary p-8 rounded-[2rem] shadow-xl relative overflow-hidden group text-secondary">
                    <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:scale-110 transition-transform duration-700">
                        <Briefcase size={80} />
                    </div>
                    <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-4 opacity-50">Latest Masterpiece</h4>
                    <h5 className="text-xl font-bold uppercase leading-tight mb-4 tracking-tighter line-clamp-2">
                        {projects[0]?.title || "No projects yet"}
                    </h5>
                    <Link href="/admin/portfolio" className="inline-flex items-center text-[10px] font-black uppercase tracking-widest hover:opacity-70 transition-colors">
                        Manage Portfolio <ArrowUpRight size={14} className="ml-1" />
                    </Link>
                </div>
            </div>
        </div>

        {/* Right Column: Master Metrics & Feed */}
        <div className="lg:col-span-4 space-y-8">
            
            {/* System Intelligence */}
            <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-8">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-secondary flex items-center">
                    <Globe size={16} className="mr-3 text-primary" /> Content Pulse
                </h3>
                
                <div className="space-y-6">
                    <div className="space-y-2">
                        <div className="flex justify-between items-end">
                            <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">SEO Health</span>
                            <span className="text-sm font-black text-secondary uppercase">94%</span>
                        </div>
                        <div className="h-1.5 w-full bg-gray-50 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 rounded-full w-[94%]" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between items-end">
                            <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Lead Velocity</span>
                            <span className="text-sm font-black text-secondary uppercase">88%</span>
                        </div>
                        <div className="h-1.5 w-full bg-gray-50 rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full w-[88%]" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between items-end">
                            <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Portfolio Reach</span>
                            <span className="text-sm font-black text-secondary uppercase">72%</span>
                        </div>
                        <div className="h-1.5 w-full bg-gray-50 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full w-[72%]" />
                        </div>
                    </div>
                </div>

                <div className="pt-6 border-t border-gray-50 grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-2xl text-center">
                        <div className="text-xs font-black text-secondary uppercase tracking-widest">{testimonials.length}</div>
                        <div className="text-[9px] font-bold text-gray-400 uppercase">Reviews</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-2xl text-center">
                        <div className="text-xs font-black text-secondary uppercase tracking-widest">{posts.length}</div>
                        <div className="text-[9px] font-bold text-gray-400 uppercase">Insights</div>
                    </div>
                </div>
            </div>

            {/* Global Activity Feed */}
            <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-8">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-secondary flex items-center">
                    <Activity size={16} className="mr-3 text-primary" /> Operational Feed
                </h3>
                
                <div className="space-y-6">
                    {allActivity.map((item, i) => (
                        <div key={i} className="flex gap-4 group">
                            <div className="flex flex-col items-center">
                                <div className={`w-2 h-2 rounded-full mt-1 ${
                                    item.type === 'quote' ? 'bg-primary' : 
                                    item.type === 'blog' ? 'bg-blue-500' : 
                                    item.type === 'project' ? 'bg-purple-500' : 'bg-gray-300'
                                }`} />
                                <div className="w-[1px] h-full bg-gray-100 mt-2" />
                            </div>
                            <div className="space-y-1 pb-4">
                                <div className="text-[10px] font-black uppercase tracking-widest opacity-40 leading-none">
                                    {item.type} • {item.date}
                                </div>
                                <div className="text-xs font-bold text-secondary leading-tight group-hover:text-primary transition-colors line-clamp-1">
                                    {item.name}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
