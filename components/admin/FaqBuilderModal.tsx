"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowDown, ArrowUp, Bold, HelpCircle, Link as LinkIcon, List, ListOrdered, Plus, Trash2, X } from "lucide-react";
import { buildFaqBlock, DEFAULT_FAQ_TITLE, type FaqBlock, type FaqItem } from "@/lib/blogFaq";
import { renderFaqBlock } from "@/lib/blogMarkdown";
import { ADMIN_PREVIEW_CLASSES } from "@/components/admin/blogPreviewClasses";

type AnswerFormat = "bullets" | "numbers" | "bold" | "link";

const ANSWER_TOOLS: { format: AnswerFormat; icon: React.ReactNode; title: string }[] = [
    { format: "bullets", icon: <List size={13} />, title: "Bullet list" },
    { format: "numbers", icon: <ListOrdered size={13} />, title: "Numbered list" },
    { format: "bold", icon: <Bold size={13} />, title: "Bold" },
    { format: "link", icon: <LinkIcon size={13} />, title: "Link" }
];

/** Applies a format to the selected text (or the current line for lists); returns the new text and selection. */
function formatAnswer(text: string, start: number, end: number, format: AnswerFormat) {
    if (format === "bold" || format === "link") {
        const selected = text.slice(start, end) || (format === "bold" ? "bold text" : "link text");
        const insert = format === "bold" ? `**${selected}**` : `[${selected}](/quote)`;
        const selStart = start + (format === "bold" ? 2 : 1);
        return { text: text.slice(0, start) + insert + text.slice(end), selStart, selEnd: selStart + selected.length };
    }
    // Lists work on whole lines: every selected line becomes an item ("- " or "1. ", "2. "…)
    const lineStart = text.lastIndexOf("\n", start - 1) + 1;
    const nextBreak = text.indexOf("\n", end);
    const lineEnd = nextBreak === -1 ? text.length : nextBreak;
    const lines = text.slice(lineStart, lineEnd).split("\n").map(l => l.replace(/^\s*(?:[-*+]|\d{1,4}[.)])\s+/, ""));
    const listed = lines.map((l, i) => (format === "bullets" ? `- ${l}` : `${i + 1}. ${l}`)).join("\n");
    const caret = lineStart + listed.length;
    return { text: text.slice(0, lineStart) + listed + text.slice(lineEnd), selStart: caret, selEnd: caret };
}


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
    const previewHtml = useMemo(() => renderFaqBlock({ title, items: complete }, ADMIN_PREVIEW_CLASSES, undefined, "faq-preview"), [title, complete]);

    const answerRefs = useRef<(HTMLTextAreaElement | null)[]>([]);
    const applyFormat = (i: number, format: AnswerFormat) => {
        const el = answerRefs.current[i];
        const value = items[i].answer;
        const { text, selStart, selEnd } = formatAnswer(value, el?.selectionStart ?? value.length, el?.selectionEnd ?? value.length, format);
        update(i, { answer: text });
        requestAnimationFrame(() => {
            el?.focus();
            el?.setSelectionRange(selStart, selEnd);
        });
    };

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
                    Answers support <code className="text-primary">**bold**</code>, <code className="text-primary">[links](/quote)</code>,
                    <code className="text-primary">- bullets</code> and <code className="text-primary">1. numbered</code> lists (one item per line).
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
                            <div>
                                <div className="flex items-center gap-0.5 border border-b-0 border-admin-border bg-admin-surface px-1.5 py-1">
                                    {ANSWER_TOOLS.map(tool => (
                                        <button key={tool.format} type="button" title={tool.title} onMouseDown={e => e.preventDefault()} onClick={() => applyFormat(i, tool.format)} className={iconBtn}>
                                            {tool.icon}
                                        </button>
                                    ))}
                                    <span className="ml-auto pr-1 text-[9px] font-bold uppercase tracking-widest text-admin-muted">One item per line</span>
                                </div>
                                <textarea
                                    ref={el => { answerRefs.current[i] = el; }}
                                    value={item.answer}
                                    onChange={e => update(i, { answer: e.target.value })}
                                    rows={4}
                                    placeholder={"Answer...\n- Bullet point\n1. Numbered point"}
                                    className={`${inputCls} resize-y leading-relaxed`}
                                />
                            </div>
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
