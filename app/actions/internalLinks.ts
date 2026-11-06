"use server";

import {
    getPosts,
    getPostById,
    updatePost,
    updatePostContents,
    getInternalLinkRules,
    createInternalLinkRule,
    getInternalLinkRuleById,
    updateInternalLinkRule,
    deleteInternalLinkRule,
    resetInternalLinkRules,
    getInternalLinkSettings,
    updateInternalLinkSettings,
    InternalLinkRule,
    InternalLinkSettings
} from "@/lib/db";
import {
    autoLinkMarkdown,
    generateLinkAuditReport,
    scanPostLinks,
    stripInternalLinks,
    listSavedLinks,
    removeSavedLink,
    normalizeInternalTarget,
    getRulesForPost,
    postTargetKey,
    findKeywordOccurrences,
    LinkPlacement,
    KeywordOccurrence,
} from "@/lib/internalLinks";
import { getPageSections, listLinkablePages } from "@/lib/linkablePages";
import { requireRole } from "@/lib/adminAuth";
import type { AdminRole } from "@/lib/db";
import { revalidatePath } from "next/cache";

/** Roles that can open the Internal Linking screen. */
const LINK_ADMIN_ROLES: readonly AdminRole[] = ["super_admin", "admin", "seo"];

/** Removes a rule's keyword links from every post, unless an active rule still uses that keyword. */
async function removeRuleLinks(rule: InternalLinkRule) {
    const keyword = rule.keyword.trim().toLowerCase();
    const stillActive = (await getInternalLinkRules()).some(r => r.id !== rule.id && r.enabled !== false && r.keyword.trim().toLowerCase() === keyword);
    return removeLinkFromPosts(rule.keyword, stillActive ? rule.targetUrl : null, rule.caseSensitive);
}

/** Removes a link from every post. Returns the number of links and posts changed. */
async function removeLinkFromPosts(text: string, url: string | null, caseSensitive?: boolean) {
    const contents = new Map<string, string>();
    let links = 0;
    for (const post of await getPosts()) {
        const result = removeSavedLink(post.content || "", text, url, caseSensitive);
        if (result.removed > 0) {
            contents.set(post.id, result.content);
            links += result.removed;
        }
    }
    await updatePostContents(contents);
    return { links, posts: contents.size };
}

const removedNote = ({ links, posts }: { links: number; posts: number }) =>
    links > 0 ? ` Removed ${links} saved link${links === 1 ? "" : "s"} from ${posts} blog post${posts === 1 ? "" : "s"}.` : "";

const currentSavedLinks = async () => listSavedLinks(await getPosts(), await getInternalLinkRules());

/** Parses the JSON placements field, keeping only well-formed entries for the rule's selected targets. */
function parsePlacements(raw: FormDataEntryValue | null, allowedTargets: string[]): LinkPlacement[] {
    if (!raw) return [];
    try {
        const parsed = JSON.parse(String(raw));
        if (!Array.isArray(parsed)) return [];
        const allowed = new Set(allowedTargets);
        const seen = new Set<string>();
        return parsed.flatMap((p: Partial<Record<keyof LinkPlacement, unknown>>): LinkPlacement[] => {
            const occurrence = Number(p?.occurrence);
            if (typeof p?.target !== "string" || !allowed.has(p.target)) return [];
            if (typeof p?.section !== "string" || !p.section) return [];
            if (!Number.isInteger(occurrence) || occurrence < 1) return [];
            const key = `${p.target}|${p.section}|${occurrence}`;
            if (seen.has(key)) return [];
            seen.add(key);
            return [{
                target: p.target,
                section: p.section,
                occurrence,
                ...(typeof p.context === "string" ? { context: p.context.slice(0, 300) } : {})
            }];
        });
    } catch {
        return [];
    }
}

export interface TargetOccurrences {
    target: string;
    name: string;
    url: string;
    sections: { id: string; label: string; occurrences: KeywordOccurrence[] }[];
}

/**
 * Finds every linkable occurrence of a keyword on the given targets ("post:<id>" or page keys),
 * grouped by section, so the admin can pin the link to exact spots.
 */
