import React from "react";
import { getNewsletters } from "@/lib/db";
import NewsletterList from "@/components/admin/NewsletterList";

export default async function AdminNewsletterPage() {
    const newsletters = await getNewsletters();

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-4xl font-black uppercase text-secondary tracking-tighter">Club Subscription Ledger</h1>
                <p className="text-gray-400 font-medium">Manage and export your newsletter subscriber database.</p>
            </div>

            <NewsletterList initialData={newsletters} />
        </div>
    );
}
