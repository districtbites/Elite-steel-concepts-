import React from "react";
import Link from "next/link";
import Image from "next/image";
import Container from "./ui/Container";
import { ArrowRight, CheckCircle2 } from "lucide-react";
// import { PenTool, Wrench } from "lucide-react"; // used by the hidden support services row

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
    "Larger Kitchen Floor Space (10' - 30')",
    "Flexible Towing Options",
    "Ideal for High-Volume Events",
  ];

  // const supportServices = [
  //   {
  //     title: "Design & 3D Consultation",
  //     subtitle: "Engineering & Compliance",
  //     icon: PenTool,
  //     description:
  //       "Custom kitchen workflow optimization, 2D/3D CAD blueprints, and health department code compliance.",
  //     features: ["3D / CAD Floor Plans", "Workflow & Line Setup", "Health Department Approval"],
  //     href: "/services/design-and-consultation",
  //     linkText: "Learn About Design",
  //   },
  //   {
  //     title: "Repairs & Maintenance",
  //     subtitle: "Fleet & Equipment Upgrades",
  //     icon: Wrench,
  //     description:
  //       "Fast turnaround repairs, generator service, plumbing fixes, electrical diagnostics, and hood fan maintenance.",
  //     features: ["Generator Service & Replacement", "Electrical & Plumbing Diagnostics", "Hood & Vent Repairs"],
  //     href: "/services/repairs-and-upgrades",
  //     linkText: "View Repair Services",
  //   },
  // ];

  return (
    <section className="bg-white py-20 md:py-28 border-b border-gray-100">
      <Container>
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-12 bg-primary" />
              <span className="text-primary text-xs font-black uppercase tracking-[0.25em]">
                Our Services
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-black uppercase tracking-tight leading-[1.05]">
              Choose Your Custom Food Truck & Trailer
            </h2>
          </div>

          {/* Header copy + quote button — hidden for now
          <div className="max-w-md flex flex-col items-start lg:items-end text-left lg:text-right gap-6">
            <p className="text-gray-600 text-sm leading-relaxed font-normal">
              We build custom food trucks and concession trailers to help you start or grow your food business. We create the right kitchen layout, equipment setup, and serving space based on the food you plan to serve.
            </p>
            <Link
              href="/quote"
              id="service-get-quote-btn"
              className="inline-flex items-center gap-2 bg-primary hover:bg-orange-600 text-white font-black uppercase tracking-wider text-xs px-6 py-3.5 transition-all shadow-sm shrink-0"
            >
              Get a free quote <ArrowRight size={14} />
            </Link>
          </div>
          */}
        </div>

        {/* Primary Build Platforms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Food Trucks Card */}
          <div className="group relative bg-white border border-gray-200 hover:border-black transition-all duration-300 flex flex-col justify-between overflow-hidden">
            <Link
              href="/services/custom-food-trucks"
              id="service-food-trucks-card"
              className="block relative overflow-hidden"
            >
              <div className="relative h-[300px] md:h-[360px] overflow-hidden">
                <Image
                  src={truckSrc}
                  alt={truckAlt}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                {/* Top primary accent line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left z-10" />

                {/* Label on image */}
                <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                  <span className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-1 block">
                    Platform 01
                  </span>
                  <h3 className="text-3xl font-black text-white uppercase tracking-tight group-hover:text-primary transition-colors duration-200">
                    Custom Food Trucks
                  </h3>
                </div>
              </div>
            </Link>

            <div className="p-8 flex flex-col justify-between flex-1 bg-white">
              <div>
                <p className="text-gray-600 text-sm leading-relaxed mb-6 font-normal">
                  The ultimate mobile billboard. Self-contained, branded, and engineered for high-mobility city operations.
                </p>
                <ul className="space-y-3 mb-8">
                  {truckFeatures.map((f) => (
                    <li key={f} className="flex items-center gap-3">
                      <CheckCircle2 size={16} className="text-primary shrink-0" />
                      <span className="text-xs font-bold text-gray-800 uppercase tracking-wide">
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                href="/services/custom-food-trucks"
                className="inline-flex items-center gap-2 border border-black group-hover:bg-black group-hover:text-white text-black font-black uppercase tracking-wider text-xs px-6 py-3.5 transition-all text-center justify-center w-full"
              >
                <span>Explore Food Trucks</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Concession Trailers Card */}
          <div className="group relative bg-white border border-gray-200 hover:border-black transition-all duration-300 flex flex-col justify-between overflow-hidden">
            <Link
              href="/services/custom-food-trailers"
              id="service-trailers-card"
              className="block relative overflow-hidden"
            >
              <div className="relative h-[300px] md:h-[360px] overflow-hidden">
                <Image
                  src={trailerSrc}
                  alt={trailerAlt}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                {/* Top primary accent line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left z-10" />

                {/* Label on image */}
                <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                  <span className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-1 block">
                    Platform 02
                  </span>
                  <h3 className="text-3xl font-black text-white uppercase tracking-tight group-hover:text-primary transition-colors duration-200">
                    Concession Trailers
                  </h3>
                </div>
              </div>
            </Link>

            <div className="p-8 flex flex-col justify-between flex-1 bg-white">
              <div>
                <p className="text-gray-600 text-sm leading-relaxed mb-6 font-normal">
                  Spacious, flexible, and cost-effective. The preferred platform for high-volume events and stationary locations.
                </p>
                <ul className="space-y-3 mb-8">
                  {trailerFeatures.map((f) => (
                    <li key={f} className="flex items-center gap-3">
                      <CheckCircle2 size={16} className="text-primary shrink-0" />
                      <span className="text-xs font-bold text-gray-800 uppercase tracking-wide">
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                href="/services/custom-food-trailers"
                className="inline-flex items-center gap-2 border border-black group-hover:bg-black group-hover:text-white text-black font-black uppercase tracking-wider text-xs px-6 py-3.5 transition-all text-center justify-center w-full"
              >
                <span>Explore Trailers</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* Additional Support Services Row — hidden for now
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {supportServices.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.title}
                className="bg-gray-50 border border-gray-200 hover:border-primary/50 transition-all duration-300 p-8 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-white border border-gray-200 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                      <Icon size={24} />
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary block">
                        {service.subtitle}
                      </span>
                      <h4 className="text-2xl font-black text-black uppercase tracking-tight">
                        {service.title}
                      </h4>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm leading-relaxed mb-6 font-normal">
                    {service.description}
                  </p>

                  <ul className="space-y-2.5 mb-8">
                    {service.features.map((feat) => (
                      <li key={feat} className="flex items-center gap-3 text-xs font-bold text-gray-700 uppercase tracking-wide">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full shrink-0" />
                        {feat}
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href={service.href}
                  className="inline-flex items-center gap-2 text-black hover:text-primary font-black uppercase tracking-wider text-xs transition-colors"
                >
                  <span>{service.linkText}</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            );
          })}
        </div>
        */}
      </Container>
    </section>
  );
};

export default ServiceSelection;
