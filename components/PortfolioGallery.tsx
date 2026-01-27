"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Tag } from "lucide-react";
import { Project } from "@/lib/db";

const categories = ["All", "Food Truck", "Concession Trailer", "Mobile Bar", "Specialty"];

interface PortfolioGalleryProps {
  initialProjects: Project[];
}

const PortfolioGallery = ({ initialProjects }: PortfolioGalleryProps) => {
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredProjects = activeFilter === "All" 
    ? initialProjects 
    : initialProjects.filter(project => project.category === activeFilter || (activeFilter === "Trailer" && project.category === "Concession Trailer"));

  return (
    <div className="space-y-12">
      {/* Filters */}
      <div className="flex flex-wrap justify-center gap-4">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveFilter(category)}
            className={`px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-300 border ${
              activeFilter === category
                ? "bg-secondary text-white border-secondary shadow-lg scale-105"
                : "bg-white text-gray-500 border-gray-200 hover:border-primary hover:text-primary"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.map((project) => (
          <Link 
            href={`/portfolio/${project.id}`}
            key={project.id} 
            className="group relative bg-white border border-gray-100 rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer block"
          >
            {/* Image Container */}
            <div className="relative aspect-[4/3] overflow-hidden">
               <Image 
                 src={project.image} 
                 alt={project.title}
                 fill
                 className="object-cover transition-transform duration-700 group-hover:scale-110"
               />
               <div className="absolute inset-0 bg-secondary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-6 text-center">
                  <div>
                    <span className="text-primary font-bold uppercase tracking-wider text-xs mb-2 block">
                      {project.category}
                    </span>
                    <p className="text-white text-sm leading-relaxed line-clamp-3">
                      {project.description}
                    </p>
                  </div>
               </div>
            </div>

            {/* Content Bottom */}
            <div className="p-6 relative bg-white">
              <h3 className="text-xl font-black uppercase text-secondary mb-3 group-hover:text-primary transition-colors">
                {project.title}
              </h3>
              
              <div className="flex flex-wrap gap-2 mb-4">
                 <span className="inline-flex items-center text-[10px] font-bold uppercase bg-gray-50 text-gray-500 px-2 py-1 rounded border border-gray-100">
                    {project.client || "Client Build"}
                 </span>
                 <span className="inline-flex items-center text-[10px] font-bold uppercase bg-gray-50 text-gray-500 px-2 py-1 rounded border border-gray-100">
                    {project.completionDate || "Recent"}
                 </span>
              </div>

               <div className="mt-auto pt-4 border-t border-gray-100 flex justify-end">
                   <span className="text-xs font-bold uppercase text-gray-400 group-hover:text-primary transition-colors flex items-center">
                     View Project <ArrowRight size={14} className="ml-1" />
                   </span>
               </div>
            </div>
          </Link>
        ))}
      </div>
      
      {filteredProjects.length === 0 && (
          <div className="text-center py-20 text-gray-400">
              No projects found in this category.
          </div>
      )}
    </div>
  );
};

export default PortfolioGallery;
