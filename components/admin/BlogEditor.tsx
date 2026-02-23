"use client";

import React, { useState, useRef } from "react";
import { Save, Image as ImageIcon, Type, Layout, List, Link as LinkIcon, CheckCircle, Info, Hash, Eye, Edit3, X } from "lucide-react";
import Button from "@/components/ui/Button";
import { quickUploadImage } from "@/app/actions/blog";

interface BlogEditorProps {
    action: (formData: FormData) => void;
    initialData?: any;
}

const BlogEditor = ({ action, initialData }: BlogEditorProps) => {
    const [previewMode, setPreviewMode] = useState(false);
    const [content, setContent] = useState(initialData?.content || "");
    const [uploading, setUploading] = useState(false);
    const [uploadedImages, setUploadedImages] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleInsert = (text: string) => {
        setContent((prev: string) => prev + "\n" + text);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        const result = await quickUploadImage(formData);
        if (result.url) {
            setUploadedImages(prev => [...prev, result.url]);
            handleInsert(`![Alt text](${result.url})`);
        }
        setUploading(false);
    };

    const templates = [
        { name: "Main Heading (H2)", icon: <Type size={16} />, text: "## Your Heading Here" },
        { name: "Sub Heading (H3)", icon: <Layout size={16} />, text: "### Your Sub-heading Here" },
        { name: "Bulleted List", icon: <List size={16} />, text: "- Point one\n- Point two\n- Point three" },
        { name: "Internal Link", icon: <LinkIcon size={16} />, text: "[Link Text](/your-internal-link)" },
    ];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-6">
                {/* Header Info */}
                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                    <div className="grid grid-cols-1 gap-6">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Article Title (H1)</label>
                            <input 
                                type="text" 
                                name="title" 
                                required 
                                defaultValue={initialData?.title}
                                placeholder="e.g. 5 Maintenance Tips for Your Food Truck"
                                className="w-full bg-gray-50 border-0 p-4 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all text-2xl font-black text-secondary uppercase tracking-tight" 
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Intro / Subtitle</label>
                            <input 
                                type="text" 
                                name="subtitle" 
                                defaultValue={initialData?.subtitle}
                                placeholder="A short 2-3 line summary that hooks the reader."
                                className="w-full bg-gray-50 border-0 p-4 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-gray-600" 
                            />
                        </div>
                    </div>
                </div>

                {/* Editor Content */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-100">
                        <div className="flex gap-2">
                            <button 
                                type="button"
                                onClick={() => setPreviewMode(false)}
                                className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all ${!previewMode ? 'bg-secondary text-white shadow-md' : 'text-gray-400 hover:text-secondary'}`}
                            >
                                <Edit3 size={14} /> Editor
                            </button>
                            <button 
                                type="button"
                                onClick={() => setPreviewMode(true)}
                                className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all ${previewMode ? 'bg-secondary text-white shadow-md' : 'text-gray-400 hover:text-secondary'}`}
                            >
                                <Eye size={14} /> Preview
                            </button>
                        </div>
                        <div className="flex gap-2">
                            {templates.map((t, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => handleInsert(t.text)}
                                    className="p-2 bg-white border border-gray-200 rounded-lg text-gray-500 hover:text-primary hover:border-primary transition-all shadow-sm"
                                    title={t.name}
                                >
                                    {t.icon}
                                </button>
                            ))}
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="p-2 bg-white border border-gray-200 rounded-lg text-gray-500 hover:text-primary hover:border-primary transition-all shadow-sm"
                                title="Upload Image"
                            >
                                <ImageIcon size={16} />
                            </button>
                        </div>
                    </div>

                    <div className="relative">
                        {!previewMode ? (
                            <textarea 
                                name="content"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                required
                                rows={25}
                                placeholder="## Enter your content structure here..."
                                className="w-full p-8 outline-none text-gray-700 leading-loose font-mono text-sm bg-white resize-none"
                            />
                        ) : (
                            <div className="w-full p-8 min-h-[500px] bg-gray-50 prose prose-secondary max-w-none">
                                <h1 className="text-gray-400 italic">Preview Mode Active</h1>
                                <div className="whitespace-pre-wrap">{content}</div>
                            </div>
                        )}
                        
                        {uploading && (
                            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
                                <span className="text-xs font-black uppercase tracking-widest animate-pulse">Uploading Media...</span>
                            </div>
                        )}
                    </div>
                </div>
                
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleImageUpload} 
                />
            </div>

            {/* Sidebar Settings */}
            <div className="lg:col-span-4 space-y-6">
                {/* Publishing Specs */}
                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                    <h3 className="text-sm font-black uppercase tracking-tight flex items-center text-secondary">
                        <CheckCircle size={16} className="mr-2 text-primary" /> Publishing Specs
                    </h3>
                    
                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Visibility</label>
                            <select name="status" defaultValue={initialData?.status || "Draft"} className="w-full bg-gray-50 border-0 p-3.5 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-secondary appearance-none">
                                <option value="Draft">Save as Draft</option>
                                <option value="Published">Go Live (Published)</option>
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Main Industry</label>
                            <select name="category" defaultValue={initialData?.category || "Maintenance"} className="w-full bg-gray-50 border-0 p-3.5 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-secondary appearance-none">
                                <option value="Maintenance">Maintenance</option>
                                <option value="Regulation">Regulation</option>
                                <option value="Design">Design</option>
                                <option value="Advice">Advice</option>
                                <option value="News">News</option>
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Tags (comma separated)</label>
                            <div className="relative">
                                <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                                <input 
                                    type="text" 
                                    name="tags" 
                                    defaultValue={initialData?.tags?.join(", ")}
                                    placeholder="FoodTrucks, Fabrication, VA"
                                    className="w-full bg-gray-50 border-0 pl-10 pr-3.5 py-3.5 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium" 
                                />
                            </div>
                        </div>
                    </div>
                    
                    <button 
                        type="submit" 
                        formAction={(fd) => action(fd)}
                        className="w-full bg-secondary text-white py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl hover:bg-primary hover:text-secondary transition-all flex items-center justify-center gap-3"
                    >
                        <Save size={18} /> Finish & Save
                    </button>
                </div>

                {/* Media Master */}
                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                    <h3 className="text-sm font-black uppercase tracking-tight flex items-center text-secondary">
                        <ImageIcon size={16} className="mr-2 text-primary" /> Feature Media
                    </h3>

                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Feature Image Upload</label>
                            <input type="file" name="image" className="w-full bg-gray-50 border-0 p-3 rounded-xl outline-none transition-all text-xs" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">SEO ALT Text</label>
                            <input type="text" name="imageAlt" placeholder="e.g. Custom food truck interior in Virginia" className="w-full bg-gray-50 border-0 p-3 rounded-xl outline-none transition-all text-xs font-bold" />
                        </div>
                        {initialData?.image && (
                            <div className="pt-4 mt-4 border-t border-gray-100">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">Current Image</label>
                                <img src={initialData.image} alt="Preview" className="rounded-xl aspect-video object-cover w-full grayscale contrast-125" />
                                <input type="hidden" name="existingImage" value={initialData.image} />
                            </div>
                        )}
                    </div>
                </div>

                {/* Blog Structure Guide */}
                <div className="bg-primary/5 p-8 rounded-3xl border border-primary/10 space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-tight flex items-center text-secondary">
                        <Info size={16} className="mr-2 text-primary" /> Structure Guide
                    </h3>
                    <ul className="space-y-2 text-[11px] font-bold text-gray-500 uppercase tracking-wide">
                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary" /> Title (H1)</li>
                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary" /> Intro (2-3 lines)</li>
                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary" /> Headings (H2)</li>
                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary" /> Subpoints (H3)</li>
                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary" /> Images with ALT</li>
                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary" /> Internal Links</li>
                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary" /> Conclusion / CTA</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default BlogEditor;
