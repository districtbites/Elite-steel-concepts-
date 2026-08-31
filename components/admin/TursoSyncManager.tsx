"use client";

import React, { useState, useEffect } from "react";
import {
    Database,
    Cloud,
    HardDrive,
    ArrowUpCircle,
    ArrowDownCircle,
    RefreshCw,
    CheckCircle2,
    AlertCircle,
    Shield,
    FileText,
    Image as ImageIcon
} from "lucide-react";
import { checkTursoConnection, pushLocalToTurso, pullTursoToLocal } from "@/app/actions/tursoSync";

export default function TursoSyncManager() {
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState<"push" | "pull" | null>(null);
    const [status, setStatus] = useState<{
        isConfigured: boolean;
        isConnected: boolean;
        databaseUrl: string;
        totalPosts: number;
        totalMedia: number;
        lastSync?: any;
        error?: string;
    } | null>(null);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const loadStatus = async () => {
        setLoading(true);
        try {
            const res = await checkTursoConnection();
            if (res.success && res.status) {
                setStatus(res.status);
            } else {
                setStatus({
                    isConfigured: false,
                    isConnected: false,
                    databaseUrl: "",
                    totalPosts: 0,
                    totalMedia: 0,
                    error: res.error,
                });
            }
        } catch {
            setStatus({
                isConfigured: false,
                isConnected: false,
                databaseUrl: "",
                totalPosts: 0,
                totalMedia: 0,
                error: "Failed to connect to backend",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadStatus();
    }, []);

    const handlePush = async () => {
        if (!confirm("This will upload all local blog posts, SEO data, and media images to your Turso cloud database. Proceed?")) return;
        setSyncing("push");
        setMessage(null);
        try {
            const res = await pushLocalToTurso();
            if (res.success) {
                setMessage({ type: "success", text: res.message || "Local data successfully pushed to Turso cloud!" });
                await loadStatus();
            } else {
                setMessage({ type: "error", text: res.error || "Push sync failed" });
            }
        } catch (err: any) {
            setMessage({ type: "error", text: err.message || "An unexpected error occurred" });
        } finally {
            setSyncing(null);
        }
    };

    const handlePull = async () => {
        if (!confirm("This will download the latest database records and images from Turso cloud into your local storage. Proceed?")) return;
        setSyncing("pull");
        setMessage(null);
        try {
            const res = await pullTursoToLocal();
            if (res.success) {
                setMessage({ type: "success", text: res.message || "Turso data successfully downloaded to local storage!" });
                await loadStatus();
            } else {
                setMessage({ type: "error", text: res.error || "Pull sync failed" });
            }
        } catch (err: any) {
            setMessage({ type: "error", text: err.message || "An unexpected error occurred" });
        } finally {
            setSyncing(null);
        }
    };

    return (
        <div className="space-y-8">
            {/* Header / Status Banner */}
            <div className={`p-6 md:p-8 rounded-2xl border transition-all ${
                status?.isConnected 
                    ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-950 dark:text-emerald-100" 
                    : status?.isConfigured 
                    ? "bg-amber-500/5 border-amber-500/20 text-amber-950 dark:text-amber-100"
                    : "bg-blue-500/5 border-blue-500/20 text-blue-950 dark:text-blue-100"
            }`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                            status?.isConnected 
                                ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30" 
                                : status?.isConfigured
                                ? "bg-amber-500 text-white shadow-lg shadow-amber-500/30"
                                : "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                        }`}>
                            <Database size={24} />
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h3 className="text-xl font-black uppercase tracking-tight">
                                    {status?.isConnected
                                        ? "Turso Cloud Database: Connected & Active"
                                        : status?.isConfigured
                                        ? "Turso Configured (Connecting...)"
                                        : "Local File Database (Standalone Mode)"}
                                </h3>
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                    status?.isConnected
                                        ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                                        : status?.isConfigured
                                        ? "bg-amber-500/20 text-amber-600 dark:text-amber-400"
                                        : "bg-blue-500/20 text-blue-600 dark:text-blue-400"
                                }`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${
                                        status?.isConnected ? "bg-emerald-500 animate-pulse" : "bg-blue-500"
                                    }`} />
                                    {status?.isConnected ? "Live Cloud Sync" : "Local File (data/db.json)"}
                                </span>
                            </div>
                            <p className="text-sm opacity-80 max-w-2xl leading-relaxed">
                                {status?.isConnected
                                    ? "All blog posts, SEO settings, internal links, and uploaded media images are automatically synced to Turso cloud. Any change made locally or on live is shared instantly without data loss."
                                    : "You are currently using the local file database. Add your Turso credentials to your .env.local file to enable seamless cloud syncing between your local development and live production server."}
                            </p>
                            {status?.databaseUrl && (
                                <div className="mt-3 text-xs font-mono opacity-75 bg-black/5 dark:bg-white/5 px-3 py-1.5 rounded-md inline-block">
                                    Endpoint: {status.databaseUrl}
                                </div>
                            )}
                        </div>
                    </div>

                    <button
                        onClick={loadStatus}
                        disabled={loading}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-current opacity-80 hover:opacity-100 transition-opacity text-xs font-black uppercase tracking-wider self-start md:self-auto"
                    >
                        <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                        {loading ? "Checking..." : "Refresh Status"}
                    </button>
                </div>
            </div>

            {/* Notification alert if any */}
            {message && (
                <div className={`p-4 rounded-xl border flex items-start gap-3 text-sm font-medium ${
                    message.type === "success"
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300"
                        : "bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-300"
                }`}>
                    {message.type === "success" ? <CheckCircle2 size={18} className="shrink-0 mt-0.5" /> : <AlertCircle size={18} className="shrink-0 mt-0.5" />}
                    <div className="flex-1">{message.text}</div>
                </div>
            )}

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-admin-card border border-admin-border p-6 rounded-2xl">
                    <div className="flex items-center justify-between mb-3 text-admin-muted">
                        <span className="text-[10px] font-black uppercase tracking-widest">Blog Posts</span>
                        <FileText size={18} className="text-primary" />
                    </div>
                    <div className="text-3xl font-black tracking-tight">{status?.totalPosts || 0}</div>
                    <p className="text-xs text-admin-muted mt-1">Available in Database</p>
                </div>

                <div className="bg-admin-card border border-admin-border p-6 rounded-2xl">
                    <div className="flex items-center justify-between mb-3 text-admin-muted">
                        <span className="text-[10px] font-black uppercase tracking-widest">Media Images</span>
                        <ImageIcon size={18} className="text-primary" />
                    </div>
                    <div className="text-3xl font-black tracking-tight">{status?.totalMedia || 0}</div>
                    <p className="text-xs text-admin-muted mt-1">Stored in Database</p>
                </div>

                <div className="bg-admin-card border border-admin-border p-6 rounded-2xl">
                    <div className="flex items-center justify-between mb-3 text-admin-muted">
                        <span className="text-[10px] font-black uppercase tracking-widest">Engine Status</span>
                        <Shield size={18} className="text-primary" />
                    </div>
                    <div className="text-3xl font-black tracking-tight text-emerald-500">
                        {status?.isConnected ? "Cloud Active" : "Local Standalone"}
                    </div>
                    <p className="text-xs text-admin-muted mt-1">Auto-seeding enabled</p>
                </div>
            </div>

            {/* Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Push Local -> Turso */}
                <div className="bg-admin-card border border-admin-border p-6 md:p-8 rounded-2xl flex flex-col justify-between">
                    <div>
                        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                            <ArrowUpCircle size={22} />
                        </div>
                        <h4 className="text-lg font-black uppercase tracking-tight mb-2">
                            Push Local Data & Images &rarr; Turso Cloud
                        </h4>
                        <p className="text-xs text-admin-muted leading-relaxed mb-6">
                            Uploads your local blogs, quotes, SEO settings, internal links, and all images in <code className="text-primary font-mono">public/uploads/</code> to Turso. Use this when you have worked locally and want to push everything to the cloud.
                        </p>
                    </div>
                    <button
                        onClick={handlePush}
                        disabled={syncing !== null || !status?.isConfigured}
                        className="w-full inline-flex items-center justify-center gap-2 bg-primary hover:bg-orange-600 disabled:opacity-50 text-white font-black uppercase tracking-wider text-xs px-6 py-3.5 rounded-xl transition-all shadow-md shadow-primary/20"
                    >
                        {syncing === "push" ? (
                            <>
                                <RefreshCw size={16} className="animate-spin" />
                                Syncing to Turso Cloud...
                            </>
                        ) : (
                            <>
                                <ArrowUpCircle size={16} />
                                Sync Local Data to Turso
                            </>
                        )}
                    </button>
                </div>

                {/* Pull Turso -> Local */}
                <div className="bg-admin-card border border-admin-border p-6 md:p-8 rounded-2xl flex flex-col justify-between">
                    <div>
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-4">
                            <ArrowDownCircle size={22} />
                        </div>
                        <h4 className="text-lg font-black uppercase tracking-tight mb-2">
                            Pull Turso Cloud &rarr; Local Storage
                        </h4>
                        <p className="text-xs text-admin-muted leading-relaxed mb-6">
                            Downloads the latest database state and media images from Turso cloud into your local <code className="text-primary font-mono">data/db.json</code> and <code className="text-primary font-mono">public/uploads/</code>. Perfect for creating offline backups.
                        </p>
                    </div>
                    <button
                        onClick={handlePull}
                        disabled={syncing !== null || !status?.isConfigured}
                        className="w-full inline-flex items-center justify-center gap-2 border border-admin-border hover:border-primary hover:text-primary disabled:opacity-50 font-black uppercase tracking-wider text-xs px-6 py-3.5 rounded-xl transition-all"
                    >
                        {syncing === "pull" ? (
                            <>
                                <RefreshCw size={16} className="animate-spin" />
                                Downloading from Turso...
                            </>
                        ) : (
                            <>
                                <ArrowDownCircle size={16} />
                                Pull Turso Cloud to Local
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
