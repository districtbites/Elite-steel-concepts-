"use client";

import React, { useState } from "react";
import Button from "@/components/ui/Button";
import { addProject, editProject, removeProject } from "@/app/actions/projects";
import { Project } from "@/lib/db";
import { Trash2, Edit2, Plus, X, Save, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

interface ProjectManagerProps {
  initialProjects: Project[];
}

export default function ProjectManager({ initialProjects }: ProjectManagerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleDelete = async (id: string) => {
      if (!confirm("Are you sure you want to delete this project?")) return;
      await removeProject(id);
  };

  const handleAddSubmit = async (formData: FormData) => {
      setLoading(true);
      await addProject(formData);
      setLoading(false);
      setIsAdding(false);
  };

  const handleEditSubmit = async (formData: FormData) => {
      setLoading(true);
      await editProject(formData);
      setLoading(false);
      setEditingId(null);
  };

  return (
    <div className="space-y-8">
       <div className="flex justify-between items-center">
           <h2 className="text-xl font-bold uppercase text-secondary">All Projects ({initialProjects.length})</h2>
           <Button onClick={() => setIsAdding(!isAdding)} className="flex items-center">
               {isAdding ? <><X size={18} className="mr-2"/> Cancel</> : <><Plus size={18} className="mr-2"/> Add Project</>}
           </Button>
       </div>

       {/* Add Form */}
       {isAdding && (
           <form action={handleAddSubmit} className="bg-gray-50 p-6 rounded-lg border border-gray-200 animate-fadeIn">
               <h3 className="text-lg font-bold mb-4">New Project</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                   <input name="title" placeholder="Project Title*" required className="p-3 border rounded" />
                   <select name="category" className="p-3 border rounded">
                       <option value="Food Truck">Food Truck</option>
                       <option value="Concession Trailer">Concession Trailer</option>
                       <option value="Mobile Bar">Mobile Bar</option>
                       <option value="Support Vehicle">Support Vehicle</option>
                   </select>
                   <input name="client" placeholder="Client Name" className="p-3 border rounded" />
                   <input name="completionDate" placeholder="Completion Date (e.g. Jan 2024)" className="p-3 border rounded" />
                   <input name="image" placeholder="Image URL*" required className="p-3 border rounded md:col-span-2" />
               </div>
               <textarea name="description" placeholder="Project Description*" required rows={4} className="w-full p-3 border rounded mb-4" />
               <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save Project"}</Button>
           </form>
       )}

       {/* List */}
       <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
           {initialProjects.map((p) => (
               <div key={p.id} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex flex-col h-full group">
                   {editingId === p.id ? (
                       <form action={handleEditSubmit} className="p-4 space-y-4 flex-grow flex flex-col">
                            <input type="hidden" name="id" value={p.id} />
                            <input name="title" defaultValue={p.title} required className="p-2 border rounded w-full" />
                            <select name="category" defaultValue={p.category} className="p-2 border rounded w-full">
                               <option value="Food Truck">Food Truck</option>
                               <option value="Concession Trailer">Concession Trailer</option>
                               <option value="Mobile Bar">Mobile Bar</option>
                               <option value="Support Vehicle">Support Vehicle</option>
                            </select>
                            <input name="image" defaultValue={p.image} className="p-2 border rounded w-full" placeholder="Image URL" />
                            <input name="client" defaultValue={p.client} className="p-2 border rounded w-full" placeholder="Client" />
                            <textarea name="description" defaultValue={p.description} required rows={3} className="w-full p-2 border rounded flex-grow" />
                            <div className="flex gap-2 pt-2 mt-auto">
                                <Button type="submit" size="sm" disabled={loading} className="w-full"><Save size={16} className="mr-1"/> Save</Button>
                                <button type="button" onClick={() => setEditingId(null)} className="px-4 text-sm text-gray-500 hover:text-gray-700">Cancel</button>
                            </div>
                       </form>
                   ) : (
                       <>
                           <div className="relative h-48 w-full bg-gray-100">
                               {p.image ? (
                                   <Image src={p.image} alt={p.title} fill className="object-cover" />
                               ) : (
                                   <div className="flex items-center justify-center h-full text-gray-300"><ImageIcon size={32}/></div>
                               )}
                               
                               <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 p-1 rounded shadow-sm">
                                   <button onClick={() => setEditingId(p.id)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><Edit2 size={16} /></button>
                                   <button onClick={() => handleDelete(p.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
                               </div>
                               <span className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded uppercase font-bold">{p.category}</span>
                           </div>
                           
                           <div className="p-5 flex-grow flex flex-col">
                               <h3 className="font-bold text-secondary text-lg mb-1">{p.title}</h3>
                               <p className="text-xs text-gray-500 mb-3 font-medium uppercase tracking-wider">
                                   {p.client} • {p.completionDate}
                               </p>
                               <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-grow">
                                   {p.description}
                               </p>
                           </div>
                       </>
                   )}
               </div>
           ))}
           {initialProjects.length === 0 && (
               <div className="col-span-full text-center py-20 text-gray-400 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                   No projects yet. Add your first build!
               </div>
           )}
       </div>
    </div>
  );
}
