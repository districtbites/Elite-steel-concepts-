"use client";

import React, { useState } from "react";
import { 
    Eye, 
    Mail, 
    Phone, 
    Calendar, 
    Clock, 
    DollarSign, 
    Truck, 
    MapPin, 
    Briefcase, 
    FileText, 
    Search, 
    Filter, 
    Trash2, 
    CheckCircle2, 
    User,
    ArrowUpRight,
    Settings
} from "lucide-react";
import { Quote } from "@/lib/db";
import Modal from "@/components/ui/Modal";
import { updateQuoteStatus, removeQuote } from "@/app/actions/quote";

interface QuoteListProps {
  initialQuotes: Quote[];
}

const QuoteList = ({ initialQuotes }: QuoteListProps) => {
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [filterType, setFilterType] = useState<string>("All");

  const filteredQuotes = initialQuotes.filter(quote => {
    const matchesSearch = 
        quote.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        quote.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.phone.includes(searchTerm);
    
    const matchesStatus = filterStatus === "All" || quote.status === filterStatus;
    const matchesType = filterType === "All" || quote.projectType === filterType;

    return matchesSearch && matchesStatus && matchesType;
  });

  const handleStatusUpdate = async (id: string, newStatus: Quote["status"]) => {
    await updateQuoteStatus(id, newStatus);
    if (selectedQuote && selectedQuote.id === id) {
        setSelectedQuote({ ...selectedQuote, status: newStatus });
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to remove this request?")) {
        await removeQuote(id);
        setSelectedQuote(null);
    }
  };

  const projectTypes = Array.from(new Set(initialQuotes.map(q => q.projectType)));

  return (
    <div className="space-y-6">
      {/* Search & Filter Bar */}
      <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                  type="text" 
                  placeholder="Search clients, emails, or phones..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-50 border-0 pl-12 pr-4 py-3.5 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-sm"
              />
          </div>
          <div className="flex gap-4 w-full md:w-auto">
              <div className="flex items-center gap-2 bg-gray-50 px-4 rounded-2xl border border-transparent focus-within:border-primary/20">
                  <Filter size={14} className="text-gray-400" />
                  <select 
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="bg-transparent border-0 py-3 text-xs font-black uppercase tracking-widest outline-none text-secondary"
                  >
                      <option value="All">All Status</option>
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Closed">Closed</option>
                  </select>
              </div>
              <div className="flex items-center gap-2 bg-gray-50 px-4 rounded-2xl border border-transparent focus-within:border-primary/20">
                  <Briefcase size={14} className="text-gray-400" />
                  <select 
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="bg-transparent border-0 py-3 text-xs font-black uppercase tracking-widest outline-none text-secondary"
                  >
                      <option value="All">All Types</option>
                      {projectTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                      ))}
                  </select>
              </div>
          </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden min-h-[400px]">
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-gray-50/50 border-b border-gray-100">
                    <tr>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Client Profile</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Project Specs</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Lifecycle</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {filteredQuotes.map((quote) => (
                        <tr key={quote.id} className="group hover:bg-gray-50/30 transition-all">
                            <td className="px-8 py-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-2xl bg-secondary flex items-center justify-center text-primary font-black uppercase">
                                        {quote.name.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="font-black text-secondary uppercase tracking-tight">{quote.name}</div>
                                        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">{quote.email}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-8 py-6">
                                <span className="px-3 py-1 bg-gray-100 text-secondary text-[10px] font-black uppercase tracking-widest rounded-lg block w-max mb-2">
                                    {quote.projectType}
                                </span>
                                <div className="flex items-center gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                    <span className="flex items-center gap-1"><DollarSign size={10} className="text-primary" /> {quote.budget || "TBD"}</span>
                                    <span className="flex items-center gap-1"><Clock size={10} className="text-primary" /> {quote.timeline}</span>
                                </div>
                            </td>
                            <td className="px-8 py-6">
                                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                    quote.status === "New" ? "bg-primary/10 text-primary" : 
                                    quote.status === "Contacted" ? "bg-blue-50 text-blue-500" : 
                                    "bg-gray-100 text-gray-400"
                                }`}>
                                    <div className={`w-1.5 h-1.5 rounded-full ${
                                        quote.status === "New" ? "bg-primary" : 
                                        quote.status === "Contacted" ? "bg-blue-500" : 
                                        "bg-gray-400"
                                    }`} />
                                    {quote.status}
                                </div>
                                <div className="text-[10px] text-gray-400 font-medium mt-1 uppercase">{quote.date}</div>
                            </td>
                            <td className="px-8 py-6 text-right">
                                <div className="flex items-center justify-end gap-2">
                                    <button 
                                        onClick={() => setSelectedQuote(quote)}
                                        className="p-2.5 bg-gray-50 text-secondary rounded-xl hover:bg-secondary hover:text-white transition-all shadow-sm group-hover:shadow-md"
                                    >
                                        <Eye size={16} />
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(quote.id)}
                                        className="p-2.5 bg-gray-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm group-hover:shadow-md"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        {filteredQuotes.length === 0 && (
            <div className="p-20 text-center space-y-4">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
                    <Search size={32} />
                </div>
                <p className="text-gray-400 font-black uppercase tracking-widest text-xs">No project inquiries match your search.</p>
            </div>
        )}
      </div>

      {/* Advanced Details Modal */}
      {selectedQuote && (
        <Modal 
          isOpen={!!selectedQuote} 
          onClose={() => setSelectedQuote(null)}
          title="Inquiry Intelligence"
        >
          <div className="space-y-10 pb-6">
            {/* Modal Header Actions */}
            <div className="flex flex-wrap items-center justify-between border-b border-gray-100 pb-8 gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-3xl bg-secondary flex items-center justify-center text-primary text-2xl font-black uppercase">
                        {selectedQuote.name.charAt(0)}
                    </div>
                    <div>
                        <h2 className="text-2xl font-black uppercase text-secondary tracking-tighter leading-tight">{selectedQuote.name}</h2>
                        <div className="flex items-center gap-3 mt-1">
                            <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">{selectedQuote.status}</span>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Received {selectedQuote.date}</span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <select 
                        value={selectedQuote.status}
                        onChange={(e) => handleStatusUpdate(selectedQuote.id, e.target.value as Quote["status"])}
                        className="bg-secondary text-white px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border-0 outline-none hover:bg-primary hover:text-secondary transition-all cursor-pointer appearance-none"
                    >
                        <option value="New">Mark as New</option>
                        <option value="Contacted">Mark as Contacted</option>
                        <option value="Closed">Mark as Closed</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Contact Intel */}
                <div className="space-y-6">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 flex items-center">
                        <User size={12} className="mr-2" /> Contact Intel
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-primary/20 transition-all">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-primary">
                                <Mail size={18} />
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <div className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Direct Email</div>
                                <a href={`mailto:${selectedQuote.email}`} className="text-sm font-bold text-secondary block truncate hover:text-primary transition-colors">{selectedQuote.email}</a>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-primary/20 transition-all">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-primary">
                                <Phone size={18} />
                            </div>
                            <div>
                                <div className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Phone Line</div>
                                <a href={`tel:${selectedQuote.phone}`} className="text-sm font-bold text-secondary block hover:text-primary transition-colors">{selectedQuote.phone}</a>
                            </div>
                        </div>
                        {selectedQuote.company && (
                            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-primary/20 transition-all">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-primary">
                                    <Briefcase size={18} />
                                </div>
                                <div>
                                    <div className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Affiliation</div>
                                    <span className="text-sm font-bold text-secondary uppercase tracking-tight">{selectedQuote.company}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Build Parameters */}
                <div className="space-y-6">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 flex items-center">
                        <Settings size={12} className="mr-2" /> Build Parameters
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-5 bg-secondary rounded-[2rem] text-white">
                            <div className="text-primary mb-2"><Truck size={20} /></div>
                            <div className="text-[9px] font-black uppercase opacity-50 tracking-widest">Architecture</div>
                            <div className="text-sm font-black uppercase tracking-tight leading-tight mt-1">{selectedQuote.projectType}</div>
                        </div>
                        <div className="p-5 bg-white border border-gray-100 rounded-[2rem] shadow-sm">
                            <div className="text-primary mb-2"><DollarSign size={20} /></div>
                            <div className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Allocation</div>
                            <div className="text-sm font-black text-secondary leading-tight mt-1">{selectedQuote.budget || "TBD"}</div>
                        </div>
                        <div className="p-5 bg-white border border-gray-100 rounded-[2rem] shadow-sm">
                            <div className="text-primary mb-2"><Clock size={20} /></div>
                            <div className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Deployment</div>
                            <div className="text-sm font-black text-secondary leading-tight mt-1">{selectedQuote.timeline}</div>
                        </div>
                        <div className="p-5 bg-white border border-gray-100 rounded-[2rem] shadow-sm">
                            <div className="text-primary mb-2"><MapPin size={20} /></div>
                            <div className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Sourcing</div>
                            <div className="text-xs font-black text-secondary leading-tight mt-1 uppercase">{selectedQuote.sourcing}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Inbound Message */}
            <div className="space-y-6">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 flex items-center">
                    <FileText size={14} className="mr-2" /> Vision & Objectives
                </h3>
                <div className="bg-gray-50 p-8 rounded-[2.5rem] border border-gray-100 italic text-gray-600 leading-loose">
                    "{selectedQuote.message}"
                </div>
            </div>

            {/* Technical Add-ons */}
            {(selectedQuote.dimensions || selectedQuote.equipment || selectedQuote.menuType || (selectedQuote.services && selectedQuote.services.length > 0)) && (
                <div className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {selectedQuote.menuType && (
                        <div>
                            <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest block mb-2">Gastronomy Type</span>
                            <span className="px-4 py-2 bg-secondary text-primary text-[10px] font-black uppercase rounded-lg tracking-widest">{selectedQuote.menuType}</span>
                        </div>
                    )}
                    {selectedQuote.dimensions && (
                        <div>
                            <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest block mb-1">Architecture Scale</span>
                            <span className="text-sm font-bold text-secondary uppercase tracking-tighter">{selectedQuote.dimensions}</span>
                        </div>
                    )}
                    {selectedQuote.services && selectedQuote.services.length > 0 && (
                        <div className="md:col-span-1">
                            <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest block mb-3">Service Inclusions</span>
                            <div className="flex flex-wrap gap-2">
                                {selectedQuote.services.map(s => (
                                    <span key={s} className="px-3 py-1.5 bg-primary/5 border border-primary/20 text-primary text-[9px] font-black uppercase rounded-md tracking-widest">
                                        {s}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                    {selectedQuote.equipment && (
                        <div className="md:col-span-3 pt-4">
                            <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest block mb-3">Inventory Requirements</span>
                            <div className="p-6 bg-white border-2 border-dashed border-gray-100 rounded-3xl text-sm font-bold text-gray-500 uppercase tracking-tight leading-relaxed">
                                {selectedQuote.equipment}
                            </div>
                        </div>
                    )}
                </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default QuoteList;
