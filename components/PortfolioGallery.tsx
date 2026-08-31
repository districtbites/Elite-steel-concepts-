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
              className={`px-6 py-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 border whitespace-nowrap shrink-0 flex items-center gap-3 ${
                activeFilter === category
                  ? "bg-[#0a0a0a] text-white border-black shadow-[4px_4px_0px_0px_rgba(247,147,30,1)]"
                  : "bg-white text-black border-black hover:bg-gray-100"
              }`}
            >
              {category}
              <span
                className={`px-2 py-0.5 text-[8px] font-black border ${
                  activeFilter === category
                    ? "border-white/20 text-primary"
                    : "border-black/20 text-gray-500"
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
            className="group relative bg-white border-2 border-black overflow-hidden hover:border-primary transition-colors duration-300 block"
          >
            {/* Image Container */}
            <div className="relative aspect-[4/3] overflow-hidden border-b-2 border-black bg-black">
              <Image
                src={project.image}
                alt={project.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover opacity-80 transition-transform duration-700 group-hover:scale-105 group-hover:opacity-100 grayscale group-hover:grayscale-0"
              />
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <span className="bg-primary text-black text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1.5 border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  {project.category}
                </span>
                {project.featured && (
                  <span className="bg-black text-primary text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1.5 border border-primary flex items-center gap-1.5 w-max">
                    <Sparkles size={10} /> Featured
                  </span>
                )}
              </div>
            </div>

            {/* Content Bottom */}
            <div className="p-6 space-y-4">
              <h3 className="text-2xl font-black uppercase text-black tracking-tighter group-hover:text-primary transition-colors leading-tight">
                {project.title}
              </h3>

              {project.tagline && (
                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest line-clamp-1 border-l-2 border-primary pl-2">
                  {project.tagline}
                </p>
              )}

              <div className="flex flex-wrap gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-gray-600">
                {project.client && (
                  <span className="inline-flex items-center gap-1.5 bg-gray-50 px-3 py-2 border border-gray-200">
                    <Tag size={10} className="text-primary" />
                    {project.client}
                  </span>
                )}
                {project.completionDate && (
                  <span className="inline-flex items-center gap-1.5 bg-gray-50 px-3 py-2 border border-gray-200">
                    <Calendar size={10} className="text-primary" />
                    {project.completionDate}
                  </span>
                )}
              </div>

              {/* Gallery thumbnails + CTA */}
              <div className="pt-4 border-t border-black flex justify-between items-center">
                <div className="flex gap-1">
                  {project.gallery?.slice(0, 4).map((g, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 border border-black overflow-hidden relative bg-black opacity-80 group-hover:opacity-100 grayscale group-hover:grayscale-0 transition-all"
                    >
                      <Image src={g} alt="Gallery" fill sizes="40px" className="object-cover" />
                    </div>
                  ))}
                  {project.gallery && project.gallery.length > 4 && (
                    <div className="w-8 h-8 border border-black bg-[#0a0a0a] flex items-center justify-center text-[8px] font-black text-primary">
                      +{project.gallery.length - 4}
                    </div>
                  )}
                </div>
                <span className="text-[10px] font-black uppercase text-black group-hover:text-primary transition-colors tracking-[0.2em] flex items-center gap-2">
                  Details <ArrowRight size={12} />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-24 space-y-4 bg-[#0a0a0a] border border-[#1a1a1a]">
          <div className="w-16 h-16 bg-black border border-[#1a1a1a] flex items-center justify-center mx-auto mb-6 text-primary">
            <Tag size={28} />
          </div>
          <p className="text-2xl font-black uppercase text-white tracking-tighter">
            No Builds in This Category
          </p>
          <p className="text-sm font-bold uppercase tracking-widest text-gray-500">
            Awaiting Next Commission.
          </p>
        </div>
      )}
    </div>
  );
};

export default PortfolioGallery;
