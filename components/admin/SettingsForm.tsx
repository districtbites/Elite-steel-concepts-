"use client";

import React, { useState } from "react";
import Button from "@/components/ui/Button";
import { 
  Save, 
  Building2, 
  Share2, 
  Clock, 
  Globe2, 
  Layout, 
  Map, 
  Mail, 
  Phone, 
  ShieldCheck, 
  Palette, 
  TrendingUp, 
  Settings2,
  AlertCircle
} from "lucide-react";
import { GlobalSettings } from "@/lib/db";
import { saveSettings } from "@/app/actions/settings";
import Toast from "@/components/ui/Toast";

interface SettingsFormProps {
  settings: GlobalSettings;
}

const SettingsForm = ({ settings }: SettingsFormProps) => {
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    const result = await saveSettings(formData);
    
    if (result?.success) {
      setToastMsg(result.message);
      setShowToast(true);
    }
    setLoading(false);
  };

  return (
    <>
      {showToast && (
        <Toast 
          message={toastMsg} 
          onClose={() => setShowToast(false)} 
        />
      )}

      <form action={handleSubmit} className="space-y-12 animate-fadeIn pb-32">
          {/* Top Row: System Status Alert */}
          <div className={`p-6 rounded-3xl border ${settings.maintenanceMode ? 'bg-amber-50 border-amber-100 text-amber-900' : 'bg-green-50 border-green-100 text-green-900'} flex flex-col md:flex-row md:items-center justify-between gap-6`}>
              <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-2xl ${settings.maintenanceMode ? 'bg-amber-200 text-amber-900' : 'bg-green-200 text-green-900'}`}>
                      {settings.maintenanceMode ? <AlertCircle size={20} /> : <ShieldCheck size={20} />}
                  </div>
                  <div>
                      <h3 className="text-sm font-black uppercase tracking-tighter">Site Visibility System</h3>
                      <p className="text-[10px] font-bold opacity-70 uppercase tracking-widest">{settings.maintenanceMode ? 'Currently restricted to maintenance mode' : 'All systems operational & public'}</p>
                  </div>
              </div>
              <div className="flex items-center gap-4 bg-white/50 p-2 rounded-2xl border border-black/5">
                  <label className="text-[10px] font-black uppercase tracking-widest ml-4">Maintenance Mode</label>
                  <select 
                    name="maintenanceMode" 
                    defaultValue={settings.maintenanceMode ? "true" : "false"}
                    className="bg-white border-0 rounded-xl px-4 py-2 text-xs font-bold outline-none focus:ring-2 focus:ring-primary"
                  >
                      <option value="false">PUBLIC</option>
                      <option value="true">MAINTENANCE</option>
                  </select>
              </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Left Column */}
            <div className="space-y-12">
                {/* Core & Extended Channels */}
                <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm transition-all hover:shadow-xl group">
                    <h2 className="text-xs font-black uppercase text-secondary mb-10 flex items-center tracking-[0.3em]">
                        <Building2 size={16} className="mr-4 text-primary group-hover:rotate-12 transition-transform" /> Core & Channels
                    </h2>
                    <div className="space-y-8">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-2">
                              <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4">HQ Email (Primary)</label>
                              <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={14} />
                                <input type="email" name="email" defaultValue={settings.email} className="w-full bg-gray-50 border-0 pl-12 pr-4 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-secondary text-sm" />
                              </div>
                          </div>
                          <div className="space-y-2">
                              <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4">HQ Phone (Primary)</label>
                              <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={14} />
                                <input type="text" name="phone" defaultValue={settings.phone} className="w-full bg-gray-50 border-0 pl-12 pr-4 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-secondary text-sm" />
                              </div>
                          </div>
                          <div className="space-y-2">
                              <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4">Sales Desk Email</label>
                              <input type="email" name="salesEmail" defaultValue={settings.salesEmail} placeholder="sales@esteelconcepts.com" className="w-full bg-gray-50 border-0 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-secondary text-sm" />
                          </div>
                          <div className="space-y-2">
                              <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4">Support Direct Email</label>
                              <input type="email" name="supportEmail" defaultValue={settings.supportEmail} placeholder="help@esteelconcepts.com" className="w-full bg-gray-50 border-0 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-secondary text-sm" />
                          </div>
                       </div>
                       
                       <div className="space-y-2">
                          <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4">WhatsApp Integration (Business Number)</label>
                          <input type="text" name="whatsappPhone" defaultValue={settings.whatsappPhone} placeholder="+1 (571) ..." className="w-full bg-gray-50 border-0 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-secondary text-sm" />
                       </div>

                       <div className="space-y-2">
                          <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4">Physical Headquarters</label>
                          <input type="text" name="address" defaultValue={settings.address} className="w-full bg-gray-50 border-0 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-secondary text-sm" />
                       </div>
                       
                       <div className="space-y-2">
                          <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4">Global Business Hours</label>
                          <div className="relative">
                            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={14} />
                            <input type="text" name="businessHours" defaultValue={settings.businessHours} className="w-full bg-gray-50 border-0 pl-12 pr-4 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-secondary text-sm" />
                          </div>
                       </div>
                    </div>
                </div>

                {/* Identity & Compliance */}
                <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm transition-all hover:shadow-xl group">
                    <h2 className="text-xs font-black uppercase text-secondary mb-10 flex items-center tracking-[0.3em]">
                        <ShieldCheck size={16} className="mr-4 text-primary group-hover:scale-110 transition-transform" /> Compliance & Identity
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-2">
                          <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4">Corporate Tax ID / EIN</label>
                          <input type="text" name="taxId" defaultValue={settings.taxId} placeholder="XX-XXXXXXX" className="w-full bg-gray-50 border-0 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-secondary text-sm" />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4">Industry Certifications</label>
                          <input type="text" name="certifications" defaultValue={settings.certifications} placeholder="NSF, METRO HEALTH, NFPA" className="w-full bg-gray-50 border-0 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-secondary text-sm" />
                       </div>
                    </div>
                </div>

                {/* Operational Overrides */}
                <div className="bg-gray-50 p-10 rounded-[2.5rem] border border-gray-100 shadow-inner group">
                    <h2 className="text-xs font-black uppercase text-secondary mb-10 flex items-center tracking-[0.3em]">
                        <TrendingUp size={16} className="mr-4 text-primary group-hover:-translate-y-1 transition-transform" /> Operational Metrics
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-2">
                          <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4">Custom Builds Completed</label>
                          <input type="number" name="trucksBuiltCount" defaultValue={settings.trucksBuiltCount} className="w-full bg-white border-0 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-black text-secondary text-xl" />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4">Years of Master Fabricating</label>
                          <input type="number" name="experienceYears" defaultValue={settings.experienceYears} className="w-full bg-white border-0 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-black text-secondary text-xl" />
                       </div>
                    </div>
                </div>
            </div>

            {/* Right Column */}
            <div className="space-y-12">
                {/* Visual Identity */}
                <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm transition-all hover:shadow-xl group">
                    <h2 className="text-xs font-black uppercase text-secondary mb-10 flex items-center tracking-[0.3em]">
                        <Palette size={16} className="mr-4 text-primary group-hover:rotate-45 transition-transform" /> Visual Identity Tokens
                    </h2>
                    <div className="space-y-8">
                       <div className="space-y-2">
                          <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4">Primary Brand Color</label>
                          <div className="flex items-center gap-4">
                              <input type="color" name="primaryColor" defaultValue={settings.primaryColor || "#FFC107"} className="w-16 h-16 rounded-2xl cursor-pointer border-0 p-0" />
                              <input type="text" value={settings.primaryColor || "#FFC107"} readOnly className="flex-1 bg-gray-50 border-0 p-4 rounded-2xl font-mono text-xs font-bold" />
                          </div>
                       </div>
                       <div className="grid grid-cols-2 gap-8">
                          <div className="space-y-2">
                              <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4">Secondary Brand</label>
                              <div className="flex items-center gap-3">
                                <input type="color" name="secondaryColor" defaultValue={settings.secondaryColor || "#1A1A1A"} className="w-12 h-12 rounded-xl cursor-pointer border-0" />
                                <input type="text" value={settings.secondaryColor || "#1A1A1A"} readOnly className="flex-1 bg-gray-50 border-0 p-4 rounded-xl font-mono text-[10px]" />
                              </div>
                          </div>
                          <div className="space-y-2">
                              <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4">Highlight Accent</label>
                              <div className="flex items-center gap-3">
                                <input type="color" name="accentColor" defaultValue={settings.accentColor || "#FF5722"} className="w-12 h-12 rounded-xl cursor-pointer border-0" />
                                <input type="text" value={settings.accentColor || "#FF5722"} readOnly className="flex-1 bg-gray-50 border-0 p-4 rounded-xl font-mono text-[10px]" />
                              </div>
                          </div>
                       </div>
                       <div className="space-y-2 pt-4">
                          <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4">Corporate Logo Deployment (Direct URL)</label>
                          <input type="text" name="logoUrl" defaultValue={settings.logoUrl} className="w-full bg-gray-50 border-0 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-secondary text-sm" />
                       </div>
                    </div>
                </div>

                {/* Social Networks Map */}
                <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm transition-all hover:shadow-xl group">
                    <h2 className="text-xs font-black uppercase text-secondary mb-10 flex items-center tracking-[0.3em]">
                        <Share2 size={16} className="mr-4 text-primary group-hover:scale-125 transition-transform" /> Digital Ecosystem
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {['instagram', 'facebook', 'twitter', 'linkedin'].map(net => (
                          <div key={net} className="space-y-2">
                              <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4 capitalize">{net}</label>
                              <input type="text" name={net} defaultValue={(settings as any)[net]} className="w-full bg-gray-50 border-0 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-secondary text-sm" />
                          </div>
                        ))}
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4">YouTube Broadcast Link</label>
                            <input type="text" name="youtube" defaultValue={settings.youtube} className="w-full bg-gray-50 border-0 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-secondary text-sm" />
                        </div>
                    </div>
                </div>

                {/* Marketing & Analytics Hub */}
                <div className="bg-secondary rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <h2 className="text-xs font-black uppercase text-white mb-10 flex items-center tracking-[0.3em] relative z-10">
                        <Globe2 size={16} className="mr-4 text-primary" /> Intelligence & Tracking
                    </h2>
                    <div className="space-y-6 relative z-10">
                        {['googleAnalyticsId', 'facebookPixelId', 'tiktokPixelId'].map(pixel => (
                          <div key={pixel} className="space-y-2">
                              <label className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-500 ml-4">
                                {pixel.replace(/([A-Z])/g, ' $1').replace('Id', 'Tag').trim()}
                              </label>
                              <input 
                                type="text" 
                                name={pixel} 
                                defaultValue={(settings as any)[pixel]} 
                                placeholder="Tracking Token..."
                                className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-primary transition-all text-sm font-black tracking-widest text-primary placeholder:text-gray-700" 
                              />
                          </div>
                        ))}
                    </div>
                </div>

                {/* Advanced Location Map */}
                <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm transition-all hover:shadow-xl group">
                    <h2 className="text-xs font-black uppercase text-secondary mb-10 flex items-center tracking-[0.3em]">
                        <Map size={16} className="mr-4 text-primary" /> Location Engine
                    </h2>
                    <div className="space-y-6">
                       <div className="space-y-2">
                           <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4">Google Maps Intelligence Link</label>
                           <input type="text" name="googleMapsLink" defaultValue={settings.googleMapsLink} className="w-full bg-gray-50 border-0 p-4 rounded-2xl outline-none font-bold text-xs" />
                       </div>
                       <div className="space-y-2">
                           <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4">Map Embed Protocol (Iframe Component)</label>
                           <textarea rows={3} name="mapEmbedUrl" defaultValue={settings.mapEmbedUrl} className="w-full bg-gray-50 border-0 p-4 rounded-2xl outline-none font-mono text-[10px] resize-none" />
                       </div>
                    </div>
                </div>
            </div>
          </div>

          {/* Precision Floating Controller */}
          <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 flex items-center gap-6 bg-white/80 backdrop-blur-2xl px-10 py-6 rounded-[3rem] border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
              {loading && (
                <div className="hidden md:flex items-center gap-3">
                  <div className="flex gap-1">
                    {[1,2,3].map(i => <div key={i} className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{animationDelay: `${i*0.1}s`}} />)}
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-secondary">Broadcasting Changes...</span>
                </div>
              )}
              <div className="h-6 w-[1px] bg-gray-100 hidden md:block" />
              <button 
                  type="submit" 
                  disabled={loading}
                  className="bg-secondary text-white px-12 py-4 rounded-full shadow-xl hover:bg-primary hover:text-secondary disabled:opacity-50 transition-all font-black uppercase tracking-[0.3em] text-[10px] flex items-center gap-4 group active:scale-95"
              >
                  {loading ? (
                    <Settings2 className="animate-spin" size={16} />
                  ) : (
                    <Save size={16} className="group-hover:rotate-12 transition-transform text-primary" />
                  )}
                  {loading ? "Commiting..." : "Sync Operational Settings"}
              </button>
          </div>
      </form>
        </>
    );
};

export default SettingsForm;