export async function scanKeywordOccurrencesAction(
    keyword: string,
    caseSensitive: boolean,
    targets: string[]
): Promise<{ success: boolean; results?: TargetOccurrences[]; error?: string }> {
    try {
        const kw = (keyword || "").trim();
        if (kw.length < 2) return { success: true, results: [] };

        const needsPosts = targets.some(t => t.startsWith("post:"));
        const [posts, pages] = await Promise.all([needsPosts ? getPosts() : Promise.resolve([]), listLinkablePages()]);

        const results = await Promise.all(targets.map(async (target): Promise<TargetOccurrences | null> => {
            if (target.startsWith("post:")) {
                const post = posts.find(p => p.id === target.slice(5));
                if (!post) return null;
                return {
                    target,
                    name: post.title,
                    url: `/blog/${post.slug}`,
                    sections: [{ id: "content", label: "Article Body", occurrences: findKeywordOccurrences(post.content || "", kw, caseSensitive) }]
                };
            }
            const page = pages.find(p => p.key === target);
            const sections = await getPageSections(target);
            if (!page || !sections) return null;
            return {
                target,
                name: page.name,
                url: page.url,
                sections: sections.map(s => ({
                    id: s.id,
                    label: s.label,
                    occurrences: findKeywordOccurrences(s.text, kw, caseSensitive)
                }))
            };
        }));

        return { success: true, results: results.filter((r): r is TargetOccurrences => r !== null) };
    } catch (err: any) {
        return { success: false, error: err.message };
    }
}

export async function getInternalLinkRulesAction() {
    return await getInternalLinkRules();
}

export async function getInternalLinkSettingsAction() {
    return await getInternalLinkSettings();
}

export async function saveInternalLinkRuleAction(formData: FormData) {
    const auth = await requireRole(LINK_ADMIN_ROLES);
    if (!auth.ok) return { success: false, error: auth.error };

    const id = formData.get("id") as string;
    const keyword = (formData.get("keyword") as string)?.trim();
    const targetUrl = normalizeInternalTarget((formData.get("targetUrl") as string) || "");
    const categoryFilter = (formData.get("categoryFilter") as string) || "All";
    const maxPerPost = parseInt(formData.get("maxPerPost") as string) || 1;
    const priority = parseInt(formData.get("priority") as string) || 0;
    const enabled = formData.get("enabled") === "true" || formData.get("enabled") === "on";
    const caseSensitive = formData.get("caseSensitive") === "true" || formData.get("caseSensitive") === "on";
    const notes = (formData.get("notes") as string) || "";
    const targetPostIds = Array.from(new Set(
        formData.getAll("targetPostIds").map(v => String(v).trim()).filter(Boolean)
    ));
    const targetPages = Array.from(new Set(
        formData.getAll("targetPages").map(v => String(v).trim()).filter(Boolean)
    ));
    const placements = parsePlacements(formData.get("placements"), [
        ...targetPostIds.map(postTargetKey),
        ...targetPages
    ]);

    if (!keyword || !targetUrl) {
        return { success: false, error: "Keyword and Target URL are required." };
    }

    try {
        if (id && id.trim().length > 0) {
            const previous = await getInternalLinkRuleById(id);
            await updateInternalLinkRule(id, {
                keyword,
                targetUrl,
                categoryFilter,
                maxPerPost,
                priority,
                enabled,
                caseSensitive,
                notes,
                targetPostIds,
                targetPages,
                placements
            });
            // Links saved in posts follow the old keyword/target until they are removed
            const replaced = previous && (!enabled || previous.keyword !== keyword || normalizeInternalTarget(previous.targetUrl) !== targetUrl);
            const removed = replaced ? await removeRuleLinks(previous) : { links: 0, posts: 0 };
            revalidatePath("/admin/internal-links");
            revalidatePath("/blog", "layout");
            revalidatePath("/", "layout");
            return { success: true, message: `Rule for "${keyword}" updated.${removedNote(removed)}`, savedLinks: await currentSavedLinks() };
        } else {
            await createInternalLinkRule({
                keyword,
                targetUrl,
                categoryFilter,
                maxPerPost,
                priority,
                enabled,
                caseSensitive,
                notes,
                targetPostIds,
                targetPages,
                placements
            });
            revalidatePath("/admin/internal-links");
            revalidatePath("/blog", "layout");
            revalidatePath("/", "layout");
            return { success: true, message: `Rule for "${keyword}" created.` };
        }
    } catch (err: any) {
        return { success: false, error: err.message || "Failed to save rule." };
    }
}

