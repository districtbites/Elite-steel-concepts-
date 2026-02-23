import React from "react";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";
import BlogCard from "@/components/BlogCard";
import NewsletterSection from "@/components/sections/NewsletterSection";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, ArrowRight, TrendingUp, Sparkles, BookOpen, Search } from "lucide-react";

import { getPosts, getPageSEO, getSEO } from "@/lib/db";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSEO();
  const pageSeo = await getPageSEO("blog");
  
  return {
    title: pageSeo?.title || `News & Insights | ${seo.siteTitle}`,
    description: pageSeo?.description || seo.description,
    keywords: pageSeo?.keywords || seo.keywords,
  };
}

export default async function BlogPage() {
  const blogPosts = await getPosts();
  const publishedPosts = blogPosts.filter(p => p.status === "Published");
  
  // Logic for different sections
  const featuredPost = publishedPosts[0];
  const remainingPosts = publishedPosts.slice(1);
  
  const categories = Array.from(new Set(publishedPosts.map(p => p.category)));
  const popularTopics = publishedPosts.slice(0, 4); // Just for demo/visuals

  return (
    <>
      <PageHeader
        title="Intelligence & Insights"
        subtitle="Exclusive blueprints for success in the mobile kitchen industry. Expert analysis, maintenance guides, and entrepreneur success stories."
      />

      {/* Featured Spotlight Section */}
      {featuredPost && (
        <Section className="bg-white overflow-hidden pb-12">
          <Container>
             <div className="relative group">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 rounded-[3rem] overflow-hidden bg-secondary border border-secondary shadow-2xl">
                   <div className="lg:col-span-7 relative aspect-video lg:aspect-auto min-h-[400px]">
                      <Image 
                         src={featuredPost.image} 
                         alt={featuredPost.title}
                         fill
                         className="object-cover group-hover:scale-105 transition-transform duration-1000 opacity-90"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-secondary via-transparent to-transparent hidden lg:block" />
                      <div className="absolute top-8 left-8">
                         <span className="bg-primary text-secondary px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg flex items-center gap-2">
                            <Sparkles size={12} /> Featured Insight
                         </span>
                      </div>
                   </div>
                   <div className="lg:col-span-5 p-12 flex flex-col justify-center text-white relative">
                      <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-primary mb-6">
                         <div className="flex items-center gap-2"><Calendar size={14}/> {featuredPost.date}</div>
                         <div className="flex items-center gap-2"><Clock size={14}/> {featuredPost.readTime}</div>
                      </div>
                      <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-6 leading-none">
                         {featuredPost.title}
                      </h2>
                      <p className="text-gray-400 text-lg leading-relaxed mb-10 font-light line-clamp-3 italic">
                         "{featuredPost.excerpt}"
                      </p>
                      <Link 
                        href={`/blog/${featuredPost.slug}`}
                        className="w-fit flex items-center gap-3 bg-primary text-secondary px-8 py-4 rounded-full font-black uppercase tracking-widest text-xs hover:bg-white transition-all shadow-xl"
                      >
                         Read Full Analysis <ArrowRight size={18} />
                      </Link>
                   </div>
                </div>
             </div>
          </Container>
        </Section>
      )}

      {/* Categories & Filter Bar */}
      <div className="bg-gray-50 border-y border-gray-100 sticky top-20 z-40 backdrop-blur-md bg-white/80">
         <Container>
            <div className="flex flex-col md:flex-row items-center justify-between py-6 gap-6">
               <div className="flex flex-wrap items-center justify-center gap-3">
                  <button className="px-6 py-2 bg-secondary text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-md">All Posts</button>
                  {categories.map(cat => (
                     <button key={cat} className="px-6 py-2 bg-white text-gray-500 border border-gray-100 rounded-full text-[10px] font-black uppercase tracking-widest hover:border-primary hover:text-primary transition-all">
                        {cat}
                     </button>
                  ))}
               </div>
               <div className="relative w-full md:w-64">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input 
                     type="text" 
                     placeholder="Search insights..."
                     className="w-full bg-white border border-gray-100 pl-12 pr-4 py-3 rounded-full outline-none focus:ring-2 focus:ring-primary/20 transition-all text-xs font-bold"
                  />
               </div>
            </div>
         </Container>
      </div>

      {/* Main Grid & Sidebar */}
      <Section className="bg-gray-50/30">
        <Container>
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
              
              {/* Main Content Area */}
              <div className="lg:col-span-8 space-y-12">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {remainingPosts.map((post) => (
                       <BlogCard key={post.id} post={post} />
                    ))}
                 </div>
                 
                 {remainingPosts.length > 6 && (
                    <div className="pt-12 flex justify-center">
                       <button className="bg-white border-2 border-secondary text-secondary px-12 py-4 rounded-full font-black uppercase tracking-widest text-xs hover:bg-secondary hover:text-white transition-all shadow-lg">
                          Load More Insights
                       </button>
                    </div>
                 )}
              </div>

              {/* Advanced Sidebar */}
              <aside className="lg:col-span-4 space-y-12">
                 
                 {/* Popular Sidebar */}
                 <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                    <h3 className="text-xl font-black uppercase text-secondary tracking-tighter mb-8 flex items-center gap-3">
                       <TrendingUp className="text-primary" size={24} /> Trending Now
                    </h3>
                    <div className="space-y-8">
                       {popularTopics.map((topic, i) => (
                          <Link key={i} href={`/blog/${topic.slug}`} className="flex gap-4 group">
                             <div className="text-3xl font-black text-gray-100 group-hover:text-primary transition-colors">0{i+1}</div>
                             <div className="space-y-1">
                                <span className="text-[10px] font-black uppercase text-primary tracking-widest">{topic.category}</span>
                                <h4 className="text-sm font-bold text-secondary leading-tight group-hover:underline">{topic.title}</h4>
                             </div>
                          </Link>
                       ))}
                    </div>
                 </div>

                 {/* Internal Value Prop Card */}
                 <div className="bg-secondary p-10 rounded-[2.5rem] text-white relative overflow-hidden group">
                    <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary/20 rounded-full blur-3xl group-hover:w-64 transition-all duration-700"></div>
                    <div className="relative z-10 space-y-6">
                       <BookOpen className="text-primary" size={40} />
                       <h3 className="text-2xl font-black uppercase tracking-tighter leading-tight">
                          The Fabrication <br/> <span className="text-primary">Masterclass</span>
                       </h3>
                       <p className="text-sm text-gray-400 font-light leading-relaxed">
                          Download our comprehensive 50-page guide on starting your food truck business. From permit navigation to kitchen layout secrets.
                       </p>
                       <button className="w-full bg-primary text-secondary py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-white transition-all">
                          Download Guide
                       </button>
                    </div>
                 </div>

                 {/* Tags Cloud */}
                 <div className="p-8">
                    <h4 className="text-xs font-black uppercase text-gray-400 tracking-[0.2em] mb-6">Expertise Tags</h4>
                    <div className="flex flex-wrap gap-2">
                       {["Fabrication", "Permits", "Design", "Kitchen Systems", "Marketing", "Maintenance"].map(tag => (
                          <span key={tag} className="text-[10px] font-bold uppercase bg-gray-100 text-gray-500 px-3 py-1.5 rounded-lg hover:bg-primary/20 hover:text-secondary cursor-pointer transition-colors">
                             #{tag}
                          </span>
                       ))}
                    </div>
                 </div>

              </aside>
           </div>
        </Container>
      </Section>

      {/* Newsletter Section Integration */}
      <NewsletterSection />

      {/* Final CTA */}
      <section className="py-24 bg-white">
         <Container>
            <div className="text-center max-w-3xl mx-auto space-y-8">
               <span className="text-primary font-bold tracking-widest uppercase text-sm block">Got a Story?</span>
               <h2 className="text-4xl md:text-5xl font-black uppercase text-secondary tracking-tighter leading-tight">
                  Join the <span className="text-primary italic">Elite</span> Community
               </h2>
               <p className="text-gray-500 font-light text-lg">
                  We are always looking for culinary pioneers to feature in our success stories. If we built your truck, we want to share your journey.
               </p>
               <Link 
                 href="/contact" 
                 className="inline-flex items-center gap-3 bg-secondary text-white px-10 py-5 rounded-full font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-2xl"
               >
                  Connect With Our Team <ArrowRight size={18} />
               </Link>
            </div>
         </Container>
      </section>
    </>
  );
}
