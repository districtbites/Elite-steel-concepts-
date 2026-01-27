import React from "react";
import { getTestimonials } from "@/lib/db";
import TestimonialManager from "./TestimonialManager";

export default async function AdminTestimonialsPage() {
  const testimonials = await getTestimonials();

  return (
    <div className="space-y-8">
      <div>
         <h1 className="text-3xl font-black uppercase text-secondary">Testimonial Manager</h1>
         <p className="text-gray-500">Create, edit, and manage client reviews.</p>
      </div>

      <TestimonialManager initialTestimonials={testimonials} />
    </div>
  );
}
