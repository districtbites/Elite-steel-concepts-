"use client";

import React, { useState } from "react";
import { submitContactForm } from "@/app/actions/contact";
import { ArrowRight, CheckCircle2 } from "lucide-react";

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
      alert("System Error: Transmission failed. Please try again.");
    }
  };

  if (success) {
     return (
         <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-10 flex flex-col items-center justify-center text-center relative overflow-hidden group">
             {/* Background Grid */}
             <div className="absolute inset-0 pointer-events-none opacity-[0.05]" style={{ backgroundImage: "repeating-linear-gradient(0deg, #fff 0px, #fff 1px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, #fff 0px, #fff 1px, transparent 1px, transparent 40px)" }} />
             
             <CheckCircle2 size={48} className="text-primary mb-6 relative z-10" />
             <h3 className="text-2xl font-black uppercase text-white tracking-tighter mb-2 relative z-10">Transmission Successful</h3>
             <p className="text-gray-400 text-sm font-bold tracking-widest uppercase mb-8 relative z-10">Our engineering team has received your brief.</p>
             <button 
                 onClick={() => setSuccess(false)} 
                 className="relative z-10 border border-white/20 text-white font-black uppercase tracking-[0.2em] text-[10px] px-8 py-4 hover:bg-primary hover:text-black hover:border-primary transition-colors"
             >
                 Submit Another Inquiry
             </button>
         </div>
     )
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <label htmlFor="name" className="text-[10px] font-black uppercase tracking-[0.2em] text-black flex items-center gap-2">
             <div className="w-1.5 h-1.5 bg-primary shrink-0" /> Operator Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="w-full bg-white border border-gray-200 p-4 outline-none focus:border-black transition-colors text-sm font-bold uppercase placeholder:text-gray-300"
            placeholder="JOHN DOE"
          />
        </div>
        <div className="space-y-3">
          <label htmlFor="email" className="text-[10px] font-black uppercase tracking-[0.2em] text-black flex items-center gap-2">
             <div className="w-1.5 h-1.5 bg-primary shrink-0" /> Comms Channel (Email)
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="w-full bg-white border border-gray-200 p-4 outline-none focus:border-black transition-colors text-sm font-bold uppercase placeholder:text-gray-300"
            placeholder="JD@EXAMPLE.COM"
          />
        </div>
      </div>

      <div className="space-y-3">
        <label htmlFor="phone" className="text-[10px] font-black uppercase tracking-[0.2em] text-black flex items-center gap-2">
           <div className="w-1.5 h-1.5 bg-gray-300 shrink-0" /> Direct Line (Optional)
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          className="w-full bg-white border border-gray-200 p-4 outline-none focus:border-black transition-colors text-sm font-bold uppercase placeholder:text-gray-300"
          placeholder="(555) 123-4567"
        />
      </div>

      <div className="space-y-3">
        <label htmlFor="message" className="text-[10px] font-black uppercase tracking-[0.2em] text-black flex items-center gap-2">
           <div className="w-1.5 h-1.5 bg-primary shrink-0" /> Project Brief
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          className="w-full bg-white border border-gray-200 p-4 outline-none focus:border-black transition-colors text-sm font-bold uppercase placeholder:text-gray-300 resize-none"
          placeholder="ENTER SPECIFICATIONS FOR YOUR 16FT FOOD TRUCK..."
        />
      </div>

      <button 
         type="submit" 
         disabled={loading} 
         className="w-full md:w-auto bg-[#0a0a0a] text-white px-10 py-5 font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 hover:bg-primary hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed group border border-[#1a1a1a]"
      >
        {loading ? "Transmitting..." : "Initialize Communication"} <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
      </button>
    </form>
  );
};

export default ContactForm;
