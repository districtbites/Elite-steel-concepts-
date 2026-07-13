import React from "react";
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

  const updateWithId = async (formData: FormData) => {
    "use server";
    await updateBlogPost(id, formData);
    redirect("/admin/blog");
  };

  return (
    <div className="max-w-[1400px] mx-auto">
        <form>
           <BlogEditor action={updateWithId} initialData={post} />
        </form>
    </div>
  );
}
