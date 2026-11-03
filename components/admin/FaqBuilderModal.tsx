"use client";

import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowDown, ArrowUp, HelpCircle, Plus, Trash2, X } from "lucide-react";
import { buildFaqBlock, renderFaqHtml, DEFAULT_FAQ_TITLE, type FaqBlock, type FaqClasses, type FaqItem } from "@/lib/blogFaq";

/** Admin preview styling of a FAQ block (mirrors the public "FAQ" accordion). */
export const ADMIN_FAQ_CLASSES: FaqClasses = {
    wrapper: "my-10 border-t-[3px] border-admin-text pt-8",
    title: "text-2xl font-black uppercase text-admin-text tracking-tighter mb-6",
    list: "space-y-px bg-admin-border border border-admin-border",
    item: "group bg-admin-surface",
    summary: "flex items-center justify-between p-5 cursor-pointer font-bold text-admin-text hover:text-primary transition-colors list-none border-l-2 border-transparent group-open:border-primary",
    icon: "ml-4 shrink-0 text-primary font-black transition-transform group-open:rotate-45 text-xl leading-none",
    answer: "px-5 pb-5 text-admin-muted leading-relaxed text-sm",
    link: "text-primary font-bold underline",
    strong: "font-black text-admin-text"
};

interface FaqBuilderModalProps {
    initial: FaqBlock | null; // null = insert a new block
    onSubmit: (markdown: string) => void;
    onClose: () => void;
}

const inputCls = "w-full bg-admin-bg border border-admin-border p-3 outline-none focus:border-primary text-sm text-admin-text transition-colors";
const iconBtn = "p-1.5 text-admin-muted hover:text-admin-text disabled:opacity-30 disabled:pointer-events-none";

/** Builds/edits a FAQ block for the blog content (rendered as an accordion + FAQPage schema). */
export default function FaqBuilderModal({ initial, onSubmit, onClose }: FaqBuilderModalProps) {
    const [title, setTitle] = useState(initial?.title ?? DEFAULT_FAQ_TITLE);
    const [items, setItems] = useState<FaqItem[]>(
        initial?.items.length ? initial.items : [{ question: "", answer: "" }, { question: "", answer: "" }]
    );

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [onClose]);

    const update = (i: number, patch: Partial<FaqItem>) => setItems(list => list.map((it, j) => (j === i ? { ...it, ...patch } : it)));
    const move = (from: number, to: number) =>
        setItems(list => {
            if (to < 0 || to >= list.length) return list;
            const next = [...list];
            const [it] = next.splice(from, 1);
            next.splice(to, 0, it);
            return next;
        });

    const complete = items.filter(i => i.question.trim() && i.answer.trim());
    const incomplete = items.some(i => i.question.trim() !== "" !== (i.answer.trim() !== ""));
    const previewHtml = useMemo(() => renderFaqHtml({ title, items: complete }, ADMIN_FAQ_CLASSES), [title, complete]);

    return createPortal(
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onMouseDown={onClose}>
            <div
                role="dialog"
                aria-modal="true"
                aria-label={initial ? "Edit FAQ" : "Insert FAQ"}
                onMouseDown={e => e.stopPropagation()}
                className="bg-admin-surface border-2 border-primary w-full max-w-3xl max-h-[92vh] overflow-y-auto p-6 md:p-8 space-y-5 shadow-2xl"
            >
                <div className="flex items-center justify-between pb-4 border-b border-admin-border">
                    <h3 className="text-lg font-black uppercase tracking-tight text-admin-text flex items-center gap-2">
                        <HelpCircle size={18} className="text-primary" /> {initial ? "Edit FAQ" : "Insert FAQ"}
                    </h3>
                    <button type="button" onClick={onClose} className="p-1.5 text-admin-muted hover:text-admin-text" aria-label="Close">
                        <X size={18} />
                    </button>
                </div>

                <p className="text-[11px] text-admin-muted leading-relaxed">
                    Shown as an accordion where you insert it and added to the page&apos;s FAQ schema for Google.
                    Answers support <code className="text-primary">**bold**</code> and <code className="text-primary">[links](/quote)</code>.
                </p>

                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-admin-text">Section Heading</label>
                    <input value={title} onChange={e => setTitle(e.target.value)} placeholder={DEFAULT_FAQ_TITLE} className={`${inputCls} font-bold`} />
                </div>

                <div className="space-y-3">
                    {items.map((item, i) => (
                        <div key={i} className="border border-admin-border bg-admin-bg p-4 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black uppercase tracking-widest text-primary">Question {i + 1}</span>
                                <div className="flex items-center">
                                    <button type="button" className={iconBtn} disabled={i === 0} onClick={() => move(i, i - 1)} title="Move up"><ArrowUp size={14} /></button>
                                    <button type="button" className={iconBtn} disabled={i === items.length - 1} onClick={() => move(i, i + 1)} title="Move down"><ArrowDown size={14} /></button>
                                    <button type="button" className={`${iconBtn} hover:!text-red-500`} disabled={items.length === 1} onClick={() => setItems(list => list.filter((_, j) => j !== i))} title="Remove"><Trash2 size={14} /></button>
                                </div>
                            </div>
                            <input value={item.question} onChange={e => update(i, { question: e.target.value })} placeholder="e.g. How long does a custom food truck build take?" className={`${inputCls} font-bold`} />
                            <textarea value={item.answer} onChange={e => update(i, { answer: e.target.value })} rows={3} placeholder="Answer..." className={`${inputCls} resize-y leading-relaxed`} />
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => setItems(list => [...list, { question: "", answer: "" }])}
                        className="w-full flex items-center justify-center gap-2 border border-dashed border-admin-border hover:border-primary text-admin-muted hover:text-primary py-3 text-[10px] font-black uppercase tracking-widest transition-colors"
                    >
                        <Plus size={13} /> Add Question
                    </button>
                </div>

                {complete.length > 0 && (
                    <div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-admin-muted mb-2">Preview</div>
                        <div className="[&_.my-10]:my-0" dangerouslySetInnerHTML={{ __html: previewHtml }} />
                    </div>
                )}

                <div className="flex items-center justify-between gap-3 pt-4 border-t border-admin-border">
                    <span className="text-[10px] text-amber-500">{incomplete ? "Questions without an answer (or answers without a question) are skipped." : ""}</span>
                    <div className="flex gap-3">
                        <button type="button" onClick={onClose} className="px-5 py-3 bg-admin-bg border border-admin-border text-xs font-bold text-admin-muted hover:text-admin-text">
                            Cancel
                        </button>
                        <button
                            type="button"
                            disabled={complete.length === 0}
                            onClick={() => onSubmit(buildFaqBlock({ title, items: complete }))}
                            className="px-8 py-3 bg-primary hover:bg-orange-600 text-black text-xs font-black uppercase tracking-widest transition-colors disabled:opacity-50"
                        >
                            {initial ? "Update FAQ" : "Insert FAQ"}
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}
