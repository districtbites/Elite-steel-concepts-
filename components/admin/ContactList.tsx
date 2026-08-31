"use client";

import React, { useState } from"react";
import { 
 Search, 
 Filter, 
 Mail, 
 Phone, 
 User, 
 Calendar, 
 Eye, 
 Trash2, 
 MessageSquare, 
 CheckCircle2, 
 Inbox 
} from"lucide-react";
import { Contact } from"@/lib/db";
import Modal from"@/components/ui/Modal";
import { updateContactStatus, removeContact } from"@/app/actions/contact";

interface ContactListProps {
 initialContacts: Contact[];
}

const ContactList = ({ initialContacts }: ContactListProps) => {
 const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
 const [searchTerm, setSearchTerm] = useState("");
 const [filterStatus, setFilterStatus] = useState<string>("All");

 const filteredContacts = initialContacts.filter(contact => {
 const matchesSearch = 
 contact.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
 contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
 (contact.phone && contact.phone.includes(searchTerm));
 
 const matchesStatus = filterStatus ==="All" || contact.status === filterStatus;

 return matchesSearch && matchesStatus;
 });

 const handleStatusUpdate = async (id: string, newStatus:"New" |"Read") => {
 await updateContactStatus(id, newStatus);
 if (selectedContact && selectedContact.id === id) {
 setSelectedContact({ ...selectedContact, status: newStatus });
 }
 };

 const handleDelete = async (id: string) => {
 if (window.confirm("Are you sure you want to remove this message?")) {
 await removeContact(id);
 setSelectedContact(null);
 }
 };

 return (
 <div className="space-y-6">
 {/* Search & Filter Bar */}
 <div className="bg-admin-surface p-6 -[2rem] border border-admin-border shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
 <div className="relative w-full md:w-96">
 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-admin-muted" size={18} />
 <input 
 type="text" 
 placeholder="Search by name, email, or phone..."
 value={searchTerm}
 onChange={(e) => setSearchTerm(e.target.value)}
 className="w-full bg-admin-bg border-0 pl-12 pr-4 py-3.5 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-sm"
 />
 </div>
 <div className="flex gap-4 w-full md:w-auto">
 <div className="flex items-center gap-2 bg-admin-bg px-4 border border-transparent focus-within:border-primary/20">
 <Filter size={14} className="text-admin-muted" />
 <select 
 value={filterStatus}
 onChange={(e) => setFilterStatus(e.target.value)}
 className="bg-transparent border-0 py-3 text-xs font-black uppercase tracking-widest outline-none text-admin-text"
 >
 <option value="All">All Messages</option>
 <option value="New">Unread</option>
 <option value="Read">Read</option>
 </select>
 </div>
 </div>
 </div>

 {/* Messages Grid/Table */}
 <div className="bg-admin-surface -[2.5rem] border border-admin-border shadow-sm overflow-hidden min-h-[400px]">
 <div className="overflow-x-auto">
 <table className="w-full text-left">
 <thead className="bg-admin-bg/50 border-b border-admin-border">
 <tr>
 <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-admin-muted">Sender Profile</th>
 <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-admin-muted">Message Preview</th>
 <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-admin-muted">Lifecycle</th>
 <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-admin-muted text-right">Actions</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-gray-50">
 {filteredContacts.map((contact) => (
 <tr key={contact.id} className="group hover:bg-admin-bg/30 transition-all">
 <td className="px-8 py-6">
 <div className="flex items-center gap-4">
 <div className="w-10 h-10 bg-admin-surface flex items-center justify-center text-primary font-black uppercase">
 {contact.name.charAt(0)}
 </div>
 <div>
 <div className="font-black text-admin-text uppercase tracking-tight">{contact.name}</div>
 <div className="text-[10px] text-admin-muted font-bold uppercase tracking-widest mt-0.5">{contact.email}</div>
 </div>
 </div>
 </td>
 <td className="px-8 py-6 max-w-md">
 <p className="text-sm text-admin-muted line-clamp-2 italic leading-relaxed">
"{contact.message}"
 </p>
 </td>
 <td className="px-8 py-6">
 <div className={`inline-flex items-center gap-2 px-3 py-1 -full text-[9px] font-black uppercase tracking-widest ${
 contact.status ==="New" ?"bg-primary/10 text-primary" :"bg-gray-100 text-admin-muted"
 }`}>
 <div className={`w-1.5 h-1.5 -full ${
 contact.status ==="New" ?"bg-primary" :"bg-gray-400"
 }`} />
 {contact.status ==="New" ?"Unread" :"Read"}
 </div>
 <div className="text-[10px] text-admin-muted font-medium mt-1 uppercase">{contact.date}</div>
 </td>
 <td className="px-8 py-6 text-right">
 <div className="flex items-center justify-end gap-2 text-primary">
 <button 
 onClick={() => setSelectedContact(contact)}
 className="p-2.5 bg-admin-bg text-admin-text hover:bg-admin-surface hover:text-admin-text transition-all shadow-sm group-hover:shadow-md"
 >
 <Eye size={16} />
 </button>
 <button 
 onClick={() => handleDelete(contact.id)}
 className="p-2.5 bg-admin-bg text-red-500 hover:bg-red-500 hover:text-admin-text transition-all shadow-sm group-hover:shadow-md"
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
 {filteredContacts.length === 0 && (
 <div className="p-20 text-center space-y-4">
 <div className="w-16 h-16 bg-admin-bg -full flex items-center justify-center mx-auto text-gray-300">
 <Inbox size={32} />
 </div>
 <p className="text-admin-muted font-black uppercase tracking-widest text-xs">No contact messages found.</p>
 </div>
 )}
 </div>

 {/* Message Details Modal */}
 {selectedContact && (
 <Modal 
 isOpen={!!selectedContact} 
 onClose={() => setSelectedContact(null)}
 title="Message Intelligence"
 >
 <div className="space-y-10 pb-6">
 {/* Modal Header Actions */}
 <div className="flex flex-wrap items-center justify-between border-b border-admin-border pb-8 gap-6">
 <div className="flex items-center gap-4">
 <div className="w-16 h-16 bg-admin-surface flex items-center justify-center text-primary text-2xl font-black uppercase">
 {selectedContact.name.charAt(0)}
 </div>
 <div>
 <h2 className="text-2xl font-black uppercase text-admin-text tracking-tighter leading-tight">{selectedContact.name}</h2>
 <div className="flex items-center gap-3 mt-1 text-primary">
 <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 -full ${
 selectedContact.status === 'New' ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-admin-muted'
 }`}>
 {selectedContact.status === 'New' ? 'Unread' : 'Read'}
 </span>
 <span className="text-[10px] font-bold text-admin-muted uppercase tracking-widest">Inquiry Received {selectedContact.date}</span>
 </div>
 </div>
 </div>
 <div className="flex gap-2">
 <select 
 value={selectedContact.status}
 onChange={(e) => handleStatusUpdate(selectedContact.id, e.target.value as"New" |"Read")}
 className="bg-admin-surface text-admin-text px-4 py-2.5 text-[10px] font-black uppercase tracking-widest border-0 outline-none hover:bg-primary hover:text-admin-text transition-all cursor-pointer appearance-none"
 >
 <option value="New">Mark as Unread</option>
 <option value="Read">Mark as Read</option>
 </select>
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
 {/* Personal Intel */}
 <div className="space-y-6">
 <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-admin-muted flex items-center">
 <User size={12} className="mr-2" /> Personal Intel
 </h3>
 <div className="space-y-4">
 <div className="flex items-center gap-4 p-4 bg-admin-bg border border-transparent hover:border-primary/20 transition-all text-primary">
 <div className="w-10 h-10 bg-admin-surface flex items-center justify-center shadow-sm">
 <Mail size={18} />
 </div>
 <div className="flex-1 overflow-hidden">
 <div className="text-[9px] font-black uppercase text-admin-muted tracking-widest">Electronic Mail</div>
 <a href={`mailto:${selectedContact.email}`} className="text-sm font-bold text-admin-text block truncate hover:text-primary transition-colors">{selectedContact.email}</a>
 </div>
 </div>
 <div className="flex items-center gap-4 p-4 bg-admin-bg border border-transparent hover:border-primary/20 transition-all text-primary">
 <div className="w-10 h-10 bg-admin-surface flex items-center justify-center shadow-sm text-primary">
 <Phone size={18} />
 </div>
 <div>
 <div className="text-[9px] font-black uppercase text-admin-muted tracking-widest">Mobile Line</div>
 <a href={`tel:${selectedContact.phone}`} className="text-sm font-bold text-admin-text block hover:text-primary transition-colors">{selectedContact.phone ||"Not Provided"}</a>
 </div>
 </div>
 </div>
 </div>

 {/* Meta Data */}
 <div className="space-y-6">
 <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-admin-muted flex items-center">
 <Calendar size={12} className="mr-2" /> Submission Meta
 </h3>
 <div className="p-6 bg-admin-surface -[2.5rem] text-admin-text">
 <div className="text-primary mb-2"><MessageSquare size={20} /></div>
 <div className="text-[9px] font-black uppercase opacity-50 tracking-widest">Origin</div>
 <div className="text-sm font-black uppercase tracking-tight leading-tight mt-1">General Contact Inquiry Form</div>
 <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center text-primary">
 <span className="text-[9px] font-black uppercase tracking-widest opacity-60">Status Code</span>
 <span className="text-[9px] font-black uppercase tracking-widest">{selectedContact.status} 200 OK</span>
 </div>
 </div>
 </div>
 </div>

 {/* Message Content */}
 <div className="space-y-6">
 <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-admin-muted flex items-center text-primary">
 <MessageSquare size={14} className="mr-2" /> Message Content
 </h3>
 <div className="bg-admin-bg p-10 -[3rem] border border-admin-border italic text-gray-700 leading-loose text-lg">
"{selectedContact.message}"
 </div>
 </div>

 {/* Quick Response Callout */}
 <div className="mt-6 p-8 bg-primary -[2.5rem] flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl text-admin-text">
 <div>
 <h4 className="text-lg font-black uppercase tracking-tight mb-1">Engage with Client</h4>
 <p className="text-xs font-medium opacity-70">Ready to respond to this message? Choose an action.</p>
 </div>
 <div className="flex gap-3">
 <a href={`mailto:${selectedContact.email}`} className="px-6 py-3 bg-admin-surface text-admin-text font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-all">
 Send Reply
 </a>
 <button 
 onClick={() => handleStatusUpdate(selectedContact.id,"Read")}
 className="px-6 py-3 bg-admin-surface text-admin-text font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-all border border-admin-border"
 >
 Archive Result
 </button>
 </div>
 </div>
 </div>
 </Modal>
 )}
 </div>
 );
};

export default ContactList;
