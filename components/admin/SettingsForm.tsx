"use client";

import React, { useState, useMemo } from"react";
import { useRouter } from"next/navigation";
import {
 Save,
 Building2,
 Share2,
 Clock,
 Globe2,
 Map,
 Mail,
 Phone,
 ShieldCheck,
 Palette,
 TrendingUp,
 Settings2,
 AlertCircle,
 CheckCircle2,
 Zap,
 Eye,
 EyeOff,
 ExternalLink,
 Smartphone,
 MapPin,
 BarChart3,
 Link2,
 Hash,
 Award,
 PanelLeftClose,
 PanelLeftOpen,
 Layers,
 ChevronRight,
 Sparkles,
 Server,
 AtSign,
 Bell,
 Lock,
 Database,
} from"lucide-react";
import { GlobalSettings } from"@/lib/db";
import { saveSettings, testSmtpConnection } from"@/app/actions/settings";
import Toast from"@/components/ui/Toast";
import TursoSyncManager from "@/components/admin/TursoSyncManager";

interface SettingsFormProps {
 settings: GlobalSettings;
}

// ─── Section definitions ───
const SECTIONS = [
 { id:"core", name:"Core & Channels", icon: Building2 },
 { id:"brand", name:"Visual Identity", icon: Palette },
 { id:"social", name:"Digital Ecosystem", icon: Share2 },
 { id:"compliance", name:"Compliance", icon: ShieldCheck },
 { id:"operations", name:"Operations", icon: TrendingUp },
 { id:"analytics", name:"Intelligence", icon: BarChart3 },
 { id:"location", name:"Location Engine", icon: Map },
 { id:"smtp", name:"Email & SMTP", icon: Server },
 { id: "database", name: "Turso & Cloud Sync", icon: Database },
];

// ─── Field Label ───
const FieldLabel = ({
 label,
 hint,
 required,
}: {
 label: string;
 hint?: string;
 required?: boolean;
}) => (
 <div className="flex items-center justify-between mb-2">
 <label className="text-[9px] font-black uppercase tracking-[0.2em] text-admin-muted ml-1 flex items-center gap-1.5">
 {label}
 {required && <span className="text-red-400 text-[8px]">●</span>}
 </label>
 {hint && (
 <span className="text-[8px] font-bold text-gray-300 uppercase tracking-wider">
 {hint}
 </span>
 )}
 </div>
);

// ─── Input with Icon ───
const InputField = ({
 icon: Icon,
 ...props
}: {
 icon?: React.ElementType;
} & React.InputHTMLAttributes<HTMLInputElement>) => (
 <div className="relative group">
 {Icon && (
 <Icon
 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary transition-colors"
 size={14}
 />
 )}
 <input
 {...props}
 className={`w-full bg-admin-bg border border-admin-border ${Icon ?"pl-12" :"pl-4"} pr-4 py-3.5 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all font-bold text-admin-text text-sm placeholder:text-gray-300 placeholder:font-medium ${props.className ||""}`}
 />
 </div>
);

// ─── Color Picker ───
const ColorPicker = ({
 name,
 defaultValue,
 label,
}: {
 name: string;
 defaultValue: string;
 label: string;
}) => {
 const [color, setColor] = useState(defaultValue);
 return (
 <div className="space-y-2">
 <FieldLabel label={label} />
 <div className="flex items-center gap-3 bg-admin-bg border border-admin-border p-3 hover:border-primary/30 transition-all">
 <div className="relative shrink-0">
 <input
 type="color"
 name={name}
 value={color}
 onChange={(e) => setColor(e.target.value)}
 className="w-12 h-12 cursor-pointer border-0 p-0 opacity-0 absolute inset-0 z-10"
 />
 <div
 className="w-12 h-12 ring-2 ring-white shadow-md"
 style={{ backgroundColor: color }}
 />
 </div>
 <div className="flex-1 min-w-0">
 <input
 type="text"
 value={color}
 onChange={(e) => setColor(e.target.value)}
 className="w-full bg-transparent font-mono text-sm font-black text-admin-text uppercase outline-none"
 />
 <div className="text-[8px] text-gray-300 font-bold uppercase tracking-wider mt-0.5">
 Click swatch to change
 </div>
 </div>
 </div>
 </div>
 );
};

