import React from "react";
import { getContacts } from "@/lib/db";
import { Eye, Mail, Phone } from "lucide-react";

export default async function AdminContactsPage() {
  const contacts = await getContacts();

  return (
    <div className="space-y-8">
      <div>
         <h1 className="text-3xl font-black uppercase text-secondary">Contact Messages</h1>
         <p className="text-gray-500">Manage general inquiries.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Contact Details</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Message Preview</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {contacts.map((contact) => (
              <tr key={contact.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium text-secondary">{contact.name}</td>
                <td className="px-6 py-4">
                   <div className="text-xs text-gray-500 flex flex-col gap-1">
                        <span className="flex items-center"><Mail size={12} className="mr-2"/> {contact.email}</span>
                        {contact.phone && <span className="flex items-center"><Phone size={12} className="mr-2"/> {contact.phone}</span>}
                    </div>
                </td>
                <td className="px-6 py-4 max-w-xs truncate text-gray-600 italic">
                   "{contact.message}"
                </td>
                <td className="px-6 py-4">
                   <span className="px-2 py-1 text-xs font-bold rounded-full bg-gray-100 text-gray-600">
                    {contact.status}
                   </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{contact.date}</td>
              </tr>
            ))}
            {contacts.length === 0 && (
               <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                     No messages yet.
                  </td>
               </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
