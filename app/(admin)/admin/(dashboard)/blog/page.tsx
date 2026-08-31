import React from"react";
import Link from"next/link";
import Image from"next/image";
import {
 Plus,
 Edit,
 Trash2,
 Eye,
 Calendar,
 Clock,
 Tag,
 FileText,
 Zap,
 BarChart3,
 TrendingUp,
 Sparkles,
 ExternalLink,
 BookOpen,
 PenTool,
} from"lucide-react";
import { getPosts } from"@/lib/db";
import { deleteBlogPost } from"@/app/actions/blog";

export default async function AdminBlogPage() {
 const posts = await getPosts();
 const publishedCount = posts.filter((p) => p.status ==="Published").length;
 const draftCount = posts.filter((p) => p.status ==="Draft").length;
 const categories = Array.from(new Set(posts.map((p) => p.category)));

 return (
 <div className="space-y-8 pb-12">
 {/* ═══════ DASHBOARD HEADER ═══════ */}
 <div className="bg-admin-surface p-8 md:p-10 text-admin-text shadow-2xl relative overflow-hidden">
 <div className="absolute top-0 right-0 w-80 h-80 bg-primary/20 blur-[100px] -mr-40 -mt-40 -full" />
 <div className="absolute bottom-0 left-0 w-60 h-60 bg-primary/10 blur-[80px] -ml-30 -mb-30 -full" />

 <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
 <div className="space-y-3">
 <div className="flex items-center gap-3 bg-admin-surface/5 w-fit px-4 py-1.5 -full border border-white/10">
 <Zap size={12} className="text-primary" />
 <span className="text-[10px] font-black uppercase tracking-widest text-primary">
 Content Studio v2.0
 </span>
 </div>
 <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter flex items-center gap-4">
 <PenTool className="text-primary" size={36} />
 Blog Manager
 </h1>
 <p className="text-admin-muted max-w-lg text-sm font-light leading-relaxed">
 Create, manage, and publish industry-leading content. Build authority in the food truck and trailer fabrication space.
 </p>
 </div>

 <div className="flex gap-4 items-center flex-wrap">
 {/* Stats Cards */}
 <div className="flex gap-4 items-center bg-admin-surface/5 p-5 border border-white/10 backdrop-blur-md">
 <div className="text-center px-3">
 <div className="text-[9px] font-black uppercase text-admin-muted mb-0.5 tracking-widest">
 Total
 </div>
 <div className="text-3xl font-black text-admin-text">
 {posts.length}
 </div>
 </div>
 <div className="h-10 w-px bg-admin-surface/10" />
 <div className="text-center px-3">
 <div className="text-[9px] font-black uppercase text-admin-muted mb-0.5 tracking-widest">
 Live
 </div>
 <div className="text-3xl font-black text-green-400">
 {publishedCount}
 </div>
 </div>
 <div className="h-10 w-px bg-admin-surface/10" />
 <div className="text-center px-3">
 <div className="text-[9px] font-black uppercase text-admin-muted mb-0.5 tracking-widest">
 Drafts
 </div>
 <div className="text-3xl font-black text-amber-400">
 {draftCount}
 </div>
 </div>
 </div>

 {/* New Post CTA */}
 <Link
 href="/admin/blog/new"
 className="bg-primary text-admin-text px-8 py-4 font-black uppercase tracking-widest text-xs flex items-center gap-3 hover:bg-admin-surface transition-all shadow-xl active:scale-95"
 >
 <Plus size={18} />
 New Article
 </Link>
 </div>
 </div>
 </div>

 {/* ═══════ CATEGORY TAGS ═══════ */}
 {categories.length > 0 && (
 <div className="flex flex-wrap gap-2">
 <span className="bg-admin-surface text-admin-text px-5 py-2 -full text-[10px] font-black uppercase tracking-widest">
 All ({posts.length})
 </span>
 {categories.map((cat) => (
 <span
 key={cat}
 className="bg-admin-surface text-admin-muted border border-admin-border px-5 py-2 -full text-[10px] font-black uppercase tracking-widest hover:border-primary hover:text-primary transition-all cursor-pointer"
 >
 {cat} ({posts.filter((p) => p.category === cat).length})
 </span>
 ))}
 </div>
 )}

 {/* ═══════ POSTS LIST ═══════ */}
 {posts.length === 0 ? (
 <div className="bg-admin-surface border border-admin-border shadow-sm p-16 text-center">
 <div className="w-20 h-20 bg-admin-bg flex items-center justify-center mx-auto mb-6">
 <BookOpen size={32} className="text-gray-300" />
 </div>
 <h3 className="text-2xl font-black uppercase text-admin-text tracking-tight mb-2">
 No Articles Yet
 </h3>
 <p className="text-admin-muted text-sm font-medium mb-8 max-w-md mx-auto">
 Start building your content library. Create insightful articles about the food truck industry to drive traffic and build authority.
 </p>
 <Link
 href="/admin/blog/new"
 className="inline-flex items-center gap-3 bg-admin-surface text-admin-text px-8 py-4 -full font-black uppercase tracking-widest text-xs hover:bg-primary hover:text-admin-text transition-all shadow-xl"
 >
 <Plus size={16} />
 Create Your First Article
 </Link>
 </div>
 ) : (
 <div className="space-y-4">
 {posts.map((post) => (
 <div
 key={post.id}
 className="bg-admin-surface border border-admin-border shadow-sm hover:shadow-xl transition-all group overflow-hidden"
 >
 <div className="flex flex-col md:flex-row">
 {/* Thumbnail */}
 <div className="md:w-56 lg:w-72 relative aspect-video md:aspect-auto shrink-0">
 <Image
 src={post.image}
 alt={post.imageAlt || post.title}
 fill
 className="object-cover group-hover:scale-105 transition-transform duration-700"
 />
 <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20 hidden md:block" />
 <div className="absolute top-4 left-4">
 <span
 className={`px-3 py-1.5 -full text-[9px] font-black uppercase tracking-widest shadow-md ${
 post.status ==="Published"
 ?"bg-green-500 text-admin-text"
 :"bg-amber-400 text-amber-900"
 }`}
 >
 {post.status ==="Published" ?"● Live" :"◌ Draft"}
 </span>
 </div>
 </div>

 {/* Content */}
 <div className="flex-1 p-6 md:p-8 flex flex-col justify-between min-w-0">
 <div>
 <div className="flex flex-wrap items-center gap-3 mb-3">
 <span className="bg-admin-surface/5 text-admin-text px-3 py-1 -full text-[9px] font-black uppercase tracking-widest border border-secondary/10">
 {post.category}
 </span>
 <div className="flex items-center gap-1.5 text-[10px] font-bold text-admin-muted uppercase tracking-wider">
 <Calendar size={10} />
 {post.date}
 </div>
 <div className="flex items-center gap-1.5 text-[10px] font-bold text-admin-muted uppercase tracking-wider">
 <Clock size={10} />
 {post.readTime}
 </div>
 </div>

 <h3 className="text-lg md:text-xl font-black uppercase text-admin-text tracking-tight mb-2 line-clamp-1 group-hover:text-primary transition-colors">
 {post.title}
 </h3>

 {post.subtitle && (
 <p className="text-sm text-admin-muted font-medium mb-2 line-clamp-1 italic">
 {post.subtitle}
 </p>
 )}

 <p className="text-sm text-admin-muted font-medium line-clamp-2 leading-relaxed">
 {post.excerpt}
 </p>

 {/* Tags */}
 {post.tags && post.tags.length > 0 && (
 <div className="flex flex-wrap gap-1.5 mt-3">
 {post.tags.slice(0, 4).map((tag, i) => (
 <span
 key={i}
 className="text-[8px] font-bold uppercase tracking-widest bg-admin-bg text-admin-muted px-2 py-1 border border-admin-border"
 >
 #{tag}
 </span>
 ))}
 {post.tags.length > 4 && (
 <span className="text-[8px] font-bold text-admin-muted">
 +{post.tags.length - 4} more
 </span>
 )}
 </div>
 )}
 </div>

 {/* Actions */}
 <div className="flex items-center gap-2 mt-4 pt-4 border-t border-admin-border-hover">
 <Link
 href={`/blog/${post.slug}`}
 target="_blank"
 className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-admin-muted hover:text-primary transition-colors bg-admin-bg px-4 py-2.5"
 >
 <Eye size={12} />
 Preview
 </Link>
 <Link
 href={`/admin/blog/edit/${post.id}`}
 className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-admin-muted hover:text-blue-600 transition-colors bg-admin-bg px-4 py-2.5"
 >
 <Edit size={12} />
 Edit
 </Link>
 <form action={deleteBlogPost.bind(null, post.id)}>
 <button
 type="submit"
 className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-admin-muted hover:text-red-500 transition-colors bg-admin-bg px-4 py-2.5"
 >
 <Trash2 size={12} />
 Delete
 </button>
 </form>
 <div className="flex-1" />
 <span className="text-[9px] font-mono text-gray-300">
 /{post.slug}
 </span>
 </div>
 </div>
 </div>
 </div>
 ))}
 </div>
 )}

 {/* ═══════ CONTENT TIPS CARD ═══════ */}
 <div className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/10 p-8 md:p-10">
 <div className="flex flex-col md:flex-row items-start gap-8">
 <div className="w-14 h-14 bg-primary/20 flex items-center justify-center shrink-0">
 <Sparkles size={24} className="text-primary" />
 </div>
 <div className="flex-1">
 <h3 className="text-lg font-black uppercase text-admin-text tracking-tight mb-2">
 Content Best Practices
 </h3>
 <p className="text-sm text-admin-muted font-medium mb-4">
 Tips for writing high-performing blog posts that rank and convert.
 </p>
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
 {[
 {
 tip:"Use H2 & H3 headings to structure your content for both readers and search engines",
 icon:"📝",
 },
 {
 tip:"Include internal links to your services and contact page to guide readers toward conversion",
 icon:"🔗",
 },
 {
 tip:"Add images with descriptive ALT text for better SEO and visual engagement in every post",
 icon:"📸",
 },
 {
 tip:"Write compelling meta descriptions (150-160 chars) that encourage clicks from search results",
 icon:"🎯",
 },
 {
 tip:"Target long-tail keywords relevant to the food truck industry in each article",
 icon:"🔍",
 },
 {
 tip:"End every post with a clear call-to-action to drive leads and engagement",
 icon:"💡",
 },
 ].map((item, i) => (
 <div
 key={i}
 className="bg-admin-surface/60 p-4 border border-primary/5"
 >
 <span className="text-lg mb-2 block">{item.icon}</span>
 <p className="text-[11px] font-bold text-admin-muted leading-relaxed">
 {item.tip}
 </p>
 </div>
 ))}
 </div>
 </div>
 </div>
 </div>
 </div>
 );
}
