import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { updateBlogPost } from "@/app/actions/blog";
import { getPostById } from "@/lib/db";
import BlogEditor from "@/components/admin/BlogEditor";
import { notFound, redirect } from "next/navigation";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditBlogPostPage({ params }: PageProps) {
  const { id } = await params;
  const post = await getPostById(id);

  if (!post) return notFound();

  // Create a bound version of updateBlogPost with the ID
  const updateWithId = async (formData: FormData) => {
    "use server";
    await updateBlogPost(id, formData);
    redirect("/admin/blog");
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4">
        <div className="mb-10 flex items-center justify-between">
            <div className="flex items-center gap-6">
               <Link href="/admin/blog" className="w-12 h-12 flex items-center justify-center bg-white border border-gray-100 rounded-2xl hover:bg-secondary hover:text-white transition-all shadow-sm">
                  <ArrowLeft size={20} />
               </Link>
               <div>
                 <h1 className="text-4xl font-black uppercase text-secondary tracking-tighter">Modify Insight</h1>
                 <p className="text-gray-400 font-medium">Updating: <span className="text-primary font-bold">{post.title}</span></p>
               </div>
            </div>
        </div>

        <form>
           <BlogEditor action={updateWithId} initialData={post} />
        </form>
    </div>
  );
}
