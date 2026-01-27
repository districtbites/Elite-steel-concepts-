import React from "react";
import { getProjects } from "@/lib/db";
import ProjectManager from "@/components/admin/ProjectManager";

export default async function AdminPortfolioPage() {
  const projects = await getProjects();

  return (
    <div className="space-y-8">
      <div>
         <h1 className="text-3xl font-black uppercase text-secondary">Portfolio Manager</h1>
         <p className="text-gray-500">Showcase your best builds. Add standard custom trucks, trailers, and unique projects.</p>
      </div>

      <ProjectManager initialProjects={projects} />
    </div>
  );
}
