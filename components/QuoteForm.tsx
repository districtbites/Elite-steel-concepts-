"use client";

import React, { useState } from "react";
import { submitQuoteForm } from "@/app/actions/quote";
import {
  ArrowRight,
  Building2,
  CalendarClock,
  CarFront,
  Caravan,
  Check,
  CheckCircle2,
  ChevronDown,
  Loader2,
  Lock,
  Mail,
  Map as MapIcon,
  MapPin,
  Phone,
  Ruler,
  Truck,
  User,
  UtensilsCrossed,
  Wallet,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";

// ─── Shared styles ───────────────────────────────────────────────────────────
const fieldClass =
  "w-full rounded-xl border border-gray-200 bg-gray-50 py-3.5 pl-11 pr-4 text-[15px] text-black placeholder:text-gray-400 outline-none transition-all hover:border-gray-300 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/15";
const labelClass = "mb-2 block text-sm font-semibold text-gray-800";

const platforms: { value: string; icon: LucideIcon }[] = [
  { value: "Custom Food Truck", icon: Truck },
  { value: "Custom Food Trailer", icon: Caravan },
  // { value: "Concession Trailer", icon: Caravan },
];

const addOns = [
  "Full Wrap / Graphics",
  "Fire Suppression System",
  "Health Dept Consultation",
  "Generator Install",
  "Custom Porch Fab",
];

const US_STATES: { code: string; name: string }[] = [
  { code: "AL", name: "Alabama" }, { code: "AK", name: "Alaska" }, { code: "AZ", name: "Arizona" },
  { code: "AR", name: "Arkansas" }, { code: "CA", name: "California" }, { code: "CO", name: "Colorado" },
  { code: "CT", name: "Connecticut" }, { code: "DE", name: "Delaware" }, { code: "DC", name: "District of Columbia" },
  { code: "FL", name: "Florida" }, { code: "GA", name: "Georgia" }, { code: "HI", name: "Hawaii" },
  { code: "ID", name: "Idaho" }, { code: "IL", name: "Illinois" }, { code: "IN", name: "Indiana" },
  { code: "IA", name: "Iowa" }, { code: "KS", name: "Kansas" }, { code: "KY", name: "Kentucky" },
  { code: "LA", name: "Louisiana" }, { code: "ME", name: "Maine" }, { code: "MD", name: "Maryland" },
  { code: "MA", name: "Massachusetts" }, { code: "MI", name: "Michigan" }, { code: "MN", name: "Minnesota" },
  { code: "MS", name: "Mississippi" }, { code: "MO", name: "Missouri" }, { code: "MT", name: "Montana" },
  { code: "NE", name: "Nebraska" }, { code: "NV", name: "Nevada" }, { code: "NH", name: "New Hampshire" },
  { code: "NJ", name: "New Jersey" }, { code: "NM", name: "New Mexico" }, { code: "NY", name: "New York" },
  { code: "NC", name: "North Carolina" }, { code: "ND", name: "North Dakota" }, { code: "OH", name: "Ohio" },
  { code: "OK", name: "Oklahoma" }, { code: "OR", name: "Oregon" }, { code: "PA", name: "Pennsylvania" },
  { code: "RI", name: "Rhode Island" }, { code: "SC", name: "South Carolina" }, { code: "SD", name: "South Dakota" },
  { code: "TN", name: "Tennessee" }, { code: "TX", name: "Texas" }, { code: "UT", name: "Utah" },
  { code: "VT", name: "Vermont" }, { code: "VA", name: "Virginia" }, { code: "WA", name: "Washington" },
  { code: "WV", name: "West Virginia" }, { code: "WI", name: "Wisconsin" }, { code: "WY", name: "Wyoming" },
];

// ─── Building blocks ─────────────────────────────────────────────────────────
const SectionTitle = ({ step, title, hint }: { step: string; title: string; hint: string }) => (
  <div className="mb-6 flex items-start gap-4">
    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-black text-black shadow-[0_6px_20px_-6px_rgba(247,147,30,0.8)]">
      {step}
    </span>
    <div>
      <h3 className="text-lg md:text-xl font-black text-black tracking-tight">{title}</h3>
      <p className="text-sm text-gray-500">{hint}</p>
    </div>
  </div>
);

const Field = ({
  id,
  label,
  icon: Icon,
  required,
  children,
}: {
  id: string;
  label: string;
  icon: LucideIcon;
  required?: boolean;
  children: React.ReactNode;
}) => (
  <div>
    <label htmlFor={id} className={labelClass}>
      {label} {required && <span className="text-primary">*</span>}
    </label>
    <div className="relative">
      <Icon size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
      {children}
    </div>
  </div>
);

const SelectField = ({
  id,
  label,
  icon,
  options,
}: {
  id: string;
  label: string;
  icon: LucideIcon;
  options: { value: string; label: string }[];
}) => (
  <Field id={id} label={label} icon={icon}>
    <select id={id} name={id} className={`${fieldClass} cursor-pointer appearance-none pr-11`}>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
    <ChevronDown size={18} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
  </Field>
);

// ─── Form ────────────────────────────────────────────────────────────────────
const QuoteForm = ({ citiesByState = {} }: { citiesByState?: Record<string, string[]> }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [projectType, setProjectType] = useState("Custom Food Truck");
  const [stateCode, setStateCode] = useState("");
  const [city, setCity] = useState("");

  const stateName = US_STATES.find((s) => s.code === stateCode)?.name || "";
  const servedCities = citiesByState[stateCode] || [];
  const cityMatches = city.trim()
    ? servedCities.filter((c) => c.toLowerCase().startsWith(city.trim().toLowerCase()) && c.toLowerCase() !== city.trim().toLowerCase())
    : servedCities;
  const isServedCity = servedCities.some((c) => c.toLowerCase() === city.trim().toLowerCase());

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    const result = await submitQuoteForm(formData);
    setLoading(false);

    if (result && result.success) {
      setSuccess(true);
    } else {
      alert("Something went wrong while sending your request. Please try again.");
    }
  };

  const resetForm = () => {
    setSuccess(false);
    setStateCode("");
    setCity("");
  };

  if (success) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white px-6 py-14 md:px-16 md:py-20 text-center shadow-[0_30px_80px_-30px_rgba(0,0,0,0.25)]">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
        <div className="mx-auto mb-8 flex size-20 items-center justify-center rounded-full bg-primary/10 ring-8 ring-primary/5">
          <CheckCircle2 className="size-10 text-primary" strokeWidth={2.25} />
        </div>
        <h3 className="mb-4 text-3xl md:text-4xl font-black uppercase tracking-tight text-black">
          Request Received
        </h3>
        <p className="mx-auto mb-10 max-w-lg text-base leading-relaxed text-gray-600">
          Thank you! Our team is reviewing your project details and will contact you shortly with your free quote.
        </p>
        <button
          type="button"
          onClick={resetForm}
          className="inline-flex items-center gap-2 rounded-xl border border-gray-300 px-7 py-3.5 text-sm font-bold text-black transition-colors hover:border-primary hover:text-primary"
        >
          Submit Another Request
        </button>
      </div>
    );
  }

  return (
    <form
      action={handleSubmit}
      className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_30px_80px_-30px_rgba(0,0,0,0.25)]"
    >
      {/* Header */}
      <div className="relative bg-[#0a0a0a] px-6 py-7 md:px-10">
        <div className="absolute inset-x-0 top-0 h-1 bg-primary" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, #fff 0px, #fff 1px, transparent 1px, transparent 12px)",
          }}
        />
        <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-lg md:text-xl font-black uppercase tracking-tight text-white">
              Tell Us About Your Build
            </p>
            <p className="text-sm text-gray-400">Takes about 2 minutes. No obligation.</p>
          </div>
          <ol className="flex items-center gap-2 text-xs font-bold text-gray-400">
            {["Contact", "Location", "Build", "Equipment", "Notes"].map((s, i) => (
              <li key={s} className="flex items-center gap-2">
                <span className="flex size-6 items-center justify-center rounded-full bg-primary/15 text-[11px] text-primary">
                  {i + 1}
                </span>
                <span className="hidden sm:inline">{s}</span>
                {i < 4 && <span className="h-px w-4 bg-white/15" />}
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="divide-y divide-gray-100">
        {/* 1. Contact */}
        <section className="px-6 py-8 md:px-10 md:py-10">
          <SectionTitle step="1" title="Contact Information" hint="How should we reach you?" />
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Field id="name" label="Full Name" icon={User} required>
              <input type="text" id="name" name="name" required autoComplete="name" className={fieldClass} placeholder="John Doe" />
            </Field>
            <Field id="email" label="Email Address" icon={Mail} required>
              <input type="email" id="email" name="email" required autoComplete="email" className={fieldClass} placeholder="john@company.com" />
            </Field>
            <Field id="phone" label="Phone Number" icon={Phone} required>
              <input type="tel" id="phone" name="phone" required autoComplete="tel" className={fieldClass} placeholder="(555) 555-0199" />
            </Field>
            <Field id="company" label="Company Name" icon={Building2}>
              <input type="text" id="company" name="company" autoComplete="organization" className={fieldClass} placeholder="Optional" />
            </Field>
          </div>
        </section>

        {/* 2. Vending location */}
        <section className="px-6 py-8 md:px-10 md:py-10">
          <SectionTitle step="2" title="Where Will You Be Vending?" hint="Requirements can vary by state and city." />
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Field id="vendingStateSelect" label="State" icon={MapIcon} required>
              <select
                id="vendingStateSelect"
                required
                value={stateCode}
                onChange={(e) => {
                  setStateCode(e.target.value);
                  setCity("");
                }}
                className={`${fieldClass} cursor-pointer appearance-none pr-11 ${stateCode ? "" : "text-gray-400"}`}
              >
                <option value="">Select your state</option>
                {US_STATES.map((s) => (
                  <option key={s.code} value={s.code} className="text-black">
                    {s.name}
                  </option>
                ))}
              </select>
              <ChevronDown size={18} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
            </Field>
            {/* Readable state value for the email / admin */}
            <input type="hidden" name="vendingState" value={stateCode ? `${stateName} (${stateCode})` : ""} />

            <Field id="vendingCity" label="City" icon={MapPin} required>
              <input
                type="text"
                id="vendingCity"
                name="vendingCity"
                required
                disabled={!stateCode}
                value={city}
                onChange={(e) => setCity(e.target.value)}
                list={servedCities.length ? "vending-city-options" : undefined}
                autoComplete="off"
                className={`${fieldClass} disabled:cursor-not-allowed disabled:opacity-60`}
                placeholder={stateCode ? "Type your city" : "Select a state first"}
              />
              <datalist id="vending-city-options">
                {servedCities.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </Field>
          </div>

          {stateCode && (
            <div className="mt-5 rounded-xl border border-gray-100 bg-gray-50 p-4">
              {servedCities.length > 0 ? (
                <>
                  <p className="mb-3 text-sm text-gray-600">
                    {isServedCity ? (
                      <span className="inline-flex items-center gap-1.5 font-semibold text-black">
                        <CheckCircle2 size={16} className="text-primary" /> Great — we already build for clients in {city.trim()}, {stateCode}.
                      </span>
                    ) : (
                      <>Popular cities we serve in <span className="font-semibold text-black">{stateName}</span>:</>
                    )}
                  </p>
                  {!isServedCity && (
                    <div className="flex flex-wrap gap-2">
                      {cityMatches.slice(0, 8).map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setCity(c)}
                          className="rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:border-primary hover:text-primary"
                        >
                          {c}
                        </button>
                      ))}
                      {cityMatches.length === 0 && (
                        <span className="text-sm text-gray-500">No match yet — just type your city, we deliver nationwide.</span>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <p className="flex items-center gap-2 text-sm text-gray-600">
                  <Truck size={16} className="text-primary" /> We build and deliver to {stateName}. Just type your city.
                </p>
              )}
            </div>
          )}
        </section>

        {/* 3. Build */}
        <section className="px-6 py-8 md:px-10 md:py-10">
          <SectionTitle step="3" title="What Are You Looking For?" hint="What would you like us to build?" />

          <p className={labelClass}>
            Select Platform <span className="text-primary">*</span>
          </p>
          <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {platforms.map(({ value, icon: Icon }) => {
              const selected = projectType === value;
              return (
                <label key={value} className="cursor-pointer">
                  <input
                    type="radio"
                    name="projectType"
                    value={value}
                    className="peer sr-only"
                    checked={selected}
                    onChange={(e) => setProjectType(e.target.value)}
                  />
                  <div
                    className={`relative flex items-center gap-3 rounded-xl border-2 p-4 transition-all peer-focus-visible:ring-4 peer-focus-visible:ring-primary/20 sm:flex-col sm:py-6 sm:text-center ${
                      selected
                        ? "border-primary bg-primary/[0.06] shadow-[0_10px_30px_-12px_rgba(247,147,30,0.6)]"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    {selected && (
                      <span className="absolute right-3 top-3 flex size-5 items-center justify-center rounded-full bg-primary text-black">
                        <Check size={12} strokeWidth={3} />
                      </span>
                    )}
                    <span
                      className={`flex size-11 items-center justify-center rounded-lg transition-colors ${
                        selected ? "bg-primary text-black" : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      <Icon size={22} />
                    </span>
                    <span className={`text-sm font-bold ${selected ? "text-black" : "text-gray-600"}`}>{value}</span>
                  </div>
                </label>
              );
            })}
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <SelectField
              id="budget"
              label="Budget"
              icon={Wallet}
              options={[
                { value: "", label: "Select a range" },
                { value: "Under 30k", label: "Under $30,000" },
                { value: "30k-50k", label: "$30,000 – $50,000" },
                { value: "50k-80k", label: "$50,000 – $80,000" },
                { value: "80k-120k", label: "$80,000 – $120,000" },
                { value: "120k+", label: "$120,000+" },
              ]}
            />
            <SelectField
              id="timeline"
              label="Timeline"
              icon={CalendarClock}
              options={[
                { value: "", label: "Select a target date" },
                { value: "ASAP", label: "Immediate Start" },
                { value: "1-3 Months", label: "1–3 Months" },
                { value: "3-6 Months", label: "3–6 Months" },
                { value: "Planning", label: "Just Researching" },
              ]}
            />
            <SelectField
              id="sourcing"
              label="Vehicle"
              icon={CarFront}
              options={[
                { value: "Need Vehicle", label: "Source a vehicle for me" },
                { value: "Have Vehicle", label: "I will provide the vehicle" },
              ]}
            />
            <Field id="dimensions" label="Preferred Size" icon={Ruler}>
              <input type="text" id="dimensions" name="dimensions" className={fieldClass} placeholder="e.g. 16ft step van" />
            </Field>
            <div className="md:col-span-2">
              <Field id="menuType" label="What type of food will you be serving?" icon={UtensilsCrossed} required>
                <input type="text" id="menuType" name="menuType" required className={fieldClass} placeholder="e.g. Tacos, pizza, BBQ, coffee, desserts..." />
              </Field>
            </div>
          </div>
        </section>

        {/* 4. Equipment */}
        <section className="px-6 py-8 md:px-10 md:py-10">
          <SectionTitle step="4" title="Equipment" hint="Helps us plan your kitchen layout." />
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <SelectField
              id="powerRequirements"
              label="Power Source"
              icon={Zap}
              options={[
                { value: "Standard Gas", label: "Standard Gas Generator" },
                { value: "Quiet Diesel", label: "Quiet Diesel Generator" },
                { value: "All Electric", label: "All-Electric (Shore Power)" },
                { value: "Unsure", label: "Not sure yet" },
              ]}
            />
            <Field id="equipment" label="Primary Equipment Needed" icon={Wrench}>
              <input type="text" id="equipment" name="equipment" className={fieldClass} placeholder="36in griddle, fryer, refrigerator..." />
            </Field>
          </div>

          <p className={`${labelClass} mt-6`}>Add-Ons</p>
          <div className="flex flex-wrap gap-2.5">
            {addOns.map((service) => (
              <label key={service} className="cursor-pointer">
                <input type="checkbox" name="services" value={service} className="peer sr-only" />
                <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-600 transition-all hover:border-gray-300 peer-checked:border-primary peer-checked:bg-primary peer-checked:text-black peer-focus-visible:ring-4 peer-focus-visible:ring-primary/20 [&>svg]:hidden peer-checked:[&>svg]:block">
                  <Check size={14} strokeWidth={3} />
                  {service}
                </span>
              </label>
            ))}
          </div>
        </section>

        {/* 5. Notes + submit */}
        <section className="px-6 py-8 md:px-10 md:py-10">
          <SectionTitle step="5" title="Project Notes" hint="Anything else we should know?" />
          <label htmlFor="message" className={labelClass}>
            Your Message <span className="text-primary">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={5}
            className={`${fieldClass.replace("pl-11", "pl-4")} resize-none`}
            placeholder="Share any layout ideas, workflow needs, or questions..."
          />

          <button
            disabled={loading}
            type="submit"
            className="group mt-8 flex w-full items-center justify-center gap-3 rounded-xl bg-primary px-8 py-[18px] text-sm font-black uppercase tracking-[0.15em] text-black shadow-[0_15px_40px_-12px_rgba(247,147,30,0.7)] transition-all hover:bg-orange-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Sending...
              </>
            ) : (
              <>
                Get My Free Quote
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
          <p className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
            <Lock size={13} /> Your information is private and never shared.
          </p>
        </section>
      </div>
    </form>
  );
};

export default QuoteForm;
