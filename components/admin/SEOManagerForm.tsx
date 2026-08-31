"use client";

import React, { useState, useMemo } from"react";
import {
 Save,
 Search,
 Globe,
 FileText,
 Image as ImageIcon,
 Plus,
 Trash2,
 ShieldCheck,
 Zap,
 Layout,
 Code2,
 AlertCircle,
 Hash,
 Eye,
 ChevronDown,
 ChevronRight,
 CheckCircle2,
 XCircle,
 ExternalLink,
 Copy,
 RotateCcw,
 Sparkles,
 Settings2,
 Layers,
 PanelLeftClose,
 PanelLeftOpen,
} from"lucide-react";
import Toast from"@/components/ui/Toast";
import { SEOSettings } from"@/lib/db";

interface SEOManagerFormProps {
 seo: SEOSettings;
 pages: { id: string; name: string }[];
}

// ─── Reusable: Field Label ───
const FieldLabel = ({
 label,
 count,
 max,
 hint,
}: {
 label: string;
 count?: number;
 max?: number;
 hint?: string;
}) => (
 <div className="flex items-center justify-between mb-2">
 <label className="text-[11px] font-bold uppercase tracking-wider text-admin-muted">
 {label}
 </label>
 <div className="flex items-center gap-3">
 {hint && (
 <span className="text-[10px] text-admin-muted font-medium">{hint}</span>
 )}
 {count !== undefined && max !== undefined && (
 <span
 className={`text-[10px] font-bold tabular-nums ${count > max ?"text-red-500" : count > max * 0.8 ?"text-amber-500" :"text-admin-muted"}`}
 >
 {count}/{max}
 </span>
 )}
 </div>
 </div>
);

// ─── SERP Preview Component ───
const SERPPreview = ({
 title,
 description,
 path,
 canonical,
}: {
 title: string;
 description: string;
 path: string;
 canonical: string;
}) => {
 const baseUrl = canonical ||"https://elitesteelconcepts.com";
 const displayUrl = `${baseUrl}${path ==="/" ?"" : `/${path}`}`;
 return (
 <div className="bg-admin-surface border border-admin-border p-6 shadow-sm">
 <div className="flex items-center gap-2 mb-3">
 <Eye size={14} className="text-admin-muted" />
 <span className="text-[10px] font-bold uppercase tracking-widest text-admin-muted">
 Google SERP Preview
 </span>
 </div>
 <div className="space-y-1">
 <div className="text-[13px] text-green-700 font-medium truncate">
 {displayUrl}
 </div>
 <h3 className="text-lg text-blue-700 font-medium leading-snug line-clamp-1 hover:underline cursor-pointer">
 {title ||"Page Title — Elite Steel Concepts"}
 </h3>
 <p className="text-[13px] text-admin-muted line-clamp-2 leading-relaxed">
 {description ||
"Add a meta description to control how this page appears in search results..."}
 </p>
 </div>
 </div>
 );
};

