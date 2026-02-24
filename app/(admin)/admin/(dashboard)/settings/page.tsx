import React from "react";
import { getSettings } from "@/lib/db";
import SettingsForm from "@/components/admin/SettingsForm";

export default async function AdminSettingsPage() {
  const settings = await getSettings();

  return (
    <div className="max-w-7xl">
        <SettingsForm settings={settings} />
    </div>
  );
}
