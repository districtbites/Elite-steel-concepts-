"use client";

import React, { useState } from "react";
import { createPortal } from "react-dom";
import {
    AlignLeft, ArrowDown, ArrowUp, BarChart3, ChevronDown, ChevronRight, Columns2, Copy, Eye, EyeOff,
    HelpCircle, Image as ImageIcon, LayoutGrid, Megaphone, Plus, Quote, Trash2, X, type LucideIcon
} from "lucide-react";
import {
    BLUEPRINTS, BLOCK_LAYOUT, blockFields, blockFromBlueprint, newBlockId,
    type BlockTheme, type BlockType, type CustomBlock
} from "@/lib/pageContent/blocks";
import { SchemaForm, labelCls, type FieldContext } from "./fields";

const BLUEPRINT_ICONS: Record<string, LucideIcon> = { LayoutGrid, BarChart3, Columns2, Megaphone, HelpCircle, Quote, Image: ImageIcon, AlignLeft };
const typeMeta = (type: BlockType) => BLUEPRINTS.find(b => b.type === type)!;

const THEMES: { id: BlockTheme; label: string; swatch: string }[] = [
    { id: "light", label: "Light", swatch: "bg-white" },
    { id: "muted", label: "Muted", swatch: "bg-[#F4F4F4]" },
    { id: "dark", label: "Dark", swatch: "bg-[#0a0a0a]" }
];

const iconBtn = "p-2 text-admin-muted hover:text-admin-text hover:bg-admin-surface-hover disabled:opacity-30 disabled:pointer-events-none transition-colors";

function Segmented<T extends string | number>({ label, options, value, onChange, disabled }: {
    label: string; options: { id: T; label: React.ReactNode }[]; value: T; onChange: (v: T) => void; disabled?: boolean;
}) {
    return (
        <div className="space-y-2">
            <span className={labelCls}>{label}</span>
            <div className="flex border border-admin-border w-fit">
                {options.map(o => (
                    <button
                        key={String(o.id)}
                        type="button"
                        disabled={disabled}
                        onClick={() => onChange(o.id)}
                        className={`flex items-center gap-2 px-3.5 py-2 text-[10px] font-black uppercase tracking-widest border-r last:border-r-0 border-admin-border transition-colors disabled:cursor-not-allowed ${
                            value === o.id ? "bg-primary text-black" : "bg-admin-bg text-admin-muted hover:text-admin-text"
                        }`}
                    >
                        {o.label}
                    </button>
                ))}
            </div>
        </div>
    );
}

