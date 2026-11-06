import React from"react";
import { getFAQs } from"@/lib/db";
import FAQManager from"@/components/admin/FAQManager";

export default async function AdminFAQsPage() {
 const faqs = await getFAQs();

 return (
 <div className="max-w-6xl">
 <FAQManager faqs={faqs} />
 </div>
 );
}
