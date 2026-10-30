import React from "react";
import Container from "@/components/ui/Container";
import PageHeader from "@/components/ui/PageHeader";
import BlogCard, { cleanExcerpt } from "@/components/BlogCard";
import NewsletterSection from "@/components/sections/NewsletterSection";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, ArrowRight, ArrowLeft, TrendingUp, Sparkles, BookOpen, Search, ShieldCheck, ChevronRight, X } from "lucide-react";

import { getPosts, getPageSEO, getSEO } from "@/lib/db";
import type { Metadata } from "next";
import PageJsonLd from "@/components/PageJsonLd";
import { getSections } from "@/lib/pageContent";
import { BLOG_HEADER, BLOG_PROMO, BLOG_CTA } from "@/lib/pageContent/pages/blog";

// Cached and regenerated every 5 minutes, or immediately when the admin saves changes (revalidatePath).
export const revalidate = 300;

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

type BlogSearchParams = { sort?: string; page?: string | number; q?: string; category?: string };

function blogHref({ sort, page, q, category }: BlogSearchParams) {
  const params = new URLSearchParams();
  if (sort && sort !== "newest") params.set("sort", sort);
  if (category) params.set("category", category);
  if (q) params.set("q", q);
  if (page && Number(page) > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `/blog?${query}` : "/blog";
}

// Compact page list: 1 … 4 5 6 … 15
function pageList(current: number, total: number): (number | "…")[] {
  const pages = new Set([1, total, current - 1, current, current + 1]);
  const sorted = [...pages].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);
  const out: (number | "…")[] = [];
  sorted.forEach((n, i) => {
    if (i > 0 && n - sorted[i - 1] > 1) out.push("…");
    out.push(n);
  });
  return out;
}

