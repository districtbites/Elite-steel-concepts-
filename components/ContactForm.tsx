"use client";

import React, { useState } from "react";
import { submitContactForm } from "@/app/actions/contact";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const inputClass =
  "w-full bg-white border border-gray-200 px-4 py-3 outline-none focus:border-primary transition-colors text-sm text-black placeholder:text-gray-400";

const ContactForm = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    const result = await submitContactForm(formData);
    setLoading(false);
    
    if (result && result.success) {
      setSuccess(true);
    } else {
      alert("Something went wrong. Please try again.");
    }
  };

  if (success) {
     return (
         <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-10 flex flex-col items-center justify-center text-center relative overflow-hidden group">
             {/* Background Grid */}
             <div className="absolute inset-0 pointer-events-none opacity-[0.05]" style={{ backgroundImage: "repeating-linear-gradient(0deg, #fff 0px, #fff 1px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, #fff 0px, #fff 1px, transparent 1px, transparent 40px)" }} />
             
             <CheckCircle2 size={48} className="text-primary mb-6 relative z-10" />
             <h3 className="text-2xl font-black uppercase text-white tracking-tighter mb-2 relative z-10">Message Sent</h3>
             <p className="text-gray-400 text-sm font-bold tracking-widest uppercase mb-8 relative z-10">Thank you! Our team member will get back to you shortly.</p>
             <button 
                 onClick={() => setSuccess(false)} 
                 className="relative z-10 border border-white/20 text-white font-black uppercase tracking-[0.2em] text-[10px] px-8 py-4 hover:bg-primary hover:text-black hover:border-primary transition-colors"
             >
                 Send Another Message
             </button>
         </div>
     )
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <input
        type="text"
        id="name"
        name="name"
        required
        aria-label="First Name"
        autoComplete="given-name"
        className={inputClass}
        placeholder="First Name"
      />
      <input
        type="tel"
        id="phone"
        name="phone"
        required
        aria-label="Phone Number"
        autoComplete="tel"
        className={inputClass}
        placeholder="Phone Number"
      />
      <input
        type="email"
        id="email"
        name="email"
        required
        aria-label="Email Address"
        autoComplete="email"
        className={inputClass}
        placeholder="Email Address"
      />
      <textarea
        id="message"
        name="message"
        required
        rows={5}
        aria-label="Your Message"
        className={`${inputClass} resize-none`}
        placeholder="Your Message"
      />

      <button 
         type="submit" 
         disabled={loading} 
         className="w-full md:w-auto bg-primary text-black px-10 py-4 font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 hover:bg-[#0a0a0a] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
      >
        {loading ? "Sending..." : "Send Message"} <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
      </button>
    </form>
  );
};

export default ContactForm;
