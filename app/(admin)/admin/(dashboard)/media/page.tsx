import React from "react";
import MediaManager from "@/components/admin/MediaManager";
import { getAssets } from "@/lib/db";

export default async function AdminMediaPage() {
  const assets = await getAssets();

  return (
    <div className="max-w-7xl">
      <MediaManager initialAssets={assets} />
    </div>
  );
}
