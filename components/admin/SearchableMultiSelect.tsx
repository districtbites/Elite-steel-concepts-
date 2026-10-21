"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Search, ChevronDown, Check, X } from "lucide-react";

export interface MultiSelectItem {
    id: string;
    label: string;
    sublabel?: string;
}

interface SearchableMultiSelectProps {
    items: MultiSelectItem[];
    selectedIds: string[];
    onChange: (ids: string[]) => void;
    name?: string;            // submitted as repeated hidden inputs
    emptySummary: string;     // button text when nothing is selected
    noun?: [string, string];  // singular / plural, e.g. ["post", "posts"]
    searchPlaceholder?: string;
    emptyText?: string;       // shown when `items` is empty
    chipIcon?: React.ReactNode;
}

/** Dropdown with search, multi-select checkboxes, select-all/clear and removable chips. */
export default function SearchableMultiSelect({
    items,
    selectedIds,
    onChange,
    name,
    emptySummary,
    noun = ["item", "items"],
    searchPlaceholder = "Search...",
    emptyText = "Nothing to select.",
    chipIcon
}: SearchableMultiSelectProps) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const rootRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLInputElement>(null);

    // Close on outside click / Escape
    useEffect(() => {
        if (!open) return;
        const onMouseDown = (e: MouseEvent) => {
            if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
        };
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                e.stopPropagation();
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", onMouseDown);
        document.addEventListener("keydown", onKeyDown);
        searchRef.current?.focus();
        return () => {
            document.removeEventListener("mousedown", onMouseDown);
            document.removeEventListener("keydown", onKeyDown);
        };
    }, [open]);

    const visibleItems = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return items;
        return items.filter(
            i => i.label.toLowerCase().includes(q) || (i.sublabel || "").toLowerCase().includes(q)
        );
    }, [items, query]);

    const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);
    const selectedItems = useMemo(
        () => selectedIds.map(id => items.find(i => i.id === id)).filter(Boolean) as MultiSelectItem[],
        [selectedIds, items]
    );

    const toggle = (id: string) => {
        onChange(selectedSet.has(id) ? selectedIds.filter(x => x !== id) : [...selectedIds, id]);
    };

    const allVisibleSelected = visibleItems.length > 0 && visibleItems.every(i => selectedSet.has(i.id));
    const toggleAllVisible = () => {
        if (allVisibleSelected) {
            const visibleIds = new Set(visibleItems.map(i => i.id));
            onChange(selectedIds.filter(id => !visibleIds.has(id)));
        } else {
            onChange(Array.from(new Set([...selectedIds, ...visibleItems.map(i => i.id)])));
        }
    };

    const summary =
        selectedIds.length === 0
            ? emptySummary
            : `${selectedIds.length} ${selectedIds.length === 1 ? noun[0] : noun[1]} selected`;

    return (
        <div ref={rootRef}>
            {name && selectedIds.map(id => <input key={id} type="hidden" name={name} value={id} />)}

            <button
                type="button"
                onClick={() => setOpen(o => !o)}
                aria-expanded={open}
                className={`w-full flex items-center justify-between gap-2 bg-admin-bg border p-3 text-xs font-bold text-left outline-none transition-colors ${
                    open ? "border-primary" : "border-admin-border hover:border-admin-border-hover"
                }`}
            >
                <span className={selectedIds.length ? "text-admin-text" : "text-admin-muted"}>{summary}</span>
                <ChevronDown size={14} className={`text-admin-muted transition-transform ${open ? "rotate-180" : ""}`} />
            </button>

            {open && (
                <div className="mt-1 border border-primary bg-admin-bg shadow-xl">
                    <div className="flex items-center gap-2 p-2 border-b border-admin-border">
                        <Search size={13} className="text-admin-muted shrink-0" />
                        <input
                            ref={searchRef}
                            type="text"
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            onKeyDown={e => {
                                if (e.key === "Enter") e.preventDefault();
                            }}
                            placeholder={searchPlaceholder}
                            className="flex-1 bg-transparent text-xs text-admin-text outline-none placeholder:text-admin-muted"
                        />
                        {query && (
                            <button type="button" onClick={() => setQuery("")} className="text-admin-muted hover:text-admin-text">
                                <X size={13} />
                            </button>
                        )}
                    </div>

                    <div className="flex items-center justify-between px-3 py-2 border-b border-admin-border text-[10px] font-black uppercase tracking-widest">
                        <button
                            type="button"
                            onClick={toggleAllVisible}
                            disabled={visibleItems.length === 0}
                            className="text-primary hover:underline disabled:opacity-40 disabled:no-underline"
                        >
                            {allVisibleSelected ? "Deselect" : "Select"} all ({visibleItems.length})
                        </button>
                        {selectedIds.length > 0 && (
                            <button type="button" onClick={() => onChange([])} className="text-admin-muted hover:text-red-400">
                                Clear
                            </button>
                        )}
                    </div>

                    <ul className="max-h-56 overflow-y-auto" role="listbox" aria-multiselectable="true">
                        {visibleItems.map(item => {
                            const checked = selectedSet.has(item.id);
                            return (
                                <li key={item.id}>
                                    <button
                                        type="button"
                                        role="option"
                                        aria-selected={checked}
                                        onClick={() => toggle(item.id)}
                                        className={`w-full flex items-start gap-3 px-3 py-2 text-left transition-colors ${
                                            checked ? "bg-primary/10" : "hover:bg-admin-surface"
                                        }`}
                                    >
                                        <span
                                            className={`mt-0.5 w-4 h-4 shrink-0 border flex items-center justify-center ${
                                                checked ? "bg-primary border-primary text-black" : "border-admin-border"
                                            }`}
                                        >
                                            {checked && <Check size={11} strokeWidth={3} />}
                                        </span>
                                        <span className="min-w-0 flex-1">
                                            <span className="block text-xs font-bold text-admin-text truncate">{item.label}</span>
                                            {item.sublabel && (
                                                <span className="block text-[10px] font-mono text-admin-muted truncate">{item.sublabel}</span>
                                            )}
                                        </span>
                                    </button>
                                </li>
                            );
                        })}
                        {visibleItems.length === 0 && (
                            <li className="px-3 py-6 text-center text-[11px] text-admin-muted">
                                {items.length === 0 ? emptyText : "No results match your search."}
                            </li>
                        )}
                    </ul>
                </div>
            )}

            {selectedItems.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                    {selectedItems.map(item => (
                        <span
                            key={item.id}
                            className="inline-flex items-center gap-1.5 max-w-full bg-primary/10 border border-primary/40 text-primary px-2 py-1 text-[10px] font-bold"
                        >
                            {chipIcon}
                            <span className="truncate max-w-[220px]">{item.label}</span>
                            <button
                                type="button"
                                onClick={() => toggle(item.id)}
                                className="hover:text-admin-text shrink-0"
                                aria-label={`Remove ${item.label}`}
                            >
                                <X size={10} />
                            </button>
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}
