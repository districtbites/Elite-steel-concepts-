"use client";

import React, { useState } from"react";
import { Plus, Pencil, Trash2, HelpCircle, Save, X, ChevronDown, ChevronUp, GripVertical } from"lucide-react";
import { FAQ } from"@/lib/db";
import { addFAQ, editFAQ, removeFAQ } from"@/app/actions/settings";
import Toast from"@/components/ui/Toast";

interface FAQManagerProps {
 faqs: FAQ[];
}

const FAQManager = ({ faqs: initialFaqs }: FAQManagerProps) => {
 const [faqs, setFaqs] = useState(initialFaqs);
 const [isEditing, setIsEditing] = useState<string | null>(null);
 const [isAdding, setIsAdding] = useState(false);
 const [loading, setLoading] = useState(false);
 const [showToast, setShowToast] = useState(false);
 const [toastMsg, setToastMsg] = useState("");

 const handleShowToast = (msg: string) => {
 setToastMsg(msg);
 setShowToast(true);
 };

 const handleAdd = async (formData: FormData) => {
 setLoading(true);
 const result = await addFAQ(formData);
 if (result.success) {
 handleShowToast("FAQ Added Successfully!");
 setIsAdding(false);
 window.location.reload(); // Simple way to refresh for now
 }
 setLoading(false);
 };

 const handleEdit = async (formData: FormData) => {
 setLoading(true);
 const result = await editFAQ(formData);
 if (result.success) {
 handleShowToast("FAQ Updated Successfully!");
 setIsEditing(null);
 window.location.reload();
 }
 setLoading(false);
 };

 const handleDelete = async (id: string) => {
 if (!confirm("Are you sure you want to delete this FAQ?")) return;
 setLoading(true);
 const result = await removeFAQ(id);
 if (result.success) {
 handleShowToast("FAQ Removed!");
 window.location.reload();
 }
 setLoading(false);
 };

 return (
 <div className="space-y-8 pb-20">
 {showToast && <Toast message={toastMsg} onClose={() => setShowToast(false)} />}

 <div className="flex justify-between items-center">
 <div>
 <h1 className="text-4xl font-black uppercase text-admin-text tracking-tighter">FAQ Repository</h1>
 <p className="text-admin-muted font-medium">Manage your site's Frequently Asked Questions and categorization.</p>
 </div>
 <button 
 onClick={() => setIsAdding(true)}
 className="bg-primary text-admin-text px-6 py-3 -full font-black uppercase text-xs tracking-widest flex items-center hover:scale-105 active:scale-95 transition-all shadow-lg"
 >
 <Plus size={16} className="mr-2" /> Add Question
 </button>
 </div>

 {/* Adding/Editing Form Modal/Overlay */}
 {(isAdding || isEditing) && (
 <div className="fixed inset-0 bg-admin-surface/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
 <div className="bg-admin-surface w-full max-w-2xl overflow-hidden shadow-2xl animate-scaleIn">
 <div className="p-8 bg-admin-bg border-b border-admin-border flex justify-between items-center">
 <h2 className="text-xl font-black uppercase text-admin-text tracking-tight">
 {isAdding ?"Craft New FAQ" :"Modify FAQ Entry"}
 </h2>
 <button onClick={() => { setIsAdding(false); setIsEditing(null); }} className="text-admin-muted hover:text-admin-text">
 <X size={24} />
 </button>
 </div>
 <form action={isAdding ? handleAdd : handleEdit} className="p-8 space-y-6">
 {isEditing && <input type="hidden" name="id" value={isEditing} />}
 
 <div className="space-y-1.5">
 <label className="text-[10px] font-black uppercase tracking-widest text-admin-muted">Question Content</label>
 <input 
 type="text" 
 name="question" 
 required 
 defaultValue={isEditing ? faqs.find(f => f.id === isEditing)?.question :""}
 placeholder="What is the standard build time?"
 className="w-full bg-admin-bg border-0 p-4 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-admin-text" 
 />
 </div>

 <div className="grid grid-cols-2 gap-6">
 <div className="space-y-1.5">
 <label className="text-[10px] font-black uppercase tracking-widest text-admin-muted">Category Tag</label>
 <select 
 name="category" 
 defaultValue={isEditing ? faqs.find(f => f.id === isEditing)?.category :"General"}
 className="w-full bg-admin-bg border-0 p-4 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-admin-text appearance-none"
 >
 <option value="General">General</option>
 <option value="Process">Process</option>
 <option value="Pricing">Pricing</option>
 <option value="Technical">Technical</option>
 <option value="Warranty">Warranty</option>
 </select>
 </div>
 <div className="space-y-1.5">
 <label className="text-[10px] font-black uppercase tracking-widest text-admin-muted">Display Order</label>
 <input 
 type="number" 
 name="order" 
 required 
 defaultValue={isEditing ? faqs.find(f => f.id === isEditing)?.order : 0}
 className="w-full bg-admin-bg border-0 p-4 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-admin-text" 
 />
 </div>
 </div>

 <div className="space-y-1.5">
 <label className="text-[10px] font-black uppercase tracking-widest text-admin-muted">Detailed Answer</label>
 <textarea 
 name="answer" 
 required 
 rows={6}
 defaultValue={isEditing ? faqs.find(f => f.id === isEditing)?.answer :""}
 placeholder="Provide a comprehensive explanation here..."
 className="w-full bg-admin-bg border-0 p-4 outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium leading-relaxed resize-none" 
 />
 </div>

 <div className="pt-4 flex justify-end gap-4">
 <button 
 type="button" 
 onClick={() => { setIsAdding(false); setIsEditing(null); }}
 className="px-6 py-3 font-bold text-admin-muted hover:text-admin-text transition-colors"
 >
 Cancel
 </button>
 <button 
 type="submit" 
 disabled={loading}
 className="bg-admin-surface text-admin-text px-8 py-3 font-black uppercase text-xs tracking-widest hover:bg-primary hover:text-admin-text transition-all flex items-center shadow-lg"
 >
 {loading ?"Processing..." : <><Save size={16} className="mr-2" /> {isAdding ?"Publish FAQ" :"Update FAQ"}</>}
 </button>
 </div>
 </form>
 </div>
 </div>
 )}

 {/* FAQ List Display */}
 <div className="space-y-4">
 {faqs.length === 0 ? (
 <div className="text-center py-20 bg-admin-surface border border-dashed border-admin-border">
 <HelpCircle size={48} className="mx-auto text-gray-200 mb-4" />
 <p className="text-admin-muted font-bold uppercase tracking-widest text-xs">No questions in the repository yet.</p>
 </div>
 ) : (
 [...faqs].sort((a,b) => (a.order || 0) - (b.order || 0)).map((faq) => (
 <div key={faq.id} className="bg-admin-surface border border-admin-border shadow-sm hover:shadow-md transition-all group overflow-hidden">
 <div className="p-6 flex items-center justify-between">
 <div className="flex items-center gap-6">
 <div className="flex flex-col items-center justify-center text-gray-300 w-10">
 <span className="text-[10px] font-black uppercase mb-1">#{faq.order}</span>
 <GripVertical size={16} />
 </div>
 <div>
 <span className="text-[9px] font-black uppercase px-2 py-0.5 bg-primary/10 text-primary -full mb-1 inline-block tracking-tighter">
 {faq.category}
 </span>
 <h3 className="text-lg font-bold text-admin-text group-hover:text-primary transition-colors">{faq.question}</h3>
 </div>
 </div>
 <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
 <button 
 onClick={() => setIsEditing(faq.id)}
 className="p-2 text-admin-muted hover:text-blue-500 transition-colors"
 >
 <Pencil size={18} />
 </button>
 <button 
 onClick={() => handleDelete(faq.id)}
 className="p-2 text-admin-muted hover:text-red-500 transition-colors"
 >
 <Trash2 size={18} />
 </button>
 </div>
 </div>
 <div className="px-12 pb-6 flex items-start gap-4">
 <div className="text-primary font-black text-xl italic mt-0.5">A.</div>
 <p className="text-admin-muted text-sm leading-relaxed max-w-3xl border-l-[3px] border-primary/20 pl-4 py-1 italic">
 {faq.answer}
 </p>
 </div>
 </div>
 ))
 )}
 </div>
 </div>
 );
};

export default FAQManager;
