import React from"react";
import ProjectEditor from"@/components/admin/ProjectEditor";
import { addProject } from"@/app/actions/projects";
import { redirect } from"next/navigation";

export default function NewProjectPage() {
 const handleAction = async (formData: FormData) => {
"use server";
 const result = await addProject(formData);
 if (result.success) {
 redirect("/admin/portfolio");
 }
 return result;
 };

 return (
 <div className="max-w-7xl mx-auto">
 <ProjectEditor action={handleAction} />
 </div>
 );
}
