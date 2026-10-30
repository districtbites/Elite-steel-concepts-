import type { BlogPost } from "./db";
import { normalizeInternalTarget } from "./linkTarget";

export { normalizeInternalTarget };

export interface InternalLinkRule {
    id: string;
    keyword: string;
    targetUrl: string;
    categoryFilter?: string; // "All" or specific category e.g. "Maintenance", "Business", "Guide"
    targetPostIds?: string[]; // when set (or targetPages), the rule ONLY runs on the selected targets
    targetPages?: string[];   // static page keys from the linkable page registry, e.g. "home", "location:arlington-va"
    placements?: LinkPlacement[]; // pin the link to specific keyword occurrences on a target
    maxPerPost?: number;     // max times this keyword links per post (default 1)
    priority?: number;       // higher priority rules get processed first (default 0)
    enabled: boolean;
    caseSensitive?: boolean;
    notes?: string;
    createdAt: string;
}

/**
 * Pins a rule to one occurrence of its keyword on a specific target.
 * Once a rule has any placement on a target, ONLY its pinned occurrences are linked there.
 */
export interface LinkPlacement {
    target: string;     // "post:<id>" or a static page key
    section: string;    // section id inside the target ("content" for blog posts)
    occurrence: number; // 1-based occurrence of the keyword inside that section
    context?: string;   // text snippet captured when pinned, used to detect content drift
}

export interface KeywordOccurrence {
    occurrence: number;
    before: string;
    match: string;
    after: string;
}

export interface InternalLinkSettings {
    maxLinksPerPost: number;             // max internal links per post (default 4)
    preventDuplicateTargetsPerPost: boolean; // allow only 1 link to a specific URL per post (default true)
    excludedSlugs?: string[];
    openInNewTab?: boolean;
}

export interface ExistingLink {
    text: string;
    url: string;
    raw: string;
}

export interface PostLinkAudit {
    id: string;
    title: string;
    slug: string;
    category: string;
    status: "Published" | "Draft";
    wordCount: number;
    existingLinks: ExistingLink[];
    matchedOpportunities: {
        keyword: string;
        targetUrl: string;
        ruleId: string;
    }[];
    hasHomepageLink: boolean;
    hasServiceLink: boolean;
    hasQuoteLink: boolean;
    hasComplianceLink: boolean;
}

export interface LinkAuditSummary {
    totalPosts: number;
    publishedPosts: number;
    totalInternalLinks: number;
    averageLinksPerPost: number;
    orphanPostsCount: number; // posts with 0 internal links
    topTargetUrls: { url: string; count: number }[];
    topAnchorTexts: { text: string; count: number }[];
    posts: PostLinkAudit[];
}

export const DEFAULT_INTERNAL_LINK_SETTINGS: InternalLinkSettings = {
    maxLinksPerPost: 4,
    preventDuplicateTargetsPerPost: true,
    excludedSlugs: [],
    openInNewTab: false
};

