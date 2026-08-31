"use client";

import React, { useState } from"react";
import { Send, AlertCircle, CheckCircle2 } from"lucide-react";
import { sendNewsletterCampaign } from"@/app/actions/newsletter";

export default function NewsletterCampaignManager({ subscriberCount }: { subscriberCount: number }) {
 const [loading, setLoading] = useState(false);
 const [status, setStatus] = useState<{ type:"success" |"error" | null, msg: string }>({ type: null, msg:"" });

 const handleSend = async (formData: FormData) => {
 if (!confirm(`Are you sure you want to blast this email to all ${subscriberCount} subscribers?`)) return;
 
 setLoading(true);
 setStatus({ type: null, msg:"" });
 
 const result = await sendNewsletterCampaign(formData);
 
 if (result.error) {
 setStatus({ type:"error", msg: result.error });
 } else if (result.success) {
 setStatus({ type:"success", msg: result.message ||"Campaign sent successfully!" });
 (document.getElementById("campaign-form") as HTMLFormElement)?.reset();
 }
 
 setLoading(false);
 };

 return (
 <div className="bg-admin-surface -[2.5rem] border border-admin-border shadow-sm p-8 md:p-12 mb-8">
 <div className="mb-8">
 <h2 className="text-2xl font-black uppercase text-admin-text tracking-tight">Campaign Dispatcher</h2>
 <p className="text-admin-muted font-medium">Broadcast updates to your subscriber list via SMTP.</p>
 </div>

 {status.type ==="success" && (
 <div className="mb-8 p-6 bg-green-50 border border-green-100 flex items-center gap-4 text-green-700">
 <CheckCircle2 size={24} className="shrink-0" />
 <div>
 <div className="font-bold uppercase tracking-widest text-xs mb-1">Dispatch Successful</div>
 <div className="text-sm">{status.msg}</div>
 </div>
 </div>
 )}

 {status.type ==="error" && (
 <div className="mb-8 p-6 bg-red-50 border border-red-100 flex items-center gap-4 text-red-700">
 <AlertCircle size={24} className="shrink-0" />
 <div>
 <div className="font-bold uppercase tracking-widest text-xs mb-1">Dispatch Failed</div>
 <div className="text-sm">{status.msg}</div>
 </div>
 </div>
 )}

 <form id="campaign-form" action={handleSend} className="space-y-6">
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 <div className="space-y-3">
 <label htmlFor="subject" className="text-[10px] font-black uppercase tracking-widest text-admin-muted">
 Email Subject <span className="text-primary">*</span>
 </label>
 <input 
 type="text" 
 id="subject" 
 name="subject" 
 required
 placeholder="e.g. New BBQ Trailer Just Dropped!"
 className="w-full bg-admin-bg border border-admin-border p-4 outline-none focus:border-primary transition-all text-admin-text"
 />
 </div>
 <div className="space-y-3">
 <label htmlFor="headerOverride" className="text-[10px] font-black uppercase tracking-widest text-admin-muted">
 Internal Headline (Optional)
 </label>
 <input 
 type="text" 
 id="headerOverride" 
 name="headerOverride" 
 placeholder="e.g. Exclusive Look: The Pitmaster 5000"
 className="w-full bg-admin-bg border border-admin-border p-4 outline-none focus:border-primary transition-all text-admin-text"
 />
 </div>
 </div>

 <div className="space-y-3">
 <label htmlFor="message" className="text-[10px] font-black uppercase tracking-widest text-admin-muted">
 Campaign Body <span className="text-primary">*</span>
 </label>
 <textarea 
 id="message" 
 name="message" 
 required
 rows={6}
 placeholder="Write your newsletter content here... (HTML tags not supported, plain text will be formatted beautifully)"
 className="w-full bg-admin-bg border border-admin-border p-4 outline-none focus:border-primary transition-all resize-none text-admin-text"
 />
 </div>

 <div className="pt-4 flex items-center justify-between border-t border-admin-border">
 <div className="text-[10px] font-black uppercase tracking-widest text-admin-muted">
 Audience Size: <span className="text-primary">{subscriberCount} Subscribers</span>
 </div>
 <button 
 type="submit" 
 disabled={loading || subscriberCount === 0}
 className="flex items-center gap-3 bg-admin-surface text-admin-text px-8 py-4 font-black uppercase text-xs tracking-widest hover:bg-primary hover:text-admin-text transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
 >
 {loading ? (
 <>
 <div className="w-4 h-4 border-2 border-white/20 border-t-white -full animate-spin"></div>
 Sending...
 </>
 ) : (
 <>
 <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
 Blast Campaign
 </>
 )}
 </button>
 </div>
 </form>
 </div>
 );
}
