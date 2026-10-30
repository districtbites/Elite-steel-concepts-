"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowDown, ArrowUp, ChevronDown, ChevronRight, ImageIcon, Link2, Plus, Search, Trash2, X } from "lucide-react";
import type { FieldDef, ListFieldDef, ScalarFieldDef, StringListFieldDef } from "@/lib/pageContent/types";

// ─── Shared option types (built on the server, passed down) ───────────────

export interface LinkOption {
    href: string;
    label: string;
    group: string; // "Pages", "Blog Posts", "Portfolio", "Locations"
}

export interface MediaOption {
    url: string;
    alt: string;
    label: string;
}

export interface FieldContext {
    links: LinkOption[];
    media: MediaOption[];
    disabled?: boolean;
}

// ─── Styles (admin theme tokens only) ─────────────────────────────────────

export const labelCls = "text-[10px] font-black uppercase text-admin-text tracking-widest ml-1";
export const inputCls =
    "w-full bg-admin-bg border border-admin-border p-3.5 outline-none focus:border-primary text-sm text-admin-text placeholder:text-admin-muted/60 transition-colors disabled:opacity-60 disabled:cursor-not-allowed";
const helpCls = "text-[10px] text-admin-muted ml-1 leading-relaxed";
const iconBtn = "p-1.5 text-admin-muted hover:text-admin-text hover:bg-admin-surface-hover disabled:opacity-30 disabled:pointer-events-none transition-colors";

function FieldShell({ label, help, children }: { label: string; help?: string; children: React.ReactNode }) {
    return (
        <div className="space-y-2">
            <label className={labelCls}>{label}</label>
            {children}
            {help && <p className={helpCls}>{help}</p>}
        </div>
    );
}

// ─── Scalar fields ────────────────────────────────────────────────────────

export function TextField({ value, onChange, placeholder, disabled, mono }: { value: string; onChange: (v: string) => void; placeholder?: string; disabled?: boolean; mono?: boolean }) {
    return <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} disabled={disabled} className={`${inputCls} ${mono ? "font-mono text-xs" : "font-bold"}`} />;
}

export function TextAreaField({ value, onChange, rows = 4, placeholder, disabled }: { value: string; onChange: (v: string) => void; rows?: number; placeholder?: string; disabled?: boolean }) {
    return <textarea value={value} onChange={e => onChange(e.target.value)} rows={rows} placeholder={placeholder} disabled={disabled} className={`${inputCls} font-medium leading-relaxed resize-y`} />;
}

export function NumberField({ value, onChange, disabled }: { value: number; onChange: (v: number) => void; disabled?: boolean }) {
    return <input type="number" value={Number.isFinite(value) ? value : 0} onChange={e => onChange(e.target.value === "" ? 0 : Number(e.target.value))} disabled={disabled} className={`${inputCls} font-bold max-w-[200px]`} />;
}

