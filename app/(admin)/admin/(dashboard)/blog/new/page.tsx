"use client";

import React from "react";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createBlogPost } from "@/app/actions/blog";

export default function NewBlogPostPage() {
  return (
    <div className="max-w-5xl mx-auto">
       <div className="mb-6 flex items-center justify-between">
           <div className="flex items-center gap-4">
              <Link href="/admin/blog" className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                 <ArrowLeft size={24} className="text-gray-500" />
              </Link>
              <div>
                <h1 className="text-3xl font-black uppercase text-secondary">New Post</h1>
                <p className="text-gray-500">Write a new article for your blog.</p>
              </div>
           </div>
       </div>

       <form action={createBlogPost} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
             <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-4">
                <div className="space-y-2">
                   <label className="text-sm font-bold uppercase tracking-wider text-gray-700">Title</label>
                   <input type="text" name="title" required placeholder="Enter post title" className="w-full bg-gray-50 border border-gray-200 p-4 rounded-sm outline-none focus:border-primary text-lg font-bold transition-all" />
                </div>
                 <div className="space-y-2">
                   <label className="text-sm font-bold uppercase tracking-wider text-gray-700">Content</label>
                   <textarea rows={20} name="content" required placeholder="Write your content here..." className="w-full bg-gray-50 border border-gray-200 p-4 rounded-sm outline-none focus:border-primary transition-all resize-none" />
                </div>
             </div>
          </div>

          {/* Sidebar Settings */}
          <div className="space-y-6">
             <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-6">
                <div className="space-y-2">
                   <label className="text-sm font-bold uppercase tracking-wider text-gray-700">Status</label>
                   <select name="status" className="w-full bg-gray-50 border border-gray-200 p-3 rounded-sm outline-none focus:border-primary transition-all">
                      <option value="Draft">Draft</option>
                      <option value="Published">Published</option>
                   </select>
                </div>
                <div className="space-y-2">
                   <label className="text-sm font-bold uppercase tracking-wider text-gray-700">Category</label>
                   <select name="category" className="w-full bg-gray-50 border border-gray-200 p-3 rounded-sm outline-none focus:border-primary transition-all">
                      <option value="Maintenance">Maintenance</option>
                      <option value="Regulation">Regulation</option>
                      <option value="Design">Design</option>
                      <option value="Advice">Advice</option>
                      <option value="News">News</option>
                   </select>
                </div>
                 <div className="space-y-2">
                   <label className="text-sm font-bold uppercase tracking-wider text-gray-700">Feature Image URL</label>
                   <input type="text" name="image" placeholder="https://..." className="w-full bg-gray-50 border border-gray-200 p-3 rounded-sm outline-none focus:border-primary transition-all" />
                </div>
                <div className="pt-4 border-t border-gray-100 flex flex-col gap-3">
                   <Button type="submit" className="w-full bg-secondary text-white hover:bg-primary hover:text-secondary">
                      Publish Post
                   </Button>
                   <Button type="button" variant="outline" className="w-full border-gray-300 text-gray-500 hover:text-secondary">
                      Save Draft
                   </Button>
                </div>
             </div>
          </div>
       </form>
    </div>
  );
}
