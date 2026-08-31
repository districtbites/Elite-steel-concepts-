"use client";

import React, { useState, useMemo } from "react";
import {
    Link2,
    Plus,
    Search,
    RefreshCw,
    CheckCircle2,
    AlertCircle,
    Trash2,
    Edit3,
    ArrowRight,
    Zap,
    Layers,
    Sliders,
    Activity,
    FileText,
    ExternalLink,
    Play,
    RotateCcw,
    Sparkles,
    Eye,
    ShieldCheck,
    Check,
    X,
    Filter,
    ChevronDown,
    ChevronRight,
    Copy,
    TrendingUp
} from "lucide-react";
import Link from "next/link";
import Toast from "@/components/ui/Toast";
import type { InternalLinkRule, InternalLinkSettings } from "@/lib/db";
import type { LinkAuditSummary, PostLinkAudit } from "@/lib/internalLinks";
import {
    saveInternalLinkRuleAction,
    deleteInternalLinkRuleAction,
    toggleInternalLinkRuleAction,
    resetDefaultRulesAction,
    saveInternalLinkSettingsAction,
    applyAutoLinksToSinglePostAction,
    applyAutoLinksToBulkPostsAction,
    previewPostAutoLinksAction,
    stripLinksFromPostAction,
    testAutoLinkSandboxAction
} from "@/app/actions/internalLinks";

interface InternalLinksManagerProps {
    initialRules: InternalLinkRule[];
    initialSettings: InternalLinkSettings;
    initialAudit: LinkAuditSummary;
    availableRoutes: { name: string; url: string; category: string }[];
}

