import React from "react";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import QuoteForm from "@/components/QuoteForm";

export default function QuotePage() {
  return (
    <>
      {/* Page Header */}
      <div className="bg-secondary pt-32 pb-16 md:pt-40 md:pb-24">
        <Container className="text-center">
          <h1 className="text-4xl md:text-6xl font-black uppercase text-white mb-4 tracking-tight">
            Request A Quote
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
             Provide us with the details of your dream build, and we'll help you price it out.
          </p>
        </Container>
      </div>

      <Section className="bg-gray-50">
        <Container>
          <div className="max-w-4xl mx-auto">
             <div className="mb-12 text-center">
                <h2 className="text-2xl font-bold uppercase text-secondary mb-4">
                  Let's Build specific to your needs
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  Every food truck is unique. To give you the most accurate estimate, we need to know what you're cooking, what equipment you need, and your budget goals. The more detail, the better.
                </p>
             </div>
             
             <QuoteForm />
          </div>
        </Container>
      </Section>
    </>
  );
}
