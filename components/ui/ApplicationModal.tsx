"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, CheckCircle2, AlertCircle, Sparkles, Send } from "lucide-react";
import { submitNewsletter } from "@/app/actions/newsletter";

interface ApplicationModalProps {
  storageKey?: string;
}

export default function ApplicationModal({
  storageKey = "has_seen_application_modal_v1",
}: ApplicationModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Form State
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
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [storageKey]);

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
        setTimeout(() => {
          handleClose();
        }, 2000);
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

  const modalContent = (
    <div
      id="application-modal-portal"
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-6 overflow-y-auto bg-black/20 backdrop-blur-md animate-in fade-in duration-300"
    >
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 border border-gray-100 my-auto">
        <button
          onClick={handleClose}
          aria-label="Close dialog"
          className="absolute top-4 right-4 z-30 size-10 rounded-full bg-white/90 hover:bg-black hover:text-white text-gray-700 shadow-md flex items-center justify-center transition-all duration-200 border border-gray-200 focus:outline-none"
        >
          <X size={20} />
        </button>
        <div className="lg:col-span-6 relative bg-gradient-to-br from-[#0256cc] via-[#0066ff] to-[#0040a8] p-8 md:p-10 flex flex-col justify-between text-white overflow-hidden min-h-[380px] lg:min-h-[500px]">
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 size-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -top-16 -right-16 size-64 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20">
              <Sparkles size={14} className="text-yellow-300 animate-pulse" />
              <span className="text-xs font-black uppercase tracking-wider text-white">
                Elite Steel Concepts 2026
              </span>
            </div>
            <span className="bg-yellow-400 text-black text-[10px] font-black uppercase px-2.5 py-1 rounded-md shadow">
              2026 Intake
            </span>
          </div>

          <div className="relative z-10 my-auto py-6">
            <p className="text-cyan-200 font-bold uppercase tracking-[0.25em] text-xs mb-2">
              Dream. Build. Launch Globally.
            </p>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight uppercase leading-none mb-4 text-white drop-shadow-sm">
              Build Your <br />
              <span className="text-yellow-300">Custom Kitchen</span>
            </h2>

            <div className="space-y-2.5 mt-6 text-xs md:text-sm font-semibold text-white/90">
              <div className="flex items-center gap-2.5">
                <div className="size-5 rounded-full bg-white/20 flex items-center justify-center text-yellow-300">
                  ✓
                </div>
                <span>100% Health & Fire Code Compliant</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="size-5 rounded-full bg-white/20 flex items-center justify-center text-yellow-300">
                  ✓
                </div>
                <span>14+ Years Fabrication Experience</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="size-5 rounded-full bg-white/20 flex items-center justify-center text-yellow-300">
                  ✓
                </div>
                <span>Nationwide DMV Delivery & Support</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-4 border-t border-white/15 flex items-center justify-between text-xs text-white/80">
            <span className="font-semibold uppercase tracking-wider">
              Fast Turnaround Consultation
            </span>
            <span className="font-mono text-yellow-300 font-bold">
              Limited Slots
            </span>
          </div>
        </div>

        <div className="lg:col-span-6 p-8 md:p-10 flex flex-col justify-center bg-white relative">
          <div className="mb-6">
            <h3 className="text-2xl md:text-3xl font-black text-[#0066ff] tracking-tight mb-1">
              Let's Discuss Your Application
            </h3>
            <p className="text-xs text-gray-500 font-medium">
              Fill out the details below to receive expert guidance on your
              custom mobile unit.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm font-medium text-gray-800 placeholder-gray-400 outline-none focus:bg-white focus:border-[#0066ff] focus:ring-4 focus:ring-[#0066ff]/10 transition-all"
              />
            </div>

            <div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm font-medium text-gray-800 placeholder-gray-400 outline-none focus:bg-white focus:border-[#0066ff] focus:ring-4 focus:ring-[#0066ff]/10 transition-all"
              />
            </div>

            <div>
              <input
                type="tel"
                placeholder="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full px-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm font-medium text-gray-800 placeholder-gray-400 outline-none focus:bg-white focus:border-[#0066ff] focus:ring-4 focus:ring-[#0066ff]/10 transition-all"
              />
            </div>

            <div>
              <input
                type="text"
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                className="w-full px-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm font-medium text-gray-800 placeholder-gray-400 outline-none focus:bg-white focus:border-[#0066ff] focus:ring-4 focus:ring-[#0066ff]/10 transition-all"
              />
            </div>

            <div>
              <input
                type="text"
                placeholder="Where You Want to Go!"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full px-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm font-medium text-gray-800 placeholder-gray-400 outline-none focus:bg-white focus:border-[#0066ff] focus:ring-4 focus:ring-[#0066ff]/10 transition-all"
              />
            </div>

            {status && (
              <div
                className={`p-3.5 rounded-xl flex items-center gap-3 text-xs font-bold uppercase tracking-wider ${
                  status.type === "success"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-rose-50 text-rose-700 border border-rose-200"
                }`}
              >
                {status.type === "success" ? (
                  <CheckCircle2 size={18} />
                ) : (
                  <AlertCircle size={18} />
                )}
                <span>{status.message}</span>
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-auto px-8 py-4 bg-[#0066ff] hover:bg-[#0052cc] text-white font-bold text-sm rounded-xl shadow-lg shadow-[#0066ff]/25 flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50"
              >
                {loading ? (
                  "Submitting..."
                ) : (
                  <>
                    Book Consultancy <Send size={15} />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
