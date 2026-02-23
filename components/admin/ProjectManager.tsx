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
    Layout
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
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    const filteredProjects = initialProjects.filter(p => {
        const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             p.client?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === "All" || p.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to decommission this project from the portfolio?")) {
            await removeProject(id);
        }
    };

    const categories = Array.from(new Set(initialProjects.map(p => p.category)));

    return (
        <div className="space-y-8">
            {/* Control Hub */}
            <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col lg:flex-row gap-6 items-center justify-between">
                <div className="flex flex-col md:flex-row gap-4 w-full lg:w-auto">
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search builds or clients..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-gray-50 border-0 pl-12 pr-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-xs"
                        />
                    </div>
                    <div className="flex items-center gap-2 bg-gray-50 px-4 rounded-xl border border-transparent focus-within:border-primary/20">
                        <Filter size={14} className="text-gray-400" />
                        <select 
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="bg-transparent border-0 py-3 text-[10px] font-black uppercase tracking-widest outline-none text-secondary"
                        >
                            <option value="All">All Categories</option>
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                </div>

                <div className="flex items-center gap-4 w-full lg:w-auto justify-between lg:justify-end">
                    <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-100">
                        <button 
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white text-secondary shadow-sm' : 'text-gray-400 hover:text-secondary'}`}
                        >
                            <Grid size={18} />
                        </button>
                        <button 
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white text-secondary shadow-sm' : 'text-gray-400 hover:text-secondary'}`}
                        >
                            <List size={18} />
                        </button>
                    </div>
                    <Link href="/admin/portfolio/new" className="flex items-center gap-2 bg-secondary text-primary px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-primary hover:text-secondary transition-all shadow-lg">
                        <Plus size={16} /> New Build
                    </Link>
                </div>
            </div>

            {/* Content Display */}
            {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {filteredProjects.map((p) => (
                        <div key={p.id} className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col group hover:shadow-xl transition-all duration-500">
                            <div className="relative h-64 overflow-hidden">
                                <Image 
                                    src={p.image} 
                                    alt={p.title} 
                                    fill 
                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                    unoptimized
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                
                                {/* Overlay Actions */}
                                <div className="absolute top-4 right-4 flex gap-2 translate-y-[-20px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                                    <Link href={`/admin/portfolio/edit/${p.id}`} className="p-3 bg-white/90 text-secondary rounded-xl hover:bg-primary hover:text-secondary transition-all">
                                        <Edit2 size={16} />
                                    </Link>
                                    <button onClick={() => handleDelete(p.id)} className="p-3 bg-red-500/90 text-white rounded-xl hover:bg-red-600 transition-all">
                                        <Trash2 size={16} />
                                    </button>
                                </div>

                                {/* Status Badges */}
                                <div className="absolute bottom-4 left-4 flex gap-2">
                                    <span className="bg-primary text-secondary text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-lg shadow-lg">
                                        {p.category}
                                    </span>
                                    {p.featured && (
                                        <span className="bg-secondary text-primary text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-lg border border-primary/30 flex items-center gap-1 shadow-lg">
                                            <Star size={8} fill="currentColor" /> Featured
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="p-8 space-y-4 flex-grow flex flex-col">
                                <div>
                                    <h3 className="text-xl font-black uppercase text-secondary tracking-tighter leading-tight group-hover:text-primary transition-colors">
                                        {p.title}
                                    </h3>
                                    {p.tagline && <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-1">{p.tagline}</p>}
                                </div>
                                
                                <div className="flex flex-wrap gap-4 pt-2 border-t border-gray-50 text-[10px] font-black uppercase tracking-widest text-gray-400">
                                    <div className="flex items-center gap-1.5"><Calendar size={12} className="text-primary"/> {p.completionDate || 'N/A'}</div>
                                    <div className="flex items-center gap-1.5"><MapPin size={12} className="text-primary"/> {p.location || 'N/A'}</div>
                                </div>

                                <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed flex-grow italic">
                                    "{p.description}"
                                </p>

                                <div className="pt-4 flex justify-between items-center">
                                    <div className="flex -space-x-2">
                                        {p.gallery?.slice(0, 3).map((g, i) => (
                                            <div key={i} className="w-8 h-8 rounded-lg border-2 border-white overflow-hidden relative bg-gray-100 shadow-sm">
                                                <Image src={g} alt="Gallery" fill className="object-cover" unoptimized />
                                            </div>
                                        ))}
                                        {p.gallery && p.gallery.length > 3 && (
                                            <div className="w-8 h-8 rounded-lg border-2 border-white bg-gray-50 flex items-center justify-center text-[8px] font-black text-secondary">
                                                +{p.gallery.length - 3}
                                            </div>
                                        )}
                                    </div>
                                    <Link href={`/portfolio/${p.slug}`} target="_blank" className="text-primary hover:text-secondary transition-colors">
                                        <ExternalLink size={18} />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50 border-b border-gray-100">
                            <tr>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Build Profile</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Architecture</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Deployment</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredProjects.map((p) => (
                                <tr key={p.id} className="group hover:bg-gray-50/30 transition-all">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-12 rounded-xl overflow-hidden relative bg-gray-100 shadow-sm">
                                                <Image src={p.image} alt={p.title} fill className="object-cover" unoptimized />
                                            </div>
                                            <div>
                                                <div className="font-black text-secondary uppercase tracking-tight flex items-center gap-2">
                                                    {p.title}
                                                    {p.featured && <Star size={10} fill="#facc15" className="text-yellow-400" />}
                                                </div>
                                                <div className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">{p.client}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="px-3 py-1 bg-secondary text-primary text-[8px] font-black uppercase tracking-widest rounded-lg">
                                            {p.category}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                        {p.completionDate || 'N/A'} • {p.location || 'N/A'}
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link 
                                                href={`/admin/portfolio/edit/${p.id}`}
                                                className="p-2.5 bg-gray-50 text-secondary rounded-xl hover:bg-secondary hover:text-white transition-all shadow-sm group-hover:shadow-md"
                                            >
                                                <Edit2 size={16} />
                                            </Link>
                                            <button 
                                                onClick={() => handleDelete(p.id)}
                                                className="p-2.5 bg-gray-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm group-hover:shadow-md"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {filteredProjects.length === 0 && (
                <div className="p-20 text-center space-y-6 bg-white rounded-[3rem] border border-dashed border-gray-200">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-200">
                        <Layout size={40} />
                    </div>
                    <div className="space-y-2">
                        <p className="text-secondary font-black uppercase tracking-widest text-sm">No Build Data Detected</p>
                        <p className="text-gray-400 text-xs font-medium">Clear your filters or initialize your first build entry.</p>
                    </div>
                    <Link href="/admin/portfolio/new" className="inline-flex items-center gap-2 bg-secondary text-primary px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-all shadow-xl">
                        <Plus size={18} /> Add First Build
                    </Link>
                </div>
            )}
        </div>
    );
};

export default ProjectManager;
