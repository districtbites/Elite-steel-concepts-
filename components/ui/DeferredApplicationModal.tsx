"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { isNewsletterSubscribed } from "@/lib/newsletterStorage";

// The modal's code is kept out of the initial bundle and fetched right after the page mounts,
// so it is ready the moment it is triggered.
const loadModal = () => import("./ApplicationModal");
const ApplicationModal = dynamic(loadModal, { ssr: false });

const STORAGE_KEY = "has_seen_newsletter_modal_v1";

// Google's intrusive-interstitial guideline penalises mobile popups that cover the content
// right after a visitor lands. So on mobile we show a small, non-blocking banner, and only
// once the visitor has engaged by scrolling. Desktop keeps the full popup after a short delay.
const DESKTOP_DELAY_MS = 5000;
const MOBILE_SCROLL_DEPTH = 0.4;

export default function DeferredApplicationModal() {
  const [variant, setVariant] = useState<"modal" | "banner" | null>(null);

  useEffect(() => {
    if (isNewsletterSubscribed()) return;
    try {
      if (sessionStorage.getItem(STORAGE_KEY)) return;
    } catch {
      // sessionStorage unavailable (e.g. privacy mode) — still show it once.
    }
    loadModal();

    if (!window.matchMedia("(max-width: 767px)").matches) {
      const timer = setTimeout(() => setVariant("modal"), DESKTOP_DELAY_MS);
      return () => clearTimeout(timer);
    }

    const onScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable > 0 && window.scrollY / scrollable >= MOBILE_SCROLL_DEPTH) {
        setVariant("banner");
        window.removeEventListener("scroll", onScroll);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return variant ? <ApplicationModal storageKey={STORAGE_KEY} variant={variant} /> : null;
}
