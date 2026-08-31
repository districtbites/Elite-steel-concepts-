import React from "react";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";
import BlogCard from "@/components/BlogCard";
import NewsletterSection from "@/components/sections/NewsletterSection";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, ArrowRight, TrendingUp, Sparkles, BookOpen, Search, ShieldAlert } from "lucide-react";

import { getPosts, getPageSEO, getSEO } from "@/lib/db";
import type { Metadata } from "next";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSEO();
  const pageSeo = await getPageSEO("blog");
  
  return {
    title: pageSeo?.title || `News & Insights | ${seo.siteTitle}`,
    description: pageSeo?.description || seo.description,
    keywords: pageSeo?.keywords || seo.keywords,
    alternates: { canonical: '/blog' },
  };
}

export default async function BlogPage(props: { searchParams?: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const searchParams = await props.searchParams;
  const sortParam = typeof searchParams?.sort === 'string' ? searchParams.sort : 'newest';
  const pageParam = typeof searchParams?.page === 'string' ? searchParams.page : '1';
  const page = parseInt(pageParam, 10) || 1;
  const postsPerPage = 6;

  const blogPosts = await getPosts();
  const publishedPosts = blogPosts.filter(p => p.status === "Published");
  
  // Sort posts by date
  publishedPosts.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      // newest first is dateB - dateA
      return sortParam === 'oldest' ? dateA - dateB : dateB - dateA;
  });
  
  let featuredPost = null;
  let paginatedPosts = [];
  let totalPages = 1;

  if (page === 1 && sortParam === 'newest' && publishedPosts.length > 0) {
      featuredPost = publishedPosts[0];
      const remainingPosts = publishedPosts.slice(1);
      totalPages = Math.ceil(remainingPosts.length / postsPerPage) || 1;
      paginatedPosts = remainingPosts.slice(0, postsPerPage);
  } else {
      totalPages = Math.ceil(publishedPosts.length / postsPerPage) || 1;
      const startIndex = (page - 1) * postsPerPage;
      paginatedPosts = publishedPosts.slice(startIndex, startIndex + postsPerPage);
  }
  
  const popularTopics = publishedPosts.slice(0, 4); // Just for demo/visuals

  return (
    <>
      <PageHeader
        title="Intelligence & Insights"
        subtitle="Exclusive blueprints for success in the mobile kitchen industry. Expert analysis, maintenance guides, and entrepreneur success stories."
      />

      {/* ═══ FEATURED INSIGHT ════════════════════════════════ */}
      {featuredPost && (
        <section className="bg-white pb-20 border-b border-gray-100">
          <Container>
             <div className="relative group bg-[#0a0a0a] border border-[#1a1a1a]">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                   
                   {/* Left: Image Panel */}
                   <div className="lg:col-span-7 relative aspect-square md:aspect-video lg:aspect-auto min-h-[450px] overflow-hidden">
                      <Image 
                         src={featuredPost.image} 
                         alt={featuredPost.title}
                         fill
                         className="object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] lg:bg-gradient-to-r lg:from-transparent lg:to-[#0a0a0a] to-transparent pointer-events-none" />
                      
                      {/* Badge */}
                      <div className="absolute top-0 left-0 bg-primary px-5 py-3">
                         <span className="text-black text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                            <Sparkles size={12} /> Featured Intel
                         </span>
                      </div>
                      
                      {/* Accent Line */}
                      <div className="hidden lg:block absolute top-0 bottom-0 right-0 w-px bg-gradient-to-b from-transparent via-primary/30 to-transparent" />
                   </div>
                   
                   {/* Right: Content Panel */}
                   <div className="lg:col-span-5 p-10 lg:p-14 flex flex-col justify-center text-white relative">
                      {/* Hover Top Accent */}
                      <div className="absolute top-0 left-0 right-0 h-1 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

                      <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-primary mb-6">
                         <div className="flex items-center gap-2"><Calendar size={14}/> {featuredPost.date}</div>
                         <div className="flex items-center gap-2"><Clock size={14}/> {featuredPost.readTime}</div>
                      </div>
                      
                      <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-6 leading-[0.9]">
                         {featuredPost.title}
                      </h2>
                      
                      <p className="text-gray-400 text-sm leading-relaxed mb-10 font-light line-clamp-3">
                         {featuredPost.excerpt}
                      </p>
                      
                      <Link 
                        href={`/blog/${featuredPost.slug}`}
                        className="w-fit flex items-center gap-3 bg-primary hover:bg-orange-600 text-white px-8 py-4 font-black uppercase tracking-widest text-xs transition-all shadow-lg shadow-primary/20"
                      >
                         Read Full Analysis <ArrowRight size={16} />
                      </Link>
                   </div>
                </div>
             </div>
          </Container>
        </section>
      )}

      {/* ═══ CATEGORIES & SEARCH BAR ═════════════════════════ */}
      <div className="bg-gray-50 border-b border-gray-200 sticky top-[72px] z-40">
         <Container>
            <div className="flex flex-col md:flex-row items-center justify-between py-4 gap-4">
               {/* Filters */}
               <div className="flex flex-wrap items-center justify-center gap-2">
                  <Link href={`/blog?sort=newest&page=1`} className={`px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.15em] transition-colors border ${sortParam === 'newest' ? 'bg-[#0a0a0a] text-white border-[#0a0a0a]' : 'bg-white text-gray-500 border-gray-200 hover:border-primary hover:text-black'}`}>
                    Newest First
                  </Link>
                  <Link href={`/blog?sort=oldest&page=1`} className={`px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.15em] transition-colors border ${sortParam === 'oldest' ? 'bg-[#0a0a0a] text-white border-[#0a0a0a]' : 'bg-white text-gray-500 border-gray-200 hover:border-primary hover:text-black'}`}>
                    Oldest First
                  </Link>
               </div>
               
               {/* Search */}
               <div className="relative w-full md:w-72">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                  <input 
                     type="text" 
                     placeholder="SEARCH INTEL..."
                     className="w-full bg-white border border-gray-200 pl-11 pr-4 py-3 rounded-none outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-xs font-black uppercase tracking-wider placeholder:text-gray-300"
                  />
               </div>
            </div>
         </Container>
      </div>

      {/* ═══ MAIN GRID & SIDEBAR ═════════════════════════════ */}
      <section className="bg-gray-50 py-20">
        <Container>
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
              
              {/* Main Content Area */}
              <div className="lg:col-span-8 space-y-12">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-gray-200 border border-gray-200">
                    {paginatedPosts.map((post) => (
                       <BlogCard key={post.id} post={post} />
                    ))}
                 </div>
                 
                 {totalPages > 1 && (
                    <div className="pt-8 flex justify-between items-center bg-white p-6 border border-gray-200">
                       {page > 1 ? (
                          <Link href={`/blog?sort=${sortParam}&page=${page - 1}`} className="bg-transparent border-2 border-black text-black px-6 py-3 font-black uppercase tracking-widest text-[10px] hover:bg-black hover:text-white transition-colors">
                             &larr; Prev
                          </Link>
                       ) : <div />}
                       
                       <div className="text-xs font-black tracking-widest text-gray-500 uppercase">
                          Page {page} of {totalPages}
                       </div>

                       {page < totalPages ? (
                          <Link href={`/blog?sort=${sortParam}&page=${page + 1}`} className="bg-transparent border-2 border-black text-black px-6 py-3 font-black uppercase tracking-widest text-[10px] hover:bg-black hover:text-white transition-colors">
                             Next &rarr;
                          </Link>
                       ) : <div />}
                    </div>
                 )}
              </div>

              {/* Sidebar */}
              <aside className="lg:col-span-4 space-y-10">
                 
                 {/* Trending Box */}
                 <div className="bg-[#0a0a0a] border border-[#1a1a1a] text-white">
                    <div className="p-6 border-b border-[#1a1a1a] flex items-center gap-3">
                       <div className="w-1.5 h-1.5 bg-primary animate-pulse" />
                       <h3 className="text-sm font-black uppercase tracking-[0.2em]">
                          Trending Intel
                       </h3>
                    </div>
                    <div className="flex flex-col">
                       {popularTopics.map((topic, i) => (
                          <Link key={i} href={`/blog/${topic.slug}`} className="group relative p-6 border-b border-[#1a1a1a] last:border-b-0 hover:bg-[#0f0f0f] transition-colors">
                             {/* Left hover border */}
                             <div className="absolute top-0 left-0 bottom-0 w-1 bg-primary scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top" />
                             
                             <div className="flex gap-5 relative z-10">
                                <div className="text-4xl font-black text-white/[0.05] group-hover:text-primary/20 transition-colors leading-none select-none">
                                  {String(i+1).padStart(2, '0')}
                                </div>
                                <div className="space-y-2">
                                   <span className="text-[9px] font-black uppercase text-primary tracking-[0.2em]">{topic.category}</span>
                                   <h4 className="text-sm font-bold text-gray-200 leading-tight group-hover:text-white transition-colors line-clamp-2">
                                     {topic.title}
                                   </h4>
                                </div>
                             </div>
                          </Link>
                       ))}
                    </div>
                 </div>

                 {/* Promo Box */}
                 <div className="bg-primary border border-orange-600 text-black p-8 relative overflow-hidden group">
                    {/* Background texture */}
                    <div className="absolute inset-0 z-0 pointer-events-none opacity-20 mix-blend-overlay"
                         style={{ backgroundImage: "repeating-linear-gradient(45deg, #000 0px, #000 1px, transparent 1px, transparent 10px)" }} />
                    
                    <div className="relative z-10">
                       <ShieldAlert className="text-black mb-6" size={32} />
                       <h3 className="text-2xl font-black uppercase tracking-tighter leading-none mb-4">
                          Compliance <br/> Checklist
                       </h3>
                       <p className="text-xs font-bold text-black/70 uppercase tracking-widest leading-relaxed mb-8">
                          Download the 10-point inspection guide to ensure your truck passes fire & health code.
                       </p>
                       <button className="w-full bg-[#0a0a0a] hover:bg-black text-white py-4 font-black uppercase text-[10px] tracking-[0.2em] transition-colors flex items-center justify-center gap-2">
                          Get the Guide <ArrowRight size={14} />
                       </button>
                    </div>
                 </div>

                 {/* Tags Box */}
                 <div className="bg-white border border-gray-200 p-8">
                    <h4 className="text-[10px] font-black uppercase text-black tracking-[0.2em] mb-6 flex items-center gap-2">
                       <div className="w-2 h-2 bg-primary" />
                       Expertise Directory
                    </h4>
                    <div className="flex flex-wrap gap-2">
                       {["Fabrication", "Permits", "Design", "Kitchen Systems", "Marketing", "Maintenance"].map(tag => (
                          <span key={tag} className="text-[9px] font-black uppercase tracking-widest border border-gray-200 text-gray-500 px-3 py-2 hover:border-primary hover:text-black cursor-pointer transition-colors bg-gray-50">
                             {tag}
                          </span>
                       ))}
                    </div>
                 </div>

              </aside>
           </div>
        </Container>
      </section>

      <NewsletterSection />

      {/* ═══ FINAL CTA ═══════════════════════════════════════ */}
      <section className="py-24 bg-[#0a0a0a] text-center border-t border-[#1a1a1a]">
         <Container>
            <div className="max-w-2xl mx-auto flex flex-col items-center">
               <div className="flex items-center gap-3 mb-6">
                  <div className="h-px w-8 bg-primary" />
                  <span className="text-primary font-black tracking-[0.2em] uppercase text-[10px]">
                     Got a Story?
                  </span>
                  <div className="h-px w-8 bg-primary" />
               </div>
               <h2 className="text-4xl md:text-5xl font-black uppercase text-white tracking-tighter leading-[0.9] mb-6">
                  Join the <span className="text-primary block mt-2">Elite Community</span>
               </h2>
               <p className="text-gray-400 text-sm font-light leading-relaxed mb-10 max-w-lg">
                  We are always looking for culinary pioneers to feature in our success stories. If we built your truck, we want to share your journey.
               </p>
               <Link 
                 href="/contact" 
                 className="inline-flex items-center gap-3 bg-primary hover:bg-orange-600 text-white px-8 py-4 font-black uppercase tracking-[0.15em] text-xs transition-all shadow-lg shadow-primary/20"
               >
                  Connect With Our Team <ArrowRight size={16} />
               </Link>
            </div>
         </Container>
      </section>
    </>
  );
}
