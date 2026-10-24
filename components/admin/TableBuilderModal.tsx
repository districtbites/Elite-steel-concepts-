"use client";

import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { X, Plus, Trash2, AlignLeft, AlignCenter, AlignRight, ClipboardPaste, Table as TableIcon } from "lucide-react";
import {
    buildMarkdownTable,
    parseMarkdownTable,
    renderTableHtml,
    type MarkdownTable,
    type TableAlign,
    type TableClasses
} from "@/lib/markdownTable";

/** Table styling inside the admin preview panes. */
export const ADMIN_TABLE_CLASSES: TableClasses = {
    wrapper: "my-8 overflow-x-auto border border-admin-border",
    table: "w-full border-collapse text-sm",
    thead: "bg-admin-bg",
    th: "px-4 py-3 text-[10px] font-black uppercase tracking-widest text-admin-text border-b-2 border-primary whitespace-nowrap",
    tr: "border-b border-admin-border last:border-0",
    td: "px-4 py-2.5 text-admin-muted align-top",
    totalRow: "font-black text-admin-text bg-primary/10"
};

interface TableBuilderModalProps {
    initial: MarkdownTable | null; // null = new table
    onSubmit: (markdown: string) => void;
    onClose: () => void;
}

const MAX_COLS = 8;
const MAX_ROWS = 50;

const emptyTable = (cols = 3, rows = 3): MarkdownTable => ({
    headers: Array.from({ length: cols }, (_, i) => `Column ${i + 1}`),
    aligns: Array.from({ length: cols }, () => "left" as TableAlign),
    rows: Array.from({ length: rows }, () => Array.from({ length: cols }, () => ""))
});

/** Parses text pasted from Excel / Google Sheets (tab separated), CSV, or an existing markdown table. */
function parsePasted(text: string): MarkdownTable | null {
    const lines = text.replace(/\r\n?/g, "\n").split("\n").filter(l => l.trim() !== "");
    if (lines.length === 0) return null;

    const asMarkdown = parseMarkdownTable(lines);
    if (asMarkdown) return asMarkdown;

    const delimiter = lines[0].includes("\t") ? "\t" : ",";
    const grid = lines.map(l => l.split(delimiter).map(c => c.trim().replace(/^"(.*)"$/, "$1")));
    const cols = Math.min(MAX_COLS, Math.max(...grid.map(r => r.length)));
    const fit = (r: string[]) => Array.from({ length: cols }, (_, i) => r[i] ?? "");
    return {
        headers: fit(grid[0]),
        aligns: Array.from({ length: cols }, () => "left" as TableAlign),
        rows: grid.slice(1, MAX_ROWS + 1).map(fit)
    };
}

