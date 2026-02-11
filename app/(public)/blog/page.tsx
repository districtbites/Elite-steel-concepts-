import React from "react";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";
import BlogCard from "@/components/BlogCard";
import { getPosts } from "@/lib/db";

export default async function BlogPage() {
  const blogPosts = await getPosts();
  const publishedPosts = blogPosts.filter(p => p.status === "Published");

  return (
    <>
      <PageHeader
        title="News & Insights"
        subtitle="Stay up to date with the latest industry trends, maintenance tips, and success stories from Elite Steel Concepts."
      />

      <Section className="bg-gray-50">
        <Container>
           {/* Filter Bar */}
           <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-gray-200 pb-6">
              <div>
                 <h2 className="text-2xl font-black uppercase text-secondary mb-2 tracking-tight">Latest Articles</h2>
                 <p className="text-gray-500 text-sm">Explore our collection of expert advice.</p>
              </div>
              <div className="mt-4 md:mt-0">
                 <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Showing  <span className="text-primary">{publishedPosts.length} Posts</span>
                 </span>
              </div>
           </div>

           {/* Grid */}
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {publishedPosts.map((post) => (
                 <BlogCard key={post.id} post={post} />
              ))}
           </div>
        </Container>
      </Section>
    </>
  );
}
