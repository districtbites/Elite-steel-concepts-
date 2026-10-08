import React from "react";
import Link from "next/link";
import Section from "./ui/Section";
import Container from "./ui/Container";
import BlogCard from "./BlogCard";
import { getPosts } from "@/lib/db";
import { ArrowRight } from "lucide-react";

const HomeBlogSection = async () => {
  const posts = await getPosts();
  const publishedPosts = posts
    .filter((p) => p.status === "Published")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  if (publishedPosts.length === 0) return null;

  return (
    <Section className="!py-8 md:!py-12 bg-gray-50">
      <Container>
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div>
            <h1 className="text-primary font-bold tracking-widest uppercase text-sm mb-2 block">
              News & Insights
            </h1>
            <h2 className="text-3xl md:text-4xl font-black text-secondary uppercase tracking-tight">
              Latest from the Blog
            </h2>
          </div>
          <Link 
            href="/blog" 
            className="hidden md:flex items-center text-sm font-bold uppercase tracking-wider text-secondary hover:text-primary transition-colors mt-4 md:mt-0"
          >
            View All Articles <ArrowRight size={16} className="ml-2" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {publishedPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>

        <div className="mt-12 text-center md:hidden">
           <Link 
            href="/blog" 
            className="inline-flex items-center text-sm font-bold uppercase tracking-wider text-secondary hover:text-primary transition-colors"
          >
            View All Articles <ArrowRight size={16} className="ml-2" />
          </Link>
        </div>
      </Container>
    </Section>
  );
};

export default HomeBlogSection;
