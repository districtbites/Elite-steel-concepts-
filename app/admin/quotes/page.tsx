import React from"react";
import { getQuotes } from"@/lib/db";

import QuoteList from"@/components/admin/QuoteList";

export default async function AdminQuotesPage() {
 const quotes = await getQuotes();

 return (
 <div className="space-y-8">
 <div>
 <h1 className="text-3xl font-black uppercase text-admin-text">Quote Requests</h1>
 <p className="text-admin-muted">Manage incoming project inquiries.</p>
 </div>

 <QuoteList initialQuotes={quotes} />
 </div>
 );
}
