import React from "react";
import { getSEO } from "@/lib/db";
import { Monitor } from "lucide-react";
import SEOManagerForm from "@/components/admin/SEOManagerForm";

export default async function AdminSEOPage() {
  const seo = await getSEO();

  const pages = [
    { id: "home", name: "Home Page" },
    { id: "about", name: "About Us" },
    { id: "services", name: "Services" },
    { id: "portfolio", name: "Portfolio" },
    { id: "process", name: "Build Process" },
    { id: "blog", name: "Blog List" },
    { id: "contact", name: "Contact Us" },
    { id: "quote", name: "Quote Request" },
  ];

  return (
    <div className="max-w-6xl pb-20">
       <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
           <div>
                <h1 className="text-3xl font-black uppercase text-secondary">Advanced SEO Manager</h1>
                <p className="text-gray-500">Master your website&apos;s visibility and search engine optimization.</p>
           </div>
           <div className="flex gap-2">
              <div className="bg-green-50 text-green-700 px-4 py-2 rounded-lg border border-green-100 flex items-center text-xs font-bold uppercase tracking-wider">
                <Monitor size={14} className="mr-2" /> Live Connection
              </div>
           </div>
       </div>

       {/* Render the Client-side Form */}
       <SEOManagerForm seo={seo} pages={pages} />
    </div>
  );
}
