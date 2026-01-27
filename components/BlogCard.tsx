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
    <Link href={`/blog/${post.slug}`} className="group flex flex-col h-full bg-white border border-gray-100 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300">
      {/* Image Container */}
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-secondary text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-sm shadow-md">
            {post.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-grow p-6">
        {/* Metadata */}
        <div className="flex items-center gap-4 text-xs text-gray-400 mb-3 font-medium uppercase tracking-wide">
          <div className="flex items-center">
            <Calendar size={12} className="mr-1 text-primary" />
            {post.date}
          </div>
          <div className="flex items-center">
            <Clock size={12} className="mr-1 text-primary" />
            {post.readTime}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-secondary mb-3 group-hover:text-primary transition-colors line-clamp-2">
          {post.title}
        </h3>

        {/* Excerpt */}
        <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3">
          {post.excerpt}
        </p>

        {/* Footer */}
        <div className="mt-auto flex items-center text-secondary font-bold text-sm uppercase tracking-wider group-hover:text-primary transition-colors">
          Read Article <ArrowRight size={16} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