// ═══════════════════════════════════════════
// MAIN SETTINGS FORM
// ═══════════════════════════════════════════
const SettingsForm = ({ settings }: SettingsFormProps) => {
 const router = useRouter();
 const [loading, setLoading] = useState(false);
 const [testingSmtp, setTestingSmtp] = useState(false);
 const [showToast, setShowToast] = useState(false);
 const [toastMsg, setToastMsg] = useState("");
 const [toastType, setToastType] = useState<"success" |"error">("success");
 const [showApiKeys, setShowApiKeys] = useState(false);
 const [activeSection, setActiveSection] = useState("core");
 const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
 const [maintenanceLocal, setMaintenanceLocal] = useState(settings.maintenanceMode ?? false);

 React.useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get("tab");
      if (tab && SECTIONS.some((s) => s.id === tab)) {
        setActiveSection(tab);
      }
    }
  }, []);

 // Completion score
 const completionScore = useMemo(() => {
 let filled = 0;
 let total = 0;
 const check = (val: unknown) => {
 total++;
 if (val && val !=="" && val !== 0) filled++;
 };
 check(settings.email);
 check(settings.phone);
 check(settings.address);
 check(settings.businessHours);
 check(settings.logoUrl);
 check(settings.salesEmail);
 check(settings.supportEmail);
 check(settings.whatsappPhone);
 check(settings.instagram);
 check(settings.facebook);
 check(settings.twitter);
 check(settings.linkedin);
 check(settings.youtube);
 check(settings.googleAnalyticsId);
 check(settings.googleMapsLink);
 check(settings.primaryColor);
 check(settings.trucksBuiltCount);
 check(settings.experienceYears);
 check(settings.taxId);
 check(settings.certifications);
 return total > 0 ? Math.round((filled / total) * 100) : 0;
 }, [settings]);

 const handleSubmit = async (formData: FormData) => {
 setLoading(true);
 try {
 const result = await saveSettings(formData);
 if (result?.success) {
 setToastMsg(result.message);
 setToastType("success");
 setShowToast(true);
 // Refresh server components so form re-renders with fresh DB data
 router.refresh();
 }
 } catch {
 setToastMsg("Failed to save settings. Please try again.");
 setToastType("error");
 setShowToast(true);
 }
 setLoading(false);
 };

 const handleTestSmtp = async () => {
 setTestingSmtp(true);
 try {
 const result = await testSmtpConnection();
 setToastMsg(result.message);
 setToastType(result.success ?"success" :"error");
 setShowToast(true);
 } catch {
 setToastMsg("SMTP test failed. Check your configuration.");
 setToastType("error");
 setShowToast(true);
 }
 setTestingSmtp(false);
 };

 const getSectionStatus = (id: string):"complete" |"partial" |"empty" => {
 switch (id) {
 case"core":
 if (settings.email && settings.phone && settings.address && settings.businessHours && settings.salesEmail && settings.supportEmail)
 return"complete";
 if (settings.email || settings.phone) return"partial";
 return"empty";
 case"brand":
 if (settings.primaryColor && settings.logoUrl) return"complete";
 if (settings.primaryColor || settings.logoUrl) return"partial";
 return"empty";
 case"social":
 if (settings.instagram && settings.facebook && settings.twitter)
 return"complete";
 if (settings.instagram || settings.facebook || settings.twitter)
 return"partial";
 return"empty";
 case"compliance":
 if (settings.taxId && settings.certifications) return"complete";
 if (settings.taxId || settings.certifications) return"partial";
 return"empty";
 case"operations":
 if (settings.trucksBuiltCount && settings.experienceYears)
 return"complete";
 if (settings.trucksBuiltCount || settings.experienceYears)
 return"partial";
 return"empty";
 case"analytics":
 if (settings.googleAnalyticsId) return"complete";
 return"empty";
 case"location":
 if (settings.googleMapsLink && settings.mapEmbedUrl) return"complete";
 if (settings.googleMapsLink || settings.mapEmbedUrl) return"partial";
 return"empty";
 case"smtp":
 if (settings.smtpUser && settings.smtpPassword && settings.notificationEmail) return"complete";
 if (settings.smtpUser || settings.smtpPassword) return"partial";
 return"empty";
 case"database":
 return"complete";
 default:
 return"empty";
 }
 };

 return (
 <>
 {showToast && (
 <Toast
 message={toastMsg}
 type={toastType}
 onClose={() => setShowToast(false)}
 />
 )}

 <div className="space-y-8 pb-24">
 {/* ═══════ TOP DASHBOARD BAR ═══════ */}
 <div className="bg-admin-surface p-8 md:p-10 text-admin-text shadow-2xl relative overflow-hidden">
 <div className="absolute top-0 right-0 w-80 h-80 bg-primary/20 blur-[100px] -mr-40 -mt-40 -full" />
 <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
 <div className="space-y-3">
 <div className="flex items-center gap-3 bg-admin-surface/5 w-fit px-4 py-1.5 -full border border-white/10">
 <Zap size={12} className="text-primary" />
 <span className="text-[10px] font-black uppercase tracking-widest text-primary">
 Settings Console v2.0
 </span>
 </div>
 <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter flex items-center gap-4">
 <Settings2 className="text-primary" size={36} />
 Global Parameters
 </h1>
 <p className="text-admin-muted max-w-lg text-sm font-light leading-relaxed">
 Configure company information, branding, social networks,
 analytics, and operational metrics from one console.
 </p>
 </div>

 <div className="flex gap-6 items-center bg-admin-surface/5 p-6 border border-white/10 backdrop-blur-md">
 <div className="text-center">
 <div className="text-[10px] font-black uppercase text-admin-muted mb-1 tracking-widest">
 Setup
 </div>
 <div
 className={`text-4xl font-black ${completionScore > 80 ?"text-green-400" : completionScore > 50 ?"text-primary" :"text-amber-400"}`}
 >
 {completionScore}%
 </div>
 </div>
 <div className="h-12 w-px bg-admin-surface/10" />
 <div className="space-y-2">
 <div className="flex items-center gap-2">
 <div
 className={`w-1.5 h-1.5 -full ${maintenanceLocal ?"bg-amber-400" :"bg-green-500"} animate-pulse`}
 />
 <span className="text-[10px] font-bold uppercase tracking-widest text-gray-300">
 {SECTIONS.filter((s) => getSectionStatus(s.id) ==="complete").length}/{SECTIONS.length} Sections Complete
 </span>
 </div>
 <div className="flex items-center gap-2">
 <div className="w-1.5 h-1.5 -full bg-primary" />
 <span className="text-[10px] font-bold uppercase tracking-widest text-gray-300">
 {maintenanceLocal ?"Maintenance Mode" :"Live & Public"}
 </span>
 </div>
 </div>
 </div>
 </div>
 </div>

 {/* ═══════ MAIN PANEL LAYOUT (like SEO Manager) ═══════ */}
 <form action={handleSubmit}>
 <div className="flex gap-6 min-h-[900px]">
 {/* ────── LEFT SIDEBAR ────── */}
 <div
 className={`transition-all duration-300 shrink-0 ${sidebarCollapsed ?"w-16" :"w-72"}`}
 >
 <div className="sticky top-4 space-y-6">
 {/* Collapse Toggle */}
 <button
 type="button"
 onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
 className="w-full flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest text-admin-muted hover:text-admin-text transition-colors py-2"
 >
 {sidebarCollapsed ? (
 <PanelLeftOpen size={16} />
 ) : (
 <>
 <PanelLeftClose size={16} /> Collapse
 </>
 )}
 </button>

 {/* Section Navigator */}
 <div className="bg-admin-surface border border-admin-border shadow-sm overflow-hidden">
 {!sidebarCollapsed && (
 <div className="p-4 border-b border-admin-border-hover">
 <h3 className="text-[10px] font-black uppercase tracking-widest text-admin-muted flex items-center gap-2">
 <Layers size={12} className="text-primary" />
 Configuration
 </h3>
 </div>
 )}
 <div className="p-2 space-y-1">
 {SECTIONS.map((section) => {
 const status = getSectionStatus(section.id);
 const isActive = activeSection === section.id;
 const SIcon = section.icon;
 return (
 <button
 key={section.id}
 type="button"
 onClick={() => setActiveSection(section.id)}
 className={`w-full flex items-center gap-3 transition-all text-left ${
 isActive
 ?"bg-admin-surface text-admin-text shadow-lg"
 :"hover:bg-admin-bg text-admin-muted"
 } ${sidebarCollapsed ?"p-3 justify-center" :"px-4 py-3"}`}
 title={section.name}
 >
 <div
 className={`w-2 h-2 -full shrink-0 ${
 status ==="complete"
 ?"bg-green-500"
 : status ==="partial"
 ?"bg-amber-400"
 : isActive
 ?"bg-admin-surface/30"
 :"bg-gray-200"
 }`}
 />
 {sidebarCollapsed ? (
 <SIcon size={16} className={isActive ?"text-primary" :"text-admin-muted"} />
 ) : (
 <>
 <SIcon size={14} className={isActive ?"text-primary" :"text-admin-muted"} />
 <span className="text-xs font-bold truncate flex-1">
 {section.name}
 </span>
 <ChevronRight
 size={12}
 className={`${isActive ?"text-primary" :"text-gray-300"}`}
 />
 </>
 )}
 </button>
 );
 })}
 </div>
 </div>

 {/* Maintenance Mode Card (sidebar) */}
 {!sidebarCollapsed && (
 <div className="bg-admin-surface border border-admin-border shadow-sm overflow-hidden">
 <div className="p-4 border-b border-admin-border-hover">
 <h3 className="text-[10px] font-black uppercase tracking-widest text-admin-muted flex items-center gap-2">
 <ShieldCheck size={12} className="text-primary" />
 System Status
 </h3>
 </div>
 <div className="p-4 space-y-4">
 <div
 className={`p-3 text-center ${maintenanceLocal ?"bg-amber-50 text-amber-800" :"bg-green-50 text-green-800"}`}
 >
 <div className="text-[9px] font-black uppercase tracking-widest mb-1">
 {maintenanceLocal ?"⚠️ Maintenance" :"✅ All Systems Go"}
 </div>
 </div>
 <div>
 <FieldLabel label="Visibility" />
 <select
 name="maintenanceMode"
 value={maintenanceLocal ?"true" :"false"}
 onChange={(e) => setMaintenanceLocal(e.target.value ==="true")}
 className="w-full bg-admin-bg border border-admin-border p-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all text-xs font-bold text-admin-text"
 >
 <option value="false">🟢 PUBLIC</option>
 <option value="true">🟡 MAINTENANCE</option>
 </select>
 </div>
 </div>
 </div>
 )}
 </div>
 </div>

 {/* ────── CENTER PANEL ────── */}
 <div className="flex-1 min-w-0 space-y-6">
 {/* Section Header */}
 {SECTIONS.filter((s) => s.id === activeSection).map((section) => {
 const SIcon = section.icon;
 return (
 <div
 key={section.id}
 className="bg-admin-surface border border-admin-border shadow-sm p-6"
 >
 <div className="flex items-center gap-4">
 <div className="w-12 h-12 bg-admin-surface text-primary flex items-center justify-center font-black text-lg">
 <SIcon size={22} />
 </div>
 <div>
 <h2 className="text-2xl font-black uppercase text-admin-text tracking-tight">
 {section.name}
 </h2>
 <div className="flex items-center gap-3 mt-1">
 {getSectionStatus(section.id) ==="complete" ? (
 <span className="flex items-center gap-1 text-[10px] font-bold text-green-600">
 <CheckCircle2 size={10} /> Complete
 </span>
 ) : getSectionStatus(section.id) ==="partial" ? (
 <span className="flex items-center gap-1 text-[10px] font-bold text-amber-500">
 <AlertCircle size={10} /> Partial
 </span>
 ) : (
 <span className="flex items-center gap-1 text-[10px] font-bold text-admin-muted">
 <AlertCircle size={10} /> Needs Setup
 </span>
 )}
 </div>
 </div>
 </div>
 </div>
 );
 })}

 {/* ═══ CORE & CHANNELS ═══ */}
 {activeSection ==="core" && (
 <div className="space-y-6 animate-in fade-in duration-300">
 <div className="bg-admin-surface border border-admin-border shadow-sm p-6 space-y-6">
 <div className="flex items-center gap-3 pb-4 border-b border-admin-border-hover">
 <div className="p-2 bg-blue-50 text-blue-600">
 <Mail size={18} />
 </div>
 <div>
 <h3 className="text-sm font-black uppercase text-admin-text tracking-wider">
 Primary Contact Info
 </h3>
 <p className="text-[10px] text-admin-muted font-medium">
 Main email, phone, and support channels
 </p>
 </div>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
 <div>
 <FieldLabel label="HQ Email (Primary)" required />
 <InputField
 icon={Mail}
 type="email"
 name="email"
 defaultValue={settings.email}
 placeholder="info@company.com"
 />
 </div>
 <div>
 <FieldLabel label="HQ Phone (Primary)" required />
 <InputField
 icon={Phone}
 type="text"
 name="phone"
 defaultValue={settings.phone}
 placeholder="+1 (555) 000-0000"
 />
 </div>
 <div>
 <FieldLabel label="Sales Desk Email" />
 <InputField
 icon={Mail}
 type="email"
 name="salesEmail"
 defaultValue={settings.salesEmail ||""}
 placeholder="sales@company.com"
 />
 </div>
 <div>
 <FieldLabel label="Support Direct Email" />
 <InputField
 icon={Mail}
 type="email"
 name="supportEmail"
 defaultValue={settings.supportEmail ||""}
 placeholder="help@company.com"
 />
 </div>
 </div>
 </div>

 <div className="bg-admin-surface border border-admin-border shadow-sm p-6 space-y-6">
 <div className="flex items-center gap-3 pb-4 border-b border-admin-border-hover">
 <div className="p-2 bg-green-50 text-green-600">
 <Smartphone size={18} />
 </div>
 <div>
 <h3 className="text-sm font-black uppercase text-admin-text tracking-wider">
 Extended Channels
 </h3>
 <p className="text-[10px] text-admin-muted font-medium">
 WhatsApp, address, and business hours
 </p>
 </div>
 </div>

 <div>
 <FieldLabel label="WhatsApp Integration (Business)" />
 <InputField
 icon={Smartphone}
 type="text"
 name="whatsappPhone"
 defaultValue={settings.whatsappPhone ||""}
 placeholder="+1 (571) ..."
 />
 </div>
 <div>
 <FieldLabel label="Physical Headquarters" required />
 <InputField
 icon={MapPin}
 type="text"
 name="address"
 defaultValue={settings.address}
 placeholder="Full business address"
 />
 </div>
 <div>
 <FieldLabel label="Global Business Hours" />
 <InputField
 icon={Clock}
 type="text"
 name="businessHours"
 defaultValue={settings.businessHours ||""}
 placeholder="Mon-Fri: 9AM - 6PM | Sat: 10AM - 2PM"
 />
 </div>
 </div>
 </div>
 )}

 {/* ═══ VISUAL IDENTITY ═══ */}
 {activeSection ==="brand" && (
 <div className="space-y-6 animate-in fade-in duration-300">
 <div className="bg-admin-surface border border-admin-border shadow-sm p-6">
 <div className="flex items-center gap-3 pb-4 border-b border-admin-border-hover mb-6">
 <div className="p-2 bg-purple-50 text-purple-600">
 <Palette size={18} />
 </div>
 <div>
 <h3 className="text-sm font-black uppercase text-admin-text tracking-wider">
 Brand Color Palette
 </h3>
 <p className="text-[10px] text-admin-muted font-medium">
 These tokens control your site&apos;s visual theme
 </p>
 </div>
 </div>

 <div className="space-y-6">
 <ColorPicker
 name="primaryColor"
 defaultValue={settings.primaryColor ||"#FFC107"}
 label="Primary Brand Color"
 />
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
 <ColorPicker
 name="secondaryColor"
 defaultValue={settings.secondaryColor ||"#1A1A1A"}
 label="Secondary Brand"
 />
 <ColorPicker
 name="accentColor"
 defaultValue={settings.accentColor ||"#FF5722"}
 label="Highlight Accent"
 />
 </div>

 {/* Live Preview */}
 <div className="pt-2">
 <div className="text-[9px] font-black uppercase tracking-widest text-gray-300 mb-3">
 Live Palette Preview
 </div>
 <div className="flex gap-2 h-12 overflow-hidden shadow-inner">
 <div
 className="flex-1 flex items-center justify-center"
 style={{ backgroundColor: settings.primaryColor ||"#FFC107" }}
 >
 <span className="text-[8px] font-black uppercase text-admin-text mix-blend-difference">
 Primary
 </span>
 </div>
 <div
 className="flex-1 flex items-center justify-center"
 style={{ backgroundColor: settings.secondaryColor ||"#1A1A1A" }}
 >
 <span className="text-[8px] font-black uppercase text-admin-text">
 Secondary
 </span>
 </div>
 <div
 className="flex-1 flex items-center justify-center"
 style={{ backgroundColor: settings.accentColor ||"#FF5722" }}
 >
 <span className="text-[8px] font-black uppercase text-admin-text">
 Accent
 </span>
 </div>
 </div>
 </div>
 </div>
 </div>

 <div className="bg-admin-surface border border-admin-border shadow-sm p-6">
 <div className="flex items-center gap-3 pb-4 border-b border-admin-border-hover mb-6">
 <div className="p-2 bg-indigo-50 text-indigo-600">
 <Globe2 size={18} />
 </div>
 <h3 className="text-sm font-black uppercase text-admin-text tracking-wider">
 Corporate Logo
 </h3>
 </div>
 <FieldLabel label="Logo URL" hint="Direct image path" />
 <InputField
 icon={Link2}
 type="text"
 name="logoUrl"
 defaultValue={settings.logoUrl ||""}
 placeholder="/logo.png or https://..."
 />
 {settings.logoUrl && (
 <div className="mt-4 p-4 bg-admin-bg flex items-center gap-4">
 <div className="w-14 h-14 bg-admin-surface border border-admin-border flex items-center justify-center overflow-hidden shrink-0">
 {/* eslint-disable-next-line @next/next/no-img-element */}
 <img
 src={settings.logoUrl}
 alt="Logo preview"
 className="max-w-full max-h-full object-contain"
 onError={(e) => {
 (e.target as HTMLImageElement).style.display ="none";
 }}
 />
 </div>
 <div>
 <div className="text-[9px] font-black uppercase text-admin-muted tracking-wider">
 Current Logo
 </div>
 <div className="text-[10px] font-mono text-admin-muted mt-0.5 truncate max-w-[300px]">
 {settings.logoUrl}
 </div>
 </div>
 </div>
 )}
 </div>
 </div>
 )}

 {/* ═══ DIGITAL ECOSYSTEM ═══ */}
 {activeSection ==="social" && (
 <div className="space-y-6 animate-in fade-in duration-300">
 <div className="bg-admin-surface border border-admin-border shadow-sm p-6">
 <div className="flex items-center gap-3 pb-4 border-b border-admin-border-hover mb-6">
 <div className="p-2 bg-pink-50 text-pink-600">
 <Share2 size={18} />
 </div>
 <div>
 <h3 className="text-sm font-black uppercase text-admin-text tracking-wider">
 Social Media Profiles
 </h3>
 <p className="text-[10px] text-admin-muted font-medium">
 Connect all your social presence
 </p>
 </div>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
 {[
 { name:"instagram" as const, label:"Instagram", emoji:"📸" },
 { name:"facebook" as const, label:"Facebook", emoji:"📘" },
 { name:"twitter" as const, label:"Twitter / X", emoji:"🐦" },
 { name:"linkedin" as const, label:"LinkedIn", emoji:"💼" },
 ].map((social) => {
 const value = settings[social.name] ||"";
 return (
 <div key={social.name} className="group">
 <FieldLabel label={social.label} />
 <div className="relative">
 <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base">
 {social.emoji}
 </span>
 <input
 type="text"
 name={social.name}
 defaultValue={value}
 placeholder={`https://${social.name}.com/...`}
 className="w-full bg-admin-bg border border-admin-border pl-12 pr-10 py-3.5 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all font-bold text-admin-text text-sm placeholder:text-gray-300"
 />
 {value && (
 <a
 href={value}
 target="_blank"
 rel="noopener noreferrer"
 className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-primary transition-colors opacity-0 group-hover:opacity-100"
 >
 <ExternalLink size={14} />
 </a>
 )}
 </div>
 </div>
 );
 })}
 </div>

 <div className="mt-5">
 <FieldLabel label="YouTube Channel" />
 <div className="relative group">
 <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base">
 🎬
 </span>
 <input
 type="text"
 name="youtube"
 defaultValue={settings.youtube ||""}
 placeholder="https://youtube.com/..."
 className="w-full bg-admin-bg border border-admin-border pl-12 pr-10 py-3.5 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all font-bold text-admin-text text-sm placeholder:text-gray-300"
 />
 {settings.youtube && (
 <a
 href={settings.youtube}
 target="_blank"
 rel="noopener noreferrer"
 className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-primary transition-colors opacity-0 group-hover:opacity-100"
 >
 <ExternalLink size={14} />
 </a>
 )}
 </div>
 </div>
 </div>
 </div>
 )}

 {/* ═══ COMPLIANCE ═══ */}
 {activeSection ==="compliance" && (
 <div className="space-y-6 animate-in fade-in duration-300">
 <div className="bg-admin-surface border border-admin-border shadow-sm p-6">
 <div className="flex items-center gap-3 pb-4 border-b border-admin-border-hover mb-6">
 <div className="p-2 bg-amber-50 text-amber-600">
 <ShieldCheck size={18} />
 </div>
 <div>
 <h3 className="text-sm font-black uppercase text-admin-text tracking-wider">
 Tax & Certifications
 </h3>
 <p className="text-[10px] text-admin-muted font-medium">
 Legal identifiers and industry credentials
 </p>
 </div>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
 <div>
 <FieldLabel label="Corporate Tax ID / EIN" />
 <InputField
 icon={Hash}
 type="text"
 name="taxId"
 defaultValue={settings.taxId ||""}
 placeholder="XX-XXXXXXX"
 />
 </div>
 <div>
 <FieldLabel label="Industry Certifications" hint="Comma-separated" />
 <InputField
 icon={Award}
 type="text"
 name="certifications"
 defaultValue={settings.certifications ||""}
 placeholder="NSF, METRO HEALTH, NFPA"
 />
 </div>
 </div>

 {settings.certifications && (
 <div className="mt-6 pt-4 border-t border-admin-border-hover">
 <div className="text-[9px] font-black uppercase text-gray-300 tracking-widest mb-3">
 Active Certifications
 </div>
 <div className="flex flex-wrap gap-2">
 {settings.certifications
 .split(",")
 .filter((c) => c.trim())
 .map((cert, i) => (
 <span
 key={i}
 className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1.5 -full text-[10px] font-black uppercase tracking-wider border border-green-100"
 >
 <CheckCircle2 size={10} />
 {cert.trim()}
 </span>
 ))}
 </div>
 </div>
 )}
 </div>
 </div>
 )}

 {/* ═══ OPERATIONS ═══ */}
 {activeSection ==="operations" && (
 <div className="space-y-6 animate-in fade-in duration-300">
 <div className="bg-admin-surface border border-admin-border shadow-sm p-6">
 <div className="flex items-center gap-3 pb-4 border-b border-admin-border-hover mb-6">
 <div className="p-2 bg-orange-50 text-orange-600">
 <TrendingUp size={18} />
 </div>
 <div>
 <h3 className="text-sm font-black uppercase text-admin-text tracking-wider">
 Metric Overrides
 </h3>
 <p className="text-[10px] text-admin-muted font-medium">
 Override counters displayed on the public site
 </p>
 </div>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
 <div className="bg-admin-bg p-6 border border-admin-border text-center">
 <div className="text-[9px] font-black uppercase tracking-widest text-admin-muted mb-3">
 Custom Builds Completed
 </div>
 <input
 type="number"
 name="trucksBuiltCount"
 defaultValue={settings.trucksBuiltCount || 0}
 className="w-full bg-admin-surface border border-admin-border p-4 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all font-black text-admin-text text-3xl text-center"
 />
 <div className="text-[8px] text-gray-300 font-bold mt-2 uppercase tracking-wider">
 Shown on homepage & about
 </div>
 </div>
 <div className="bg-admin-bg p-6 border border-admin-border text-center">
 <div className="text-[9px] font-black uppercase tracking-widest text-admin-muted mb-3">
 Years of Master Fabrication
 </div>
 <input
 type="number"
 name="experienceYears"
 defaultValue={settings.experienceYears || 0}
 className="w-full bg-admin-surface border border-admin-border p-4 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all font-black text-admin-text text-3xl text-center"
 />
 <div className="text-[8px] text-gray-300 font-bold mt-2 uppercase tracking-wider">
 Experience counter
 </div>
 </div>
 </div>
 </div>
 </div>
 )}

 {/* ═══ INTELLIGENCE ═══ */}
 {activeSection ==="analytics" && (
 <div className="space-y-6 animate-in fade-in duration-300">
 <div className="bg-admin-surface p-6 md:p-8 text-admin-text shadow-xl relative overflow-hidden">
 <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[80px] -mr-32 -mt-32 -full" />
 <div className="relative z-10">
 <div className="flex items-center justify-between mb-6">
 <div className="flex items-center gap-4">
 <div className="p-2 bg-admin-surface/10">
 <BarChart3 size={20} className="text-primary" />
 </div>
 <div>
 <h3 className="text-base font-black uppercase tracking-tight">
 Tracking Tokens
 </h3>
 <p className="text-[10px] text-admin-muted font-medium uppercase tracking-wider mt-0.5">
 Sensitive identifiers — toggle to reveal
 </p>
 </div>
 </div>
 <button
 type="button"
 onClick={() => setShowApiKeys(!showApiKeys)}
 className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary hover:text-admin-text transition-colors"
 >
 {showApiKeys ? <EyeOff size={14} /> : <Eye size={14} />}
 {showApiKeys ?"Hide" :"Reveal"}
 </button>
 </div>

 <div className="space-y-5">
 {[
 {
 name:"googleAnalyticsId" as const,
 label:"Google Analytics Tag",
 placeholder:"G-XXXXXXXXXX",
 emoji:"📊",
 },
 {
 name:"facebookPixelId" as const,
 label:"Facebook Pixel ID",
 placeholder:"XXXXXXXXXXXXXXX",
 emoji:"📘",
 },
 {
 name:"tiktokPixelId" as const,
 label:"TikTok Pixel ID",
 placeholder:"XXXXXXXXXXXXXXX",
 emoji:"🎵",
 },
 ].map((pixel) => {
 const pixelValue = settings[pixel.name] ||"";
 return (
 <div key={pixel.name}>
 <div className="flex items-center gap-2 mb-2">
 <span className="text-sm">{pixel.emoji}</span>
 <label className="text-[8px] font-black uppercase tracking-[0.2em] text-admin-muted">
 {pixel.label}
 </label>
 </div>
 <input
 type={showApiKeys ?"text" :"password"}
 name={pixel.name}
 defaultValue={pixelValue}
 placeholder={pixel.placeholder}
 className="w-full bg-admin-surface/5 border border-white/10 p-4 outline-none focus:border-primary transition-all text-sm font-black tracking-widest text-primary placeholder:text-gray-700 placeholder:tracking-normal placeholder:font-medium"
 />
 </div>
 );
 })}
 </div>

 <div className="mt-6 flex items-center gap-2 text-primary/70">
 <AlertCircle size={12} />
 <span className="text-[10px] font-bold uppercase tracking-widest">
 Keep tracking IDs secure — never share publicly
 </span>
 </div>
 </div>
 </div>
 </div>
 )}

 {/* ═══ LOCATION ═══ */}
 {activeSection ==="location" && (
 <div className="space-y-6 animate-in fade-in duration-300">
 <div className="bg-admin-surface border border-admin-border shadow-sm p-6 space-y-6">
 <div className="flex items-center gap-3 pb-4 border-b border-admin-border-hover">
 <div className="p-2 bg-cyan-50 text-cyan-600">
 <Map size={18} />
 </div>
 <div>
 <h3 className="text-sm font-black uppercase text-admin-text tracking-wider">
 Maps Integration
 </h3>
 <p className="text-[10px] text-admin-muted font-medium">
 Google Maps link and embed configuration
 </p>
 </div>
 </div>

 <div>
 <FieldLabel label="Google Maps Link" hint="Directions URL" />
 <InputField
 icon={MapPin}
 type="text"
 name="googleMapsLink"
 defaultValue={settings.googleMapsLink ||""}
 placeholder="https://maps.google.com/..."
 />
 </div>

 <div>
 <FieldLabel label="Map Embed (Iframe Src)" hint="Paste embed URL" />
 <textarea
 name="mapEmbedUrl"
 rows={4}
 defaultValue={settings.mapEmbedUrl ||""}
 placeholder="https://www.google.com/maps/embed?..."
 className="w-full bg-admin-bg border border-admin-border p-4 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all font-mono text-xs resize-none leading-relaxed"
 />
 </div>
 </div>

 {/* Map Preview */}
 <div className="bg-admin-surface border border-admin-border shadow-sm p-6">
 <div className="text-[9px] font-black uppercase text-admin-muted tracking-widest mb-3">
 Map Preview
 </div>
 {settings.mapEmbedUrl ? (
 <div className="overflow-hidden border border-admin-border shadow-inner h-[300px]">
 <iframe
 src={settings.mapEmbedUrl}
 className="w-full h-full border-0"
 loading="lazy"
 allowFullScreen
 title="Location Map"
 />
 </div>
 ) : (
 <div className="h-[200px] bg-admin-bg border-2 border-dashed border-admin-border flex items-center justify-center">
 <div className="text-center">
 <Map size={32} className="mx-auto text-gray-200 mb-2" />
 <p className="text-[10px] font-bold text-gray-300 uppercase tracking-wider">
 Add embed URL to preview
 </p>
 </div>
 </div>
 )}
 </div>
 </div>
 )}

 {/* ═══ EMAIL & SMTP ═══ */}
 {activeSection ==="smtp" && (
 <div className="space-y-6 animate-in fade-in duration-300">
 {/* Info Banner */}
 <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 p-5 flex gap-4">
 <div className="p-2.5 bg-blue-100 text-blue-600 shrink-0">
 <Bell size={18} />
 </div>
 <div>
 <p className="text-sm font-black text-admin-text uppercase tracking-tight">Email Notifications</p>
 <p className="text-[11px] text-admin-muted font-medium mt-1 leading-relaxed">
 Configure your SMTP server so quote requests and contact messages are automatically emailed to <strong className="text-admin-text">esteelquotes@gmail.com</strong>.
 For Gmail, use an <a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">App Password</a> (not your login password).
 </p>
 </div>
 </div>

 {/* SMTP Server Config */}
 <div className="bg-admin-surface border border-admin-border shadow-sm p-6 space-y-6">
 <div className="flex items-center gap-3 pb-4 border-b border-admin-border-hover">
 <div className="p-2 bg-blue-50 text-blue-600">
 <Server size={18} />
 </div>
 <div>
 <h3 className="text-sm font-black uppercase text-admin-text tracking-wider">SMTP Server</h3>
 <p className="text-[10px] text-admin-muted font-medium">Outgoing mail server configuration</p>
 </div>
 </div>
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
 <div className="lg:col-span-2">
 <FieldLabel label="SMTP Host" required />
 <InputField
 icon={Server}
 type="text"
 name="smtpHost"
 defaultValue={settings.smtpHost ||"smtp.gmail.com"}
 placeholder="smtp.gmail.com"
 />
 </div>
 <div>
 <FieldLabel label="Port" required />
 <InputField
 icon={Hash}
 type="number"
 name="smtpPort"
 defaultValue={String(settings.smtpPort ?? 587)}
 placeholder="587"
 />
 </div>
 </div>
 <div>
 <FieldLabel label="Encryption / Security" />
 <select
 name="smtpSecure"
 defaultValue={settings.smtpSecure ?"true" :"false"}
 className="w-full bg-admin-bg border border-admin-border p-3.5 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all text-sm font-bold text-admin-text"
 >
 <option value="false">🔒 STARTTLS — Port 587 (Recommended for Gmail)</option>
 <option value="true">🔐 TLS/SSL — Port 465</option>
 </select>
 </div>
 </div>

 {/* Credentials */}
 <div className="bg-admin-surface border border-admin-border shadow-sm p-6 space-y-6">
 <div className="flex items-center gap-3 pb-4 border-b border-admin-border-hover">
 <div className="p-2 bg-purple-50 text-purple-600">
 <Lock size={18} />
 </div>
 <div>
 <h3 className="text-sm font-black uppercase text-admin-text tracking-wider">Authentication</h3>
 <p className="text-[10px] text-admin-muted font-medium">Gmail: use an App Password, not your account password</p>
 </div>
 </div>
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
 <div>
 <FieldLabel label="SMTP Username / Email" required />
 <InputField
 icon={AtSign}
 type="email"
 name="smtpUser"
 defaultValue={settings.smtpUser ||""}
 placeholder="esteelquotes@gmail.com"
 />
 </div>
 <div>
 <FieldLabel label="SMTP Password / App Password" required />
 <InputField
 icon={Lock}
 type="password"
 name="smtpPassword"
 defaultValue={settings.smtpPassword ||""}
 placeholder="••••••••••••••••"
 />
 </div>
 </div>
 </div>

 {/* Notification Routing */}
 <div className="bg-admin-surface border border-admin-border shadow-sm p-6 space-y-6">
 <div className="flex items-center gap-3 pb-4 border-b border-admin-border-hover">
 <div className="p-2 bg-green-50 text-green-600">
 <Bell size={18} />
 </div>
 <div>
 <h3 className="text-sm font-black uppercase text-admin-text tracking-wider">Notification Routing</h3>
 <p className="text-[10px] text-admin-muted font-medium">Where emails are sent and who they appear to come from</p>
 </div>
 </div>
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
 <div>
 <FieldLabel label="Send Notifications To" required hint="Destination inbox" />
 <InputField
 icon={Mail}
 type="email"
 name="notificationEmail"
 defaultValue={settings.notificationEmail ||"esteelquotes@gmail.com"}
 placeholder="esteelquotes@gmail.com"
 />
 </div>
 <div>
 <FieldLabel label='"From" Display Name' hint="Optional" />
 <InputField
 icon={Mail}
 type="text"
 name="smtpFrom"
 defaultValue={settings.smtpFrom ||"Elite Steel Concepts <esteelquotes@gmail.com>"}
 placeholder='Elite Steel Concepts <esteelquotes@gmail.com>'
 />
 </div>
 </div>
 </div>

 {/* Status indicator + Test Button */}
 <div className={` p-5 flex items-start gap-4 ${
 settings.smtpUser && settings.smtpPassword && settings.notificationEmail
 ?"bg-green-50 border border-green-100"
 :"bg-amber-50 border border-amber-100"
 }`}>
 <div className={`p-2.5 shrink-0 ${
 settings.smtpUser && settings.smtpPassword && settings.notificationEmail
 ?"bg-green-100 text-green-600"
 :"bg-amber-100 text-amber-600"
 }`}>
 {settings.smtpUser && settings.smtpPassword && settings.notificationEmail
 ? <CheckCircle2 size={18} />
 : <AlertCircle size={18} />}
 </div>
 <div className="flex-1">
 <p className={`text-[10px] font-black uppercase tracking-widest ${
 settings.smtpUser && settings.smtpPassword && settings.notificationEmail
 ?"text-green-700" :"text-amber-700"
 }`}>
 {settings.smtpUser && settings.smtpPassword && settings.notificationEmail
 ?"✅ SMTP Configured — Emails will be sent automatically"
 :"⚠️ SMTP Not Configured — Fill in credentials above and save"}
 </p>
 <p className="text-[10px] text-admin-muted font-medium mt-1">
 Quote requests and contact form messages trigger instant email alerts to{""}
 <strong>{settings.notificationEmail ||"esteelquotes@gmail.com"}</strong>.
 </p>
 {settings.smtpUser && settings.smtpPassword && (
 <button
 type="button"
 onClick={handleTestSmtp}
 disabled={testingSmtp}
 className="mt-3 inline-flex items-center gap-2 bg-admin-surface border border-admin-border text-admin-text px-4 py-2 text-[10px] font-black uppercase tracking-widest hover:border-primary hover:shadow-md disabled:opacity-50 transition-all"
 >
 <Mail size={12} className={testingSmtp ?"animate-pulse" :""} />
 {testingSmtp ?"Sending Test..." :"Send Test Email"}
 </button>
 )}
 </div>
 </div>
 </div>
 )}

 {/* ─── 9. TURSO & CLOUD DATABASE SYNC ─── */}
 {activeSection === "database" && (
 <div className="space-y-6">
 <TursoSyncManager />
 </div>
 )}

 {/* ═══ SAVE BUTTON ═══ */}
 <div className="flex items-center justify-between bg-admin-surface border border-admin-border shadow-sm p-5">
 <div className="flex items-center gap-3">
 <Sparkles size={16} className="text-primary" />
 <span className="text-[10px] font-bold uppercase tracking-widest text-admin-muted">
 Changes deploy instantly to the live site
 </span>
 </div>
 <button
 type="submit"
 disabled={loading}
 className="bg-primary text-admin-text px-8 py-3.5 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:scale-100 transition-all font-black uppercase tracking-widest text-[11px] flex items-center gap-3"
 >
 <Save
 size={16}
 className={loading ?"animate-spin" :""}
 />
 {loading ?"Syncing..." :"Save Settings"}
 </button>
 </div>
 </div>
 </div>
 </form>
 </div>
 </>
 );
};

export default SettingsForm;