export default function InternalLinksManager({
    initialRules,
    initialSettings,
    initialAudit,
    availableRoutes
}: InternalLinksManagerProps) {
    const [rules, setRules] = useState<InternalLinkRule[]>(initialRules);
    const [settings, setSettings] = useState<InternalLinkSettings>(initialSettings);
    const [audit, setAudit] = useState<LinkAuditSummary>(initialAudit);

    const [activeTab, setActiveTab] = useState<"rules" | "automation" | "audit" | "sandbox" | "settings">("rules");
    const [loading, setLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMsg, setToastMsg] = useState("");

    // Rules search and filter
    const [ruleSearch, setRuleSearch] = useState("");
    const [ruleCategoryFilter, setRuleCategoryFilter] = useState("All");

    // Modal / Rule editing
    const [editingRule, setEditingRule] = useState<Partial<InternalLinkRule> | null>(null);
    const [isRuleModalOpen, setIsRuleModalOpen] = useState(false);

    // Sandbox state
    const [sandboxInput, setSandboxInput] = useState(
        "If you are looking to build a new food truck, Elite Steel Concepts provides custom food truck fabrication in Virginia. We ensure 100% health code compliance and fire suppression system installation. You can also compare custom concession food trailers or get an itemized custom food truck quote today!"
    );
    const [sandboxResult, setSandboxResult] = useState<{
        updatedContent?: string;
        linksAdded?: number;
        addedLinks?: { keyword: string; targetUrl: string }[];
    } | null>(null);

    // Automation / Bulk preview state
    const [bulkSelectedPosts, setBulkSelectedPosts] = useState<string[]>([]);
    const [previewPostData, setPreviewPostData] = useState<{
        postId: string;
        title: string;
        originalContent: string;
        updatedContent: string;
        linksAdded: number;
        addedLinks: { keyword: string; targetUrl: string }[];
    } | null>(null);

    // Audit search & filter
    const [auditSearch, setAuditSearch] = useState("");
    const [auditCategoryFilter, setAuditCategoryFilter] = useState("All");
    const [auditStatusFilter, setAuditStatusFilter] = useState("All");

    const notify = (msg: string) => {
        setToastMsg(msg);
        setShowToast(true);
    };

    // Filtered rules
    const filteredRules = useMemo(() => {
        return rules.filter(r => {
            const matchesSearch =
                r.keyword.toLowerCase().includes(ruleSearch.toLowerCase()) ||
                r.targetUrl.toLowerCase().includes(ruleSearch.toLowerCase()) ||
                (r.notes && r.notes.toLowerCase().includes(ruleSearch.toLowerCase()));

            const matchesCategory =
                ruleCategoryFilter === "All" ||
                r.categoryFilter === "All" ||
                r.categoryFilter === ruleCategoryFilter;

            return matchesSearch && matchesCategory;
        });
    }, [rules, ruleSearch, ruleCategoryFilter]);

    // Filtered audit posts
    const filteredAuditPosts = useMemo(() => {
        return (audit.posts || []).filter(p => {
            const matchesSearch =
                p.title.toLowerCase().includes(auditSearch.toLowerCase()) ||
                p.slug.toLowerCase().includes(auditSearch.toLowerCase());

            const matchesCategory =
                auditCategoryFilter === "All" || p.category === auditCategoryFilter;

            const matchesStatus =
                auditStatusFilter === "All" ||
                (auditStatusFilter === "Orphan" && p.existingLinks.length === 0) ||
                (auditStatusFilter === "Optimized" && p.existingLinks.length >= 3) ||
                (auditStatusFilter === "NeedsLinks" && p.existingLinks.length < 3);

            return matchesSearch && matchesCategory && matchesStatus;
        });
    }, [audit.posts, auditSearch, auditCategoryFilter, auditStatusFilter]);

    // ─── RULE ACTIONS ───
    const handleSaveRule = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        const res = await saveInternalLinkRuleAction(formData);
        if (res.success) {
            notify(res.message || "Rule saved successfully.");
            setIsRuleModalOpen(false);
            setEditingRule(null);
            // Refresh rules list locally
            const updated = await fetch("/api/internal-links/rules").catch(() => null);
            // Reload page state or refresh
            window.location.reload();
        } else {
            notify(`Error: ${res.error}`);
        }
        setLoading(false);
    };

    const handleToggleRule = async (id: string, currentEnabled: boolean) => {
        const nextState = !currentEnabled;
        setRules(prev => prev.map(r => (r.id === id ? { ...r, enabled: nextState } : r)));
        const res = await toggleInternalLinkRuleAction(id, nextState);
        if (res.success) {
            notify(res.message || "Rule updated.");
        } else {
            notify(`Error: ${res.error}`);
        }
    };

    const handleDeleteRule = async (id: string) => {
        if (!confirm("Are you sure you want to delete this internal link rule?")) return;
        setRules(prev => prev.filter(r => r.id !== id));
        const res = await deleteInternalLinkRuleAction(id);
        if (res.success) {
            notify("Rule deleted.");
        } else {
            notify(`Error: ${res.error}`);
        }
    };

    const handleResetDefaults = async () => {
        if (!confirm("Reset all rules to the pre-configured 40+ strategic ESC rules? Custom rules will be replaced.")) return;
        setLoading(true);
        const res = await resetDefaultRulesAction();
        if (res.success && res.rules) {
            setRules(res.rules);
            notify(res.message || "Reset to default strategic rules.");
        } else {
            notify(`Error: ${res.error}`);
        }
        setLoading(false);
    };

    // ─── SANDBOX TEST ───
    const handleRunSandbox = async () => {
        setLoading(true);
        const res = await testAutoLinkSandboxAction(sandboxInput);
        if (res.success && res.updatedContent !== undefined) {
            setSandboxResult({
                updatedContent: res.updatedContent,
                linksAdded: res.linksAdded || 0,
                addedLinks: res.addedLinks || []
            });
            notify(`Sandbox generated ${res.linksAdded || 0} link(s).`);
        } else {
            notify(`Error: ${res.error || "Failed to process text"}`);
        }
        setLoading(false);
    };

    // ─── SINGLE POST PREVIEW & LINKING ───
    const handlePreviewPost = async (postId: string) => {
        setLoading(true);
        const res = await previewPostAutoLinksAction(postId);
        if (res.success) {
            setPreviewPostData({
                postId: res.postId!,
                title: res.title!,
                originalContent: res.originalContent!,
                updatedContent: res.updatedContent!,
                linksAdded: res.linksAdded!,
                addedLinks: res.addedLinks!
            });
            setActiveTab("automation");
        } else {
            notify(`Error: ${res.error}`);
        }
        setLoading(false);
    };

    const handleApplySinglePost = async (postId: string) => {
        setLoading(true);
        const res = await applyAutoLinksToSinglePostAction(postId);
        if (res.success) {
            notify(res.message || "Links applied to post.");
            setPreviewPostData(null);
            window.location.reload();
        } else {
            notify(`Error: ${res.error}`);
        }
        setLoading(false);
    };

    const handleStripLinksPost = async (postId: string) => {
        if (!confirm("Remove relative internal markdown links from this post?")) return;
        setLoading(true);
        const res = await stripLinksFromPostAction(postId);
        if (res.success) {
            notify(res.message || "Links stripped.");
            window.location.reload();
        } else {
            notify(`Error: ${res.error}`);
        }
        setLoading(false);
    };

    // ─── BULK AUTO-LINKING ───
    const handleExecuteBulk = async () => {
        const count = bulkSelectedPosts.length > 0 ? bulkSelectedPosts.length : audit.publishedPosts;
        if (!confirm(`Are you sure you want to auto-inject internal links across ${count} published blog post(s)? Existing links and headings will be safely preserved.`)) return;

        setLoading(true);
        const res = await applyAutoLinksToBulkPostsAction(
            bulkSelectedPosts.length > 0 ? bulkSelectedPosts : undefined
        );
        if (res.success) {
            notify(res.message || "Bulk linking completed!");
            setTimeout(() => window.location.reload(), 1200);
        } else {
            notify(`Error: ${res.error}`);
        }
        setLoading(false);
    };

    // ─── SETTINGS SAVE ───
    const handleSaveSettings = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        const res = await saveInternalLinkSettingsAction(formData);
        if (res.success && res.settings) {
            setSettings(res.settings);
            notify("Internal linking settings updated.");
        } else {
            notify(`Error: ${res.error}`);
        }
        setLoading(false);
    };

    // Categories for filter
    const categories = ["All", "Maintenance", "Business", "Guide", "Design", "Regulation", "News"];

    return (
        <div className="space-y-8 pb-24 text-admin-text">
            {showToast && <Toast message={toastMsg} onClose={() => setShowToast(false)} />}

            {/* ═══════ HEADER BANNER ═══════ */}
            <div className="bg-admin-surface border border-admin-border p-8 md:p-10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[120px] -mr-40 -mt-40 pointer-events-none" />

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 bg-primary/10 border border-primary/20 w-fit px-3.5 py-1">
                            <Zap size={13} className="text-primary" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                                Automated SEO Internal Linking Engine
                            </span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight flex items-center gap-3">
                            <Link2 className="text-primary" size={32} />
                            Internal Linking System
                        </h1>
                        <p className="text-admin-muted max-w-2xl text-xs md:text-sm font-medium leading-relaxed">
                            Deploy high-intent internal link clusters from blog articles to the Homepage, Services, Compliance Hub, Locations, and Quote engines with automated token-safe replacement.
                        </p>
                    </div>

                    {/* Header Quick Stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-admin-bg p-4 border border-admin-border">
                        <div className="text-center p-3 border-r border-admin-border">
                            <div className="text-[10px] font-bold uppercase tracking-widest text-admin-muted mb-1">Active Rules</div>
                            <div className="text-2xl font-black text-primary">{rules.filter(r => r.enabled).length}</div>
                        </div>
                        <div className="text-center p-3 border-r border-admin-border">
                            <div className="text-[10px] font-bold uppercase tracking-widest text-admin-muted mb-1">Total Links</div>
                            <div className="text-2xl font-black text-admin-text">{audit.totalInternalLinks}</div>
                        </div>
                        <div className="text-center p-3 border-r border-admin-border">
                            <div className="text-[10px] font-bold uppercase tracking-widest text-admin-muted mb-1">Avg / Post</div>
                            <div className="text-2xl font-black text-green-500">{audit.averageLinksPerPost}</div>
                        </div>
                        <div className="text-center p-3">
                            <div className="text-[10px] font-bold uppercase tracking-widest text-admin-muted mb-1">Orphan Posts</div>
                            <div className={`text-2xl font-black ${audit.orphanPostsCount > 0 ? "text-amber-500" : "text-green-500"}`}>
                                {audit.orphanPostsCount}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Navigation Tabs */}
                <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-admin-border">
                    {[
                        { key: "rules", label: "Rules Manager", icon: Sliders, count: rules.length },
                        { key: "automation", label: "Bulk Auto-Linker", icon: Sparkles },
                        { key: "audit", label: "Link Health & Audit", icon: Activity, count: audit.posts?.length },
                        { key: "sandbox", label: "Live Sandbox Tester", icon: Eye },
                        { key: "settings", label: "Engine Configuration", icon: Layers }
                    ].map(tab => (
                        <button
                            key={tab.key}
                            type="button"
                            onClick={() => setActiveTab(tab.key as any)}
                            className={`flex items-center gap-2 px-5 py-3 text-xs font-black uppercase tracking-widest transition-all ${
                                activeTab === tab.key
                                    ? "bg-primary text-black shadow-lg shadow-primary/20"
                                    : "bg-admin-bg text-admin-muted hover:text-admin-text hover:bg-admin-border border border-admin-border"
                            }`}
                        >
                            <tab.icon size={15} />
                            <span>{tab.label}</span>
                            {tab.count !== undefined && (
                                <span className={`text-[10px] px-1.5 py-0.5 ml-1 font-mono ${
                                    activeTab === tab.key ? "bg-black/20 text-black" : "bg-admin-border text-admin-muted"
                                }`}>
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* ═══════ TAB 1: RULES MANAGER ═══════ */}
            {activeTab === "rules" && (
                <div className="space-y-6">
                    {/* Controls Bar */}
                    <div className="bg-admin-surface border border-admin-border p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex flex-1 items-center gap-3">
                            <div className="relative flex-1 max-w-md">
                                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-admin-muted" />
                                <input
                                    type="text"
                                    placeholder="Search keywords, URLs, notes..."
                                    value={ruleSearch}
                                    onChange={e => setRuleSearch(e.target.value)}
                                    className="w-full bg-admin-bg border border-admin-border pl-11 pr-4 py-3 text-xs font-bold text-admin-text outline-none focus:border-primary"
                                />
                            </div>

                            <select
                                value={ruleCategoryFilter}
                                onChange={e => setRuleCategoryFilter(e.target.value)}
                                className="bg-admin-bg border border-admin-border px-4 py-3 text-xs font-bold text-admin-text outline-none focus:border-primary"
                            >
                                {categories.map(c => (
                                    <option key={c} value={c}>
                                        {c === "All" ? "All Categories" : c}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={handleResetDefaults}
                                disabled={loading}
                                className="flex items-center gap-2 px-4 py-3 bg-admin-bg border border-admin-border hover:border-primary text-admin-text text-[11px] font-black uppercase tracking-wider transition-colors disabled:opacity-50"
                                title="Reload 40+ Pre-Configured ESC Strategic Rules"
                            >
                                <RotateCcw size={14} className={loading ? "animate-spin" : ""} />
                                Reset Strategic Defaults
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setEditingRule({
                                        id: "",
                                        keyword: "",
                                        targetUrl: "/services/custom-food-trucks",
                                        categoryFilter: "All",
                                        maxPerPost: 1,
                                        priority: 80,
                                        enabled: true,
                                        notes: ""
                                    });
                                    setIsRuleModalOpen(true);
                                }}
                                className="flex items-center gap-2 px-5 py-3 bg-primary hover:bg-orange-600 text-black text-[11px] font-black uppercase tracking-widest transition-colors shadow-md"
                            >
                                <Plus size={16} />
                                Add Keyword Rule
                            </button>
                        </div>
                    </div>

                    {/* Rules Table */}
                    <div className="bg-admin-surface border border-admin-border shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-admin-bg border-b border-admin-border text-[10px] font-black uppercase tracking-widest text-admin-muted">
                                    <tr>
                                        <th className="p-4 w-12 text-center">Status</th>
                                        <th className="p-4">Target Keyword / Phrase</th>
                                        <th className="p-4">Target Destination URL</th>
                                        <th className="p-4">Category Scope</th>
                                        <th className="p-4 text-center">Max / Post</th>
                                        <th className="p-4 text-center">Priority</th>
                                        <th className="p-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-admin-border">
                                    {filteredRules.map(rule => (
                                        <tr key={rule.id} className="hover:bg-admin-bg/50 transition-colors">
                                            <td className="p-4 text-center">
                                                <button
                                                    type="button"
                                                    onClick={() => handleToggleRule(rule.id, rule.enabled)}
                                                    className={`w-8 h-4 rounded-full transition-colors relative inline-block ${
                                                        rule.enabled ? "bg-primary" : "bg-admin-border"
                                                    }`}
                                                    title={rule.enabled ? "Enabled (Click to disable)" : "Disabled (Click to enable)"}
                                                >
                                                    <span
                                                        className={`block w-3 h-3 bg-black rounded-full transition-transform transform ${
                                                            rule.enabled ? "translate-x-4" : "translate-x-1"
                                                        } top-0.5 absolute`}
                                                    />
                                                </button>
                                            </td>
                                            <td className="p-4 font-bold text-admin-text">
                                                <div className="flex items-center gap-2">
                                                    <span className="bg-admin-bg px-2.5 py-1 border border-admin-border font-mono text-[11px] text-primary">
                                                        {rule.keyword}
                                                    </span>
                                                    {rule.caseSensitive && (
                                                        <span className="text-[9px] bg-admin-border text-admin-muted px-1.5 py-0.5 uppercase tracking-wider font-bold">
                                                            Case Match
                                                        </span>
                                                    )}
                                                </div>
                                                {rule.notes && (
                                                    <p className="text-[10px] text-admin-muted mt-1 font-medium italic">{rule.notes}</p>
                                                )}
                                            </td>
                                            <td className="p-4">
                                                <Link
                                                    href={rule.targetUrl}
                                                    target="_blank"
                                                    className="inline-flex items-center gap-1.5 text-admin-text hover:text-primary font-mono text-[11px] underline underline-offset-2"
                                                >
                                                    {rule.targetUrl}
                                                    <ExternalLink size={11} className="opacity-60" />
                                                </Link>
                                            </td>
                                            <td className="p-4">
                                                <span className="text-[10px] uppercase tracking-wider font-bold bg-admin-bg px-2 py-1 border border-admin-border text-admin-muted">
                                                    {rule.categoryFilter || "All"}
                                                </span>
                                            </td>
                                            <td className="p-4 text-center font-bold text-admin-muted font-mono">
                                                {rule.maxPerPost || 1}
                                            </td>
                                            <td className="p-4 text-center font-bold text-primary font-mono">
                                                {rule.priority || 0}
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setEditingRule(rule);
                                                            setIsRuleModalOpen(true);
                                                        }}
                                                        className="p-2 text-admin-muted hover:text-admin-text hover:bg-admin-border transition-colors"
                                                        title="Edit Rule"
                                                    >
                                                        <Edit3 size={14} />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteRule(rule.id)}
                                                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                                                        title="Delete Rule"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}

                                    {filteredRules.length === 0 && (
                                        <tr>
                                            <td colSpan={7} className="p-12 text-center text-admin-muted">
                                                <AlertCircle size={28} className="mx-auto mb-3 opacity-50 text-amber-500" />
                                                <p className="font-bold text-xs uppercase tracking-widest">No matching internal link rules found.</p>
                                                <p className="text-[11px] mt-1">Try clearing filters or click &quot;Reset Strategic Defaults&quot;.</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* ═══════ TAB 2: BULK AUTO-LINKER & AUTOMATION ═══════ */}
            {activeTab === "automation" && (
                <div className="space-y-6">
                    {/* Execution Action Card */}
                    <div className="bg-admin-surface border border-admin-border p-8 relative overflow-hidden">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                            <div className="space-y-2">
                                <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
                                    <Sparkles className="text-primary" size={20} />
                                    Automated Bulk Linking Engine
                                </h3>
                                <p className="text-admin-muted text-xs max-w-2xl leading-relaxed">
                                    This engine parses all blog content and injects markdown links matching your active rules. It guarantees that headings, existing links, code blocks, and images remain 100% untouched.
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-3">
                                <button
                                    type="button"
                                    onClick={handleExecuteBulk}
                                    disabled={loading}
                                    className="flex items-center gap-3 px-8 py-4 bg-primary hover:bg-orange-600 text-black text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-primary/20 disabled:opacity-50"
                                >
                                    <Play size={16} />
                                    Execute Bulk Linking ({bulkSelectedPosts.length > 0 ? `${bulkSelectedPosts.length} Selected` : `All ${audit.publishedPosts} Posts`})
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Preview Diff View (If single post preview was triggered) */}
                    {previewPostData && (
                        <div className="bg-admin-surface border-2 border-primary p-6 space-y-6 animate-in fade-in duration-300">
                            <div className="flex items-center justify-between pb-4 border-b border-admin-border">
                                <div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Live Before / After Diff</span>
                                    <h4 className="text-lg font-black uppercase text-admin-text tracking-tight mt-1">
                                        {previewPostData.title}
                                    </h4>
                                    <p className="text-xs text-green-400 font-bold mt-1">
                                        ✓ Found {previewPostData.linksAdded} link opportunity(ies) ready for injection.
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setPreviewPostData(null)}
                                        className="px-4 py-2 bg-admin-bg border border-admin-border text-xs font-bold text-admin-muted hover:text-admin-text"
                                    >
                                        Close Diff
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleApplySinglePost(previewPostData.postId)}
                                        disabled={loading || previewPostData.linksAdded === 0}
                                        className="px-6 py-2.5 bg-primary hover:bg-orange-600 text-black text-xs font-black uppercase tracking-wider disabled:opacity-50"
                                    >
                                        Apply Links to This Post
                                    </button>
                                </div>
                            </div>

                            {/* Added Links Pill List */}
                            {previewPostData.addedLinks.length > 0 && (
                                <div className="bg-admin-bg p-4 border border-admin-border space-y-2">
                                    <div className="text-[10px] font-black uppercase tracking-widest text-admin-muted">Injected Link Pairs:</div>
                                    <div className="flex flex-wrap gap-2">
                                        {previewPostData.addedLinks.map((l, idx) => (
                                            <div key={idx} className="flex items-center gap-2 bg-admin-surface px-3 py-1.5 border border-admin-border text-xs font-mono">
                                                <span className="text-primary font-bold">&quot;{l.keyword}&quot;</span>
                                                <ArrowRight size={12} className="text-admin-muted" />
                                                <span className="text-admin-muted">{l.targetUrl}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Diff Columns */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <div className="text-[10px] font-black uppercase tracking-widest text-admin-muted">Original Markdown</div>
                                    <textarea
                                        readOnly
                                        rows={14}
                                        value={previewPostData.originalContent}
                                        className="w-full bg-admin-bg border border-admin-border p-4 font-mono text-xs text-admin-muted resize-none leading-relaxed"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <div className="text-[10px] font-black uppercase tracking-widest text-primary">Updated With Internal Links</div>
                                    <textarea
                                        readOnly
                                        rows={14}
                                        value={previewPostData.updatedContent}
                                        className="w-full bg-admin-bg border border-primary/40 p-4 font-mono text-xs text-admin-text resize-none leading-relaxed"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Posts Selection Grid */}
                    <div className="bg-admin-surface border border-admin-border p-6 space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-admin-border">
                            <h4 className="text-xs font-black uppercase tracking-widest text-admin-text">
                                Target Posts for Linking ({audit.posts?.length || 0} Total)
                            </h4>
                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (bulkSelectedPosts.length === audit.posts.length) {
                                            setBulkSelectedPosts([]);
                                        } else {
                                            setBulkSelectedPosts(audit.posts.map(p => p.id));
                                        }
                                    }}
                                    className="text-[10px] font-bold uppercase tracking-wider text-primary hover:underline"
                                >
                                    {bulkSelectedPosts.length === audit.posts.length ? "Deselect All" : "Select All"}
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[500px] overflow-y-auto p-1">
                            {audit.posts?.map(p => {
                                const isSelected = bulkSelectedPosts.includes(p.id);
                                return (
                                    <div
                                        key={p.id}
                                        onClick={() => {
                                            if (isSelected) {
                                                setBulkSelectedPosts(prev => prev.filter(id => id !== p.id));
                                            } else {
                                                setBulkSelectedPosts(prev => [...prev, p.id]);
                                            }
                                        }}
                                        className={`p-4 border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                                            isSelected
                                                ? "bg-primary/5 border-primary"
                                                : "bg-admin-bg border-admin-border hover:border-admin-muted"
                                        }`}
                                    >
                                        <div>
                                            <div className="flex items-center justify-between mb-1.5">
                                                <span className="text-[9px] font-black uppercase tracking-widest text-admin-muted bg-admin-surface px-2 py-0.5">
                                                    {p.category}
                                                </span>
                                                <span className="text-[10px] font-mono font-bold text-admin-muted">
                                                    {p.existingLinks.length} links
                                                </span>
                                            </div>
                                            <h5 className="font-bold text-xs leading-snug line-clamp-2 text-admin-text">
                                                {p.title}
                                            </h5>
                                        </div>

                                        <div className="flex items-center justify-between pt-2 border-t border-admin-border/50">
                                            <button
                                                type="button"
                                                onClick={e => {
                                                    e.stopPropagation();
                                                    handlePreviewPost(p.id);
                                                }}
                                                className="text-[10px] font-black uppercase tracking-wider text-primary hover:underline flex items-center gap-1"
                                            >
                                                <Eye size={12} /> Preview
                                            </button>
                                            <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                                                isSelected ? "bg-primary border-primary text-black" : "border-admin-border"
                                            }`}>
                                                {isSelected && <Check size={12} />}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* ═══════ TAB 3: LINK HEALTH & AUDIT ═══════ */}
            {activeTab === "audit" && (
                <div className="space-y-6">
                    {/* Top Linked Targets Overview */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-admin-surface border border-admin-border p-6 space-y-4">
                            <h4 className="text-xs font-black uppercase tracking-widest text-admin-text flex items-center gap-2">
                                <TrendingUp size={16} className="text-primary" />
                                Top Linked Destination Pages
                            </h4>
                            <div className="space-y-2">
                                {audit.topTargetUrls?.map((t, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-2.5 bg-admin-bg border border-admin-border">
                                        <span className="font-mono text-xs text-admin-text truncate mr-3">{t.url}</span>
                                        <span className="bg-primary/10 border border-primary/30 text-primary px-2.5 py-0.5 text-xs font-mono font-bold">
                                            {t.count} links
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-admin-surface border border-admin-border p-6 space-y-4">
                            <h4 className="text-xs font-black uppercase tracking-widest text-admin-text flex items-center gap-2">
                                <FileText size={16} className="text-primary" />
                                Most Common Anchor Texts
                            </h4>
                            <div className="space-y-2">
                                {audit.topAnchorTexts?.map((a, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-2.5 bg-admin-bg border border-admin-border">
                                        <span className="text-xs text-admin-text font-bold truncate mr-3">&quot;{a.text}&quot;</span>
                                        <span className="bg-admin-border text-admin-muted px-2.5 py-0.5 text-xs font-mono font-bold">
                                            {a.count}x
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Audit Posts Filter Bar */}
                    <div className="bg-admin-surface border border-admin-border p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex flex-1 items-center gap-3">
                            <div className="relative flex-1 max-w-md">
                                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-admin-muted" />
                                <input
                                    type="text"
                                    placeholder="Search article titles..."
                                    value={auditSearch}
                                    onChange={e => setAuditSearch(e.target.value)}
                                    className="w-full bg-admin-bg border border-admin-border pl-11 pr-4 py-3 text-xs font-bold text-admin-text outline-none focus:border-primary"
                                />
                            </div>

                            <select
                                value={auditCategoryFilter}
                                onChange={e => setAuditCategoryFilter(e.target.value)}
                                className="bg-admin-bg border border-admin-border px-4 py-3 text-xs font-bold text-admin-text outline-none focus:border-primary"
                            >
                                {categories.map(c => (
                                    <option key={c} value={c}>
                                        {c === "All" ? "All Categories" : c}
                                    </option>
                                ))}
                            </select>

                            <select
                                value={auditStatusFilter}
                                onChange={e => setAuditStatusFilter(e.target.value)}
                                className="bg-admin-bg border border-admin-border px-4 py-3 text-xs font-bold text-admin-text outline-none focus:border-primary"
                            >
                                <option value="All">All Link Statuses</option>
                                <option value="Orphan">Orphans (0 Links)</option>
                                <option value="NeedsLinks">Underlinked (&lt; 3 Links)</option>
                                <option value="Optimized">Optimized (3+ Links)</option>
                            </select>
                        </div>
                    </div>

                    {/* Audit Table */}
                    <div className="bg-admin-surface border border-admin-border shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-admin-bg border-b border-admin-border text-[10px] font-black uppercase tracking-widest text-admin-muted">
                                    <tr>
                                        <th className="p-4">Article</th>
                                        <th className="p-4">Existing In-Content Links</th>
                                        <th className="p-4 text-center">Core Coverage</th>
                                        <th className="p-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-admin-border">
                                    {filteredAuditPosts.map(p => (
                                        <tr key={p.id} className="hover:bg-admin-bg/50 transition-colors">
                                            <td className="p-4 max-w-sm">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-[9px] font-black uppercase text-admin-muted bg-admin-bg px-2 py-0.5 border border-admin-border">
                                                        {p.category}
                                                    </span>
                                                    <span className="text-[10px] font-mono text-admin-muted">{p.wordCount} words</span>
                                                </div>
                                                <h5 className="font-bold text-admin-text text-sm leading-snug">{p.title}</h5>
                                                <div className="text-[10px] font-mono text-admin-muted mt-1">/blog/{p.slug}</div>
                                            </td>

                                            <td className="p-4">
                                                {p.existingLinks.length > 0 ? (
                                                    <div className="space-y-1.5 max-h-32 overflow-y-auto pr-2">
                                                        {p.existingLinks.map((l, i) => (
                                                            <div key={i} className="flex items-center gap-2 text-[11px] bg-admin-bg px-2 py-1 border border-admin-border">
                                                                <span className="text-primary font-bold truncate max-w-[140px]">&quot;{l.text}&quot;</span>
                                                                <ArrowRight size={10} className="text-admin-muted shrink-0" />
                                                                <span className="text-admin-muted font-mono truncate">{l.url}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-500 bg-amber-500/10 px-2.5 py-1 border border-amber-500/20">
                                                        <AlertCircle size={12} /> 0 Internal Links (Orphan)
                                                    </span>
                                                )}
                                            </td>

                                            <td className="p-4 text-center">
                                                <div className="flex items-center justify-center gap-1.5">
                                                    <span className={`px-2 py-0.5 text-[9px] font-black uppercase tracking-widest border ${
                                                        p.hasHomepageLink ? "bg-green-500/10 text-green-500 border-green-500/30" : "bg-admin-bg text-admin-muted border-admin-border opacity-40"
                                                    }`} title="Links to Homepage">Home</span>
                                                    <span className={`px-2 py-0.5 text-[9px] font-black uppercase tracking-widest border ${
                                                        p.hasServiceLink ? "bg-green-500/10 text-green-500 border-green-500/30" : "bg-admin-bg text-admin-muted border-admin-border opacity-40"
                                                    }`} title="Links to Services">Services</span>
                                                    <span className={`px-2 py-0.5 text-[9px] font-black uppercase tracking-widest border ${
                                                        p.hasQuoteLink ? "bg-green-500/10 text-green-500 border-green-500/30" : "bg-admin-bg text-admin-muted border-admin-border opacity-40"
                                                    }`} title="Links to Quote Engine">Quote</span>
                                                    <span className={`px-2 py-0.5 text-[9px] font-black uppercase tracking-widest border ${
                                                        p.hasComplianceLink ? "bg-green-500/10 text-green-500 border-green-500/30" : "bg-admin-bg text-admin-muted border-admin-border opacity-40"
                                                    }`} title="Links to Compliance Hub">Compliance</span>
                                                </div>
                                            </td>

                                            <td className="p-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => handlePreviewPost(p.id)}
                                                        className="px-3 py-1.5 bg-admin-bg hover:bg-admin-border text-admin-text border border-admin-border text-[10px] font-black uppercase tracking-wider transition-colors"
                                                    >
                                                        Preview
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleApplySinglePost(p.id)}
                                                        disabled={loading}
                                                        className="px-3 py-1.5 bg-primary hover:bg-orange-600 text-black text-[10px] font-black uppercase tracking-wider transition-colors"
                                                    >
                                                        Auto-Link
                                                    </button>
                                                    <Link
                                                        href={`/admin/blog/edit/${p.id}`}
                                                        className="p-1.5 text-admin-muted hover:text-admin-text hover:bg-admin-border transition-colors"
                                                        title="Open in Blog Editor"
                                                    >
                                                        <Edit3 size={14} />
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleStripLinksPost(p.id)}
                                                        className="p-1.5 text-admin-muted hover:text-red-400 hover:bg-red-500/10 transition-colors"
                                                        title="Strip Relative Internal Links"
                                                    >
                                                        <RotateCcw size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* ═══════ TAB 4: LIVE SANDBOX TESTER ═══════ */}
            {activeTab === "sandbox" && (
                <div className="space-y-6">
                    <div className="bg-admin-surface border border-admin-border p-8 space-y-6">
                        <div>
                            <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
                                <Eye className="text-primary" size={20} />
                                Live Keyword & Link Injection Sandbox
                            </h3>
                            <p className="text-admin-muted text-xs mt-1">
                                Test your active rules against any custom paragraph or sample content in real-time.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-admin-muted">Input Content (Markdown / Text)</label>
                            <textarea
                                rows={6}
                                value={sandboxInput}
                                onChange={e => setSandboxInput(e.target.value)}
                                className="w-full bg-admin-bg border border-admin-border p-4 text-xs font-mono text-admin-text leading-relaxed outline-none focus:border-primary"
                                placeholder="Paste or type test content here..."
                            />
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={handleRunSandbox}
                                disabled={loading || !sandboxInput.trim()}
                                className="flex items-center gap-2 px-8 py-3.5 bg-primary hover:bg-orange-600 text-black text-xs font-black uppercase tracking-widest transition-colors shadow-lg disabled:opacity-50"
                            >
                                <Play size={14} />
                                Run Link Injection Engine
                            </button>
                        </div>

                        {sandboxResult && (
                            <div className="pt-6 border-t border-admin-border space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-black uppercase tracking-widest text-primary">
                                        Processed Output ({sandboxResult.linksAdded} Links Injected)
                                    </span>
                                </div>

                                {sandboxResult.addedLinks && sandboxResult.addedLinks.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {sandboxResult.addedLinks.map((l, i) => (
                                            <span key={i} className="bg-admin-bg border border-admin-border px-3 py-1 text-[11px] font-mono">
                                                <strong className="text-primary">&quot;{l.keyword}&quot;</strong> → {l.targetUrl}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                <div className="bg-admin-bg border border-primary/40 p-6 font-mono text-xs text-admin-text whitespace-pre-wrap leading-relaxed">
                                    {sandboxResult.updatedContent}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ═══════ TAB 5: SETTINGS ═══════ */}
            {activeTab === "settings" && (
                <form onSubmit={handleSaveSettings} className="bg-admin-surface border border-admin-border p-8 space-y-6 max-w-3xl">
                    <div className="pb-4 border-b border-admin-border">
                        <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
                            <Layers className="text-primary" size={20} />
                            Internal Linking Thresholds & Constraints
                        </h3>
                        <p className="text-admin-muted text-xs mt-1">
                            Configure density caps and safety rules to avoid over-optimization.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="text-[11px] font-black uppercase tracking-wider text-admin-muted mb-2 block">
                                Max In-Content Links Per Post
                            </label>
                            <input
                                type="number"
                                name="maxLinksPerPost"
                                min={1}
                                max={10}
                                defaultValue={settings.maxLinksPerPost || 4}
                                className="w-full bg-admin-bg border border-admin-border p-3 text-xs font-bold text-admin-text outline-none focus:border-primary"
                            />
                            <p className="text-[10px] text-admin-muted mt-1">Recommended: 3 to 5 links per 1,500-word post.</p>
                        </div>

                        <div className="flex items-center gap-3 p-4 bg-admin-bg border border-admin-border">
                            <input
                                type="checkbox"
                                id="preventDuplicateTargetsPerPost"
                                name="preventDuplicateTargetsPerPost"
                                defaultChecked={settings.preventDuplicateTargetsPerPost !== false}
                                className="w-4 h-4 accent-primary"
                            />
                            <label htmlFor="preventDuplicateTargetsPerPost" className="text-xs font-bold text-admin-text cursor-pointer">
                                Prevent Duplicate Target URLs Per Post
                                <span className="block text-[10px] text-admin-muted font-normal mt-0.5">
                                    Guarantees that each destination URL (e.g. /quote) is only linked once per article.
                                </span>
                            </label>
                        </div>

                        <div className="flex items-center gap-3 p-4 bg-admin-bg border border-admin-border">
                            <input
                                type="checkbox"
                                id="openInNewTab"
                                name="openInNewTab"
                                defaultChecked={settings.openInNewTab === true}
                                className="w-4 h-4 accent-primary"
                            />
                            <label htmlFor="openInNewTab" className="text-xs font-bold text-admin-text cursor-pointer">
                                Open Internal Links in New Tab (target=&quot;_blank&quot;)
                                <span className="block text-[10px] text-admin-muted font-normal mt-0.5">
                                    Default is false (standard SEO practice is same tab for internal links).
                                </span>
                            </label>
                        </div>

                        <div>
                            <label className="text-[11px] font-black uppercase tracking-wider text-admin-muted mb-2 block">
                                Excluded Post Slugs (Comma Separated)
                            </label>
                            <input
                                type="text"
                                name="excludedSlugs"
                                defaultValue={settings.excludedSlugs?.join(", ") || ""}
                                placeholder="test-post, sample-article"
                                className="w-full bg-admin-bg border border-admin-border p-3 text-xs font-bold text-admin-text outline-none focus:border-primary"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="px-8 py-3.5 bg-primary hover:bg-orange-600 text-black text-xs font-black uppercase tracking-widest transition-colors shadow-lg disabled:opacity-50"
                    >
                        Save Configuration
                    </button>
                </form>
            )}

            {/* ═══════ ADD / EDIT RULE MODAL ═══════ */}
            {isRuleModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-admin-surface border-2 border-primary max-w-xl w-full p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between pb-4 border-b border-admin-border">
                            <h3 className="text-lg font-black uppercase tracking-tight text-admin-text">
                                {editingRule?.id ? "Edit Keyword Rule" : "Create New Keyword Rule"}
                            </h3>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsRuleModalOpen(false);
                                    setEditingRule(null);
                                }}
                                className="p-1.5 text-admin-muted hover:text-admin-text"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleSaveRule} className="space-y-4">
                            <input type="hidden" name="id" defaultValue={editingRule?.id || ""} />

                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-admin-muted mb-1.5 block">
                                    Target Keyword / Phrase *
                                </label>
                                <input
                                    type="text"
                                    name="keyword"
                                    required
                                    defaultValue={editingRule?.keyword || ""}
                                    placeholder="e.g. custom food truck builder"
                                    className="w-full bg-admin-bg border border-admin-border p-3 text-xs font-bold text-admin-text outline-none focus:border-primary"
                                />
                            </div>

                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-admin-muted mb-1.5 block">
                                    Destination Target URL *
                                </label>
                                <input
                                    type="text"
                                    name="targetUrl"
                                    required
                                    defaultValue={editingRule?.targetUrl || "/services/custom-food-trucks"}
                                    placeholder="/services/custom-food-trucks"
                                    className="w-full bg-admin-bg border border-admin-border p-3 text-xs font-mono text-admin-text outline-none focus:border-primary"
                                />

                                {/* Quick URL Picker Suggestions */}
                                <div className="mt-2 flex flex-wrap gap-1.5">
                                    {availableRoutes.slice(0, 8).map(r => (
                                        <button
                                            key={r.url}
                                            type="button"
                                            onClick={() => {
                                                const el = document.querySelector('input[name="targetUrl"]') as HTMLInputElement;
                                                if (el) el.value = r.url;
                                            }}
                                            className="text-[9px] font-mono bg-admin-bg hover:bg-admin-border px-2 py-0.5 border border-admin-border text-admin-muted hover:text-admin-text"
                                        >
                                            {r.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-admin-muted mb-1.5 block">
                                        Category Scope
                                    </label>
                                    <select
                                        name="categoryFilter"
                                        defaultValue={editingRule?.categoryFilter || "All"}
                                        className="w-full bg-admin-bg border border-admin-border p-3 text-xs font-bold text-admin-text outline-none focus:border-primary"
                                    >
                                        {categories.map(c => (
                                            <option key={c} value={c}>
                                                {c}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-admin-muted mb-1.5 block">
                                        Priority (0-100)
                                    </label>
                                    <input
                                        type="number"
                                        name="priority"
                                        min={0}
                                        max={100}
                                        defaultValue={editingRule?.priority ?? 80}
                                        className="w-full bg-admin-bg border border-admin-border p-3 text-xs font-bold text-admin-text outline-none focus:border-primary"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-admin-muted mb-1.5 block">
                                    SEO Notes / Strategy Rationale
                                </label>
                                <input
                                    type="text"
                                    name="notes"
                                    defaultValue={editingRule?.notes || ""}
                                    placeholder="e.g. Primary commercial keyword to truck silo"
                                    className="w-full bg-admin-bg border border-admin-border p-3 text-xs text-admin-text outline-none focus:border-primary"
                                />
                            </div>

                            <div className="flex items-center gap-6 pt-2">
                                <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="enabled"
                                        defaultChecked={editingRule?.enabled !== false}
                                        className="accent-primary"
                                    />
                                    Rule Enabled
                                </label>

                                <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="caseSensitive"
                                        defaultChecked={editingRule?.caseSensitive === true}
                                        className="accent-primary"
                                    />
                                    Case Sensitive
                                </label>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-admin-border">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsRuleModalOpen(false);
                                        setEditingRule(null);
                                    }}
                                    className="px-5 py-3 bg-admin-bg border border-admin-border text-xs font-bold text-admin-muted hover:text-admin-text"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-8 py-3 bg-primary hover:bg-orange-600 text-black text-xs font-black uppercase tracking-widest transition-colors disabled:opacity-50"
                                >
                                    Save Rule
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
