import React from "react";
import { getPostBySlug, getPosts } from "@/lib/db";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock, Phone, ArrowRight } from "lucide-react";
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

  const faqs = extractFAQs(post.content || "");
  const [firstHalf, secondHalf] = splitContentAtMidpoint(post.content || "");
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
        {/* Hero */}
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
            </div>
          </Container>
        </div>

        {/* Quick Answer Box — Featured Snippet target */}
        {quickAnswer && (
          <div className="bg-gray-50 border-b border-gray-100">
            <Container className="py-8">
              <div className="bg-white border-l-4 border-primary rounded-r-2xl p-6 shadow-sm max-w-3xl">
                <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">Quick Answer</p>
                <p className="text-gray-700 leading-relaxed font-medium">{quickAnswer}</p>
              </div>
            </Container>
          </div>
        )}

        {/* Content Section */}
        <Section className="pb-32 pt-12">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">

              {/* Main Column */}
              <div className="lg:col-span-8">

                {/* First half of content */}
                <div className="rich-text-content">
                  <p className="mb-6 leading-relaxed text-gray-600 text-lg md:text-xl font-medium"
                    dangerouslySetInnerHTML={{ __html: firstHalfHtml }} />
                </div>

                {/* Inline CTA — mid-article */}
                <div className="my-12 p-8 bg-primary/5 border border-primary/20 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-primary mb-1">Elite Steel Concepts</p>
                    <p className="font-black text-secondary text-lg leading-tight">
                      12+ years · 350+ custom builds · 100% health code compliant
                    </p>
                    <p className="text-sm text-gray-500 mt-1">Manassas Park, VA · Serving DMV & Nationwide</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                    <a
                      href="tel:+15716510337"
                      className="inline-flex items-center gap-2 bg-primary hover:bg-orange-600 text-white font-black uppercase tracking-wider text-xs px-6 py-3 rounded-sm transition-all whitespace-nowrap"
                    >
                      <Phone size={13} /> (571) 651-0337
                    </a>
                    <Link
                      href="/quote"
                      className="inline-flex items-center gap-2 border-2 border-secondary hover:bg-secondary hover:text-white text-secondary font-black uppercase tracking-wider text-xs px-6 py-3 rounded-sm transition-all whitespace-nowrap"
                    >
                      Free Quote <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>

                {/* Second half of content */}
                {secondHalf && (
                  <div className="rich-text-content">
                    <p className="mb-6 leading-relaxed text-gray-600"
                      dangerouslySetInnerHTML={{ __html: secondHalfHtml }} />
                  </div>
                )}

                {/* FAQ Section — rendered from extracted FAQs */}
                {faqs.length > 0 && (
                  <div className="mt-16 border-t border-gray-100 pt-12">
                    <h2 className="text-2xl font-black uppercase text-secondary tracking-tight mb-8">
                      Frequently Asked Questions
                    </h2>
                    <div className="space-y-4">
                      {faqs.map((faq, i) => (
                        <details key={i} className="group bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
                          <summary className="flex items-center justify-between p-5 cursor-pointer font-bold text-secondary hover:text-primary transition-colors list-none text-sm">
                            <span>{faq.question}</span>
                            <span className="ml-4 shrink-0 text-primary font-black transition-transform group-open:rotate-45">+</span>
                          </summary>
                          <div className="px-5 pb-5 text-gray-600 leading-relaxed text-sm">{faq.answer}</div>
                        </details>
                      ))}
                    </div>
                  </div>
                )}

                {/* Bottom CTA */}
                <div className="mt-16 p-10 bg-secondary rounded-[40px] text-white shadow-2xl relative overflow-hidden">
                  <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                    <div>
                      <h4 className="text-2xl font-black uppercase tracking-tight mb-2">Ready to Build Your Food Truck?</h4>
                      <p className="text-gray-400 text-sm font-medium mb-3">
                        Elite Steel Concepts · 12+ years · 350+ builds · Manassas Park, VA
                      </p>
                      <a href="tel:+15716510337" className="inline-flex items-center gap-2 text-primary font-black text-sm hover:text-white transition-colors">
                        <Phone size={14} /> (571) 651-0337
                      </a>
                    </div>
                    <Link
                      href="/quote"
                      className="shrink-0 bg-primary text-white px-10 py-5 rounded-full font-black uppercase text-xs tracking-widest hover:scale-105 transition-all shadow-xl hover:bg-orange-600"
                    >
                      Get a Free Quote
                    </Link>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-4 space-y-12">
                <div className="sticky top-32">

                  {/* Sidebar CTA */}
                  <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 mb-10">
                    <p className="text-xs font-black uppercase tracking-widest text-primary mb-3">Get Started Today</p>
                    <p className="font-black text-secondary text-sm leading-tight mb-4">
                      Free design consultation from Elite Steel Concepts
                    </p>
                    <a
                      href="tel:+15716510337"
                      className="flex items-center gap-2 bg-primary hover:bg-orange-600 text-white font-black uppercase tracking-wider text-xs px-5 py-3 rounded-sm transition-all mb-3 justify-center"
                    >
                      <Phone size={13} /> (571) 651-0337
                    </a>
                    <Link
                      href="/quote"
                      className="flex items-center gap-2 border-2 border-secondary hover:bg-secondary hover:text-white text-secondary font-black uppercase tracking-wider text-xs px-5 py-3 rounded-sm transition-all justify-center"
                    >
                      Free Quote <ArrowRight size={13} />
                    </Link>
                  </div>

                  {/* Related Posts */}
                  <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-8 text-secondary border-b border-gray-100 pb-4">
                    Related Articles
                  </h3>
                  <div className="space-y-10">
                    {relatedPosts.map((related) => (
                      <Link key={related.id} href={`/blog/${related.slug}`} className="group block">
                        <div className="relative aspect-[16/10] rounded-[2rem] overflow-hidden mb-4 shadow-md group-hover:shadow-2xl transition-all duration-500">
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
                        <h4 className="text-base font-black uppercase leading-tight text-secondary group-hover:text-primary transition-colors tracking-tight">
                          {related.title}
                        </h4>
                      </Link>
                    ))}
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
