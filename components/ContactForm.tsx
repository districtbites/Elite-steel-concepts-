"use client";

import React, { useState } from "react";
import Button from "./ui/Button";
import { submitContactForm } from "@/app/actions/contact";

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
         <div className="bg-green-50 border border-green-200 p-8 rounded-lg text-center">
             <h3 className="text-2xl font-bold text-green-800 mb-2">Message Sent!</h3>
             <p className="text-green-700">Thanks for contacting us! We'll be in touch shortly.</p>
             <Button onClick={() => setSuccess(false)} variant="outline" className="mt-6 border-green-600 text-green-700 hover:bg-green-100">
                 Send Another Message
             </Button>
         </div>
     )
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-bold uppercase tracking-wider text-gray-700">
            Full Name <span className="text-primary">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="w-full bg-gray-50 border border-gray-200 p-4 rounded-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            placeholder="John Doe"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-bold uppercase tracking-wider text-gray-700">
            Email Address <span className="text-primary">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="w-full bg-gray-50 border border-gray-200 p-4 rounded-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            placeholder="john@example.com"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="phone" className="text-sm font-bold uppercase tracking-wider text-gray-700">
          Phone Number
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          className="w-full bg-gray-50 border border-gray-200 p-4 rounded-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          placeholder="(555) 123-4567"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="message" className="text-sm font-bold uppercase tracking-wider text-gray-700">
          Tell us about your project <span className="text-primary">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="w-full bg-gray-50 border border-gray-200 p-4 rounded-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
          placeholder="I'm looking for a 16ft food truck..."
        />
      </div>

      <Button type="submit" size="lg" disabled={loading} className="w-full md:w-auto">
        {loading ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
};

export default ContactForm;
