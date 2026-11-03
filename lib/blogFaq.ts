/**
 * FAQ blocks inside blog markdown. Inserted by the editor's FAQ builder:
 *
 *   :::faq Frequently Asked Questions
 *   Q: How long does a build take?
 *   A: Most builds take 8–12 weeks.
 *
 *   Q: Do you deliver nationwide?
 *   A: Yes — we deliver anywhere in the US.
 *   :::
 *
 * Answers may span several lines and use the article's markdown: **bold**, [links](/url),
 * "- " bullet and "1. " numbered lists.
 * Shared by the public blog renderer, the admin preview and the FAQ builder.
 */

export interface FaqItem {
    question: string;
    answer: string;
}

export interface FaqBlock {
    title: string;
    items: FaqItem[];
}

export const DEFAULT_FAQ_TITLE = "Frequently Asked Questions";

const BLOCK_RE = /^:::faq[ \t]*(.*)\n([\s\S]*?)^:::[ \t]*$/gm;

/** Parses the inside of a block ("Q: …" / "A: …" lines). */
function parseItems(body: string): FaqItem[] {
    const items: FaqItem[] = [];
    let current: FaqItem | null = null;
    let inAnswer = false;
    for (const raw of body.split("\n")) {
        const line = raw.trimEnd();
        const q = /^Q:\s*(.*)$/i.exec(line.trim());
        const a = /^A:\s*(.*)$/i.exec(line.trim());
        if (q) {
            current = { question: q[1].trim(), answer: "" };
            items.push(current);
            inAnswer = false;
        } else if (a && current) {
            current.answer = a[1].trim();
            inAnswer = true;
        } else if (current && inAnswer) {
            current.answer += `\n${line.trim()}`;
        } else if (current && line.trim()) {
            current.question += ` ${line.trim()}`;
        }
    }
    return items
        .map(i => ({ question: i.question.trim(), answer: i.answer.replace(/\n{3,}/g, "\n\n").trim() }))
        .filter(i => i.question);
}

/** Every FAQ block with its character range. Expects "\n" line endings. */
export function findFaqBlocks(text: string): { start: number; end: number; block: FaqBlock }[] {
    const out: { start: number; end: number; block: FaqBlock }[] = [];
    for (const m of text.matchAll(BLOCK_RE)) {
        out.push({
            start: m.index!,
            end: m.index! + m[0].length,
            block: { title: m[1].trim(), items: parseItems(m[2]) }
        });
    }
    return out;
}

/** The FAQ block containing `offset`, if any (used to edit an existing block). */
export function findFaqBlockAt(text: string, offset: number) {
    return findFaqBlocks(text).find(b => offset >= b.start && offset <= b.end) ?? null;
}

/** Markdown for a block. */
export function buildFaqBlock({ title, items }: FaqBlock): string {
    const body = items
        .filter(i => i.question.trim())
        .map(i => `Q: ${i.question.replace(/\s*\n\s*/g, " ").trim()}\nA: ${i.answer.replace(/\r\n?/g, "\n").replace(/\n{2,}/g, "\n").trim()}`)
        .join("\n\n");
    return `:::faq ${title.trim() || DEFAULT_FAQ_TITLE}\n${body}\n:::`;
}

/** Replaces every block with `toHtml(block)`; other text is untouched. */
export function replaceFaqBlocks(text: string, toHtml: (block: FaqBlock, index: number) => string): string {
    let i = 0;
    return text.replace(BLOCK_RE, (_m, title: string, body: string) => toHtml({ title: title.trim(), items: parseItems(body) }, i++));
}

/** Answer text without markdown (for FAQPage schema). */
export const plainAnswer = (answer: string) =>
    answer.replace(/^\s*(?:[-*+]|\d{1,4}[.)])\s+/gm, "").replace(/\[(.*?)\]\((.*?)\)/g, "$1").replace(/\*\*(.+?)\*\*/g, "$1").replace(/\s*\n\s*/g, " ").trim();

const escapeHtml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export interface FaqClasses {
    wrapper: string;
    title: string;
    list: string;
    item: string;
    summary: string;
    icon: string;
    answer: string;
    link: string;
    strong: string;
}

/**
 * Renders a block as single-line HTML (so later markdown passes leave it intact).
 * Questions/answers are escaped; answers keep **bold**, [links](/url) and line breaks.
 * Items share `group` as their <details name>, so opening one closes the others.
 * `renderAnswer` renders the answer markdown instead (lists etc.); it must return safe HTML.
 */
export function renderFaqHtml(
    block: FaqBlock,
    cls: FaqClasses,
    linkHref: (href: string) => string = h => h,
    group = "faq",
    renderAnswer?: (markdown: string) => string
): string {
    const inline = (s: string) =>
        escapeHtml(s)
            .replace(/\*\*(.+?)\*\*/g, `<strong class="${cls.strong}">$1</strong>`)
            .replace(/\[(.+?)\]\((.+?)\)/g, (_m, text: string, href: string) => {
                const target = linkHref(href.replace(/&amp;/g, "&"));
                return /^(https?:|\/|#|mailto:|tel:)/i.test(target) ? `<a href="${escapeHtml(target)}" class="${cls.link}">${text}</a>` : text;
            })
            .replace(/\n/g, "<br />");
    const items = block.items
        .map(
            i =>
                `<details name="${escapeHtml(group)}" class="${cls.item}"><summary class="${cls.summary}"><span>${inline(i.question)}</span><span class="${cls.icon}">+</span></summary><div class="${cls.answer}">${renderAnswer ? renderAnswer(i.answer) : inline(i.answer)}</div></details>`
        )
        .join("");
    const title = block.title ? `<h2 class="${cls.title}">${escapeHtml(block.title)}</h2>` : "";
    return `<div class="${cls.wrapper}">${title}<div class="${cls.list}">${items}</div></div>`;
}
