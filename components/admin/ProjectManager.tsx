"use client";

import React, { useState } from "react";
import {
  Trash2,
  Edit2,
  Plus,
  Search,
  Filter,
  Star,
  Calendar,
  MapPin,
  Truck,
  ExternalLink,
  Grid,
  List,
  Layout,
  Sparkles,
  Eye,
  Tag,
  ChevronRight,
  X,
  AlertTriangle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Project } from "@/lib/db";
import { removeProject } from "@/app/actions/projects";

interface ProjectManagerProps {
  initialProjects: Project[];
}

const ProjectManager = ({ initialProjects }: ProjectManagerProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [deleteModal, setDeleteModal] = useState<{ id: string; title: string } | null>(null);

  const filteredProjects = initialProjects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.client?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "All" || p.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDelete = async (id: string) => {
    await removeProject(id);
    setDeleteModal(null);
    window.location.reload();
  };

  const categories = Array.from(new Set(initialProjects.map((p) => p.category)));

  return (
    <div className="space-y-6">
      {/* ═══════ CONTROL HUB ═══════ */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col lg:flex-row gap-4 items-center justify-between sticky top-4 z-20 backdrop-blur-lg">
        <div className="flex flex-col md:flex-row gap-3 w-full lg:w-auto">
          {/* Search */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search builds, clients, categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-50 border border-gray-100 pl-11 pr-4 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all font-bold text-xs text-secondary placeholder:text-gray-400 placeholder:font-medium"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500">
                <X size={14} />
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2 bg-gray-50 px-4 rounded-xl border border-gray-100 focus-within:border-primary/30 focus-within:ring-2 focus-within:ring-primary/10">
            <Filter size={13} className="text-gray-400 shrink-0" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-transparent border-0 py-2.5 text-[10px] font-black uppercase tracking-widest outline-none text-secondary cursor-pointer"
            >
              <option value="All">All Categories ({initialProjects.length})</option>
              {categories.map((c) => {
                const count = initialProjects.filter((p) => p.category === c).length;
                return (
                  <option key={c} value={c}>
                    {c} ({count})
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-end">
          {/* Results Count */}
          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
            {filteredProjects.length} of {initialProjects.length} builds
          </span>

          {/* View Toggle */}
          <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-100">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-all ${
                viewMode === "grid"
                  ? "bg-white text-secondary shadow-sm"
                  : "text-gray-400 hover:text-secondary"
              }`}
            >
              <Grid size={16} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-all ${
                viewMode === "list"
                  ? "bg-white text-secondary shadow-sm"
                  : "text-gray-400 hover:text-secondary"
              }`}
            >
              <List size={16} />
            </button>
          </div>

          {/* New Project */}
          <Link
            href="/admin/portfolio/new"
            className="flex items-center gap-2 bg-secondary text-primary px-5 py-2.5 rounded-xl font-black uppercase text-[9px] tracking-widest hover:bg-primary hover:text-secondary transition-all shadow-lg active:scale-95"
          >
            <Plus size={14} /> New Build
          </Link>
        </div>
      </div>

      {/* ═══════ GRID VIEW ═══════ */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProjects.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col group hover:shadow-xl hover:border-gray-200 transition-all duration-500"
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                <Image
                  src={p.image}
                  alt={p.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Hover Actions */}
                <div className="absolute top-3 right-3 flex gap-2 translate-y-[-10px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400">
                  <Link
                    href={`/admin/portfolio/edit/${p.id}`}
                    className="p-2.5 bg-white/95 text-secondary rounded-xl hover:bg-primary hover:text-secondary transition-all shadow-lg"
                  >
                    <Edit2 size={14} />
                  </Link>
                  <Link
                    href={`/portfolio/${p.slug}`}
                    target="_blank"
                    className="p-2.5 bg-white/95 text-secondary rounded-xl hover:bg-blue-500 hover:text-white transition-all shadow-lg"
                  >
                    <Eye size={14} />
                  </Link>
                  <button
                    onClick={() => setDeleteModal({ id: p.id, title: p.title })}
                    className="p-2.5 bg-red-500/90 text-white rounded-xl hover:bg-red-600 transition-all shadow-lg"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                {/* Badges */}
                <div className="absolute bottom-3 left-3 flex gap-2">
                  <span className="bg-primary text-secondary text-[7px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-lg shadow-lg">
                    {p.category}
                  </span>
                  {p.featured && (
                    <span className="bg-secondary/90 backdrop-blur text-primary text-[7px] font-black uppercase tracking-[0.15em] px-3 py-1.5 rounded-lg border border-primary/20 flex items-center gap-1 shadow-lg">
                      <Sparkles size={8} /> Featured
                    </span>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-3 flex-grow flex flex-col">
                <div>
                  <h3 className="text-lg font-black uppercase text-secondary tracking-tighter leading-tight group-hover:text-primary transition-colors">
                    {p.title}
                  </h3>
                  {p.tagline && (
                    <p className="text-[10px] font-medium text-gray-400 italic mt-1 line-clamp-1">
                      &ldquo;{p.tagline}&rdquo;
                    </p>
                  )}
                </div>

                {/* Meta */}
                <div className="flex flex-wrap gap-2 text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                  {p.client && (
                    <span className="flex items-center gap-1 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">
                      <Tag size={8} className="text-primary" /> {p.client}
                    </span>
                  )}
                  <span className="flex items-center gap-1 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">
                    <Calendar size={8} className="text-primary" /> {p.completionDate || "N/A"}
                  </span>
                  {p.location && (
                    <span className="flex items-center gap-1 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">
                      <MapPin size={8} className="text-primary" /> {p.location}
                    </span>
                  )}
                </div>

                <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed flex-grow font-light">
                  {p.description}
                </p>

                {/* Footer */}
                <div className="pt-3 border-t border-gray-50 flex justify-between items-center">
                  <div className="flex -space-x-1.5">
                    {p.gallery?.slice(0, 3).map((g, i) => (
                      <div key={i} className="w-7 h-7 rounded-lg border-2 border-white overflow-hidden relative bg-gray-100 shadow-sm">
                        <Image src={g} alt="Gallery" fill className="object-cover" unoptimized />
                      </div>
                    ))}
                    {p.gallery && p.gallery.length > 3 && (
                      <div className="w-7 h-7 rounded-lg border-2 border-white bg-gray-50 flex items-center justify-center text-[7px] font-black text-gray-400">
                        +{p.gallery.length - 3}
                      </div>
                    )}
                    {(!p.gallery || p.gallery.length === 0) && (
                      <span className="text-[8px] font-bold text-gray-300 uppercase tracking-wider">No gallery</span>
                    )}
                  </div>
                  <Link
                    href={`/admin/portfolio/edit/${p.id}`}
                    className="text-[8px] font-black uppercase text-gray-300 hover:text-primary transition-colors tracking-widest flex items-center gap-1"
                  >
                    Edit <ChevronRight size={8} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* ═══════ LIST VIEW ═══════ */
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50/80 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-[8px] font-black uppercase tracking-[0.2em] text-gray-400">Build Profile</th>
                  <th className="px-6 py-4 text-[8px] font-black uppercase tracking-[0.2em] text-gray-400 hidden md:table-cell">Category</th>
                  <th className="px-6 py-4 text-[8px] font-black uppercase tracking-[0.2em] text-gray-400 hidden lg:table-cell">Deployment</th>
                  <th className="px-6 py-4 text-[8px] font-black uppercase tracking-[0.2em] text-gray-400 hidden lg:table-cell">Gallery</th>
                  <th className="px-6 py-4 text-[8px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredProjects.map((p) => (
                  <tr key={p.id} className="group hover:bg-primary/3 transition-all">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-10 rounded-xl overflow-hidden relative bg-gray-100 shadow-sm shrink-0">
                          <Image src={p.image} alt={p.title} fill className="object-cover" unoptimized />
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-sm text-secondary uppercase tracking-tight flex items-center gap-2 truncate">
                            {p.title}
                            {p.featured && <Star size={10} fill="#facc15" className="text-yellow-400 shrink-0" />}
                          </div>
                          <div className="text-[9px] text-gray-400 font-medium mt-0.5 truncate">
                            {p.client || "—"} {p.location && `· ${p.location}`}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <span className="px-3 py-1 bg-primary/10 text-primary text-[7px] font-black uppercase tracking-widest rounded-full">
                        {p.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[10px] font-bold text-gray-400 hidden lg:table-cell">
                      {p.completionDate || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-[10px] font-bold text-gray-400 hidden lg:table-cell">
                      {p.gallery?.length || 0} images
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/portfolio/${p.slug}`}
                          target="_blank"
                          className="p-2 bg-gray-50 text-gray-400 rounded-lg hover:bg-blue-50 hover:text-blue-500 transition-all"
                        >
                          <Eye size={14} />
                        </Link>
                        <Link
                          href={`/admin/portfolio/edit/${p.id}`}
                          className="p-2 bg-gray-50 text-secondary rounded-lg hover:bg-secondary hover:text-white transition-all"
                        >
                          <Edit2 size={14} />
                        </Link>
                        <button
                          onClick={() => setDeleteModal({ id: p.id, title: p.title })}
                          className="p-2 bg-gray-50 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ═══════ EMPTY STATE ═══════ */}
      {filteredProjects.length === 0 && (
        <div className="p-16 text-center space-y-5 bg-white rounded-[2rem] border border-dashed border-gray-200">
          <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto text-gray-200">
            <Layout size={32} />
          </div>
          <div className="space-y-2">
            <p className="text-secondary font-black uppercase tracking-widest text-sm">No Build Data Detected</p>
            <p className="text-gray-400 text-xs font-medium">
              {searchTerm || filterCategory !== "All"
                ? "Try clearing your filters or search term."
                : "Initialize your first build entry to start showcasing your work."}
            </p>
          </div>
          {!searchTerm && filterCategory === "All" && (
            <Link
              href="/admin/portfolio/new"
              className="inline-flex items-center gap-2 bg-secondary text-primary px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-all shadow-xl"
            >
              <Plus size={16} /> Add First Build
            </Link>
          )}
        </div>
      )}

      {/* ═══════ DELETE CONFIRMATION MODAL ═══════ */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6 animate-in fade-in zoom-in">
            <div className="text-center space-y-3">
              <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto">
                <AlertTriangle size={28} className="text-red-500" />
              </div>
              <h3 className="text-xl font-black uppercase text-secondary tracking-tight">Delete Project?</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Are you sure you want to delete <strong className="text-secondary">&ldquo;{deleteModal.title}&rdquo;</strong>?
                This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteModal(null)}
                className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-bold text-secondary hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteModal.id)}
                className="flex-1 py-3 rounded-xl bg-red-500 text-white text-sm font-black uppercase tracking-wider hover:bg-red-600 transition-all shadow-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectManager;