const SEOManagerForm = ({ seo, pages }: SEOManagerFormProps) => {
 const [loading, setLoading] = useState(false);
 const [showToast, setShowToast] = useState(false);
 const [toastMsg, setToastMsg] = useState("");
 const [activeTab, setActiveTab] = useState(pages[0].id);
 const [activeSubTab, setActiveSubTab] = useState<"meta" |"content" |"tech">("meta");
 const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
 const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({});

 // ─── State Management ───
 const [imageAltsState, setImageAltsState] = useState<{
 [key: string]: { [key: string]: string };
 }>(() => {
 const initial: { [key: string]: { [key: string]: string } } = {};
 pages.forEach((p) => {
 initial[p.id] = seo.pages?.[p.id]?.imageAlts || {};
 });
 return initial;
 });

 const [sectionsState, setSectionsState] = useState<{
 [key: string]: { [key: string]: any };
 }>(() => {
 const initial: { [key: string]: { [key: string]: any } } = {};
 pages.forEach((p) => {
 initial[p.id] = seo.pages?.[p.id]?.sections || {};
 });
 return initial;
 });

 const [structuredDataState, setStructuredDataState] = useState<{
 [key: string]: string;
 }>(() => {
 const initial: { [key: string]: string } = {};
 pages.forEach((p) => {
 initial[p.id] = seo.pages?.[p.id]?.structuredData ||"";
 });
 return initial;
 });

 const [metaState, setMetaState] = useState<{
 [key: string]: { title: string; description: string; keywords: string };
 }>(() => {
 const initial: {
 [key: string]: { title: string; description: string; keywords: string };
 } = {};
 pages.forEach((p) => {
 const pData = seo.pages?.[p.id] || {};
 initial[p.id] = {
 title: pData.title ||"",
 description: pData.description ||"",
 keywords: pData.keywords ||"",
 };
 });
 return initial;
 });

 // ─── Alt Handlers ───
 const [newAltKeys, setNewAltKeys] = useState<{ [key: string]: string }>({});

 const handleAddAlt = (pageId: string) => {
 const key = newAltKeys[pageId];
 if (!key) return;
 setImageAltsState((prev) => ({
 ...prev,
 [pageId]: { ...prev[pageId], [key]:"" },
 }));
 setNewAltKeys((prev) => ({ ...prev, [pageId]:"" }));
 };

 const handleRemoveAlt = (pageId: string, altKey: string) => {
 setImageAltsState((prev) => {
 const newState = { ...prev };
 const newPageAlts = { ...newState[pageId] };
 delete newPageAlts[altKey];
 newState[pageId] = newPageAlts;
 return newState;
 });
 };

 const handleAltChange = (
 pageId: string,
 altKey: string,
 value: string
 ) => {
 setImageAltsState((prev) => ({
 ...prev,
 [pageId]: { ...prev[pageId], [altKey]: value },
 }));
 };

 // ─── Section Handlers ───
 const [newSectionKeys, setNewSectionKeys] = useState<{
 [key: string]: string;
 }>({});

 const handleAddSection = (pageId: string) => {
 const key = newSectionKeys[pageId];
 if (!key) return;
 setSectionsState((prev) => ({
 ...prev,
 [pageId]: {
 ...prev[pageId],
 [key]: { title:"", subtitle:"", content:"", ctaText:"" },
 },
 }));
 setNewSectionKeys((prev) => ({ ...prev, [pageId]:"" }));
 setExpandedSections((prev) => ({ ...prev, [`${pageId}_${key}`]: true }));
 };

 const handleRemoveSection = (pageId: string, sectionKey: string) => {
 if (
 !confirm(
 `Delete section '${sectionKey}'? This will remove its content override.`
 )
 )
 return;
 setSectionsState((prev) => {
 const newState = { ...prev };
 const newPageSections = { ...newState[pageId] };
 delete newPageSections[sectionKey];
 newState[pageId] = newPageSections;
 return newState;
 });
 };

 const handleSectionFieldChange = (
 pageId: string,
 sectionKey: string,
 field: string,
 value: string
 ) => {
 setSectionsState((prev) => ({
 ...prev,
 [pageId]: {
 ...prev[pageId],
 [sectionKey]: {
 ...prev[pageId][sectionKey],
 [field]: value,
 },
 },
 }));
 };

 const handleStructuredDataChange = (pageId: string, value: string) => {
 setStructuredDataState((prev) => ({
 ...prev,
 [pageId]: value,
 }));
 };

 const handleMetaFieldChange = (
 pageId: string,
 field:"title" |"description" |"keywords",
 value: string
 ) => {
 setMetaState((prev) => ({
 ...prev,
 [pageId]: {
 ...prev[pageId],
 [field]: value,
 },
 }));
 };

 const toggleSectionExpand = (key: string) => {
 setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
 };

 // ─── Submit Handlers ───
 const handleGlobalSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
 e.preventDefault();
 setLoading(true);
 const formData = new FormData(e.currentTarget);
 const { saveGlobalSEO } = await import("@/app/actions/settings");
 const result = await saveGlobalSEO(formData);
 if (result?.success) {
 setToastMsg(result.message);
 setShowToast(true);
 }
 setLoading(false);
 };

 const handlePageSubmit = async (
 pageId: string,
 e: React.FormEvent<HTMLFormElement>
 ) => {
 e.preventDefault();
 setLoading(true);
 const formData = new FormData(e.currentTarget);

 const alts = imageAltsState[pageId] || {};
 Object.entries(alts).forEach(([key, val]) => {
 formData.append(`page_${pageId}_alt_${key}`, val);
 });

 const sections = sectionsState[pageId] || {};
 Object.entries(sections).forEach(([secKey, secData]) => {
 Object.entries(secData).forEach(([field, val]) => {
 formData.append(
 `page_${pageId}_section_${secKey}_${field}`,
 val as string
 );
 });
 });

 const meta = metaState[pageId] || {
 title:"",
 description:"",
 keywords:"",
 };
 formData.append(`page_${pageId}_title`, meta.title);
 formData.append(`page_${pageId}_description`, meta.description);
 formData.append(`page_${pageId}_keywords`, meta.keywords);
 formData.append(
 `page_${pageId}_structuredData`,
 structuredDataState[pageId] ||""
 );

 const { savePageSEO } = await import("@/app/actions/settings");
 const result = await savePageSEO(pageId, formData);
 if (result?.success) {
 setToastMsg(result.message);
 setShowToast(true);
 }
 setLoading(false);
 };

 // ─── Computed ───
 const score = useMemo(() => {
 let s = 50;
 if (seo.siteTitle) s += 10;
 if (seo.description) s += 10;
 if (seo.keywords) s += 5;
 if (seo.ogImage) s += 10;
 if (seo.canonicalUrl) s += 10;
 if (seo.robotsTxt) s += 5;
 // Check page completeness
 const activeMeta = metaState[activeTab];
 if (activeMeta?.title) s += 5;
 if (activeMeta?.description) s += 5;
 return Math.min(s, 100);
 }, [seo, metaState, activeTab]);

 const getPageStatus = (pageId: string) => {
 const meta = metaState[pageId];
 if (meta?.title && meta?.description) return"complete";
 if (meta?.title || meta?.description) return"partial";
 return"empty";
 };

 const activePage = pages.find((p) => p.id === activeTab);

 return (
 <>
 {showToast && (
 <Toast message={toastMsg} onClose={() => setShowToast(false)} />
 )}

 <div className="space-y-8 pb-24">
 {/* ═══════ TOP DASHBOARD BAR ═══════ */}
 <div className="bg-admin-surface p-8 md:p-10 text-admin-text shadow-2xl relative overflow-hidden">
 <div className="absolute top-0 right-0 w-80 h-80 bg-primary/20 blur-[100px] -mr-40 -mt-40 -full"></div>
 <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
 <div className="space-y-3">
 <div className="flex items-center gap-3 bg-admin-surface/5 w-fit px-4 py-1.5 -full border border-white/10">
 <Zap size={12} className="text-primary" />
 <span className="text-[10px] font-black uppercase tracking-widest text-primary">
 SEO Control Center v3.0
 </span>
 </div>
 <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter flex items-center gap-4">
 <ShieldCheck className="text-primary" size={36} />
 SEO & Content Master
 </h1>
 <p className="text-admin-muted max-w-lg text-sm font-light leading-relaxed">
 Manage metadata, page content, structured data, and image
 accessibility across your entire site from one console.
 </p>
 </div>

 <div className="flex gap-6 items-center bg-admin-surface/5 p-6 border border-white/10 backdrop-blur-md">
 <div className="text-center">
 <div className="text-[10px] font-black uppercase text-admin-muted mb-1 tracking-widest">
 Health
 </div>
 <div
 className={`text-4xl font-black ${score > 90 ?"text-green-400" : score > 70 ?"text-primary" :"text-amber-400"}`}
 >
 {score}%
 </div>
 </div>
 <div className="h-12 w-px bg-admin-surface/10"></div>
 <div className="space-y-2">
 <div className="flex items-center gap-2">
 <div className="w-1.5 h-1.5 -full bg-green-500 animate-pulse"></div>
 <span className="text-[10px] font-bold uppercase tracking-widest text-gray-300">
 {pages.filter((p) => getPageStatus(p.id) ==="complete").length}/{pages.length} Pages Optimized
 </span>
 </div>
 <div className="flex items-center gap-2">
 <div className="w-1.5 h-1.5 -full bg-primary"></div>
 <span className="text-[10px] font-bold uppercase tracking-widest text-gray-300">
 Live Sync Active
 </span>
 </div>
 </div>
 </div>
 </div>
 </div>

 {/* ═══════ MAIN 3-PANEL LAYOUT ═══════ */}
 <div className="flex gap-6 min-h-[900px]">
 {/* ────── LEFT SIDEBAR: Pages + Global ────── */}
 <div
 className={`transition-all duration-300 shrink-0 ${sidebarCollapsed ?"w-16" :"w-72"}`}
 >
 <div className="sticky top-4 space-y-6">
 {/* Collapse Toggle */}
 <button
 type="button"
 onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
 className="w-full flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest text-admin-muted hover:text-admin-text transition-colors py-2"
 >
 {sidebarCollapsed ? (
 <PanelLeftOpen size={16} />
 ) : (
 <>
 <PanelLeftClose size={16} /> Collapse
 </>
 )}
 </button>

 {/* Page Navigator */}
 <div className="bg-admin-surface border border-admin-border shadow-sm overflow-hidden">
 {!sidebarCollapsed && (
 <div className="p-4 border-b border-admin-border-hover">
 <h3 className="text-[10px] font-black uppercase tracking-widest text-admin-muted flex items-center gap-2">
 <Layers size={12} className="text-primary" />
 Page Routes
 </h3>
 </div>
 )}
 <div className="p-2 space-y-1">
 {pages.map((page) => {
 const status = getPageStatus(page.id);
 const isActive = activeTab === page.id;
 return (
 <button
 key={page.id}
 type="button"
 onClick={() => {
 setActiveTab(page.id);
 setActiveSubTab("meta");
 }}
 className={`w-full flex items-center gap-3 transition-all text-left ${
 isActive
 ?"bg-admin-surface text-admin-text shadow-lg"
 :"hover:bg-admin-bg text-admin-muted"
 } ${sidebarCollapsed ?"p-3 justify-center" :"px-4 py-3"}`}
 title={page.name}
 >
 <div
 className={`w-2 h-2 -full shrink-0 ${
 status ==="complete"
 ?"bg-green-500"
 : status ==="partial"
 ?"bg-amber-400"
 : isActive
 ?"bg-admin-surface/30"
 :"bg-gray-200"
 }`}
 />
 {!sidebarCollapsed && (
 <>
 <span className="text-xs font-bold truncate flex-1">
 {page.name}
 </span>
 <span
 className={`text-[9px] font-mono ${isActive ?"text-admin-text/40" :"text-gray-300"}`}
 >
 /{page.id ==="home" ?"" : page.id}
 </span>
 </>
 )}
 </button>
 );
 })}
 </div>
 </div>

 {/* Global SEO Form */}
 {!sidebarCollapsed && (
 <form
 onSubmit={handleGlobalSubmit}
 className="bg-admin-surface border border-admin-border shadow-sm overflow-hidden"
 >
 <div className="p-4 border-b border-admin-border-hover">
 <h3 className="text-[10px] font-black uppercase tracking-widest text-admin-muted flex items-center gap-2">
 <Globe size={12} className="text-primary" />
 Global Config
 </h3>
 </div>
 <div className="p-4 space-y-4">
 <div>
 <FieldLabel label="Site Title" />
 <input
 type="text"
 name="siteTitle"
 defaultValue={seo.siteTitle}
 className="w-full bg-admin-bg border border-admin-border p-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all text-sm font-bold text-admin-text"
 />
 </div>
 <div>
 <FieldLabel label="Meta Description" />
 <textarea
 rows={3}
 name="description"
 defaultValue={seo.description}
 className="w-full bg-admin-bg border border-admin-border p-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all text-xs font-medium resize-none leading-relaxed"
 />
 </div>
 <div>
 <FieldLabel label="Keywords" />
 <textarea
 rows={2}
 name="keywords"
 defaultValue={seo.keywords}
 className="w-full bg-admin-bg border border-admin-border p-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all text-xs font-medium resize-none"
 />
 </div>
 <div>
 <FieldLabel label="Canonical URL" />
 <input
 type="text"
 name="canonicalUrl"
 defaultValue={seo.canonicalUrl}
 className="w-full bg-admin-bg border border-admin-border p-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all text-xs font-bold"
 />
 </div>
 <div>
 <FieldLabel label="OG Image URL" />
 <input
 type="text"
 name="ogImage"
 defaultValue={seo.ogImage}
 className="w-full bg-admin-bg border border-admin-border p-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all text-xs font-bold"
 />
 </div>
 <div className="space-y-3 pt-2">
 <button
 type="submit"
 disabled={loading}
 className="w-full bg-admin-surface text-admin-text p-3.5 font-black uppercase text-[10px] tracking-widest hover:bg-primary hover:text-admin-text transition-all flex items-center justify-center gap-3 shadow-lg disabled:opacity-50 border border-admin-border"
 >
 <Save
 size={14}
 className={loading ?"animate-spin" :""}
 />
 {loading ?"Syncing..." :"Save Global"}
 </button>

 <button
 type="button"
 disabled={loading}
 onClick={async () => {
 setLoading(true);
 const { updateSitemap } = await import("@/app/actions/settings");
 const result = await updateSitemap();
 if (result?.success) {
 setToastMsg(result.message);
 setShowToast(true);
 }
 setLoading(false);
 }}
 className="w-full bg-admin-surface text-admin-text p-3.5 font-black uppercase text-[10px] tracking-widest hover:bg-green-600 hover:text-white transition-all flex items-center justify-center gap-3 shadow-lg disabled:opacity-50 border border-admin-border"
 >
 <RotateCcw
 size={14}
 className={loading ?"animate-spin" :""}
 />
 Update Sitemap
 </button>
 </div>
 </div>
 </form>
 )}
 </div>
 </div>

 {/* ────── CENTER PANEL: Page Editor ────── */}
 <div className="flex-1 min-w-0">
 {pages.map((page) => {
 if (activeTab !== page.id) return null;

 return (
 <form
 key={page.id}
 onSubmit={(e) => handlePageSubmit(page.id, e)}
 className="space-y-6"
 >
 {/* Page Header Bar */}
 <div className="bg-admin-surface border border-admin-border shadow-sm p-6">
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
 <div className="flex items-center gap-4">
 <div className="w-12 h-12 bg-admin-surface text-primary flex items-center justify-center font-black text-lg">
 {page.name.charAt(0)}
 </div>
 <div>
 <h2 className="text-2xl font-black uppercase text-admin-text tracking-tight">
 {page.name}
 </h2>
 <div className="flex items-center gap-3 mt-1">
 <span className="text-[10px] text-admin-muted font-mono bg-admin-bg px-2 py-0.5">
 /{page.id ==="home" ?"" : page.id}
 </span>
 {getPageStatus(page.id) ==="complete" ? (
 <span className="flex items-center gap-1 text-[10px] font-bold text-green-600">
 <CheckCircle2 size={10} /> Optimized
 </span>
 ) : getPageStatus(page.id) ==="partial" ? (
 <span className="flex items-center gap-1 text-[10px] font-bold text-amber-500">
 <AlertCircle size={10} /> Partial
 </span>
 ) : (
 <span className="flex items-center gap-1 text-[10px] font-bold text-admin-muted">
 <XCircle size={10} /> Needs Setup
 </span>
 )}
 </div>
 </div>
 </div>

 {/* Tab Switcher */}
 <div className="flex bg-gray-100 p-1">
 {[
 { key:"meta", label:"Meta & SEO", icon: Search },
 { key:"content", label:"Content", icon: Layout },
 { key:"tech", label:"Schema", icon: Code2 },
 ].map((tab) => (
 <button
 key={tab.key}
 type="button"
 onClick={() =>
 setActiveSubTab(
 tab.key as"meta" |"content" |"tech"
 )
 }
 className={`flex items-center gap-2 px-5 py-2.5 text-[10px] font-bold uppercase tracking-wider transition-all ${
 activeSubTab === tab.key
 ?"bg-admin-surface text-admin-text shadow-sm"
 :"text-admin-muted hover:text-admin-text"
 }`}
 >
 <tab.icon size={14} />
 <span className="hidden sm:inline">{tab.label}</span>
 </button>
 ))}
 </div>
 </div>
 </div>

 {/* ═══ META & SEO TAB ═══ */}
 {activeSubTab ==="meta" && (
 <div className="space-y-6 animate-in fade-in duration-300">
 {/* SERP Preview */}
 <SERPPreview
 title={
 metaState[page.id]?.title || `${page.name} | Elite Steel Concepts`
 }
 description={
 metaState[page.id]?.description || seo.description
 }
 path={page.id ==="home" ?"/" : page.id}
 canonical={seo.canonicalUrl}
 />

 {/* Meta Fields */}
 <div className="bg-admin-surface border border-admin-border shadow-sm p-6 space-y-6">
 <div className="flex items-center gap-3 pb-4 border-b border-admin-border-hover">
 <div className="p-2 bg-blue-50 text-blue-600">
 <FileText size={18} />
 </div>
 <div>
 <h3 className="text-sm font-black uppercase text-admin-text tracking-wider">
 Page Metadata
 </h3>
 <p className="text-[10px] text-admin-muted font-medium">
 Controls how this page appears in search engines
 </p>
 </div>
 </div>

 <div>
 <FieldLabel
 label="Custom Page Title"
 count={metaState[page.id]?.title?.length || 0}
 max={60}
 hint="Ideal: 50-60 chars"
 />
 <input
 type="text"
 value={metaState[page.id]?.title ||""}
 onChange={(e) =>
 handleMetaFieldChange(
 page.id,
"title",
 e.target.value
 )
 }
 placeholder={`${page.name} | Elite Steel Concepts`}
 className="w-full bg-admin-bg border border-admin-border p-4 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all font-bold text-admin-text text-base"
 />
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
 <div>
 <FieldLabel
 label="Meta Description"
 count={
 metaState[page.id]?.description?.length || 0
 }
 max={160}
 hint="Ideal: 150-160 chars"
 />
 <textarea
 rows={5}
 value={metaState[page.id]?.description ||""}
 onChange={(e) =>
 handleMetaFieldChange(
 page.id,
"description",
 e.target.value
 )
 }
 placeholder="Write a compelling description for search results..."
 className="w-full bg-admin-bg border border-admin-border p-4 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all text-sm font-medium leading-relaxed resize-none"
 />
 </div>

 <div>
 <FieldLabel
 label="Strategic Keywords"
 hint="Comma-separated"
 />
 <textarea
 rows={5}
 value={metaState[page.id]?.keywords ||""}
 onChange={(e) =>
 handleMetaFieldChange(
 page.id,
"keywords",
 e.target.value
 )
 }
 placeholder="food truck builder, custom food trailer, mobile kitchen..."
 className="w-full bg-admin-bg border border-admin-border p-4 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all text-sm font-medium resize-none leading-relaxed"
 />
 </div>
 </div>
 </div>

 {/* Image Alts */}
 <div className="bg-admin-surface border border-admin-border shadow-sm p-6">
 <div className="flex items-center justify-between pb-4 border-b border-admin-border-hover mb-4">
 <div className="flex items-center gap-3">
 <div className="p-2 bg-purple-50 text-purple-600">
 <ImageIcon size={18} />
 </div>
 <div>
 <h3 className="text-sm font-black uppercase text-admin-text tracking-wider">
 Image Alt Texts
 </h3>
 <p className="text-[10px] text-admin-muted font-medium">
 Accessibility & SEO for images on this page
 </p>
 </div>
 </div>
 <div className="flex items-center gap-2">
 <input
 type="text"
 placeholder="Image ID (e.g. hero-bg)"
 value={newAltKeys[page.id] ||""}
 onChange={(e) =>
 setNewAltKeys((prev) => ({
 ...prev,
 [page.id]: e.target.value,
 }))
 }
 className="bg-admin-bg border border-admin-border px-3 py-2 text-xs font-bold text-admin-text outline-none focus:border-primary w-[140px]"
 />
 <button
 type="button"
 onClick={() => handleAddAlt(page.id)}
 className="bg-admin-surface text-admin-text px-4 py-2 text-[10px] font-bold uppercase hover:bg-primary hover:text-admin-text transition-all flex items-center gap-1.5"
 >
 <Plus size={12} /> Add
 </button>
 </div>
 </div>

 {Object.keys(imageAltsState[page.id] || {}).length ===
 0 ? (
 <div className="text-center py-8 text-gray-300">
 <ImageIcon
 size={32}
 className="mx-auto mb-2 opacity-50"
 />
 <p className="text-xs font-bold uppercase tracking-wider">
 No image alts defined
 </p>
 </div>
 ) : (
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 {Object.entries(
 imageAltsState[page.id] || {}
 ).map(([altKey, altValue]) => (
 <div
 key={altKey}
 className="flex items-center gap-3 bg-admin-bg p-3 group"
 >
 <span className="text-[9px] font-black uppercase tracking-wider text-primary bg-primary/10 px-2 py-1 shrink-0">
 {altKey}
 </span>
 <input
 type="text"
 value={altValue}
 onChange={(e) =>
 handleAltChange(
 page.id,
 altKey,
 e.target.value
 )
 }
 placeholder="Describe image..."
 className="flex-1 bg-admin-surface border border-admin-border p-2 outline-none focus:border-primary text-xs font-medium"
 />
 <button
 type="button"
 onClick={() =>
 handleRemoveAlt(page.id, altKey)
 }
 className="text-gray-300 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
 >
 <Trash2 size={14} />
 </button>
 </div>
 ))}
 </div>
 )}
 </div>
 </div>
 )}

 {/* ═══ CONTENT TAB ═══ */}
 {activeSubTab ==="content" && (
 <div className="space-y-6 animate-in fade-in duration-300">
 {/* Add Section Bar */}
 <div className="bg-admin-surface border border-admin-border shadow-sm p-5">
 <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
 <div className="flex items-center gap-3">
 <div className="p-2 bg-emerald-50 text-emerald-600">
 <Layout size={18} />
 </div>
 <div>
 <h3 className="text-sm font-black uppercase text-admin-text tracking-wider">
 Page Content Sections
 </h3>
 <p className="text-[10px] text-admin-muted font-medium">
 {Object.keys(sectionsState[page.id] || {}).length} sections defined
 </p>
 </div>
 </div>
 <div className="flex items-center gap-2 w-full sm:w-auto">
 <input
 type="text"
 placeholder="Section key (e.g. hero, intro)"
 value={newSectionKeys[page.id] ||""}
 onChange={(e) =>
 setNewSectionKeys((prev) => ({
 ...prev,
 [page.id]: e.target.value,
 }))
 }
 className="bg-admin-bg border border-admin-border px-4 py-2.5 text-xs font-bold text-admin-text outline-none focus:border-primary flex-1 sm:w-[180px]"
 />
 <button
 type="button"
 onClick={() => handleAddSection(page.id)}
 className="bg-primary text-admin-text px-5 py-2.5 text-[10px] font-black uppercase tracking-wider hover:bg-admin-surface hover:text-admin-text transition-all flex items-center gap-2 whitespace-nowrap shadow-md"
 >
 <Plus size={14} /> New Section
 </button>
 </div>
 </div>
 </div>

 {/* Section Cards */}
 {Object.keys(sectionsState[page.id] || {}).length ===
 0 ? (
 <div className="bg-admin-surface border-2 border-dashed border-admin-border p-16 text-center">
 <Layout
 size={48}
 className="mx-auto text-gray-200 mb-4"
 />
 <p className="text-sm font-bold text-admin-muted uppercase tracking-wider mb-2">
 No sections defined yet
 </p>
 <p className="text-xs text-gray-300">
 Use the &quot;New Section&quot; button above to add
 editable content areas
 </p>
 </div>
 ) : (
 <div className="space-y-4">
 {Object.entries(
 sectionsState[page.id] || {}
 ).map(([secKey, secData]) => {
 const expandKey = `${page.id}_${secKey}`;
 const isExpanded =
 expandedSections[expandKey] !== false; // default open

 return (
 <div
 key={secKey}
 className="bg-admin-surface border border-admin-border shadow-sm overflow-hidden transition-all hover:shadow-md"
 >
 {/* Section Header - Clickable */}
 <div
 role="button"
 tabIndex={0}
 onClick={() =>
 toggleSectionExpand(expandKey)
 }
 onKeyDown={(e) => {
 if (e.key ==="Enter" || e.key ==="") {
 e.preventDefault();
 toggleSectionExpand(expandKey);
 }
 }}
 className="w-full flex items-center justify-between p-5 hover:bg-admin-bg/50 transition-colors text-left cursor-pointer select-none"
 >
 <div className="flex items-center gap-3">
 <div className="w-9 h-9 bg-admin-surface text-primary flex items-center justify-center font-black text-xs">
 {secKey.charAt(0).toUpperCase()}
 </div>
 <div>
 <h4 className="text-sm font-black uppercase text-admin-text tracking-tight">
 {secKey}
 </h4>
 <span className="text-[10px] text-admin-muted font-medium">
 {secData.title
 ? `"${secData.title.substring(0, 40)}${secData.title.length > 40 ?"..." :""}"`
 :"Empty section"}
 </span>
 </div>
 </div>
 <div className="flex items-center gap-3">
 <button
 type="button"
 onClick={(e) => {
 e.stopPropagation();
 handleRemoveSection(
 page.id,
 secKey
 );
 }}
 className="text-gray-300 hover:text-red-500 transition-all p-1"
 >
 <Trash2 size={14} />
 </button>
 {isExpanded ? (
 <ChevronDown
 size={16}
 className="text-admin-muted"
 />
 ) : (
 <ChevronRight
 size={16}
 className="text-admin-muted"
 />
 )}
 </div>
 </div>

 {/* Section Fields - Expandable */}
 {isExpanded && (
 <div className="px-5 pb-5 border-t border-admin-border-hover pt-4 space-y-4 animate-in fade-in duration-200">
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 <div>
 <FieldLabel label="Heading / Title" />
 <input
 type="text"
 value={secData.title ||""}
 onChange={(e) =>
 handleSectionFieldChange(
 page.id,
 secKey,
"title",
 e.target.value
 )
 }
 placeholder="Section heading..."
 className="w-full bg-admin-bg border border-admin-border p-3.5 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 text-sm font-bold text-admin-text"
 />
 </div>
 <div>
 <FieldLabel label="Subheading / Lead" />
 <input
 type="text"
 value={secData.subtitle ||""}
 onChange={(e) =>
 handleSectionFieldChange(
 page.id,
 secKey,
"subtitle",
 e.target.value
 )
 }
 placeholder="Subtitle or label..."
 className="w-full bg-admin-bg border border-admin-border p-3.5 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 text-sm font-medium"
 />
 </div>
 </div>
 <div>
 <FieldLabel label="Body Content" hint="One item per line for bullet lists" />
 <textarea
 rows={4}
 value={secData.content ||""}
 onChange={(e) =>
 handleSectionFieldChange(
 page.id,
 secKey,
"content",
 e.target.value
 )
 }
 placeholder="Main section content..."
 className="w-full bg-admin-bg border border-admin-border p-4 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 text-sm font-medium leading-relaxed resize-none"
 />
 </div>
 <div className="w-full md:w-1/2">
 <FieldLabel label="CTA Button Text" />
 <input
 type="text"
 value={secData.ctaText ||""}
 onChange={(e) =>
 handleSectionFieldChange(
 page.id,
 secKey,
"ctaText",
 e.target.value
 )
 }
 placeholder="Button label..."
 className="w-full bg-admin-bg border border-admin-border p-3.5 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 text-sm font-bold"
 />
 </div>
 </div>
 )}
 </div>
 );
 })}
 </div>
 )}
 </div>
 )}

 {/* ═══ SCHEMA / TECHNICAL TAB ═══ */}
 {activeSubTab ==="tech" && (
 <div className="space-y-6 animate-in fade-in duration-300">
 <div className="bg-admin-surface p-6 md:p-8 text-admin-text shadow-xl">
 <div className="flex items-center justify-between mb-6">
 <div className="flex items-center gap-4">
 <div className="p-2 bg-admin-surface/10">
 <Code2 size={20} className="text-primary" />
 </div>
 <div>
 <h3 className="text-base font-black uppercase tracking-tight">
 Structured Data (JSON-LD)
 </h3>
 <p className="text-[10px] text-admin-muted font-medium uppercase tracking-wider mt-0.5">
 Rich snippets for enhanced SERP visibility
 </p>
 </div>
 </div>
 <a
 href="https://search.google.com/test/rich-results"
 target="_blank"
 rel="noopener noreferrer"
 className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary hover:text-admin-text transition-colors"
 >
 <ExternalLink size={12} />
 Validate
 </a>
 </div>
 <textarea
 rows={14}
 value={structuredDataState[page.id] ||""}
 onChange={(e) =>
 handleStructuredDataChange(
 page.id,
 e.target.value
 )
 }
 placeholder={`{\n"@context":"https://schema.org",\n"@type":"LocalBusiness",\n"name":"Elite Steel Concepts",\n"description":"Custom food truck & trailer fabrication"\n}`}
 className="w-full bg-admin-bg/30 border border-white/10 p-5 outline-none focus:border-primary font-mono text-xs text-primary placeholder:text-gray-700 resize-none transition-all leading-relaxed"
 />
 <div className="mt-4 flex items-center gap-2 text-primary/70">
 <AlertCircle size={12} />
 <span className="text-[10px] font-bold uppercase tracking-widest">
 Validate JSON at Google Rich Results Test before
 deploying
 </span>
 </div>
 </div>
 </div>
 )}

 {/* ═══ SAVE BUTTON ═══ */}
 <div className="flex items-center justify-between bg-admin-surface border border-admin-border shadow-sm p-5">
 <div className="flex items-center gap-3">
 <Sparkles size={16} className="text-primary" />
 <span className="text-[10px] font-bold uppercase tracking-widest text-admin-muted">
 Changes deploy instantly to the live site
 </span>
 </div>
 <button
 type="submit"
 disabled={loading}
 className="bg-primary text-admin-text px-8 py-3.5 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:scale-100 transition-all font-black uppercase tracking-widest text-[11px] flex items-center gap-3"
 >
 <Save
 size={16}
 className={loading ?"animate-spin" :""}
 />
 {loading
 ?"Deploying..."
 : `Save ${page.name}`}
 </button>
 </div>
 </form>
 );
 })}
 </div>
 </div>
 </div>
 </>
 );
};

export default SEOManagerForm;
