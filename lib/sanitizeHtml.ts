/**
 * Small allow-list HTML sanitizer for admin-authored rich text.
 * Keeps basic formatting tags and safe link/image attributes; drops everything else
 * (script/style/iframe content, event handlers, inline styles, javascript: URLs).
 */

const ALLOWED_TAGS = new Set([
    "p", "br", "strong", "b", "em", "i", "u", "s", "h2", "h3", "h4", "ul", "ol", "li",
    "a", "blockquote", "hr", "span", "img", "table", "thead", "tbody", "tr", "th", "td"
]);
const ALLOWED_ATTRS: Record<string, string[]> = {
    a: ["href", "title", "target", "rel"],
    img: ["src", "alt", "width", "height"],
    th: ["colspan", "rowspan"],
    td: ["colspan", "rowspan"]
};
const DROP_WITH_CONTENT = /<(script|style|iframe|object|embed|noscript|template|svg|math)\b[\s\S]*?<\/\1\s*>/gi;
const SAFE_URL = /^(https?:|mailto:|tel:|\/|#)/i;

const escapeAttr = (v: string) => v.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function sanitizeHtml(input: string): string {
    const html = (input || "").replace(/<!--[\s\S]*?-->/g, "").replace(DROP_WITH_CONTENT, "");

    // Rebuilt tags are parked as placeholders so any stray "<" / ">" left in the text can be escaped.
    const kept: string[] = [];
    const park = (tag: string) => `\u0000${kept.push(tag) - 1}\u0000`;

    const parked = html.replace(/\u0000/g, "").replace(/<\/?([a-zA-Z][a-zA-Z0-9]*)\b([^>]*)>/g, (tag, rawName: string, rawAttrs: string) => {
        const name = rawName.toLowerCase();
        if (!ALLOWED_TAGS.has(name)) return "";
        if (tag.startsWith("</")) return park(`</${name}>`);

        const allowed = ALLOWED_ATTRS[name] || [];
        const attrs: string[] = [];
        const attrRe = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)\s*(?:=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
        let m: RegExpExecArray | null;
        while ((m = attrRe.exec(rawAttrs))) {
            const attr = m[1].toLowerCase();
            const value = (m[2] ?? m[3] ?? m[4] ?? "").trim();
            if (!allowed.includes(attr)) continue;
            if ((attr === "href" || attr === "src") && !SAFE_URL.test(value.replace(/[\s\u0000-\u001f]/g, ""))) continue;
            attrs.push(`${attr}="${escapeAttr(value)}"`);
        }
        if (name === "a" && attrs.some(a => a.startsWith('target="_blank"')) && !attrs.some(a => a.startsWith("rel="))) {
            attrs.push('rel="noopener noreferrer"');
        }
        return park(`<${name}${attrs.length ? " " + attrs.join(" ") : ""}>`);
    });

    return parked
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\u0000(\d+)\u0000/g, (_, i) => kept[Number(i)]);
}

/** Plain text (no tags) becomes paragraphs; HTML is sanitized as-is. */
export function richTextToHtml(body: string): string {
    const text = (body || "").replace(/\r\n/g, "\n").trim();
    if (!text) return "";
    if (/<[a-z][\s\S]*>/i.test(text)) return sanitizeHtml(text);
    const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return text
        .split(/\n\s*\n/)
        .map(p => `<p>${esc(p.trim()).replace(/\n/g, "<br>")}</p>`)
        .join("");
}
