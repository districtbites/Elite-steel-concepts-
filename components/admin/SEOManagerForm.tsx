"use client";

import React, { useState } from "react";
import { Save, Search, Share2, Globe, FileText } from "lucide-react";
import Toast from "@/components/ui/Toast";
import { saveSEO } from "@/app/actions/settings";
import { SEOSettings } from "@/lib/db";

interface SEOManagerFormProps {
  seo: SEOSettings;
  pages: { id: string, name: string }[];
}

const SEOManagerForm = ({ seo, pages }: SEOManagerFormProps) => {
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    const result = await saveSEO(formData);
    
    if (result?.success) {
      setToastMsg(result.message);
      setShowToast(true);
    }
    setLoading(false);
  };

  return (
    <>
      {showToast && (
        <Toast 
          message={toastMsg} 
          onClose={() => setShowToast(false)} 
        />
      )}

      <form action={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Global & Technical */}
            <div className="lg:col-span-1 space-y-8">
                {/* Global Metadata */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h2 className="text-lg font-bold uppercase text-secondary mb-6 border-b border-gray-100 pb-3 flex items-center tracking-tight">
                        <Globe size={18} className="mr-2 text-primary" /> Global Defaults
                    </h2>
                    <div className="space-y-5">
                      <div className="space-y-1.5">
                          <label className="text-[11px] font-black uppercase tracking-widest text-gray-400">Default Site Title</label>
                          <input type="text" name="siteTitle" defaultValue={seo.siteTitle} className="w-full bg-gray-50 border border-gray-200 p-3 rounded-md outline-none focus:border-primary transition-all text-sm" />
                      </div>
                      <div className="space-y-1.5">
                          <label className="text-[11px] font-black uppercase tracking-widest text-gray-400">Global Keywords</label>
                          <textarea rows={3} name="keywords" defaultValue={seo.keywords} className="w-full bg-gray-50 border border-gray-200 p-3 rounded-md outline-none focus:border-primary transition-all text-sm resize-none" />
                      </div>
                    </div>
                </div>

                {/* Social (OG) */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h2 className="text-lg font-bold uppercase text-secondary mb-6 border-b border-gray-100 pb-3 flex items-center tracking-tight">
                        <Share2 size={18} className="mr-2 text-primary" /> Social Sharing
                    </h2>
                    <div className="space-y-5">
                      <div className="space-y-1.5">
                          <label className="text-[11px] font-black uppercase tracking-widest text-gray-400">Open Graph Image URL</label>
                          <input type="text" name="ogImage" defaultValue={seo.ogImage} className="w-full bg-gray-50 border border-gray-200 p-3 rounded-md outline-none focus:border-primary transition-all text-sm" />
                          <p className="text-[10px] text-gray-400">Recommended size: 1200x630px</p>
                      </div>
                      <div className="space-y-1.5">
                          <label className="text-[11px] font-black uppercase tracking-widest text-gray-400">Twitter @Handle</label>
                          <input type="text" name="twitterHandle" defaultValue={seo.twitterHandle} className="w-full bg-gray-50 border border-gray-200 p-3 rounded-md outline-none focus:border-primary transition-all text-sm" />
                      </div>
                    </div>
                </div>

                {/* Technical */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h2 className="text-lg font-bold uppercase text-secondary mb-6 border-b border-gray-100 pb-3 flex items-center tracking-tight">
                        <Search size={18} className="mr-2 text-primary" /> Technical Config
                    </h2>
                    <div className="space-y-5">
                      <div className="space-y-1.5">
                          <label className="text-[11px] font-black uppercase tracking-widest text-gray-400">Canonical Base URL</label>
                          <input type="text" name="canonicalUrl" defaultValue={seo.canonicalUrl} className="w-full bg-gray-50 border border-gray-200 p-3 rounded-md outline-none focus:border-primary transition-all text-sm" />
                      </div>
                      <div className="space-y-1.5">
                          <label className="text-[11px] font-black uppercase tracking-widest text-gray-400">Robots.txt</label>
                          <textarea rows={4} name="robotsTxt" defaultValue={seo.robotsTxt} className="w-full bg-gray-50 border border-gray-200 p-3 rounded-md outline-none focus:border-primary font-mono text-xs transition-all resize-none" />
                      </div>
                    </div>
                </div>
            </div>

            {/* Right Column: Individual Page SEO */}
            <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="p-6 bg-secondary text-white flex items-center justify-between">
                        <h2 className="text-xl font-black uppercase tracking-tight flex items-center">
                          <FileText size={20} className="mr-3 text-primary" /> Individual Page Optimization
                        </h2>
                        <span className="text-[10px] font-bold uppercase bg-white/10 px-3 py-1 rounded-full">
                          {pages.length} Pages Configurable
                        </span>
                    </div>
                    
                    <div className="p-0">
                        {pages.map((page, idx) => {
                          const pageData = seo.pages?.[page.id] || { title: "", description: "", keywords: "" };
                          return (
                              <div key={page.id} className={`p-8 ${idx !== pages.length -1 ? 'border-b border-gray-100' : ''} hover:bg-gray-50/50 transition-colors`}>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center text-xs font-black">
                                      {idx + 1}
                                    </div>
                                    <h3 className="font-black uppercase text-secondary text-lg tracking-tight">{page.name}</h3>
                                    <div className="h-px flex-1 bg-gray-100 ml-2"></div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2 space-y-1.5">
                                      <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">Browser Page Title</label>
                                      <input 
                                          type="text" 
                                          name={`page_${page.id}_title`} 
                                          defaultValue={pageData.title} 
                                          placeholder={`${page.name} | Site Name`}
                                          className="w-full bg-white border border-gray-200 p-3.5 rounded-lg outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-sm font-medium" 
                                      />
                                    </div>
                                    <div className="space-y-1.5">
                                      <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">Meta Description</label>
                                      <textarea 
                                          rows={4} 
                                          name={`page_${page.id}_description`} 
                                          defaultValue={pageData.description} 
                                          className="w-full bg-white border border-gray-200 p-3.5 rounded-lg outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-sm resize-none leading-relaxed" 
                                      />
                                      <p className="text-[10px] text-gray-400 text-right">Target 155 chars</p>
                                    </div>
                                    <div className="space-y-1.5">
                                      <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">Page Keywords</label>
                                      <textarea 
                                          rows={4} 
                                          name={`page_${page.id}_keywords`} 
                                          defaultValue={pageData.keywords} 
                                          placeholder="Keyword 1, Keyword 2..."
                                          className="w-full bg-white border border-gray-200 p-3.5 rounded-lg outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-sm resize-none leading-relaxed" 
                                      />
                                      <p className="text-[10px] text-gray-400">Specific to {page.name}</p>
                                    </div>
                                </div>
                              </div>
                          );
                        })}
                    </div>
                </div>
            </div>
          </div>

          <div className="fixed bottom-8 right-8 z-30">
            <button 
                type="submit" 
                disabled={loading}
                className="bg-primary text-secondary px-8 py-4 rounded-full shadow-2xl hover:scale-105 active:scale-95 disabled:opacity-70 disabled:scale-100 transition-all font-black uppercase tracking-widest flex items-center group"
            >
                <Save size={20} className={`mr-3 ${loading ? 'animate-spin' : 'group-hover:rotate-12'} transition-transform`} /> 
                {loading ? "Saving..." : "Save SEO Master Config"}
            </button>
          </div>
      </form>
    </>
  );
};

export default SEOManagerForm;
