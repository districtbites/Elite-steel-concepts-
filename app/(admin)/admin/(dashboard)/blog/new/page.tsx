import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createBlogPost } from "@/app/actions/blog";
import BlogEditor from "@/components/admin/BlogEditor";

export default function NewBlogPostPage() {
  return (
    <div className="max-w-[1400px] mx-auto px-4">
        <div className="mb-10 flex items-center justify-between">
            <div className="flex items-center gap-6">
               <Link href="/admin/blog" className="w-12 h-12 flex items-center justify-center bg-white border border-gray-100 rounded-2xl hover:bg-secondary hover:text-white transition-all shadow-sm">
                  <ArrowLeft size={20} />
               </Link>
               <div>
                 <h1 className="text-4xl font-black uppercase text-secondary tracking-tighter">Elite Insight Builder</h1>
                 <p className="text-gray-400 font-medium">Craft high-performance articles with structured formatting.</p>
               </div>
            </div>
        </div>

        <form>
           <BlogEditor action={createBlogPost} />
        </form>
    </div>
  );
}
