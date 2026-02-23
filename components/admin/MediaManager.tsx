"use client";

import React, { useState } from "react";
import { 
  Upload, 
  Trash2, 
  Edit2, 
  Image as ImageIcon, 
  Search, 
  Filter, 
  X, 
  Check, 
  AlertCircle,
  Maximize2,
  FileText,
  Settings,
  FolderRoot,
  LayoutGrid,
  ExternalLink
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { addMediaAsset, editMediaAsset, removeMediaAsset } from "@/app/actions/media";
import type { MediaAsset } from "@/lib/db";

interface MediaManagerProps {
  initialAssets: MediaAsset[];
}

export default function MediaManager({ initialAssets }: MediaManagerProps) {
  const [viewMode, setViewMode] = useState<"library" | "sections">("sections");
  const [assets, setAssets] = useState<MediaAsset[]>(initialAssets);
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [editingAsset, setEditingAsset] = useState<MediaAsset | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [pageFilter, setPageFilter] = useState("all");

  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const pages = ["home", "about", "services", "portfolio", "blog", "contact", "quote", "global"];

  // Grouping assets for Sections view: Page -> Location -> Assets
  const hierarchicalMap = pages.reduce((acc, page) => {
    const pageAssets = assets.filter(a => a.page === page);
    const locations = Array.from(new Set(pageAssets.map(a => a.location || "Uncategorized")));
    
    acc[page] = locations.reduce((locAcc, loc) => {
      locAcc[loc] = pageAssets.filter(a => (a.location || "Uncategorized") === loc);
      return locAcc;
    }, {} as Record<string, MediaAsset[]>);
    
    return acc;
  }, {} as Record<string, Record<string, MediaAsset[]>>);

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.alt.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         asset.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPage = pageFilter === "all" || asset.page === pageFilter;
    return matchesSearch && matchesPage;
  });

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUploading(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const result = await addMediaAsset(formData);

    if (result.success) {
      setMessage({ type: "success", text: "Image uploaded successfully!" });
      setShowUploadModal(false);
      window.location.reload(); 
    } else {
      setMessage({ type: "error", text: result.error || "Failed to upload image" });
    }
    setIsUploading(false);
  };

  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUploading(true);
    
    const formData = new FormData(e.currentTarget);
    const result = await editMediaAsset(formData);

    if (result.success) {
      setMessage({ type: "success", text: "Asset updated successfully!" });
      setEditingAsset(null);
      window.location.reload();
    } else {
      setMessage({ type: "error", text: result.error || "Failed to update asset" });
    }
    setIsUploading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this asset?")) return;

    const result = await removeMediaAsset(id);
    if (result.success) {
      setAssets(assets.filter(a => a.id !== id));
      setMessage({ type: "success", text: "Asset removed" });
    } else {
      setMessage({ type: "error", text: "Failed to delete" });
    }
  };

  return (
    <div className="space-y-8">
      {/* View Switcher & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex bg-gray-100 p-1.5 rounded-[2rem] w-fit">
           <button 
             onClick={() => setViewMode("sections")}
             className={`flex items-center gap-2 px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === "sections" ? "bg-white text-secondary shadow-sm" : "text-gray-400 hover:text-secondary"}`}
           >
             <LayoutGrid size={14} /> Website Sections
           </button>
           <button 
             onClick={() => setViewMode("library")}
             className={`flex items-center gap-2 px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === "library" ? "bg-white text-secondary shadow-sm" : "text-gray-400 hover:text-secondary"}`}
           >
             <FolderRoot size={14} /> Asset Library
           </button>
        </div>

        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex items-center gap-4 bg-white px-6 py-3 rounded-2xl border border-gray-100 focus-within:border-primary transition-all shadow-sm">
            <Search size={18} className="text-gray-400" />
            <input 
              type="text" 
              placeholder="Search assets..." 
              className="bg-transparent border-none outline-none w-full md:w-48 text-xs font-bold uppercase tracking-widest"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <button 
            onClick={() => setShowUploadModal(true)}
            className="flex items-center justify-center gap-3 bg-secondary text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-primary hover:text-secondary transition-all shadow-xl group"
          >
            <Upload size={16} className="group-hover:-translate-y-1 transition-transform" /> Add New WebP
          </button>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-2xl flex items-center justify-between gap-3 animate-in slide-in-from-top-4 duration-500 ${
          message.type === "success" ? "bg-green-50 text-green-700 border border-green-100" : "bg-red-50 text-red-700 border border-red-100"
        }`}>
          <div className="flex items-center gap-3">
            {message.type === "success" ? <Check size={18} /> : <AlertCircle size={18} />}
            <p className="text-[10px] font-black uppercase tracking-[0.2em]">{message.text}</p>
          </div>
          <button onClick={() => setMessage(null)}><X size={14}/></button>
        </div>
      )}

      {/* Main View Area */}
      {viewMode === "sections" ? (
        <div className="grid grid-cols-1 gap-16">
           {pages.map((page) => {
             const pageData = hierarchicalMap[page];
             const locations = Object.keys(pageData);
             const hasAssets = locations.length > 0;

             return (
               <div key={page} className="space-y-8">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-secondary text-primary rounded-2xl flex items-center justify-center shadow-lg">
                           <FileText size={20} />
                        </div>
                        <div>
                           <h3 className="text-2xl font-black uppercase text-secondary tracking-tighter">{page}</h3>
                           <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Section Inventory</p>
                        </div>
                     </div>
                     <Link href={page === "home" ? "/" : `/${page}`} className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-primary hover:text-secondary transition-colors">
                        View Page <ExternalLink size={14} />
                     </Link>
                  </div>

                  {hasAssets ? (
                    <div className="space-y-12">
                      {locations.map(location => (
                        <div key={location} className="space-y-4">
                           <h4 className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-secondary/60">
                              <span className="w-8 h-px bg-gray-100"></span>
                              {location}
                           </h4>
                           <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                              {pageData[location].map(asset => (
                                <div key={asset.id} className="group relative bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all aspect-square">
                                  <Image src={asset.url} alt={asset.alt} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                                  <div className="absolute inset-x-2 bottom-2 bg-white/90 backdrop-blur-md p-3 rounded-2xl opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                                     <div className="flex items-center justify-between">
                                        <span className="text-[8px] text-gray-400 font-medium truncate w-1/2">{asset.dimensions || "Auto"}</span>
                                        <div className="flex gap-2">
                                           <button onClick={() => setEditingAsset(asset)} className="text-secondary hover:text-primary transition-colors"><Edit2 size={12}/></button>
                                           <button onClick={() => handleDelete(asset.id)} className="text-red-500 hover:text-red-700 transition-colors"><Trash2 size={12}/></button>
                                        </div>
                                     </div>
                                  </div>
                                </div>
                              ))}
                           </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-[2.5rem] p-12 text-center">
                       <div className="bg-white w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 text-gray-300 shadow-sm">
                          <ImageIcon size={20} />
                       </div>
                       <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">No production assets found for this section</p>
                       <p className="text-[9px] text-gray-400 italic mt-1 uppercase">Currently using fallback/hardcoded imagery</p>
                    </div>
                  )}
               </div>
             )
           })}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredAssets.map((asset) => (
            <div key={asset.id} className="group bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col">
              <div className="relative aspect-square overflow-hidden bg-gray-100">
                <Image 
                  src={asset.url} 
                  alt={asset.alt} 
                  fill 
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-secondary/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <button 
                    onClick={() => setEditingAsset(asset)}
                    className="p-4 bg-white text-secondary rounded-2xl hover:bg-primary hover:scale-110 transition-all shadow-xl"
                  >
                    <Edit2 size={20} />
                  </button>
                  <button 
                    onClick={() => handleDelete(asset.id)}
                    className="p-4 bg-red-500 text-white rounded-2xl hover:bg-red-600 hover:scale-110 transition-all shadow-xl"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <span className="bg-secondary/80 backdrop-blur-md text-primary px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
                    {asset.page}
                  </span>
                  <span className="bg-white/90 backdrop-blur-md text-secondary px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
                    {asset.location}
                  </span>
                </div>
              </div>
              
              <div className="p-6 space-y-3">
                <div className="flex items-center gap-2 text-gray-400 text-[9px] font-black uppercase tracking-widest">
                  <Maximize2 size={12} /> {asset.dimensions || "No dimensions set"}
                </div>
                <p className="text-xs text-gray-400 font-medium italic truncate">"{asset.alt}"</p>
                <div className="pt-3 border-t border-gray-50 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-gray-300">
                    {new Date(asset.createdAt).toLocaleDateString()}
                  </span>
                  <a href={asset.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-secondary p-2 transition-colors">
                    <ImageIcon size={14} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload/Edit Modal */}
      {(showUploadModal || editingAsset) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-md bg-secondary/40">
           <div className="bg-white rounded-[3.5rem] w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
              <div className="relative p-12 space-y-8">
                 <button 
                    onClick={() => { setShowUploadModal(false); setEditingAsset(null); }}
                    className="absolute top-8 right-8 p-3 bg-gray-50 text-gray-400 rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all"
                 >
                    <X size={20} />
                 </button>

                 <div className="space-y-2">
                    <span className="text-primary font-bold tracking-widest uppercase text-xs">Media Vault</span>
                    <h2 className="text-3xl font-black uppercase text-secondary tracking-tighter">
                       {editingAsset ? "Update Asset" : "Deploy New Asset"}
                    </h2>
                 </div>

                 <form onSubmit={editingAsset ? handleEdit : handleUpload} className="space-y-6">
                    {editingAsset && <input type="hidden" name="id" value={editingAsset.id} />}
                    
                    {!editingAsset && (
                      <div className="space-y-4">
                         <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block ml-4">Select WebP Graphic</label>
                         <div className="relative group">
                            <input 
                              type="file" 
                              name="image" 
                              required 
                              accept="image/webp"
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            <div className="border-2 border-dashed border-gray-200 rounded-3xl p-12 text-center group-hover:border-primary group-hover:bg-primary/5 transition-all">
                               <Upload size={32} className="mx-auto text-gray-300 mb-4 group-hover:text-primary" />
                               <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Drop WebP File Here</p>
                               <p className="text-[9px] text-gray-400 mt-2 italic font-medium">Dimension guide: Hero (1920x1080), Gallery (1200x800), Icons (256x256)</p>
                            </div>
                         </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block ml-4">Associated Page</label>
                          <select 
                            name="page" 
                            defaultValue={editingAsset?.page || "global"}
                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-xs font-bold uppercase tracking-widest outline-none focus:border-primary transition-all"
                          >
                            {pages.map(p => <option key={p} value={p}>{p.toUpperCase()}</option>)}
                          </select>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block ml-4">Deployment Zone (Location)</label>
                          <input 
                            name="location" 
                            placeholder="e.g. Hero, Footer, Specification Card" 
                            defaultValue={editingAsset?.location || ""}
                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-xs font-bold outline-none focus:border-primary transition-all"
                          />
                       </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block ml-4">SEO Alt Text</label>
                          <input 
                            name="alt" 
                            required 
                            placeholder="Descriptive text for accessibility & SEO" 
                            defaultValue={editingAsset?.alt || ""}
                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-xs font-bold outline-none focus:border-primary transition-all"
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block ml-4">Resolution Guide</label>
                          <input 
                            name="dimensions" 
                            placeholder="e.g. 1920x1080" 
                            defaultValue={editingAsset?.dimensions || ""}
                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-xs font-bold outline-none focus:border-primary transition-all"
                          />
                       </div>
                    </div>

                    <button 
                      type="submit" 
                      disabled={isUploading}
                      className="w-full bg-secondary text-white py-6 rounded-3xl font-black uppercase tracking-[0.2em] text-xs hover:bg-primary hover:text-secondary transition-all shadow-2xl disabled:opacity-50 flex items-center justify-center gap-4"
                    >
                      {isUploading ? "Syncing Assets..." : (editingAsset ? "Commit Changes" : "Finalize Upload")} {isUploading ? <Settings className="animate-spin" size={16} /> : <Check size={16} />}
                    </button>
                 </form>

                 <div className="pt-8 border-t border-gray-100">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-secondary mb-4 flex items-center gap-2">
                       <AlertCircle size={14} className="text-primary" /> Suggested Deployment Keys
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="p-4 bg-gray-50 rounded-2xl">
                          <p className="text-[9px] font-black uppercase text-gray-400 mb-2">Trucks Page</p>
                          <ul className="text-[9px] font-bold text-secondary space-y-1">
                             <li>• philosophy_hero</li>
                             <li>• core_interior</li>
                          </ul>
                       </div>
                       <div className="p-4 bg-gray-50 rounded-2xl">
                          <p className="text-[9px] font-black uppercase text-gray-400 mb-2">Trailers Page</p>
                          <ul className="text-[9px] font-bold text-secondary space-y-1">
                             <li>• hero</li>
                             <li>• fabrication_detail</li>
                          </ul>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
