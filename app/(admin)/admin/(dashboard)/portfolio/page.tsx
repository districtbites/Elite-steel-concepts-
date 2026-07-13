import React from "react";
import { getProjects } from "@/lib/db";
import ProjectManager from "@/components/admin/ProjectManager";
import { Briefcase, Plus, Star, Layers, TrendingUp, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default async function AdminPortfolioPage() {
  const projects = await getProjects();
  const featured = projects.filter((p) => p.featured).length;
  const categories = new Set(projects.map((p) => p.category)).size;

  return (
    <div className="space-y-6 pb-12">
      {/* ═══════ DASHBOARD HEADER ═══════ */}
      <div className="bg-secondary rounded-[2rem] p-8 md:p-10 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-1/4 w-60 h-60 bg-primary/8 blur-[80px] rounded-full" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-3 bg-white/5 w-fit px-4 py-1.5 rounded-full border border-white/10">
              <Briefcase size={12} className="text-primary" />
              <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                portfolio manager
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter">
              Build <span className="text-primary italic">Showcase</span>
            </h1>
            <p className="text-gray-400 max-w-lg text-sm font-light leading-relaxed">
              Manage and showcase the craftsmanship of <strong className="text-white/70">Elite Steel Concepts</strong>.
              Add completed builds, feature your best work, and build credibility.
            </p>
          </div>

          <div className="flex gap-3 items-center flex-wrap">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
              <div className="text-center px-4">
                <div className="text-2xl font-black text-white">{projects.length}</div>
                <div className="text-[8px] font-bold uppercase tracking-widest text-gray-500 mt-0.5">Projects</div>
              </div>
              <div className="text-center px-4 border-x border-white/10">
                <div className="text-2xl font-black text-primary">{featured}</div>
                <div className="text-[8px] font-bold uppercase tracking-widest text-gray-500 mt-0.5">Featured</div>
              </div>
              <div className="text-center px-4">
                <div className="text-2xl font-black text-purple-400">{categories}</div>
                <div className="text-[8px] font-bold uppercase tracking-widest text-gray-500 mt-0.5">Categories</div>
              </div>
            </div>

            <Link
              href="/admin/portfolio/new"
              className="bg-primary text-secondary px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 hover:bg-white transition-all shadow-xl active:scale-95"
            >
              <Plus size={18} /> Add Build
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="flex gap-3 flex-wrap">
        <Link
          href="/portfolio"
          target="_blank"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest bg-white border border-gray-100 text-secondary hover:border-primary transition-all shadow-sm"
        >
          <ArrowUpRight size={12} /> View Live Portfolio
        </Link>
        {featured === 0 && projects.length > 0 && (
          <div className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest bg-amber-50 border border-amber-100 text-amber-600">
            <Star size={12} /> Tip: Feature your best project to highlight it on the homepage
          </div>
        )}
      </div>

      <ProjectManager initialProjects={projects} />
    </div>
  );
}