export const DEFAULT_INTERNAL_LINK_RULES: InternalLinkRule[] = [
    // ─── HOMEPAGE & BRAND ROOTS ───
    {
        id: "rule-brand-1",
        keyword: "Elite Steel Concepts in Manassas, VA",
        targetUrl: "/",
        categoryFilter: "All",
        maxPerPost: 1,
        priority: 100,
        enabled: true,
        notes: "Geo-brand anchor to homepage",
        createdAt: new Date().toISOString()
    },
    {
        id: "rule-brand-2",
        keyword: "Elite Steel Concepts",
        targetUrl: "/",
        categoryFilter: "All",
        maxPerPost: 1,
        priority: 95,
        enabled: true,
        notes: "Root brand anchor",
        createdAt: new Date().toISOString()
    },
    {
        id: "rule-home-1",
        keyword: "commercial food truck builder",
        targetUrl: "/",
        categoryFilter: "All",
        maxPerPost: 1,
        priority: 90,
        enabled: true,
        notes: "High commercial intent to homepage",
        createdAt: new Date().toISOString()
    },
    {
        id: "rule-home-2",
        keyword: "custom food truck builders in Virginia",
        targetUrl: "/",
        categoryFilter: "All",
        maxPerPost: 1,
        priority: 88,
        enabled: true,
        notes: "Regional authority anchor to homepage",
        createdAt: new Date().toISOString()
    },
    {
        id: "rule-home-3",
        keyword: "professional food truck manufacturing",
        targetUrl: "/",
        categoryFilter: "All",
        maxPerPost: 1,
        priority: 85,
        enabled: true,
        notes: "Manufacturer intent to homepage",
        createdAt: new Date().toISOString()
    },

    // ─── SERVICE: CUSTOM FOOD TRUCKS ───
    {
        id: "rule-srv-truck-1",
        keyword: "custom food truck fabrication",
        targetUrl: "/services/custom-food-trucks",
        categoryFilter: "All",
        maxPerPost: 1,
        priority: 85,
        enabled: true,
        notes: "Primary service silo link",
        createdAt: new Date().toISOString()
    },
    {
        id: "rule-srv-truck-2",
        keyword: "custom food truck builder",
        targetUrl: "/services/custom-food-trucks",
        categoryFilter: "All",
        maxPerPost: 1,
        priority: 84,
        enabled: true,
        notes: "Core keyword to custom food trucks",
        createdAt: new Date().toISOString()
    },
    {
        id: "rule-srv-truck-3",
        keyword: "custom motorized food trucks",
        targetUrl: "/services/custom-food-trucks",
        categoryFilter: "All",
        maxPerPost: 1,
        priority: 82,
        enabled: true,
        notes: "Motorized vehicles service anchor",
        createdAt: new Date().toISOString()
    },
    {
        id: "rule-srv-truck-4",
        keyword: "step-van commercial kitchen conversions",
        targetUrl: "/services/custom-food-trucks",
        categoryFilter: "All",
        maxPerPost: 1,
        priority: 80,
        enabled: true,
        notes: "Step-van conversion keyword",
        createdAt: new Date().toISOString()
    },
    {
        id: "rule-srv-truck-5",
        keyword: "compact food truck conversions",
        targetUrl: "/services/custom-food-trucks",
        categoryFilter: "All",
        maxPerPost: 1,
        priority: 78,
        enabled: true,
        notes: "Kei truck and mini van conversion anchor",
        createdAt: new Date().toISOString()
    },
    {
        id: "rule-srv-truck-6",
        keyword: "buy a food truck new",
        targetUrl: "/services/custom-food-trucks",
        categoryFilter: "All",
        maxPerPost: 1,
        priority: 75,
        enabled: true,
        notes: "Buyer intent link to custom trucks",
        createdAt: new Date().toISOString()
    },

    // ─── SERVICE: CUSTOM FOOD TRAILERS ───
    {
        id: "rule-srv-trailer-1",
        keyword: "custom concession food trailers",
        targetUrl: "/services/custom-food-trailers",
        categoryFilter: "All",
        maxPerPost: 1,
        priority: 85,
        enabled: true,
        notes: "Concession trailers service",
        createdAt: new Date().toISOString()
    },
    {
        id: "rule-srv-trailer-2",
        keyword: "custom food trailer manufacturing",
        targetUrl: "/services/custom-food-trailers",
        categoryFilter: "All",
        maxPerPost: 1,
        priority: 84,
        enabled: true,
        notes: "Trailer manufacturing anchor",
        createdAt: new Date().toISOString()
    },
    {
        id: "rule-srv-trailer-3",
        keyword: "custom food trailers",
        targetUrl: "/services/custom-food-trailers",
        categoryFilter: "All",
        maxPerPost: 1,
        priority: 80,
        enabled: true,
        notes: "General food trailer keyword",
        createdAt: new Date().toISOString()
    },
    {
        id: "rule-srv-trailer-4",
        keyword: "custom mobile pizza trailers",
        targetUrl: "/services/custom-food-trailers",
        categoryFilter: "All",
        maxPerPost: 1,
        priority: 78,
        enabled: true,
        notes: "Pizza trailer keyword",
        createdAt: new Date().toISOString()
    },
    {
        id: "rule-srv-trailer-5",
        keyword: "concession trailer",
        targetUrl: "/services/custom-food-trailers",
        categoryFilter: "All",
        maxPerPost: 1,
        priority: 70,
        enabled: true,
        notes: "Concession keyword",
        createdAt: new Date().toISOString()
    },

    // ─── SERVICE: REPAIRS & UPGRADES ───
    {
        id: "rule-srv-repair-1",
        keyword: "commercial food truck repair services",
        targetUrl: "/services/repairs-and-upgrades",
        categoryFilter: "All",
        maxPerPost: 1,
        priority: 85,
        enabled: true,
        notes: "Repairs and upgrades main anchor",
        createdAt: new Date().toISOString()
    },
    {
        id: "rule-srv-repair-2",
        keyword: "commercial food truck retrofits and repairs",
        targetUrl: "/services/repairs-and-upgrades",
        categoryFilter: "All",
        maxPerPost: 1,
        priority: 82,
        enabled: true,
        notes: "Retrofit anchor",
        createdAt: new Date().toISOString()
    },
    {
        id: "rule-srv-repair-3",
        keyword: "commercial exhaust hood installation",
        targetUrl: "/services/repairs-and-upgrades",
        categoryFilter: "All",
        maxPerPost: 1,
        priority: 80,
        enabled: true,
        notes: "Hood installation anchor",
        createdAt: new Date().toISOString()
    },
    {
        id: "rule-srv-repair-4",
        keyword: "generator installation and power system maintenance",
        targetUrl: "/services/repairs-and-upgrades",
        categoryFilter: "All",
        maxPerPost: 1,
        priority: 78,
        enabled: true,
        notes: "Generator power upgrade anchor",
        createdAt: new Date().toISOString()
    },
    {
        id: "rule-srv-repair-5",
        keyword: "food truck renovation and equipment upgrades",
        targetUrl: "/services/repairs-and-upgrades",
        categoryFilter: "All",
        maxPerPost: 1,
        priority: 76,
        enabled: true,
        notes: "Renovation and remodel anchor",
        createdAt: new Date().toISOString()
    },
    {
        id: "rule-srv-repair-6",
        keyword: "food truck repairs",
        targetUrl: "/services/repairs-and-upgrades",
        categoryFilter: "All",
        maxPerPost: 1,
        priority: 70,
        enabled: true,
        notes: "General repairs anchor",
        createdAt: new Date().toISOString()
    },

    // ─── SERVICE: DESIGN & CONSULTATION ───
    {
        id: "rule-srv-design-1",
        keyword: "commercial food truck design and consultation",
        targetUrl: "/services/design-and-consultation",
        categoryFilter: "All",
        maxPerPost: 1,
        priority: 85,
        enabled: true,
        notes: "Design and consultation primary anchor",
        createdAt: new Date().toISOString()
    },
    {
        id: "rule-srv-design-2",
        keyword: "commercial kitchen layout design",
        targetUrl: "/services/design-and-consultation",
        categoryFilter: "All",
        maxPerPost: 1,
        priority: 80,
        enabled: true,
        notes: "Layout and CAD design anchor",
        createdAt: new Date().toISOString()
    },
    {
        id: "rule-srv-design-3",
        keyword: "custom gas line layout and engineering",
        targetUrl: "/services/design-and-consultation",
        categoryFilter: "All",
        maxPerPost: 1,
        priority: 78,
        enabled: true,
        notes: "Gas and engineering anchor",
        createdAt: new Date().toISOString()
    },
    {
        id: "rule-srv-design-4",
        keyword: "mobile kitchen feasibility and layout consultation",
        targetUrl: "/services/design-and-consultation",
        categoryFilter: "All",
        maxPerPost: 1,
        priority: 75,
        enabled: true,
        notes: "Feasibility anchor",
        createdAt: new Date().toISOString()
    },

    // ─── SERVICE: FLEET EXPANSION ───
    {
        id: "rule-srv-fleet-1",
        keyword: "food truck fleet expansion services",
        targetUrl: "/services/fleet-expansion",
        categoryFilter: "All",
        maxPerPost: 1,
        priority: 85,
        enabled: true,
        notes: "Fleet expansion service anchor",
        createdAt: new Date().toISOString()
    },
    {
        id: "rule-srv-fleet-2",
        keyword: "food truck fleet expansion",
        targetUrl: "/services/fleet-expansion",
        categoryFilter: "All",
        maxPerPost: 1,
        priority: 80,
        enabled: true,
        notes: "Multi-unit fleet anchor",
        createdAt: new Date().toISOString()
    },

    // ─── COMPLIANCE HUB ───
    {
        id: "rule-comp-1",
        keyword: "DMV fire safety and suppression compliance",
        targetUrl: "/compliance",
        categoryFilter: "All",
        maxPerPost: 1,
        priority: 85,
        enabled: true,
        notes: "Fire suppression compliance anchor",
        createdAt: new Date().toISOString()
    },
    {
        id: "rule-comp-2",
        keyword: "DMV health and fire code standards",
        targetUrl: "/compliance",
        categoryFilter: "All",
        maxPerPost: 1,
        priority: 84,
        enabled: true,
        notes: "Health and fire code standards",
        createdAt: new Date().toISOString()
    },
    {
        id: "rule-comp-3",
        keyword: "commercial mobile kitchen compliance guidelines",
        targetUrl: "/compliance",
        categoryFilter: "All",
        maxPerPost: 1,
        priority: 82,
        enabled: true,
        notes: "General compliance guidelines",
        createdAt: new Date().toISOString()
    },
    {
        id: "rule-comp-4",
        keyword: "food truck health department regulations",
        targetUrl: "/compliance",
        categoryFilter: "All",
        maxPerPost: 1,
        priority: 80,
        enabled: true,
        notes: "Health department regulations",
        createdAt: new Date().toISOString()
    },
    {
        id: "rule-comp-5",
        keyword: "DMV commissary kitchen requirements",
        targetUrl: "/compliance",
        categoryFilter: "All",
        maxPerPost: 1,
        priority: 78,
        enabled: true,
        notes: "Commissary compliance anchor",
        createdAt: new Date().toISOString()
    },
    {
        id: "rule-comp-6",
        keyword: "100% health code compliance standards",
        targetUrl: "/compliance",
        categoryFilter: "All",
        maxPerPost: 1,
        priority: 76,
        enabled: true,
        notes: "100% compliance guarantee",
        createdAt: new Date().toISOString()
    },
    {
        id: "rule-comp-7",
        keyword: "food truck ventilation and fire codes",
        targetUrl: "/compliance",
        categoryFilter: "All",
        maxPerPost: 1,
        priority: 75,
        enabled: true,
        notes: "Ventilation and fire codes",
        createdAt: new Date().toISOString()
    },
    {
        id: "rule-comp-8",
        keyword: "mobile food plumbing regulations",
        targetUrl: "/compliance",
        categoryFilter: "All",
        maxPerPost: 1,
        priority: 74,
        enabled: true,
        notes: "Plumbing regulations",
        createdAt: new Date().toISOString()
    },

    // ─── QUOTE ENGINE & CONVERSION ───
    {
        id: "rule-quote-1",
        keyword: "get an itemized custom food truck quote",
        targetUrl: "/quote",
        categoryFilter: "All",
        maxPerPost: 1,
        priority: 90,
        enabled: true,
        notes: "High conversion itemized quote anchor",
        createdAt: new Date().toISOString()
    },
    {
        id: "rule-quote-2",
        keyword: "request a custom build comparison quote",
        targetUrl: "/quote",
        categoryFilter: "All",
        maxPerPost: 1,
        priority: 88,
        enabled: true,
        notes: "Comparison quote anchor",
        createdAt: new Date().toISOString()
    },
    {
        id: "rule-quote-3",
        keyword: "configure your equipment and get a quote",
        targetUrl: "/quote",
        categoryFilter: "All",
        maxPerPost: 1,
        priority: 86,
        enabled: true,
        notes: "Configurator quote anchor",
        createdAt: new Date().toISOString()
    },
    {
        id: "rule-quote-4",
        keyword: "custom build cost estimate",
        targetUrl: "/quote",
        categoryFilter: "All",
        maxPerPost: 1,
        priority: 84,
        enabled: true,
        notes: "Cost estimate anchor",
        createdAt: new Date().toISOString()
    },
    {
        id: "rule-quote-5",
        keyword: "request a custom quote",
        targetUrl: "/quote",
        categoryFilter: "All",
        maxPerPost: 1,
        priority: 82,
        enabled: true,
        notes: "Direct custom quote anchor",
        createdAt: new Date().toISOString()
    },

    // ─── PROCESS & PORTFOLIO ───
    {
        id: "rule-proc-1",
        keyword: "step-by-step build process",
        targetUrl: "/process",
        categoryFilter: "All",
        maxPerPost: 1,
        priority: 75,
        enabled: true,
        notes: "Build process link",
        createdAt: new Date().toISOString()
    },
    {
        id: "rule-proc-2",
        keyword: "our end-to-end fabrication process",
        targetUrl: "/process",
        categoryFilter: "All",
        maxPerPost: 1,
        priority: 74,
        enabled: true,
        notes: "Fabrication process link",
        createdAt: new Date().toISOString()
    },
    {
        id: "rule-port-1",
        keyword: "view our completed mobile kitchen builds",
        targetUrl: "/portfolio",
        categoryFilter: "All",
        maxPerPost: 1,
        priority: 75,
        enabled: true,
        notes: "Portfolio showcase anchor",
        createdAt: new Date().toISOString()
    },
    {
        id: "rule-port-2",
        keyword: "our custom build portfolio",
        targetUrl: "/portfolio",
        categoryFilter: "All",
        maxPerPost: 1,
        priority: 72,
        enabled: true,
        notes: "Portfolio general anchor",
        createdAt: new Date().toISOString()
    },

    // ─── REGIONAL & GEO TARGETS ───
    {
        id: "rule-geo-dc",
        keyword: "Washington DC food truck regulations",
        targetUrl: "/locations/washington-dc",
        categoryFilter: "All",
        maxPerPost: 1,
        priority: 80,
        enabled: true,
        notes: "DC location page anchor",
        createdAt: new Date().toISOString()
    },
    {
        id: "rule-geo-va",
        keyword: "Virginia food truck builder",
        targetUrl: "/locations/arlington-va",
        categoryFilter: "All",
        maxPerPost: 1,
        priority: 80,
        enabled: true,
        notes: "Virginia / Arlington location anchor",
        createdAt: new Date().toISOString()
    },
    {
        id: "rule-geo-md",
        keyword: "Maryland custom food truck builders",
        targetUrl: "/locations/baltimore-md",
        categoryFilter: "All",
        maxPerPost: 1,
        priority: 80,
        enabled: true,
        notes: "Maryland / Baltimore location anchor",
        createdAt: new Date().toISOString()
    }
];

