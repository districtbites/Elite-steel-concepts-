import React from "react";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";
import { getTestimonials } from "@/lib/db";
import { Star, Quote } from "lucide-react";

export default async function TestimonialsPage() {
  const testimonials = await getTestimonials();

  return (
    <div className="pt-24">
      {/* Header */}
      <Section className="bg-secondary text-white py-20">
        <Container className="text-center">
            <h1 className="text-4xl md:text-6xl font-black uppercase mb-6 tracking-tight">Client Reviews</h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                See what over a decade of custom fabrication experience looks like from our clients' perspective.
            </p>
        </Container>
      </Section>

      {/* Reviews Grid */}
      <Section className="bg-white">
        <Container>
            {testimonials.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    {testimonials.map((testimonial) => (
                        <div 
                        key={testimonial.id} 
                        className="bg-gray-50 border border-gray-100 p-8 rounded-lg relative flex flex-col hover:shadow-lg transition-all duration-300"
                        >
                            <div className="flex gap-1 mb-6 text-primary">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                <Star key={i} size={18} fill="currentColor" />
                                ))}
                            </div>

                            <p className="text-gray-600 mb-8 italic leading-relaxed flex-grow">
                                "{testimonial.content}"
                            </p>

                            <div className="pt-6 border-t border-gray-200">
                                <h4 className="font-bold text-secondary text-lg mb-1">
                                {testimonial.clientName}
                                </h4>
                                {(testimonial.role || testimonial.company) && (
                                    <p className="text-gray-500 text-xs uppercase tracking-wider font-bold">
                                    {testimonial.role}{testimonial.role && testimonial.company ? ", " : ""}{testimonial.company}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-gray-50 rounded-lg border border-dashed border-gray-200 mb-16">
                    <p className="text-gray-500 text-lg">No reviews yet. Check back soon!</p>
                </div>
            )}

            <div className="text-center bg-secondary p-12 rounded-xl">
                 <h3 className="text-3xl font-bold uppercase text-white mb-4">Ready to write your success story?</h3>
                 <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                     Join hundreds of successful entrepreneurs who started their journey with Elite Steel Concepts.
                 </p>
                 <Button href="/quote" variant="primary" size="lg">Start Your Build</Button>
            </div>
        </Container>
      </Section>
    </div>
  );
}
