import type { Project } from "./db";

/** Descriptive alt text for a portfolio image, e.g. "Dough & Fire – custom pizza trailer for Denver, CO, built by Elite Steel Concepts". */
export function projectImageAlt(project: Pick<Project, "title" | "category" | "location">, view?: number): string {
    const type = project.category ? ` – custom ${project.category.toLowerCase()}` : "";
    const where = project.location ? ` for ${project.location}` : "";
    const viewNote = view ? ` (view ${view})` : "";
    return `${project.title}${type}${where}, built by Elite Steel Concepts${viewNote}`;
}
