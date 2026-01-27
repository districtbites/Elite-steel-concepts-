import React from "react";
import Link from "next/link";
import { Plus, Edit, Trash2 } from "lucide-react";
import Button from "@/components/ui/Button";
import { getPosts } from "@/lib/db";
import { deleteBlogPost } from "@/app/actions/blog";

export default async function AdminBlogPage() {
  const posts = await getPosts();

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-3xl font-black uppercase text-secondary">Blog Manager</h1>
           <p className="text-gray-500">Create, edit, and manage your articles.</p>
        </div>
        <Link href="/admin/blog/new">
          <Button size="sm" className="bg-secondary text-white hover:bg-primary hover:text-secondary">
            <Plus size={16} className="mr-2" /> New Post
          </Button>
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {posts.map((post) => (
              <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium text-secondary">{post.title}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 text-xs font-bold rounded-full bg-gray-100 text-gray-600">
                    {post.category}
                  </span>
                </td>
                <td className="px-6 py-4">
                   <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                      post.status === "Published" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                   }`}>
                    {post.status}
                   </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{post.date}</td>
                <td className="px-6 py-4 text-right space-x-2 flex justify-end">
                   <button className="text-gray-400 hover:text-blue-500 transition-colors"><Edit size={18} /></button>
                   <form action={deleteBlogPost.bind(null, post.id)}>
                      <button type="submit" className="text-gray-400 hover:text-red-500 transition-colors pt-1"><Trash2 size={18} /></button>
                   </form>
                </td>
              </tr>
            ))}
            {posts.length === 0 && (
               <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                     No posts found. Get started by creating one!
                  </td>
               </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
