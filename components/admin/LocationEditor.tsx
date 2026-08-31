"use client";

import React, { useState, useTransition } from "react";
import Button from "@/components/ui/Button";
import { LocationEntry } from "@/lib/db";
import { Save, Plus, X, Globe, MapPin, List, Shield, HelpCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface LocationEditorProps {
    action: (formData: FormData) => Promise<void>;
    initialData?: LocationEntry;
}

export default function LocationEditor({ action, initialData }: LocationEditorProps) {
    const [isPending, startTransition] = useTransition();
    const [localDetails, setLocalDetails] = useState<string[]>(initialData?.localDetails || []);
    const [newDetail, setNewDetail] = useState("");
    const [faq, setFaq] = useState<{question: string, answer: string}[]>(initialData?.faq || []);

    const addDetail = () => {
        if (newDetail.trim()) {
            setLocalDetails(prev => [...prev, newDetail.trim()]);
            setNewDetail("");
        }
    };

    const removeDetail = (index: number) => {
        setLocalDetails(prev => prev.filter((_, i) => i !== index));
    };

    const addFaq = () => {
        setFaq(prev => [...prev, { question: "", answer: "" }]);
    };

    const removeFaq = (index: number) => {
        setFaq(prev => prev.filter((_, i) => i !== index));
    };

    const updateFaq = (index: number, field: "question" | "answer", value: string) => {
        setFaq(prev => {
            const next = [...prev];
            next[index][field] = value;
            return next;
        });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        // Inject dynamic state values
        formData.set("localDetails", JSON.stringify(localDetails));
        formData.set("faq", JSON.stringify(faq));
        startTransition(() => action(formData));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-12 pb-20">
            {/* Header Sticky Bar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-admin-surface/80 backdrop-blur-md p-6 border border-admin-border shadow-sm sticky top-4 z-50">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Link href="/admin/locations" className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-admin-muted hover:text-admin-text transition-colors">
                            <ArrowLeft size={12} /> All Locations
                        </Link>
                    </div>
                    <h1 className="text-2xl font-black uppercase text-admin-text tracking-tight">
                        {initialData ? "Edit Location Page" : "New Location Page"}
                    </h1>
                    <p className="text-xs font-bold text-admin-muted uppercase tracking-widest mt-1">Local SEO Landing Page Builder</p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <Link href="/admin/locations" className="flex-1 md:flex-none text-center px-6 py-3 border border-admin-border text-[10px] font-black uppercase tracking-widest hover:bg-admin-bg transition-colors">
                        Cancel
                    </Link>
                    <Button type="submit" disabled={isPending} className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-primary text-admin-text uppercase font-black tracking-widest">
                        {isPending ? "Saving..." : <><Save size={16}/> Save Location</>}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Left Column: Basic Info & SEO */}
                <div className="space-y-10">
                    {/* Target Definition */}
                    <div className="bg-admin-surface p-10 border border-admin-border shadow-sm space-y-8">
                        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-admin-muted flex items-center">
                            <MapPin size={16} className="mr-3 text-primary" /> Target Definition
                        </h3>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-admin-text tracking-widest ml-1">City *</label>
                                <input name="city" defaultValue={initialData?.city} placeholder="e.g. Baltimore" required className="w-full bg-admin-bg border border-admin-border p-4 outline-none focus:border-primary font-bold text-sm text-admin-text transition-colors" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-admin-text tracking-widest ml-1">State *</label>
                                <input name="state" defaultValue={initialData?.state} placeholder="e.g. MD" required className="w-full bg-admin-bg border border-admin-border p-4 outline-none focus:border-primary font-bold text-sm text-admin-text transition-colors" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-admin-text tracking-widest ml-1">URL Slug *</label>
                            <input name="slug" defaultValue={initialData?.slug} placeholder="e.g. baltimore-md" required className="w-full bg-admin-bg border border-admin-border p-4 outline-none focus:border-primary font-mono text-sm text-admin-text transition-colors" />
                            <p className="text-[10px] text-admin-muted ml-1">Will be auto-lowercased & sanitized. Used as: /locations/your-slug</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-admin-text tracking-widest ml-1">H1 Heading *</label>
                            <input name="h1" defaultValue={initialData?.h1} placeholder="Custom Food Trucks in Baltimore, MD" required className="w-full bg-admin-bg border border-admin-border p-4 outline-none focus:border-primary font-bold text-sm text-admin-text transition-colors" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-admin-text tracking-widest ml-1">Page Introduction *</label>
                            <textarea name="intro" defaultValue={initialData?.intro} placeholder="Write a compelling city-specific intro paragraph..." required rows={4} className="w-full bg-admin-bg border border-admin-border p-4 outline-none focus:border-primary font-medium text-admin-muted resize-none transition-colors" />
                        </div>

                        <div className="flex items-center gap-3 p-4 bg-admin-bg border border-admin-border cursor-pointer" onClick={(e) => { const cb = (e.currentTarget.querySelector('input') as HTMLInputElement); cb.checked = !cb.checked; }}>
                            <input
                                type="checkbox"
                                name="published"
                                id="published"
                                defaultChecked={initialData?.published ?? false}
                                value="true"
                                className="w-5 h-5 accent-primary"
                                onClick={(e) => e.stopPropagation()}
                            />
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-admin-text block">Publish to Live Site</span>
                                <span className="text-[9px] text-admin-muted">When checked, this page is visible at /locations/slug</span>
                            </div>
                        </div>
                    </div>

                    {/* SEO */}
                    <div className="bg-admin-surface p-10 border border-admin-border shadow-sm space-y-8">
                        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-admin-muted flex items-center">
                            <Globe size={16} className="mr-3 text-primary" /> SEO & Meta
                        </h3>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-admin-text tracking-widest ml-1">Title Tag</label>
                            <input name="titleTag" defaultValue={initialData?.titleTag} placeholder="Baltimore Food Truck Builders | Elite Steel Concepts" className="w-full bg-admin-bg border border-admin-border p-4 outline-none focus:border-primary font-bold text-sm text-admin-text transition-colors" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-admin-text tracking-widest ml-1">Meta Description</label>
                            <textarea name="metaDescription" defaultValue={initialData?.metaDescription} rows={3} placeholder="150 chars — describe this city's page for search engines..." className="w-full bg-admin-bg border border-admin-border p-4 outline-none focus:border-primary font-medium text-admin-muted resize-none transition-colors" />
                        </div>
                    </div>
                </div>

                {/* Right Column: Content */}
                <div className="space-y-10">
                    {/* Sections & Details */}
                    <div className="bg-admin-surface p-10 border border-admin-border shadow-sm space-y-8">
                        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-admin-muted flex items-center">
                            <List size={16} className="mr-3 text-primary" /> Content & Details
                        </h3>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-admin-text tracking-widest ml-1">CTA Button Text</label>
                                <input name="ctaText" defaultValue={initialData?.ctaText} placeholder="Build My Baltimore Truck" className="w-full bg-admin-bg border border-admin-border p-4 outline-none focus:border-primary font-bold text-sm transition-colors" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-admin-text tracking-widest ml-1">Distance from Shop</label>
                                <input name="distance" defaultValue={initialData?.distance} placeholder="e.g. 50 miles" className="w-full bg-admin-bg border border-admin-border p-4 outline-none focus:border-primary font-bold text-sm transition-colors" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-admin-text tracking-widest ml-1">Why Choose ESC (City-Specific)</label>
                            <textarea name="whyEsc" defaultValue={initialData?.whyEsc} rows={4} placeholder="Explain why ESC is the right builder for this city..." className="w-full bg-admin-bg border border-admin-border p-4 outline-none focus:border-primary font-medium text-admin-muted resize-none transition-colors" />
                        </div>

                        {/* Local Details */}
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase text-admin-text tracking-widest ml-1">Local Compliance & Details</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newDetail}
                                    onChange={(e) => setNewDetail(e.target.value)}
                                    placeholder="e.g. Maryland Health Dept. requires 30-gallon grey water tank"
                                    className="flex-1 bg-admin-bg border border-admin-border p-4 outline-none focus:border-primary font-bold text-xs transition-colors"
                                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addDetail(); } }}
                                />
                                <button type="button" onClick={addDetail} className="p-4 bg-primary text-admin-text hover:bg-orange-500 transition-all">
                                    <Plus size={20} />
                                </button>
                            </div>
                            <ul className="space-y-2">
                                {localDetails.map((detail, i) => (
                                    <li key={i} className="flex justify-between items-center bg-admin-bg p-3 border border-admin-border text-xs text-admin-text font-medium">
                                        <span>{detail}</span>
                                        <button type="button" onClick={() => removeDetail(i)} className="text-gray-400 hover:text-red-500 ml-4 shrink-0"><X size={14} /></button>
                                    </li>
                                ))}
                                {localDetails.length === 0 && <p className="text-[10px] text-admin-muted italic ml-1">No details added yet. Add specific compliance or market notes.</p>}
                            </ul>
                        </div>
                    </div>

                    {/* Process Sections */}
                    <div className="bg-admin-surface p-10 border border-admin-border shadow-sm space-y-8">
                        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-admin-muted flex items-center">
                            <Shield size={16} className="mr-3 text-primary" /> Process Sections
                        </h3>
                        <p className="text-[10px] text-admin-muted -mt-4">These appear as the 3 service cards on the location page.</p>
                        {(["design", "fabrication", "delivery"] as const).map((key) => (
                            <div key={key} className="space-y-3 bg-admin-bg p-5 border border-admin-border">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-primary">{key} Phase</h4>
                                <input
                                    name={`sections.${key}.heading`}
                                    defaultValue={initialData?.sections?.[key]?.heading}
                                    placeholder={`${key.charAt(0).toUpperCase() + key.slice(1)} heading...`}
                                    className="w-full bg-admin-surface border border-admin-border p-3 outline-none focus:border-primary text-xs font-bold text-admin-text transition-colors"
                                />
                                <textarea
                                    name={`sections.${key}.content`}
                                    defaultValue={initialData?.sections?.[key]?.content}
                                    placeholder="Description paragraph..."
                                    rows={2}
                                    className="w-full bg-admin-surface border border-admin-border p-3 outline-none focus:border-primary text-xs text-admin-muted resize-none transition-colors"
                                />
                            </div>
                        ))}
                    </div>

                    {/* FAQs */}
                    <div className="bg-admin-surface p-10 border border-admin-border shadow-sm space-y-8">
                        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-admin-muted flex items-center justify-between">
                            <span className="flex items-center"><HelpCircle size={16} className="mr-3 text-primary" /> City FAQs</span>
                            <button type="button" onClick={addFaq} className="text-primary hover:text-white flex items-center gap-1 text-[10px] font-black uppercase tracking-widest transition-colors">
                                <Plus size={12}/> Add FAQ
                            </button>
                        </h3>

                        <div className="space-y-4">
                            {faq.map((item, i) => (
                                <div key={i} className="bg-admin-bg p-5 border border-admin-border space-y-3 relative">
                                    <button type="button" onClick={() => removeFaq(i)} className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors">
                                        <X size={14} />
                                    </button>
                                    <input
                                        value={item.question}
                                        onChange={(e) => updateFaq(i, "question", e.target.value)}
                                        placeholder="Question"
                                        className="w-full bg-admin-surface border border-admin-border p-3 outline-none focus:border-primary text-xs font-bold pr-8 text-admin-text transition-colors"
                                    />
                                    <textarea
                                        value={item.answer}
                                        onChange={(e) => updateFaq(i, "answer", e.target.value)}
                                        placeholder="Answer"
                                        rows={2}
                                        className="w-full bg-admin-surface border border-admin-border p-3 outline-none focus:border-primary text-xs text-admin-muted resize-none transition-colors"
                                    />
                                </div>
                            ))}
                            {faq.length === 0 && <p className="text-xs text-admin-muted italic">No FAQs added. City-specific FAQs help local SEO.</p>}
                        </div>
                    </div>
                </div>
            </div>

            {initialData && <input type="hidden" name="id" value={initialData.id} />}
        </form>
    );
}
