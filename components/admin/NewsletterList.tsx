"use client";

import React, { useState, useEffect } from "react";
import { 
    Mail, 
    Calendar, 
    Trash2, 
    Search, 
    Download, 
    Inbox,
    CheckCircle2
} from "lucide-react";
import { Newsletter } from "@/lib/db";
import { removeNewsletter } from "@/app/actions/newsletter";

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
        const headers = ["ID", "Email", "Date"];
        const rows = data.map(n => [n.id, n.email, n.date]);
        const csvContent = "data:text/csv;charset=utf-8," 
            + headers.join(",") + "\n"
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
            <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search by email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-gray-50 border-0 pl-12 pr-4 py-3.5 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-sm"
                    />
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                    <button 
                        onClick={exportToCSV}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-secondary text-white px-6 py-3.5 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-primary hover:text-secondary transition-all"
                    >
                        <Download size={16} /> Export CSV
                    </button>
                    <div className="flex items-center gap-2 bg-gray-50 px-6 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-secondary border border-gray-100">
                         Total: {data.length}
                    </div>
                </div>
            </div>

            {/* Submissions List */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden min-h-[400px]">
                <table className="w-full text-left">
                    <thead className="bg-gray-50/50 border-b border-gray-100">
                        <tr>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Electronic Mail Address</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Subscription Date</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Trust Level</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {filteredData.map((n) => (
                            <tr key={n.id} className="group hover:bg-gray-50/30 transition-all">
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                            <Mail size={18} />
                                        </div>
                                        <div className="font-bold text-secondary text-sm">{n.email}</div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                        <Calendar size={12} /> {n.date}
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-600 rounded-lg text-[9px] font-black uppercase tracking-widest">
                                        <CheckCircle2 size={10} /> Verified Lead
                                    </div>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <button 
                                        onClick={() => handleDelete(n.id)}
                                        className="p-2.5 bg-gray-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm group-hover:shadow-md"
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
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
                            <Inbox size={32} />
                        </div>
                        <p className="text-gray-400 font-black uppercase tracking-widest text-xs">No newsletter subscriptions found.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NewsletterList;
