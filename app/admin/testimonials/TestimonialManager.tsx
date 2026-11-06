"use client";

import React, { useState } from"react";
import Button from"@/components/ui/Button";
import { addTestimonial, removeTestimonial, editTestimonial } from"@/app/actions/testimonials";
import { Testimonial } from"@/lib/db";
import { 
 Trash2, 
 Edit2, 
 Plus, 
 Star, 
 X, 
 Save, 
 Quote as QuoteIcon, 
 Search, 
 Filter,
 User,
 Briefcase,
 MessageSquare,
 CheckCircle2
} from"lucide-react";

interface TestimonialManagerProps {
 initialTestimonials: Testimonial[];
}

const TestimonialManager = ({ initialTestimonials }: TestimonialManagerProps) => {
 const [isAdding, setIsAdding] = useState(false);
 const [editingId, setEditingId] = useState<string | null>(null);
 const [loading, setLoading] = useState(false);
 const [searchTerm, setSearchTerm] = useState("");
 const [filterRating, setFilterRating] = useState<string>("All");

 const filteredTestimonials = initialTestimonials.filter(t => {
 const matchesSearch = t.clientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
 t.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
 t.content.toLowerCase().includes(searchTerm.toLowerCase());
 const matchesRating = filterRating ==="All" || t.rating === Number(filterRating);
 return matchesSearch && matchesRating;
 });

 const handleDelete = async (id: string) => {
 if (!confirm("Are you sure you want to decommission this testimonial from the public view?")) return;
 setLoading(true);
 await removeTestimonial(id);
 setLoading(false);
 };

 const handleAddSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
 e.preventDefault();
 setLoading(true);
 const formData = new FormData(e.currentTarget);
 const result = await addTestimonial(formData);
 if (result?.error) {
 alert(result.error);
 } else {
 setIsAdding(false);
 }
 setLoading(false);
 };

 const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
 e.preventDefault();
 setLoading(true);
 const formData = new FormData(e.currentTarget);
 const result = await editTestimonial(formData);
 if (result?.error) {
 alert(result.error);
 } else {
 setEditingId(null);
 }
 setLoading(false);
 };

 return (
 <div className="space-y-10">
 {/* Search & Filter Intelligence */}
 <div className="bg-admin-surface p-6 -[2rem] border border-admin-border shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
 <div className="relative w-full md:w-96">
 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-admin-muted" size={18} />
 <input 
 type="text" 
 placeholder="Search by client, brand, or content..."
 value={searchTerm}
 onChange={(e) => setSearchTerm(e.target.value)}
 className="w-full bg-admin-bg border-0 pl-12 pr-4 py-3.5 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-sm"
 />
 </div>
 <div className="flex gap-4 w-full md:w-auto">
 <div className="flex items-center gap-2 bg-admin-bg px-4 border border-transparent focus-within:border-primary/20">
 <Star size={14} className="text-admin-muted" />
 <select 
 value={filterRating}
 onChange={(e) => setFilterRating(e.target.value)}
 className="bg-transparent border-0 py-3 text-xs font-black uppercase tracking-widest outline-none text-admin-text"
 >
 <option value="All">All Ratings</option>
 {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} Stars</option>)}
 </select>
 </div>
 <Button onClick={() => setIsAdding(!isAdding)} className="flex-1 md:flex-none flex items-center justify-center gap-2">
 {isAdding ? <><X size={18}/> Close</> : <><Plus size={18}/> Add Review</>}
 </Button>
 </div>
 </div>

 {/* Add Form (Premium) */}
 {isAdding && (
 <form 
 onSubmit={handleAddSubmit} 
 className="bg-admin-surface p-10 -[2.5rem] border border-admin-border shadow-xl animate-fadeIn space-y-8"
 >
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 bg-primary/10 flex items-center justify-center text-primary">
 <MessageSquare size={20} />
 </div>
 <h3 className="text-xl font-black uppercase text-admin-text tracking-tight">Register New Client Voice</h3>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
 <div className="space-y-2">
 <label className="text-[10px] font-black uppercase text-admin-muted tracking-widest ml-1 flex items-center gap-2"><User size={12}/> Client Name</label>
 <input name="clientName" placeholder="e.g. John Doe" required className="w-full bg-admin-bg border-0 p-4 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-xs" />
 </div>
 <div className="space-y-2">
 <label className="text-[10px] font-black uppercase text-admin-muted tracking-widest ml-1 flex items-center gap-2"><Briefcase size={12}/> Brand / Company</label>
 <input name="company" placeholder="e.g. Mobile Grills Inc." className="w-full bg-admin-bg border-0 p-4 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-xs" />
 </div>
 <div className="space-y-2">
 <label className="text-[10px] font-black uppercase text-admin-muted tracking-widest ml-1 flex items-center gap-2"><Star size={12}/> Satisfaction Rating</label>
 <select name="rating" className="w-full bg-admin-bg border-0 p-4 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-xs uppercase" defaultValue="5">
 <option value="5">5 Stars (Perfect)</option>
 <option value="4">4 Stars (Great)</option>
 <option value="3">3 Stars (Average)</option>
 <option value="2">2 Stars (Poor)</option>
 <option value="1">1 Star (Fail)</option>
 </select>
 </div>
 <div className="md:col-span-3 space-y-2">
 <label className="text-[10px] font-black uppercase text-admin-muted tracking-widest ml-1 flex items-center gap-2"><QuoteIcon size={12}/> Client Narrative</label>
 <textarea 
 name="content" 
 placeholder="Paste the client's official testimonial here..." 
 required 
 rows={5} 
 className="w-full bg-admin-bg border-0 p-6 -[2rem] outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-admin-muted leading-relaxed" 
 />
 </div>
 </div>
 
 <div className="flex justify-end gap-3 pt-4">
 <button type="button" onClick={() => setIsAdding(false)} className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-admin-muted hover:text-admin-text transition-colors">Abort</button>
 <Button type="submit" disabled={loading} className="px-10">{loading ?"Synchronizing..." :"Authorize Review"}</Button>
 </div>
 </form>
 )}

 {/* Testimonials Intelligence Feed */}
 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
 {filteredTestimonials.map((t) => (
 <div key={t.id} className="bg-admin-surface p-8 -[2.5rem] border border-admin-border shadow-sm relative group hover:shadow-xl transition-all duration-500 flex flex-col">
 {editingId === t.id ? (
 <form onSubmit={handleEditSubmit} className="space-y-6">
 <input type="hidden" name="id" value={t.id} />
 <div className="grid grid-cols-2 gap-4">
 <input name="clientName" defaultValue={t.clientName} required className="w-full bg-admin-bg border-0 p-3 outline-none focus:ring-2 focus:ring-primary/20 text-xs font-bold" />
 <select name="rating" defaultValue={t.rating} className="w-full bg-admin-bg border-0 p-3 outline-none focus:ring-2 focus:ring-primary/20 text-xs font-bold">
 {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} Stars</option>)}
 </select>
 </div>
 <input name="company" defaultValue={t.company} placeholder="Company" className="w-full bg-admin-bg border-0 p-3 outline-none focus:ring-2 focus:ring-primary/20 text-xs font-bold" />
 <textarea name="content" defaultValue={t.content} required rows={4} className="w-full bg-admin-bg border-0 p-4 outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium leading-relaxed text-admin-muted" />
 <div className="flex gap-2">
 <Button type="submit" size="sm" disabled={loading} className="flex-1"><Save size={16} className="mr-2"/> Commit Changes</Button>
 <button type="button" onClick={() => setEditingId(null)} className="px-4 text-[10px] font-black uppercase tracking-widest text-admin-muted hover:text-admin-text transition-colors">Discard</button>
 </div>
 </form>
 ) : (
 <>
 {/* Header Intel */}
 <div className="flex justify-between items-start mb-6">
 <div className="flex items-start gap-4">
 <div className="w-12 h-12 bg-admin-surface flex items-center justify-center text-primary font-black text-xl uppercase shadow-lg">
 {t.clientName.charAt(0)}
 </div>
 <div>
 <div className="font-black text-admin-text text-lg uppercase tracking-tight group-hover:text-primary transition-colors">{t.clientName}</div>
 <div className="text-[10px] text-admin-muted font-bold uppercase tracking-[0.2em] mt-0.5">{t.company || 'Private Client'}</div>
 </div>
 </div>
 <div className="flex bg-admin-bg p-2 border border-admin-border">
 {[...Array(5)].map((_, i) => (
 <Star key={i} size={14} fill={i < t.rating ?"#facc15" :"none"} className={i < t.rating ?"text-yellow-400" :"text-gray-200"} />
 ))}
 </div>
 </div>
 
 {/* Testimonial Narrative */}
 <div className="relative flex-grow">
 <QuoteIcon size={40} className="absolute -top-4 -left-4 text-primary/10 -z-1" />
 <p className="text-admin-muted italic leading-loose text-sm relative z-10 border-l-4 border-primary/20 pl-6 my-4">
"{t.content}"
 </p>
 </div>

 <div className="mt-8 pt-6 border-t border-admin-border-hover flex justify-between items-center">
 <div className="flex items-center gap-2 text-[9px] font-black uppercase text-admin-muted tracking-widest">
 <CheckCircle2 size={12} className="text-green-500" /> Authorized Review
 </div>
 <div className="flex gap-2 invisible group-hover:visible transition-all">
 <button 
 onClick={() => setEditingId(t.id)} 
 className="p-3 bg-admin-bg text-admin-text hover:bg-admin-surface hover:text-admin-text transition-all shadow-sm"
 >
 <Edit2 size={16} />
 </button>
 <button 
 onClick={() => handleDelete(t.id)} 
 className="p-3 bg-admin-bg text-red-500 hover:bg-red-500 hover:text-admin-text transition-all shadow-sm"
 >
 <Trash2 size={16} />
 </button>
 </div>
 </div>
 </>
 )}
 </div>
 ))}
 {filteredTestimonials.length === 0 && (
 <div className="col-span-full p-20 text-center space-y-6 bg-admin-surface -[3rem] border border-dashed border-admin-border">
 <div className="w-20 h-20 bg-admin-bg -full flex items-center justify-center mx-auto text-gray-200">
 <MessageSquare size={40} />
 </div>
 <div className="space-y-2">
 <p className="text-admin-text font-black uppercase tracking-widest text-sm">No Client Feedback Detected</p>
 <p className="text-admin-muted text-xs font-medium">Clear your search parameters or register your first client voice.</p>
 </div>
 </div>
 )}
 </div>
 </div>
 );
};

export default TestimonialManager;
