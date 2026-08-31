import React from "react";
import { getPostBySlug, getPosts, getInternalLinkRules, getInternalLinkSettings } from "@/lib/db";
import { autoLinkMarkdown } from "@/lib/internalLinks";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock, Phone, ArrowRight, ShieldAlert, FileText, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Post Not Found" };

  const description = post.metaDescription || post.subtitle || post.excerpt;
  return {
    title: `${post.title} | Elite Steel Concepts`,
    description,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description,
      images: [post.image],
      type: "article",
    },
  };
}

// Extract FAQ items from post content (looks for ### Q: / ### FAQ: patterns)
function extractFAQs(content: string): { question: string; answer: string }[] {
  const faqs: { question: string; answer: string }[] = [];
  const lines = content.split("\n");
  let i = 0;
  while (i < lines.length) {
    const line = lines[i].trim();
    // Match ### Q1: / ### Q2: / ### FAQ: / ### Q: patterns
    if (/^###\s+(Q\d*:|FAQ\d*:|Question\d*:)/i.test(line)) {
      const question = line.replace(/^###\s+(Q\d*:|FAQ\d*:|Question\d*:)\s*/i, "").trim();
      const answerLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("###") && !lines[i].startsWith("##")) {
        const l = lines[i].trim();
        if (l) answerLines.push(l);
        i++;
      }
      if (question && answerLines.length > 0) {
        faqs.push({ question, answer: answerLines.join(" ").replace(/\[.*?\]\(.*?\)/g, "").trim() });
      }
    } else {
      i++;
    }
  }
  return faqs;
}

// Split content into two halves for inline CTA placement
function splitContentAtMidpoint(content: string): [string, string] {
  const paragraphs = content.split(/\n\n+/);
  const mid = Math.ceil(paragraphs.length * 0.55);
  return [
    paragraphs.slice(0, mid).join("\n\n"),
    paragraphs.slice(mid).join("\n\n"),
  ];
}

