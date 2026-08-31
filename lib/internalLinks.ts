import { BlogPost } from "./db";

export interface InternalLinkRule {
    id: string;
    keyword: string;
    targetUrl: string;
    categoryFilter?: string; // "All" or specific category e.g. "Maintenance", "Business", "Guide"
    maxPerPost?: number;     // max times this keyword links per post (default 1)
    priority?: number;       // higher priority rules get processed first (default 0)
    enabled: boolean;
    caseSensitive?: boolean;
    notes?: string;
    createdAt: string;
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

/**
 * Safely auto-injects internal links into markdown content.
 * Guarantees that headings, existing links, images, and code blocks are never corrupted.
 */
export function autoLinkMarkdown(
    content: string,
    rules: InternalLinkRule[],
    settings: Partial<InternalLinkSettings> = {}
): {
    updatedContent: string;
    linksAdded: number;
    addedLinks: { keyword: string; targetUrl: string }[];
} {
    if (!content) return { updatedContent: "", linksAdded: 0, addedLinks: [] };

    const opts = { ...DEFAULT_INTERNAL_LINK_SETTINGS, ...settings };
    const maxLinksTotal = opts.maxLinksPerPost || 4;
    const preventDuplicateTargets = opts.preventDuplicateTargetsPerPost !== false;

    // Track existing target URLs to prevent duplicate links
    const existingLinks = extractExistingLinks(content);
    const targetCounts: Record<string, number> = {};
    existingLinks.forEach(l => {
        const cleanUrl = l.url.trim().toLowerCase();
        targetCounts[cleanUrl] = (targetCounts[cleanUrl] || 0) + 1;
    });

    let totalLinksAdded = 0;
    const addedLinks: { keyword: string; targetUrl: string }[] = [];

    // ─── Step 1: Protect structural elements with unique tokens ───
    const placeholders: string[] = [];
    let protectedContent = content;

    // 1. Code blocks ``` ... ```
    protectedContent = protectedContent.replace(/```[\s\S]*?```/g, (m) => {
        const idx = placeholders.length;
        placeholders.push(m);
        return `___ESC_CODE_BLOCK_${idx}___`;
    });

    // 2. Inline code ` ... `
    protectedContent = protectedContent.replace(/`[^`\n]+`/g, (m) => {
        const idx = placeholders.length;
        placeholders.push(m);
        return `___ESC_INLINE_CODE_${idx}___`;
    });

    // 3. Markdown images ![alt](url)
    protectedContent = protectedContent.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (m) => {
        const idx = placeholders.length;
        placeholders.push(m);
        return `___ESC_IMAGE_${idx}___`;
    });

    // 4. Existing markdown links [text](url)
    protectedContent = protectedContent.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (m) => {
        const idx = placeholders.length;
        placeholders.push(m);
        return `___ESC_EXISTING_LINK_${idx}___`;
    });

    // 5. Existing HTML tags <...>
    protectedContent = protectedContent.replace(/<[^>]+>/g, (m) => {
        const idx = placeholders.length;
        placeholders.push(m);
        return `___ESC_HTML_TAG_${idx}___`;
    });

    // 6. Markdown headings #, ##, ###, ####
    protectedContent = protectedContent.replace(/^(#{1,6}\s+[^\n]+)$/gm, (m) => {
        const idx = placeholders.length;
        placeholders.push(m);
        return `___ESC_HEADER_${idx}___`;
    });

    // ─── Step 2: Sort rules by keyword length DESC so longer compound phrases match first ───
    const activeRules = rules
        .filter(r => r.enabled !== false && r.keyword && r.targetUrl)
        .sort((a, b) => (b.keyword.length - a.keyword.length) || ((b.priority || 0) - (a.priority || 0)));

    const ruleUsageCount: Record<string, number> = {};

    for (const rule of activeRules) {
        if (totalLinksAdded >= maxLinksTotal) break;

        const cleanTarget = rule.targetUrl.trim().toLowerCase();
        if (preventDuplicateTargets && (targetCounts[cleanTarget] || 0) >= 1) {
            continue;
        }

        const maxForThisRule = rule.maxPerPost || 1;
        if ((ruleUsageCount[rule.id] || 0) >= maxForThisRule) {
            continue;
        }

        // Escape regex special chars
        const escapedKw = rule.keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const pattern = new RegExp(`(?<![\\w-])${escapedKw}(?![\\w-])`, rule.caseSensitive ? "g" : "gi");

        protectedContent = protectedContent.replace(pattern, (matchedText) => {
            if (totalLinksAdded >= maxLinksTotal) return matchedText;
            if (preventDuplicateTargets && (targetCounts[cleanTarget] || 0) >= 1) return matchedText;
            if ((ruleUsageCount[rule.id] || 0) >= maxForThisRule) return matchedText;

            totalLinksAdded++;
            targetCounts[cleanTarget] = (targetCounts[cleanTarget] || 0) + 1;
            ruleUsageCount[rule.id] = (ruleUsageCount[rule.id] || 0) + 1;
            addedLinks.push({ keyword: matchedText, targetUrl: rule.targetUrl });

            const placeholderIdx = placeholders.length;
            placeholders.push(`[${matchedText}](${rule.targetUrl})`);
            return `___ESC_NEW_LINK_${placeholderIdx}___`;
        });
    }

    // ─── Step 3: Restore placeholders in exact reverse order ───
    let result = protectedContent;
    for (let i = placeholders.length - 1; i >= 0; i--) {
        result = result.replace(`___ESC_NEW_LINK_${i}___`, placeholders[i]);
        result = result.replace(`___ESC_HEADER_${i}___`, placeholders[i]);
        result = result.replace(`___ESC_HTML_TAG_${i}___`, placeholders[i]);
        result = result.replace(`___ESC_EXISTING_LINK_${i}___`, placeholders[i]);
        result = result.replace(`___ESC_IMAGE_${i}___`, placeholders[i]);
        result = result.replace(`___ESC_INLINE_CODE_${i}___`, placeholders[i]);
        result = result.replace(`___ESC_CODE_BLOCK_${i}___`, placeholders[i]);
    }

    return {
        updatedContent: result,
        linksAdded: totalLinksAdded,
        addedLinks
    };
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
    const activeRules = rules.filter(r => r.enabled !== false);

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
