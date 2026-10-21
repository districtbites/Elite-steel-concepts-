"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Search, ChevronDown, Check, X, FileText } from "lucide-react";

export interface PickablePost {
    id: string;
    title: string;
    slug: string;
    category: string;
    status: "Published" | "Draft";
}

interface BlogPostMultiSelectProps {
    posts: PickablePost[];
    category: string; // "All" shows every post
    selectedIds: string[];
    onChange: (ids: string[]) => void;
    name?: string; // hidden input name submitted with the form
}

export default function BlogPostMultiSelect({
    posts,
    category,
    selectedIds,
    onChange,
    name = "targetPostIds"
}: BlogPostMultiSelectProps) {
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

    const categoryPosts = useMemo(
        () => (category === "All" ? posts : posts.filter(p => p.category === category)),
        [posts, category]
    );

    const visiblePosts = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return categoryPosts;
        return categoryPosts.filter(
            p => p.title.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q)
        );
    }, [categoryPosts, query]);

    const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);
    const selectedPosts = useMemo(
        () => selectedIds.map(id => posts.find(p => p.id === id)).filter(Boolean) as PickablePost[],
        [selectedIds, posts]
    );

    const toggle = (id: string) => {
        onChange(selectedSet.has(id) ? selectedIds.filter(x => x !== id) : [...selectedIds, id]);
    };

    const allVisibleSelected = visiblePosts.length > 0 && visiblePosts.every(p => selectedSet.has(p.id));
    const toggleAllVisible = () => {
        if (allVisibleSelected) {
            const visibleIds = new Set(visiblePosts.map(p => p.id));
            onChange(selectedIds.filter(id => !visibleIds.has(id)));
        } else {
            onChange(Array.from(new Set([...selectedIds, ...visiblePosts.map(p => p.id)])));
        }
    };

    const summary =
        selectedIds.length === 0
            ? `All ${categoryPosts.length} ${category === "All" ? "blog posts" : `"${category}" posts`}`
            : `${selectedIds.length} post${selectedIds.length === 1 ? "" : "s"} selected`;

    return (
        <div ref={rootRef}>
            {selectedIds.map(id => (
                <input key={id} type="hidden" name={name} value={id} />
            ))}

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
                            placeholder="Search blogs by title or slug..."
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
                            disabled={visiblePosts.length === 0}
                            className="text-primary hover:underline disabled:opacity-40 disabled:no-underline"
                        >
                            {allVisibleSelected ? "Deselect" : "Select"} all ({visiblePosts.length})
                        </button>
                        {selectedIds.length > 0 && (
                            <button type="button" onClick={() => onChange([])} className="text-admin-muted hover:text-red-400">
                                Clear
                            </button>
                        )}
                    </div>

                    <ul className="max-h-56 overflow-y-auto" role="listbox" aria-multiselectable="true">
                        {visiblePosts.map(p => {
                            const checked = selectedSet.has(p.id);
                            return (
                                <li key={p.id}>
                                    <button
                                        type="button"
                                        role="option"
                                        aria-selected={checked}
                                        onClick={() => toggle(p.id)}
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
                                            <span className="block text-xs font-bold text-admin-text truncate">{p.title}</span>
                                            <span className="block text-[10px] font-mono text-admin-muted truncate">
                                                /{p.slug}
                                                {category === "All" && p.category ? ` · ${p.category}` : ""}
                                                {p.status === "Draft" ? " · Draft" : ""}
                                            </span>
                                        </span>
                                    </button>
                                </li>
                            );
                        })}
                        {visiblePosts.length === 0 && (
                            <li className="px-3 py-6 text-center text-[11px] text-admin-muted">
                                {categoryPosts.length === 0 ? "No blog posts in this category." : "No blogs match your search."}
                            </li>
                        )}
                    </ul>
                </div>
            )}

            {selectedPosts.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                    {selectedPosts.map(p => (
                        <span
                            key={p.id}
                            className="inline-flex items-center gap-1.5 max-w-full bg-primary/10 border border-primary/40 text-primary px-2 py-1 text-[10px] font-bold"
                        >
                            <FileText size={10} className="shrink-0" />
                            <span className="truncate max-w-[220px]">{p.title}</span>
                            <button
                                type="button"
                                onClick={() => toggle(p.id)}
                                className="hover:text-admin-text shrink-0"
                                aria-label={`Remove ${p.title}`}
                            >
                                <X size={10} />
                            </button>
                        </span>
                    ))}
                </div>
            )}

            <p className="mt-1.5 text-[10px] text-admin-muted leading-relaxed">
                {selectedIds.length > 0
                    ? "This keyword will be linked ONLY inside the selected posts. No other page on the site is affected."
                    : category === "All"
                        ? "No posts selected: the rule applies site-wide (all blog posts and static pages)."
                        : `No posts selected: the rule applies to every "${category}" blog post only.`}
            </p>
        </div>
    );
}
