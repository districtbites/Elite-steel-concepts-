import React from "react";
import Button from "@/components/ui/Button";
import { getSettings } from "@/lib/db";
import { saveSettings } from "@/app/actions/settings";
import { Save } from "lucide-react";

export default async function AdminSettingsPage() {
  const settings = await getSettings();

  return (
    <div className="max-w-4xl">
       <div className="mb-8">
           <h1 className="text-3xl font-black uppercase text-secondary">Global Settings</h1>
           <p className="text-gray-500">Manage site-wide contact info and social links.</p>
       </div>

       <form action={saveSettings} className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm space-y-8">
          
          {/* Company Info Section */}
          <div>
            <h2 className="text-xl font-bold uppercase text-secondary mb-4 border-b border-gray-100 pb-2">
                Company Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-bold uppercase tracking-wider text-gray-700">Official Email</label>
                    <input type="email" name="email" defaultValue={settings.email} className="w-full bg-gray-50 border border-gray-200 p-4 rounded-sm outline-none focus:border-primary transition-all" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold uppercase tracking-wider text-gray-700">Phone Number</label>
                    <input type="text" name="phone" defaultValue={settings.phone} className="w-full bg-gray-50 border border-gray-200 p-4 rounded-sm outline-none focus:border-primary transition-all" />
                </div>
                <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-bold uppercase tracking-wider text-gray-700">Physical Address</label>
                    <input type="text" name="address" defaultValue={settings.address} className="w-full bg-gray-50 border border-gray-200 p-4 rounded-sm outline-none focus:border-primary transition-all" />
                </div>
            </div>
          </div>

          {/* Social Media Section */}
          <div>
            <h2 className="text-xl font-bold uppercase text-secondary mb-4 border-b border-gray-100 pb-2">
                Social Media Links
            </h2>
            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-bold uppercase tracking-wider text-gray-700">Instagram URL</label>
                    <input type="text" name="instagram" defaultValue={settings.instagram} placeholder="https://instagram.com/..." className="w-full bg-gray-50 border border-gray-200 p-4 rounded-sm outline-none focus:border-primary transition-all" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold uppercase tracking-wider text-gray-700">Facebook URL</label>
                    <input type="text" name="facebook" defaultValue={settings.facebook} placeholder="https://facebook.com/..." className="w-full bg-gray-50 border border-gray-200 p-4 rounded-sm outline-none focus:border-primary transition-all" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold uppercase tracking-wider text-gray-700">Twitter / X URL</label>
                    <input type="text" name="twitter" defaultValue={settings.twitter} placeholder="https://twitter.com/..." className="w-full bg-gray-50 border border-gray-200 p-4 rounded-sm outline-none focus:border-primary transition-all" />
                </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end">
             <Button type="submit" className="bg-secondary text-white hover:bg-primary hover:text-secondary flex items-center">
                <Save size={18} className="mr-2" /> Save Settings
             </Button>
          </div>
       </form>
    </div>
  );
}
