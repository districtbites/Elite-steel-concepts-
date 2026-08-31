import React from"react";
export const dynamic = 'force-dynamic';
import { getSEO, getLocations } from "@/lib/db";
import SEOManagerForm from "@/components/admin/SEOManagerForm";

export default async function AdminSEOPage() {
 const seo = await getSEO();
 const { getPageSEO } = await import("@/lib/db");

 const basePagesList = [
 { id:"home", name:"Home Page" },
 { id:"about", name:"About Us" },
 { id:"services", name:"Services" },
 { id:"portfolio", name:"Portfolio" },
 { id:"process", name:"Build Process" },
 { id:"blog", name:"Blog List" },
 { id:"contact", name:"Contact Us" },
 { id:"quote", name:"Quote Request" },
 { id:"testimonials", name:"Testimonials" },
 { id:"locations", name:"Locations Directory" },
 { id:"privacy", name:"Privacy Policy" },
 { id:"terms", name:"Terms of Service" },
 ];

 const locations = await getLocations();
 const locationPages = locations.map(loc => ({
 id: `location-${loc.slug}`,
 name: `Location: ${loc.city}, ${loc.state}`
 }));

 const pagesList = [...basePagesList, ...locationPages];

 // Pre-populate with effective data (DB + Defaults)
 const populatedPages: { [key: string]: any } = {};
 for (const page of pagesList) {
 populatedPages[page.id] = await getPageSEO(page.id);
 }

 const enrichedSeo = {
 ...seo,
 pages: populatedPages
 };

 return (
 <div className="max-w-[1600px] pb-20">
 {/* Render the Client-side Form */}
 <SEOManagerForm seo={enrichedSeo} pages={pagesList} />
 </div>
 );
}