export default function TableBuilderModal({ initial, onSubmit, onClose }: TableBuilderModalProps) {
    const [table, setTable] = useState<MarkdownTable>(() => initial ?? emptyTable());
    const [showPaste, setShowPaste] = useState(false);
    const [pasteText, setPasteText] = useState("");
    const [pasteError, setPasteError] = useState<string | null>(null);

    const cols = table.headers.length;

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [onClose]);

    const setHeader = (c: number, v: string) =>
        setTable(t => ({ ...t, headers: t.headers.map((h, i) => (i === c ? v : h)) }));
    const setCell = (r: number, c: number, v: string) =>
        setTable(t => ({ ...t, rows: t.rows.map((row, ri) => (ri === r ? row.map((x, ci) => (ci === c ? v : x)) : row)) }));
    const setAlign = (c: number, a: TableAlign) =>
        setTable(t => ({ ...t, aligns: t.aligns.map((x, i) => (i === c ? a : x)) }));

    const addRow = (after = table.rows.length - 1) =>
        setTable(t => {
            if (t.rows.length >= MAX_ROWS) return t;
            const rows = [...t.rows];
            rows.splice(after + 1, 0, Array.from({ length: t.headers.length }, () => ""));
            return { ...t, rows };
        });
    const removeRow = (r: number) => setTable(t => ({ ...t, rows: t.rows.filter((_, i) => i !== r) }));
    const addColumn = () =>
        setTable(t =>
            t.headers.length >= MAX_COLS
                ? t
                : {
                      headers: [...t.headers, `Column ${t.headers.length + 1}`],
                      aligns: [...t.aligns, "left"],
                      rows: t.rows.map(r => [...r, ""])
                  }
        );
    const removeColumn = (c: number) =>
        setTable(t =>
            t.headers.length <= 1
                ? t
                : {
                      headers: t.headers.filter((_, i) => i !== c),
                      aligns: t.aligns.filter((_, i) => i !== c),
                      rows: t.rows.map(r => r.filter((_, i) => i !== c))
                  }
        );

    const applyPaste = () => {
        const parsed = parsePasted(pasteText);
        if (!parsed || parsed.headers.length === 0) {
            setPasteError("Couldn't read a table from that text.");
            return;
        }
        setTable(parsed);
        setShowPaste(false);
        setPasteText("");
        setPasteError(null);
    };

    const hasContent = table.headers.some(h => h.trim());
    const previewHtml = useMemo(
        () => renderTableHtml(table, { ...ADMIN_TABLE_CLASSES, wrapper: "overflow-x-auto border border-admin-border" }),
        [table]
    );

    const cellInput = "w-full min-w-[110px] bg-admin-bg border border-admin-border px-2.5 py-2 text-xs text-admin-text outline-none focus:border-primary";
    const alignButtons: { a: TableAlign; icon: React.ReactNode; label: string }[] = [
        { a: "left", icon: <AlignLeft size={11} />, label: "Align left" },
        { a: "center", icon: <AlignCenter size={11} />, label: "Align center" },
        { a: "right", icon: <AlignRight size={11} />, label: "Align right (numbers)" }
    ];

    // Portal: the editor lives inside a <form>, and Enter in a cell must not submit the post
    return createPortal(
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onMouseDown={onClose}>
            <div
                role="dialog"
                aria-modal="true"
                aria-label={initial ? "Edit table" : "Insert table"}
                onMouseDown={e => e.stopPropagation()}
                className="bg-admin-surface border-2 border-primary w-full max-w-4xl max-h-[92vh] overflow-y-auto p-6 md:p-8 space-y-5 shadow-2xl"
            >
                <div className="flex items-center justify-between pb-4 border-b border-admin-border">
                    <h3 className="text-lg font-black uppercase tracking-tight text-admin-text flex items-center gap-2">
                        <TableIcon size={18} className="text-primary" /> {initial ? "Edit Table" : "Insert Table"}
                    </h3>
                    <button type="button" onClick={onClose} className="p-1.5 text-admin-muted hover:text-admin-text" aria-label="Close">
                        <X size={18} />
                    </button>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <button type="button" onClick={() => addRow()} disabled={table.rows.length >= MAX_ROWS}
                        className="inline-flex items-center gap-1.5 px-3 py-2 bg-admin-bg border border-admin-border text-[10px] font-black uppercase tracking-widest text-admin-text hover:border-primary disabled:opacity-40">
                        <Plus size={12} /> Row
                    </button>
                    <button type="button" onClick={addColumn} disabled={cols >= MAX_COLS}
                        className="inline-flex items-center gap-1.5 px-3 py-2 bg-admin-bg border border-admin-border text-[10px] font-black uppercase tracking-widest text-admin-text hover:border-primary disabled:opacity-40">
                        <Plus size={12} /> Column
                    </button>
                    <button type="button" onClick={() => setShowPaste(s => !s)}
                        className={`inline-flex items-center gap-1.5 px-3 py-2 border text-[10px] font-black uppercase tracking-widest ${showPaste ? "bg-primary text-black border-primary" : "bg-admin-bg border-admin-border text-admin-text hover:border-primary"}`}>
                        <ClipboardPaste size={12} /> Paste from Excel / Sheets
                    </button>
                    <span className="ml-auto text-[10px] font-bold uppercase tracking-widest text-admin-muted">
                        {cols} col{cols === 1 ? "" : "s"} × {table.rows.length} row{table.rows.length === 1 ? "" : "s"}
                    </span>
                </div>

                {showPaste && (
                    <div className="space-y-2 p-3 border border-admin-border bg-admin-bg">
                        <p className="text-[11px] text-admin-muted">
                            Copy cells from Excel or Google Sheets (or paste CSV / a markdown table). The first line becomes the header row.
                        </p>
                        <textarea
                            value={pasteText}
                            onChange={e => setPasteText(e.target.value)}
                            rows={5}
                            autoFocus
                            placeholder={"Equipment\tWatts\nFryer\t3000 W\nGriddle\t2500 W"}
                            className="w-full bg-admin-surface border border-admin-border p-3 text-xs font-mono text-admin-text outline-none focus:border-primary"
                        />
                        {pasteError && <p className="text-[11px] text-red-400">{pasteError}</p>}
                        <button type="button" onClick={applyPaste} disabled={!pasteText.trim()}
                            className="px-4 py-2 bg-primary text-black text-[10px] font-black uppercase tracking-widest disabled:opacity-40">
                            Use Pasted Data
                        </button>
                    </div>
                )}

                {/* Grid editor */}
                <div className="overflow-x-auto border border-admin-border">
                    <table className="border-collapse">
                        <thead>
                            <tr className="bg-admin-bg">
                                {table.headers.map((h, c) => (
                                    <th key={c} className="p-2 align-top border-b-2 border-primary">
                                        <div className="flex items-center justify-between gap-1 mb-1.5">
                                            <div className="flex">
                                                {alignButtons.map(b => (
                                                    <button key={b.a} type="button" title={b.label} aria-label={b.label}
                                                        onClick={() => setAlign(c, b.a)}
                                                        className={`p-1 border ${table.aligns[c] === b.a ? "bg-primary text-black border-primary" : "border-admin-border text-admin-muted hover:text-admin-text"}`}>
                                                        {b.icon}
                                                    </button>
                                                ))}
                                            </div>
                                            <button type="button" onClick={() => removeColumn(c)} disabled={cols <= 1}
                                                title="Delete column" aria-label={`Delete column ${c + 1}`}
                                                className="p-1 text-admin-muted hover:text-red-400 disabled:opacity-30">
                                                <Trash2 size={11} />
                                            </button>
                                        </div>
                                        <input value={h} onChange={e => setHeader(c, e.target.value)}
                                            placeholder={`Header ${c + 1}`} aria-label={`Header ${c + 1}`}
                                            className={`${cellInput} font-black uppercase tracking-wide`} />
                                    </th>
                                ))}
                                <th className="w-10" />
                            </tr>
                        </thead>
                        <tbody>
                            {table.rows.map((row, r) => (
                                <tr key={r} className="border-b border-admin-border last:border-0">
                                    {row.map((cell, c) => (
                                        <td key={c} className="p-2">
                                            <input value={cell} onChange={e => setCell(r, c, e.target.value)}
                                                aria-label={`Row ${r + 1}, ${table.headers[c] || `column ${c + 1}`}`}
                                                style={{ textAlign: table.aligns[c] }}
                                                className={cellInput} />
                                        </td>
                                    ))}
                                    <td className="p-2 whitespace-nowrap">
                                        <button type="button" onClick={() => addRow(r)} title="Insert row below" aria-label={`Insert row below row ${r + 1}`}
                                            className="p-1 text-admin-muted hover:text-primary"><Plus size={12} /></button>
                                        <button type="button" onClick={() => removeRow(r)} title="Delete row" aria-label={`Delete row ${r + 1}`}
                                            className="p-1 text-admin-muted hover:text-red-400"><Trash2 size={12} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <p className="text-[10px] text-admin-muted">
                    Tip: use right alignment for numbers and prices. A last row starting with &quot;Total&quot; is highlighted automatically.
                    Use **text** for bold.
                </p>

                {/* Live preview */}
                <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-admin-muted mb-2">Preview</div>
                    <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-admin-border">
                    <button type="button" onClick={onClose}
                        className="px-5 py-3 bg-admin-bg border border-admin-border text-xs font-bold text-admin-muted hover:text-admin-text">
                        Cancel
                    </button>
                    <button type="button" disabled={!hasContent} onClick={() => onSubmit(buildMarkdownTable(table))}
                        className="px-8 py-3 bg-primary hover:bg-orange-600 text-black text-xs font-black uppercase tracking-widest transition-colors disabled:opacity-50">
                        {initial ? "Update Table" : "Insert Table"}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
