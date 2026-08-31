import React from "react";
import { createBlogPost } from "@/app/actions/blog";
import BlogEditor from "@/components/admin/BlogEditor";

export default function NewBlogPostPage() {
  return (
    <div className="max-w-[1400px] mx-auto">
      <form action={createBlogPost}>
        <BlogEditor action={createBlogPost} />
      </form>
    </div>
  );
}