// ─── RULE SCOPING ───

export const postTargetKey = (postId: string) => `post:${postId}`;

/** True when the rule was limited to hand-picked blog posts and/or static pages. */
export function hasExplicitTargets(rule: InternalLinkRule): boolean {
    return (rule.targetPostIds?.length ?? 0) > 0 || (rule.targetPages?.length ?? 0) > 0;
}

/**
 * A rule is "scoped" when it is limited to selected posts/pages or to a single blog category.
 * Scoped rules never run anywhere outside their scope.
 */
export function isScopedRule(rule: InternalLinkRule): boolean {
    return hasExplicitTargets(rule) || (!!rule.categoryFilter && rule.categoryFilter !== "All");
}

/**
 * Enabled rules that apply to a specific blog post.
 * Hand-picked targets take precedence over the category scope.
 */
export function getRulesForPost(
    rules: InternalLinkRule[],
    post: { id: string; category?: string }
): InternalLinkRule[] {
    return rules.filter(r => {
        if (r.enabled === false) return false;
        if (hasExplicitTargets(r)) return (r.targetPostIds || []).includes(post.id);
        if (r.categoryFilter && r.categoryFilter !== "All") return r.categoryFilter === post.category;
        return true;
    });
}

/** Enabled rules that apply to a static page from the linkable page registry. */
export function getRulesForPage(rules: InternalLinkRule[], pageKey: string): InternalLinkRule[] {
    return rules.filter(r => {
        if (r.enabled === false) return false;
        if (hasExplicitTargets(r)) return (r.targetPages || []).includes(pageKey);
        return !r.categoryFilter || r.categoryFilter === "All";
    });
}

