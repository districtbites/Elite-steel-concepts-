"use client";

import React, { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Upload,
  Trash2,
  Edit2,
  Image as ImageIcon,
  Search,
  X,
  Check,
  AlertCircle,
  Maximize2,
  FileText,
  Settings,
  FolderOpen,
  LayoutGrid,
  ExternalLink,
  Zap,
  Camera,
  Eye,
  Copy,
  ChevronDown,
  ChevronRight,
  Info,
  Layers,
  Grid3X3,
  ArrowUpRight,
  HardDrive,
  RefreshCw,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { addMediaAsset, editMediaAsset, removeMediaAsset } from "@/app/actions/media";
import type { MediaAsset } from "@/lib/db";

interface MediaManagerProps {
  initialAssets: MediaAsset[];
}

// ─── Pages that have images managed via Media Manager ───
// Every entry here maps 1:1 to a getMediaAsset() call on the live frontend.
const PAGE_CONFIG: Record<string, { label: string; emoji: string; description: string; color: string }> = {
  home:                   { label: "Homepage",       emoji: "🏠", description: "Hero banner, platform selection cards", color: "from-blue-500/10 to-blue-500/5" },
  about:                  { label: "About Us",       emoji: "ℹ️",  description: "About page hero image", color: "from-purple-500/10 to-purple-500/5" },
  services:               { label: "Services",       emoji: "🔧", description: "Services hero and service card images",     color: "from-amber-500/10 to-amber-500/5" },
  "custom-food-trucks":   { label: "Food Trucks",    emoji: "🚚", description: "Philosophy hero, interior, platform cards", color: "from-red-500/10 to-red-500/5" },
  "custom-food-trailers": { label: "Food Trailers",  emoji: "🏗️",  description: "Hero, fabrication, platforms, CTA",    color: "from-orange-500/10 to-orange-500/5" },
  contact:                { label: "Contact",         emoji: "📞", description: "Factory tour / CTA banner background",     color: "from-pink-500/10 to-pink-500/5" },
  testimonials:           { label: "Testimonials",    emoji: "⭐", description: "Featured story video thumbnail", color: "from-yellow-500/10 to-yellow-500/5" },
};

// ─── Image slots per page (must match getMediaAsset() calls in frontend) ───
const LOCATION_PRESETS: Record<string, { key: string; label: string; size: string }[]> = {
  home: [
    { key: "hero", label: "Hero Banner", size: "1920 × 1080" },
    { key: "truck_card", label: "Truck Platform Card (Choose Your Platform)", size: "1200 × 800" },
    { key: "trailer_card", label: "Trailer Platform Card (Choose Your Platform)", size: "1200 × 800" },
  ],
  about: [
    { key: "hero", label: "Page Hero", size: "1200 × 1200" },
  ],
  services: [
    { key: "hero", label: "Page Hero", size: "1920 × 1080" },
    { key: "service_card_1", label: "Service Card — Food Trucks", size: "800 × 600" },
    { key: "service_card_2", label: "Service Card — Food Trailers", size: "800 × 600" },
  ],
  "custom-food-trucks": [
    { key: "philosophy_hero", label: "Philosophy Hero Section", size: "1200 × 800" },
    { key: "core_interior", label: "Engineering Core Interior Shot", size: "1200 × 1600" },
    { key: "platform_compact", label: "Platform Card — 14-16ft Compact", size: "800 × 600" },
    { key: "platform_standard", label: "Platform Card — 18-20ft Standard", size: "800 × 600" },
    { key: "platform_heavy", label: "Platform Card — 22ft+ Heavy Duty", size: "800 × 600" },
  ],
  "custom-food-trailers": [
    { key: "hero", label: "Hero Breakdown Section", size: "1200 × 1200" },
    { key: "fabrication_detail", label: "Towing Intelligence Detail Image", size: "1200 × 1600" },
    { key: "platform_pod", label: "Platform Card — 10-14ft Pod", size: "800 × 600" },
    { key: "platform_workhorse", label: "Platform Card — 18-24ft Workhorse", size: "800 × 600" },
    { key: "platform_titan", label: "Platform Card — 26ft+ Event Titan", size: "800 × 600" },
    { key: "cta_background", label: "CTA Section Background", size: "1920 × 1080" },
  ],
  contact: [
    { key: "hero", label: "Factory Tour / CTA Banner", size: "1920 × 1080" },
  ],
  testimonials: [
    { key: "hero", label: "Featured Story Thumbnail", size: "1200 × 800" },
  ],
};

export default function MediaManager({ initialAssets }: MediaManagerProps) {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<"sections" | "library">("sections");
  const [assets, setAssets] = useState<MediaAsset[]>(initialAssets);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [editingAsset, setEditingAsset] = useState<MediaAsset | null>(null);
  const [previewAsset, setPreviewAsset] = useState<MediaAsset | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [pageFilter, setPageFilter] = useState("all");
  const [expandedPages, setExpandedPages] = useState<Set<string>>(new Set(Object.keys(PAGE_CONFIG)));
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [showGuide, setShowGuide] = useState(false);

  // Upload form state
  const [uploadPage, setUploadPage] = useState("home");
  const [uploadLocation, setUploadLocation] = useState("");
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [uploadFileName, setUploadFileName] = useState("");

  // Check if current slot is being replaced
  const isReplacingSlot = assets.some(
    (a) => a.page === uploadPage && a.location === uploadLocation && uploadLocation !== ""
  );

  // ─── Coverage stats ───
  const totalSlots = Object.values(LOCATION_PRESETS).reduce((sum, presets) => sum + presets.length, 0);
  const filledSlots = Object.entries(LOCATION_PRESETS).reduce((sum, [page, presets]) => {
    return sum + presets.filter(p => assets.some(a => a.page === page && a.location === p.key)).length;
  }, 0);
  const coveragePercent = totalSlots > 0 ? Math.round((filledSlots / totalSlots) * 100) : 0;

  const pageStats = Object.entries(LOCATION_PRESETS).map(([page, presets]) => {
    const filled = presets.filter(p => assets.some(a => a.page === page && a.location === p.key)).length;
    return { page, total: presets.length, filled, label: PAGE_CONFIG[page]?.label || page, emoji: PAGE_CONFIG[page]?.emoji || "📄" };
  });

  // Helper to open upload modal pre-filled for a specific slot
  const openUploadForSlot = (page: string, location: string) => {
    setUploadPage(page);
    setUploadLocation(location);
    setUploadPreview(null);
    setUploadFileName("");
    setShowUploadModal(true);
  };

  const allPages = Object.keys(PAGE_CONFIG);

  // Group assets by page -> location
  const hierarchicalMap = allPages.reduce((acc, page) => {
    const pageAssets = assets.filter((a) => a.page === page);
    const locations = Array.from(new Set(pageAssets.map((a) => a.location || "uncategorized")));
    acc[page] = locations.reduce((locAcc, loc) => {
      locAcc[loc] = pageAssets.filter((a) => (a.location || "uncategorized") === loc);
      return locAcc;
    }, {} as Record<string, MediaAsset[]>);
    return acc;
  }, {} as Record<string, Record<string, MediaAsset[]>>);

  const filteredAssets = assets.filter((asset) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      asset.alt.toLowerCase().includes(q) ||
      asset.location.toLowerCase().includes(q) ||
      asset.page.toLowerCase().includes(q);
    const matchesPage = pageFilter === "all" || asset.page === pageFilter;
    return matchesSearch && matchesPage;
  });

  const togglePage = (page: string) => {
    setExpandedPages((prev) => {
      const next = new Set(prev);
      if (next.has(page)) next.delete(page);
      else next.add(page);
      return next;
    });
  };

  const handleFilePreview = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadFileName(file.name);
      const reader = new FileReader();
      reader.onload = (ev) => setUploadPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setUploadPreview(null);
      setUploadFileName("");
    }
  };

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUploading(true);
    setUploadProgress("Uploading & optimizing image...");
    setMessage(null);
    const formData = new FormData(e.currentTarget);
    const result = await addMediaAsset(formData);
    if (result.success) {
      setMessage({ type: "success", text: isReplacingSlot ? "✅ Image replaced successfully! The frontend has been updated." : "✅ Image uploaded successfully! It will now appear on the live website." });
      setShowUploadModal(false);
      setUploadPreview(null);
      setUploadFileName("");
      setUploadProgress("");
      // Use router.refresh() for faster, seamless update instead of full page reload
      router.refresh();
    } else {
      setMessage({ type: "error", text: result.error || "Failed to upload image" });
      setUploadProgress("");
    }
    setIsUploading(false);
  };

  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUploading(true);
    const formData = new FormData(e.currentTarget);
    const result = await editMediaAsset(formData);
    if (result.success) {
      setMessage({ type: "success", text: "✅ Image details updated! Changes are now live on the website." });
      setEditingAsset(null);
      // Use router.refresh() for faster, seamless update instead of full page reload
      router.refresh();
    } else {
      setMessage({ type: "error", text: result.error || "Failed to update" });
    }
    setIsUploading(false);
  };

  const handleDelete = async (id: string) => {
    const result = await removeMediaAsset(id);
    if (result.success) {
      setAssets(assets.filter((a) => a.id !== id));
      setMessage({ type: "success", text: "Image deleted successfully" });
      setDeleteConfirm(null);
    } else {
      setMessage({ type: "error", text: "Failed to delete" });
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setMessage({ type: "success", text: "📋 Image URL copied to clipboard!" });
    setTimeout(() => setMessage(null), 2500);
  };

  const getPresetForLocation = (page: string, location: string) => {
    return LOCATION_PRESETS[page]?.find((p) => p.key === location);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* ═══════════════════════════════════════════════════════
          DASHBOARD HERO HEADER
         ═══════════════════════════════════════════════════════ */}
      <div className="bg-secondary rounded-[2rem] p-8 md:p-10 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/15 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-1/4 w-60 h-60 bg-primary/10 blur-[80px] rounded-full" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-3 bg-white/5 w-fit px-4 py-1.5 rounded-full border border-white/10">
              <Camera size={12} className="text-primary" />
              <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                media manager
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter">
              Image <span className="text-primary italic">Library</span>
            </h1>
            <p className="text-gray-400 max-w-lg text-sm font-light leading-relaxed">
              Manage all <strong className="text-white/70">{totalSlots} image slots</strong> across your website.
              Each slot maps to a specific section on a live page.
            </p>
          </div>

          <div className="flex gap-3 items-end flex-wrap">
            {/* Coverage Tracker */}
            <div className="bg-white/5 p-5 rounded-2xl border border-white/10 backdrop-blur-md min-w-[220px]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Site Coverage</span>
                <span className={`text-lg font-black ${coveragePercent === 100 ? "text-green-400" : coveragePercent > 50 ? "text-primary" : "text-amber-400"}`}>
                  {coveragePercent}%
                </span>
              </div>
              <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden mb-2">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${coveragePercent === 100 ? "bg-green-400" : coveragePercent > 50 ? "bg-primary" : "bg-amber-400"}`}
                  style={{ width: `${coveragePercent}%` }}
                />
              </div>
              <p className="text-[9px] text-gray-500">
                <strong className="text-white/70">{filledSlots}</strong> of <strong className="text-white/70">{totalSlots}</strong> image slots filled
                {filledSlots < totalSlots && <span className="text-amber-400 ml-1">· {totalSlots - filledSlots} using defaults</span>}
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => setShowGuide(!showGuide)}
                className={`px-6 py-3.5 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-2 transition-all ${
                  showGuide ? "bg-white text-secondary" : "bg-white/10 text-white border border-white/10 hover:bg-white/20"
                }`}
              >
                <Info size={14} /> {showGuide ? "Hide Guide" : "Setup Guide"}
              </button>
              <button
                onClick={() => openUploadForSlot("home", "")}
                className="bg-primary text-secondary px-6 py-3.5 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-2 hover:bg-white transition-all shadow-xl active:scale-95"
              >
                <Upload size={16} /> Upload Image
              </button>
            </div>
          </div>
        </div>

        {/* Per-page mini coverage bar */}
        <div className="relative z-10 mt-6 pt-6 border-t border-white/10">
          <div className="flex gap-2 flex-wrap">
            {pageStats.map((ps) => (
              <button
                key={ps.page}
                onClick={() => { setViewMode("sections"); setExpandedPages(new Set([ps.page])); }}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-[9px] font-bold uppercase tracking-wider transition-all ${
                  ps.filled === ps.total
                    ? "bg-green-500/15 text-green-400 border border-green-500/20"
                    : ps.filled > 0
                    ? "bg-amber-500/15 text-amber-400 border border-amber-500/20"
                    : "bg-white/5 text-gray-500 border border-white/5 hover:border-white/20"
                }`}
              >
                <span>{ps.emoji}</span>
                <span>{ps.label}</span>
                <span className={`px-1.5 py-0.5 rounded text-[7px] font-black ${
                  ps.filled === ps.total ? "bg-green-500/20 text-green-300" : ps.filled > 0 ? "bg-amber-500/20 text-amber-300" : "bg-white/10 text-gray-500"
                }`}>
                  {ps.filled}/{ps.total}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          SETUP GUIDE PANEL (Collapsible)
         ═══════════════════════════════════════════════════════ */}
      {showGuide && (
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-lg overflow-hidden animate-in slide-in-from-top-2">
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-black uppercase text-secondary tracking-tight">📖 Media Manager Guide</h2>
                <p className="text-xs text-gray-400 mt-1">Everything you need to know about managing your website images</p>
              </div>
              <button onClick={() => setShowGuide(false)} className="p-2 bg-gray-50 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all">
                <X size={16} />
              </button>
            </div>

            {/* How it works */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              {[
                { step: "1", icon: "📄", title: "Select Page", desc: "Choose which page the image belongs to (Homepage, Services, etc.)" },
                { step: "2", icon: "📍", title: "Pick Slot", desc: "Select the exact image slot — each one maps to a section on the live page" },
                { step: "3", icon: "🖼️", title: "Upload WebP", desc: "Upload a .webp image — it will be auto-optimized for fast loading" },
                { step: "4", icon: "✅", title: "Live Instantly", desc: "Your image replaces the default placeholder and goes live immediately" },
              ].map((item) => (
                <div key={item.step} className="bg-gray-50 p-5 rounded-2xl border border-gray-100 relative">
                  <span className="absolute top-3 right-3 w-6 h-6 bg-secondary text-white rounded-full flex items-center justify-center text-[9px] font-black">{item.step}</span>
                  <span className="text-2xl block mb-3">{item.icon}</span>
                  <p className="text-xs font-black text-secondary uppercase tracking-wider mb-1">{item.title}</p>
                  <p className="text-[10px] text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* Site Map — all pages and their slots */}
            <div className="mb-8">
              <h3 className="text-sm font-black uppercase text-secondary tracking-wider mb-4 flex items-center gap-2">
                <Layers size={14} className="text-primary" /> Complete Site Image Map
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {pageStats.map((ps) => {
                  const presets = LOCATION_PRESETS[ps.page] || [];
                  return (
                    <div key={ps.page} className="bg-gray-50 rounded-2xl border border-gray-100 p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-black text-secondary uppercase tracking-wider flex items-center gap-2">
                          {ps.emoji} {ps.label}
                        </span>
                        <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${
                          ps.filled === ps.total ? "bg-green-50 text-green-600" : "bg-amber-50 text-amber-600"
                        }`}>
                          {ps.filled}/{ps.total}
                        </span>
                      </div>
                      <div className="space-y-1.5">
                        {presets.map((preset) => {
                          const isFilled = assets.some(a => a.page === ps.page && a.location === preset.key);
                          return (
                            <div key={preset.key} className="flex items-center justify-between text-[10px]">
                              <span className={`flex items-center gap-1.5 ${isFilled ? "text-gray-700 font-bold" : "text-gray-400"}`}>
                                <span className={`w-2 h-2 rounded-full shrink-0 ${isFilled ? "bg-green-500" : "bg-gray-300"}`} />
                                {preset.label}
                              </span>
                              {!isFilled && (
                                <button
                                  onClick={() => openUploadForSlot(ps.page, preset.key)}
                                  className="text-[8px] font-bold text-primary hover:underline"
                                >
                                  Upload
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tips row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
                <p className="text-[10px] font-black text-blue-700 uppercase tracking-wider mb-1">📐 Image Format</p>
                <p className="text-[10px] text-blue-600 leading-relaxed">Only <strong>.webp</strong> files are accepted. Use <a href="https://squoosh.app" target="_blank" rel="noopener noreferrer" className="underline font-bold">squoosh.app</a> to convert images for free.</p>
              </div>
              <div className="bg-green-50 p-4 rounded-2xl border border-green-100">
                <p className="text-[10px] font-black text-green-700 uppercase tracking-wider mb-1">🔍 SEO Alt Text</p>
                <p className="text-[10px] text-green-600 leading-relaxed">Always write descriptive alt text. Example: <em>&quot;Custom 20ft food truck with stainless steel exterior&quot;</em></p>
              </div>
              <div className="bg-purple-50 p-4 rounded-2xl border border-purple-100">
                <p className="text-[10px] font-black text-purple-700 uppercase tracking-wider mb-1">♻️ Replacing Images</p>
                <p className="text-[10px] text-purple-600 leading-relaxed">Uploading to a slot that already has an image will <strong>replace</strong> it. The old file is auto-deleted.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════
          TOOLBAR
         ═══════════════════════════════════════════════════════ */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-3 rounded-2xl border border-gray-100 shadow-sm">
        {/* View Toggle */}
        <div className="flex bg-gray-50 p-1 rounded-xl w-fit">
          <button
            onClick={() => setViewMode("sections")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              viewMode === "sections"
                ? "bg-secondary text-white shadow-md"
                : "text-gray-400 hover:text-secondary"
            }`}
          >
            <Layers size={13} /> By Page
          </button>
          <button
            onClick={() => setViewMode("library")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              viewMode === "library"
                ? "bg-secondary text-white shadow-md"
                : "text-gray-400 hover:text-secondary"
            }`}
          >
            <Grid3X3 size={13} /> Gallery
          </button>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Search */}
          <div className="flex items-center gap-2 bg-gray-50 px-4 py-2.5 rounded-xl focus-within:ring-2 focus-within:ring-primary/20 transition-all">
            <Search size={13} className="text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Search images..."
              className="bg-transparent border-none outline-none w-36 text-xs font-bold placeholder:text-gray-300"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="text-gray-300 hover:text-gray-500 shrink-0">
                <X size={12} />
              </button>
            )}
          </div>

          {/* Page Filter (library mode) */}
          {viewMode === "library" && (
            <select
              value={pageFilter}
              onChange={(e) => setPageFilter(e.target.value)}
              className="bg-gray-50 px-4 py-2.5 rounded-xl text-xs font-bold text-secondary outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            >
              <option value="all">All Pages ({assets.length})</option>
              {allPages.map((p) => {
                const count = assets.filter((a) => a.page === p).length;
                return (
                  <option key={p} value={p}>
                    {PAGE_CONFIG[p]?.emoji} {PAGE_CONFIG[p]?.label} ({count})
                  </option>
                );
              })}
            </select>
          )}

          {/* Expand/Collapse All (sections mode) */}
          {viewMode === "sections" && (
            <button
              onClick={() => {
                if (expandedPages.size === allPages.length) {
                  setExpandedPages(new Set());
                } else {
                  setExpandedPages(new Set(allPages));
                }
              }}
              className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-wider text-gray-400 hover:text-secondary bg-gray-50 px-4 py-2.5 rounded-xl transition-colors"
            >
              {expandedPages.size === allPages.length ? "Collapse All" : "Expand All"}
            </button>
          )}
        </div>
      </div>

      {/* ═══════ STATUS MESSAGE ═══════ */}
      {message && (
        <div
          className={`p-4 rounded-2xl flex items-center justify-between gap-3 shadow-sm ${
            message.type === "success"
              ? "bg-green-50 text-green-700 border border-green-100"
              : "bg-red-50 text-red-700 border border-red-100"
          }`}
        >
          <div className="flex items-center gap-3">
            {message.type === "success" ? <Check size={16} /> : <AlertCircle size={16} />}
            <p className="text-xs font-bold">{message.text}</p>
          </div>
          <button onClick={() => setMessage(null)} className="hover:opacity-70">
            <X size={14} />
          </button>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════
          SECTIONS VIEW — Organized by Page
         ═══════════════════════════════════════════════════════ */}
      {viewMode === "sections" ? (
        <div className="space-y-3">
          {allPages.map((page) => {
            const pageData = hierarchicalMap[page] || {};
            const locations = Object.keys(pageData);
            const totalAssets = locations.reduce((sum, loc) => sum + pageData[loc].length, 0);
            const isExpanded = expandedPages.has(page);
            const cfg = PAGE_CONFIG[page];
            const presets = LOCATION_PRESETS[page] || [];

            return (
              <div
                key={page}
                className={`bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all ${
                  isExpanded ? "ring-1 ring-gray-100" : ""
                }`}
              >
                {/* ── Page Accordion Header ── */}
                <button
                  type="button"
                  onClick={() => togglePage(page)}
                  className={`w-full flex items-center justify-between p-5 hover:bg-gray-50/50 transition-all text-left group`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${cfg.color} flex items-center justify-center text-lg shadow-sm`}>
                      {cfg.emoji}
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-sm font-black uppercase text-secondary tracking-wider">
                          {cfg.label}
                        </h3>
                        <span className={`px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${
                          totalAssets > 0
                            ? "bg-green-50 text-green-600 border border-green-100"
                            : "bg-gray-50 text-gray-400 border border-gray-100"
                        }`}>
                          {totalAssets} {totalAssets === 1 ? "image" : "images"}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-400 font-medium mt-0.5">
                        {cfg.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Link
                      href={page === "home" ? "/" : `/${page}`}
                      target="_blank"
                      onClick={(e) => e.stopPropagation()}
                      className="text-gray-300 hover:text-primary transition-colors p-2 rounded-lg hover:bg-gray-50"
                      title="View live page"
                    >
                      <ArrowUpRight size={14} />
                    </Link>
                    <div className={`p-1.5 rounded-lg transition-all ${isExpanded ? "bg-secondary text-white" : "text-gray-300"}`}>
                      {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </div>
                  </div>
                </button>

                {/* ── Expanded Content ── */}
                {isExpanded && (
                  <div className="border-t border-gray-50">
                    {/* Location Slots Grid */}
                    <div className="p-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {/* Existing images grouped by location */}
                        {locations.map((location) =>
                          pageData[location].map((asset) => {
                            const preset = getPresetForLocation(page, location);
                            return (
                              <div key={asset.id} className="group">
                                {/* Location label */}
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400">
                                    📍 {preset?.label || location.replace(/_/g, " ")}
                                  </span>
                                  <span className="text-[7px] font-black uppercase px-1.5 py-0.5 rounded bg-green-50 text-green-600 border border-green-100">
                                    Uploaded
                                  </span>
                                </div>
                                {/* Image Card */}
                                <div className="relative rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 hover:border-primary/30 hover:shadow-lg transition-all aspect-[4/3]">
                                  <Image
                                    src={asset.url}
                                    alt={asset.alt}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                  />
                                  {/* Hover Overlay */}
                                  <div className="absolute inset-0 bg-gradient-to-t from-secondary/90 via-secondary/40 to-transparent opacity-0 group-hover:opacity-100 transition-all flex flex-col justify-end p-3">
                                    <p className="text-[9px] text-white/80 font-medium truncate mb-2 italic">
                                      &quot;{asset.alt}&quot;
                                    </p>
                                    <div className="flex gap-1.5">
                                      <button
                                        onClick={() => setPreviewAsset(asset)}
                                        className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-white/90 text-secondary rounded-xl text-[8px] font-bold uppercase tracking-wider hover:bg-white transition-all"
                                      >
                                        <Eye size={10} /> View
                                      </button>
                                      <button
                                        onClick={() => setEditingAsset(asset)}
                                        className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-white/90 text-secondary rounded-xl text-[8px] font-bold uppercase tracking-wider hover:bg-white transition-all"
                                      >
                                        <Edit2 size={10} /> Edit
                                      </button>
                                      <button
                                        onClick={() => openUploadForSlot(page, location)}
                                        className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-primary/90 text-secondary rounded-xl text-[8px] font-bold uppercase tracking-wider hover:bg-primary transition-all"
                                      >
                                        <RefreshCw size={10} /> Replace
                                      </button>
                                      <button
                                        onClick={() => setDeleteConfirm(asset.id)}
                                        className="flex items-center justify-center py-2 px-3 bg-red-500/90 text-white rounded-xl hover:bg-red-500 transition-all"
                                        title="Delete"
                                      >
                                        <Trash2 size={10} />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        )}

                        {/* Empty Preset Slots — show as dotted placeholders */}
                        {presets
                          .filter((p) => !locations.includes(p.key) || !pageData[p.key]?.length)
                          .filter((p) => !assets.some((a) => a.page === page && a.location === p.key))
                          .map((preset) => (
                            <div key={preset.key}>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-[9px] font-bold uppercase tracking-widest text-gray-300">
                                  📍 {preset.label}
                                </span>
                                <span className="text-[7px] font-black uppercase px-1.5 py-0.5 rounded bg-amber-50 text-amber-500 border border-amber-100">
                                  Default
                                </span>
                              </div>
                              <button
                                onClick={() => openUploadForSlot(page, preset.key)}
                                className="w-full aspect-[4/3] bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center hover:border-primary hover:bg-primary/5 transition-all group/slot cursor-pointer"
                              >
                                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center mb-2 group-hover/slot:bg-primary/10 transition-colors">
                                  <Upload size={16} className="text-gray-300 group-hover/slot:text-primary transition-colors" />
                                </div>
                                <span className="text-[9px] font-bold uppercase tracking-wider text-gray-300 group-hover/slot:text-primary">
                                  Upload Image
                                </span>
                                <span className="text-[8px] text-gray-300 mt-0.5 font-mono">
                                  Recommended: {preset.size}
                                </span>
                              </button>
                            </div>
                          ))}
                      </div>
                    </div>

                    {/* Quick Upload Bar */}
                    {totalAssets === 0 && presets.length === 0 && (
                      <div className="px-5 pb-5">
                        <button
                          onClick={() => openUploadForSlot(page, "")}
                          className="w-full py-4 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl text-center hover:border-primary hover:bg-primary/5 transition-all"
                        >
                          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                            + Upload First Image for {cfg.label}
                          </span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* ═══════════════════════════════════════════════════════
            GALLERY VIEW — All Images
           ═══════════════════════════════════════════════════════ */
        <div>
          {filteredAssets.length === 0 ? (
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-16 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ImageIcon size={28} className="text-gray-300" />
              </div>
              <h3 className="text-xl font-black uppercase text-secondary tracking-tight mb-2">
                {searchQuery || pageFilter !== "all" ? "No Matches Found" : "No Images Uploaded"}
              </h3>
              <p className="text-sm text-gray-400 mb-6">
                {searchQuery ? "Try different search terms or clear filters" : "Upload your first image to get started"}
              </p>
              {!searchQuery && (
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="inline-flex items-center gap-2 bg-secondary text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-secondary transition-all"
                >
                  <Upload size={14} /> Upload Image
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredAssets.map((asset) => {
                const cfg = PAGE_CONFIG[asset.page];
                const preset = getPresetForLocation(asset.page, asset.location);
                return (
                  <div key={asset.id} className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg hover:border-primary/20 transition-all">
                    {/* Image */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                      <Image src={asset.url} alt={asset.alt} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                      {/* Hover */}
                      <div className="absolute inset-0 bg-secondary/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-2">
                        <button onClick={() => setPreviewAsset(asset)} className="p-2.5 bg-white text-secondary rounded-xl hover:bg-primary hover:scale-110 transition-all shadow-lg" title="Preview">
                          <Eye size={14} />
                        </button>
                        <button onClick={() => setEditingAsset(asset)} className="p-2.5 bg-white text-secondary rounded-xl hover:bg-primary hover:scale-110 transition-all shadow-lg" title="Edit">
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => setDeleteConfirm(asset.id)} className="p-2.5 bg-red-500 text-white rounded-xl hover:bg-red-600 hover:scale-110 transition-all shadow-lg" title="Delete">
                          <Trash2 size={14} />
                        </button>
                      </div>
                      {/* Page Badge */}
                      <div className="absolute top-2 left-2">
                        <span className="bg-secondary/80 backdrop-blur-md text-primary px-2 py-0.5 rounded-lg text-[7px] font-black uppercase tracking-widest">
                          {cfg?.emoji} {cfg?.label}
                        </span>
                      </div>
                    </div>
                    {/* Info */}
                    <div className="p-3">
                      <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">
                        {preset?.label || asset.location.replace(/_/g, " ")}
                      </p>
                      <p className="text-[9px] text-gray-400 truncate italic">{asset.alt}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════
          UPLOAD MODAL
         ═══════════════════════════════════════════════════════ */}
      {showUploadModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md bg-secondary/40">
          <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-8 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-primary font-bold tracking-widest uppercase text-[10px] flex items-center gap-2">
                    <Camera size={12} /> Media Manager
                  </span>
                  <h2 className="text-2xl font-black uppercase text-secondary tracking-tighter mt-1">
                    Upload New Image
                  </h2>
                </div>
                <button
                  onClick={() => { setShowUploadModal(false); setUploadPreview(null); setUploadFileName(""); }}
                  className="p-2.5 bg-gray-50 text-gray-400 rounded-xl hover:bg-red-50 hover:text-red-500 transition-all"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleUpload} className="space-y-5">
                {/* Step 1: File */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-6 h-6 bg-secondary text-white rounded-full flex items-center justify-center text-[10px] font-black">1</span>
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Choose your image</label>
                  </div>
                  <div className="relative">
                    <input
                      type="file"
                      name="image"
                      required
                      accept="image/webp,.webp"
                      onChange={handleFilePreview}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    {uploadPreview ? (
                      <div className="border-2 border-primary rounded-2xl p-3 bg-primary/5 flex items-center gap-4">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={uploadPreview} alt="Preview" className="w-20 h-20 rounded-xl object-cover shadow-md ring-2 ring-primary/20" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-secondary flex items-center gap-2">
                            <Check size={14} className="text-green-500" /> Image Selected
                          </p>
                          <p className="text-[10px] text-gray-400 truncate mt-0.5">{uploadFileName}</p>
                          <p className="text-[9px] text-primary font-medium mt-1">Click to change</p>
                        </div>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center hover:border-primary hover:bg-primary/5 transition-all cursor-pointer group">
                        <Upload size={28} className="mx-auto text-gray-300 mb-3 group-hover:text-primary transition-colors" />
                        <p className="text-xs font-bold text-gray-500">Click or drag & drop your WebP image here</p>
                        <p className="text-[10px] text-gray-400 mt-1.5">Only <strong>.webp</strong> files are accepted</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Step 2: Where does it go? */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-6 h-6 bg-secondary text-white rounded-full flex items-center justify-center text-[10px] font-black">2</span>
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Where should this image appear?</label>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-gray-400 ml-1">Page</label>
                      <select
                        name="page"
                        value={uploadPage}
                        onChange={(e) => { setUploadPage(e.target.value); setUploadLocation(""); }}
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-secondary outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                      >
                        {allPages.map((p) => (
                          <option key={p} value={p}>{PAGE_CONFIG[p]?.emoji} {PAGE_CONFIG[p]?.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-gray-400 ml-1">Location on page</label>
                      <input
                        name="location"
                        value={uploadLocation}
                        onChange={(e) => setUploadLocation(e.target.value)}
                        placeholder="Choose below or type..."
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-secondary outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-gray-300 placeholder:font-medium"
                      />
                    </div>
                  </div>

                  {/* Location Presets */}
                  {LOCATION_PRESETS[uploadPage] && (
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-[8px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                        Available image slots for {PAGE_CONFIG[uploadPage]?.label}:
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {LOCATION_PRESETS[uploadPage].map((preset) => {
                          const already = assets.some((a) => a.page === uploadPage && a.location === preset.key);
                          return (
                            <button
                              key={preset.key}
                              type="button"
                              onClick={() => setUploadLocation(preset.key)}
                              className={`flex items-center justify-between px-3 py-2 rounded-lg text-left transition-all ${
                                uploadLocation === preset.key
                                  ? "bg-primary/10 border border-primary text-primary ring-1 ring-primary/20"
                                  : "bg-white border border-gray-100 text-gray-600 hover:border-primary/30"
                              }`}
                            >
                              <div>
                                <span className="text-[9px] font-bold block">{preset.label}</span>
                                <span className="text-[8px] text-gray-400 font-mono">{preset.size}</span>
                              </div>
                              {already && (
                                <span className="text-[7px] font-bold uppercase text-amber-500 bg-amber-50 px-1.5 py-0.5 rounded">
                                  Replace
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Step 3: Details */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-6 h-6 bg-secondary text-white rounded-full flex items-center justify-center text-[10px] font-black">3</span>
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Image details</label>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-gray-400 ml-1">Alt Text / Description (SEO — Required)</label>
                      <input
                        name="alt"
                        required
                        placeholder="e.g. Custom food truck exterior shot showing stainless steel build"
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-gray-300 placeholder:font-medium"
                      />
                      <p className="text-[8px] text-gray-400 ml-1">This text appears when the image can&apos;t load and helps with Google SEO rankings.</p>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-gray-400 ml-1">Dimensions (optional)</label>
                      <input
                        name="dimensions"
                        placeholder={
                          LOCATION_PRESETS[uploadPage]?.find((p) => p.key === uploadLocation)?.size || "e.g. 1920x1080"
                        }
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-gray-300 placeholder:font-medium"
                      />
                    </div>
                  </div>
                </div>

                {/* Slot replacement notice */}
                {isReplacingSlot && (
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3">
                    <AlertCircle size={16} className="text-amber-500 shrink-0" />
                    <p className="text-xs font-bold text-amber-700">
                      This slot already has an image. Uploading will <strong>replace</strong> the existing image on the live website.
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isUploading}
                  className="w-full bg-primary text-secondary py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-secondary hover:text-white transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-3 active:scale-[0.98]"
                >
                  {isUploading ? (
                    <><RefreshCw className="animate-spin" size={16} /> {uploadProgress || "Uploading..."}</>
                  ) : (
                    <><Upload size={16} /> {isReplacingSlot ? "Replace Image" : "Upload Image"}</>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════
          EDIT MODAL
         ═══════════════════════════════════════════════════════ */}
      {editingAsset && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md bg-secondary/40">
          <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-primary font-bold tracking-widest uppercase text-[10px]">Media Manager</span>
                  <h2 className="text-2xl font-black uppercase text-secondary tracking-tighter mt-1">Edit Image Details</h2>
                </div>
                <button onClick={() => setEditingAsset(null)} className="p-2.5 bg-gray-50 text-gray-400 rounded-xl hover:bg-red-50 hover:text-red-500 transition-all">
                  <X size={18} />
                </button>
              </div>

              {/* Preview */}
              <div className="rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shadow-sm">
                <div className="relative aspect-video">
                  <Image src={editingAsset.url} alt={editingAsset.alt} fill className="object-cover" />
                </div>
              </div>

              <form onSubmit={handleEdit} className="space-y-4">
                <input type="hidden" name="id" value={editingAsset.id} />
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-gray-400 ml-1">Page</label>
                    <select name="page" defaultValue={editingAsset.page} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-secondary outline-none focus:border-primary transition-all">
                      {allPages.map((p) => (<option key={p} value={p}>{PAGE_CONFIG[p]?.emoji} {PAGE_CONFIG[p]?.label}</option>))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-gray-400 ml-1">Location</label>
                    <input name="location" defaultValue={editingAsset.location} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-primary transition-all" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-gray-400 ml-1">Description (SEO)</label>
                    <input name="alt" required defaultValue={editingAsset.alt} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-primary transition-all" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-gray-400 ml-1">Dimensions</label>
                    <input name="dimensions" defaultValue={editingAsset.dimensions} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-primary transition-all" />
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="submit" disabled={isUploading} className="flex-1 bg-primary text-secondary py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-secondary hover:text-white transition-all shadow-xl flex items-center justify-center gap-3">
                    {isUploading ? <RefreshCw className="animate-spin" size={14} /> : <Check size={14} />}
                    {isUploading ? "Saving..." : "Save Changes"}
                  </button>
                  <button type="button" onClick={() => { setDeleteConfirm(editingAsset.id); setEditingAsset(null); }} className="px-6 py-4 bg-red-50 text-red-500 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-red-500 hover:text-white transition-all flex items-center gap-2">
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════
          PREVIEW LIGHTBOX
         ═══════════════════════════════════════════════════════ */}
      {previewAsset && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-xl bg-black/80 cursor-pointer" onClick={() => setPreviewAsset(null)}>
          <div className="relative max-w-5xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="relative aspect-video bg-gray-50">
              <Image src={previewAsset.url} alt={previewAsset.alt} fill className="object-contain" />
            </div>
            <div className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-t border-gray-100">
              <div>
                <p className="text-sm font-bold text-secondary">{previewAsset.alt}</p>
                <p className="text-[10px] text-gray-400 font-medium mt-0.5 flex items-center gap-2 flex-wrap">
                  <span>{PAGE_CONFIG[previewAsset.page]?.emoji} {PAGE_CONFIG[previewAsset.page]?.label}</span>
                  <span>·</span>
                  <span>📍 {getPresetForLocation(previewAsset.page, previewAsset.location)?.label || previewAsset.location.replace(/_/g, " ")}</span>
                  {previewAsset.dimensions && <><span>·</span><span>📐 {previewAsset.dimensions}</span></>}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => copyUrl(previewAsset.url)} className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-gray-400 hover:text-primary transition-colors bg-gray-50 px-4 py-2.5 rounded-xl">
                  <Copy size={12} /> Copy URL
                </button>
                <button onClick={() => { setEditingAsset(previewAsset); setPreviewAsset(null); }} className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-gray-400 hover:text-blue-600 transition-colors bg-gray-50 px-4 py-2.5 rounded-xl">
                  <Edit2 size={12} /> Edit
                </button>
                <button onClick={() => setPreviewAsset(null)} className="p-2.5 bg-gray-50 text-gray-400 rounded-xl hover:bg-red-50 hover:text-red-500 transition-all">
                  <X size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════
          DELETE CONFIRMATION MODAL
         ═══════════════════════════════════════════════════════ */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 backdrop-blur-md bg-secondary/40">
          <div className="bg-white rounded-3xl w-full max-w-sm p-8 text-center shadow-2xl">
            <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Trash2 size={24} className="text-red-500" />
            </div>
            <h3 className="text-xl font-black uppercase text-secondary tracking-tight mb-2">Delete Image?</h3>
            <p className="text-sm text-gray-400 mb-6">This will permanently remove the image from your library. The website will fall back to the default placeholder.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-3 bg-gray-100 text-secondary rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-gray-200 transition-all">
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 py-3 bg-red-500 text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-red-600 transition-all">
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

