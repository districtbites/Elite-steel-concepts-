import React from "react";
import { getQuotes } from "@/lib/db";

import QuoteList from "@/components/admin/QuoteList";

export default async function AdminQuotesPage() {
  const quotes = await getQuotes();

  return (
    <div className="space-y-8">
      <div>
         <h1 className="text-3xl font-black uppercase text-secondary">Quote Requests</h1>
         <p className="text-gray-500">Manage incoming project inquiries.</p>
      </div>

      <QuoteList initialQuotes={quotes} />
    </div>
  );
}
