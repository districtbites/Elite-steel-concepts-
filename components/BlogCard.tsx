import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, ArrowRight } from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  slug: string;
}

interface BlogCardProps {
  post: BlogPost;
}

const BlogCard = ({ post }: BlogCardProps) => {
  return (
    <Link 
      href={`/blog/${post.slug}`} 
      className="group flex flex-col h-full bg-white border border-gray-100 hover:border-primary/20 relative overflow-hidden transition-colors duration-300"
    >
      {/* Top Hover Accent Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left z-20" />

      {/* Image Container */}
      <div className="relative aspect-video overflow-hidden bg-[#0a0a0a]">
        <Image
          src={post.image}
          alt={post.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
        />
        {/* Dark overlay that fades on hover */}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
        
        {/* Category Badge */}
        <div className="absolute top-0 left-0 z-10">
          <span className="bg-primary text-black text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 flex items-center">
            {post.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-grow p-8 bg-white">
        {/* Metadata */}
        <div className="flex items-center gap-4 text-[10px] text-gray-400 mb-4 font-black uppercase tracking-widest">
          <div className="flex items-center">
            <Calendar size={12} className="mr-1.5 text-primary" />
            {post.date}
          </div>
          <div className="flex items-center">
            <Clock size={12} className="mr-1.5 text-primary" />
            {post.readTime}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-black text-black mb-4 uppercase tracking-tight group-hover:text-primary transition-colors leading-tight line-clamp-2">
          {post.title}
        </h3>

        {/* Excerpt */}
        <p className="text-gray-500 text-sm leading-relaxed mb-8 font-light line-clamp-3">
          {post.excerpt}
        </p>

        {/* Footer CTA */}
        <div className="mt-auto flex items-center text-black font-black text-xs uppercase tracking-wider group-hover:text-primary transition-colors">
          Read Article 
          <ArrowRight size={14} className="ml-2 transform group-hover:translate-x-1.5 transition-transform" />
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
