import React from "react";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import PageHeader from "@/components/ui/PageHeader";
import CTASection from "@/components/ui/CTASection";
import Button from "@/components/ui/Button";
import { getTestimonials } from "@/lib/db";
import { Star, Quote } from "lucide-react";

export default async function TestimonialsPage() {
  const testimonials = await getTestimonials();

  return (
    <>
      <PageHeader
        title="Client Reviews"
        subtitle="See what over a decade of custom fabrication experience looks like from our clients' perspective."
      />

      {/* Reviews Grid */}
      <Section className="bg-white">
        <Container>
            {testimonials.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    {testimonials.map((testimonial) => (
                        <div 
                        key={testimonial.id} 
                        className="bg-gray-50 border border-gray-100 p-8 rounded-xl relative flex flex-col hover:shadow-lg hover-lift transition-all duration-300"
                        >
                            <div className="flex gap-1 mb-6 text-primary">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                <Star key={i} size={18} fill="currentColor" />
                                ))}
                            </div>

                            <p className="text-gray-600 mb-8 italic leading-relaxed flex-grow">
                                &ldquo;{testimonial.content}&rdquo;
                            </p>

                            <div className="pt-6 border-t border-gray-200">
                                <h4 className="font-bold text-secondary text-lg mb-1">
                                {testimonial.clientName}
                                </h4>
                                {(testimonial.role || testimonial.company) && (
                                    <p className="text-primary text-xs uppercase tracking-wider font-bold">
                                    {testimonial.role}{testimonial.role && testimonial.company ? ", " : ""}{testimonial.company}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-200 mb-16">
                    <p className="text-gray-500 text-lg">No reviews yet. Check back soon!</p>
                </div>
            )}
        </Container>
      </Section>

      <CTASection
        title="Ready to Write Your Success Story?"
        subtitle="Join hundreds of successful entrepreneurs who started their journey with Elite Steel Concepts."
        buttonText="Start Your Build"
        buttonHref="/quote"
      />
    </>
  );
}
