import React from "react";
import { getLocations } from "@/lib/db";
import LocationManager from "@/components/admin/LocationManager";

export default async function LocationsPage() {
    const locations = await getLocations();

    return (
        <div className="space-y-8">
            <div className="border-b-2 border-admin-border pb-6">
                <h1 className="text-3xl font-black uppercase tracking-tighter text-admin-text">Service Areas & Locations</h1>
                <p className="text-admin-muted font-bold uppercase tracking-widest text-xs mt-2">Manage city-specific SEO landing pages</p>
            </div>

            <LocationManager initialLocations={locations} />
        </div>
    );
}
