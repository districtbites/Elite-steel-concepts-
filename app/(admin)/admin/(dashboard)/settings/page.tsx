import React from"react";
import { getSettings } from"@/lib/db";
import SettingsForm from"@/components/admin/SettingsForm";

// Force fresh read from DB on every request — prevents stale cached settings
export const dynamic ="force-dynamic";
export const revalidate = 0;

export default async function AdminSettingsPage() {
 const settings = await getSettings();

 return (
 <div className="max-w-7xl">
 <SettingsForm settings={settings} />
 </div>
 );
}
