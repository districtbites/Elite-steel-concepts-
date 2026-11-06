"use client";

import React, { useState } from "react";
import Button from "@/components/ui/Button";
import { Lock, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { resetPassword } from "@/app/actions/auth";

export default function ForgotPasswordPage() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error", text: string } | null>(null);

    const handleSubmit = async (formData: FormData) => {
        setLoading(true);
        setMessage(null);
        
        const email = formData.get("email") as string;
        const result = await resetPassword(email);
        
        if (result?.error) {
            setMessage({ type: "error", text: result.error });
        } else if (result?.success) {
            setMessage({ type: "success", text: result.success });
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
            <Link href="/admin/login" className="mb-8 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-admin-muted hover:text-primary transition-colors">
                <ArrowLeft size={14} /> Back to Login
            </Link>

            <div className="bg-admin-surface w-full max-w-md p-8 shadow-lg border border-admin-border">
                <div className="text-center mb-8">
                    <div className="bg-admin-surface border border-admin-text w-16 h-16 flex items-center justify-center mx-auto mb-4 text-admin-text">
                        <Lock size={32} />
                    </div>
                    <h1 className="text-2xl font-black uppercase text-admin-text">System Reset</h1>
                    <p className="text-admin-muted mt-2 text-xs uppercase tracking-widest font-bold">Request a temporary password.</p>
                </div>

                {message?.type === "success" ? (
                    <div className="space-y-6 text-center">
                        <div className="text-primary text-sm font-bold bg-primary/10 p-4 border border-primary/20">
                            {message.text}
                        </div>
                        <p className="text-admin-muted text-xs">Please check your inbox (and spam folder) for the temporary access credentials.</p>
                    </div>
                ) : (
                    <form action={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold uppercase tracking-wider text-admin-text">Email Address</label>
                                <input 
                                    type="email" 
                                    name="email" 
                                    required 
                                    className="w-full bg-admin-bg border border-admin-border p-4 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-admin-text font-bold placeholder:text-admin-muted/50"
                                    placeholder="operative@esc.com"
                                />
                            </div>
                        </div>

                        {message?.type === "error" && (
                            <div className="text-red-500 text-sm font-bold text-center bg-red-50 p-2 border border-red-200">
                                {message.text}
                            </div>
                        )}

                        <Button type="submit" disabled={loading} className="w-full bg-admin-surface border-2 border-admin-text text-admin-text hover:bg-primary hover:border-primary hover:text-admin-surface h-12 uppercase font-black tracking-widest">
                            {loading ? "Transmitting..." : "Send Reset Link"}
                        </Button>
                    </form>
                )}
            </div>
        </div>
    );
}
