import React from "react";
import Link from "next/link";
import {
    ArrowRight, Check, Plus, Star, Quote,
    Wrench, Shield, Truck, Flame, Zap, Award, CheckCircle2, Clock, Ruler, Settings, Users, MapPin,
    Hammer, ChefHat, Utensils, Droplets, Snowflake, BadgeCheck, DollarSign, Phone, Sparkles, Package, Layers,
    type LucideIcon
} from "lucide-react";
import Container from "@/components/ui/Container";
import type { CustomBlock, BlockTheme } from "@/lib/pageContent/blocks";
import { richTextToHtml } from "@/lib/sanitizeHtml";

/**
 * Renders the modular blocks an admin added in Page Content → page builder.
 * One renderer per block type; every block follows the site's black / orange / white style.
 */

const ICONS: Record<string, LucideIcon> = {
    Wrench, Shield, Truck, Flame, Zap, Award, CheckCircle2, Clock, Ruler, Settings, Users, MapPin, Star,
    Hammer, ChefHat, Utensils, Droplets, Snowflake, BadgeCheck, DollarSign, Phone, Sparkles, Package, Layers
};

const THEME: Record<BlockTheme, { section: string; title: string; text: string; card: string; border: string }> = {
    dark: { section: "bg-[#0a0a0a] text-white", title: "text-white", text: "text-gray-400", card: "bg-[#111] border-[#1f1f1f]", border: "border-[#1a1a1a]" },
    light: { section: "bg-white text-black", title: "text-black", text: "text-gray-600", card: "bg-white border-gray-200", border: "border-gray-100" },
    muted: { section: "bg-light text-black", title: "text-black", text: "text-gray-600", card: "bg-white border-gray-200", border: "border-gray-200" }
};

const GRID_COLS: Record<number, string> = {
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-2 lg:grid-cols-3",
    4: "sm:grid-cols-2 lg:grid-cols-4"
};

