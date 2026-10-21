"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Crosshair, ChevronDown, ChevronRight, AlertTriangle, RefreshCw, ExternalLink, X } from "lucide-react";
import type { LinkPlacement, KeywordOccurrence } from "@/lib/internalLinks";
import { scanKeywordOccurrencesAction, type TargetOccurrences } from "@/app/actions/internalLinks";

interface LinkPlacementPickerProps {
    keyword: string;
    caseSensitive: boolean;
    targets: string[]; // "post:<id>" or page keys, in display order
    placements: LinkPlacement[];
    onChange: (placements: LinkPlacement[]) => void;
}

const contextOf = (o: KeywordOccurrence) => `${o.before}${o.match}${o.after}`.trim();
const sameSpot = (p: LinkPlacement, target: string, section: string, occurrence: number) =>
    p.target === target && p.section === section && p.occurrence === occurrence;

/**
 * Lets the admin pin a keyword's link to exact occurrences on each selected blog/page.
 * A target with no pinned occurrences stays on automatic linking.
 */
export default function LinkPlacementPicker({ keyword, caseSensitive, targets, placements, onChange }: LinkPlacementPickerProps) {
    const [results, setResults] = useState<TargetOccurrences[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});
    const [reloadKey, setReloadKey] = useState(0);

    const targetsKey = targets.join("|");
    const kw = keyword.trim();

    // Debounced scan whenever keyword, case or targets change
    useEffect(() => {
        if (kw.length < 2 || targets.length === 0) {
            setResults([]);
            setError(null);
            return;
        }
        let cancelled = false;
        const timer = setTimeout(async () => {
            setLoading(true);
            const res = await scanKeywordOccurrencesAction(kw, caseSensitive, targets);
            if (cancelled) return;
            setLoading(false);
            if (res.success) {
                setResults(res.results || []);
                setError(null);
            } else {
                setError(res.error || "Failed to scan occurrences.");
            }
        }, 400);
        return () => {
            cancelled = true;
            clearTimeout(timer);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [kw, caseSensitive, targetsKey, reloadKey]);

    // Pinned spots that no longer exist or whose surrounding text changed since they were picked
    const issues = useMemo(() => {
        const out: { placement: LinkPlacement; reason: "missing" | "changed" }[] = [];
        for (const p of placements) {
            const target = results.find(r => r.target === p.target);
            if (!target) continue; // not scanned (yet)
            const occ = target.sections.find(s => s.id === p.section)?.occurrences.find(o => o.occurrence === p.occurrence);
            if (!occ) out.push({ placement: p, reason: "missing" });
            else if (p.context && p.context !== contextOf(occ)) out.push({ placement: p, reason: "changed" });
        }
        return out;
    }, [placements, results]);

    const toggle = (target: string, section: string, occ: KeywordOccurrence) => {
        const exists = placements.some(p => sameSpot(p, target, section, occ.occurrence));
        onChange(
            exists
                ? placements.filter(p => !sameSpot(p, target, section, occ.occurrence))
                : [...placements, { target, section, occurrence: occ.occurrence, context: contextOf(occ) }]
        );
    };

    if (targets.length === 0) return null;

    return (
        <div className="border border-admin-border bg-admin-bg">
            <div className="flex items-center justify-between gap-2 px-3 py-2.5 border-b border-admin-border">
                <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-admin-text">
                    <Crosshair size={13} className="text-primary" /> Link Placement
                    <span className="normal-case tracking-normal font-medium text-admin-muted">(optional)</span>
                </span>
                <button
                    type="button"
                    onClick={() => setReloadKey(k => k + 1)}
                    disabled={loading || kw.length < 2}
                    className="text-admin-muted hover:text-admin-text disabled:opacity-40"
                    title="Rescan"
                >
                    <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
                </button>
            </div>

            <p className="px-3 pt-2 text-[10px] text-admin-muted leading-relaxed">
                Tick the exact occurrence(s) to link. On a page/blog with ticked occurrences, every other
                occurrence of this keyword stays plain text. Untouched pages use automatic linking (first match).
            </p>

            {kw.length < 2 && (
                <p className="px-3 py-4 text-[11px] text-admin-muted">Enter a keyword above to find its occurrences.</p>
            )}
            {error && <p className="px-3 py-3 text-[11px] text-red-400">{error}</p>}

            {issues.length > 0 && (
                <div className="mx-3 mt-2 p-2 border border-amber-500/40 bg-amber-500/10 space-y-1">
                    {issues.map(({ placement, reason }) => {
                        const name = results.find(r => r.target === placement.target)?.name || placement.target;
                        return (
                            <div key={`${placement.target}|${placement.section}|${placement.occurrence}`} className="flex items-start gap-2 text-[10px] text-amber-400">
                                <AlertTriangle size={11} className="shrink-0 mt-0.5" />
                                <span className="flex-1">
                                    {name} · #{placement.occurrence}:{" "}
                                    {reason === "missing"
                                        ? "this occurrence no longer exists (content was edited)."
                                        : "surrounding text changed since it was picked. Please re-check."}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => onChange(placements.filter(p => p !== placement))}
                                    className="hover:text-admin-text"
                                    aria-label="Remove placement"
                                >
                                    <X size={11} />
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}

            {kw.length >= 2 && (
                <div className="p-2 space-y-1.5 max-h-80 overflow-y-auto">
                    {loading && results.length === 0 && (
                        <p className="px-1 py-3 text-[11px] text-admin-muted">Scanning content...</p>
                    )}
                    {results.map(r => {
                        const total = r.sections.reduce((n, s) => n + s.occurrences.length, 0);
                        const pinned = placements.filter(p => p.target === r.target).length;
                        const isOpen = expanded[r.target] ?? pinned > 0;
                        return (
                            <div key={r.target} className="border border-admin-border bg-admin-surface">
                                <button
                                    type="button"
                                    onClick={() => setExpanded(e => ({ ...e, [r.target]: !isOpen }))}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-left"
                                >
                                    {isOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                                    <span className="flex-1 min-w-0">
                                        <span className="block text-xs font-bold text-admin-text truncate">{r.name}</span>
                                        <span className="block text-[10px] font-mono text-admin-muted truncate">{r.url}</span>
                                    </span>
                                    <span
                                        className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 border ${
                                            pinned > 0
                                                ? "bg-primary/10 border-primary/40 text-primary"
                                                : "border-admin-border text-admin-muted"
                                        }`}
                                    >
                                        {pinned > 0 ? `${pinned} pinned` : "Auto"} · {total} found
                                    </span>
                                </button>

                                {isOpen && (
                                    <div className="border-t border-admin-border px-3 py-2 space-y-3">
                                        {total === 0 && (
                                            <p className="text-[11px] text-admin-muted">
                                                Keyword not found here (headings, existing links and code are skipped).
                                            </p>
                                        )}
                                        {r.sections.filter(s => s.occurrences.length > 0).map(s => (
                                            <div key={s.id}>
                                                <div className="text-[9px] font-black uppercase tracking-widest text-admin-muted mb-1">
                                                    {s.label}
                                                </div>
                                                <div className="space-y-1">
                                                    {s.occurrences.map(o => {
                                                        const checked = placements.some(p => sameSpot(p, r.target, s.id, o.occurrence));
                                                        return (
                                                            <label
                                                                key={o.occurrence}
                                                                className={`flex items-start gap-2 p-2 cursor-pointer border text-[11px] leading-relaxed ${
                                                                    checked ? "border-primary/50 bg-primary/5" : "border-transparent hover:bg-admin-bg"
                                                                }`}
                                                            >
                                                                <input
                                                                    type="checkbox"
                                                                    checked={checked}
                                                                    onChange={() => toggle(r.target, s.id, o)}
                                                                    className="accent-primary mt-0.5"
                                                                />
                                                                <span className="font-mono text-[10px] text-admin-muted shrink-0">#{o.occurrence}</span>
                                                                <span className="text-admin-muted break-words">
                                                                    {o.before && "…"}{o.before}
                                                                    <mark className="bg-primary/25 text-admin-text font-bold px-0.5">{o.match}</mark>
                                                                    {o.after}{o.after && "…"}
                                                                </span>
                                                            </label>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        ))}
                                        <a
                                            href={r.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 text-[10px] text-primary hover:underline"
                                        >
                                            Open page <ExternalLink size={10} />
                                        </a>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
