"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, AlertCircle, ArrowRight, Mail, CheckCircle2, Truck, BookOpen, Flame } from "lucide-react";
import { submitNewsletter } from "@/app/actions/newsletter";
import { isNewsletterSubscribed, markNewsletterSubscribed } from "@/lib/newsletterStorage";

interface ApplicationModalProps {
  storageKey?: string;
  /** "modal": full popup (desktop). "banner": small non-blocking bottom bar (mobile, Google-friendly). */
  variant?: "modal" | "banner";
}

const PERKS = [
  { icon: Truck, title: "New Build Reveals", text: "See our latest trucks & trailers first." },
  { icon: BookOpen, title: "Expert Guides", text: "Layout, permits, code compliance & upkeep." },
  { icon: Flame, title: "Announcements & Offers", text: "Early access to news and special offers." },
];

export default function ApplicationModal({
  storageKey = "has_seen_newsletter_modal_v1",
  variant = "modal",
}: ApplicationModalProps) {
  const isBanner = variant === "banner";
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    let hasSeen = false;
    try {
      hasSeen = Boolean(sessionStorage.getItem(storageKey)) || isNewsletterSubscribed();
    } catch {
      // Storage unavailable (e.g. privacy mode) — still show the modal once.
    }
    if (!hasSeen) {
      // The page-level delay lives in DeferredApplicationModal; open as soon as this mounts.
      setIsOpen(true);
    }
  }, [storageKey]);

  const handleClose = React.useCallback(() => {
    try {
      sessionStorage.setItem(storageKey, "true");
    } catch {}
    setIsOpen(false);
  }, [storageKey]);

  useEffect(() => {
    if (!isOpen) return;
    // The banner must never block the page, so only the full modal locks scrolling
    const prev = document.body.style.overflow;
    if (!isBanner) document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && handleClose();
    window.addEventListener("keydown", onKey);
    return () => {
      if (!isBanner) document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, isBanner, handleClose]);

  // The banner tucks itself away a few seconds after a successful signup
  useEffect(() => {
    if (!isBanner || !successMessage) return;
    const timer = setTimeout(handleClose, 4000);
    return () => clearTimeout(timer);
  }, [isBanner, successMessage, handleClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("email", email);
      const result = await submitNewsletter(formData);

      if (result.error) {
        setError(result.error);
      } else {
        markNewsletterSubscribed();
        setSuccessMessage(result.message || "You're subscribed!");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted || !isOpen) return null;

  if (isBanner) {
    return createPortal(
      <div
        role="dialog"
        aria-labelledby="newsletter-banner-title"
        className="fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-[90] bg-[#0a0a0a] text-white border border-[#1a1a1a] shadow-2xl shadow-black/40 overflow-hidden animate-[sheetUp_0.4s_cubic-bezier(0.22,1,0.36,1)]"
      >
        <div className="hazard-stripe h-1" aria-hidden />
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close"
          className="absolute top-2.5 right-2 size-10 flex items-center justify-center text-gray-400 hover:text-primary transition-colors"
        >
          <X size={18} />
        </button>

        <div className="p-4">
          {successMessage ? (
            <div className="flex items-center gap-3 pr-10" role="status" aria-live="polite">
              <span className="size-10 shrink-0 bg-primary text-black flex items-center justify-center">
                <CheckCircle2 size={20} />
              </span>
              <div>
                <p id="newsletter-banner-title" className="font-black uppercase tracking-tight">You&apos;re In!</p>
                <p className="text-[13px] text-gray-400 leading-snug">{successMessage}</p>
              </div>
            </div>
          ) : (
            <>
              <div className="pr-10">
                <p className="text-primary text-[10px] font-black uppercase tracking-[0.2em]">Newsletter</p>
                <p id="newsletter-banner-title" className="text-lg font-black uppercase tracking-tight leading-tight mt-0.5">
                  Join the <span className="text-primary">Club</span>
                </p>
                <p className="text-[13px] text-gray-400 leading-snug mt-1">
                  New builds, expert guides &amp; offers in your inbox.
                </p>
              </div>
              <form onSubmit={handleSubmit} className="mt-3 flex gap-2" noValidate>
                <label htmlFor="newsletter-banner-email" className="sr-only">Email address</label>
                <input
                  id="newsletter-banner-email"
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  aria-invalid={Boolean(error)}
                  className="flex-1 min-w-0 px-3 py-2.5 bg-white text-black text-base font-medium placeholder-gray-400 outline-none border-2 border-transparent focus:border-primary"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="shrink-0 min-h-11 px-4 bg-primary hover:bg-white text-black font-black uppercase tracking-wider text-xs transition-colors disabled:opacity-60"
                >
                  {loading ? "..." : "Join"}
                </button>
              </form>
              {error && (
                <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-rose-400">
                  <AlertCircle size={14} className="shrink-0" /> {error}
                </p>
              )}
            </>
          )}
        </div>
      </div>,
      document.body
    );
  }

  const modalContent = (
    <div
      id="newsletter-modal-portal"
      // Sits below the fixed header (z-[100]) so the header nav and "Get a Free Quote" stay clickable while it is open
      className="fixed inset-0 z-[90] flex items-end md:items-center justify-center p-0 md:p-6 md:pt-28 bg-black/75 backdrop-blur-sm animate-[overlayIn_0.25s_ease-out]"
      onClick={handleClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="newsletter-modal-title"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full md:max-w-3xl md:grid md:grid-cols-12 bg-white md:border border-[#1a1a1a] shadow-2xl max-h-[92dvh] md:max-h-[calc(100dvh-9rem)] overflow-y-auto overscroll-contain md:overflow-hidden rounded-t-3xl md:rounded-none animate-[sheetUp_0.35s_cubic-bezier(0.22,1,0.36,1)] md:animate-[popIn_0.3s_ease-out]"
      >
        {/* Close */}
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close dialog"
          className="absolute top-5 right-4 md:top-0 md:right-0 z-30 size-10 flex items-center justify-center rounded-full md:rounded-none bg-white/10 md:bg-[#0a0a0a] text-white hover:bg-primary hover:text-black transition-colors"
        >
          <X size={18} />
        </button>

        {/* ── Left: brand panel ── */}
        <div className="md:col-span-5 relative bg-[#0a0a0a] text-white overflow-hidden">
          <div className="hazard-stripe h-1.5 md:h-2" aria-hidden />
          {/* Mobile sheet handle */}
          <div aria-hidden className="md:hidden absolute top-3.5 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-white/25 z-20" />
          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.06] pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
          <div aria-hidden className="absolute -bottom-10 -left-10 w-64 h-40 bg-primary/25 blur-[80px] pointer-events-none" />

          <div className="relative z-10 px-5 pt-7 pb-5 sm:px-7 md:p-9 md:h-full md:flex md:flex-col md:justify-between">
            <div className="inline-flex items-center gap-2 border border-primary/40 bg-primary/10 px-3 py-1.5 w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Elite Steel Concepts</span>
            </div>

            <div className="mt-4 md:mt-0 md:py-8">
              <p className="text-primary font-black uppercase tracking-[0.2em] text-[10px] mb-1.5 md:mb-3">Newsletter</p>
              <p className="text-[28px] sm:text-4xl md:text-5xl font-black uppercase tracking-tighter leading-[0.95] md:leading-[0.9]">
                Join the <span className="text-primary md:block">Club</span>
              </p>

              {/* Mobile: compact perk tiles */}
              <ul className="md:hidden mt-5 grid grid-cols-3 gap-2">
                {PERKS.map(({ icon: Icon, title }) => (
                  <li key={title} className="flex flex-col items-center text-center gap-2 bg-white/[0.04] border border-white/10 px-2 py-3">
                    <span className="size-8 bg-primary text-black flex items-center justify-center">
                      <Icon size={16} />
                    </span>
                    <span className="text-[11px] font-bold leading-tight text-gray-200">{title}</span>
                  </li>
                ))}
              </ul>

              <ul className="mt-7 space-y-4 hidden md:block">
                {PERKS.map(({ icon: Icon, title, text }) => (
                  <li key={title} className="flex items-start gap-3">
                    <span className="mt-0.5 size-8 shrink-0 bg-primary text-black flex items-center justify-center">
                      <Icon size={16} />
                    </span>
                    <span>
                      <span className="block text-sm font-bold text-white">{title}</span>
                      <span className="block text-xs text-gray-400 leading-relaxed">{text}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <p className="hidden md:block pt-4 border-t border-white/10 text-[10px] font-black uppercase tracking-widest text-gray-500">
              No spam · Unsubscribe anytime
            </p>
          </div>
        </div>

        {/* ── Right: form / success ── */}
        <div className="md:col-span-7 bg-white md:border-l-2 border-primary/30 flex flex-col justify-center">
          <div className="px-5 pt-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-8 sm:pt-8 md:p-12">
            {successMessage ? (
              <div className="text-center py-4" role="status" aria-live="polite">
                <div className="mx-auto mb-5 size-16 bg-primary/10 border-2 border-primary flex items-center justify-center">
                  <CheckCircle2 size={30} className="text-primary" />
                </div>
                <h2 id="newsletter-modal-title" className="text-2xl md:text-3xl font-black text-black uppercase tracking-tight leading-tight mb-3">
                  You&apos;re In!
                </h2>
                <p className="text-gray-600 leading-relaxed mb-8">{successMessage}</p>
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full bg-black hover:bg-primary hover:text-black text-white font-black uppercase tracking-wider text-xs px-8 py-4 transition-colors"
                >
                  Continue Browsing
                </button>
              </div>
            ) : (
              <>
                <div className="hidden md:flex size-12 mb-6 bg-black text-primary items-center justify-center">
                  <Mail size={22} />
                </div>
                <h2 id="newsletter-modal-title" className="text-xl sm:text-2xl md:text-3xl font-black text-black uppercase tracking-tight leading-tight mb-2 md:mb-3">
                  Be the First to Know
                </h2>
                <p className="text-[15px] md:text-base text-gray-600 leading-relaxed mb-5 md:mb-7">
                  Get new build reveals, expert food truck guides and shop announcements straight to your inbox.
                </p>

                <form onSubmit={handleSubmit} className="space-y-3" noValidate>
                  <label htmlFor="newsletter-modal-email" className="sr-only">Email address</label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <input
                      id="newsletter-modal-email"
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                      aria-invalid={Boolean(error)}
                      aria-describedby={error ? "newsletter-modal-error" : undefined}
                      className="w-full pl-12 pr-4 py-4 bg-[#f7f7f7] border border-gray-200 text-base font-medium text-black placeholder-gray-400 outline-none focus:bg-white focus:border-primary transition-colors"
                    />
                  </div>

                  {error && (
                    <p id="newsletter-modal-error" className="flex items-center gap-2 text-sm font-semibold text-rose-600">
                      <AlertCircle size={16} className="shrink-0" /> {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="group w-full inline-flex items-center justify-center gap-3 bg-primary hover:bg-black text-black hover:text-white font-black uppercase tracking-wider text-xs px-8 py-4 transition-colors disabled:opacity-60"
                  >
                    {loading ? "Subscribing..." : (
                      <>
                        Subscribe Now
                        <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>

                <button
                  type="button"
                  onClick={handleClose}
                  className="mt-2 md:mt-4 w-full min-h-11 text-center text-xs font-bold text-gray-400 hover:text-black underline-offset-4 hover:underline transition-colors"
                >
                  No thanks, maybe later
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