/** URL input with a searchable picker of internal pages, posts, projects and locations. */
export function LinkField({ value, onChange, links, disabled, placeholder }: { value: string; onChange: (v: string) => void; links: LinkOption[]; disabled?: boolean; placeholder?: string }) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const rootRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;
        const close = (e: MouseEvent) => rootRef.current && !rootRef.current.contains(e.target as Node) && setOpen(false);
        document.addEventListener("mousedown", close);
        return () => document.removeEventListener("mousedown", close);
    }, [open]);

    const groups = useMemo(() => {
        const q = query.trim().toLowerCase();
        const visible = q ? links.filter(l => l.label.toLowerCase().includes(q) || l.href.toLowerCase().includes(q)) : links;
        const map = new Map<string, LinkOption[]>();
        for (const l of visible.slice(0, 200)) map.set(l.group, [...(map.get(l.group) || []), l]);
        return [...map.entries()];
    }, [links, query]);

    const current = links.find(l => l.href === value);

    return (
        <div ref={rootRef} className="relative">
            <div className="flex">
                <input type="text" value={value} onChange={e => onChange(e.target.value)} disabled={disabled} placeholder={placeholder || "/page or https://..."} className={`${inputCls} font-mono text-xs`} />
                <button
                    type="button"
                    onClick={() => setOpen(o => !o)}
                    disabled={disabled}
                    title="Choose an internal page"
                    className={`shrink-0 px-3 border border-l-0 border-admin-border text-admin-muted hover:text-primary disabled:opacity-40 transition-colors ${open ? "bg-primary/10 text-primary" : "bg-admin-bg"}`}
                >
                    <Link2 size={15} />
                </button>
            </div>
            {current && <p className="text-[10px] text-primary ml-1 mt-1 truncate">→ {current.group}: {current.label}</p>}

            {open && (
                <div className="absolute z-40 left-0 right-0 mt-1 border border-primary bg-admin-bg shadow-xl">
                    <div className="flex items-center gap-2 p-2 border-b border-admin-border">
                        <Search size={13} className="text-admin-muted shrink-0" />
                        <input
                            autoFocus
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            onKeyDown={e => { if (e.key === "Enter") e.preventDefault(); if (e.key === "Escape") setOpen(false); }}
                            placeholder="Search pages, posts, projects, locations..."
                            className="flex-1 bg-transparent text-xs text-admin-text outline-none placeholder:text-admin-muted"
                        />
                    </div>
                    <div className="max-h-72 overflow-y-auto">
                        {groups.map(([group, items]) => (
                            <div key={group}>
                                <div className="sticky top-0 bg-admin-surface px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-admin-muted border-b border-admin-border">{group}</div>
                                {items.map(l => (
                                    <button
                                        key={l.href}
                                        type="button"
                                        onClick={() => { onChange(l.href); setOpen(false); setQuery(""); }}
                                        className={`w-full px-3 py-2 text-left hover:bg-admin-surface-hover ${l.href === value ? "bg-primary/10" : ""}`}
                                    >
                                        <span className="block text-xs font-bold text-admin-text truncate">{l.label}</span>
                                        <span className="block text-[10px] font-mono text-admin-muted truncate">{l.href}</span>
                                    </button>
                                ))}
                            </div>
                        ))}
                        {groups.length === 0 && <p className="px-3 py-6 text-center text-[11px] text-admin-muted">No matches.</p>}
                    </div>
                </div>
            )}
        </div>
    );
}

/** Image URL with thumbnail preview and a Media Library picker. */
export function ImageField({ value, onChange, media, disabled }: { value: string; onChange: (v: string) => void; media: MediaOption[]; disabled?: boolean }) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const visible = useMemo(() => {
        const q = query.trim().toLowerCase();
        return q ? media.filter(m => m.label.toLowerCase().includes(q) || m.url.toLowerCase().includes(q)) : media;
    }, [media, query]);

    return (
        <div className="flex gap-3 items-start">
            <div className="shrink-0 size-[74px] border border-admin-border bg-admin-bg flex items-center justify-center overflow-hidden">
                {value ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={value} alt="" className="w-full h-full object-cover" />
                ) : (
                    <ImageIcon size={20} className="text-admin-muted" />
                )}
            </div>
            <div className="flex-1 min-w-0 space-y-2">
                <input type="text" value={value} onChange={e => onChange(e.target.value)} disabled={disabled} placeholder="https://... or /uploads/..." className={`${inputCls} font-mono text-xs`} />
                <button type="button" onClick={() => setOpen(true)} disabled={disabled || media.length === 0} className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline disabled:opacity-40 disabled:no-underline">
                    Choose from Media Library
                </button>
            </div>

            {open && typeof document !== "undefined" && createPortal(
                <div className="fixed inset-0 z-[90] bg-black/70 flex items-center justify-center p-4" onMouseDown={() => setOpen(false)}>
                    <div className="w-full max-w-4xl max-h-[85vh] flex flex-col bg-admin-surface border border-admin-border" onMouseDown={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between gap-3 p-4 border-b border-admin-border">
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-admin-text">Media Library</h3>
                            <div className="flex-1 max-w-xs flex items-center gap-2 bg-admin-bg border border-admin-border px-3 py-2">
                                <Search size={13} className="text-admin-muted" />
                                <input autoFocus value={query} onChange={e => setQuery(e.target.value)} placeholder="Search images..." className="flex-1 bg-transparent text-xs text-admin-text outline-none" />
                            </div>
                            <button type="button" onClick={() => setOpen(false)} className={iconBtn} aria-label="Close"><X size={16} /></button>
                        </div>
                        <div className="p-4 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                            {visible.map(m => (
                                <button
                                    key={m.url}
                                    type="button"
                                    onClick={() => { onChange(m.url); setOpen(false); }}
                                    className={`group text-left border bg-admin-bg hover:border-primary transition-colors ${m.url === value ? "border-primary" : "border-admin-border"}`}
                                >
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={m.url} alt={m.alt} loading="lazy" className="w-full aspect-video object-cover" />
                                    <span className="block px-2 py-1.5 text-[10px] font-bold text-admin-muted group-hover:text-admin-text truncate">{m.label}</span>
                                </button>
                            ))}
                            {visible.length === 0 && <p className="col-span-full py-10 text-center text-xs text-admin-muted">No images found.</p>}
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}