function BlueprintLibrary({ onPick, onClose }: { onPick: (type: BlockType) => void; onClose: () => void }) {
    return createPortal(
        <div className="fixed inset-0 z-[90] bg-black/70 flex items-center justify-center p-4" onMouseDown={onClose}>
            <div className="w-full max-w-3xl max-h-[88vh] overflow-y-auto bg-admin-surface border border-admin-border" onMouseDown={e => e.stopPropagation()}>
                <div className="flex items-center justify-between p-5 border-b border-admin-border sticky top-0 bg-admin-surface">
                    <div>
                        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-admin-text">Add Section</h3>
                        <p className="text-[11px] text-admin-muted mt-1">Pick a blueprint. It starts with sample content you can edit.</p>
                    </div>
                    <button type="button" onClick={onClose} className={iconBtn} aria-label="Close"><X size={16} /></button>
                </div>
                <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {BLUEPRINTS.map(bp => {
                        const Icon = BLUEPRINT_ICONS[bp.icon] || LayoutGrid;
                        return (
                            <button
                                key={bp.type}
                                type="button"
                                onClick={() => onPick(bp.type)}
                                className="group flex items-start gap-4 p-4 text-left border border-admin-border bg-admin-bg hover:border-primary transition-colors"
                            >
                                <span className="shrink-0 size-10 flex items-center justify-center bg-primary/10 border border-primary/30 text-primary group-hover:bg-primary group-hover:text-black transition-colors">
                                    <Icon size={18} />
                                </span>
                                <span>
                                    <span className="block text-xs font-black uppercase tracking-wider text-admin-text">{bp.name}</span>
                                    <span className="block text-[11px] text-admin-muted mt-1 leading-relaxed">{bp.description}</span>
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>,
        document.body
    );
}

/** Ordered list of modular blocks for one page. */
export default function CustomSectionsBuilder({ value, onChange, ctx }: { value: CustomBlock[]; onChange: (blocks: CustomBlock[]) => void; ctx: FieldContext }) {
    const [openId, setOpenId] = useState<string | null>(null);
    const [libraryOpen, setLibraryOpen] = useState(false);
    const disabled = ctx.disabled;

    const update = (id: string, patch: Partial<CustomBlock>) => onChange(value.map(b => (b.id === id ? { ...b, ...patch } : b)));
    const moveBlock = (from: number, to: number) => {
        if (to < 0 || to >= value.length) return;
        const next = [...value];
        const [b] = next.splice(from, 1);
        next.splice(to, 0, b);
        onChange(next);
    };
    const add = (type: BlockType) => {
        const block = blockFromBlueprint(type);
        onChange([...value, block]);
        setOpenId(block.id);
        setLibraryOpen(false);
    };
    const duplicate = (i: number) => {
        const copy = { ...structuredClone(value[i]), id: newBlockId(), title: value[i].title ? `${value[i].title} (copy)` : "" };
        onChange([...value.slice(0, i + 1), copy, ...value.slice(i + 1)]);
        setOpenId(copy.id);
    };
    const remove = (block: CustomBlock) => {
        if (!confirm(`Delete the "${block.title || typeMeta(block.type).name}" section? This is applied when you save.`)) return;
        onChange(value.filter(b => b.id !== block.id));
    };

    return (
        <div className="space-y-3">
            {value.length === 0 && (
                <div className="border border-dashed border-admin-border p-10 text-center">
                    <LayoutGrid size={28} className="mx-auto text-admin-muted mb-3" />
                    <p className="text-sm font-bold text-admin-text">No custom sections yet</p>
                    <p className="text-[11px] text-admin-muted mt-1">Add feature grids, stats, image + text, FAQs and more below this page&apos;s fixed sections.</p>
                </div>
            )}

            {value.map((block, i) => {
                const meta = typeMeta(block.type);
                const Icon = BLUEPRINT_ICONS[meta.icon] || LayoutGrid;
                const open = openId === block.id;
                const layout = BLOCK_LAYOUT[block.type];
                return (
                    <div key={block.id} className={`border bg-admin-surface transition-colors ${open ? "border-primary/60" : "border-admin-border"} ${block.enabled ? "" : "opacity-60"}`}>
                        <div className="flex items-center gap-2 pr-2">
                            <button type="button" onClick={() => setOpenId(open ? null : block.id)} className="flex-1 min-w-0 flex items-center gap-3 p-4 text-left">
                                {open ? <ChevronDown size={14} className="text-primary shrink-0" /> : <ChevronRight size={14} className="text-admin-muted shrink-0" />}
                                <span className="shrink-0 size-8 flex items-center justify-center bg-primary/10 text-primary"><Icon size={15} /></span>
                                <span className="min-w-0">
                                    <span className="block text-[9px] font-black uppercase tracking-widest text-primary">{meta.name}</span>
                                    <span className="block text-sm font-bold text-admin-text truncate">{block.title || <em className="text-admin-muted font-medium">Untitled</em>}</span>
                                </span>
                                {!block.enabled && <span className="ml-auto shrink-0 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 border border-admin-border text-admin-muted">Hidden</span>}
                            </button>
                            <div className="flex items-center shrink-0">
                                <button type="button" className={iconBtn} disabled={disabled || i === 0} onClick={() => moveBlock(i, i - 1)} title="Move up"><ArrowUp size={14} /></button>
                                <button type="button" className={iconBtn} disabled={disabled || i === value.length - 1} onClick={() => moveBlock(i, i + 1)} title="Move down"><ArrowDown size={14} /></button>
                                <button type="button" className={iconBtn} disabled={disabled} onClick={() => duplicate(i)} title="Duplicate"><Copy size={14} /></button>
                                <button type="button" className={iconBtn} disabled={disabled} onClick={() => update(block.id, { enabled: !block.enabled })} title={block.enabled ? "Hide on site" : "Show on site"}>
                                    {block.enabled ? <Eye size={14} /> : <EyeOff size={14} />}
                                </button>
                                <button type="button" className={`${iconBtn} hover:!text-red-500`} disabled={disabled} onClick={() => remove(block)} title="Delete"><Trash2 size={14} /></button>
                            </div>
                        </div>

                        {open && (
                            <div className="border-t border-admin-border p-6 space-y-8">
                                <div className="flex flex-wrap gap-6">
                                    <Segmented
                                        label="Theme"
                                        disabled={disabled}
                                        value={block.theme}
                                        onChange={theme => update(block.id, { theme })}
                                        options={THEMES.map(t => ({ id: t.id, label: <><span className={`size-3 border border-admin-border ${t.swatch}`} />{t.label}</> }))}
                                    />
                                    {layout.columns && (
                                        <Segmented
                                            label="Columns"
                                            disabled={disabled}
                                            value={block.columns}
                                            onChange={columns => update(block.id, { columns })}
                                            options={[2, 3, 4].map(n => ({ id: n as 2 | 3 | 4, label: n }))}
                                        />
                                    )}
                                    {layout.imagePosition && (
                                        <Segmented
                                            label="Image Position"
                                            disabled={disabled}
                                            value={block.imagePosition}
                                            onChange={imagePosition => update(block.id, { imagePosition })}
                                            options={[{ id: "left" as const, label: "Left" }, { id: "right" as const, label: "Right" }]}
                                        />
                                    )}
                                </div>
                                <SchemaForm
                                    fields={blockFields(block.type)}
                                    value={block as unknown as Record<string, unknown>}
                                    onChange={next => update(block.id, next as Partial<CustomBlock>)}
                                    ctx={ctx}
                                />
                            </div>
                        )}
                    </div>
                );
            })}

            {!disabled && (
                <button
                    type="button"
                    onClick={() => setLibraryOpen(true)}
                    className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-admin-border hover:border-primary text-admin-muted hover:text-primary py-5 text-[11px] font-black uppercase tracking-widest transition-colors"
                >
                    <Plus size={15} /> Add Section
                </button>
            )}

            {libraryOpen && <BlueprintLibrary onPick={add} onClose={() => setLibraryOpen(false)} />}
        </div>
    );
}
