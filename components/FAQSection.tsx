"use client";

import React, { useState } from "react";
import { Plus, Minus, HelpCircle } from "lucide-react";
import Container from "./ui/Container";

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

interface FAQSectionProps {
  faqs: FAQ[];
  plainHeading?: boolean;
  eyebrowAsH1?: boolean;
}

const FAQSection = ({ faqs, plainHeading = false, eyebrowAsH1 = true }: FAQSectionProps) => {
  const EyebrowTag = eyebrowAsH1 ? "h1" : "span";
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id || null);

  if (!faqs || faqs.length === 0) return null;

  return (
    <section className="py-8 md:py-12 bg-white border-t border-gray-100">
      <Container>
        <div className="flex flex-col lg:flex-row gap-16">
          <div className="w-full lg:w-1/3">
            <div className="sticky top-24">
              <EyebrowTag className="text-primary font-bold tracking-widest uppercase text-sm mb-4 block">Got Questions?</EyebrowTag>
              <h2 className="text-4xl font-black uppercase text-secondary tracking-tight mb-6 leading-tight">
                Frequently Asked <span className={plainHeading ? "" : "text-primary"}>Questions</span>
              </h2>
              <p className="text-gray-500 mb-8 leading-relaxed">
                Everything you need to know about starting your custom build. If you don't find your answer here, feel free to contact us.
              </p>
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-white p-3 rounded-xl text-primary shadow-sm">
                    <HelpCircle size={24} />
                  </div>
                  <h4 className="font-bold text-secondary">Need Help?</h4>
                </div>
                <p className="text-sm text-gray-500 mb-4">Our fabrication consultants are ready to discuss your project specifics.</p>
                <a 
                  href="/contact" 
                  className="text-sm font-black uppercase text-primary hover:text-secondary transition-colors inline-flex items-center"
                >
                  Contact Support 
                </a>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-2/3 space-y-4">
            {faqs.map((faq) => {
              const isOpen = openId === faq.id;
              return (
                <div 
                  key={faq.id} 
                  className={`border rounded-2xl transition-all duration-300 overflow-hidden ${
                    isOpen 
                    ? "border-primary/30 bg-primary/5 shadow-md" 
                    : "border-gray-100 hover:border-gray-200 bg-white shadow-sm"
                  }`}
                >
                  <button
                    onClick={() => setOpenId(isOpen ? null : faq.id)}
                    className="w-full p-6 text-left flex items-center justify-between group"
                  >
                    <span className={`text-lg font-bold transition-colors ${isOpen ? "text-secondary" : "text-gray-700 group-hover:text-secondary"}`}>
                      {faq.question}
                    </span>
                    <div className={`shrink-0 ml-4 p-1 rounded-lg transition-all ${isOpen ? "bg-primary text-secondary rotate-180" : "bg-gray-50 text-gray-400"}`}>
                      {isOpen ? <Minus size={20} /> : <Plus size={20} />}
                    </div>
                  </button>
                  <div 
                    className={`transition-all duration-300 ease-in-out ${
                      isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="px-6 pb-6 text-gray-600 leading-relaxed font-light">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default FAQSection;