const isExternal = (href: string) => /^https?:\/\//i.test(href);
const isSafeHref = (href: string) => /^(https?:\/\/|\/|#|mailto:|tel:)/i.test(href.trim());

function SmartLink({ href, className, children }: { href: string; className: string; children: React.ReactNode }) {
    if (!isSafeHref(href)) return null;
    if (isExternal(href)) {
        return <a href={href} target="_blank" rel="noopener noreferrer" className={className}>{children}</a>;
    }
    return <Link href={href} className={className}>{children}</Link>;
}

function Ctas({ block, dark, center }: { block: CustomBlock; dark: boolean; center?: boolean }) {
    const primary = block.primaryCtaText && block.primaryCtaLink;
    const secondary = block.secondaryCtaText && block.secondaryCtaLink;
    if (!primary && !secondary) return null;
    return (
        <div className={`flex flex-col sm:flex-row gap-4 mt-8 ${center ? "items-center justify-center" : "items-stretch sm:items-center"}`}>
            {primary && (
                <SmartLink
                    href={block.primaryCtaLink}
                    className="group inline-flex items-center justify-center gap-2 bg-primary hover:bg-orange-600 text-black hover:text-white font-black uppercase tracking-[0.2em] text-[10px] px-8 py-4 transition-colors"
                >
                    {block.primaryCtaText}
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </SmartLink>
            )}
            {secondary && (
                <SmartLink
                    href={block.secondaryCtaLink}
                    className={`inline-flex items-center justify-center gap-2 border-2 font-black uppercase tracking-[0.2em] text-[10px] px-8 py-3.5 transition-colors ${
                        dark ? "border-white/30 text-white hover:bg-white hover:text-black" : "border-black text-black hover:bg-black hover:text-white"
                    }`}
                >
                    {block.secondaryCtaText}
                </SmartLink>
            )}
        </div>
    );
}

function Heading({ block, center = true }: { block: CustomBlock; center?: boolean }) {
    const t = THEME[block.theme];
    if (!block.eyebrow && !block.title && !block.subtitle) return null;
    return (
        <div className={`${center ? "text-center mx-auto" : ""} max-w-3xl mb-12`}>
            {block.eyebrow && (
                <div className={`flex items-center gap-3 mb-4 ${center ? "justify-center" : ""}`}>
                    <div className="h-px w-8 bg-primary" />
                    <span className="text-primary text-xs font-black uppercase tracking-[0.25em]">{block.eyebrow}</span>
                    {center && <div className="h-px w-8 bg-primary" />}
                </div>
            )}
            {block.title && (
                <h2 className={`text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tight leading-tight ${t.title}`}>{block.title}</h2>
            )}
            {block.subtitle && <p className={`mt-5 text-base md:text-lg leading-relaxed ${t.text}`}>{block.subtitle}</p>}
        </div>
    );
}

function Features({ block }: { block: CustomBlock }) {
    const t = THEME[block.theme];
    return (
        <>
            <Heading block={block} />
            <div className={`grid grid-cols-1 ${GRID_COLS[block.columns]} gap-6`}>
                {block.items.map((item, i) => {
                    const Icon = ICONS[item.icon || ""] || CheckCircle2;
                    return (
                        <div key={i} className={`group relative border p-8 transition-colors hover:border-primary ${t.card}`}>
                            <div className="absolute top-0 left-0 h-1 w-0 bg-primary group-hover:w-full transition-all duration-500" />
                            <div className="size-12 bg-primary/10 border border-primary/30 group-hover:bg-primary flex items-center justify-center mb-6 transition-colors">
                                <Icon size={22} className="text-primary group-hover:text-white transition-colors" />
                            </div>
                            {item.title && <h3 className={`text-lg font-black uppercase tracking-tight mb-3 ${t.title}`}>{item.title}</h3>}
                            {item.description && <p className={`text-sm leading-relaxed ${t.text}`}>{item.description}</p>}
                        </div>
                    );
                })}
            </div>
            <Ctas block={block} dark={block.theme === "dark"} center />
        </>
    );
}

function Stats({ block }: { block: CustomBlock }) {
    const t = THEME[block.theme];
    const dark = block.theme === "dark";
    return (
        <>
            <Heading block={block} />
            <div className={`grid grid-cols-2 ${block.columns === 2 ? "" : block.columns === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4"} gap-px ${dark ? "bg-[#1a1a1a]" : "bg-gray-200"} border ${t.border}`}>
                {block.items.map((item, i) => (
                    <div key={i} className={`${dark ? "bg-[#0a0a0a]" : "bg-white"} p-6 md:p-8 text-center`}>
                        <div className="text-3xl md:text-4xl font-black text-primary mb-1">{item.value}</div>
                        <div className={`text-xs font-black uppercase tracking-wider mb-1 ${t.title}`}>{item.label}</div>
                        {item.description && <div className="text-[10px] text-gray-500 uppercase tracking-widest">{item.description}</div>}
                    </div>
                ))}
            </div>
        </>
    );
}

function Split({ block }: { block: CustomBlock }) {
    const t = THEME[block.theme];
    const bullets = block.items.filter(i => i.text);
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {block.imageUrl && (
                <div className={`relative ${block.imagePosition === "right" ? "lg:order-2" : ""}`}>
                    <div className="absolute -top-3 -left-3 w-24 h-24 border-t-4 border-l-4 border-primary pointer-events-none" />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={block.imageUrl} alt={block.imageAlt || block.title} loading="lazy" className="relative w-full aspect-[4/3] object-cover" />
                </div>
            )}
            <div className={block.imageUrl ? "" : "lg:col-span-2 max-w-3xl"}>
                <Heading block={{ ...block, subtitle: "" }} center={false} />
                {block.body && (
                    <div className={`-mt-6 text-base md:text-lg leading-relaxed space-y-4 ${t.text}`} dangerouslySetInnerHTML={{ __html: richTextToHtml(block.body) }} />
                )}
                {bullets.length > 0 && (
                    <ul className="mt-6 space-y-3">
                        {bullets.map((b, i) => (
                            <li key={i} className={`flex items-start gap-3 text-sm font-bold ${t.title}`}>
                                <span className="mt-0.5 size-5 shrink-0 bg-primary flex items-center justify-center"><Check size={12} strokeWidth={3} className="text-black" /></span>
                                {b.text}
                            </li>
                        ))}
                    </ul>
                )}
                <Ctas block={block} dark={block.theme === "dark"} />
            </div>
        </div>
    );
}

function Cta({ block }: { block: CustomBlock }) {
    const t = THEME[block.theme];
    return (
        <div className="relative text-center max-w-4xl mx-auto">
            {block.eyebrow && <span className="text-primary text-xs font-black uppercase tracking-[0.25em] block mb-4">{block.eyebrow}</span>}
            {block.title && <h2 className={`text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none mb-4 ${t.title}`}>{block.title}</h2>}
            {block.subtitle && <p className={`text-sm md:text-base max-w-2xl mx-auto leading-relaxed ${t.text}`}>{block.subtitle}</p>}
            <Ctas block={block} dark={block.theme === "dark"} center />
        </div>
    );
}

function Faqs({ block }: { block: CustomBlock }) {
    const t = THEME[block.theme];
    const faqs = block.items.filter(i => i.question);
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map(f => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer || "" } }))
    };
    return (
        <>
            <Heading block={block} />
            <div className="max-w-3xl mx-auto space-y-3">
                {faqs.map((f, i) => (
                    <details key={i} className={`group border transition-colors open:border-primary/40 ${t.card}`} open={i === 0}>
                        <summary className="flex items-center justify-between gap-4 p-5 md:p-6 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                            <span className={`text-base md:text-lg font-bold ${t.title}`}>{f.question}</span>
                            <span className="shrink-0 size-8 flex items-center justify-center bg-primary/10 text-primary group-open:bg-primary group-open:text-black group-open:rotate-45 transition-all">
                                <Plus size={18} />
                            </span>
                        </summary>
                        <div className={`px-5 md:px-6 pb-6 leading-relaxed whitespace-pre-line ${t.text}`}>{f.answer}</div>
                    </details>
                ))}
            </div>
            {faqs.length > 0 && (
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
            )}
        </>
    );
}

