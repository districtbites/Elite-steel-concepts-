"use client";

import React, { useState, useRef, useEffect } from"react";
import {
  Save, Image as ImageIcon, Type, Layout, List, Link as LinkIcon, CheckCircle,
  Hash, Eye, Bold, Italic, Minus, Quote, Table, ArrowLeft, FileText, AlertCircle, Maximize2, SplitSquareHorizontal,
  Link2, Sparkles, ExternalLink
} from "lucide-react";
import { quickUploadImage } from "@/app/actions/blog";
import { testAutoLinkSandboxAction } from "@/app/actions/internalLinks";
import Link from "next/link";
import Image from "next/image";

interface BlogEditorProps {
 action: (formData: FormData) => void;
 initialData?: any;
}

export default function BlogEditor({ action, initialData }: BlogEditorProps) {
 const [viewMode, setViewMode] = useState<"edit" |"preview" |"split">("split");
 const [content, setContent] = useState(initialData?.content ||"");
 const [uploading, setUploading] = useState(false);
 const [title, setTitle] = useState(initialData?.title ||"");
 const [featuredImagePreview, setFeaturedImagePreview] = useState(initialData?.image ||"");
 const [imageInputMode, setImageInputMode] = useState<"upload" | "url">(initialData?.image?.startsWith("http") ?"url" :"upload");
 const [imageUrlInput, setImageUrlInput] = useState(initialData?.image?.startsWith("http") ? initialData?.image :"");
 const fileInputRef = useRef<HTMLInputElement>(null);
 const featuredImageInputRef = useRef<HTMLInputElement>(null);
 const textareaRef = useRef<HTMLTextAreaElement>(null);
 const [saveStatus, setSaveStatus] = useState("Unsaved changes");

 // Auto-save simulation
 useEffect(() => {
 setSaveStatus("Saving...");
 const timeout = setTimeout(() => setSaveStatus("Saved to draft"), 1000);
 return () => clearTimeout(timeout);
 }, [content, title]);

 const [autoLinking, setAutoLinking] = useState(false);
 const [autoLinkMessage, setAutoLinkMessage] = useState<string | null>(null);

 const handleAutoLinkContent = async () => {
   if (!content.trim()) return;
   setAutoLinking(true);
   setAutoLinkMessage(null);
   try {
     const res = await testAutoLinkSandboxAction(content);
     if (res.success && res.updatedContent !== undefined) {
       setContent(res.updatedContent);
       setAutoLinkMessage(`Injected ${res.linksAdded || 0} strategic internal link(s)!`);
     } else {
       setAutoLinkMessage("No new internal link opportunities detected.");
     }
   } catch (e: any) {
     setAutoLinkMessage(`Error: ${e.message}`);
   }
   setAutoLinking(false);
 };

 const handleInsert = (text: string) => {
 if (textareaRef.current) {
 const textarea = textareaRef.current;
 const start = textarea.selectionStart;
 const end = textarea.selectionEnd;
 const newContent = content.substring(0, start) + text + content.substring(end);
 setContent(newContent);
 setTimeout(() => {
 textarea.focus();
 textarea.setSelectionRange(start + text.length, start + text.length);
 }, 0);
 }
 };

 const handleContentImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
 const file = e.target.files?.[0];
 if (!file) return;
 setUploading(true);
 const formData = new FormData();
 formData.append("file", file);
 const result = await quickUploadImage(formData);
 if (result.url) {
 handleInsert(`\n![${file.name.replace(/\.[^.]+$/,"")}](${result.url})\n`);
 }
 setUploading(false);
 if (e.target) e.target.value ="";
 };

 const handleFeaturedImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
 const file = e.target.files?.[0];
 if (file) setFeaturedImagePreview(URL.createObjectURL(file));
 };

 const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
 setImageUrlInput(e.target.value);
 setFeaturedImagePreview(e.target.value);
 };

 const wordCount = content.split(/\s+/).filter((w: string) => w.length > 0).length;
 const readTimeEstimate = Math.max(1, Math.ceil(wordCount / 200));

 const formatTools = [
 { icon: <Type size={14} />, text:"\n## Heading 2\n", title:"H2" },
 { icon: <Layout size={14} />, text:"\n### Heading 3\n", title:"H3" },
 { icon: <Bold size={14} />, text:"**bold**", title:"Bold" },
 { icon: <Italic size={14} />, text:"*italic*", title:"Italic" },
 { icon: <List size={14} />, text:"\n- Item 1\n- Item 2\n", title:"List" },
 { icon: <Hash size={14} />, text:"\n1. First\n2. Second\n", title:"Numbers" },
 { icon: <Quote size={14} />, text: '\n>"Quote"\n', title:"Quote" },
 { icon: <Minus size={14} />, text:"\n---\n", title:"Divider" },
 { icon: <LinkIcon size={14} />, text:"[Link Text](url)", title:"Link" },
 { icon: <Table size={14} />, text:"\n| Col 1 | Col 2 |\n|---|---|\n| Val | Val |\n", title:"Table" },
 ];

 const renderPreview = (md: string) => {
 let html = md
 .replace(/^### (.+)$/gm, '<h3 class="text-xl font-black uppercase text-admin-text mt-8 mb-4">$1</h3>')
 .replace(/^## (.+)$/gm, '<h2 class="text-2xl font-black uppercase text-admin-text mt-12 mb-6 border-l-[3px] border-primary pl-4 leading-tight">$1</h2>')
 .replace(/\*\*(.+?)\*\*/g, '<strong class="font-black text-admin-text">$1</strong>')
 .replace(/\*(.+?)\*/g, '<em class="italic">$1</em>')
 .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-primary font-bold underline hover:text-orange-600">$1</a>')
 .replace(/!\[(.+?)\]\((.+?)\)/g, '<div class="my-8 border border-admin-border overflow-hidden"><img src="$2" alt="$1" class="w-full object-cover" /></div>')
 .replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-primary pl-4 py-2 my-6 italic text-admin-muted bg-admin-bg">$1</blockquote>')
 .replace(/^---$/gm, '<hr class="my-10 border-admin-border" />')
 .replace(/^- (.+)$/gm, '<li class="flex items-start gap-3 mb-2"><div class="w-1 h-1 bg-primary mt-2 shrink-0"></div><span class="text-admin-muted">$1</span></li>')
 .replace(/^\d+\. (.+)$/gm, '<li class="ml-4 text-admin-muted mb-2 list-decimal">$1</li>')
 .replace(/\n\n/g, '</p><p class="text-admin-muted leading-relaxed mb-6">')
 .replace(/\n/g,"<br />");
 return `<p class="text-admin-muted leading-relaxed mb-6">${html}</p>`;
 };

 return (
 <div className="space-y-6">
 <div className="flex items-center justify-between">
 <Link href="/admin/blog" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-admin-muted hover:text-admin-text transition-colors">
 <ArrowLeft size={14} /> Back to Dashboard
 </Link>
 <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-admin-muted">
 <span className="flex items-center gap-2">
 {saveStatus ==="Saving..." ? <div className="w-2 h-2 -full bg-amber-400 animate-pulse" /> : <div className="w-2 h-2 -full bg-green-500" />}
 {saveStatus}
 </span>
 <span className="w-px h-3 bg-gray-300" />
 <FileText size={12} className="text-primary" /> {wordCount} Words
 </div>
 </div>

 <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
 {/* Main Editor Section */}
 <div className="xl:col-span-8 space-y-6">
 <div className="bg-admin-surface border border-admin-border p-8">
 <div className="space-y-6">
 <div>
 <label className="text-[10px] font-black uppercase tracking-[0.2em] text-admin-muted mb-2 block">Article Title (H1)</label>
 <input
 type="text"
 name="title"
 required
 value={title}
 onChange={(e) => setTitle(e.target.value)}
 placeholder="ENTER HEADLINE..."
 className="w-full bg-transparent border-b-2 border-admin-border focus:border-primary px-0 py-4 outline-none transition-colors text-3xl font-black text-admin-text uppercase tracking-tighter placeholder:text-gray-200"
 />
 </div>
 <div>
 <label className="text-[10px] font-black uppercase tracking-[0.2em] text-admin-muted mb-2 block">Executive Summary / Subtitle</label>
 <input
 type="text"
 name="subtitle"
 defaultValue={initialData?.subtitle}
 placeholder="A compelling 1-2 line summary to hook the reader..."
 className="w-full bg-admin-bg border border-admin-border p-4 outline-none focus:border-primary transition-all text-sm text-gray-700 font-medium"
 />
 </div>
 </div>
 </div>

 <div className="bg-admin-surface border border-admin-border flex flex-col h-[800px]">
 {/* Toolbar */}
 <div className="flex items-center justify-between p-3 border-b border-admin-border bg-admin-bg">
 <div className="flex flex-wrap gap-1">
 {formatTools.map((t, i) => (
 <button key={i} type="button" onClick={() => handleInsert(t.text)} className="p-2 text-admin-muted hover:text-admin-text hover:bg-gray-200 transition-colors" title={t.title}>
 {t.icon}
 </button>
 ))}
 <div className="w-px h-6 bg-gray-300 mx-2 self-center" />
 <button type="button" onClick={() => fileInputRef.current?.click()} className={`p-2 transition-colors ${uploading ?"text-primary animate-pulse" :"text-admin-muted hover:text-admin-text hover:bg-gray-200"}`} title="Insert Image">
 <ImageIcon size={14} />
 </button>
 </div>
 <div className="flex bg-gray-200 p-1">
 <button type="button" onClick={() => setViewMode("edit")} className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest ${viewMode ==="edit" ?"bg-admin-surface text-admin-text shadow-sm" :"text-admin-muted hover:text-admin-text"}`}>Edit</button>
 <button type="button" onClick={() => setViewMode("split")} className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest ${viewMode ==="split" ?"bg-admin-surface text-admin-text shadow-sm" :"text-admin-muted hover:text-admin-text"}`}><SplitSquareHorizontal size={14} className="inline mr-1"/> Split</button>
 <button type="button" onClick={() => setViewMode("preview")} className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest ${viewMode ==="preview" ?"bg-admin-surface text-admin-text shadow-sm" :"text-admin-muted hover:text-admin-text"}`}><Eye size={14} className="inline mr-1"/> Preview</button>
 </div>
 </div>

 {/* Editor & Preview Area */}
 <div className="flex-1 flex overflow-hidden">
 {(viewMode ==="edit" || viewMode ==="split") && (
 <div className={`relative ${viewMode ==="split" ?"w-1/2 border-r border-admin-border" :"w-full"}`}>
 <textarea
 ref={textareaRef}
 name="content"
 value={content}
 onChange={(e) => setContent(e.target.value)}
 required
 className="w-full h-full p-8 outline-none text-gray-700 leading-relaxed font-mono text-sm resize-none bg-admin-surface"
 placeholder="Write your markdown content here..."
 />
 {uploading && (
 <div className="absolute inset-0 bg-admin-surface/80 flex items-center justify-center">
 <span className="text-[10px] font-black uppercase tracking-widest text-primary animate-pulse">Uploading...</span>
 </div>
 )}
 </div>
 )}
 
 {(viewMode ==="preview" || viewMode ==="split") && (
 <div className={`overflow-y-auto p-8 bg-admin-surface ${viewMode ==="split" ?"w-1/2 bg-admin-bg" :"w-full"}`}>
 {content ? (
 <div dangerouslySetInnerHTML={{ __html: renderPreview(content) }} />
 ) : (
 <div className="flex flex-col items-center justify-center h-full text-admin-muted">
 <Eye size={32} className="mb-4 opacity-50" />
 <p className="text-[10px] font-black uppercase tracking-widest">Live Preview Empty</p>
 </div>
 )}
 </div>
 )}
 </div>
 <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleContentImageUpload} />
 </div>
 </div>

 {/* Sidebar */}
 <div className="xl:col-span-4 space-y-6">
 {/* Internal Linking Assistant */}
 <div className="bg-admin-surface p-8 border border-admin-border space-y-4">
   <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-admin-text flex items-center justify-between pb-4 border-b border-admin-border">
     <span className="flex items-center gap-2">
       <Link2 size={14} className="text-primary" /> Internal Link Engine
     </span>
     <Link href="/admin/internal-links" target="_blank" className="text-[9px] text-primary hover:underline flex items-center gap-1 font-bold">
       Rules Manager <ExternalLink size={10} />
     </Link>
   </h3>
   
   <p className="text-[11px] text-admin-muted leading-relaxed">
     Automatically scan and inject strategic internal links into this article using your active keyword rules.
   </p>

   <button
     type="button"
     onClick={handleAutoLinkContent}
     disabled={autoLinking || !content.trim()}
     className="w-full bg-primary hover:bg-orange-600 text-black py-3.5 font-black uppercase text-[10px] tracking-[0.2em] transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-md cursor-pointer"
   >
     <Sparkles size={14} className={autoLinking ? "animate-spin" : ""} />
     {autoLinking ? "Scanning & Linking..." : "Auto-Link Content (1-Click)"}
   </button>

   {autoLinkMessage && (
     <div className="p-3 bg-admin-bg border border-primary/30 text-[11px] text-primary font-bold">
       {autoLinkMessage}
     </div>
   )}

   {/* Quick Insert Target Helpers */}
   <div className="pt-3 border-t border-admin-border space-y-2">
     <span className="text-[9px] font-black uppercase tracking-widest text-admin-muted block">Quick Insert Strategic Links:</span>
     <div className="flex flex-wrap gap-1.5">
       {[
         { label: "Homepage", md: "[Elite Steel Concepts](/)" },
         { label: "Food Trucks", md: "[custom food truck builder](/services/custom-food-trucks)" },
         { label: "Food Trailers", md: "[custom food trailers](/services/custom-food-trailers)" },
         { label: "Repairs", md: "[commercial food truck repairs](/services/repairs-and-upgrades)" },
         { label: "Design", md: "[mobile kitchen layout design](/services/design-and-consultation)" },
         { label: "Compliance", md: "[DMV food truck compliance](/compliance)" },
         { label: "Quote", md: "[request a custom quote](/quote)" },
       ].map(btn => (
         <button
           key={btn.label}
           type="button"
           onClick={() => handleInsert(btn.md)}
           className="text-[9px] font-bold bg-admin-bg hover:bg-admin-border px-2 py-1 border border-admin-border text-admin-muted hover:text-admin-text transition-colors"
         >
           + {btn.label}
         </button>
       ))}
     </div>
   </div>
 </div>

 <div className="bg-admin-surface p-8 border border-admin-border">
 <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-admin-text flex items-center gap-3 mb-6 pb-4 border-b border-admin-border">
 <CheckCircle size={14} className="text-primary" /> Publish Settings
 </h3>
 <div className="space-y-6">
 <div>
 <label className="text-[9px] font-black uppercase tracking-[0.2em] text-admin-muted mb-2 block">Status</label>
 <select name="status" defaultValue={initialData?.status ||"Draft"} className="w-full bg-admin-bg border border-admin-border text-admin-text p-4 outline-none focus:border-primary text-xs font-black uppercase tracking-widest">
 <option value="Draft">Draft (Hidden)</option>
 <option value="Published">Publish Live</option>
 </select>
 </div>
 <div>
 <label className="text-[9px] font-black uppercase tracking-[0.2em] text-admin-muted mb-2 block">Category</label>
 <select name="category" defaultValue={initialData?.category ||"Maintenance"} className="w-full bg-admin-bg border border-admin-border text-admin-text p-4 outline-none focus:border-primary text-xs font-black uppercase tracking-widest">
 <option value="Maintenance">Maintenance</option>
 <option value="Regulation">Regulation</option>
 <option value="Design">Design</option>
 <option value="Advice">Advice</option>
 <option value="News">News</option>
 <option value="Business">Business</option>
 </select>
 </div>
 <div>
 <label className="text-[9px] font-black uppercase tracking-[0.2em] text-admin-muted mb-2 block">Tags (Comma Sep)</label>
 <input type="text" name="tags" defaultValue={initialData?.tags?.join(",")} placeholder="Fabrication, Virginia" className="w-full bg-admin-bg border border-admin-border text-admin-text p-4 outline-none focus:border-primary text-xs font-bold" />
 </div>
 <div>
 <label className="text-[9px] font-black uppercase tracking-[0.2em] text-admin-muted mb-2 block">SEO Meta Description</label>
 <textarea name="metaDescription" defaultValue={initialData?.metaDescription ||""} rows={3} placeholder="150 char meta description..." className="w-full bg-admin-bg border border-admin-border text-admin-text p-4 outline-none focus:border-primary text-xs font-bold resize-none" />
 </div>
 </div>
 <button type="submit" className="w-full bg-primary text-admin-text py-5 mt-8 font-black uppercase text-[10px] tracking-[0.2em] hover:bg-orange-500 transition-colors flex items-center justify-center gap-3">
 <Save size={14} /> Commit Changes
 </button>
 </div>

 <div className="bg-admin-surface border border-admin-border p-8">
 <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-admin-text flex items-center justify-between mb-6 pb-4 border-b border-admin-border">
 <span className="flex items-center gap-3">
 <ImageIcon size={14} className="text-primary" /> Feature Media
 </span>
 <div className="flex gap-2">
 <button 
 type="button" 
 onClick={() => setImageInputMode("upload")}
 className={`px-2 py-1 text-[9px] font-black uppercase tracking-widest transition-colors ${imageInputMode ==="upload" ?"bg-primary text-admin-text" :"text-admin-muted hover:text-admin-text"}`}
 >
 Upload
 </button>
 <button 
 type="button" 
 onClick={() => setImageInputMode("url")}
 className={`px-2 py-1 text-[9px] font-black uppercase tracking-widest transition-colors ${imageInputMode ==="url" ?"bg-primary text-admin-text" :"text-admin-muted hover:text-admin-text"}`}
 >
 URL Link
 </button>
 </div>
 </h3>
 <div className="space-y-6">
 {imageInputMode ==="upload" ? (
 <div 
 className="border-2 border-dashed border-admin-border bg-admin-bg hover:bg-gray-100 hover:border-primary transition-all cursor-pointer relative"
 onClick={() => featuredImageInputRef.current?.click()}
 >
 <div className="p-8 text-center">
 {featuredImagePreview && !featuredImagePreview.startsWith("http") ? (
 // eslint-disable-next-line @next/next/no-img-element
 <img src={featuredImagePreview} alt="Preview" className="w-full h-auto object-cover mb-4" />
 ) : (
 <ImageIcon size={32} className="mx-auto text-gray-300 mb-3" />
 )}
 <p className="text-[10px] font-black uppercase tracking-[0.2em] text-admin-muted">
 {featuredImagePreview && !featuredImagePreview.startsWith("http") ?"Click to Replace Image" :"Upload Feature Image"}
 </p>
 </div>
 <input type="file" ref={featuredImageInputRef} name="image" className="hidden" accept="image/*" onChange={handleFeaturedImageUpload} />
 </div>
 ) : (
 <div>
 <label className="text-[9px] font-black uppercase tracking-[0.2em] text-admin-muted mb-2 block">Image URL Link</label>
 <input 
 type="url" 
 name="imageUrl" 
 value={imageUrlInput}
 onChange={handleImageUrlChange}
 placeholder="https://example.com/image.jpg" 
 className="w-full bg-admin-bg border border-admin-border p-4 outline-none focus:border-primary text-xs font-bold" 
 />
 {imageUrlInput && (
 <div className="mt-4">
 {/* eslint-disable-next-line @next/next/no-img-element */}
 <img src={imageUrlInput} alt="URL Preview" className="w-full h-auto object-cover border border-admin-border" onError={(e) => (e.currentTarget.style.display = 'none')} onLoad={(e) => (e.currentTarget.style.display = 'block')} />
 </div>
 )}
 </div>
 )}
 {initialData?.image && <input type="hidden" name="existingImage" value={initialData.image} />}
 <div>
 <label className="text-[9px] font-black uppercase tracking-[0.2em] text-admin-muted mb-2 block">Image ALT Text</label>
 <input type="text" name="imageAlt" defaultValue={initialData?.imageAlt} placeholder="Descriptive text..." className="w-full bg-admin-bg border border-admin-border p-4 outline-none focus:border-primary text-xs font-bold" />
 </div>
 </div>
 </div>
 </div>
 </div>
 </div>
 );
}
