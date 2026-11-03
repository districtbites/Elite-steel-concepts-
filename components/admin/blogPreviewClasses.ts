import type { BlogMarkdownClasses } from "@/lib/blogMarkdown";
import type { FaqClasses } from "@/lib/blogFaq";
import { ADMIN_TABLE_CLASSES } from "@/components/admin/TableBuilderModal";

/** Admin preview styling of a FAQ block (mirrors the public "FAQ" accordion). */
export const ADMIN_FAQ_CLASSES: FaqClasses = {
    wrapper: "my-10 border-t-[3px] border-admin-text pt-8",
    title: "text-2xl font-black uppercase text-admin-text tracking-tighter mb-6",
    list: "space-y-px bg-admin-border border border-admin-border",
    item: "group bg-admin-surface",
    summary: "flex items-center justify-between p-5 cursor-pointer font-bold text-admin-text hover:text-primary transition-colors list-none border-l-2 border-transparent group-open:border-primary",
    icon: "ml-4 shrink-0 text-primary font-black transition-transform group-open:rotate-45 text-xl leading-none",
    answer: "px-5 pb-5 text-admin-muted leading-relaxed text-sm",
    link: "text-primary font-bold underline",
    strong: "font-black text-admin-text"
};

// Same renderer as the public article (admin colours), so the preview matches the live page
export const ADMIN_PREVIEW_CLASSES: BlogMarkdownClasses = {
    h2: "text-2xl font-black uppercase text-admin-text mt-12 mb-6 border-l-[3px] border-primary pl-4 leading-tight",
    h3: "text-xl font-black uppercase text-admin-text mt-8 mb-4",
    h4: "text-lg font-black uppercase text-admin-text mt-6 mb-3",
    p: "text-admin-muted leading-relaxed mb-6",
    ul: "mb-6",
    li: "flex items-start gap-3 mb-2",
    bullet: "w-1 h-1 bg-primary mt-2.5 shrink-0",
    liText: "text-admin-muted",
    ol: "mb-6 pl-6 list-decimal space-y-2 marker:text-primary marker:font-black",
    olLi: "pl-2 text-admin-muted",
    blockquote: "border-l-4 border-primary pl-4 py-2 my-6 italic text-admin-muted bg-admin-bg",
    hr: "my-10 border-admin-border",
    link: "text-primary font-bold underline hover:text-orange-600",
    strong: "font-black text-admin-text",
    em: "italic",
    figure: "block my-8 border border-admin-border overflow-hidden",
    img: "w-full object-cover",
    caption: "block text-[9px] font-black uppercase tracking-[0.2em] text-admin-muted p-3 text-center bg-admin-bg border-t border-admin-border",
    table: ADMIN_TABLE_CLASSES,
    faq: ADMIN_FAQ_CLASSES,
};