function Testimonials({ block }: { block: CustomBlock }) {
    const t = THEME[block.theme];
    return (
        <>
            <Heading block={block} />
            <div className={`grid grid-cols-1 ${GRID_COLS[block.columns]} gap-6`}>
                {block.items.filter(i => i.quote).map((item, i) => (
                    <figure key={i} className={`relative border p-8 flex flex-col ${t.card}`}>
                        <Quote size={32} className="text-primary/30 mb-4" />
                        {item.rating ? (
                            <div className="flex gap-1 mb-4" aria-label={`${item.rating} out of 5 stars`}>
                                {Array.from({ length: 5 }, (_, s) => (
                                    <Star key={s} size={14} className={s < item.rating! ? "fill-primary text-primary" : "text-gray-300"} />
                                ))}
                            </div>
                        ) : null}
                        <blockquote className={`flex-1 text-base leading-relaxed italic ${t.text}`}>&ldquo;{item.quote}&rdquo;</blockquote>
                        <figcaption className="mt-6 pt-6 border-t border-current/10">
                            <div className={`text-sm font-black uppercase tracking-wider ${t.title}`}>{item.author}</div>
                            {item.role && <div className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">{item.role}</div>}
                        </figcaption>
                    </figure>
                ))}
            </div>
        </>
    );
}

function HeroBanner({ block }: { block: CustomBlock }) {
    return (
        <div className="relative z-10 max-w-3xl">
            {block.eyebrow && (
                <div className="flex items-center gap-3 mb-5">
                    <div className="h-px w-12 bg-primary" />
                    <span className="text-primary text-xs font-black uppercase tracking-[0.25em]">{block.eyebrow}</span>
                </div>
            )}
            {block.title && <h2 className="text-4xl md:text-6xl font-black uppercase text-white tracking-tighter leading-[0.95]">{block.title}</h2>}
            {block.subtitle && <p className="mt-6 text-base md:text-lg text-gray-300 leading-relaxed max-w-2xl">{block.subtitle}</p>}
            <Ctas block={block} dark />
        </div>
    );
}

function RichText({ block }: { block: CustomBlock }) {
    const t = THEME[block.theme];
    const dark = block.theme === "dark";
    return (
        <div className="max-w-3xl mx-auto">
            <Heading block={block} center={false} />
            <div
                className={`space-y-4 text-base md:text-lg leading-relaxed ${t.text}
                    [&_h2]:text-2xl [&_h2]:font-black [&_h2]:uppercase [&_h2]:tracking-tight [&_h2]:mt-8 ${dark ? "[&_h2]:text-white [&_h3]:text-white" : "[&_h2]:text-black [&_h3]:text-black"}
                    [&_h3]:text-xl [&_h3]:font-black [&_h3]:mt-6 [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-6 [&_ol]:pl-6 [&_li]:mt-1
                    [&_a]:text-primary [&_a]:font-bold [&_a]:underline [&_a]:underline-offset-4 [&_strong]:font-bold
                    [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:pl-4 [&_blockquote]:italic [&_img]:w-full`}
                dangerouslySetInnerHTML={{ __html: richTextToHtml(block.body) }}
            />
        </div>
    );
}

function BlockBody({ block }: { block: CustomBlock }) {
    switch (block.type) {
        case "features": return <Features block={block} />;
        case "stats": return <Stats block={block} />;
        case "split": return <Split block={block} />;
        case "cta": return <Cta block={block} />;
        case "faqs": return <Faqs block={block} />;
        case "testimonials": return <Testimonials block={block} />;
        case "hero_banner": return <HeroBanner block={block} />;
        case "rich_text": return <RichText block={block} />;
    }
}

export default function CustomSections({ blocks }: { blocks: CustomBlock[] }) {
    if (!blocks.length) return null;
    return (
        <>
            {blocks.map(block => {
                if (block.type === "hero_banner") {
                    return (
                        <section key={block.id} id={block.id} className="relative bg-[#0a0a0a] overflow-hidden py-24 md:py-32">
                            {block.imageUrl && (
                                <>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={block.imageUrl} alt={block.imageAlt || ""} loading="lazy" className="absolute inset-0 w-full h-full object-cover opacity-40" />
                                    <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
                                </>
                            )}
                            <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                            <Container className="relative"><BlockBody block={block} /></Container>
                        </section>
                    );
                }
                const t = THEME[block.theme];
                return (
                    <section key={block.id} id={block.id} className={`relative py-16 md:py-24 border-t ${t.section} ${t.border}`}>
                        <Container><BlockBody block={block} /></Container>
                    </section>
                );
            })}
        </>
    );
}
