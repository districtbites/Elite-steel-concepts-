/**
 * Blog markdown → HTML. One renderer for the public article and the admin editor
 * preview, so what the editor shows is exactly what the site shows (only the
 * classes differ).
 *
 * Supports: ## / ### / #### headings, paragraphs (single line breaks kept),
 * - / * bullet lists, 1. numbered lists, > quotes, --- dividers, images,
 * [links](/url), **bold**, *italic*, tables and :::faq blocks.
 */
import { renderTableHtml, replaceMarkdownTables, type MarkdownTable, type TableClasses } from "@/lib/markdownTable";
import { renderFaqHtml, replaceFaqBlocks, type FaqClasses } from "@/lib/blogFaq";

export interface BlogMarkdownClasses {
    h2: string;
    h3: string;
    h4: string;
    p: string;
    ul: string;
    li: string;
    bullet: string; // the square marker inside a bullet item
    liText: string;
    ol: string;
    olLi: string;
    blockquote: string;
    hr: string;
    link: string;
    strong: string;
    em: string;
    figure: string;
    img: string;
    caption?: string; // image alt shown under the image (omit to hide)
    table: TableClasses;
    faq: FaqClasses;
}

export interface BlogMarkdownOptions {
    /** Rewrites link targets (e.g. normalising internal URLs). */
    linkHref?: (href: string) => string;
    /** Alt text for images that have none. */
    fallbackAlt?: string;
    /** Renders a table cell's text (escaped HTML). */
    renderTableCell?: (text: string) => string;
    /** Raw HTML for a whole line, e.g. a placeholder token; null = normal markdown. */
    customBlock?: (line: string) => string | null;
}

const escapeHtml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const unescapeHtml = (s: string) => s.replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
const SAFE_HREF = /^(https?:|\/|#|mailto:|tel:)/i;

// Tables and FAQ blocks are rendered first and parked behind a token on their own line
const BLOCK_TOKEN = (i: number) => `\u0000${i}\u0000`;
const BLOCK_TOKEN_RE = /^\u0000(\d+)\u0000$/;

const IMAGE_RE = /!\[([^\]]*)\]\(([^)\s]+)(?:\s+&quot;[\s\S]*?&quot;)?\)/g;
const IMAGE_LINE_RE = /^!\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)$/;

