import React from "react";
import { getPostBySlug, getPosts } from "@/lib/db";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock, User, Tag, Share2, MessageSquare } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) return { title: "Post Not Found" };

  return {
    title: `${post.title} | Elite Steel Concepts`,
    description: post.subtitle || post.excerpt,
    openGraph: {
      title: post.title,
      description: post.subtitle || post.excerpt,
      images: [post.image],
      type: "article",
    },
  };
}

// Simple Parser for Structured Content
function parseContent(content: string) {
    if (!content) return "";
    
    return content
        .replace(/### (.*)/g, '<h3 class="text-xl md:text-2xl font-black uppercase text-secondary mt-10 mb-4 tracking-tight">$1</h3>')
        .replace(/## (.*)/g, '<h2 class="text-2xl md:text-3xl font-black uppercase text-secondary mt-12 mb-6 border-l-4 border-primary pl-4 tracking-tighter">$1</h2>')
        .replace(/!\[(.*?)\]\((.*?)\)/g, '<div class="my-10 rounded-3xl overflow-hidden shadow-2xl border border-gray-100"><img src="$2" alt="$1" class="w-full object-cover" /><p class="text-[10px] font-bold uppercase tracking-widest text-gray-400 p-4 text-center bg-gray-50">$1</p></div>')
        .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-primary font-bold underline hover:text-secondary transition-colors">$1</a>')
        .replace(/\n\n/g, '</p><p class="mb-6 leading-relaxed text-gray-600">')
        .replace(/^- (.*)/gm, '<li class="flex items-start gap-3 mb-3"><div class="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0"></div><span class="text-gray-600">$1</span></li>');
}

export default async function BlogDetailsPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) return notFound();

  const allPosts = await getPosts();
  const relatedPosts = allPosts
    .filter(p => p.id !== post.id && p.status === "Published")
    .slice(0, 3);

  const htmlContent = parseContent(post.content || "");

  return (
    <>
      <article className="bg-white">
        {/* Blog Hero - Immersive Style */}
        <div className="relative h-[50vh] md:h-[65vh] bg-secondary overflow-hidden">
          <Image 
            src={post.image} 
            unoptimized
            alt={post.imageAlt || post.title} 
            fill 
            className="object-cover opacity-50 scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-secondary/20 to-transparent" />
          
          <Container className="relative h-full flex flex-col justify-end pb-12">
            <Link href="/blog" className="inline-flex items-center text-primary hover:text-white transition-all mb-8 text-xs font-black uppercase tracking-[0.2em] group">
              <ArrowLeft size={14} className="mr-2 transform group-hover:-translate-x-1 transition-transform" /> Back to Insights
            </Link>
            
            <div className="flex items-center gap-4 mb-6">
               <span className="bg-primary text-secondary text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">
                 {post.category}
               </span>
               <div className="flex items-center text-gray-300 text-[10px] font-black uppercase tracking-widest">
                  <Clock size={12} className="mr-1.5 text-primary" /> {post.readTime}
               </div>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase text-white mb-6 tracking-tighter leading-[0.85] max-w-5xl drop-shadow-2xl">
              {post.title}
            </h1>
            
            {post.subtitle && (
                <p className="text-xl md:text-2xl font-medium text-gray-300 max-w-3xl leading-relaxed mb-8 border-l-2 border-primary/30 pl-6">
                    {post.subtitle}
                </p>
            )}

            <div className="flex items-center gap-8 text-gray-400 text-[10px] font-black uppercase tracking-widest">
               <div className="flex items-center">
                 <Calendar size={14} className="mr-2 text-primary" /> {post.date}
               </div>
               <div className="flex items-center">
                 <User size={14} className="mr-2 text-primary" /> Elite Fabrication Team
               </div>
            </div>
          </Container>
        </div>

        {/* Content Section */}
        <Section className="pb-32 pt-12">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
              {/* Main Column */}
              <div className="lg:col-span-8">
                <div className="rich-text-content">
                  <p className="mb-6 leading-relaxed text-gray-600 text-lg md:text-xl font-medium" dangerouslySetInnerHTML={{ __html: htmlContent }} />
                </div>

                {/* Tags Section */}
                {post.tags && post.tags.length > 0 && (
                    <div className="mt-20 pt-10 border-t border-gray-100">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 mb-6 flex items-center">
                            <Tag size={12} className="mr-2" /> Index Keywords
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {post.tags.map(tag => (
                                <span key={tag} className="px-4 py-2 bg-gray-50 text-gray-500 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-primary/10 hover:text-primary transition-all cursor-default">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Social Share & CTA */}
                <div className="mt-16 p-10 bg-secondary rounded-[40px] text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-1000">
                      <MessageSquare size={120} />
                   </div>
                   <div className="relative z-10">
                      <h4 className="text-2xl font-black uppercase tracking-tight mb-2">Build Your Vision Today</h4>
                      <p className="text-gray-400 text-sm font-medium">Ready to discuss your custom project? Our experts are standing by.</p>
                   </div>
                   <Link href="/quote" className="relative z-10 bg-primary text-secondary px-10 py-5 rounded-full font-black uppercase text-xs tracking-widest hover:scale-105 transition-all shadow-xl">
                      Get Specialist Quote
                   </Link>
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-4 space-y-12">
                {/* Related Insights */}
                <div className="sticky top-32">
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-10 text-secondary flex items-center border-b border-gray-100 pb-4">
                        <Tag size={16} className="mr-3 text-primary" /> Sector Insights
                    </h3>
                    <div className="space-y-12">
                        {relatedPosts.map((related) => (
                        <Link key={related.id} href={`/blog/${related.slug}`} className="group block">
                            <div className="relative aspect-[16/10] rounded-[2rem] overflow-hidden mb-6 shadow-md group-hover:shadow-2xl transition-all duration-500">
                                <Image 
                                    src={related.image} 
                                    unoptimized
                                    alt={related.title} 
                                    fill 
                                    className="object-cover group-hover:scale-110 grayscale-[50%] group-hover:grayscale-0 transition-all duration-700" 
                                />
                                <div className="absolute inset-0 bg-secondary/20 group-hover:bg-transparent transition-colors" />
                            </div>
                            <span className="text-[10px] font-black uppercase text-primary tracking-widest mb-2 block">
                                {related.category}
                            </span>
                            <h4 className="text-lg font-black uppercase leading-tight text-secondary group-hover:text-primary transition-colors tracking-tight">
                                {related.title}
                            </h4>
                        </Link>
                        ))}
                    </div>

                    {/* Elite Quality Shield */}
                    <div className="mt-16 p-8 rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-primary mb-4">
                            <Share2 size={24} />
                        </div>
                        <h5 className="text-xs font-black uppercase text-secondary tracking-widest mb-2">Elite Distribution</h5>
                        <p className="text-[10px] text-gray-400 font-bold leading-relaxed px-4">
                            Verified industry insights distributed by Elite Steel Concepts Fabrication Division.
                        </p>
                    </div>
                </div>
              </div>
            </div>
          </Container>
        </Section>
      </article>
    </>
  );
}