function ScalarInput({ field, value, onChange, ctx }: { field: ScalarFieldDef; value: unknown; onChange: (v: string | number) => void; ctx: FieldContext }) {
    const text = typeof value === "string" ? value : value == null ? "" : String(value);
    switch (field.type) {
        case "textarea": return <TextAreaField value={text} onChange={onChange} rows={field.rows} placeholder={field.placeholder} disabled={ctx.disabled} />;
        case "number": return <NumberField value={Number(value) || 0} onChange={onChange} disabled={ctx.disabled} />;
        case "link": return <LinkField value={text} onChange={onChange} links={ctx.links} disabled={ctx.disabled} placeholder={field.placeholder} />;
        case "image": return <ImageField value={text} onChange={onChange} media={ctx.media} disabled={ctx.disabled} />;
        default: return <TextField value={text} onChange={onChange} placeholder={field.placeholder} disabled={ctx.disabled} />;
    }
}

// ─── Repeatable lists ─────────────────────────────────────────────────────

function move<T>(arr: T[], from: number, to: number): T[] {
    if (to < 0 || to >= arr.length) return arr;
    const next = [...arr];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    return next;
}

function ItemToolbar({ index, count, onMove, onRemove, disabled }: { index: number; count: number; onMove: (to: number) => void; onRemove: () => void; disabled?: boolean }) {
    return (
        <div className="flex items-center shrink-0">
            <button type="button" className={iconBtn} disabled={disabled || index === 0} onClick={() => onMove(index - 1)} title="Move up"><ArrowUp size={13} /></button>
            <button type="button" className={iconBtn} disabled={disabled || index === count - 1} onClick={() => onMove(index + 1)} title="Move down"><ArrowDown size={13} /></button>
            <button type="button" className={`${iconBtn} hover:!text-red-500`} disabled={disabled} onClick={onRemove} title="Remove"><Trash2 size={13} /></button>
        </div>
    );
}

function AddButton({ label, onClick, disabled }: { label: string; onClick: () => void; disabled?: boolean }) {
    return (
        <button type="button" onClick={onClick} disabled={disabled} className="w-full flex items-center justify-center gap-2 border border-dashed border-admin-border hover:border-primary text-admin-muted hover:text-primary py-3 text-[10px] font-black uppercase tracking-widest transition-colors disabled:hidden">
            <Plus size={13} /> Add {label}
        </button>
    );
}

