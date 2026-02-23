import React from "react";
import MediaManager from "@/components/admin/MediaManager";
import { getAssets } from "@/lib/db";
import { ImageIcon } from "lucide-react";

export default async function AdminMediaPage() {
  const assets = await getAssets();

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-[10px] font-black uppercase tracking-[0.2em] animate-pulse">
            <span className="w-2 h-2 bg-primary rounded-full"></span> Internal Asset Command
          </div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-secondary leading-none">
            Media <span className="text-primary italic">Intelligence</span>
          </h1>
          <p className="text-gray-400 font-light max-w-xl text-lg leading-relaxed">
            Centralized management for all visual assets. Enforcing <span className="text-secondary font-bold">.WebP Perfection</span> and technical dimension integrity.
          </p>
        </div>
        
        <div className="hidden lg:flex items-center gap-6">
           <div className="text-right">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-300">Total Assets</p>
              <p className="text-3xl font-black text-secondary tracking-tighter">{assets.length}</p>
           </div>
           <div className="w-16 h-16 bg-gray-50 rounded-3xl flex items-center justify-center text-gray-300">
              <ImageIcon size={32} />
           </div>
        </div>
      </header>

      <MediaManager initialAssets={assets} />
    </div>
  );
}
