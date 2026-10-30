"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
    ArrowDown, ArrowUp, ArrowUpRight, Briefcase, ChevronLeft, ChevronRight, FileText, Globe, LayoutTemplate,
    MapPin, PanelTop, Scale, Search, Sparkles, Wrench, X, type LucideIcon
} from "lucide-react";

export type CollectionId = "global" | "main" | "services" | "locations" | "legal";
export type RowStatus = "customized" | "unsaved" | "original" | "published" | "unpublished";

export interface DashboardRow {
    id: string;               // page id, or "location:<slug>"
    name: string;
    path: string | null;      // null = shown on every page
    collection: CollectionId;
    sectionCount: number | null; // null for rows edited elsewhere (locations)
    status: RowStatus;
    lastEdited: { at: string; by?: string } | null;
    editHref?: string;        // rows edited in another admin screen
}

const COLLECTIONS: { id: CollectionId; label: string; hint: string; icon: LucideIcon }[] = [
    { id: "global", label: "Global", hint: "Header, footer & shared blocks", icon: PanelTop },
    { id: "main", label: "Main Pages", hint: "Core website pages", icon: FileText },
    { id: "services", label: "Services", hint: "Service landing pages", icon: Wrench },
    { id: "locations", label: "Locations", hint: "Individual city pages", icon: MapPin },
    { id: "legal", label: "Legal", hint: "Terms & privacy", icon: Scale }
];

const STATUS_FILTERS: { id: "all" | "customized" | "unsaved" | "original"; label: string; swatch: string }[] = [
    { id: "all", label: "All statuses", swatch: "bg-admin-text" },
    { id: "customized", label: "Live (customized)", swatch: "bg-emerald-500" },
    { id: "unsaved", label: "Unsaved changes", swatch: "bg-amber-500" },
    { id: "original", label: "Original content", swatch: "bg-admin-border-hover" }
];

const STATUS_BADGE: Record<RowStatus, { label: string; cls: string }> = {
    customized: { label: "Live", cls: "bg-emerald-500 text-white border-emerald-500" },
    unsaved: { label: "Unsaved", cls: "bg-amber-500 text-black border-amber-500" },
    original: { label: "Original", cls: "bg-transparent text-admin-text border-admin-text" },
    published: { label: "Published", cls: "bg-transparent text-emerald-500 border-emerald-500" },
    unpublished: { label: "Hidden", cls: "bg-transparent text-admin-muted border-admin-border-hover" }
};

const ROW_ICONS: Record<CollectionId, LucideIcon> = { global: PanelTop, main: FileText, services: Wrench, locations: MapPin, legal: Scale };
const PAGE_SIZE = 20;
const SITE_HOST = "esteelconcepts.com";

function timeAgo(iso: string) {
    const s = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 1000));
    if (s < 60) return "just now";
    if (s < 3600) return `${Math.floor(s / 60)} min ago`;
    if (s < 86400) return `${Math.floor(s / 3600)} h ago`;
    if (s < 86400 * 30) return `${Math.floor(s / 86400)} d ago`;
    return new Date(iso).toLocaleDateString();
}

type SortKey = "name" | "edited";

function SortIcon({ sort, k }: { sort: { key: SortKey; dir: 1 | -1 } | null; k: SortKey }) {
    if (sort?.key !== k) return <ArrowDown size={11} className="opacity-30" />;
    return sort.dir === 1 ? <ArrowUp size={11} className="text-primary" /> : <ArrowDown size={11} className="text-primary" />;
}

