import React from "react";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import BlogCard from "@/components/BlogCard";
import { getPosts } from "@/lib/db";

export default async function BlogPage() {
  const blogPosts = await getPosts();
  const publishedPosts = blogPosts.filter(p => p.status === "Published");

  return (
    <>
      {/* Page Header */}
      <div className="bg-secondary pt-32 pb-16 md:pt-40 md:pb-24">
        <Container className="text-center">
          <h1 className="text-4xl md:text-6xl font-black uppercase text-white mb-4 tracking-tight">
            News & Insights
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
             Stay up to date with the latest industry trends, maintenance tips, and success stories from Elite Steel Concepts.
          </p>
        </Container>
      </div>

      <Section className="bg-gray-50">
        <Container>
           {/* Featured / Filter Bar (Placeholder for future expansion) */}
           <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-gray-200 pb-6">
              <div>
                 <h2 className="text-2xl font-bold uppercase text-secondary mb-2">Latest Articles</h2>
                 <p className="text-gray-500 text-sm">Explore our collection of expert advice.</p>
              </div>
              <div className="mt-4 md:mt-0">
                 {/* Placeholder for Search or Category Filter */}
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