export function StringListField({ field, value, onChange, ctx }: { field: StringListFieldDef; value: unknown; onChange: (v: string[]) => void; ctx: FieldContext }) {
    const items = Array.isArray(value) ? value.map(String) : [];
    return (
        <div className="space-y-2">
            {items.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                    <span className="shrink-0 w-6 text-[10px] font-mono text-admin-muted text-right">{i + 1}.</span>
                    <input value={item} onChange={e => onChange(items.map((x, j) => (j === i ? e.target.value : x)))} disabled={ctx.disabled} className={`${inputCls} font-bold py-2.5`} />
                    <ItemToolbar index={i} count={items.length} disabled={ctx.disabled} onMove={to => onChange(move(items, i, to))} onRemove={() => onChange(items.filter((_, j) => j !== i))} />
                </div>
            ))}
            <AddButton label={field.itemLabel} disabled={ctx.disabled} onClick={() => onChange([...items, ""])} />
        </div>
    );
}

export function ObjectListField({ field, value, onChange, ctx }: { field: ListFieldDef; value: unknown; onChange: (v: Record<string, string | number>[]) => void; ctx: FieldContext }) {
    const items = (Array.isArray(value) ? value : []) as Record<string, string | number>[];
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const titleOf = (item: Record<string, string | number>, i: number) =>
        String(item[field.titleField || field.fields[0]?.name] || "").trim() || `${field.itemLabel} ${i + 1}`;
    const blank = () => Object.fromEntries(field.fields.map(f => [f.name, f.type === "number" ? 0 : ""]));

    return (
        <div className="space-y-2">
            {items.map((item, i) => {
                const open = openIndex === i;
                return (
                    <div key={i} className={`border bg-admin-bg ${open ? "border-primary/50" : "border-admin-border"}`}>
                        <div className="flex items-center gap-2 pr-1">
                            <button type="button" onClick={() => setOpenIndex(open ? null : i)} className="flex-1 min-w-0 flex items-center gap-2 px-3 py-2.5 text-left">
                                {open ? <ChevronDown size={13} className="text-primary shrink-0" /> : <ChevronRight size={13} className="text-admin-muted shrink-0" />}
                                <span className="text-[10px] font-mono text-admin-muted shrink-0">#{i + 1}</span>
                                <span className="text-xs font-bold text-admin-text truncate">{titleOf(item, i)}</span>
                            </button>
                            <ItemToolbar
                                index={i}
                                count={items.length}
                                disabled={ctx.disabled}
                                onMove={to => { onChange(move(items, i, to)); setOpenIndex(open ? to : openIndex); }}
                                onRemove={() => { onChange(items.filter((_, j) => j !== i)); setOpenIndex(null); }}
                            />
                        </div>
                        {open && (
                            <div className="border-t border-admin-border p-4 space-y-4 bg-admin-surface">
                                {field.fields.map(sub => (
                                    <FieldShell key={sub.name} label={sub.label} help={sub.help}>
                                        <ScalarInput field={sub} value={item[sub.name]} ctx={ctx} onChange={v => onChange(items.map((x, j) => (j === i ? { ...x, [sub.name]: v } : x)))} />
                                    </FieldShell>
                                ))}
                            </div>
                        )}
                    </div>
                );
            })}
            <AddButton label={field.itemLabel} disabled={ctx.disabled} onClick={() => { onChange([...items, blank()]); setOpenIndex(items.length); }} />
        </div>
    );
}

// ─── Schema-driven form ───────────────────────────────────────────────────

/** Renders the form for a section from its field definitions. */
export function SchemaForm({ fields, value, onChange, ctx }: { fields: FieldDef[]; value: Record<string, unknown>; onChange: (next: Record<string, unknown>) => void; ctx: FieldContext }) {
    const set = (name: string, v: unknown) => onChange({ ...value, [name]: v });
    return (
        <div className="space-y-6">
            {fields.map(field => (
                <FieldShell key={field.name} label={field.label} help={field.help}>
                    {field.type === "strings" ? (
                        <StringListField field={field} value={value[field.name]} onChange={v => set(field.name, v)} ctx={ctx} />
                    ) : field.type === "list" ? (
                        <ObjectListField field={field} value={value[field.name]} onChange={v => set(field.name, v)} ctx={ctx} />
                    ) : (
                        <ScalarInput field={field} value={value[field.name]} onChange={v => set(field.name, v)} ctx={ctx} />
                    )}
                </FieldShell>
            ))}
        </div>
    );
}
