"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Tag, Star, MapPin, Calendar, Eye, Sparkles } from "lucide-react";
import { Project } from "@/lib/db";

const categories = ["All", "Food Truck", "Concession Trailer", "Mobile Bar", "Specialty"];

interface PortfolioGalleryProps {
  initialProjects: Project[];
}

const PortfolioGallery = ({ initialProjects }: PortfolioGalleryProps) => {
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredProjects =
    activeFilter === "All"
      ? initialProjects
      : initialProjects.filter(
          (project) =>
            project.category === activeFilter ||
            (activeFilter === "Trailer" && project.category === "Concession Trailer")
        );

  return (
    <div className="space-y-12">
      {/* Filters */}
      <div className="scroll-x-mobile flex flex-nowrap md:flex-wrap md:justify-center gap-2 pb-2">
        {categories.map((category) => {
          const count =
            category === "All"
              ? initialProjects.length
              : initialProjects.filter(
                  (p) =>
                    p.category === category ||
                    (category === "Trailer" && p.category === "Concession Trailer")
                ).length;
          return (
            <button
              key={category}
              onClick={() => setActiveFilter(category)}
              className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 border whitespace-nowrap shrink-0 flex items-center gap-2 ${
                activeFilter === category
                  ? "bg-secondary text-white border-secondary shadow-lg"
                  : "bg-white text-gray-500 border-gray-200 hover:border-primary hover:text-primary"
              }`}
            >
              {category}
              <span
                className={`px-1.5 py-0.5 rounded-full text-[8px] font-black ${
                  activeFilter === category
                    ? "bg-white/20 text-white"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.map((project) => (
          <Link
            href={`/portfolio/${project.slug}`}
            key={project.id}
            className="group relative bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer block border border-gray-100"
          >
            {/* Image Container */}
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src={project.image}
                unoptimized
                alt={project.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-secondary/90 via-secondary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Hover Info */}
              <div className="absolute inset-0 flex items-end p-6 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                <div className="space-y-3 w-full">
                  <p className="text-white/80 text-xs leading-relaxed line-clamp-2 font-light">
                    {project.description}
                  </p>
                  <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-white/60">
                    <Eye size={10} /> View Project Details <ArrowRight size={10} />
                  </div>
                </div>
              </div>

              {/* Badges */}
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="bg-primary text-secondary text-[7px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm">
                  {project.category}
                </span>
                {project.featured && (
                  <span className="bg-secondary/80 backdrop-blur-md text-primary text-[7px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full border border-primary/20 flex items-center gap-1">
                    <Sparkles size={8} /> Featured
                  </span>
                )}
              </div>
            </div>

            {/* Content Bottom */}
            <div className="p-6 space-y-3">
              <h3 className="text-xl font-black uppercase text-secondary tracking-tighter group-hover:text-primary transition-colors leading-tight">
                {project.title}
              </h3>

              {project.tagline && (
                <p className="text-xs text-gray-400 font-medium italic line-clamp-1">
                  &ldquo;{project.tagline}&rdquo;
                </p>
              )}

              <div className="flex flex-wrap gap-3 text-[9px] font-bold uppercase tracking-widest text-gray-400">
                {project.client && (
                  <span className="inline-flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                    <Tag size={9} className="text-primary" />
                    {project.client}
                  </span>
                )}
                {project.completionDate && (
                  <span className="inline-flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                    <Calendar size={9} className="text-primary" />
                    {project.completionDate}
                  </span>
                )}
                {project.location && (
                  <span className="inline-flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                    <MapPin size={9} className="text-primary" />
                    {project.location}
                  </span>
                )}
              </div>

              {/* Gallery thumbnails + CTA */}
              <div className="pt-4 border-t border-gray-50 flex justify-between items-center">
                <div className="flex -space-x-2">
                  {project.gallery?.slice(0, 4).map((g, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-lg border-2 border-white overflow-hidden relative bg-gray-100 shadow-sm"
                    >
                      <Image src={g} alt="Gallery" fill className="object-cover" unoptimized />
                    </div>
                  ))}
                  {project.gallery && project.gallery.length > 4 && (
                    <div className="w-8 h-8 rounded-lg border-2 border-white bg-gray-50 flex items-center justify-center text-[7px] font-black text-gray-400">
                      +{project.gallery.length - 4}
                    </div>
                  )}
                </div>
                <span className="text-[9px] font-black uppercase text-gray-300 group-hover:text-primary transition-colors tracking-widest flex items-center gap-1">
                  View <ArrowRight size={10} />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-20 space-y-4 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto">
            <Tag size={28} className="text-gray-200" />
          </div>
          <p className="text-lg font-black uppercase text-secondary tracking-tight">
            No Builds in This Category
          </p>
          <p className="text-sm text-gray-400">
            Try selecting a different filter above.
          </p>
        </div>
      )}
    </div>
  );
};

export default PortfolioGallery;
