"use client";

import React, { useState } from "react";
import Button from "./ui/Button";
import { submitQuoteForm } from "@/app/actions/quote";

const QuoteForm = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    const result = await submitQuoteForm(formData);
    setLoading(false);
    
    if (result && result.success) {
        setSuccess(true);
    } else {
        alert("Something went wrong. Please try again.");
    }
  };

  if (success) {
      return (
          <div className="bg-green-50 border border-green-200 p-8 rounded-lg text-center">
              <h3 className="text-2xl font-bold text-green-800 mb-2">Quote Request Received!</h3>
              <p className="text-green-700">Thank you for reaching out. Our team will review your project details and get back to you shortly.</p>
              <Button onClick={() => setSuccess(false)} variant="outline" className="mt-6 border-green-600 text-green-700 hover:bg-green-100">
                  Send Another Request
              </Button>
          </div>
      )
  }

  return (
    <form action={handleSubmit} className="space-y-8 bg-white p-8 md:p-12 rounded-lg shadow-lg border border-gray-100">
      
      {/* Section 1: Contact Info */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold uppercase text-secondary border-b border-gray-100 pb-2">
          1. Contact Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-bold uppercase tracking-wider text-gray-700">Full Name <span className="text-primary">*</span></label>
            <input type="text" id="name" name="name" required className="w-full bg-gray-50 border border-gray-200 p-4 rounded-sm outline-none focus:border-primary transition-all" />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-bold uppercase tracking-wider text-gray-700">Email Address <span className="text-primary">*</span></label>
            <input type="email" id="email" name="email" required className="w-full bg-gray-50 border border-gray-200 p-4 rounded-sm outline-none focus:border-primary transition-all" />
          </div>
          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-bold uppercase tracking-wider text-gray-700">Phone Number <span className="text-primary">*</span></label>
            <input type="tel" id="phone" name="phone" required className="w-full bg-gray-50 border border-gray-200 p-4 rounded-sm outline-none focus:border-primary transition-all" />
          </div>
          <div className="space-y-2">
            <label htmlFor="company" className="text-sm font-bold uppercase tracking-wider text-gray-700">Company / Business Name</label>
            <input type="text" id="company" name="company" className="w-full bg-gray-50 border border-gray-200 p-4 rounded-sm outline-none focus:border-primary transition-all" />
          </div>
        </div>
      </div>

      {/* Section 2: Project Details */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold uppercase text-secondary border-b border-gray-100 pb-2">
          2. Project Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="space-y-2">
            <label htmlFor="projectType" className="text-sm font-bold uppercase tracking-wider text-gray-700">Type of Build</label>
            <select id="projectType" name="projectType" className="w-full bg-gray-50 border border-gray-200 p-4 rounded-sm outline-none focus:border-primary transition-all">
              <option value="Truck">Food Truck</option>
              <option value="Trailer">Concession Trailer</option>
              <option value="Cart">Food Cart</option>
              <option value="Container">Shipping Container Kitchen</option>
            </select>
          </div>
          <div className="space-y-2">
            <label htmlFor="sourcing" className="text-sm font-bold uppercase tracking-wider text-gray-700">Vehicle Sourcing</label>
            <select id="sourcing" name="sourcing" className="w-full bg-gray-50 border border-gray-200 p-4 rounded-sm outline-none focus:border-primary transition-all">
              <option value="Need Vehicle">I need you to source the vehicle</option>
              <option value="Have Vehicle">I already have a vehicle/trailer</option>
            </select>
          </div>
           <div className="space-y-2">
            <label htmlFor="budget" className="text-sm font-bold uppercase tracking-wider text-gray-700">Estimated Budget</label>
            <select id="budget" name="budget" className="w-full bg-gray-50 border border-gray-200 p-4 rounded-sm outline-none focus:border-primary transition-all">
              <option value="">Select Range</option>
              <option value="Under 30k">Under $30,000 (Trailers/Carts)</option>
              <option value="30k-50k">$30,000 - $50,000</option>
              <option value="50k-80k">$50,000 - $80,000</option>
              <option value="80k-120k">$80,000 - $120,000</option>
              <option value="120k+">$120,000+</option>
            </select>
          </div>
          <div className="space-y-2">
             <label htmlFor="timeline" className="text-sm font-bold uppercase tracking-wider text-gray-700">Desired Timeline</label>
             <select id="timeline" name="timeline" className="w-full bg-gray-50 border border-gray-200 p-4 rounded-sm outline-none focus:border-primary transition-all">
              <option value="">Select Timeline</option>
              <option value="ASAP">ASAP (Ready to start now)</option>
              <option value="1-3 Months">1-3 Months</option>
              <option value="3-6 Months">3-6 Months</option>
              <option value="Planning">Just Planning / Researching</option>
            </select>
          </div>
        </div>
        <div className="space-y-2">
           <label htmlFor="menuType" className="text-sm font-bold uppercase tracking-wider text-gray-700">Menu Concept (Tacos, BBQ, Coffee, etc.)</label>
           <input type="text" id="menuType" name="menuType" className="w-full bg-gray-50 border border-gray-200 p-4 rounded-sm outline-none focus:border-primary transition-all" placeholder="E.g. BBQ & Smoked Meats" />
        </div>
      </div>

      {/* Section 3: Additional Info */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold uppercase text-secondary border-b border-gray-100 pb-2">
          3. Additional Information
        </h3>
        <div className="space-y-2">
          <label htmlFor="message" className="text-sm font-bold uppercase tracking-wider text-gray-700">
            Tell us more about your vision <span className="text-primary">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={5}
            className="w-full bg-gray-50 border border-gray-200 p-4 rounded-sm outline-none focus:border-primary transition-all resize-none"
            placeholder="I need a 14ft hood, 3-compartment sink, and window on the passenger side..."
          />
        </div>
      </div>

      <div className="pt-4">
        <Button disabled={loading} type="submit" size="lg" className="w-full">
          {loading ? "Submitting..." : "Submit Quote Request"}
        </Button>
        <p className="text-xs text-gray-400 text-center mt-4">
          By submitting this form, you agree to being contacted by Elite Steel Concepts regarding your project.
        </p>
      </div>
    </form>
  );
};

export default QuoteForm;
