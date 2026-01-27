import React from "react";
import Button from "@/components/ui/Button";
import { getSEO } from "@/lib/db";
import { saveSEO } from "@/app/actions/settings";
import { Save, Search } from "lucide-react";

export default async function AdminSEOPage() {
  const seo = await getSEO();

  return (
    <div className="max-w-4xl">
       <div className="mb-8">
           <h1 className="text-3xl font-black uppercase text-secondary">Advanced SEO Manager</h1>
           <p className="text-gray-500">Optimize your website's visibility and search engine ranking.</p>
       </div>

       <form action={saveSEO} className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm space-y-8">
          
          {/* Basic SEO */}
          <div>
             <h2 className="text-xl font-bold uppercase text-secondary mb-4 border-b border-gray-100 pb-2 flex items-center">
                <Search size={20} className="mr-2 text-primary" /> Basic Metadata
             </h2>
             <div className="space-y-4">
               <div className="space-y-2">
                  <label className="text-sm font-bold uppercase tracking-wider text-gray-700">Global Site Title</label>
                  <input type="text" name="siteTitle" defaultValue={seo.siteTitle} className="w-full bg-gray-50 border border-gray-200 p-4 rounded-sm outline-none focus:border-primary transition-all" />
               </div>

               <div className="space-y-2">
                  <label className="text-sm font-bold uppercase tracking-wider text-gray-700">Meta Description</label>
                  <textarea rows={3} name="description" defaultValue={seo.description} className="w-full bg-gray-50 border border-gray-200 p-4 rounded-sm outline-none focus:border-primary transition-all resize-none" />
                  <p className="text-xs text-gray-400 text-right">Recommended: 150-160 characters</p>
               </div>

               <div className="space-y-2">
                  <label className="text-sm font-bold uppercase tracking-wider text-gray-700">Keywords (Comma Separated)</label>
                  <input type="text" name="keywords" defaultValue={seo.keywords} className="w-full bg-gray-50 border border-gray-200 p-4 rounded-sm outline-none focus:border-primary transition-all" />
               </div>
             </div>
          </div>

          {/* Social SEO */}
          <div>
             <h2 className="text-xl font-bold uppercase text-secondary mb-4 border-b border-gray-100 pb-2">
                Social Sharing (Open Graph)
             </h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-bold uppercase tracking-wider text-gray-700">OG Image URL</label>
                    <input type="text" name="ogImage" defaultValue={seo.ogImage} className="w-full bg-gray-50 border border-gray-200 p-4 rounded-sm outline-none focus:border-primary transition-all" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold uppercase tracking-wider text-gray-700">Twitter Handle</label>
                    <input type="text" name="twitterHandle" defaultValue={seo.twitterHandle} placeholder="@username" className="w-full bg-gray-50 border border-gray-200 p-4 rounded-sm outline-none focus:border-primary transition-all" />
                </div>
             </div>
          </div>

          {/* Technical SEO */}
          <div>
             <h2 className="text-xl font-bold uppercase text-secondary mb-4 border-b border-gray-100 pb-2">
                Technical Config
             </h2>
             <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-bold uppercase tracking-wider text-gray-700">Canonical URL</label>
                    <input type="text" name="canonicalUrl" defaultValue={seo.canonicalUrl} className="w-full bg-gray-50 border border-gray-200 p-4 rounded-sm outline-none focus:border-primary transition-all" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold uppercase tracking-wider text-gray-700">Robots.txt Content</label>
                    <textarea rows={4} name="robotsTxt" defaultValue={seo.robotsTxt} className="w-full bg-gray-50 border border-gray-200 p-4 rounded-sm outline-none focus:border-primary font-mono text-sm transition-all resize-none" />
                </div>
             </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end">
             <Button type="submit" className="bg-secondary text-white hover:bg-primary hover:text-secondary flex items-center">
                <Save size={18} className="mr-2" /> Save SEO Config
             </Button>
          </div>
       </form>
    </div>
  );
}
