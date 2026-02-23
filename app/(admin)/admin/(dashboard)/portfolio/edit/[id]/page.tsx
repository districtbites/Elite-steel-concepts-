import React from "react";
import ProjectEditor from "@/components/admin/ProjectEditor";
import { editProject } from "@/app/actions/projects";
import { getProjectById } from "@/lib/db";
import { notFound, redirect } from "next/navigation";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const project = await getProjectById(id);
    
    if (!project) {
        notFound();
    }

    const handleAction = async (formData: FormData) => {
        "use server";
        const result = await editProject(formData);
        if (result.success) {
            redirect("/admin/portfolio");
        }
        return result;
    };

    return (
        <div className="max-w-7xl mx-auto">
            <ProjectEditor action={handleAction} initialData={project} />
        </div>
    );
}