/** Enabled rules allowed on any non-blog page (no explicit targets, no category scope). */
export function getSiteWideRules(rules: InternalLinkRule[]): InternalLinkRule[] {
    return rules.filter(r => r.enabled !== false && !isScopedRule(r));
}

// ─── PARSER & LINK INJECTOR ENGINE ───

/**
 * Extracts existing markdown and HTML links from content.
 */
export function extractExistingLinks(content: string): ExistingLink[] {
    if (!content) return [];
    const links: ExistingLink[] = [];

    // Match [Anchor](URL)
    const mdLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let match: RegExpExecArray | null;
    while ((match = mdLinkRegex.exec(content)) !== null) {
        // Exclude image markdown ![alt](url)
        const isImage = match.index > 0 && content[match.index - 1] === "!";
        if (!isImage) {
            links.push({
                text: match[1],
                url: match[2],
                raw: match[0]
            });
        }
    }

    // Match <a href="URL">Anchor</a>
    const htmlLinkRegex = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>(.*?)<\/a>/gi;
    while ((match = htmlLinkRegex.exec(content)) !== null) {
        links.push({
            text: match[2].replace(/<[^>]+>/g, ""),
            url: match[1],
            raw: match[0]
        });
    }

    return links;
}

const PLACEHOLDER_RE = /___ESC_[A-Z_]+?_(\d+)___/g;

