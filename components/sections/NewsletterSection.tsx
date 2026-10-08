"use client";

import React, { useState } from "react";
import { ChevronRight, CheckCircle2, AlertCircle } from "lucide-react";
import { submitNewsletter } from "@/app/actions/newsletter";

const NewsletterSection = () => {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setStatus(null);

        const formData = new FormData();
        formData.append("email", email);
        
        const result = await submitNewsletter(formData);

        if (result.error) {
            setStatus({ type: 'error', message: result.error });
        } else {
            setStatus({ type: 'success', message: result.message || "Email submitted successfully!" });
            setEmail("");
        }
        setLoading(false);

        // Auto-hide status after 5 seconds
        setTimeout(() => setStatus(null), 5000);
    };

    return (
        <section className="bg-secondary py-20 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Text Column */}
                    <div className="space-y-4">
                        <h1 className="text-primary font-medium uppercase tracking-[0.3em] text-sm">
                            Be The First To Find Out About Our Announcements!
                        </h1>
                        <h2 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter leading-none">
                            JOIN THE <br />
                            <span className="text-white/90">CLUB</span>
                        </h2>
                    </div>

                    {/* Form Column */}
                    <div className="relative">
                        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-stretch">
                            <div className="flex-1 relative">
                                <input 
                                    type="email" 
                                    placeholder="Your Email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full bg-white px-8 py-5 text-secondary font-bold outline-none focus:ring-4 focus:ring-primary/20 transition-all text-lg"
                                />
                            </div>
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="bg-primary text-secondary px-10 py-5 font-black uppercase text-sm tracking-widest flex items-center justify-center gap-3 hover:bg-white transition-all group disabled:opacity-50"
                            >
                                {loading ? "SENDING..." : (
                                    <>
                                        SEND <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Status Message (Pop up) */}
                        {status && (
                            <div className={`absolute top-full left-0 right-0 mt-6 p-4 rounded-xl flex items-center gap-3 animate-fadeIn shadow-2xl z-20 ${
                                status.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                            }`}>
                                {status.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                                <p className="text-xs font-black uppercase tracking-widest">{status.message}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Subtle background decoration */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 -skew-x-12 translate-x-1/2 pointer-events-none" />
        </section>
    );
};

export default NewsletterSection;