export default async function BlogPage(props: { searchParams?: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const searchParams = await props.searchParams;
  const sortParam = searchParams?.sort === "oldest" ? "oldest" : "newest";
  const page = Math.max(1, parseInt(typeof searchParams?.page === "string" ? searchParams.page : "1", 10) || 1);
  const query = typeof searchParams?.q === "string" ? searchParams.q.trim() : "";
  const categoryParam = typeof searchParams?.category === "string" ? searchParams.category : "";
  const postsPerPage = 6;

  const [blogPosts, [header, promo, cta]] = await Promise.all([
    getPosts(),
    getSections([BLOG_HEADER, BLOG_PROMO, BLOG_CTA] as const),
  ]);
  const publishedPosts = blogPosts.filter(p => p.status === "Published");

  publishedPosts.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortParam === 'oldest' ? dateA - dateB : dateB - dateA;
  });

  // Category list with counts, most-used first
  const categoryCounts = new Map<string, number>();
  for (const post of publishedPosts) categoryCounts.set(post.category, (categoryCounts.get(post.category) || 0) + 1);
  const categories = [...categoryCounts.entries()].sort((a, b) => b[1] - a[1]);
  const activeCategory = categories.find(([name]) => name.toLowerCase() === categoryParam.toLowerCase())?.[0] || "";

  const needle = query.toLowerCase();
  const filteredPosts = publishedPosts.filter((post) =>
    (!activeCategory || post.category === activeCategory) &&
    (!needle || [post.title, post.excerpt, post.category, ...(post.tags || [])].some((field) => field?.toLowerCase().includes(needle)))
  );
  const isFiltered = Boolean(query || activeCategory);
  // Search: posts whose title matches come before tag/excerpt-only matches (sort is stable)
  if (needle) filteredPosts.sort((a, b) => Number(!a.title.toLowerCase().includes(needle)) - Number(!b.title.toLowerCase().includes(needle)));

  let featuredPost = null;
  let listPosts = filteredPosts;
  if (sortParam === 'newest' && !isFiltered && filteredPosts.length > 0) {
      featuredPost = page === 1 ? filteredPosts[0] : null;
      listPosts = filteredPosts.slice(1);
  }
  const totalPages = Math.max(1, Math.ceil(listPosts.length / postsPerPage));
  const currentPage = Math.min(page, totalPages);
  const paginatedPosts = listPosts.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage);

  const shownIds = new Set([featuredPost?.id, ...paginatedPosts.map((p) => p.id)]);
  const sidebarPosts = publishedPosts.filter((p) => !shownIds.has(p.id)).slice(0, 4);

  const filterChip = (active: boolean) =>
    `shrink-0 px-4 py-2.5 text-[11px] font-black uppercase tracking-[0.15em] border transition-colors ${
      active ? "bg-black text-white border-black" : "bg-white text-gray-600 border-gray-200 hover:border-primary hover:text-black"
    }`;

  return (
    <>
      <PageJsonLd pageId="blog" />
      <PageHeader
        eyebrow={header.eyebrow}
        title={header.title}
        subtitle={header.subtitle}
        normalCaseSubtitle
      />

      {/* ═══ FEATURED INSIGHT ════════════════════════════════ */}
      {featuredPost && (
        <section className="bg-gray-50 pt-12 md:pt-16">
          <Container>
             <Link href={`/blog/${featuredPost.slug}`} className="relative group block bg-[#0a0a0a] border border-[#1a1a1a]">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">

                   {/* Left: Image Panel */}
                   <div className="lg:col-span-7 relative aspect-video lg:aspect-auto lg:min-h-[440px] overflow-hidden">
                      <Image
                         src={featuredPost.image}
                         alt={featuredPost.imageAlt || featuredPost.title}
                         fill
                         priority
                         sizes="(max-width: 1024px) 100vw, 58vw"
                         unoptimized={featuredPost.image.startsWith("http")}
                         className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-[1.03] transition-[opacity,transform] duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/70 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-[#0a0a0a]/60 pointer-events-none" />
                      <div className="absolute top-0 left-0 bg-primary px-5 py-3">
                         <span className="text-black text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                            <Sparkles size={12} /> Latest Article
                         </span>
                      </div>
                   </div>

                   {/* Right: Content Panel */}
                   <div className="lg:col-span-5 p-8 md:p-12 flex flex-col justify-center text-white relative">
                      <div className="absolute top-0 left-0 right-0 h-1 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

                      <span className="w-fit text-[10px] font-black uppercase tracking-[0.2em] text-primary border border-primary/40 px-3 py-1.5 mb-6">
                         {featuredPost.category}
                      </span>

                      <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tighter mb-5 leading-[0.95]">
                         {featuredPost.title}
                      </h2>

                      <p className="text-gray-400 leading-relaxed mb-8 line-clamp-3">
                         {cleanExcerpt(featuredPost.excerpt)}
                      </p>

                      <div className="flex flex-wrap items-center justify-between gap-6">
                         <div className="flex items-center gap-5 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                            <span className="flex items-center gap-2"><Calendar size={14} className="text-primary" /> {featuredPost.date}</span>
                            <span className="flex items-center gap-2"><Clock size={14} className="text-primary" /> {featuredPost.readTime}</span>
                         </div>
                         <span className="flex items-center gap-3 bg-primary group-hover:bg-white text-black px-6 py-3.5 font-black uppercase tracking-widest text-xs transition-colors">
                            Read Article <ArrowRight size={16} />
                         </span>
                      </div>
                   </div>
                </div>
             </Link>
          </Container>
        </section>
      )}

      {/* ═══ MAIN GRID & SIDEBAR ═════════════════════════════ */}
      <section className="bg-gray-50 py-12 md:py-16">
        <Container>
           {/* Toolbar: categories, sort, search */}
           <div className="bg-white border border-gray-200 p-4 md:p-5 mb-10 flex flex-col xl:flex-row xl:items-center gap-4">
              <nav aria-label="Blog categories" className="flex gap-2 overflow-x-auto md:flex-wrap md:overflow-visible -mx-1 px-1 pb-1 md:pb-0 flex-1 min-w-0">
                 <Link href={blogHref({ sort: sortParam, q: query })} className={filterChip(!activeCategory)}>
                    All <span className="opacity-50 ml-1">{publishedPosts.length}</span>
                 </Link>
                 {categories.map(([name, count]) => (
                    <Link key={name} href={blogHref({ sort: sortParam, q: query, category: name })} className={filterChip(activeCategory === name)}>
                       {name} <span className="opacity-50 ml-1">{count}</span>
                    </Link>
                 ))}
              </nav>

              <div className="flex flex-col sm:flex-row gap-3 xl:w-auto">
                 <div className="flex border border-gray-200 shrink-0">
                    <Link href={blogHref({ sort: "newest", q: query, category: activeCategory })} className={`flex-1 text-center px-4 py-2.5 text-[11px] font-black uppercase tracking-[0.15em] transition-colors ${sortParam === "newest" ? "bg-primary text-black" : "text-gray-500 hover:text-black"}`}>
                       Newest
                    </Link>
                    <Link href={blogHref({ sort: "oldest", q: query, category: activeCategory })} className={`flex-1 text-center px-4 py-2.5 text-[11px] font-black uppercase tracking-[0.15em] border-l border-gray-200 transition-colors ${sortParam === "oldest" ? "bg-primary text-black" : "text-gray-500 hover:text-black"}`}>
                       Oldest
                    </Link>
                 </div>

                 <form action="/blog" method="get" role="search" className="relative sm:w-72">
                    {sortParam !== "newest" && <input type="hidden" name="sort" value={sortParam} />}
                    {activeCategory && <input type="hidden" name="category" value={activeCategory} />}
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={15} />
                    <input
                       type="search"
                       name="q"
                       defaultValue={query}
                       placeholder="Search articles..."
                       aria-label="Search articles"
                       className="w-full bg-gray-50 border border-gray-200 pl-11 pr-4 py-2.5 rounded-none outline-none focus:bg-white focus:border-primary transition-colors text-sm placeholder:text-gray-400"
                    />
                 </form>
              </div>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">

              {/* Main Content Area */}
              <div className="lg:col-span-8">
                 <div className="flex items-end justify-between gap-4 mb-6">
                    <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-black">
                       {query ? <>Results for <span className="text-primary">&ldquo;{query}&rdquo;</span></> : activeCategory || "All Articles"}
                    </h2>
                    <div className="flex items-center gap-4 shrink-0">
                       <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                          {filteredPosts.length} {filteredPosts.length === 1 ? "article" : "articles"}
                       </span>
                       {isFiltered && (
                          <Link href={blogHref({ sort: sortParam })} className="flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-black hover:text-primary">
                             <X size={13} /> Clear
                          </Link>
                       )}
                    </div>
                 </div>

                 {paginatedPosts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       {paginatedPosts.map((post) => (
                          <BlogCard key={post.id} post={post} />
                       ))}
                    </div>
                 ) : (
                    <div className="bg-white border border-gray-200 px-6 py-16 text-center">
                       <BookOpen className="mx-auto text-primary mb-4" size={36} />
                       <p className="text-lg font-black uppercase tracking-tight text-black mb-2">No articles found</p>
                       <p className="text-gray-500 mb-6">Try a different search term or browse all articles.</p>
                       <Link href="/blog" className="inline-flex items-center gap-2 bg-black hover:bg-primary hover:text-black text-white px-6 py-3 text-xs font-black uppercase tracking-widest transition-colors">
                          View All Articles <ArrowRight size={14} />
                       </Link>
                    </div>
                 )}

                 {totalPages > 1 && (
                    <nav aria-label="Pagination" className="mt-10 flex items-center justify-between gap-4">
                       {currentPage > 1 ? (
                          <Link href={blogHref({ sort: sortParam, q: query, category: activeCategory, page: currentPage - 1 })} className="flex items-center gap-2 h-11 px-4 border border-gray-200 bg-white text-black text-[11px] font-black uppercase tracking-widest hover:border-black transition-colors">
                             <ArrowLeft size={14} /> <span className="hidden sm:inline">Prev</span>
                          </Link>
                       ) : <span className="w-[52px] sm:w-[88px]" />}

                       <div className="flex items-center gap-1.5">
                          {pageList(currentPage, totalPages).map((n, i) =>
                             n === "…" ? (
                                <span key={`gap-${i}`} className="w-8 text-center text-gray-400">…</span>
                             ) : (
                                <Link
                                   key={n}
                                   href={blogHref({ sort: sortParam, q: query, category: activeCategory, page: n })}
                                   aria-current={n === currentPage ? "page" : undefined}
                                   className={`w-11 h-11 flex items-center justify-center text-sm font-black border transition-colors ${n === currentPage ? "bg-primary border-primary text-black" : "bg-white border-gray-200 text-gray-600 hover:border-black hover:text-black"}`}
                                >
                                   {n}
                                </Link>
                             )
                          )}
                       </div>

                       {currentPage < totalPages ? (
                          <Link href={blogHref({ sort: sortParam, q: query, category: activeCategory, page: currentPage + 1 })} className="flex items-center gap-2 h-11 px-4 border border-black bg-black text-white text-[11px] font-black uppercase tracking-widest hover:bg-primary hover:border-primary hover:text-black transition-colors">
                             <span className="hidden sm:inline">Next</span> <ArrowRight size={14} />
                          </Link>
                       ) : <span className="w-[52px] sm:w-[88px]" />}
                    </nav>
                 )}
              </div>

              {/* Sidebar */}
              <aside className="lg:col-span-4 space-y-8 lg:sticky lg:top-28 lg:self-start">

                 {/* More articles */}
                 {sidebarPosts.length > 0 && (
                    <div className="bg-[#0a0a0a] border border-[#1a1a1a] text-white">
                       <div className="px-6 py-5 border-b border-[#1a1a1a] flex items-center gap-3">
                          <TrendingUp size={16} className="text-primary" />
                          <h3 className="text-sm font-black uppercase tracking-[0.2em]">More to Read</h3>
                       </div>
                       <div className="flex flex-col">
                          {sidebarPosts.map((post) => (
                             <Link key={post.id} href={`/blog/${post.slug}`} className="group flex gap-4 p-5 border-b border-[#1a1a1a] last:border-b-0 hover:bg-white/[0.03] transition-colors">
                                <div className="relative w-20 h-20 shrink-0 overflow-hidden bg-[#1a1a1a]">
                                   <Image
                                      src={post.image}
                                      alt=""
                                      fill
                                      sizes="80px"
                                      unoptimized={post.image.startsWith("http")}
                                      className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-[opacity,transform] duration-500"
                                   />
                                </div>
                                <div className="min-w-0 flex flex-col justify-center gap-1.5">
                                   <span className="text-[10px] font-black uppercase text-primary tracking-[0.2em]">{post.category}</span>
                                   <h4 className="text-sm font-bold text-gray-200 leading-snug group-hover:text-white transition-colors line-clamp-2">
                                      {post.title}
                                   </h4>
                                   <span className="text-[11px] text-gray-500">{post.readTime}</span>
                                </div>
                             </Link>
                          ))}
                       </div>
                    </div>
                 )}

                 {/* Compliance promo */}
                 <Link href={promo.link} className="block bg-primary text-black p-8 relative overflow-hidden group">
                    <div className="absolute inset-0 pointer-events-none opacity-[0.12]"
                         style={{ backgroundImage: "repeating-linear-gradient(45deg, #000 0px, #000 1px, transparent 1px, transparent 10px)" }} />
                    <div className="relative">
                       <ShieldCheck className="mb-5" size={32} />
                       <h3 className="text-2xl font-black uppercase tracking-tighter leading-none mb-3">
                          {promo.title}
                       </h3>
                       <p className="text-sm font-semibold text-black/75 leading-relaxed mb-7">
                          {promo.body}
                       </p>
                       <span className="w-full bg-black group-hover:bg-[#1a1a1a] text-white py-4 font-black uppercase text-[11px] tracking-[0.2em] transition-colors flex items-center justify-center gap-2">
                          {promo.ctaText} <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                       </span>
                    </div>
                 </Link>

                 {/* Topics */}
                 <div className="bg-white border border-gray-200 p-6">
                    <h3 className="text-[11px] font-black uppercase text-black tracking-[0.2em] mb-5 flex items-center gap-2">
                       <span className="w-2 h-2 bg-primary" />
                       Browse by Topic
                    </h3>
                    <div className="flex flex-col">
                       {categories.map(([name, count]) => (
                          <Link
                             key={name}
                             href={blogHref({ category: name })}
                             className={`group flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0 text-sm font-bold transition-colors ${activeCategory === name ? "text-primary" : "text-gray-700 hover:text-black"}`}
                          >
                             <span className="flex items-center gap-2">
                                <ChevronRight size={14} className="text-primary group-hover:translate-x-0.5 transition-transform" />
                                {name}
                             </span>
                             <span className="text-[11px] font-black text-gray-400 bg-gray-50 border border-gray-100 px-2 py-0.5">{count}</span>
                          </Link>
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
                  <p className="text-primary font-black tracking-[0.2em] uppercase text-[10px]">
                     {cta.eyebrow}
                  </p>
                  <div className="h-px w-8 bg-primary" />
               </div>
               <h2 className="text-4xl md:text-5xl font-black uppercase text-white tracking-tighter leading-[0.9] mb-6">
                  {cta.title} <span className="text-primary block mt-2">{cta.titleHighlight}</span>
               </h2>
               <p className="text-gray-400 text-sm font-light leading-relaxed mb-10 max-w-lg">
                  {cta.body}
               </p>
               <Link 
                 href={cta.ctaLink}
                 className="inline-flex items-center gap-3 bg-primary hover:bg-orange-600 text-white px-8 py-4 font-black uppercase tracking-[0.15em] text-xs transition-all shadow-lg shadow-primary/20"
               >
                  {cta.ctaText} <ArrowRight size={16} />
               </Link>
            </div>
         </Container>
      </section>
    </>
  );
}
