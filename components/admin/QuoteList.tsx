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
  Trash2, 
  User,
  Settings,
  MoreVertical
} from "lucide-react";
import { Quote } from "@/lib/db";
import Modal from "@/components/ui/Modal";
import { updateQuoteStatus, removeQuote } from "@/app/actions/quote";

interface QuoteListProps {
  initialQuotes: Quote[];
}

const STAGES: Quote["status"][] = [
  "New", 
  "Contacted", 
  "Designing", 
  "Quoted", 
  "In Production", 
  "Delivered", 
  "Closed"
];

export default function QuoteList({ initialQuotes }: QuoteListProps) {
  const [quotes, setQuotes] = useState<Quote[]>(initialQuotes);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [draggedQuoteId, setDraggedQuoteId] = useState<string | null>(null);

  const filteredQuotes = quotes.filter(quote => {
    return quote.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
           quote.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
           quote.phone.includes(searchTerm);
  });

  const handleStatusUpdate = async (id: string, newStatus: Quote["status"]) => {
    // Optimistic update
    setQuotes(prev => prev.map(q => q.id === id ? { ...q, status: newStatus } : q));
    if (selectedQuote && selectedQuote.id === id) {
      setSelectedQuote({ ...selectedQuote, status: newStatus });
    }
    // Server update
    await updateQuoteStatus(id, newStatus);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to remove this request?")) {
      setQuotes(prev => prev.filter(q => q.id !== id));
      await removeQuote(id);
      setSelectedQuote(null);
    }
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedQuoteId(id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = async (e: React.DragEvent, status: Quote["status"]) => {
    e.preventDefault();
    if (draggedQuoteId) {
      await handleStatusUpdate(draggedQuoteId, status);
      setDraggedQuoteId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="bg-admin-surface p-6 border border-admin-border shadow-sm flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-admin-muted" size={18} />
          <input 
            type="text" 
            placeholder="Search leads, emails, or phones..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-admin-bg border-0 pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-sm text-admin-text"
          />
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-6 overflow-x-auto pb-8 min-h-[600px]">
        {STAGES.map(stage => {
          const stageQuotes = filteredQuotes.filter(q => q.status === stage);
          return (
            <div 
              key={stage} 
              className="flex-shrink-0 w-[320px] flex flex-col bg-admin-surface border border-admin-border"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, stage)}
            >
              {/* Column Header */}
              <div className="p-4 border-b border-admin-border bg-admin-bg/50 flex justify-between items-center sticky top-0">
                <h3 className="text-xs font-black uppercase tracking-widest text-admin-text">{stage}</h3>
                <span className="bg-admin-surface border border-admin-border px-2 py-0.5 text-[10px] font-bold text-admin-muted">
                  {stageQuotes.length}
                </span>
              </div>

              {/* Cards Container */}
              <div className="flex-1 p-3 space-y-3 overflow-y-auto min-h-[150px]">
                {stageQuotes.map(quote => (
                  <div
                    key={quote.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, quote.id)}
                    className="bg-admin-bg border border-admin-border p-4 shadow-sm cursor-grab active:cursor-grabbing hover:border-primary/40 transition-colors group relative"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="font-black text-admin-text uppercase tracking-tight text-sm">{quote.name}</div>
                        <div className="text-[10px] text-admin-muted font-bold tracking-widest mt-0.5 truncate max-w-[200px]">{quote.email}</div>
                      </div>
                      <button 
                        onClick={() => setSelectedQuote(quote)}
                        className="text-admin-muted hover:text-primary transition-colors"
                      >
                        <MoreVertical size={16} />
                      </button>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-admin-muted uppercase tracking-widest">
                        <Truck size={12} className="text-primary" /> 
                        <span className="truncate">{quote.projectType}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-bold text-admin-muted uppercase tracking-widest">
                        <DollarSign size={12} className="text-primary" /> 
                        <span>{quote.budget || "TBD"}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-admin-border/50">
                      <div className="text-[9px] text-admin-muted font-medium uppercase">{quote.date}</div>
                      <button 
                        onClick={() => setSelectedQuote(quote)}
                        className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Advanced Details Modal */}
      {selectedQuote && (
        <Modal 
          isOpen={!!selectedQuote} 
          onClose={() => setSelectedQuote(null)}
          title="Lead Intelligence"
        >
          <div className="space-y-10 pb-6">
            {/* Modal Header Actions */}
            <div className="flex flex-wrap items-center justify-between border-b border-admin-border pb-8 gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-admin-surface flex items-center justify-center text-primary text-2xl font-black uppercase">
                  {selectedQuote.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-2xl font-black uppercase text-admin-text tracking-tighter leading-tight">{selectedQuote.name}</h2>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-3 py-1">{selectedQuote.status}</span>
                    <span className="text-[10px] font-bold text-admin-muted uppercase tracking-widest">Received {selectedQuote.date}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 items-center">
                <select 
                  value={selectedQuote.status}
                  onChange={(e) => handleStatusUpdate(selectedQuote.id, e.target.value as Quote["status"])}
                  className="bg-admin-surface text-admin-text px-4 py-2.5 text-[10px] font-black uppercase tracking-widest border border-admin-border outline-none focus:border-primary transition-all cursor-pointer appearance-none"
                >
                  {STAGES.map(stage => (
                    <option key={stage} value={stage}>Move to {stage}</option>
                  ))}
                </select>
                <button 
                  onClick={() => handleDelete(selectedQuote.id)}
                  className="p-2.5 bg-admin-bg text-red-500 hover:bg-red-500 hover:text-admin-text transition-all border border-admin-border hover:border-red-500"
                  title="Delete Lead"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Contact Intel */}
              <div className="space-y-6">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-admin-muted flex items-center">
                  <User size={12} className="mr-2" /> Contact Intel
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-admin-bg border border-transparent hover:border-primary/20 transition-all">
                    <div className="w-10 h-10 bg-admin-surface flex items-center justify-center shadow-sm text-primary">
                      <Mail size={18} />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <div className="text-[9px] font-black uppercase text-admin-muted tracking-widest">Direct Email</div>
                      <a href={`mailto:${selectedQuote.email}`} className="text-sm font-bold text-admin-text block truncate hover:text-primary transition-colors">{selectedQuote.email}</a>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-admin-bg border border-transparent hover:border-primary/20 transition-all">
                    <div className="w-10 h-10 bg-admin-surface flex items-center justify-center shadow-sm text-primary">
                      <Phone size={18} />
                    </div>
                    <div>
                      <div className="text-[9px] font-black uppercase text-admin-muted tracking-widest">Phone Line</div>
                      <a href={`tel:${selectedQuote.phone}`} className="text-sm font-bold text-admin-text block hover:text-primary transition-colors">{selectedQuote.phone}</a>
                    </div>
                  </div>
                  {selectedQuote.company && (
                    <div className="flex items-center gap-4 p-4 bg-admin-bg border border-transparent hover:border-primary/20 transition-all">
                      <div className="w-10 h-10 bg-admin-surface flex items-center justify-center shadow-sm text-primary">
                        <Briefcase size={18} />
                      </div>
                      <div>
                        <div className="text-[9px] font-black uppercase text-admin-muted tracking-widest">Affiliation</div>
                        <span className="text-sm font-bold text-admin-text uppercase tracking-tight">{selectedQuote.company}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Build Parameters */}
              <div className="space-y-6">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-admin-muted flex items-center">
                  <Settings size={12} className="mr-2" /> Build Parameters
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-5 bg-admin-surface border border-admin-border text-admin-text">
                    <div className="text-primary mb-2"><Truck size={20} /></div>
                    <div className="text-[9px] font-black uppercase opacity-50 tracking-widest">Architecture</div>
                    <div className="text-sm font-black uppercase tracking-tight leading-tight mt-1">{selectedQuote.projectType}</div>
                  </div>
                  <div className="p-5 bg-admin-surface border border-admin-border shadow-sm">
                    <div className="text-primary mb-2"><DollarSign size={20} /></div>
                    <div className="text-[9px] font-black uppercase text-admin-muted tracking-widest">Allocation</div>
                    <div className="text-sm font-black text-admin-text leading-tight mt-1">{selectedQuote.budget || "TBD"}</div>
                  </div>
                  <div className="p-5 bg-admin-surface border border-admin-border shadow-sm">
                    <div className="text-primary mb-2"><Clock size={20} /></div>
                    <div className="text-[9px] font-black uppercase text-admin-muted tracking-widest">Deployment</div>
                    <div className="text-sm font-black text-admin-text leading-tight mt-1">{selectedQuote.timeline}</div>
                  </div>
                  <div className="p-5 bg-admin-surface border border-admin-border shadow-sm">
                    <div className="text-primary mb-2"><MapPin size={20} /></div>
                    <div className="text-[9px] font-black uppercase text-admin-muted tracking-widest">Sourcing</div>
                    <div className="text-xs font-black text-admin-text leading-tight mt-1 uppercase">{selectedQuote.sourcing}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Inbound Message */}
            <div className="space-y-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-admin-muted flex items-center">
                <FileText size={14} className="mr-2" /> Vision & Objectives
              </h3>
              <div className="bg-admin-bg p-8 border border-admin-border italic text-admin-muted leading-loose">
                "{selectedQuote.message}"
              </div>
            </div>

            {/* Technical Add-ons */}
            {(selectedQuote.dimensions || selectedQuote.equipment || selectedQuote.menuType || (selectedQuote.services && selectedQuote.services.length > 0)) && (
              <div className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-admin-border">
                {selectedQuote.menuType && (
                  <div>
                    <span className="text-[10px] font-black uppercase text-admin-muted tracking-widest block mb-2">Gastronomy Type</span>
                    <span className="px-4 py-2 bg-admin-surface border border-admin-border text-primary text-[10px] font-black uppercase tracking-widest">{selectedQuote.menuType}</span>
                  </div>
                )}
                {selectedQuote.dimensions && (
                  <div>
                    <span className="text-[10px] font-black uppercase text-admin-muted tracking-widest block mb-1">Architecture Scale</span>
                    <span className="text-sm font-bold text-admin-text uppercase tracking-tighter">{selectedQuote.dimensions}</span>
                  </div>
                )}
                {selectedQuote.services && selectedQuote.services.length > 0 && (
                  <div className="md:col-span-1">
                    <span className="text-[10px] font-black uppercase text-admin-muted tracking-widest block mb-3">Service Inclusions</span>
                    <div className="flex flex-wrap gap-2">
                      {selectedQuote.services.map(s => (
                        <span key={s} className="px-3 py-1.5 bg-primary/5 border border-primary/20 text-primary text-[9px] font-black uppercase tracking-widest">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {selectedQuote.equipment && (
                  <div className="md:col-span-3 pt-4">
                    <span className="text-[10px] font-black uppercase text-admin-muted tracking-widest block mb-3">Inventory Requirements</span>
                    <div className="p-6 bg-admin-surface border-2 border-dashed border-admin-border text-sm font-bold text-admin-muted uppercase tracking-tight leading-relaxed">
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
}
