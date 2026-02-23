import React from "react";
import { getProjects } from "@/lib/db";
import ProjectManager from "@/components/admin/ProjectManager";

export default async function AdminPortfolioPage() {
  const projects = await getProjects();

  return (
    <div className="space-y-8">
      <div>
         <h1 className="text-4xl font-black uppercase text-secondary tracking-tighter">Portfolio Intelligence</h1>
         <p className="text-gray-400 font-medium">Manage and showcase the craftsmanship of Elite Steel Concepts.</p>
      </div>

      <ProjectManager initialProjects={projects} />
    </div>
  );
}
