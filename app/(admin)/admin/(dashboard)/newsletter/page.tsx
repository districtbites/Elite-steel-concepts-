import React from"react";
import { getNewsletters } from"@/lib/db";
import NewsletterList from"@/components/admin/NewsletterList";
import NewsletterCampaignManager from"@/components/admin/NewsletterCampaignManager";

export default async function AdminNewsletterPage() {
 const newsletters = await getNewsletters();

 return (
 <div className="space-y-8">
 <div>
 <h1 className="text-4xl font-black uppercase text-admin-text tracking-tighter">Club Subscription Ledger</h1>
 <p className="text-admin-muted font-medium">Manage your subscribers and dispatch email campaigns.</p>
 </div>

 <NewsletterCampaignManager subscriberCount={newsletters.length} />

 <NewsletterList initialData={newsletters} />
 </div>
 );
}
