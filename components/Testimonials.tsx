import React from "react";
import Link from "next/link";
import Container from "./ui/Container";
import Section from "./ui/Section";
import { Star, Quote, ArrowRight } from "lucide-react";
import { getTestimonials } from "@/lib/db";

const Testimonials = async () => {
  const testimonials = await getTestimonials();
  const recentTestimonials = testimonials.slice(0, 3);

  if (recentTestimonials.length === 0) return null;

  return (
    <Section className="bg-white text-secondary border-t border-gray-100">
      <Container>
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-primary font-bold tracking-widest uppercase text-sm mb-2 block">Testimonials</span>
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-secondary mb-6">
            Client Success
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed mb-8">
            We don't just build trucks; we build businesses. Hear from the entrepreneurs who trust us with their mobile kitchens.
          </p>
          <Link href="/testimonials" className="inline-flex items-center text-sm font-bold uppercase tracking-wider text-secondary hover:text-primary transition-colors">
            See All Reviews <ArrowRight size={16} className="ml-2" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {recentTestimonials.map((testimonial) => (
            <div 
              key={testimonial.id} 
              className="bg-white border border-gray-100 shadow-sm p-8 rounded-lg relative hover:shadow-lg hover:border-primary/30 hover-lift transition-all duration-300 group"
            >
              {/* Quote Icon */}
              <div className="absolute top-6 right-6 text-black/5 group-hover:text-primary/10 transition-colors duration-300">
                <Quote size={48} fill="currentColor" />
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-6 text-primary">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={18} fill="currentColor" />
                ))}
              </div>

              {/* Content */}
              <p className="text-gray-600 mb-8 italic leading-relaxed relative z-10 line-clamp-4">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="mt-auto pt-6 border-t border-gray-100">
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
      </Container>
    </Section>
  );
};

export default Testimonials;
