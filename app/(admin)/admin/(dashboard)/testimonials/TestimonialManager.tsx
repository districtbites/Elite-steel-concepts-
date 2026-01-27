"use client";

import React, { useState } from "react";
import Button from "@/components/ui/Button";
import { addTestimonial, removeTestimonial, editTestimonial } from "@/app/actions/testimonials";
import { Testimonial } from "@/lib/db";
import { Trash2, Edit2, Plus, Star, X, Save } from "lucide-react";

interface TestimonialManagerProps {
  initialTestimonials: Testimonial[];
}

export default function TestimonialManager({ initialTestimonials }: TestimonialManagerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Adding Form State
  const [loading, setLoading] = useState(false);

  const handleDelete = async (id: string) => {
      if (!confirm("Are you sure you want to delete this testimonial?")) return;
      await removeTestimonial(id);
  };

  const handleAddSubmit = async (formData: FormData) => {
      setLoading(true);
      await addTestimonial(formData);
      setLoading(false);
      setIsAdding(false);
      // Reset form usually happens by unmounting, but we can also just close
  };

  const handleEditSubmit = async (formData: FormData) => {
      setLoading(true);
      await editTestimonial(formData);
      setLoading(false);
      setEditingId(null);
  };

  return (
    <div className="space-y-8">
       <div className="flex justify-between items-center">
           <h2 className="text-xl font-bold uppercase text-secondary">All Reviews ({initialTestimonials.length})</h2>
           <Button onClick={() => setIsAdding(!isAdding)} className="flex items-center">
               {isAdding ? <><X size={18} className="mr-2"/> Cancel</> : <><Plus size={18} className="mr-2"/> Add Review</>}
           </Button>
       </div>

       {/* Add Form */}
       {isAdding && (
           <form action={handleAddSubmit} className="bg-gray-50 p-6 rounded-lg border border-gray-200 animate-fadeIn">
               <h3 className="text-lg font-bold mb-4">New Testimonial</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                   <input name="clientName" placeholder="Client Name*" required className="p-3 border rounded" />
                   <input name="role" placeholder="Role (e.g. Owner)" className="p-3 border rounded" />
                   <input name="company" placeholder="Company Name" className="p-3 border rounded" />
                   <select name="rating" className="p-3 border rounded" defaultValue="5">
                       <option value="5">5 Stars</option>
                       <option value="4">4 Stars</option>
                       <option value="3">3 Stars</option>
                       <option value="2">2 Stars</option>
                       <option value="1">1 Star</option>
                   </select>
               </div>
               <textarea name="content" placeholder="Review Content*" required rows={4} className="w-full p-3 border rounded mb-4" />
               <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save Testimonial"}</Button>
           </form>
       )}

       {/* List */}
       <div className="grid gap-4">
           {initialTestimonials.map((t) => (
               <div key={t.id} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm relative group">
                   {editingId === t.id ? (
                       <form action={handleEditSubmit} className="space-y-4">
                            <input type="hidden" name="id" value={t.id} />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input name="clientName" defaultValue={t.clientName} required className="p-2 border rounded" />
                                <input name="role" defaultValue={t.role} placeholder="Role" className="p-2 border rounded" />
                                <input name="company" defaultValue={t.company} placeholder="Company" className="p-2 border rounded" />
                                <select name="rating" defaultValue={t.rating} className="p-2 border rounded">
                                    {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} Stars</option>)}
                                </select>
                            </div>
                            <textarea name="content" defaultValue={t.content} required rows={3} className="w-full p-2 border rounded" />
                            <div className="flex gap-2">
                                <Button type="submit" size="sm" disabled={loading}><Save size={16} className="mr-1"/> Save</Button>
                                <button type="button" onClick={() => setEditingId(null)} className="text-sm text-gray-500 hover:text-gray-700">Cancel</button>
                            </div>
                       </form>
                   ) : (
                       <>
                           <div className="flex justify-between items-start mb-2 hidden md:flex">
                               <div>
                                   <div className="font-bold text-secondary text-lg">{t.clientName}</div>
                                   <div className="text-xs text-gray-500 uppercase tracking-wider">{t.company || t.role}</div>
                               </div>
                               <div className="flex text-yellow-500">
                                   {[...Array(5)].map((_, i) => (
                                       <Star key={i} size={16} fill={i < t.rating ? "currentColor" : "none"} className={i < t.rating ? "" : "text-gray-300"} />
                                   ))}
                               </div>
                           </div>
                           
                           {/* Mobile View Header */}
                           <div className="md:hidden mb-2">
                               <div className="flex justify-between">
                                  <div className="font-bold text-secondary">{t.clientName}</div>
                                  <div className="flex text-yellow-500">
                                       {[...Array(5)].map((_, i) => (
                                           <Star key={i} size={14} fill={i < t.rating ? "currentColor" : "none"} />
                                       ))}
                                  </div>
                               </div>
                               <div className="text-xs text-gray-500">{t.company}</div>
                           </div>

                           <p className="text-gray-600 italic">"{t.content}"</p>

                           <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                               <button onClick={() => setEditingId(t.id)} className="p-2 text-blue-600 hover:bg-blue-50 rounded"><Edit2 size={16} /></button>
                               <button onClick={() => handleDelete(t.id)} className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
                           </div>
                       </>
                   )}
               </div>
           ))}
           {initialTestimonials.length === 0 && (
               <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                   No testimonials yet. Add your first one!
               </div>
           )}
       </div>
    </div>
  );
}
