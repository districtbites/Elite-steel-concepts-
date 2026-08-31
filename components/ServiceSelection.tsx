import React from "react";
import Link from "next/link";
import Image from "next/image";
import Container from "./ui/Container";
import { ArrowRight, CheckCircle2 } from "lucide-react";

interface ServiceSelectionProps {
  imageAlts?: { [key: string]: string };
  truckImage?: { url: string; alt: string };
  trailerImage?: { url: string; alt: string };
}

const ServiceSelection = ({
  imageAlts,
  truckImage,
  trailerImage,
}: ServiceSelectionProps) => {
  const truckSrc =
    truckImage?.url ||
    "https://images.pexels.com/photos/4393021/pexels-photo-4393021.jpeg?auto=compress&cs=tinysrgb&w=1200";
  const truckAlt =
    truckImage?.alt || imageAlts?.["truck-platform"] || "Custom Food Truck";
  const trailerSrc =
    trailerImage?.url ||
    "/concession-trailer.png";
  const trailerAlt =
    trailerImage?.alt ||
    imageAlts?.["trailer-platform"] ||
    "Custom Food Trailer";

  const truckFeatures = [
    "Maximum Mobility & City Access",
    "Compact Footprint — Easy Parking",
    "Iconic Branded Presence",
    "All-in-One Self-Contained Kitchen",
  ];
  const trailerFeatures = [
    "Lower Initial Investment",
    "Larger Kitchen Floor Space",
    "Flexible Towing Vehicle Options",
    "Ideal for Events & Festivals",
  ];

  return (
    <section className="bg-white py-20 md:py-28">
      <Container>
        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-14">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-12 bg-primary" />
              <span className="text-primary text-xs font-black uppercase tracking-[0.25em]">
                Start Your Build
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-black uppercase tracking-tighter leading-tight">
              Choose Your
              <span className="block text-gray-400">Platform</span>
            </h2>
          </div>
          <p className="text-gray-500 text-sm max-w-sm leading-relaxed md:text-right">
            The foundation of your business starts here. Select the mobile
            kitchen that fits your vision and budget.
          </p>
        </div>

        {/* Cards side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-gray-100">
          {/* Food Trucks */}
          <Link
            href="/services/custom-food-trucks"
            id="service-food-trucks-card"
            className="group relative block overflow-hidden bg-white"
          >
            {/* Image */}
            <div className="relative h-[340px] md:h-[420px] overflow-hidden">
              <Image
                src={truckSrc}
                alt={truckAlt}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

              {/* Hover accent bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left z-10" />

              {/* Label on image */}
              <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                <span className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-2 block">
                  Platform 01
                </span>
                <h3 className="text-3xl font-black text-white uppercase tracking-tight group-hover:text-primary transition-colors duration-200">
                  Food Trucks
                </h3>
              </div>
            </div>

            {/* Content below image */}
            <div className="p-8 border-t border-gray-100 group-hover:border-primary/20 transition-colors">
              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                The ultimate all-in-one mobile kitchen. Self-contained, branded,
                and built for high-mobility city operations.
              </p>
              <ul className="space-y-2.5 mb-8">
                {truckFeatures.map((f) => (
                  <li key={f} className="flex items-center gap-3">
                    <CheckCircle2
                      size={14}
                      className="text-primary shrink-0"
                    />
                    <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                      {f}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="flex items-center gap-2 text-primary text-xs font-black uppercase tracking-wider">
                <span>Explore Food Trucks</span>
                <ArrowRight
                  size={14}
                  className="group-hover:translate-x-1.5 transition-transform"
                />
              </div>
            </div>
          </Link>

          {/* Concession Trailers */}
          <Link
            href="/services/custom-food-trailers"
            id="service-trailers-card"
            className="group relative block overflow-hidden bg-white"
          >
            {/* Image */}
            <div className="relative h-[340px] md:h-[420px] overflow-hidden">
              <Image
                src={trailerSrc}
                alt={trailerAlt}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

              {/* Hover accent bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left z-10" />

              {/* Label on image */}
              <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                <span className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-2 block">
                  Platform 02
                </span>
                <h3 className="text-3xl font-black text-white uppercase tracking-tight group-hover:text-primary transition-colors duration-200">
                  Concession Trailers
                </h3>
              </div>
            </div>

            {/* Content below image */}
            <div className="p-8 border-t border-gray-100 group-hover:border-primary/20 transition-colors">
              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                Spacious, flexible, and cost-effective. The preferred platform
                for events, festivals, and stationary operations.
              </p>
              <ul className="space-y-2.5 mb-8">
                {trailerFeatures.map((f) => (
                  <li key={f} className="flex items-center gap-3">
                    <CheckCircle2
                      size={14}
                      className="text-primary shrink-0"
                    />
                    <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                      {f}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="flex items-center gap-2 text-primary text-xs font-black uppercase tracking-wider">
                <span>Explore Trailers</span>
                <ArrowRight
                  size={14}
                  className="group-hover:translate-x-1.5 transition-transform"
                />
              </div>
            </div>
          </Link>
        </div>

        {/* Bottom CTA nudge */}
        <div className="mt-px bg-[#0a0a0a] p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400">
            Not sure which platform is right for you?{" "}
            <a href="tel:+15716510337" className="text-primary hover:underline font-bold">
              Call us — we'll guide you.
            </a>
          </p>
          <Link
            href="/quote"
            id="platform-quote-btn"
            className="inline-flex items-center gap-2 bg-primary hover:bg-orange-600 text-white font-black uppercase tracking-wider text-xs px-6 py-3 transition-all"
          >
            Get a Free Quote <ArrowRight size={14} />
          </Link>
        </div>
      </Container>
    </section>
  );
};

export default ServiceSelection;
