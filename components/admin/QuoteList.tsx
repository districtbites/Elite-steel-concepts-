"use client";

import React, { useState } from "react";
import { Eye, Mail, Phone, Calendar, Clock, DollarSign, Truck, MapPin, Briefcase, FileText } from "lucide-react";
import { Quote } from "@/lib/db";
import Modal from "@/components/ui/Modal";

interface QuoteListProps {
  initialQuotes: Quote[];
}

const QuoteList = ({ initialQuotes }: QuoteListProps) => {
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
      <table className="w-full text-left">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Client</th>
            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Project Type</th>
            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Budget & Timeline</th>
            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {initialQuotes.map((quote) => (
            <tr key={quote.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4">
                  <div className="font-bold text-secondary">{quote.name}</div>
                  <div className="text-xs text-gray-400 mt-1 flex flex-col gap-1">
                      <span className="flex items-center"><Mail size={10} className="mr-1"/> {quote.email}</span>
                      <span className="flex items-center"><Phone size={10} className="mr-1"/> {quote.phone}</span>
                  </div>
              </td>
              <td className="px-6 py-4">
                <span className="block font-bold text-gray-700">{quote.projectType}</span>
                <span className="text-xs text-gray-500">{quote.sourcing}</span>
              </td>
              <td className="px-6 py-4">
                 <div className="text-sm font-medium text-gray-700">{quote.budget || "N/A"}</div>
                 <div className="text-xs text-gray-500">{quote.timeline}</div>
              </td>
              <td className="px-6 py-4">
                 <span className="px-2 py-1 text-xs font-bold rounded-full bg-blue-100 text-blue-700">
                  {quote.status}
                 </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">{quote.date}</td>
              <td className="px-6 py-4 text-right">
                 <button 
                  onClick={() => setSelectedQuote(quote)}
                  className="text-secondary hover:text-primary transition-colors flex items-center justify-end ml-auto text-xs font-bold uppercase"
                 >
                    <Eye size={16} className="mr-1" /> View
                 </button>
              </td>
            </tr>
          ))}
          {initialQuotes.length === 0 && (
            <tr>
              <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                No quote requests yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Quote Details Modal */}
      {selectedQuote && (
        <Modal 
          isOpen={!!selectedQuote} 
          onClose={() => setSelectedQuote(null)}
          title="Project Inquiry Details"
        >
          <div className="space-y-8">
            {/* Header / Basic Info */}
            <div className="grid grid-cols-2 gap-10">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Client Name</span>
                <p className="text-xl font-bold text-secondary">{selectedQuote.name}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Request Date</span>
                <p className="text-lg text-secondary font-medium">{selectedQuote.date}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 py-6 border-y border-gray-100">
              <div className="flex items-start gap-3">
                 <Mail className="text-primary mt-1" size={18} />
                 <div>
                   <h4 className="text-xs font-black uppercase tracking-tight text-gray-400">Email Address</h4>
                   <a href={`mailto:${selectedQuote.email}`} className="text-secondary font-bold hover:text-primary transition-colors">{selectedQuote.email}</a>
                 </div>
              </div>
              <div className="flex items-start gap-3">
                 <Phone className="text-primary mt-1" size={18} />
                 <div>
                   <h4 className="text-xs font-black uppercase tracking-tight text-gray-400">Phone Number</h4>
                   <a href={`tel:${selectedQuote.phone}`} className="text-secondary font-bold hover:text-primary transition-colors">{selectedQuote.phone}</a>
                 </div>
              </div>
              {selectedQuote.company && (
                <div className="flex items-start gap-3">
                   <Briefcase className="text-primary mt-1" size={18} />
                   <div>
                     <h4 className="text-xs font-black uppercase tracking-tight text-gray-400">Company</h4>
                     <p className="text-secondary font-bold">{selectedQuote.company}</p>
                   </div>
                </div>
              )}
            </div>

            {/* Project Specs */}
            <div className="bg-gray-50 p-6 rounded-xl grid grid-cols-2 gap-6">
               <div className="space-y-1">
                  <div className="flex items-center gap-2 mb-1">
                     <Truck size={14} className="text-primary" />
                     <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Type</span>
                  </div>
                  <p className="text-sm font-bold text-secondary">{selectedQuote.projectType}</p>
               </div>
               <div className="space-y-1">
                  <div className="flex items-center gap-2 mb-1">
                     <DollarSign size={14} className="text-primary" />
                     <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Budget</span>
                  </div>
                  <p className="text-sm font-bold text-secondary">{selectedQuote.budget || "Not Specified"}</p>
               </div>
               <div className="space-y-1">
                  <div className="flex items-center gap-2 mb-1">
                     <Clock size={14} className="text-primary" />
                     <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Timeline</span>
                  </div>
                  <p className="text-sm font-bold text-secondary">{selectedQuote.timeline}</p>
               </div>
               <div className="space-y-1">
                  <div className="flex items-center gap-2 mb-1">
                     <MapPin size={14} className="text-primary" />
                     <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Vehicle Sourcing</span>
                  </div>
                  <p className="text-sm font-bold text-secondary">{selectedQuote.sourcing}</p>
               </div>
            </div>

            {/* Message / Additional Info */}
            <div className="space-y-2">
               <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center">
                  <FileText size={16} className="mr-2 text-primary" /> Message & Goals
               </h3>
               <div className="bg-white border border-gray-100 p-6 rounded-xl text-gray-600 text-sm leading-relaxed min-h-[100px] whitespace-pre-wrap">
                  {selectedQuote.message}
               </div>
            </div>

            {/* Extra Specs if available */}
            {(selectedQuote.dimensions || selectedQuote.equipment || selectedQuote.menuType) && (
              <div className="space-y-6 pt-4">
                 <h3 className="text-xs font-black uppercase tracking-widest text-secondary border-b border-gray-100 pb-2">Technical Requirements</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {selectedQuote.menuType && (
                       <div>
                          <span className="text-[10px] font-black uppercase text-gray-400">Menu Type</span>
                          <p className="text-sm font-bold text-secondary">{selectedQuote.menuType}</p>
                       </div>
                    )}
                    {selectedQuote.dimensions && (
                       <div>
                          <span className="text-[10px] font-black uppercase text-gray-400">Preferred Dimensions</span>
                          <p className="text-sm font-bold text-secondary">{selectedQuote.dimensions}</p>
                       </div>
                    )}
                 </div>
                 {selectedQuote.equipment && (
                    <div className="pt-2">
                       <span className="text-[10px] font-black uppercase text-gray-400">Requested Equipment</span>
                       <p className="text-sm text-gray-600 mt-1 leading-relaxed">{selectedQuote.equipment}</p>
                    </div>
                 )}
              </div>
            )}

            {/* Services */}
            {selectedQuote.services && selectedQuote.services.length > 0 && (
              <div className="pt-4">
                 <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Requested Services</h3>
                 <div className="flex flex-wrap gap-2">
                    {selectedQuote.services.map((service, i) => (
                       <span key={i} className="bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-primary/20">
                          {service}
                       </span>
                    ))}
                 </div>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default QuoteList;
