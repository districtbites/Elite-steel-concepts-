"use server";

import {
    getPosts,
    getPostById,
    updatePost,
    getInternalLinkRules,
    createInternalLinkRule,
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
    stripInternalLinks
} from "@/lib/internalLinks";
import { revalidatePath } from "next/cache";

export async function getInternalLinkRulesAction() {
    return await getInternalLinkRules();
}

export async function getInternalLinkSettingsAction() {
    return await getInternalLinkSettings();
}

export async function saveInternalLinkRuleAction(formData: FormData) {
    const id = formData.get("id") as string;
    const keyword = (formData.get("keyword") as string)?.trim();
    const targetUrl = (formData.get("targetUrl") as string)?.trim();
    const categoryFilter = (formData.get("categoryFilter") as string) || "All";
    const maxPerPost = parseInt(formData.get("maxPerPost") as string) || 1;
    const priority = parseInt(formData.get("priority") as string) || 0;
    const enabled = formData.get("enabled") === "true" || formData.get("enabled") === "on";
    const caseSensitive = formData.get("caseSensitive") === "true" || formData.get("caseSensitive") === "on";
    const notes = (formData.get("notes") as string) || "";

    if (!keyword || !targetUrl) {
        return { success: false, error: "Keyword and Target URL are required." };
    }

    try {
        if (id && id.trim().length > 0) {
            await updateInternalLinkRule(id, {
                keyword,
                targetUrl,
                categoryFilter,
                maxPerPost,
                priority,
                enabled,
                caseSensitive,
                notes
            });
            revalidatePath("/admin/internal-links");
            revalidatePath("/blog", "layout");
            revalidatePath("/", "layout");
            return { success: true, message: `Rule for "${keyword}" updated.` };
        } else {
            await createInternalLinkRule({
                keyword,
                targetUrl,
                categoryFilter,
                maxPerPost,
                priority,
                enabled,
                caseSensitive,
                notes
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
    try {
        await updateInternalLinkRule(id, { enabled });
        revalidatePath("/admin/internal-links");
        revalidatePath("/blog", "layout");
        revalidatePath("/", "layout");
        return { success: true, message: `Rule ${enabled ? "enabled" : "disabled"}.` };
    } catch (err: any) {
        return { success: false, error: err.message };
    }
}

export async function deleteInternalLinkRuleAction(id: string) {
    try {
        await deleteInternalLinkRule(id);
        revalidatePath("/admin/internal-links");
        revalidatePath("/blog", "layout");
        revalidatePath("/", "layout");
        return { success: true, message: "Rule deleted successfully." };
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

        const applicableRules = rules.filter(r => {
            if (r.categoryFilter && r.categoryFilter !== "All" && r.categoryFilter !== post.category) {
                return false;
            }
            return r.enabled !== false;
        });

        const result = autoLinkMarkdown(post.content || "", applicableRules, settings);

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

        const applicableRules = rules.filter(r => {
            if (r.categoryFilter && r.categoryFilter !== "All" && r.categoryFilter !== post.category) {
                return false;
            }
            return r.enabled !== false;
        });

        const result = autoLinkMarkdown(post.content || "", applicableRules, settings);

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
            const applicableRules = rules.filter(r => {
                if (r.categoryFilter && r.categoryFilter !== "All" && r.categoryFilter !== post.category) {
                    return false;
                }
                return r.enabled !== false;
            });

            const result = autoLinkMarkdown(post.content || "", applicableRules, settings);

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

export async function testAutoLinkSandboxAction(sampleText: string): Promise<{
    success: boolean;
    updatedContent?: string;
    linksAdded?: number;
    addedLinks?: { keyword: string; targetUrl: string }[];
    error?: string;
}> {
    try {
        const rules = await getInternalLinkRules();
        const settings = await getInternalLinkSettings();
        const result = autoLinkMarkdown(sampleText, rules, settings);
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
