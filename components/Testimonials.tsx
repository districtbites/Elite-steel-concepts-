import React from "react";
import Container from "./ui/Container";
import Section from "./ui/Section";
import ReelSlider, { type Reel } from "./ui/ReelSlider";
import { getTestimonials } from "@/lib/db";

const sampleReels: Reel[] = [
  {
    id: "reel-1",
    title: "Inside Taco Fiesta 24ft Custom Food Truck Build",
    client: "Carlos & Maria R.",
    location: "Washington, DC",
    videoUrl: "/videos/reels/reel-1.mp4",
    views: "14.2K",
  },
  {
    id: "reel-2",
    title: "Full Walkthrough: 20ft Smokehouse BBQ Concession Trailer",
    client: "Chef Marcus Vance",
    location: "Richmond, VA",
    videoUrl: "/videos/reels/reel-2.mp4",
    views: "28.9K",
  },
  {
    id: "reel-3",
    title: "Handover Day! Custom Mobile Espresso & Bakery Truck",
    client: "Sarah's Artisan Coffee",
    location: "Baltimore, MD",
    videoUrl: "/videos/reels/reel-3.mp4",
    views: "19.5K",
  },
  {
    id: "reel-4",
    title: "Client Testimonial: Custom Food Truck Build",
    client: "ESC Client",
    location: "Client Testimonial",
    videoUrl: "/videos/reels/reel-4.mp4",
    views: "",
  },
];

const Testimonials = async () => {
  const testimonials = await getTestimonials();
  const recentTestimonials = testimonials.slice(0, 3);

  if (recentTestimonials.length === 0) return null;

  return (
    <Section className="!py-8 md:!py-12 bg-white text-secondary border-t border-gray-100">
      <Container>
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center gap-3">
            <div className="h-px w-8 bg-primary" />
            <h1 className="text-primary text-base md:text-lg font-black uppercase tracking-[0.25em]">
              Client Testimonials
            </h1>
            <div className="h-px w-8 bg-primary" />
          </div>
        </div>

        {/* ═══ VIDEO TESTIMONIALS & REELS SECTION ════════════════ */}
        <div>
          <ReelSlider reels={sampleReels} />
        </div>

        {/* ═══ TEXT WRITTEN TESTIMONIALS — hidden for now ═══════
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl md:text-2xl font-black uppercase text-secondary tracking-tight">
            Verified Owner Reviews
          </h3>
          <span className="text-xs text-gray-400 uppercase tracking-widest font-bold">5.0 Star Rated Builds</span>
        </div>

        {/- Grid -/}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {recentTestimonials.map((testimonial) => (
            <div 
              key={testimonial.id} 
              className="bg-white border border-gray-100 shadow-sm p-8 rounded-2xl relative hover:shadow-lg hover:border-primary/30 hover-lift transition-all duration-300 group flex flex-col justify-between"
            >
              {/- Quote Icon -/}
              <div className="absolute top-6 right-6 text-black/5 group-hover:text-primary/10 transition-colors duration-300">
                <Quote size={48} fill="currentColor" />
              </div>

              <div>
                {/- Stars -/}
                <div className="flex gap-1 mb-6 text-primary">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={18} fill="currentColor" />
                  ))}
                </div>

                {/- Content -/}
                <p className="text-gray-600 mb-8 italic leading-relaxed relative z-10 line-clamp-4">
                  "{testimonial.content}"
                </p>
              </div>

              {/- Author -/}
              <div className="pt-6 border-t border-gray-100">
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
        */}
      </Container>
    </Section>
  );
};

export default Testimonials;

