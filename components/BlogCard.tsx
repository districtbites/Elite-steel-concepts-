import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, ArrowUpRight } from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  imageAlt?: string;
  slug: string;
}

interface BlogCardProps {
  post: BlogPost;
}

// Auto-generated excerpts start with the article's first heading ("Introduction ...")
export function cleanExcerpt(excerpt: string) {
  return excerpt.replace(/^\s*(introduction|overview)\s*[:\-–—]?\s*/i, "").trim();
}

const BlogCard = ({ post }: BlogCardProps) => {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col h-full bg-white border border-gray-200 hover:border-black hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#F7931E] transition-[transform,box-shadow,border-color] duration-300"
    >
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-[#0a0a0a]">
        <Image
          src={post.image}
          alt={post.imageAlt || post.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          unoptimized={post.image.startsWith("http")}
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <span className="absolute top-4 left-4 bg-primary text-black text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5">
          {post.category}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-grow p-6 md:p-7">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-4">
          <span className="flex items-center gap-1.5">
            <Calendar size={13} className="text-primary" />
            {post.date}
          </span>
          <span className="w-1 h-1 bg-gray-300" aria-hidden />
          <span className="flex items-center gap-1.5">
            <Clock size={13} className="text-primary" />
            {post.readTime}
          </span>
        </div>

        <h3 className="text-xl font-extrabold text-black leading-snug tracking-tight mb-3 line-clamp-3 group-hover:text-primary transition-colors">
          {post.title}
        </h3>

        <p className="text-gray-600 text-[15px] leading-relaxed line-clamp-3 mb-6">
          {cleanExcerpt(post.excerpt)}
        </p>

        <div className="mt-auto pt-5 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-[0.15em] text-black">
            Read Article
          </span>
          <span className="w-10 h-10 flex items-center justify-center border border-gray-200 text-black group-hover:bg-primary group-hover:border-primary transition-colors">
            <ArrowUpRight size={18} className="transition-transform duration-300 group-hover:rotate-45" />
          </span>
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