export default function ContentDashboard({ rows, onEdit }: { rows: DashboardRow[]; onEdit: (pageId: string) => void }) {
    const [collection, setCollection] = useState<CollectionId | "all">("all");
    const [status, setStatus] = useState<(typeof STATUS_FILTERS)[number]["id"]>("all");
    const [query, setQuery] = useState("");
    const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 } | null>(null);
    const [page, setPage] = useState(0);

    const counts = useMemo(() => {
        const byCollection = Object.fromEntries(COLLECTIONS.map(c => [c.id, rows.filter(r => r.collection === c.id).length])) as Record<CollectionId, number>;
        return {
            byCollection,
            customized: rows.filter(r => r.status === "customized").length,
            unsaved: rows.filter(r => r.status === "unsaved").length
        };
    }, [rows]);

    const visible = useMemo(() => {
        const q = query.trim().toLowerCase();
        const list = rows.filter(r => {
            if (collection !== "all" && r.collection !== collection) return false;
            if (status !== "all" && r.status !== status) return false;
            if (!q) return true;
            const coll = COLLECTIONS.find(c => c.id === r.collection)?.label || "";
            return r.name.toLowerCase().includes(q) || (r.path || "all pages").toLowerCase().includes(q) || coll.toLowerCase().includes(q);
        });
        if (!sort) return list;
        return [...list].sort((a, b) => {
            if (sort.key === "name") return a.name.localeCompare(b.name) * sort.dir;
            const ta = a.lastEdited ? new Date(a.lastEdited.at).getTime() : 0;
            const tb = b.lastEdited ? new Date(b.lastEdited.at).getTime() : 0;
            return (ta - tb) * sort.dir;
        });
    }, [rows, collection, status, query, sort]);

    const pageCount = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
    const currentPage = Math.min(page, pageCount - 1);
    const pageRows = visible.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE);

    const toggleSort = (key: SortKey) =>
        setSort(s => (s?.key === key ? (s.dir === 1 ? { key, dir: -1 } : null) : { key, dir: key === "edited" ? -1 : 1 }));

    const filterBtn = (active: boolean) =>
        `w-full flex items-center gap-3 px-3 py-3 text-left transition-colors ${active ? "bg-[#0a0a0a] text-white" : "hover:bg-admin-surface-hover"}`;

    return (
        <div className="space-y-6 pb-16">
            {/* ─── Hero banner ─── */}
            <header className="relative overflow-hidden bg-[#0a0a0a] border-t-4 border-primary">
                <div
                    className="absolute inset-0 opacity-[0.05] pointer-events-none"
                    style={{ backgroundImage: "repeating-linear-gradient(0deg,#fff 0,#fff 1px,transparent 1px,transparent 40px),repeating-linear-gradient(90deg,#fff 0,#fff 1px,transparent 1px,transparent 40px)" }}
                />
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/15 to-transparent pointer-events-none" />
                <div className="relative flex flex-col xl:flex-row xl:items-center justify-between gap-8 p-6 md:p-10">
                    <div className="flex items-start gap-5">
                        <div className="shrink-0 size-14 md:size-16 bg-primary flex items-center justify-center shadow-[6px_6px_0_rgba(255,255,255,0.08)]">
                            <LayoutTemplate size={28} className="text-black" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Website · Content Studio</p>
                            <h1 className="mt-1 text-4xl md:text-5xl font-black uppercase tracking-tighter text-white leading-none">
                                Page <span className="text-primary">Editor</span>
                            </h1>
                            <p className="mt-4 max-w-xl text-sm text-gray-400 leading-relaxed">
                                Edit the text, images, buttons and links of every page, add custom sections, and publish instantly.
                            </p>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 border border-white/15 shrink-0">
                        {[
                            { value: rows.length, label: "Pages", cls: "text-white" },
                            { value: counts.customized, label: "Customized", cls: "text-emerald-400" },
                            { value: counts.unsaved, label: "Unsaved", cls: "text-primary" }
                        ].map(s => (
                            <div key={s.label} className="px-5 md:px-7 py-4 md:py-5 border-r last:border-r-0 border-white/15">
                                <div className={`text-3xl md:text-4xl font-black leading-none ${s.cls}`}>{s.value}</div>
                                <div className="mt-2 text-[9px] font-black uppercase tracking-[0.25em] text-gray-500">{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-[260px_1fr] gap-6 items-start">
                {/* ─── Filters ─── */}
                <aside className="space-y-6 xl:sticky xl:top-4">
                    <div className="bg-admin-surface border-2 border-admin-text/90">
                        <div className="flex items-center gap-2 px-4 py-3.5 border-b-2 border-admin-text/90">
                            <Sparkles size={14} className="text-primary" />
                            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-admin-text">Collections</span>
                        </div>
                        <div className="p-2 space-y-0.5">
                            <button type="button" onClick={() => { setCollection("all"); setPage(0); }} className={filterBtn(collection === "all")}>
                                <Globe size={16} className={collection === "all" ? "text-primary" : "text-admin-muted"} />
                                <span className="flex-1 min-w-0">
                                    <span className={`block text-xs font-black uppercase tracking-wider ${collection === "all" ? "text-white" : "text-admin-text"}`}>All Pages</span>
                                    <span className={`block text-[10px] ${collection === "all" ? "text-gray-400" : "text-admin-muted"}`}>Everything on the website</span>
                                </span>
                                <span className={`text-[10px] font-black px-1.5 py-0.5 ${collection === "all" ? "bg-primary text-black" : "bg-admin-bg text-admin-muted"}`}>{rows.length}</span>
                            </button>
                            {COLLECTIONS.map(c => {
                                const active = collection === c.id;
                                return (
                                    <button key={c.id} type="button" onClick={() => { setCollection(c.id); setPage(0); }} className={filterBtn(active)}>
                                        <c.icon size={16} className={active ? "text-primary" : "text-admin-muted"} />
                                        <span className="flex-1 min-w-0">
                                            <span className={`block text-xs font-black uppercase tracking-wider ${active ? "text-white" : "text-admin-text"}`}>{c.label}</span>
                                            <span className={`block text-[10px] truncate ${active ? "text-gray-400" : "text-admin-muted"}`}>{c.hint}</span>
                                        </span>
                                        <span className={`text-[10px] font-black px-1.5 py-0.5 ${active ? "bg-primary text-black" : "bg-admin-bg text-admin-muted"}`}>{counts.byCollection[c.id]}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="bg-admin-surface border-2 border-admin-text/90">
                        <div className="px-4 py-3.5 border-b-2 border-admin-text/90 text-[11px] font-black uppercase tracking-[0.2em] text-admin-text">Status</div>
                        <div className="p-2 space-y-0.5">
                            {STATUS_FILTERS.map(f => {
                                const active = status === f.id;
                                return (
                                    <button key={f.id} type="button" onClick={() => { setStatus(f.id); setPage(0); }} className={`${filterBtn(active)} py-2.5`}>
                                        <span className={`size-2.5 ${active && f.id === "all" ? "bg-white" : f.swatch}`} />
                                        <span className={`text-xs font-bold ${active ? "text-white" : "text-admin-text"}`}>{f.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </aside>

                {/* ─── Table ─── */}
                <section className="min-w-0 bg-admin-surface border-2 border-admin-text/90 shadow-[6px_6px_0_rgba(0,0,0,0.06)]">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 md:p-5 border-b-2 border-admin-text/90">
                        <div className="flex items-center gap-3 w-full sm:max-w-md bg-admin-bg border border-admin-border px-4 py-3 focus-within:border-primary transition-colors">
                            <Search size={15} className="text-admin-muted shrink-0" />
                            <input
                                value={query}
                                onChange={e => { setQuery(e.target.value); setPage(0); }}
                                placeholder="Search pages, URLs or collections..."
                                className="flex-1 bg-transparent text-sm text-admin-text outline-none placeholder:text-admin-muted"
                            />
                            {query && <button type="button" onClick={() => setQuery("")} className="text-admin-muted hover:text-admin-text"><X size={14} /></button>}
                        </div>
                        <span className="text-xs text-admin-muted shrink-0">{visible.length} results</span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[640px]">
                            <thead>
                                <tr className="border-b-2 border-admin-text/90 text-left text-[10px] font-black uppercase tracking-[0.2em] text-admin-muted">
                                    <th className="px-5 py-4">
                                        <button type="button" onClick={() => toggleSort("name")} className="flex items-center gap-1.5 uppercase tracking-[0.2em] hover:text-admin-text">Page <SortIcon sort={sort} k="name" /></button>
                                    </th>
                                    <th className="px-5 py-4 hidden lg:table-cell">URL</th>
                                    <th className="px-5 py-4 hidden md:table-cell">Collection</th>
                                    <th className="px-5 py-4">Status</th>
                                    <th className="px-5 py-4 hidden sm:table-cell">
                                        <button type="button" onClick={() => toggleSort("edited")} className="flex items-center gap-1.5 uppercase tracking-[0.2em] hover:text-admin-text">Last Edited <SortIcon sort={sort} k="edited" /></button>
                                    </th>
                                    <th className="px-5 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pageRows.map(row => {
                                    const Icon = ROW_ICONS[row.collection] || Briefcase;
                                    const badge = STATUS_BADGE[row.status];
                                    const editButton = "inline-flex items-center px-5 py-3 bg-[#0a0a0a] text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-primary hover:text-black transition-colors border border-admin-text/20";
                                    return (
                                        <tr key={row.id} className="border-b border-admin-border last:border-b-0 hover:bg-admin-surface-hover transition-colors">
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-4">
                                                    <span className="shrink-0 size-11 border-2 border-admin-text/90 flex items-center justify-center text-admin-text">
                                                        <Icon size={17} />
                                                    </span>
                                                    <span className="min-w-0">
                                                        <span className="block text-sm font-black text-admin-text truncate">{row.name}</span>
                                                        <span className="block text-[11px] text-admin-muted">
                                                            {row.sectionCount === null ? "Edited in Locations" : `${row.sectionCount} editable section${row.sectionCount === 1 ? "" : "s"}`}
                                                        </span>
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 hidden lg:table-cell">
                                                {row.path ? (
                                                    <a href={row.path} target="_blank" rel="noopener noreferrer" className="group block">
                                                        <span className="block text-[9px] font-black uppercase tracking-[0.2em] text-admin-muted">{SITE_HOST}</span>
                                                        <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-admin-text group-hover:text-primary">
                                                            {row.path} <ArrowUpRight size={11} className="opacity-50" />
                                                        </span>
                                                    </a>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-admin-muted">
                                                        <Globe size={13} /> All Pages
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-5 py-4 hidden md:table-cell text-xs font-bold text-admin-text">
                                                {COLLECTIONS.find(c => c.id === row.collection)?.label}
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className={`inline-block px-2 py-1 border text-[9px] font-black uppercase tracking-widest ${badge.cls}`}>{badge.label}</span>
                                            </td>
                                            <td className="px-5 py-4 hidden sm:table-cell">
                                                {row.lastEdited ? (
                                                    <>
                                                        <span className="block text-xs font-bold text-admin-text">{timeAgo(row.lastEdited.at)}</span>
                                                        {row.lastEdited.by && <span className="block text-[10px] text-admin-muted truncate max-w-[180px]">{row.lastEdited.by}</span>}
                                                    </>
                                                ) : (
                                                    <span className="text-xs text-admin-muted">{row.sectionCount === null ? "—" : "Never"}</span>
                                                )}
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    {row.path && (
                                                        <a
                                                            href={row.path}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            title="Open live page"
                                                            className="size-10 flex items-center justify-center border border-admin-border-hover text-admin-text hover:border-primary hover:text-primary transition-colors"
                                                        >
                                                            <ArrowUpRight size={15} />
                                                        </a>
                                                    )}
                                                    {row.editHref ? (
                                                        <Link href={row.editHref} className={editButton}>Edit</Link>
                                                    ) : (
                                                        <button type="button" onClick={() => onEdit(row.id)} className={editButton}>Edit</button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {pageRows.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-5 py-16 text-center text-sm text-admin-muted">No pages match these filters.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {pageCount > 1 && (
                        <div className="flex items-center justify-between gap-3 px-5 py-4 border-t-2 border-admin-text/90 text-xs text-admin-muted">
                            <span>
                                {currentPage * PAGE_SIZE + 1}–{Math.min(visible.length, (currentPage + 1) * PAGE_SIZE)} of {visible.length}
                            </span>
                            <div className="flex items-center gap-1">
                                <button type="button" disabled={currentPage === 0} onClick={() => setPage(currentPage - 1)} className="size-9 flex items-center justify-center border border-admin-border hover:border-primary hover:text-primary disabled:opacity-30 disabled:pointer-events-none" aria-label="Previous page">
                                    <ChevronLeft size={15} />
                                </button>
                                <span className="px-3 font-bold text-admin-text">{currentPage + 1} / {pageCount}</span>
                                <button type="button" disabled={currentPage >= pageCount - 1} onClick={() => setPage(currentPage + 1)} className="size-9 flex items-center justify-center border border-admin-border hover:border-primary hover:text-primary disabled:opacity-30 disabled:pointer-events-none" aria-label="Next page">
                                    <ChevronRight size={15} />
                                </button>
                            </div>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
