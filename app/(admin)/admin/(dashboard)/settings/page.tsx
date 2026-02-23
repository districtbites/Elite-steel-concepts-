import React from "react";
import { getSettings } from "@/lib/db";
import SettingsForm from "@/components/admin/SettingsForm";

export default async function AdminSettingsPage() {
  const settings = await getSettings();

  return (
    <div className="max-w-6xl">
        <div className="mb-10">
            <h1 className="text-4xl font-black uppercase text-secondary tracking-tighter">Global Parameters</h1>
            <p className="text-gray-400 font-medium mt-1">Configure your master company information and external integrations.</p>
        </div>

        <SettingsForm settings={settings} />
    </div>
  );
}
