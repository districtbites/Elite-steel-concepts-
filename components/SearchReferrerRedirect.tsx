"use client";

import { useEffect } from "react";

// Hostnames of search engines whose visitors get redirected
const SEARCH_ENGINE = /(^|\.)(google\.[a-z.]+|bing\.com|yahoo\.com|duckduckgo\.com|search\.brave\.com|ecosia\.org|yandex\.[a-z.]+|baidu\.com)$/i;

/**
 * Sends visitors who land on this page straight from a search engine to `to`.
 * Visitors who reach the page by browsing the site (or by going back) stay here.
 */
export default function SearchReferrerRedirect({ to }: { to: string }) {
    useEffect(() => {
        let host = "";
        try {
            host = new URL(document.referrer).hostname;
        } catch {
            return; // no referrer: direct visit, bookmark or crawler
        }
        if (!SEARCH_ENGINE.test(host)) return;

        // document.referrer survives client-side navigation, so only act when this page
        // was the landing page of a fresh navigation (not a soft nav, reload or back/forward)
        const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
        if (!nav || nav.type !== "navigate" || nav.name !== window.location.href) return;

        window.location.replace(to);
    }, [to]);

    return null;
}
