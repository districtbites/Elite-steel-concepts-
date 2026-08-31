import React from"react";
import { getTestimonials } from"@/lib/db";
import TestimonialManager from"./TestimonialManager";

export default async function AdminTestimonialsPage() {
 const testimonials = await getTestimonials();

 return (
 <div className="space-y-8">
 <div>
 <h1 className="text-4xl font-black uppercase text-admin-text tracking-tighter">Client Sentiment Lab</h1>
 <p className="text-admin-muted font-medium">Curate and authorize official client testimonials and success stories.</p>
 </div>

 <TestimonialManager initialTestimonials={testimonials} />
 </div>
 );
}
