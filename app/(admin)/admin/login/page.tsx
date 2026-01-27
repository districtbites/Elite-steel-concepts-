"use client";

import React, { useState } from "react"; // Added React import (implicitly needed for JSX in some setups, good practice)
import { login } from "@/app/actions/auth";
import Button from "@/components/ui/Button";
import { Lock } from "lucide-react";

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
      <div className="bg-white w-full max-w-md p-8 rounded-lg shadow-lg border border-gray-200">
        <div className="text-center mb-8">
           <div className="bg-secondary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-secondary">
              <Lock size={32} />
           </div>
           <h1 className="text-2xl font-black uppercase text-secondary">Admin Access</h1>
           <p className="text-gray-500">Please enter your password to continue.</p>
        </div>

        <form action={handleSubmit} className="space-y-6">
           <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-wider text-gray-700">Password</label>
              <input 
                type="password" 
                name="password" 
                required 
                className="w-full bg-gray-50 border border-gray-200 p-4 rounded-sm outline-none focus:border-primary transition-all"
                placeholder="Enter password"
              />
           </div>

           {error && (
             <div className="text-red-500 text-sm font-bold text-center bg-red-50 p-2 rounded">
               {error}
             </div>
           )}

           <Button type="submit" disabled={loading} className="w-full bg-secondary text-white hover:bg-primary hover:text-secondary h-12">
             {loading ? "Verifying..." : "Login"}
           </Button>
        </form>
      </div>
    </div>
  );
}
