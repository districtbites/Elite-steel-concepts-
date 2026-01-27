import React from "react";
import { getQuotes } from "@/lib/db";
import { Eye, Mail, Phone } from "lucide-react";

export default async function AdminQuotesPage() {
  const quotes = await getQuotes();

  return (
    <div className="space-y-8">
      <div>
         <h1 className="text-3xl font-black uppercase text-secondary">Quote Requests</h1>
         <p className="text-gray-500">Manage incoming project inquiries.</p>
      </div>

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
            {quotes.map((quote) => (
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
                   <button className="text-secondary hover:text-primary transition-colors flex items-center justify-end ml-auto text-xs font-bold uppercase">
                      <Eye size={16} className="mr-1" /> View
                   </button>
                </td>
              </tr>
            ))}
            {quotes.length === 0 && (
               <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                     No quote requests yet.
                  </td>
               </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
