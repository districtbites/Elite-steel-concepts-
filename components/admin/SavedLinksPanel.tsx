"use client";

import React, { useMemo, useState } from "react";
import { Link2, Search, Trash2 } from "lucide-react";
import type { SavedLinkGroup } from "@/lib/internalLinks";

const STATUS: Record<SavedLinkGroup["ruleStatus"], { label: string; cls: string }> = {
    active: { label: "Active rule", cls: "text-emerald-500 border-emerald-500/40" },
    disabled: { label: "Rule off", cls: "text-amber-500 border-amber-500/40" },
    none: { label: "No rule", cls: "text-admin-muted border-admin-border" }
};

/** Links written into blog post content. They stay on the site until removed from the post itself. */
export default function SavedLinksPanel({
    links,
    busy,
    onRemove
}: {
    links: SavedLinkGroup[];
    busy: boolean;
    onRemove: (link: SavedLinkGroup) => void;
}) {
    const [query, setQuery] = useState("");
    const visible = useMemo(() => {
        const q = query.trim().toLowerCase();
        return q ? links.filter(l => l.text.toLowerCase().includes(q) || l.url.toLowerCase().includes(q)) : links;
    }, [links, query]);
    const total = links.reduce((sum, l) => sum + l.count, 0);

    return (
        <div className="bg-admin-surface border border-admin-border p-6 space-y-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h4 className="text-xs font-black uppercase tracking-widest text-admin-text flex items-center gap-2">
                        <Link2 size={16} className="text-primary" />
                        Links Saved In Blog Content ({total})
                    </h4>
                    <p className="text-[11px] text-admin-muted mt-1.5 max-w-2xl leading-relaxed">
                        These links are written inside the posts, so they stay live even without a rule. This list also includes links
                        writers added by hand. Removing a link keeps the words in the post.
                    </p>
                </div>
                <div className="flex items-center gap-2 bg-admin-bg border border-admin-border px-3 py-2.5 md:w-72 focus-within:border-primary transition-colors">
                    <Search size={13} className="text-admin-muted shrink-0" />
                    <input
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder="Search link text or URL..."
                        className="flex-1 bg-transparent text-xs text-admin-text outline-none placeholder:text-admin-muted"
                    />
                </div>
            </div>

            <div className="max-h-96 overflow-y-auto border border-admin-border divide-y divide-admin-border">
                {visible.map(link => {
                    const status = STATUS[link.ruleStatus];
                    return (
                        <div key={`${link.text}|${link.url}`} className="flex items-center gap-3 p-3 bg-admin-bg">
                            <div className="min-w-0 flex-1">
                                <p className="text-xs font-bold text-admin-text truncate">{link.text}</p>
                                <p className="text-[10px] font-mono text-admin-muted truncate">{link.url}</p>
                            </div>
                            <span
                                className="shrink-0 text-[10px] font-mono text-admin-muted"
                                title={link.posts.map(p => `• ${p.title}`).join("\n")}
                            >
                                {link.count} in {link.posts.length} post{link.posts.length === 1 ? "" : "s"}
                            </span>
                            <span className={`shrink-0 border px-2 py-0.5 text-[9px] font-black uppercase tracking-widest ${status.cls}`}>
                                {status.label}
                            </span>
                            {link.ruleStatus === "active" ? (
                                <span className="shrink-0 w-[84px] text-right text-[10px] text-admin-muted" title="Disable or delete the rule to remove this link">
                                    Use the rule
                                </span>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => onRemove(link)}
                                    disabled={busy}
                                    className="shrink-0 w-[84px] inline-flex items-center justify-center gap-1.5 border border-admin-border px-2 py-1.5 text-[10px] font-black uppercase tracking-widest text-admin-muted hover:text-red-500 hover:border-red-500/50 disabled:opacity-40 transition-colors"
                                >
                                    <Trash2 size={11} /> Remove
                                </button>
                            )}
                        </div>
                    );
                })}
                {visible.length === 0 && (
                    <p className="p-8 text-center text-[11px] text-admin-muted">
                        {links.length === 0 ? "No internal links are saved in blog content." : "No links match your search."}
                    </p>
                )}
            </div>
        </div>
    );
}
