"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";
import { submitNewsletter } from "@/app/actions/newsletter";

interface ApplicationModalProps {
  storageKey?: string;
}

const TRUST_POINTS = [
  "100% Health & Fire Code Compliant",
  "14+ Years Fabrication Experience",
  "DMV-Backed Nationwide Delivery Available",
];

export default function ApplicationModal({
  storageKey = "has_seen_application_modal_v1",
}: ApplicationModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [destination, setDestination] = useState("");

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    setMounted(true);
    const hasSeen = sessionStorage.getItem(storageKey);
    if (!hasSeen) {
      const timer = setTimeout(() => setIsOpen(true), 600);
      return () => clearTimeout(timer);
    }
  }, [storageKey]);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  const handleClose = () => {
    sessionStorage.setItem(storageKey, "true");
    setIsOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("city", city);
      formData.append("destination", destination);

      const result = await submitNewsletter(formData);

      if (result.error) {
        setStatus({ type: "error", message: result.error });
      } else {
        setStatus({
          type: "success",
          message: result.message || "Application submitted successfully!",
        });
        setTimeout(handleClose, 2000);
      }
    } catch {
      setStatus({
        type: "error",
        message: "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!mounted || !isOpen) return null;

  const inputClass =
    "w-full px-4 py-3 bg-[#f7f7f7] border border-gray-200 text-base sm:text-sm font-medium text-black placeholder-gray-400 outline-none focus:bg-white focus:border-primary transition-colors";

  const modalContent = (
    <div
      id="application-modal-portal"
      className="fixed inset-0 z-[9999] flex items-end md:items-center justify-center p-0 md:p-6 bg-black/70 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="application-modal-title"
        onClick={(e) => e.stopPropagation()}
        className="relative flex flex-col w-full md:max-w-4xl md:grid md:grid-cols-12 bg-white md:border border-[#1a1a1a] shadow-2xl max-h-[94dvh] md:max-h-[90vh] rounded-t-2xl md:rounded-none overflow-hidden"
      >
        {/* Mobile: sticky top bar */}
        <div className="md:hidden shrink-0 flex items-center justify-between gap-3 px-4 py-3 bg-[#0a0a0a] border-b border-[#1a1a1a]">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-1.5 h-1.5 shrink-0 rounded-full bg-primary" />
            <span className="text-[10px] font-black uppercase tracking-wider text-primary truncate">
              Elite Steel Concepts
            </span>
          </div>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close dialog"
            className="shrink-0 size-9 flex items-center justify-center bg-white/10 text-white hover:bg-primary hover:text-black transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Desktop close */}
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close dialog"
          className="hidden md:flex absolute top-0 right-0 z-30 size-10 bg-[#0a0a0a] hover:bg-primary text-white hover:text-black items-center justify-center transition-colors focus:outline-none"
        >
          <X size={18} />
        </button>

        {/* Scrollable body on mobile (banner + form) */}
        <div className="flex flex-col md:contents min-h-0 flex-1 overflow-y-auto overscroll-contain">
          {/* Banner */}
          <div className="md:col-span-5 relative bg-[#0a0a0a] text-white shrink-0 md:flex md:flex-col md:overflow-hidden">
            <div className="hazard-stripe h-2 hidden md:block" aria-hidden />

            <div
              aria-hidden
              className="absolute inset-0 opacity-[0.06] pointer-events-none hidden md:block"
              style={{
                backgroundImage:
                  "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
            />
            <div
              aria-hidden
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[280px] h-[120px] bg-primary/20 blur-[80px] pointer-events-none"
            />

            <div className="relative z-10 p-5 md:p-9 md:flex md:flex-col md:justify-between md:flex-1">
              {/* Desktop badge */}
              <div className="hidden md:flex items-center gap-3 pr-10">
                <div className="flex items-center gap-2 border border-primary/40 bg-primary/10 px-3 py-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                    Elite Steel Concepts
                  </span>
                </div>
              </div>

              <div className="md:py-8">
                <p className="text-primary font-black uppercase tracking-[0.2em] text-[10px] mb-2 md:mb-3">
                  Free Quote
                </p>
                <h2
                  id="application-modal-title"
                  className="text-xl md:text-4xl font-black tracking-tight uppercase leading-tight md:leading-[0.92] text-white"
                >
                  <span className="md:hidden">Plan Your </span>
                  <span className="hidden md:inline">
                    Build Your
                    <br />
                  </span>
                  <span className="text-primary">Custom Mobile Kitchen</span>
                </h2>

                {/* Mobile: compact trust line */}
                <p className="mt-3 text-[11px] leading-relaxed text-gray-400 md:hidden">
                  Code compliant · 14+ years · Nationwide delivery
                </p>

                {/* Desktop: full list */}
                <ul className="mt-6 space-y-3 hidden md:block">
                  {TRUST_POINTS.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-sm font-medium text-gray-300"
                    >
                      <span className="mt-0.5 size-5 shrink-0 bg-primary text-black flex items-center justify-center text-[10px] font-black">
                        ✓
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="hidden md:flex pt-4 border-t border-white/10 items-center justify-between gap-3 text-[10px] font-black uppercase tracking-widest">
                <span className="text-gray-400">Fast Consultation</span>
                <span className="text-primary">24/7 Support</span>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="md:col-span-7 bg-white md:border-l-2 border-primary/30 md:overflow-y-auto md:min-h-0">
            <div className="p-5 pb-8 sm:p-8 md:p-10 md:pb-10">
              <div className="mb-5 md:mb-6 md:pr-8">
                <div className="hidden md:flex items-center gap-3 mb-3">
                  <div className="h-px w-8 bg-primary" />
                  <span className="text-primary text-[10px] font-black uppercase tracking-[0.25em]">
                    Free Quote
                  </span>
                </div>
                <h3 className="hidden md:block text-2xl sm:text-3xl font-black text-black uppercase tracking-tight leading-tight mb-2">
                  Let&apos;s Discuss Your Build
                </h3>
                <p className="text-sm text-gray-600 md:text-gray-500 leading-relaxed">
                  Tell us about your vision — we&apos;ll help you plan the right
                  custom food truck or trailer.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoComplete="name"
                  className={inputClass}
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className={inputClass}
                />
                <input
                  type="tel"
                  placeholder="Phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  autoComplete="tel"
                  className={inputClass}
                />
                <input
                  type="text"
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                  autoComplete="address-level2"
                  className={inputClass}
                />
                <input
                  type="text"
                  placeholder="What do you want to build?"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className={inputClass}
                />

                {status && (
                  <div
                    className={`p-3 flex items-start gap-3 text-xs font-bold uppercase tracking-wide border ${
                      status.type === "success"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-rose-50 text-rose-700 border-rose-200"
                    }`}
                  >
                    {status.type === "success" ? (
                      <CheckCircle2 size={18} className="shrink-0" />
                    ) : (
                      <AlertCircle size={18} className="shrink-0" />
                    )}
                    <span>{status.message}</span>
                  </div>
                )}

                <div className="pt-2 pb-safe">
                  <button
                    type="submit"
                    disabled={loading}
                    className="group w-full inline-flex items-center justify-center gap-3 bg-primary hover:bg-orange-600 text-white font-black uppercase tracking-wider text-xs px-8 py-4 transition-all shadow-lg shadow-primary/25 disabled:opacity-50"
                  >
                    {loading ? (
                      "Submitting..."
                    ) : (
                      <>
                        Get a Free Quote
                        <ArrowRight
                          size={14}
                          className="group-hover:translate-x-1 transition-transform"
                        />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
