"use client";

import React, { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import {
    Briefcase, Caravan, ChevronLeft, ClipboardList, ExternalLink, FileText, Globe, Hammer, Home, Info, Layers, LayoutGrid,
    ListOrdered, Lock, Mail, MapPin, PenTool, RotateCcw, Save, Scale, Search, ShieldCheck, Star, Truck, Wrench,
    type LucideIcon
} from "lucide-react";
import Toast from "@/components/ui/Toast";
import { savePageContentAction, resetPageContentAction } from "@/app/actions/pageContent";
import { sameContent } from "@/lib/pageContent/schema";
import type { FieldDef, PageContentEntry } from "@/lib/pageContent/types";
import type { CustomBlock } from "@/lib/pageContent/blocks";
import type { AdminSectionState } from "@/lib/pageContent";
import { SchemaForm, type LinkOption, type MediaOption } from "./fields";
import CustomSectionsBuilder from "./CustomSectionsBuilder";
import ContentDashboard, { type CollectionId, type DashboardRow } from "./ContentDashboard";

const PAGE_ICONS: Record<string, LucideIcon> = {
    Globe, Home, Info, Wrench, Truck, Caravan, Layers, PenTool, Hammer, ListOrdered, ShieldCheck, Star,
    Briefcase, MapPin, FileText, Mail, ClipboardList, Lock, Scale
};

export interface CatalogSection {
    key: string;
    label: string;
    description: string;
    fields: FieldDef[] | null; // null = modular page builder
}

export interface CatalogPage {
    id: string;
    label: string;
    icon: string;
    path: string | null;
    sections: CatalogSection[];
}

interface Props {
    catalog: CatalogPage[];
    initialState: Record<string, AdminSectionState>;
    links: LinkOption[];
    media: MediaOption[];
    canEdit: boolean;
    initialKey?: string;
    initialPage?: string;
    collections?: Record<string, CollectionId>;
    locations?: { slug: string; city: string; state: string; published: boolean }[];
}

/** Saved version as the editor sees it: base merged with the stored override. */
function effectiveOf(state: AdminSectionState, isBuilder: boolean): unknown {
    const saved = state.saved?.content;
    if (isBuilder) return Array.isArray(saved) ? saved : [];
    return saved && typeof saved === "object" ? { ...(state.base as object), ...(saved as object) } : state.base;
}

function timeAgo(iso: string) {
    const s = Math.round((Date.now() - new Date(iso).getTime()) / 1000);
    if (s < 60) return "just now";
    if (s < 3600) return `${Math.floor(s / 60)}m ago`;
    if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
    return new Date(iso).toLocaleDateString();
}

export default function PageContentEditor({
    catalog, initialState, links, media, canEdit, initialKey, initialPage, collections = {}, locations = []
}: Props) {
    const sectionsByKey = useMemo(() => new Map(catalog.flatMap(p => p.sections.map(s => [s.key, { section: s, page: p }] as const))), [catalog]);
    const pageOfKey = initialKey ? sectionsByKey.get(initialKey)?.page.id : undefined;
    const [openPage, setOpenPage] = useState<string | null>(
        pageOfKey ?? (initialPage && catalog.some(p => p.id === initialPage) ? initialPage : null)
    );
    const firstKey = catalog.find(p => p.id === openPage)?.sections[0]?.key || "";

    const [state, setState] = useState(initialState);
    const [drafts, setDrafts] = useState<Record<string, unknown>>(() =>
        Object.fromEntries(Object.entries(initialState).map(([key, s]) => [key, structuredClone(effectiveOf(s, sectionsByKey.get(key)?.section.fields === null))]))
    );
    const [selected, setSelected] = useState(initialKey && sectionsByKey.has(initialKey) ? initialKey : firstKey);
    const [query, setQuery] = useState("");
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
    const [isPending, startTransition] = useTransition();
    const closeToast = useCallback(() => setToast(null), []);

    const isBuilderKey = useCallback((key: string) => sectionsByKey.get(key)?.section.fields === null, [sectionsByKey]);
    const isDirty = useCallback(
        (key: string) => !!state[key] && !sameContent(drafts[key], effectiveOf(state[key], isBuilderKey(key))),
        [drafts, state, isBuilderKey]
    );
    const dirtyKeys = useMemo(() => Object.keys(drafts).filter(isDirty), [drafts, isDirty]);

    // Warn before leaving with unsaved drafts
    useEffect(() => {
        if (dirtyKeys.length === 0) return;
        const onBeforeUnload = (e: BeforeUnloadEvent) => e.preventDefault();
        window.addEventListener("beforeunload", onBeforeUnload);
        return () => window.removeEventListener("beforeunload", onBeforeUnload);
    }, [dirtyKeys.length]);

    // Keep the open page + section in the URL so a refresh/bookmark returns to it
    useEffect(() => {
        const url = new URL(window.location.href);
        url.searchParams.delete("page");
        url.searchParams.delete("key");
        if (openPage) url.searchParams.set("key", selected);
        window.history.replaceState(null, "", url);
    }, [openPage, selected]);

    const openEditor = (pageId: string) => {
        const page = catalog.find(p => p.id === pageId);
        if (!page) return;
        setOpenPage(pageId);
        setSelected(page.sections[0]?.key || "");
        setQuery("");
        window.scrollTo({ top: 0 });
    };

    // Dashboard rows: one per editable page, plus city pages (edited in the Locations screen)
    const rows = useMemo<DashboardRow[]>(() => {
        const pageRows = catalog.map((p): DashboardRow => {
            const entries = p.sections.map(s => state[s.key]?.saved).filter((e): e is PageContentEntry => !!e);
            const latest = entries.reduce<PageContentEntry | null>((a, e) => (!a || e.updatedAt > a.updatedAt ? e : a), null);
            return {
                id: p.id,
                name: p.id === "site" ? "Header, Footer & FAQ" : p.label,
                path: p.path,
                collection: collections[p.id] || "main",
                sectionCount: p.sections.length,
                status: p.sections.some(s => isDirty(s.key)) ? "unsaved" : entries.length ? "customized" : "original",
                lastEdited: latest ? { at: latest.updatedAt, by: latest.updatedBy } : null
            };
        });
        const locationRows = locations.map((l): DashboardRow => ({
            id: `location:${l.slug}`,
            name: `${l.city}, ${l.state}`,
            path: `/locations/${l.slug}`,
            collection: "locations",
            sectionCount: null,
            status: l.published ? "published" : "unpublished",
            lastEdited: null,
            editHref: `/admin/locations/${l.slug}`
        }));
        return [...pageRows, ...locationRows];
    }, [catalog, state, isDirty, collections, locations]);

    const filteredCatalog = useMemo(() => {
        const pageCatalog = catalog.filter(p => p.id === openPage);
        const q = query.trim().toLowerCase();
        if (!q) return pageCatalog;
        return pageCatalog
            .map(p => ({
                ...p,
                sections: p.label.toLowerCase().includes(q)
                    ? p.sections
                    : p.sections.filter(s => s.label.toLowerCase().includes(q) || s.description.toLowerCase().includes(q) || s.key.includes(q))
            }))
            .filter(p => p.sections.length > 0);
    }, [catalog, query, openPage]);

    const current = sectionsByKey.get(selected);
    const currentState = state[selected];
    const draft = drafts[selected];
    const builder = current?.section.fields === null;
    const atDefault = currentState ? sameContent(draft, builder ? [] : currentState.base) : true;

    const setDraft = (value: unknown) => setDrafts(d => ({ ...d, [selected]: value }));

    const resetToDefault = () => {
        if (!currentState) return;
        if (!confirm("Restore the default content for this section? The change is applied when you click Save.")) return;
        setDraft(structuredClone(builder ? [] : currentState.base));
    };

    const save = () => {
        if (!currentState) return;
        const key = selected;
        const value = drafts[key];
        startTransition(async () => {
            // Content equal to the default needs no override: delete it instead of storing a copy
            const res = sameContent(value, builder ? [] : currentState.base)
                ? currentState.saved
                    ? await resetPageContentAction(key)
                    : { success: true, entry: null as PageContentEntry | null }
                : await savePageContentAction(key, value);

            if (!res.success) {
                setToast({ message: res.error || "Save failed", type: "error" });
                return;
            }
            const saved = res.entry ?? null;
            const nextState = { ...currentState, saved };
            setState(s => ({ ...s, [key]: nextState }));
            // Adopt the sanitized version the server stored
            setDrafts(d => ({ ...d, [key]: structuredClone(effectiveOf(nextState, builder)) }));
            setToast({ message: saved ? "Changes saved — live page updated" : "Reset to default", type: "success" });
        });
    };

    const ctx = { links, media, disabled: !canEdit || isPending };
    const toastEl = toast && <Toast message={toast.message} type={toast.type} onClose={closeToast} />;

    if (!openPage) {
        return (
            <>
                {toastEl}
                <ContentDashboard rows={rows} onEdit={openEditor} />
            </>
        );
    }

    const openPageDef = catalog.find(p => p.id === openPage)!;
    const pageDirtyCount = openPageDef.sections.filter(s => isDirty(s.key)).length;

    return (
        <div className="space-y-6 pb-20">
            {toastEl}

            <header className="relative overflow-hidden bg-[#0a0a0a] border-t-4 border-primary">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/15 to-transparent pointer-events-none" />
                <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-6 p-6 md:p-8">
                    <div className="min-w-0">
                        <button
                            type="button"
                            onClick={() => setOpenPage(null)} // drafts stay in memory; the dashboard marks the page "Unsaved"
                            className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-primary transition-colors"
                        >
                            <ChevronLeft size={13} /> All Pages
                        </button>
                        <h1 className="mt-3 text-3xl md:text-4xl font-black uppercase tracking-tighter text-white leading-none truncate">
                            {openPageDef.id === "site" ? "Header, Footer & FAQ" : openPageDef.label}
                        </h1>
                        <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400">
                            <span className="font-mono">{openPageDef.path ? `esteelconcepts.com${openPageDef.path}` : "Shown on every page"}</span>
                            <span>{openPageDef.sections.length} editable sections</span>
                            {pageDirtyCount > 0 && <span className="text-amber-400 font-bold">{pageDirtyCount} unsaved</span>}
                            {!canEdit && <span className="text-primary font-bold">Read-only access</span>}
                        </p>
                    </div>
                    {openPageDef.path && (
                        <a
                            href={openPageDef.path}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="shrink-0 inline-flex items-center gap-2 px-5 py-3 border border-white/20 text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-colors"
                        >
                            <ExternalLink size={13} /> View Live Page
                        </a>
                    )}
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 items-start">
                {/* ─── Catalogue ─── */}
                <aside className="bg-admin-surface border border-admin-border lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)] flex flex-col">
                    <div className="p-3 border-b border-admin-border">
                        <div className="flex items-center gap-2 bg-admin-bg border border-admin-border px-3 py-2.5 focus-within:border-primary transition-colors">
                            <Search size={14} className="text-admin-muted shrink-0" />
                            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search sections..." className="flex-1 bg-transparent text-xs text-admin-text outline-none placeholder:text-admin-muted" />
                        </div>
                    </div>
                    <nav className="overflow-y-auto p-2 space-y-4">
                        {filteredCatalog.map(page => {
                            const Icon = PAGE_ICONS[page.icon] || Globe;
                            return (
                                <div key={page.id}>
                                    <div className="flex items-center gap-2 px-2 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-admin-muted">
                                        <Icon size={13} className="text-primary" /> {page.label}
                                    </div>
                                    <ul>
                                        {page.sections.map(s => {
                                            const active = s.key === selected;
                                            const customized = !!state[s.key]?.saved;
                                            const dirty = isDirty(s.key);
                                            return (
                                                <li key={s.key}>
                                                    <button
                                                        type="button"
                                                        onClick={() => setSelected(s.key)}
                                                        className={`w-full text-left pl-3 pr-2 py-2.5 border-l-2 transition-colors ${
                                                            active ? "bg-primary/10 border-primary" : "border-transparent hover:bg-admin-surface-hover"
                                                        }`}
                                                    >
                                                        <span className="flex items-center gap-2">
                                                            {s.fields === null && <LayoutGrid size={12} className="text-primary shrink-0" />}
                                                            <span className={`flex-1 text-xs font-bold truncate ${active ? "text-admin-text" : "text-admin-text/80"}`}>{s.label}</span>
                                                            {dirty && <span className="text-[8px] font-black uppercase tracking-wider text-amber-500">Unsaved</span>}
                                                            <span
                                                                className={`size-1.5 shrink-0 ${customized ? "bg-primary" : "bg-admin-border"}`}
                                                                title={customized ? "Customized" : "Using default"}
                                                            />
                                                        </span>
                                                        <span className="block text-[10px] text-admin-muted truncate mt-0.5">{s.description}</span>
                                                    </button>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            );
                        })}
                        {filteredCatalog.length === 0 && <p className="px-3 py-8 text-center text-[11px] text-admin-muted">No sections match.</p>}
                    </nav>
                    <div className="p-3 border-t border-admin-border flex items-center gap-4 text-[9px] font-bold uppercase tracking-widest text-admin-muted">
                        <span className="flex items-center gap-1.5"><span className="size-1.5 bg-primary" /> Customized</span>
                        <span className="flex items-center gap-1.5"><span className="size-1.5 bg-admin-border" /> Default</span>
                    </div>
                </aside>

                {/* ─── Editor ─── */}
                {current && currentState ? (
                    <section className="min-w-0 space-y-6">
                        <div className="bg-admin-surface/90 backdrop-blur-md border border-admin-border p-5 md:p-6 sticky top-4 z-30 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
                            <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">{current.page.label}</span>
                                    <span className="text-[10px] font-mono text-admin-muted">{selected}</span>
                                    {isDirty(selected) && (
                                        <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 bg-amber-500/10 border border-amber-500/40 text-amber-500">Unsaved changes</span>
                                    )}
                                    {!isDirty(selected) && currentState.saved && (
                                        <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 bg-primary/10 border border-primary/40 text-primary">Customized</span>
                                    )}
                                </div>
                                <h2 className="text-xl font-black uppercase tracking-tight text-admin-text">{current.section.label}</h2>
                                <p className="text-[11px] text-admin-muted mt-1">
                                    {current.section.description}
                                    {currentState.saved && (
                                        <span className="block mt-0.5">
                                            Last edited {timeAgo(currentState.saved.updatedAt)}
                                            {currentState.saved.updatedBy && <> by {currentState.saved.updatedBy}</>}
                                        </span>
                                    )}
                                </p>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 shrink-0">
                                {canEdit && (
                                    <button
                                        type="button"
                                        onClick={resetToDefault}
                                        disabled={isPending || atDefault}
                                        className="flex items-center gap-2 px-4 py-3 border border-admin-border text-[10px] font-black uppercase tracking-widest text-admin-muted hover:text-red-500 hover:border-red-500/50 disabled:opacity-40 disabled:pointer-events-none transition-colors"
                                    >
                                        <RotateCcw size={13} /> Reset to Default
                                    </button>
                                )}
                                {current.page.path && (
                                    <a
                                        href={current.page.path}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-4 py-3 border border-admin-border text-[10px] font-black uppercase tracking-widest text-admin-text hover:border-admin-border-hover hover:bg-admin-surface-hover transition-colors"
                                    >
                                        <ExternalLink size={13} /> Preview
                                    </a>
                                )}
                                {canEdit && (
                                    <button
                                        type="button"
                                        onClick={save}
                                        disabled={isPending || !isDirty(selected)}
                                        className="flex items-center gap-2 px-6 py-3 bg-primary text-black text-[10px] font-black uppercase tracking-widest hover:bg-orange-500 disabled:opacity-40 disabled:pointer-events-none transition-colors"
                                    >
                                        <Save size={13} /> {isPending ? "Saving..." : "Save Changes"}
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="bg-admin-surface border border-admin-border p-6 md:p-10">
                            {builder ? (
                                <CustomSectionsBuilder value={(draft as CustomBlock[]) || []} onChange={setDraft} ctx={ctx} />
                            ) : (
                                <SchemaForm fields={current.section.fields!} value={(draft as Record<string, unknown>) || {}} onChange={setDraft} ctx={ctx} />
                            )}
                            <p className="mt-8 pt-6 border-t border-admin-border text-[10px] text-admin-muted leading-relaxed">
                                Tip: <code className="font-mono text-primary">{"{experienceYears}"}</code>, <code className="font-mono text-primary">{"{trucksBuiltCount}"}</code>,{" "}
                                <code className="font-mono text-primary">{"{phone}"}</code> and <code className="font-mono text-primary">{"{email}"}</code> are replaced with the values from Settings.
                            </p>
                        </div>
                    </section>
                ) : (
                    <div className="bg-admin-surface border border-admin-border p-16 text-center text-sm text-admin-muted">Select a section to edit.</div>
                )}
            </div>
        </div>
    );
}
