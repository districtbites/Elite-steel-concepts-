"use client";

import React, { useState } from"react"; // Added React import (implicitly needed for JSX in some setups, good practice)
import { login } from "@/app/actions/auth";
import Button from "@/components/ui/Button";
import { Lock } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
 const [error, setError] = useState("");
 const [loading, setLoading] = useState(false);

 // We need to wrap the server action to handle the error return
 // since server actions redirect on success, we only care about error return here
 const handleSubmit = async (formData: FormData) => {
 setLoading(true);
 setError("");
 
 const result = await login(formData); // This might throw a redirect, which is fine
 
 if (result?.error) {
 setError(result.error);
 setLoading(false);
 }
 };

 return (
 <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
 <div className="bg-admin-surface w-full max-w-md p-8 shadow-lg border border-admin-border">
 <div className="text-center mb-8">
 <div className="bg-admin-surface border border-admin-text w-16 h-16 flex items-center justify-center mx-auto mb-4 text-admin-text">
 <Lock size={32} />
 </div>
 <h1 className="text-2xl font-black uppercase text-admin-text">Admin Access</h1>
 <p className="text-admin-muted mt-2 text-xs uppercase tracking-widest font-bold">Please enter your credentials to continue.</p>
 </div>

 <form action={handleSubmit} className="space-y-6">
 <div className="space-y-4">
 <div className="space-y-2">
 <label className="text-sm font-bold uppercase tracking-wider text-admin-text">Email Address</label>
 <input 
 type="email" 
 name="email" 
 required 
 className="w-full bg-admin-bg border border-admin-border p-4 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-admin-text font-bold placeholder:text-admin-muted/50"
 placeholder="admin@esc.com"
 />
 </div>

 <div className="space-y-2">
 <div className="flex items-center justify-between">
    <label className="text-sm font-bold uppercase tracking-wider text-admin-text">Password</label>
    <Link href="/admin/forgot-password" className="text-[10px] font-black uppercase text-admin-muted hover:text-primary transition-colors">Forgot Password?</Link>
 </div>
 <input 
 type="password" 
 name="password" 
 required 
 className="w-full bg-admin-bg border border-admin-border p-4 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-admin-text font-bold placeholder:text-admin-muted/50"
 placeholder="Enter password"
 />
 </div>
 </div>

 {error && (
 <div className="text-red-500 text-sm font-bold text-center bg-red-50 p-2">
 {error}
 </div>
 )}

 <Button type="submit" disabled={loading} className="w-full bg-admin-surface text-admin-text hover:bg-primary hover:text-admin-text h-12">
 {loading ?"Verifying..." :"Login"}
 </Button>
 </form>
 </div>
 </div>
 );
}