export async function toggleInternalLinkRuleAction(id: string, enabled: boolean) {
    const auth = await requireRole(LINK_ADMIN_ROLES);
    if (!auth.ok) return { success: false, error: auth.error };

    try {
        const rule = await updateInternalLinkRule(id, { enabled });
        // Nothing to restore on re-enable: active rules are applied at render, within the per-post link limits
        const removed = !enabled && rule ? await removeRuleLinks(rule) : { links: 0, posts: 0 };
        revalidatePath("/admin/internal-links");
        revalidatePath("/blog", "layout");
        revalidatePath("/", "layout");
        return { success: true, message: `Rule ${enabled ? "enabled" : "disabled"}.${removedNote(removed)}`, savedLinks: await currentSavedLinks() };
    } catch (err: any) {
        return { success: false, error: err.message };
    }
}

export async function deleteInternalLinkRuleAction(id: string) {
    const auth = await requireRole(LINK_ADMIN_ROLES);
    if (!auth.ok) return { success: false, error: auth.error };

    try {
        const rule = await getInternalLinkRuleById(id);
        await deleteInternalLinkRule(id);
        const removed = rule ? await removeRuleLinks(rule) : { links: 0, posts: 0 };
        revalidatePath("/admin/internal-links");
        revalidatePath("/blog", "layout");
        revalidatePath("/", "layout");
        return { success: true, message: `Rule deleted.${removedNote(removed)}`, savedLinks: await currentSavedLinks() };
    } catch (err: any) {
        return { success: false, error: err.message };
    }
}

/** Removes one saved link (text + target) from every post, whether or not a rule ever created it. */
export async function removeSavedLinkAction(text: string, url: string) {
    const auth = await requireRole(LINK_ADMIN_ROLES);
    if (!auth.ok) return { success: false, error: auth.error };

    try {
        const removed = await removeLinkFromPosts(text, url);
        revalidatePath("/admin/internal-links");
        revalidatePath("/blog", "layout");
        revalidatePath("/", "layout");
        return { success: true, message: removedNote(removed).trim() || "No saved links found.", savedLinks: await currentSavedLinks() };
    } catch (err: any) {
        return { success: false, error: err.message };
    }
}

export async function resetDefaultRulesAction() {
    try {
        const rules = await resetInternalLinkRules();
        revalidatePath("/admin/internal-links");
        revalidatePath("/blog", "layout");
        revalidatePath("/", "layout");
        return { success: true, message: `Reset to ${rules.length} strategic default rules.`, rules };
    } catch (err: any) {
        return { success: false, error: err.message };
    }
}

export async function saveInternalLinkSettingsAction(formData: FormData) {
    try {
        const maxLinksPerPost = parseInt(formData.get("maxLinksPerPost") as string) || 4;
        const preventDuplicateTargetsPerPost = formData.get("preventDuplicateTargetsPerPost") === "true" || formData.get("preventDuplicateTargetsPerPost") === "on";
        const openInNewTab = formData.get("openInNewTab") === "true" || formData.get("openInNewTab") === "on";
        const excludedSlugsStr = (formData.get("excludedSlugs") as string) || "";
        const excludedSlugs = excludedSlugsStr.split(",").map(s => s.trim()).filter(Boolean);

        const settings = await updateInternalLinkSettings({
            maxLinksPerPost,
            preventDuplicateTargetsPerPost,
            openInNewTab,
            excludedSlugs
        });

        revalidatePath("/admin/internal-links");
        revalidatePath("/blog", "layout");
        revalidatePath("/", "layout");
        return { success: true, message: "Internal link settings updated.", settings };
    } catch (err: any) {
        return { success: false, error: err.message };
    }
}

export async function scanLinkAuditReportAction() {
    try {
        const posts = await getPosts();
        const rules = await getInternalLinkRules();
        const settings = await getInternalLinkSettings();
        const report = generateLinkAuditReport(posts, rules, settings);
        return { success: true, report };
    } catch (err: any) {
        return { success: false, error: err.message };
    }
}

export async function previewPostAutoLinksAction(postId: string) {
    try {
        const post = await getPostById(postId);
        if (!post) return { success: false, error: "Post not found." };

        const rules = await getInternalLinkRules();
        const settings = await getInternalLinkSettings();

        const applicableRules = getRulesForPost(rules, post);

        const result = autoLinkMarkdown(post.content || "", applicableRules, settings, { target: postTargetKey(post.id) });

        return {
            success: true,
            postId,
            title: post.title,
            originalContent: post.content || "",
            updatedContent: result.updatedContent,
            linksAdded: result.linksAdded,
            addedLinks: result.addedLinks
        };
    } catch (err: any) {
        return { success: false, error: err.message };
    }
}

