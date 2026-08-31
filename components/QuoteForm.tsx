"use client";

import React, { useState } from "react";
import Button from "./ui/Button";
import { submitQuoteForm } from "@/app/actions/quote";
import { Check, Truck, Shield } from "lucide-react";

const QuoteForm = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [projectType, setProjectType] = useState("Food Truck");

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    const result = await submitQuoteForm(formData);
    setLoading(false);
    
    if (result && result.success) {
        setSuccess(true);
    } else {
        alert("Transmission failed. Re-initialize and try again.");
    }
  };

  if (success) {
      return (
          <div className="bg-black border-2 border-[#1a1a1a] p-12 md:p-20 text-center relative">
              <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "repeating-linear-gradient(45deg, #fff 0px, #fff 1px, transparent 1px, transparent 10px)" }} />
              
              <div className="w-24 h-24 bg-[#0a0a0a] flex items-center justify-center mx-auto mb-10 border border-[#1a1a1a] relative z-10">
                  <Check className="w-10 h-10 text-primary" strokeWidth={3} />
              </div>
              
              <h3 className="text-4xl md:text-5xl font-black uppercase text-white tracking-tighter mb-6 relative z-10">
                  Blueprints <span className="text-primary italic">Received</span>
              </h3>
              
              <p className="text-gray-400 font-bold text-sm tracking-widest uppercase leading-relaxed max-w-xl mx-auto mb-10 relative z-10">
                  Specifications have been transmitted. Our engineering team is analyzing your payload and will initialize contact shortly.
              </p>
              
              <div className="relative z-10">
                 <Button onClick={() => setSuccess(false)} variant="outline" className="border-white text-white hover:bg-white hover:text-black">
                     Initialize New Quote
                 </Button>
              </div>
          </div>
      )
  }

  return (
    <form action={handleSubmit} className="space-y-12 bg-black p-8 md:p-12 border-2 border-[#1a1a1a]">
      
      {/* 01. Contact Info */}
      <div className="space-y-8">
        <div className="flex items-center gap-4 border-b border-[#1a1a1a] pb-4">
           <div className="bg-primary text-black w-10 h-10 flex items-center justify-center font-black text-lg border border-black">01</div>
           <h3 className="text-2xl font-black uppercase text-white tracking-tighter">Contact Specs</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label htmlFor="name" className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Full Name <span className="text-primary">*</span></label>
            <input type="text" id="name" name="name" required className="w-full bg-[#0a0a0a] border border-[#1a1a1a] p-4 outline-none focus:border-primary transition-colors text-white font-black uppercase tracking-widest text-xs placeholder:text-gray-600" placeholder="JOHN DOE" />
          </div>
          <div className="space-y-3">
            <label htmlFor="email" className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Email Address <span className="text-primary">*</span></label>
            <input type="email" id="email" name="email" required className="w-full bg-[#0a0a0a] border border-[#1a1a1a] p-4 outline-none focus:border-primary transition-colors text-white font-black uppercase tracking-widest text-xs placeholder:text-gray-600" placeholder="JOHN@COMPANY.COM" />
          </div>
          <div className="space-y-3">
            <label htmlFor="phone" className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Phone Number <span className="text-primary">*</span></label>
            <input type="tel" id="phone" name="phone" required className="w-full bg-[#0a0a0a] border border-[#1a1a1a] p-4 outline-none focus:border-primary transition-colors text-white font-black uppercase tracking-widest text-xs placeholder:text-gray-600" placeholder="555-0199" />
          </div>
          <div className="space-y-3">
            <label htmlFor="company" className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Company Name</label>
            <input type="text" id="company" name="company" className="w-full bg-[#0a0a0a] border border-[#1a1a1a] p-4 outline-none focus:border-primary transition-colors text-white font-black uppercase tracking-widest text-xs placeholder:text-gray-600" placeholder="OPTIONAL" />
          </div>
        </div>
      </div>

      {/* 02. Core Build Details */}
      <div className="space-y-8">
        <div className="flex items-center gap-4 border-b border-[#1a1a1a] pb-4">
           <div className="bg-primary text-black w-10 h-10 flex items-center justify-center font-black text-lg border border-black">02</div>
           <h3 className="text-2xl font-black uppercase text-white tracking-tighter">Core Architecture</h3>
        </div>

        {/* Interactive Build Type Selection */}
        <div className="space-y-4">
           <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Select Platform <span className="text-primary">*</span></label>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['Food Truck', 'Concession Trailer', 'Custom Container'].map((type) => (
                 <label key={type} className="cursor-pointer group">
                    <input type="radio" name="projectType" value={type} className="peer sr-only" checked={projectType === type} onChange={(e) => setProjectType(e.target.value)} />
                    <div className="p-6 border border-[#1a1a1a] bg-[#0a0a0a] text-gray-500 peer-checked:border-primary peer-checked:text-primary transition-colors flex flex-col items-center text-center gap-4 hover:border-white hover:text-white">
                       <Truck className="w-8 h-8" />
                       <span className="font-black uppercase tracking-[0.2em] text-[10px]">{type}</span>
                    </div>
                 </label>
              ))}
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="space-y-3">
            <label htmlFor="budget" className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Capital Allocation (Budget)</label>
            <select id="budget" name="budget" className="w-full bg-[#0a0a0a] border border-[#1a1a1a] p-4 outline-none focus:border-primary transition-colors text-white font-black uppercase tracking-widest text-xs appearance-none cursor-pointer">
              <option value="">Select Range</option>
              <option value="Under 30k">Under $30,000</option>
              <option value="30k-50k">$30,000 - $50,000</option>
              <option value="50k-80k">$50,000 - $80,000</option>
              <option value="80k-120k">$80,000 - $120,000</option>
              <option value="120k+">$120,000+</option>
            </select>
          </div>
          <div className="space-y-3">
             <label htmlFor="timeline" className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Deployment Timeline</label>
             <select id="timeline" name="timeline" className="w-full bg-[#0a0a0a] border border-[#1a1a1a] p-4 outline-none focus:border-primary transition-colors text-white font-black uppercase tracking-widest text-xs appearance-none cursor-pointer">
              <option value="">Select Target Date</option>
              <option value="ASAP">Immediate Start</option>
              <option value="1-3 Months">1-3 Months</option>
              <option value="3-6 Months">3-6 Months</option>
              <option value="Planning">Just Researching</option>
            </select>
          </div>
          <div className="space-y-3">
            <label htmlFor="sourcing" className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Chassis Procurement</label>
            <select id="sourcing" name="sourcing" className="w-full bg-[#0a0a0a] border border-[#1a1a1a] p-4 outline-none focus:border-primary transition-colors text-white font-black uppercase tracking-widest text-xs appearance-none cursor-pointer">
              <option value="Need Vehicle">Source Vehicle For Me</option>
              <option value="Have Vehicle">I Will Provide Vehicle</option>
            </select>
          </div>
          <div className="space-y-3">
             <label htmlFor="dimensions" className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Preferred Dimensions</label>
             <input type="text" id="dimensions" name="dimensions" className="w-full bg-[#0a0a0a] border border-[#1a1a1a] p-4 outline-none focus:border-primary transition-colors text-white font-black uppercase tracking-widest text-xs placeholder:text-gray-600" placeholder="16FT STEP VAN" />
          </div>
        </div>
      </div>

      {/* 03. Engineering & Culinary Requirements */}
      <div className="space-y-8">
        <div className="flex items-center gap-4 border-b border-[#1a1a1a] pb-4">
           <div className="bg-primary text-black w-10 h-10 flex items-center justify-center font-black text-lg border border-black">03</div>
           <h3 className="text-2xl font-black uppercase text-white tracking-tighter">Engineering & Loadout</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="space-y-3">
              <label htmlFor="menuType" className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Culinary Concept</label>
              <input type="text" id="menuType" name="menuType" className="w-full bg-[#0a0a0a] border border-[#1a1a1a] p-4 outline-none focus:border-primary transition-colors text-white font-black uppercase tracking-widest text-xs placeholder:text-gray-600" placeholder="TACOS, PIZZA, BBQ..." />
           </div>
           <div className="space-y-3">
              <label htmlFor="powerRequirements" className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Power Requirements</label>
              <select id="powerRequirements" name="powerRequirements" className="w-full bg-[#0a0a0a] border border-[#1a1a1a] p-4 outline-none focus:border-primary transition-colors text-white font-black uppercase tracking-widest text-xs appearance-none cursor-pointer">
                <option value="Standard Gas">Standard Gas Generator</option>
                <option value="Quiet Diesel">Quiet Diesel Output</option>
                <option value="All Electric">All-Electric (Shore)</option>
                <option value="Unsure">Require Engineering Review</option>
              </select>
           </div>
        </div>

        <div className="space-y-3">
           <label htmlFor="equipment" className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Primary Equipment Needed</label>
           <input type="text" id="equipment" name="equipment" className="w-full bg-[#0a0a0a] border border-[#1a1a1a] p-4 outline-none focus:border-primary transition-colors text-white font-black uppercase tracking-widest text-xs placeholder:text-gray-600" placeholder="36IN GRIDDLE, FRYER, FRIDGE..." />
        </div>

        {/* Services Needed Multi-Select */}
        <div className="space-y-4">
           <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Add-On Integrations</label>
           <div className="flex flex-wrap gap-3">
              {['Full Wrap / Graphics', 'Fire Suppression System', 'Health Dept Consultation', 'Generator Install', 'Custom Porch Fab'].map((service) => (
                 <label key={service} className="cursor-pointer group">
                    <input type="checkbox" name="services" value={service} className="peer sr-only" />
                    <div className="px-5 py-3 border border-[#1a1a1a] bg-[#0a0a0a] text-gray-500 peer-checked:border-primary peer-checked:text-primary font-black uppercase tracking-[0.2em] text-[10px] transition-colors hover:border-white hover:text-white flex items-center gap-3">
                       <Shield className="w-3 h-3 peer-checked:text-primary" />
                       {service}
                    </div>
                 </label>
              ))}
           </div>
        </div>
      </div>

      {/* 04. Vision & Submit */}
      <div className="space-y-8">
        <div className="flex items-center gap-4 border-b border-[#1a1a1a] pb-4">
           <div className="bg-primary text-black w-10 h-10 flex items-center justify-center font-black text-lg border border-black">04</div>
           <h3 className="text-2xl font-black uppercase text-white tracking-tighter">Final Specifications</h3>
        </div>

        <div className="space-y-3">
          <label htmlFor="message" className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
            System Overrides / Notes <span className="text-primary">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={5}
            className="w-full bg-[#0a0a0a] border border-[#1a1a1a] p-4 outline-none focus:border-primary transition-colors resize-none text-white font-black uppercase tracking-widest text-xs placeholder:text-gray-600"
            placeholder="INCLUDE ANY UNIQUE LAYOUT REQUESTS OR WORKFLOW REQUIREMENTS..."
          />
        </div>
      </div>

      <div className="pt-8 border-t border-[#1a1a1a]">
        <button disabled={loading} type="submit" className="w-full bg-primary text-black py-6 border border-primary hover:bg-white transition-colors flex items-center justify-center gap-3">
          <span className="text-[10px] tracking-[0.2em] font-black uppercase">
            {loading ? "Transmitting..." : "Submit Fabrication Request"}
          </span>
        </button>
      </div>
    </form>
  );
};

export default QuoteForm;
