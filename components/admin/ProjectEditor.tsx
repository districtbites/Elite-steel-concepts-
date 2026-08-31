"use client";

import React, { useState, useRef } from"react";
import Button from"@/components/ui/Button";
import { Project } from"@/lib/db";
import { 
 X, 
 Save, 
 Plus, 
 Image as ImageIcon, 
 Trash2, 
 Upload, 
 Globe, 
 Truck, 
 Activity, 
 Settings,
 Layout
} from"lucide-react";
import Image from"next/image";
import Link from"next/link";

interface ProjectEditorProps {
 action: (formData: FormData) => Promise<{ success?: boolean; error?: string }>;
 initialData?: Project;
}

const ProjectEditor = ({ action, initialData }: ProjectEditorProps) => {
 const [loading, setLoading] = useState(false);
 const [featuredImage, setFeaturedImage] = useState<string | null>(initialData?.image || null);
 const [gallery, setGallery] = useState<string[]>(initialData?.gallery || []);
 const [equipment, setEquipment] = useState<string[]>(initialData?.specifications?.equipment || []);
 const [newEquip, setNewEquip] = useState("");
 
 // For handling multiple image previews (temporary)
 const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
 const [featuredFile, setFeaturedFile] = useState<File | null>(null);

 const handleFeaturedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
 const file = e.target.files?.[0];
 if (file) {
 setFeaturedFile(file);
 setFeaturedImage(URL.createObjectURL(file));
 }
 };

 const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
 const files = Array.from(e.target.files || []);
 if (files.length > 0) {
 setGalleryFiles(prev => [...prev, ...files]);
 // Create temporary previews
 const newPreviews = files.map(f => URL.createObjectURL(f));
 setGallery(prev => [...prev, ...newPreviews]);
 }
 };

 const removeGalleryItem = (index: number) => {
 setGallery(prev => prev.filter((_, i) => i !== index));
 // Also remove from files if it was a new upload
 // This is simplified; in a real app you'd track which is which
 setGalleryFiles(prev => prev.filter((_, i) => i !== index));
 };

 const addEquip = () => {
 if (newEquip.trim()) {
 setEquipment(prev => [...prev, newEquip.trim()]);
 setNewEquip("");
 }
 };

 const removeEquip = (index: number) => {
 setEquipment(prev => prev.filter((_, i) => i !== index));
 };

 const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
 e.preventDefault();
 setLoading(true);
 const formData = new FormData(e.currentTarget);
 
 // Add equipment as JSON or comma string
 formData.set("equipment", JSON.stringify(equipment));
 
 // The original gallery (existing URLs) that were NOT removed
 const remainingGallery = gallery.filter(item => item.startsWith('/uploads/'));
 formData.set("existingGallery", JSON.stringify(remainingGallery));

 // Note: New files are already in formData if they were selected in the inputs
 // But since we are managing state for previews, let's make sure files are added
 // Actually, we should probably append them manually if we used multiple inputs or state
 galleryFiles.forEach((file) => {
 formData.append("galleryFiles", file);
 });

 const result = await action(formData);
 if (result.error) {
 alert(result.error);
 setLoading(false);
 } else {
 // Success handled by server action redirect or state change
 }
 };

 return (
 <form onSubmit={handleSubmit} className="space-y-12 pb-20">
 {/* Header Sticky Bar */}
 <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-admin-surface/80 backdrop-blur-md p-6 -[2rem] border border-admin-border shadow-sm sticky top-4 z-50">
 <div>
 <h1 className="text-2xl font-black uppercase text-admin-text tracking-tight">
 {initialData ?"Refine Masterpiece" :"New Build Entry"}
 </h1>
 <p className="text-xs font-bold text-admin-muted uppercase tracking-widest mt-1">Portfolio Intelligence System</p>
 </div>
 <div className="flex items-center gap-3 w-full md:w-auto">
 <Link href="/admin/portfolio" className="flex-1 md:flex-none text-center px-6 py-3 border border-admin-border text-[10px] font-black uppercase tracking-widest hover:bg-admin-bg transition-colors">
 Cancel
 </Link>
 <Button type="submit" disabled={loading} className="flex-1 md:flex-none flex items-center justify-center gap-2">
 {loading ?"Processing..." : <><Save size={16}/> Save Project</>}
 </Button>
 </div>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
 {/* Left Column: Visuals */}
 <div className="lg:col-span-5 space-y-10">
 {/* Featured Image Section */}
 <div className="bg-admin-surface p-8 -[2.5rem] border border-admin-border shadow-sm space-y-6">
 <div className="flex items-center justify-between">
 <h3 className="text-sm font-black uppercase tracking-[0.2em] text-admin-text flex items-center">
 <ImageIcon size={18} className="mr-3 text-primary" /> Key Visual
 </h3>
 <label className="cursor-pointer bg-admin-bg p-2 text-primary hover:bg-primary hover:text-admin-text transition-all">
 <Plus size={20} />
 <input type="file" name="image" className="hidden" accept="image/*" onChange={handleFeaturedChange} />
 </label>
 </div>

 <div className="aspect-video bg-admin-bg overflow-hidden relative border-2 border-dashed border-admin-border flex items-center justify-center group">
 {featuredImage ? (
 <Image src={featuredImage} alt="Preview" fill className="object-cover group-hover:scale-110 transition-transform duration-700" unoptimized />
 ) : (
 <div className="text-center space-y-2 opacity-30">
 <Upload size={40} className="mx-auto" />
 <p className="text-[10px] font-black uppercase tracking-widest">Primary Build Visual</p>
 </div>
 )}
 </div>
 </div>

 {/* Gallery Section */}
 <div className="bg-admin-surface p-8 -[2.5rem] border border-admin-border shadow-sm space-y-6">
 <div className="flex items-center justify-between">
 <h3 className="text-sm font-black uppercase tracking-[0.2em] text-admin-text flex items-center">
 <Layout size={18} className="mr-3 text-primary" /> Detail Gallery
 </h3>
 <label className="cursor-pointer bg-admin-bg p-2 text-primary hover:bg-primary hover:text-admin-text transition-all">
 <Plus size={20} />
 <input type="file" multiple className="hidden" accept="image/*" onChange={handleGalleryChange} />
 </label>
 </div>

 <div className="grid grid-cols-2 gap-4">
 {gallery.map((img, i) => (
 <div key={i} className="aspect-square bg-admin-bg overflow-hidden relative group border border-admin-border">
 <Image src={img} alt={`Gallery ${i}`} fill className="object-cover" unoptimized />
 <button 
 type="button"
 onClick={() => removeGalleryItem(i)}
 className="absolute inset-0 bg-red-500/80 text-admin-text opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
 >
 <Trash2 size={24} />
 </button>
 </div>
 ))}
 <label className="aspect-square bg-admin-bg border-2 border-dashed border-admin-border flex flex-col items-center justify-center text-gray-300 hover:border-primary hover:text-primary transition-all cursor-pointer">
 <Upload size={24} />
 <span className="text-[8px] font-black uppercase tracking-widest mt-2">{gallery.length} Images</span>
 <input type="file" multiple className="hidden" accept="image/*" onChange={handleGalleryChange} />
 </label>
 </div>
 </div>
 </div>

 {/* Right Column: Intelligence */}
 <div className="lg:col-span-7 space-y-10">
 {/* Basic Intel */}
 <div className="bg-admin-surface p-10 -[3rem] border border-admin-border shadow-sm space-y-8">
 <h3 className="text-xs font-black uppercase tracking-[0.3em] text-admin-muted flex items-center">
 <Globe size={16} className="mr-3 text-primary" /> Build Definition
 </h3>

 <div className="space-y-6">
 <div className="space-y-2">
 <label className="text-[10px] font-black uppercase text-admin-text tracking-widest ml-1">Hero Title</label>
 <input 
 name="title" 
 defaultValue={initialData?.title}
 placeholder="e.g. THE EMERALD OASIS FOOD TRUCK"
 required
 className="w-full bg-admin-bg border-0 p-4 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-lg text-admin-text"
 />
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 <div className="space-y-2">
 <label className="text-[10px] font-black uppercase text-admin-text tracking-widest ml-1">Architecture Type</label>
 <select 
 name="category" 
 defaultValue={initialData?.category ||"Food Truck"}
 className="w-full bg-admin-bg border-0 p-4 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-sm text-admin-text uppercase appearance-none"
 >
 <option value="Food Truck">Food Truck</option>
 <option value="Concession Trailer">Concession Trailer</option>
 <option value="Mobile Bar">Mobile Bar</option>
 <option value="Support Vehicle">Support Vehicle</option>
 <option value="Custom Box Build">Custom Box Build</option>
 </select>
 </div>
 <div className="space-y-2">
 <label className="text-[10px] font-black uppercase text-admin-text tracking-widest ml-1">Short Hook / Tagline</label>
 <input 
 name="tagline" 
 defaultValue={initialData?.tagline}
 placeholder="e.g. PERFORMANCE MEETS STYLE"
 className="w-full bg-admin-bg border-0 p-4 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-sm text-admin-text"
 />
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
 <div className="space-y-2">
 <label className="text-[10px] font-black uppercase text-admin-text tracking-widest ml-1">Client Affiliation</label>
 <input name="client" defaultValue={initialData?.client} placeholder="Client Name" className="w-full bg-admin-bg border-0 p-4 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-xs" />
 </div>
 <div className="space-y-2">
 <label className="text-[10px] font-black uppercase text-admin-text tracking-widest ml-1">Deployment Date</label>
 <input name="completionDate" defaultValue={initialData?.completionDate} placeholder="e.g. DEC 2024" className="w-full bg-admin-bg border-0 p-4 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-xs" />
 </div>
 <div className="space-y-2">
 <label className="text-[10px] font-black uppercase text-admin-text tracking-widest ml-1">Deployment Zone</label>
 <input name="location" defaultValue={initialData?.location} placeholder="e.g. VIRGINIA, USA" className="w-full bg-admin-bg border-0 p-4 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-xs" />
 </div>
 </div>

 <div className="space-y-2">
 <label className="text-[10px] font-black uppercase text-admin-text tracking-widest ml-1">Build Narrative (Description)</label>
 <textarea 
 name="description" 
 defaultValue={initialData?.description}
 placeholder="Deep dive into the project's vision, challenges, and success..."
 required
 rows={6}
 className="w-full bg-admin-bg border-0 p-6 -[2rem] outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-admin-muted leading-relaxed"
 />
 </div>

 <div className="flex items-center gap-3 p-4 bg-admin-bg">
 <input 
 type="checkbox" 
 name="featured" 
 defaultChecked={initialData?.featured}
 className="w-5 h-5 accent-secondary" 
 />
 <span className="text-[10px] font-black uppercase tracking-widest text-admin-text">Promote to"Featured Project" (Home Display)</span>
 </div>
 </div>
 </div>

 {/* Technical Specs */}
 <div className="bg-admin-surface p-10 -[3rem] border border-admin-border shadow-sm space-y-8">
 <h3 className="text-xs font-black uppercase tracking-[0.3em] text-admin-muted flex items-center">
 <Settings size={16} className="mr-3 text-primary" /> Technical Intelligence
 </h3>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
 <div className="space-y-2">
 <label className="text-[10px] font-black uppercase text-admin-text tracking-widest ml-1 flex items-center gap-2"><Truck size={12}/> Physical Scale</label>
 <input name="dimensions" defaultValue={initialData?.specifications?.dimensions} placeholder="e.g. 24ft x 8.5ft" className="w-full bg-admin-bg border-0 p-4 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-xs" />
 </div>
 <div className="space-y-2">
 <label className="text-[10px] font-black uppercase text-admin-text tracking-widest ml-1 flex items-center gap-2"><Layout size={12}/> Chassis Base</label>
 <input name="chassis" defaultValue={initialData?.specifications?.chassis} placeholder="e.g. FORD F-59 STRIPPED" className="w-full bg-admin-bg border-0 p-4 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-xs" />
 </div>
 <div className="space-y-2 lg:col-span-2">
 <label className="text-[10px] font-black uppercase text-admin-text tracking-widest ml-1 flex items-center gap-2"><Activity size={12}/> Power System</label>
 <input name="power" defaultValue={initialData?.specifications?.power} placeholder="e.g. 15KW ONAN GENERATOR + SHORE PLUG" className="w-full bg-admin-bg border-0 p-4 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-xs" />
 </div>
 </div>

 {/* Equipment List */}
 <div className="space-y-4">
 <label className="text-[10px] font-black uppercase text-admin-text tracking-widest ml-1">Integrated Equipment Inventory</label>
 <div className="flex gap-2">
 <input 
 type="text" 
 value={newEquip}
 onChange={(e) => setNewEquip(e.target.value)}
 placeholder="Add equipment (e.g. Vulcan 4-Burner)..."
 className="flex-1 bg-admin-bg border-0 p-4 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-xs"
 onKeyPress={(e) => { if(e.key === 'Enter') { e.preventDefault(); addEquip(); } }}
 />
 <button type="button" onClick={addEquip} className="p-4 bg-admin-surface text-primary hover:bg-primary hover:text-admin-text transition-all">
 <Plus size={20} />
 </button>
 </div>
 <div className="flex flex-wrap gap-2">
 {equipment.map((item, i) => (
 <span key={i} className="flex items-center gap-2 bg-admin-bg border border-admin-border text-[10px] font-black uppercase tracking-widest text-admin-text px-3 py-2 group">
 {item}
 <button type="button" onClick={() => removeEquip(i)} className="text-gray-300 hover:text-red-500 transition-colors">
 <X size={12} />
 </button>
 </span>
 ))}
 </div>
 </div>
 </div>
 </div>
 </div>

 {/* Hidden items for ID and existing data */}
 {initialData && <input type="hidden" name="id" value={initialData.id} />}
 {initialData && <input type="hidden" name="existingImage" value={initialData.image} />}
 </form>
 );
};

export default ProjectEditor;
