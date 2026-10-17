const SITE_HOST = /^(?:www\.)?esteelconcepts\.com$/i;

/**
 * Cleans an internal link target typed into the admin or a post:
 * "/https://www.esteelconcepts.com/services" → "/services", "/Process" → "/process".
 * External URLs, anchors, mailto: and tel: links are returned unchanged.
 */
export function normalizeInternalTarget(url: string): string {
    let target = (url || "").trim();
    if (/^\/+https?:\/?\/?/i.test(target)) target = target.replace(/^\/+/, "").replace(/^(https?:)\/*/i, "$1//");
    if (/^https?:\/\//i.test(target)) {
        try {
            const parsed = new URL(target);
            if (!SITE_HOST.test(parsed.hostname)) return target;
            target = parsed.pathname + parsed.search + parsed.hash;
        } catch {
            return target;
        }
    }
    if (!target.startsWith("/")) return target;
    const cut = target.search(/[?#]/);
    return cut === -1 ? target.toLowerCase() : target.slice(0, cut).toLowerCase() + target.slice(cut);
}