export function renderBlogMarkdown(markdown: string, cls: BlogMarkdownClasses, opts: BlogMarkdownOptions = {}): string {
    if (!markdown) return "";
    const { linkHref = (h: string) => h, fallbackAlt = "", renderTableCell, customBlock } = opts;
    const stored: string[] = [];
    const park = (html: string) => `\n\n${BLOCK_TOKEN(stored.push(html) - 1)}\n\n`;

    let text = markdown.replace(/\r\n?/g, "\n");
    text = replaceFaqBlocks(text, (b, i) => park(renderFaqHtml(b, cls.faq, linkHref, `faq-${i}`)));
    text = replaceMarkdownTables(text, (t: MarkdownTable) => park(renderTableHtml(t, cls.table, renderTableCell)));

    const image = (alt: string, src: string) => {
        const target = linkHref(unescapeHtml(src));
        if (!SAFE_HREF.test(target)) return "";
        const altText = alt.trim() || escapeHtml(fallbackAlt);
        const caption = cls.caption && alt.trim() ? `<span class="${cls.caption}">${alt}</span>` : "";
        return `<span class="${cls.figure}"><img src="${escapeHtml(target)}" alt="${altText}" class="${cls.img}" loading="lazy" />${caption}</span>`;
    };

    const inline = (raw: string) =>
        escapeHtml(raw)
            .replace(IMAGE_RE, (_m, alt: string, src: string) => image(alt, src))
            .replace(/\[([^\]]+)\]\(([^)\s]+)(?:\s+&quot;[\s\S]*?&quot;)?\)/g, (_m, label: string, href: string) => {
                const target = linkHref(unescapeHtml(href));
                return SAFE_HREF.test(target) ? `<a href="${escapeHtml(target)}" class="${cls.link}">${label}</a>` : label;
            })
            .replace(/\*\*(.+?)\*\*/g, `<strong class="${cls.strong}">$1</strong>`)
            .replace(/(^|[^*\w])\*(?=\S)([^*]+?)\*(?!\*)/g, `$1<em class="${cls.em}">$2</em>`);

    const out: string[] = [];
    let para: string[] = [];
    let quote: string[] = [];
    let list: { kind: "ul" | "ol"; start: number; last: number; items: string[] } | null = null;

    const flushPara = () => {
        if (para.length) out.push(`<p class="${cls.p}">${para.map(inline).join("<br />")}</p>`);
        para = [];
    };
    const flushQuote = () => {
        if (quote.length) out.push(`<blockquote class="${cls.blockquote}">${quote.map(inline).join("<br />")}</blockquote>`);
        quote = [];
    };
    const flushList = () => {
        if (list) {
            out.push(
                list.kind === "ul"
                    ? `<ul class="${cls.ul}">${list.items.join("")}</ul>`
                    : `<ol class="${cls.ol}"${list.start !== 1 ? ` start="${list.start}"` : ""}>${list.items.join("")}</ol>`
            );
        }
        list = null;
    };
    const flushAll = () => {
        flushPara();
        flushQuote();
        flushList();
    };

    for (const rawLine of text.split("\n")) {
        const line = rawLine.trim();
        if (!line) {
            flushAll();
            continue;
        }

        const custom = customBlock?.(line);
        if (custom != null) {
            flushAll();
            out.push(custom);
            continue;
        }

        const token = BLOCK_TOKEN_RE.exec(line);
        if (token) {
            flushAll();
            out.push(stored[Number(token[1])] ?? "");
            continue;
        }

        const heading = /^(#{1,6})\s+(.+?)\s*#*$/.exec(line);
        if (heading) {
            flushAll();
            const level = heading[1].length;
            const tag = level <= 2 ? "h2" : level === 3 ? "h3" : "h4";
            out.push(`<${tag} class="${cls[tag]}">${inline(heading[2])}</${tag}>`);
            continue;
        }

        if (/^(-{3,}|\*{3,}|_{3,})$/.test(line)) {
            flushAll();
            out.push(`<hr class="${cls.hr}" />`);
            continue;
        }

        const img = IMAGE_LINE_RE.exec(line);
        if (img) {
            flushAll();
            out.push(image(escapeHtml(img[1]), escapeHtml(img[2])));
            continue;
        }

        const q = /^>\s?(.*)$/.exec(line);
        if (q) {
            flushPara();
            flushList();
            quote.push(q[1]);
            continue;
        }
        flushQuote();

        const bullet = /^[-*+]\s+(.+)$/.exec(line);
        if (bullet) {
            flushPara();
            if (list?.kind !== "ul") {
                flushList();
                list = { kind: "ul", start: 1, last: 0, items: [] };
            }
            list.items.push(`<li class="${cls.li}"><span class="${cls.bullet}"></span><span class="${cls.liText}">${inline(bullet[1])}</span></li>`);
            continue;
        }

        const numbered = /^(\d{1,4})[.)]\s+(.+)$/.exec(line);
        if (numbered) {
            flushPara();
            const n = Number(numbered[1]);
            // A number that doesn't continue the list (e.g. "1." again) starts a new one
            if (list?.kind !== "ol" || n <= list.last) {
                flushList();
                list = { kind: "ol", start: n, last: n - 1, items: [] };
            }
            list.last = n;
            list.items.push(`<li class="${cls.olLi}">${inline(numbered[2])}</li>`);
            continue;
        }

        flushList();
        para.push(line);
    }
    flushAll();
    return out.join("\n");
}