export async function applyAutoLinksToSinglePostAction(postId: string) {
    try {
        const post = await getPostById(postId);
        if (!post) return { success: false, error: "Post not found." };

        const rules = await getInternalLinkRules();
        const settings = await getInternalLinkSettings();

        const applicableRules = getRulesForPost(rules, post);

        const result = autoLinkMarkdown(post.content || "", applicableRules, settings, { target: postTargetKey(post.id) });

        if (result.linksAdded > 0) {
            await updatePost(postId, { content: result.updatedContent });
            revalidatePath(`/blog/${post.slug}`);
            revalidatePath("/blog");
            revalidatePath("/admin/blog");
            revalidatePath("/admin/internal-links");
        }

        return {
            success: true,
            message: `Added ${result.linksAdded} internal link${result.linksAdded === 1 ? "" : "s"} to "${post.title}".`,
            linksAdded: result.linksAdded,
            addedLinks: result.addedLinks,
            updatedContent: result.updatedContent
        };
    } catch (err: any) {
        return { success: false, error: err.message };
    }
}

export async function applyAutoLinksToBulkPostsAction(selectedPostIds?: string[]) {
    try {
        const allPosts = await getPosts();
        const rules = await getInternalLinkRules();
        const settings = await getInternalLinkSettings();

        const targetPosts = allPosts.filter(p => {
            if (selectedPostIds && selectedPostIds.length > 0) {
                return selectedPostIds.includes(p.id);
            }
            // By default process all published posts that aren't excluded
            if (settings.excludedSlugs?.includes(p.slug)) return false;
            return p.status === "Published";
        });

        let totalPostsModified = 0;
        let totalLinksAdded = 0;
        const details: { postId: string; title: string; linksAdded: number }[] = [];

        for (const post of targetPosts) {
            const applicableRules = getRulesForPost(rules, post);

            const result = autoLinkMarkdown(post.content || "", applicableRules, settings, { target: postTargetKey(post.id) });

            if (result.linksAdded > 0) {
                await updatePost(post.id, { content: result.updatedContent });
                totalPostsModified++;
                totalLinksAdded += result.linksAdded;
                details.push({
                    postId: post.id,
                    title: post.title,
                    linksAdded: result.linksAdded
                });
                revalidatePath(`/blog/${post.slug}`);
            }
        }

        revalidatePath("/blog");
        revalidatePath("/admin/blog");
        revalidatePath("/admin/internal-links");

        return {
            success: true,
            message: `Successfully processed ${targetPosts.length} posts: injected ${totalLinksAdded} internal links across ${totalPostsModified} posts.`,
            totalPostsModified,
            totalLinksAdded,
            details
        };
    } catch (err: any) {
        return { success: false, error: err.message };
    }
}

export async function stripLinksFromPostAction(postId: string, targetUrlsToRemove?: string[]) {
    try {
        const post = await getPostById(postId);
        if (!post) return { success: false, error: "Post not found." };

        const { cleanedContent, removedCount } = stripInternalLinks(post.content || "", targetUrlsToRemove);

        if (removedCount > 0) {
            await updatePost(postId, { content: cleanedContent });
            revalidatePath(`/blog/${post.slug}`);
            revalidatePath("/blog");
            revalidatePath("/admin/internal-links");
        }

        return {
            success: true,
            message: `Removed ${removedCount} link(s) from "${post.title}".`,
            removedCount,
            cleanedContent
        };
    } catch (err: any) {
        return { success: false, error: err.message };
    }
}

/**
 * Runs the auto-linker over arbitrary text.
 * Pass `context` (the post being edited) to only apply the rules scoped to that post;
 * without it every enabled rule is used (sandbox tester).
 */
export async function testAutoLinkSandboxAction(
    sampleText: string,
    context?: { postId?: string; category?: string }
): Promise<{
    success: boolean;
    updatedContent?: string;
    linksAdded?: number;
    addedLinks?: { keyword: string; targetUrl: string }[];
    error?: string;
}> {
    try {
        const allRules = await getInternalLinkRules();
        const settings = await getInternalLinkSettings();
        const rules = context
            ? getRulesForPost(allRules, { id: context.postId || "", category: context.category })
            : allRules;
        const result = autoLinkMarkdown(
            sampleText,
            rules,
            settings,
            context?.postId ? { target: postTargetKey(context.postId) } : {}
        );
        return {
            success: true,
            updatedContent: result.updatedContent,
            linksAdded: result.linksAdded,
            addedLinks: result.addedLinks
        };
    } catch (err: any) {
        return {
            success: false,
            error: err.message,
            updatedContent: sampleText,
            linksAdded: 0,
            addedLinks: []
        };
    }
}
