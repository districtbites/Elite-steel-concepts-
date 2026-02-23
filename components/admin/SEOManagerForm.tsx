"use client";

import React, { useState } from "react";
import { 
  Save, 
  Search, 
  Share2, 
  Globe, 
  FileText, 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  ShieldCheck, 
  Zap, 
  BarChart4,
  Layout,
  Code2,
  AlertCircle,
  Hash
} from "lucide-react";
import Toast from "@/components/ui/Toast";
import { SEOSettings } from "@/lib/db";

interface SEOManagerFormProps {
  seo: SEOSettings;
  pages: { id: string, name: string }[];
}

const SEOManagerForm = ({ seo, pages }: SEOManagerFormProps) => {
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [activeTab, setActiveTab] = useState(pages[0].id);
  const [activeSubTab, setActiveSubTab] = useState<"meta" | "content" | "tech">("meta");

  // Dynamic Data states
  const [imageAltsState, setImageAltsState] = useState<{ [key: string]: { [key: string]: string } }>(() => {
    const initial: { [key: string]: { [key: string]: string } } = {};
    pages.forEach(p => { initial[p.id] = seo.pages?.[p.id]?.imageAlts || {}; });
    return initial;
  });

  const [sectionsState, setSectionsState] = useState<{ [key: string]: { [key: string]: any } }>(() => {
    const initial: { [key: string]: { [key: string]: any } } = {};
    pages.forEach(p => { initial[p.id] = seo.pages?.[p.id]?.sections || {}; });
    return initial;
  });

  const [structuredDataState, setStructuredDataState] = useState<{ [key: string]: string }>(() => {
    const initial: { [key: string]: string } = {};
    pages.forEach(p => { initial[p.id] = seo.pages?.[p.id]?.structuredData || ""; });
    return initial;
  });

  const [metaState, setMetaState] = useState<{ [key: string]: { title: string, description: string, keywords: string } }>(() => {
    const initial: { [key: string]: { title: string, description: string, keywords: string } } = {};
    pages.forEach(p => { 
        const pData = seo.pages?.[p.id] || {};
        initial[p.id] = {
            title: pData.title || "",
            description: pData.description || "",
            keywords: pData.keywords || ""
        };
    });
    return initial;
  });

  // Alt Handlers
  const [newAltKeys, setNewAltKeys] = useState<{ [key: string]: string }>({});

  const handleAddAlt = (pageId: string) => {
    const key = newAltKeys[pageId];
    if (!key) return;
    setImageAltsState(prev => ({
        ...prev,
        [pageId]: { ...prev[pageId], [key]: "" }
    }));
    setNewAltKeys(prev => ({ ...prev, [pageId]: "" }));
  };

  const handleRemoveAlt = (pageId: string, altKey: string) => {
    setImageAltsState(prev => {
        const newState = { ...prev };
        const newPageAlts = { ...newState[pageId] };
        delete newPageAlts[altKey];
        newState[pageId] = newPageAlts;
        return newState;
    });
  };

  const handleAltChange = (pageId: string, altKey: string, value: string) => {
    setImageAltsState(prev => ({
        ...prev,
        [pageId]: { ...prev[pageId], [altKey]: value }
    }));
  };

  // Section Handlers
  const [newSectionKeys, setNewSectionKeys] = useState<{ [key: string]: string }>({});

  const handleAddSection = (pageId: string) => {
    const key = newSectionKeys[pageId];
    if (!key) return;
    setSectionsState(prev => ({
        ...prev,
        [pageId]: { ...prev[pageId], [key]: { title: "", subtitle: "", content: "", ctaText: "" } }
    }));
    setNewSectionKeys(prev => ({ ...prev, [pageId]: "" }));
  };

  const handleRemoveSection = (pageId: string, sectionKey: string) => {
    if (!confirm(`Delete section '${sectionKey}'? This will remove its content override.`)) return;
    setSectionsState(prev => {
        const newState = { ...prev };
        const newPageSections = { ...newState[pageId] };
        delete newPageSections[sectionKey];
        newState[pageId] = newPageSections;
        return newState;
    });
  };

  const handleSectionFieldChange = (pageId: string, sectionKey: string, field: string, value: string) => {
    setSectionsState(prev => ({
        ...prev,
        [pageId]: {
            ...prev[pageId],
            [sectionKey]: { 
                ...prev[pageId][sectionKey],
                [field]: value 
            }
        }
    }));
  };

  const handleStructuredDataChange = (pageId: string, value: string) => {
    setStructuredDataState(prev => ({
        ...prev,
        [pageId]: value
    }));
  };

  const handleMetaFieldChange = (pageId: string, field: "title" | "description" | "keywords", value: string) => {
    setMetaState(prev => ({
        ...prev,
        [pageId]: {
            ...prev[pageId],
            [field]: value
        }
    }));
  };

  const handleGlobalSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const { saveGlobalSEO } = await import("@/app/actions/settings");
    const result = await saveGlobalSEO(formData);
    if (result?.success) {
      setToastMsg(result.message);
      setShowToast(true);
    }
    setLoading(false);
  };

  const handlePageSubmit = async (pageId: string, e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    // Add dynamic alts
    const alts = imageAltsState[pageId] || {};
    Object.entries(alts).forEach(([key, val]) => {
        formData.append(`page_${pageId}_alt_${key}`, val);
    });

    // Add dynamic sections
    const sections = sectionsState[pageId] || {};
    Object.entries(sections).forEach(([secKey, secData]) => {
        Object.entries(secData).forEach(([field, val]) => {
            formData.append(`page_${pageId}_section_${secKey}_${field}`, val as string);
        });
    });

    // Add metadata from state
    const meta = metaState[pageId] || { title: "", description: "", keywords: "" };
    formData.append(`page_${pageId}_title`, meta.title);
    formData.append(`page_${pageId}_description`, meta.description);
    formData.append(`page_${pageId}_keywords`, meta.keywords);

    // Add structured data
    formData.append(`page_${pageId}_structuredData`, structuredDataState[pageId] || "");

    const { savePageSEO } = await import("@/app/actions/settings");
    const result = await savePageSEO(pageId, formData);
    if (result?.success) {
      setToastMsg(result.message);
      setShowToast(true);
    }
    setLoading(false);
  };

  // Simulated Health Score
  const score = React.useMemo(() => {
    let s = 75;
    if (seo.siteTitle) s += 5;
    if (seo.ogImage) s += 5;
    if (seo.canonicalUrl) s += 10;
    if (seo.robotsTxt) s += 5;
    return Math.min(s, 100);
  }, [seo]);

  return (
    <>
      {showToast && (
        <Toast 
          message={toastMsg} 
          onClose={() => setShowToast(false)} 
        />
      )}

      <div className="space-y-10 pb-24">
          {/* Advanced Header / Dashboard */}
          <div className="bg-secondary rounded-3xl p-10 text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 blur-[100px] -mr-48 -mt-48 rounded-full group-hover:bg-primary/30 transition-all duration-1000"></div>
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
                <div className="space-y-4">
                   <div className="flex items-center gap-3 bg-white/5 w-fit px-4 py-1.5 rounded-full border border-white/10">
                      <Zap size={14} className="text-primary" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-primary">Intelligence Console v2.0</span>
                   </div>
                   <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter flex items-center">
                     <ShieldCheck className="mr-5 text-primary" size={48} /> SEO & Content Master
                   </h1>
                   <p className="text-gray-400 max-w-xl text-md font-light leading-relaxed">
                     Deploy technical metadata, structured schema, and manage on-page content verticals from a single high-performance engine.
                   </p>
                </div>
                
                <div className="flex gap-10 items-center bg-white/5 p-8 rounded-[2.5rem] border border-white/10 backdrop-blur-md">
                    <div className="text-center">
                        <div className="text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">Visibility Health</div>
                        <div className={`text-5xl font-black ${score > 90 ? 'text-green-400' : 'text-primary'}`}>
                            {score}%
                        </div>
                    </div>
                    <div className="h-16 w-px bg-white/10"></div>
                    <div className="space-y-3">
                       <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                          <span className="text-[10px] font-black uppercase tracking-widest">Index Status: Active</span>
                       </div>
                       <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-primary"></div>
                          <span className="text-[10px] font-black uppercase tracking-widest">Sitemap: Synchronized</span>
                       </div>
                    </div>
                </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Left Sidebar: Technical & Global */}
            <form onSubmit={handleGlobalSubmit} className="lg:col-span-1 space-y-8">
                {/* Global Master Config */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all">
                    <h2 className="text-xs font-black uppercase text-secondary mb-8 flex items-center tracking-widest">
                        <Globe size={18} className="mr-4 text-primary" /> Global Master
                    </h2>
                    <div className="space-y-8">
                      <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Master Site Title</label>
                          <input type="text" name="siteTitle" defaultValue={seo.siteTitle} className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl outline-none focus:border-primary transition-all text-sm font-bold text-secondary" />
                      </div>
                      <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Global Meta Description</label>
                          <textarea rows={4} name="description" defaultValue={seo.description} className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl outline-none focus:border-primary transition-all text-sm font-medium resize-none leading-relaxed" />
                      </div>
                      <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Master Keywords</label>
                          <textarea rows={3} name="keywords" defaultValue={seo.keywords} className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl outline-none focus:border-primary transition-all text-sm font-medium resize-none" />
                      </div>
                    </div>
                </div>

                {/* Technical & Social */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all">
                    <h2 className="text-xs font-black uppercase text-secondary mb-8 flex items-center tracking-widest">
                        <Code2 size={18} className="mr-4 text-primary" /> Tech & Social
                    </h2>
                    <div className="space-y-8">
                      <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Canonical Origin</label>
                          <input type="text" name="canonicalUrl" defaultValue={seo.canonicalUrl} className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl outline-none focus:border-primary transition-all text-sm font-bold" />
                      </div>
                      <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Social Preview Image</label>
                          <input type="text" name="ogImage" defaultValue={seo.ogImage} className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl outline-none focus:border-primary transition-all text-sm font-bold" />
                      </div>
                    </div>
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-secondary text-white p-6 rounded-[2rem] font-black uppercase text-[11px] tracking-[0.3em] shadow-2xl hover:bg-primary hover:text-secondary transition-all flex items-center justify-center gap-4 group"
                >
                    <Save size={18} className={loading ? 'animate-spin' : 'group-hover:scale-110'} />
                    {loading ? "Syncing..." : "Sync Master Config"}
                </button>
            </form>

            {/* Right Column: Interactive Page Tabs */}
            <div className="lg:col-span-3">
                <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full min-h-[800px]">
                    {/* Tab Navigation */}
                    <div className="bg-gray-50/80 p-3 border-b border-gray-100 flex overflow-x-auto no-scrollbar gap-2">
                        {pages.map((page) => (
                            <button
                                key={page.id}
                                type="button"
                                onClick={() => setActiveTab(page.id)}
                                className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap shrink-0 ${
                                    activeTab === page.id 
                                    ? "bg-white text-secondary shadow-md ring-1 ring-gray-100" 
                                    : "text-gray-400 hover:text-secondary hover:bg-white/50"
                                }`}
                            >
                                {page.name}
                            </button>
                        ))}
                    </div>

                    {/* Active Tab Content */}
                    <div className="p-10 flex-grow flex flex-col">
                        {pages.map((page) => {
                            const pageData = seo.pages?.[page.id] || { title: "", description: "", keywords: "" };
                            const isActive = activeTab === page.id;

                            if (!isActive) return null;

                            return (
                                <form 
                                    key={page.id} 
                                    onSubmit={(e) => handlePageSubmit(page.id, e)}
                                    className="animate-fadeIn flex flex-col h-full space-y-10"
                                >
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-100 pb-8">
                                        <div>
                                            <h3 className="text-3xl font-black uppercase text-secondary tracking-tighter">{page.name} Control</h3>
                                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
                                               <Hash size={12} className="text-primary" /> Route ID: /{page.id === 'home' ? '' : page.id}
                                            </p>
                                        </div>
                                        
                                        {/* Internal optimization sub-tabs */}
                                        <div className="flex bg-gray-100 p-1.5 rounded-2xl border border-gray-200">
                                           <button 
                                              type="button"
                                              onClick={() => setActiveSubTab("meta")}
                                              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeSubTab === 'meta' ? 'bg-white text-secondary shadow-sm' : 'text-gray-400 hover:text-secondary'}`}
                                           >
                                              <FileText size={14} /> Meta
                                           </button>
                                           <button 
                                              type="button"
                                              onClick={() => setActiveSubTab("content")}
                                              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeSubTab === 'content' ? 'bg-white text-secondary shadow-sm' : 'text-gray-400 hover:text-secondary'}`}
                                           >
                                              <Layout size={14} /> Content
                                           </button>
                                           <button 
                                              type="button"
                                              onClick={() => setActiveSubTab("tech")}
                                              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeSubTab === 'tech' ? 'bg-white text-secondary shadow-sm' : 'text-gray-400 hover:text-secondary'}`}
                                           >
                                              <Code2 size={14} /> Technical
                                           </button>
                                        </div>
                                    </div>

                                    {/* Sub-Tab Content Area */}
                                    <div className="flex-grow">
                                        {activeSubTab === "meta" && (
                                          <div className="space-y-10 animate-in fade-in duration-500">
                                             <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                                <div className="md:col-span-2 space-y-3">
                                                   <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex justify-between ml-2">
                                                      <span>Custom Page Title</span>
                                                      <span className={`${(metaState[page.id]?.title?.length || 0) > 60 ? 'text-red-500' : 'text-gray-400'}`}>
                                                            {metaState[page.id]?.title?.length || 0}/60
                                                      </span>
                                                   </label>
                                                   <input 
                                                      type="text" 
                                                      value={metaState[page.id]?.title || ""} 
                                                      onChange={(e) => handleMetaFieldChange(page.id, "title", e.target.value)}
                                                      className="w-full bg-gray-50 border border-gray-100 p-5 rounded-2xl outline-none focus:border-primary transition-all font-bold text-secondary text-lg" 
                                                   />
                                                </div>
                                                <div className="space-y-3">
                                                   <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex justify-between ml-2">
                                                      <span>Meta Description</span>
                                                      <span className={`${(metaState[page.id]?.description?.length || 0) > 160 ? 'text-red-500' : 'text-gray-400'}`}>
                                                            {metaState[page.id]?.description?.length || 0}/160
                                                      </span>
                                                   </label>
                                                   <textarea 
                                                      rows={6} 
                                                      value={metaState[page.id]?.description || ""} 
                                                      onChange={(e) => handleMetaFieldChange(page.id, "description", e.target.value)}
                                                      className="w-full bg-gray-50 border border-gray-100 p-5 rounded-2xl outline-none focus:border-primary transition-all text-sm font-medium leading-relaxed resize-none" 
                                                   />
                                                </div>
                                                <div className="space-y-3">
                                                   <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">Strategic Keywords</label>
                                                   <textarea 
                                                      rows={6} 
                                                      value={metaState[page.id]?.keywords || ""} 
                                                      onChange={(e) => handleMetaFieldChange(page.id, "keywords", e.target.value)}
                                                      className="w-full bg-gray-50 border border-gray-100 p-5 rounded-2xl outline-none focus:border-primary transition-all text-sm font-medium resize-none leading-relaxed" 
                                                   />
                                                </div>
                                             </div>

                                             <div className="bg-gray-50/50 rounded-[2rem] p-8 border border-gray-100">
                                                <div className="flex items-center justify-between mb-8">
                                                      <div className="flex items-center gap-4">
                                                         <div className="p-3 bg-white rounded-2xl shadow-sm text-primary">
                                                            <ImageIcon size={20} />
                                                         </div>
                                                         <div>
                                                            <h4 className="text-sm font-black uppercase tracking-widest text-secondary">Asset Accessibility</h4>
                                                            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Image Alt text overrides</p>
                                                         </div>
                                                      </div>
                                                       <div className="flex items-center gap-2">
                                                          <input 
                                                              type="text" 
                                                              placeholder="Alt ID (e.g. hero-bg)" 
                                                              value={newAltKeys[page.id] || ""}
                                                              onChange={(e) => setNewAltKeys(prev => ({ ...prev, [page.id]: e.target.value }))}
                                                              className="bg-white border border-gray-100 px-4 py-2 rounded-xl text-[10px] font-bold text-secondary outline-none focus:border-primary w-[150px]"
                                                          />
                                                          <button type="button" onClick={() => handleAddAlt(page.id)} className="text-[10px] font-black uppercase bg-secondary text-white px-6 py-2.5 rounded-xl hover:bg-primary hover:text-secondary transition-all flex items-center gap-2 shadow-xl whitespace-nowrap">
                                                             <Plus size={14} /> Add
                                                          </button>
                                                       </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                   {Object.entries(imageAltsState[page.id] || {}).map(([altKey, altValue]) => (
                                                      <div key={altKey} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-50 group">
                                                         <div className="flex justify-between items-center mb-4">
                                                            <span className="text-[9px] font-black uppercase text-gray-400 tracking-wider flex items-center">
                                                               <AlertCircle size={12} className="mr-2 text-primary" /> ID: {altKey}
                                                            </span>
                                                            <button type="button" onClick={() => handleRemoveAlt(page.id, altKey)} className="text-gray-300 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"><Trash2 size={14} /></button>
                                                         </div>
                                                         <input type="text" value={altValue} onChange={(e) => handleAltChange(page.id, altKey, e.target.value)} placeholder="Describe visual asset..." className="w-full bg-gray-50 border-0 p-3 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 text-xs font-bold text-secondary" />
                                                      </div>
                                                   ))}
                                                </div>
                                             </div>
                                          </div>
                                       )}

                                       {activeSubTab === "content" && (
                                          <div className="space-y-10 animate-in fade-in duration-500">
                                             <div className="flex flex-col md:flex-row items-center justify-between bg-primary/10 border border-primary/20 p-6 rounded-3xl gap-6">
                                                 <div className="flex items-center gap-4">
                                                    <Layout className="text-primary" size={24} />
                                                    <div>
                                                       <p className="text-xs font-black uppercase text-secondary tracking-widest">Page Content Architecture</p>
                                                       <p className="text-[10px] text-gray-500 font-medium">Manage on-page text sections dynamically.</p>
                                                    </div>
                                                 </div>
                                                 <div className="flex items-center gap-2 w-full md:w-auto">
                                                    <input 
                                                        type="text" 
                                                        placeholder="Section Key (e.g. hero, intro)" 
                                                        value={newSectionKeys[page.id] || ""}
                                                        onChange={(e) => setNewSectionKeys(prev => ({ ...prev, [page.id]: e.target.value }))}
                                                        className="bg-white border border-primary/20 px-4 py-3 rounded-xl text-xs font-bold text-secondary outline-none focus:border-primary w-full md:w-[200px]"
                                                    />
                                                    <button 
                                                        type="button" 
                                                        onClick={() => handleAddSection(page.id)} 
                                                        className="bg-secondary text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-secondary transition-all shadow-xl whitespace-nowrap"
                                                    >
                                                       Add Section
                                                    </button>
                                                 </div>
                                              </div>

                                             <div className="grid grid-cols-1 gap-8">
                                                {Object.entries(sectionsState[page.id] || {}).map(([secKey, secData]) => (
                                                   <div key={secKey} className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm hover:shadow-lg transition-all space-y-6 relative group">
                                                      <button type="button" onClick={() => handleRemoveSection(page.id, secKey)} className="absolute top-8 right-8 text-gray-300 hover:text-red-500 transition-all">
                                                         <Trash2 size={18} />
                                                      </button>

                                                      <div className="flex items-center gap-3 mb-4">
                                                         <div className="w-8 h-8 bg-secondary text-primary rounded-xl flex items-center justify-center font-black text-xs">{secKey.charAt(0).toUpperCase()}</div>
                                                         <h4 className="text-lg font-black uppercase text-secondary tracking-tighter">Section: {secKey}</h4>
                                                      </div>

                                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                         <div className="space-y-2">
                                                            <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-2">Heading</label>
                                                            <input type="text" value={secData.title || ""} onChange={(e) => handleSectionFieldChange(page.id, secKey, "title", e.target.value)} className="w-full bg-gray-50 border border-gray-100 p-4 rounded-xl outline-none focus:border-primary text-sm font-bold" />
                                                         </div>
                                                         <div className="space-y-2">
                                                            <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-2">Subheading / Lead</label>
                                                            <input type="text" value={secData.subtitle || ""} onChange={(e) => handleSectionFieldChange(page.id, secKey, "subtitle", e.target.value)} className="w-full bg-gray-50 border border-gray-100 p-4 rounded-xl outline-none focus:border-primary text-sm font-bold" />
                                                         </div>
                                                         <div className="md:col-span-2 space-y-2">
                                                            <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-2">Body Content (Markdown Supported)</label>
                                                            <textarea rows={4} value={secData.content || ""} onChange={(e) => handleSectionFieldChange(page.id, secKey, "content", e.target.value)} className="w-full bg-gray-50 border border-gray-100 p-5 rounded-2xl outline-none focus:border-primary text-sm font-medium leading-relaxed resize-none" />
                                                         </div>
                                                         <div className="space-y-2">
                                                            <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-2">CTA Action Text</label>
                                                            <input type="text" value={secData.ctaText || ""} onChange={(e) => handleSectionFieldChange(page.id, secKey, "ctaText", e.target.value)} className="w-full bg-gray-50 border border-gray-100 p-4 rounded-xl outline-none focus:border-primary text-sm font-bold" />
                                                         </div>
                                                      </div>
                                                   </div>
                                                ))}
                                                {Object.keys(sectionsState[page.id] || {}).length === 0 && (
                                                   <div className="border-2 border-dashed border-gray-100 rounded-[3rem] p-24 text-center space-y-4">
                                                      <Layout className="mx-auto text-gray-200" size={64} />
                                                      <p className="text-xs font-black uppercase text-gray-400 tracking-widest leading-relaxed">No dynamic sections defined.<br/>Use 'Define New Section' to begin CMS population.</p>
                                                   </div>
                                                )}
                                             </div>
                                          </div>
                                       )}

                                       {activeSubTab === "tech" && (
                                          <div className="space-y-10 animate-in fade-in duration-500">
                                             <div className="bg-secondary rounded-[2.5rem] p-10 text-white space-y-6 shadow-2xl">
                                                <div className="flex items-center gap-4">
                                                   <Code2 size={24} className="text-primary" />
                                                   <div>
                                                      <h4 className="text-lg font-black uppercase tracking-tighter font-mono">Structured Data (LD+JSON)</h4>
                                                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Deploy schema markup for Enhanced rich snippets.</p>
                                                   </div>
                                                </div>
                                                <textarea 
                                                   rows={12} 
                                                   value={structuredDataState[page.id] || ""} 
                                                   onChange={(e) => handleStructuredDataChange(page.id, e.target.value)}
                                                   placeholder='{ "@context": "https://schema.org", "@type": "Service", "name": "..." }'
                                                   className="w-full bg-black/30 border border-white/10 p-6 rounded-2xl outline-none focus:border-primary font-mono text-xs text-primary placeholder:text-gray-700 resize-none transition-all"
                                                />
                                                <div className="flex items-center gap-2 text-primary">
                                                   <AlertCircle size={14} />
                                                   <span className="text-[9px] font-black uppercase tracking-widest">Always validate JSON structure at search.google.com/test/rich-results</span>
                                                </div>
                                             </div>
                                          </div>
                                       )}
                                    </div>

                                    <div className="flex justify-end pt-10 border-t border-gray-100 mt-auto">
                                        <button 
                                            type="submit" 
                                            disabled={loading}
                                            className="bg-primary text-secondary px-10 py-5 rounded-2xl shadow-xl hover:scale-105 active:scale-95 disabled:opacity-70 disabled:scale-100 transition-all font-black uppercase tracking-[0.2em] flex items-center group ring-8 ring-primary/5"
                                        >
                                            <Save size={20} className={`mr-3 ${loading ? 'animate-spin' : 'group-hover:scale-110'}`} /> 
                                            {loading ? "Deploying..." : `Commit ${page.name} Update`}
                                        </button>
                                    </div>
                                </form>
                            );
                        })}
                    </div>
                </div>
            </div>
          </div>
      </div>
    </>
  );
};

export default SEOManagerForm;