/**
 * Swaps everything that must never be linked (code, images, existing links, HTML, headings)
 * for placeholder tokens. Shared by the injector and the occurrence scanner so that
 * occurrence numbers always mean the same thing in both.
 */
function protectContent(content: string): { text: string; placeholders: string[] } {
    const placeholders: string[] = [];
    const protect = (kind: string) => (m: string) => {
        placeholders.push(m);
        return `___ESC_${kind}_${placeholders.length - 1}___`;
    };
    const text = content
        .replace(/```[\s\S]*?```/g, protect("CODE_BLOCK"))
        .replace(/`[^`\n]+`/g, protect("INLINE_CODE"))
        .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, protect("IMAGE"))
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, protect("EXISTING_LINK"))
        .replace(/<[^>]+>/g, protect("HTML_TAG"))
        .replace(/^(#{1,6}\s+[^\n]+)$/gm, protect("HEADER"));
    return { text, placeholders };
}

/** Restores placeholders; loops because a placeholder can contain other placeholders. */
function restoreContent(text: string, placeholders: string[]): string {
    let result = text;
    for (let guard = 0; guard < 10 && PLACEHOLDER_RE.test(result); guard++) {
        PLACEHOLDER_RE.lastIndex = 0;
        result = result.replace(PLACEHOLDER_RE, (_, i) => placeholders[Number(i)]);
    }
    PLACEHOLDER_RE.lastIndex = 0;
    return result;
}

function keywordRegex(keyword: string, caseSensitive?: boolean): RegExp {
    const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(`(?<![\\w-])${escaped}(?![\\w-])`, caseSensitive ? "g" : "gi");
}

/**
 * Lists every linkable occurrence of a keyword in a piece of content, with surrounding context.
 * Occurrences inside headings, code, images and existing links are not counted.
 */
export function findKeywordOccurrences(
    content: string,
    keyword: string,
    caseSensitive = false,
    contextChars = 60
): KeywordOccurrence[] {
    if (!content || !keyword?.trim()) return [];
    const { text, placeholders } = protectContent(content);
    const regex = keywordRegex(keyword.trim(), caseSensitive);
    const MARK = "\u0000";
    const results: KeywordOccurrence[] = [];
    let m: RegExpExecArray | null;
    while ((m = regex.exec(text)) !== null) {
        const marked = text.slice(0, m.index) + MARK + text.slice(m.index + m[0].length);
        const restored = restoreContent(marked, placeholders);
        const at = restored.indexOf(MARK);
        const clean = (t: string) => t.replace(/\s+/g, " ");
        results.push({
            occurrence: results.length + 1,
            before: clean(restored.slice(Math.max(0, at - contextChars), at)),
            match: m[0],
            after: clean(restored.slice(at + 1, at + 1 + contextChars))
        });
    }
    return results;
}

export const occurrenceContext = (o: KeywordOccurrence) => `${o.before}${o.match}${o.after}`.trim();

/** Link limits shared across every section of one page, so limits apply per page, not per paragraph. */
export interface LinkRunState {
    totalLinks: number;
    targetCounts: Record<string, number>;
    ruleUsage: Record<string, number>;
}

export const createLinkRunState = (): LinkRunState => ({ totalLinks: 0, targetCounts: {}, ruleUsage: {} });

export interface AutoLinkOptions {
    target?: string;   // "post:<id>" or page key; enables placements
    section?: string;  // section id inside the target (default "content")
    state?: LinkRunState;
}

/**
 * Safely auto-injects internal links into markdown content.
 * Guarantees that headings, existing links, images, and code blocks are never corrupted.
 *
 * Rules pinned to this target (placements) are applied first and only on their chosen
 * occurrences; every other occurrence of a pinned keyword on this target stays plain text.
 */
export function autoLinkMarkdown(
    content: string,
    rules: InternalLinkRule[],
    settings: Partial<InternalLinkSettings> = {},
    options: AutoLinkOptions = {}
): {
    updatedContent: string;
    linksAdded: number;
    addedLinks: { keyword: string; targetUrl: string }[];
} {
    if (!content) return { updatedContent: "", linksAdded: 0, addedLinks: [] };

    const opts = { ...DEFAULT_INTERNAL_LINK_SETTINGS, ...settings };
    const maxLinksTotal = opts.maxLinksPerPost || 4;
    const preventDuplicateTargets = opts.preventDuplicateTargetsPerPost !== false;
    const state = options.state || createLinkRunState();
    const section = options.section || "content";

    // Existing links count towards duplicate-target prevention
    extractExistingLinks(content).forEach(l => {
        const cleanUrl = normalizeInternalTarget(l.url).toLowerCase();
        state.targetCounts[cleanUrl] = (state.targetCounts[cleanUrl] || 0) + 1;
    });

    let linksAdded = 0;
    const addedLinks: { keyword: string; targetUrl: string }[] = [];
    const { text: protectedText, placeholders } = protectContent(content);
    let working = protectedText;

    const recordLink = (rule: InternalLinkRule, matchedText: string) => {
        const url = normalizeInternalTarget(rule.targetUrl);
        const key = url.toLowerCase();
        state.totalLinks++;
        state.targetCounts[key] = (state.targetCounts[key] || 0) + 1;
        state.ruleUsage[rule.id] = (state.ruleUsage[rule.id] || 0) + 1;
        linksAdded++;
        addedLinks.push({ keyword: matchedText, targetUrl: rule.targetUrl });
        placeholders.push(`[${matchedText}](${url})`);
        return `___ESC_NEW_LINK_${placeholders.length - 1}___`;
    };

    const activeRules = rules
        .filter(r => r.enabled !== false && r.keyword && r.targetUrl)
        .sort((a, b) => (b.keyword.length - a.keyword.length) || ((b.priority || 0) - (a.priority || 0)));

    // ─── Pass 1: pinned placements (explicit admin choice, always honoured) ───
    const pinnedOnTarget = new Set<string>();
    if (options.target) {
        const hits: { start: number; end: number; rule: InternalLinkRule }[] = [];
        for (const rule of activeRules) {
            const mine = (rule.placements || []).filter(p => p.target === options.target);
            if (mine.length === 0) continue;
            pinnedOnTarget.add(rule.id);
            const wanted = new Set(mine.filter(p => p.section === section).map(p => p.occurrence));
            if (wanted.size === 0) continue;
            const regex = keywordRegex(rule.keyword, rule.caseSensitive);
            let m: RegExpExecArray | null;
            let n = 0;
            while ((m = regex.exec(protectedText)) !== null) {
                n++;
                if (wanted.has(n)) hits.push({ start: m.index, end: m.index + m[0].length, rule });
            }
        }
        // Longer keywords were sorted first; drop overlapping hits, then replace right-to-left
        const accepted: typeof hits = [];
        for (const h of hits) {
            if (!accepted.some(a => h.start < a.end && a.start < h.end)) accepted.push(h);
        }
        accepted.sort((a, b) => b.start - a.start);
        for (const h of accepted) {
            const token = recordLink(h.rule, working.slice(h.start, h.end));
            working = working.slice(0, h.start) + token + working.slice(h.end);
        }
    }

    // ─── Pass 2: automatic linking for everything that is not pinned on this target ───
    for (const rule of activeRules) {
        if (pinnedOnTarget.has(rule.id)) continue;
        if (state.totalLinks >= maxLinksTotal) break;

        const cleanTarget = normalizeInternalTarget(rule.targetUrl).toLowerCase();
        const maxForThisRule = rule.maxPerPost || 1;
        const canLink = () =>
            state.totalLinks < maxLinksTotal &&
            !(preventDuplicateTargets && (state.targetCounts[cleanTarget] || 0) >= 1) &&
            (state.ruleUsage[rule.id] || 0) < maxForThisRule;

        if (!canLink()) continue;
        working = working.replace(keywordRegex(rule.keyword, rule.caseSensitive), matchedText =>
            canLink() ? recordLink(rule, matchedText) : matchedText
        );
    }

    return {
        updatedContent: restoreContent(working, placeholders),
        linksAdded,
        addedLinks
    };
}

/**
 * Links several sections of one page with shared limits.
 * Returns the linked text of every section keyed by section id.
 */
export function autoLinkSections(
    sections: { id: string; text: string }[],
    rules: InternalLinkRule[],
    settings: Partial<InternalLinkSettings>,
    target: string
): Record<string, string> {
    const state = createLinkRunState();
    const out: Record<string, string> = {};
    for (const s of sections) {
        out[s.id] = autoLinkMarkdown(s.text, rules, settings, { target, section: s.id, state }).updatedContent;
    }
    return out;
}

/**
 * Scans a single post and returns its link audit metrics and matched link opportunities.
 */
export function scanPostLinks(
    post: BlogPost,
    rules: InternalLinkRule[],
    settings: Partial<InternalLinkSettings> = {}
): PostLinkAudit {
    const content = post.content || "";
    const existingLinks = extractExistingLinks(content);
    const wordCount = content.split(/\s+/).filter(w => w.length > 0).length;

    const urls = existingLinks.map(l => l.url.trim().toLowerCase());
    const hasHomepageLink = urls.some(u => u === "/" || u === "https://esteelconcepts.com" || u === "https://www.esteelconcepts.com");
    const hasServiceLink = urls.some(u => u.includes("/services"));
    const hasQuoteLink = urls.some(u => u.includes("/quote"));
    const hasComplianceLink = urls.some(u => u.includes("/compliance"));

    // Find what opportunities exist
    const matchedOpportunities: { keyword: string; targetUrl: string; ruleId: string }[] = [];
    const activeRules = getRulesForPost(rules, post);

    for (const rule of activeRules) {
        if (!rule.keyword) continue;
        const escaped = rule.keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const regex = new RegExp(`(?<![\\w-])${escaped}(?![\\w-])`, rule.caseSensitive ? "" : "i");
        if (regex.test(content)) {
            matchedOpportunities.push({
                keyword: rule.keyword,
                targetUrl: rule.targetUrl,
                ruleId: rule.id
            });
        }
    }

    return {
        id: post.id,
        title: post.title,
        slug: post.slug,
        category: post.category,
        status: post.status,
        wordCount,
        existingLinks,
        matchedOpportunities,
        hasHomepageLink,
        hasServiceLink,
        hasQuoteLink,
        hasComplianceLink
    };
}

/**
 * Generates a full site internal link audit report across all blog posts.
 */
export function generateLinkAuditReport(
    posts: BlogPost[],
    rules: InternalLinkRule[],
    settings: Partial<InternalLinkSettings> = {}
): LinkAuditSummary {
    const postAudits = posts.map(p => scanPostLinks(p, rules, settings));
    const published = postAudits.filter(p => p.status === "Published");

    const totalInternalLinks = postAudits.reduce((acc, p) => acc + p.existingLinks.length, 0);
    const averageLinksPerPost = postAudits.length > 0 ? Number((totalInternalLinks / postAudits.length).toFixed(1)) : 0;
    const orphanPostsCount = published.filter(p => p.existingLinks.length === 0).length;

    // Aggregate top target URLs
    const urlMap: Record<string, number> = {};
    const anchorMap: Record<string, number> = {};

    postAudits.forEach(p => {
        p.existingLinks.forEach(l => {
            const u = l.url.trim();
            urlMap[u] = (urlMap[u] || 0) + 1;

            const t = l.text.trim();
            if (t) {
                anchorMap[t] = (anchorMap[t] || 0) + 1;
            }
        });
    });

    const topTargetUrls = Object.entries(urlMap)
        .map(([url, count]) => ({ url, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

    const topAnchorTexts = Object.entries(anchorMap)
        .map(([text, count]) => ({ text, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

    return {
        totalPosts: posts.length,
        publishedPosts: published.length,
        totalInternalLinks,
        averageLinksPerPost,
        orphanPostsCount,
        topTargetUrls,
        topAnchorTexts,
        posts: postAudits
    };
}

/**
 * Strips specific or all markdown internal links from content, keeping only the anchor text.
 */
export function stripInternalLinks(content: string, targetUrlsToRemove?: string[]): { cleanedContent: string; removedCount: number } {
    if (!content) return { cleanedContent: "", removedCount: 0 };
    let count = 0;

    const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const cleaned = content.replace(regex, (fullMatch, text, url) => {
        // If specific target URLs given, only remove matching ones
        if (targetUrlsToRemove && targetUrlsToRemove.length > 0) {
            const matches = targetUrlsToRemove.some(t => url.trim().toLowerCase() === t.trim().toLowerCase());
            if (matches) {
                count++;
                return text;
            }
            return fullMatch;
        }

        // Exclude external absolute URLs if needed, or remove all relative internal links
        if (url.startsWith("/") || url.includes("esteelconcepts.com")) {
            count++;
            return text;
        }

        return fullMatch;
    });

    return { cleanedContent: cleaned, removedCount: count };
}