function parseContent(content: string) {
  if (!content) return "";
  return content
    .replace(/### (.*)/g, '<h3 class="text-xl md:text-2xl font-black uppercase text-secondary mt-10 mb-4 tracking-tight">$1</h3>')
    .replace(/## (.*)/g, '<h2 class="text-2xl md:text-3xl font-black uppercase text-secondary mt-12 mb-6 border-l-[3px] border-primary pl-4 tracking-tighter leading-tight">$1</h2>')
    .replace(/!\[(.*?)\]\((.*?)\)/g, '<div class="my-10 overflow-hidden border border-gray-200"><img src="$2" alt="$1" class="w-full object-cover" /><p class="text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 p-3 text-center bg-gray-50 border-t border-gray-200">$1</p></div>')
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-primary font-bold underline underline-offset-4 hover:text-orange-600 transition-colors">$1</a>')
    .replace(/\n\n/g, '</p><p class="mb-6 leading-relaxed text-gray-600">')
    .replace(/^- (.*)/gm, '<li class="flex items-start gap-3 mb-3"><div class="w-1 h-1 bg-primary mt-2.5 shrink-0"></div><span class="text-gray-600">$1</span></li>');
}

export default async function BlogDetailsPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return notFound();

  const allPosts = await getPosts();
  const rules = await getInternalLinkRules();
  const settings = await getInternalLinkSettings();

  const applicableRules = rules.filter(r => {
    if (r.categoryFilter && r.categoryFilter !== "All" && r.categoryFilter !== post.category) {
      return false;
    }
    return r.enabled !== false;
  });

  const { updatedContent } = autoLinkMarkdown(post.content || "", applicableRules, settings);

  const relatedPosts = allPosts
    .filter(p => p.id !== post.id && p.status === "Published")
    .slice(0, 3);

  const faqs = extractFAQs(updatedContent);
  const [firstHalf, secondHalf] = splitContentAtMidpoint(updatedContent);
  const firstHalfHtml = parseContent(firstHalf);
  const secondHalfHtml = parseContent(secondHalf);
  const quickAnswer = post.metaDescription || post.excerpt || "";

  // Article + FAQ JSON-LD schema
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.metaDescription || post.subtitle || post.excerpt,
    image: post.image,
    datePublished: post.date,
    author: {
      "@type": "Organization",
      name: "Elite Steel Concepts",
      url: "https://www.esteelconcepts.com",
    },
    publisher: {
      "@type": "Organization",
      name: "Elite Steel Concepts",
      logo: {
        "@type": "ImageObject",
        url: "https://www.esteelconcepts.com/logo.png",
      },
    },
  };

  const faqSchema = faqs.length > 0
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map(f => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      }
    : null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      {faqSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      )}

      <article className="bg-white">
        {/* ═══ HERO ════════════════════════════════════════════ */}
        <div className="relative h-[60vh] md:h-[70vh] bg-[#0a0a0a] overflow-hidden">
          {/* Background image & gradients */}
          <div className="absolute inset-0 z-0">
             <Image
               src={post.image}
               unoptimized
               alt={post.imageAlt || post.title}
               fill
               className="object-cover opacity-40 scale-105"
               priority
             />
             <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent" />
             {/* Industrial grid overlay */}
             <div className="absolute inset-0 pointer-events-none opacity-[0.05]" style={{ backgroundImage: "repeating-linear-gradient(0deg, #fff 0px, #fff 1px, transparent 1px, transparent 60px), repeating-linear-gradient(90deg, #fff 0px, #fff 1px, transparent 1px, transparent 60px)" }} />
          </div>

          <Container className="relative z-10 h-full flex flex-col justify-end pb-16">
            <Link href="/blog" className="inline-flex items-center text-primary hover:text-white transition-colors mb-10 text-[10px] font-black uppercase tracking-[0.2em] group w-fit">
              <ArrowLeft size={14} className="mr-2 transform group-hover:-translate-x-1 transition-transform" /> Back to Intelligence
            </Link>

            <div className="flex items-center gap-4 mb-6">
              <span className="bg-primary text-black text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 border border-primary">
                {post.category}
              </span>
              <div className="flex items-center text-gray-400 text-[10px] font-black uppercase tracking-[0.1em]">
                <Clock size={12} className="mr-1.5 text-primary" /> {post.readTime}
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-7xl font-black uppercase text-white mb-6 tracking-tighter leading-[0.9] max-w-5xl">
              {post.title}
            </h1>

            {post.subtitle && (
              <p className="text-xl md:text-2xl font-light text-gray-300 max-w-3xl leading-relaxed mb-8 border-l-2 border-primary/40 pl-6">
                {post.subtitle}
              </p>
            )}

            <div className="flex items-center gap-8 text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">
              <div className="flex items-center">
                <Calendar size={14} className="mr-2 text-primary" /> Published: {post.date}
              </div>
            </div>
          </Container>
          
          {/* Accent Line Bottom */}
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-primary/50 to-transparent" />
        </div>

        {/* ═══ QUICK ANSWER (Snippet target) ═══════════════════ */}
        {quickAnswer && (
          <div className="bg-gray-50 border-b border-gray-200">
            <Container className="py-10">
              <div className="bg-white border border-gray-200 border-l-4 border-l-primary p-8 max-w-4xl flex items-start gap-5 shadow-sm">
                <FileText className="text-primary shrink-0" size={24} />
                <div>
                   <p className="text-[10px] font-black uppercase tracking-[0.2em] text-black mb-2">Executive Summary</p>
                   <p className="text-gray-600 leading-relaxed font-medium">{quickAnswer}</p>
                </div>
              </div>
            </Container>
          </div>
        )}

        {/* ═══ ARTICLE CONTENT ═════════════════════════════════ */}
        <Section className="pb-32 pt-16">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">

              {/* Main Column */}
              <div className="lg:col-span-8">

                {/* First half of content */}
                <div className="rich-text-content">
                  <div className="mb-6 leading-relaxed text-gray-600 text-lg"
                    dangerouslySetInnerHTML={{ __html: firstHalfHtml }} />
                </div>

                {/* Inline CTA — mid-article */}
                <div className="my-14 p-10 bg-[#0a0a0a] border border-[#1a1a1a] flex flex-col md:flex-row items-start md:items-center justify-between gap-8 relative overflow-hidden group">
                  {/* Subtle hover pulse */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-700" />
                  
                  <div className="relative z-10">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-2">Elite Steel Concepts</p>
                    <p className="font-black text-white text-xl uppercase tracking-tight leading-tight mb-2">
                      Precision builds. 100% Code Compliant.
                    </p>
                    <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Serving the DMV & Nationwide</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 shrink-0 relative z-10 w-full md:w-auto">
                    <a
                      href="tel:+15716510337"
                      className="inline-flex items-center justify-center gap-2 border border-white/20 hover:border-primary text-white hover:text-primary font-black uppercase tracking-wider text-[10px] px-6 py-4 transition-colors"
                    >
                      <Phone size={14} /> (571) 651-0337
                    </a>
                    <Link
                      href="/quote"
                      className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-orange-600 text-white font-black uppercase tracking-wider text-[10px] px-6 py-4 transition-colors"
                    >
                      Free Quote <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>

                {/* Second half of content */}
                {secondHalf && (
                  <div className="rich-text-content">
                    <div className="mb-6 leading-relaxed text-gray-600"
                      dangerouslySetInnerHTML={{ __html: secondHalfHtml }} />
                  </div>
                )}

                {/* FAQ Section */}
                {faqs.length > 0 && (
                  <div className="mt-20 border-t-[3px] border-black pt-12">
                    <h2 className="text-3xl font-black uppercase text-black tracking-tighter mb-8">
                      Intelligence Brief: FAQs
                    </h2>
                    <div className="space-y-px bg-gray-200 border border-gray-200">
                      {faqs.map((faq, i) => (
                        <details key={i} className="group bg-white">
                          <summary className="flex items-center justify-between p-6 cursor-pointer font-bold text-black hover:text-primary transition-colors list-none text-base border-l-2 border-transparent group-open:border-primary">
                            <span>{faq.question}</span>
                            <span className="ml-4 shrink-0 text-primary font-black transition-transform group-open:rotate-45 text-xl leading-none">+</span>
                          </summary>
                          <div className="px-6 pb-6 text-gray-600 leading-relaxed text-sm bg-gray-50/50">{faq.answer}</div>
                        </details>
                      ))}
                    </div>
                  </div>
                )}

                {/* Bottom CTA Panel */}
                <div className="mt-20 p-12 bg-primary border border-orange-600 flex flex-col md:flex-row items-center justify-between gap-10 shadow-xl relative overflow-hidden group">
                  {/* Texture overlay */}
                  <div className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay"
                       style={{ backgroundImage: "repeating-linear-gradient(45deg, #000 0px, #000 1px, transparent 1px, transparent 10px)" }} />
                       
                  <div className="relative z-10 flex-1">
                    <div className="flex items-center gap-3 mb-4">
                       <ShieldAlert size={20} className="text-black" />
                       <span className="text-[10px] font-black uppercase tracking-[0.2em] text-black">Start Your Build</span>
                    </div>
                    <h4 className="text-3xl font-black uppercase tracking-tighter text-black mb-2 leading-none">Ready to Execute?</h4>
                    <p className="text-black/80 text-xs font-black uppercase tracking-widest">
                      12+ years · 350+ builds · Manassas, VA
                    </p>
                  </div>
                  <div className="relative z-10 shrink-0 w-full md:w-auto">
                     <Link
                       href="/quote"
                       className="flex items-center justify-center gap-3 bg-[#0a0a0a] text-white px-10 py-5 font-black uppercase text-[10px] tracking-[0.2em] hover:bg-black transition-colors"
                     >
                       Request a Quote <ArrowRight size={14} />
                     </Link>
                  </div>
                </div>
              </div>

              {/* ═══ SIDEBAR ═════════════════════════════════════ */}
              <div className="lg:col-span-4 space-y-12">
                <div className="sticky top-[100px]">

                  {/* Contact Widget */}
                  <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-8 mb-12 relative group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                    
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-3">Expert Consultation</p>
                    <p className="font-black text-white text-xl uppercase tracking-tighter leading-tight mb-6">
                      Speak directly with our engineers.
                    </p>
                    
                    <ul className="space-y-3 mb-8">
                       <li className="flex items-center gap-3"><CheckCircle2 size={14} className="text-primary"/> <span className="text-xs text-gray-400 font-bold uppercase">Health Code Review</span></li>
                       <li className="flex items-center gap-3"><CheckCircle2 size={14} className="text-primary"/> <span className="text-xs text-gray-400 font-bold uppercase">Layout Optimization</span></li>
                       <li className="flex items-center gap-3"><CheckCircle2 size={14} className="text-primary"/> <span className="text-xs text-gray-400 font-bold uppercase">Budget Analysis</span></li>
                    </ul>

                    <div className="space-y-3">
                       <a
                         href="tel:+15716510337"
                         className="flex items-center justify-center gap-2 bg-[#1a1a1a] hover:bg-[#222] text-white font-black uppercase tracking-wider text-[10px] px-5 py-4 transition-colors w-full border border-[#333]"
                       >
                         <Phone size={14} /> Call (571) 651-0337
                       </a>
                       <Link
                         href="/quote"
                         className="flex items-center justify-center gap-2 bg-primary hover:bg-orange-600 text-white font-black uppercase tracking-wider text-[10px] px-5 py-4 transition-colors w-full shadow-lg shadow-primary/20"
                       >
                         Start Online Quote <ArrowRight size={14} />
                       </Link>
                    </div>
                  </div>

                  {/* Related Intel */}
                  {relatedPosts.length > 0 && (
                     <div className="bg-white border border-gray-200">
                        <div className="p-6 border-b border-gray-200 bg-gray-50 flex items-center gap-3">
                           <div className="w-2 h-2 bg-black" />
                           <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-black">
                              Related Intel
                           </h3>
                        </div>
                        <div className="flex flex-col">
                           {relatedPosts.map((related) => (
                             <Link key={related.id} href={`/blog/${related.slug}`} className="group relative p-6 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors">
                                {/* Left accent line hover */}
                                <div className="absolute top-0 left-0 bottom-0 w-[3px] bg-primary scale-y-0 group-hover:scale-y-100 transition-transform origin-top" />
                                
                                <div className="relative aspect-video overflow-hidden mb-4 bg-black">
                                  <Image
                                    src={related.image}
                                    unoptimized
                                    alt={related.title}
                                    fill
                                    className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                                  />
                                </div>
                                <span className="text-[9px] font-black uppercase text-gray-500 tracking-widest mb-2 block">
                                  {related.category}
                                </span>
                                <h4 className="text-sm font-black uppercase leading-tight text-black group-hover:text-primary transition-colors tracking-tight line-clamp-2">
                                  {related.title}
                                </h4>
                             </Link>
                           ))}
                        </div>
                     </div>
                  )}

                </div>
              </div>
            </div>
          </Container>
        </Section>
      </article>
    </>
  );
}
