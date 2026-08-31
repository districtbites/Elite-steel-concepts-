"use client";

import React, { useState, useEffect } from"react";
import { 
 Mail, 
 Calendar, 
 Trash2, 
 Search, 
 Download, 
 Inbox,
 CheckCircle2
} from"lucide-react";
import { Newsletter } from"@/lib/db";
import { removeNewsletter } from"@/app/actions/newsletter";

interface NewsletterListProps {
 initialData: Newsletter[];
}

const NewsletterList = ({ initialData }: NewsletterListProps) => {
 const [searchTerm, setSearchTerm] = useState("");
 const [data, setData] = useState(initialData);

 const filteredData = data.filter(n => 
 n.email.toLowerCase().includes(searchTerm.toLowerCase())
 );

 const handleDelete = async (id: string) => {
 if (window.confirm("Remove this email from the database?")) {
 await removeNewsletter(id);
 setData(prev => prev.filter(n => n.id !== id));
 }
 };

 const exportToCSV = () => {
 const headers = ["ID","Email","Date"];
 const rows = data.map(n => [n.id, n.email, n.date]);
 const csvContent ="data:text/csv;charset=utf-8," 
 + headers.join(",") +"\n"
 + rows.map(r => r.join(",")).join("\n");
 
 const encodedUri = encodeURI(csvContent);
 const link = document.createElement("a");
 link.setAttribute("href", encodedUri);
 link.setAttribute("download", `esc_newsletter_subs_${new Date().toISOString().split('T')[0]}.csv`);
 document.body.appendChild(link);
 link.click();
 document.body.removeChild(link);
 };

 return (
 <div className="space-y-8">
 {/* Control Bar */}
 <div className="bg-admin-surface p-6 -[2rem] border border-admin-border shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
 <div className="relative w-full md:w-96">
 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-admin-muted" size={18} />
 <input 
 type="text" 
 placeholder="Search by email..."
 value={searchTerm}
 onChange={(e) => setSearchTerm(e.target.value)}
 className="w-full bg-admin-bg border-0 pl-12 pr-4 py-3.5 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-sm"
 />
 </div>
 <div className="flex gap-4 w-full md:w-auto">
 <button 
 onClick={exportToCSV}
 className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-admin-surface text-admin-text px-6 py-3.5 font-black uppercase text-[10px] tracking-widest hover:bg-primary hover:text-admin-text transition-all"
 >
 <Download size={16} /> Export CSV
 </button>
 <div className="flex items-center gap-2 bg-admin-bg px-6 py-3.5 text-[10px] font-black uppercase tracking-widest text-admin-text border border-admin-border">
 Total: {data.length}
 </div>
 </div>
 </div>

 {/* Submissions List */}
 <div className="bg-admin-surface -[2.5rem] border border-admin-border shadow-sm overflow-hidden min-h-[400px]">
 <table className="w-full text-left">
 <thead className="bg-admin-bg/50 border-b border-admin-border">
 <tr>
 <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-admin-muted">Electronic Mail Address</th>
 <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-admin-muted">Subscription Date</th>
 <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-admin-muted">Trust Level</th>
 <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-admin-muted text-right">Actions</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-gray-50">
 {filteredData.map((n) => (
 <tr key={n.id} className="group hover:bg-admin-bg/30 transition-all">
 <td className="px-8 py-6">
 <div className="flex items-center gap-4">
 <div className="w-10 h-10 bg-primary/10 flex items-center justify-center text-primary">
 <Mail size={18} />
 </div>
 <div className="font-bold text-admin-text text-sm">{n.email}</div>
 </div>
 </td>
 <td className="px-8 py-6">
 <div className="flex items-center gap-2 text-[10px] font-bold text-admin-muted uppercase tracking-widest">
 <Calendar size={12} /> {n.date}
 </div>
 </td>
 <td className="px-8 py-6">
 <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-600 text-[9px] font-black uppercase tracking-widest">
 <CheckCircle2 size={10} /> Verified Lead
 </div>
 </td>
 <td className="px-8 py-6 text-right">
 <button 
 onClick={() => handleDelete(n.id)}
 className="p-2.5 bg-admin-bg text-red-500 hover:bg-red-500 hover:text-admin-text transition-all shadow-sm group-hover:shadow-md"
 >
 <Trash2 size={16} />
 </button>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 {filteredData.length === 0 && (
 <div className="p-20 text-center space-y-4">
 <div className="w-16 h-16 bg-admin-bg -full flex items-center justify-center mx-auto text-gray-300">
 <Inbox size={32} />
 </div>
 <p className="text-admin-muted font-black uppercase tracking-widest text-xs">No newsletter subscriptions found.</p>
 </div>
 )}
 </div>
 </div>
 );
};

export default NewsletterList;
