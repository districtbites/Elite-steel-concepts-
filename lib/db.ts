import fs from 'fs/promises';
import path from 'path';
import {
    InternalLinkRule,
    InternalLinkSettings,
    DEFAULT_INTERNAL_LINK_RULES,
    DEFAULT_INTERNAL_LINK_SETTINGS
} from './internalLinks';
import { isTursoConfigured, tursoGet, tursoSet, tursoGetAllKV, tursoBatchSet } from './turso';
import { autoInitializeTursoIfEmpty } from './tursoSync';

export type { InternalLinkRule, InternalLinkSettings };

const DB_PATH = path.join(process.cwd(), 'data/db.json');

export interface BlogPost {
    id: string;
    title: string;
    subtitle?: string;
    excerpt: string;
    category: string;
    tags?: string[];
    date: string;
    readTime: string;
    image: string;
    imageAlt?: string;
    slug: string;
    status: "Published" | "Draft";
    content?: string;
    metaDescription?: string;
}

export interface Quote {
    id: string;
    name: string;
    email: string;
    phone: string;
    company?: string;
    projectType: string;
    sourcing: string;
    budget: string;
    timeline: string;
    menuType?: string;
    message: string;

    // New Detailed Fields
    dimensions?: string;
    equipment?: string;
    brandingNeeds?: string;
    powerRequirements?: string;
    services?: string[]; // e.g., ["Design", "Permits", "Fabrication"]

    // Where the client plans to vend
    vendingState?: string;
    vendingCity?: string;

    date: string;
    status: "New" | "Contacted" | "Designing" | "Quoted" | "In Production" | "Delivered" | "Closed";
}

export interface Contact {
    id: string;
    name: string;
    email: string;
    phone?: string;
    message: string;
    date: string;
    status: "New" | "Read";
}

export interface GlobalSettings {
    // Core Identity
    email: string;
    phone: string;
    address: string;
    businessHours?: string;
    logoUrl?: string;

    // Communication & Sales
    salesEmail?: string;
    supportEmail?: string;
    whatsappPhone?: string;

    // Social Networks
    instagram: string;
    facebook: string;
    twitter: string;
    linkedin?: string;
    youtube?: string;

    // Identity & Compliance
    taxId?: string;
    certifications?: string; // e.g. "NSF, METRO DC HEALTH, NFPA"

    // Branding & Design Tokens
    primaryColor?: string; // Hex e.g. #FFC107
    secondaryColor?: string; // Hex
    accentColor?: string;

    // Location & Analytics
    googleMapsLink?: string;
    mapEmbedUrl?: string;
    googleAnalyticsId?: string;
    facebookPixelId?: string;
    tiktokPixelId?: string;

    // Operational Metrics (Overrides)
    trucksBuiltCount?: number;
    experienceYears?: number;

    // System Status
    maintenanceMode?: boolean;

    // SMTP / Email Configuration
    smtpHost?: string;       // e.g. smtp.gmail.com
    smtpPort?: number;       // e.g. 587
    smtpUser?: string;       // SMTP username / Gmail address
    smtpPassword?: string;   // SMTP password / App password
    smtpFrom?: string;       // "From" display name + address
    notificationEmail?: string; // Where to send quote/contact alerts
    smtpSecure?: boolean;    // true = TLS (port 465), false = STARTTLS
}

export interface FAQ {
    id: string;
    question: string;
    answer: string;
    category: string;
    order: number;
}

export interface PageSection {
    title?: string;
    subtitle?: string;
    content?: string;
    ctaText?: string;
}

export interface PageSEO {
    title: string;
    description: string;
    keywords: string;
    imageAlts?: { [key: string]: string };
    sections?: { [key: string]: PageSection };
    structuredData?: string; // JSON-LD
}

export interface SEOSettings {
    siteTitle: string;
    description: string;
    keywords: string;
    ogImage: string;
    twitterHandle: string;
    robotsTxt: string;
    canonicalUrl: string;
    pages: {
        [key: string]: PageSEO;
    };
}

export interface Testimonial {
    id: string;
    clientName: string;
    role?: string;
    company?: string;
    content: string;
    rating: number; // 1-5
    date: string;
    image?: string;
}

export interface Newsletter {
    id: string;
    email: string;
    date: string;
}

export interface LocationFAQ {
    question: string;
    answer: string;
}

export interface LocationSection {
    heading: string;
    content: string;
}

export interface LocationEntry {
    id: string;
    slug: string;
    city: string;
    state: string;
    h1: string;
    intro: string;
    ctaText: string;
    distance: string;
    whyEsc: string;
    localDetails: string[];
    faq: LocationFAQ[];
    sections: {
        design: LocationSection;
        fabrication: LocationSection;
        delivery: LocationSection;
    };
    titleTag: string;
    metaDescription: string;
    published: boolean;
}

export interface Project {
    id: string;
    title: string;
    slug: string;
    category: string;
    image: string; // Featured image
    gallery?: string[]; // Multiple images
    description: string;
    tagline?: string; // Short hook
    client?: string;
    completionDate?: string;
    location?: string;
    specifications?: {
        dimensions?: string;
        chassis?: string;
        power?: string;
        equipment?: string[];
    };
    featured?: boolean;
}

export interface MediaAsset {
    id: string;
    url: string;
    alt: string;
    page: string; // "home", "about", "services", "global", etc.
    location: string; // "hero", "sidebar", "gallery", etc.
    dimensions: string; // Guidance for user, e.g. "1920x1080"
    createdAt: string;
}

export type AdminRole = "super_admin" | "admin" | "manager" | "seo";

export interface User {
    id: string;
    name: string;
    email: string;
    password: string; // Storing plain text for this mock DB, use hashing in prod
    role: AdminRole;
    createdAt: string;
    forcePasswordChange?: boolean;
}

interface DatabaseSchema {
    posts: BlogPost[];
    quotes: Quote[];
    contacts: Contact[];
    settings: GlobalSettings;
    seo: SEOSettings;
    testimonials: Testimonial[];
    projects: Project[];
    faqs?: FAQ[];
    newsletters?: Newsletter[];
    assets?: MediaAsset[];
    users?: User[];
    locations?: LocationEntry[];
    internalLinkRules?: InternalLinkRule[];
    internalLinkSettings?: InternalLinkSettings;
}

const DEFAULT_SETTINGS: GlobalSettings = {
    email: "esteelquotes@gmail.com",
    phone: "(571) 651-0337",
    address: "11200 Bertalice Ct, Manassas, VA 20110",
    instagram: "https://www.instagram.com/elitesteelconcepts/",
    facebook: "https://www.facebook.com/EliteSteelConcepts",
    twitter: "https://twitter.com/elitesteelcncpt",
    linkedin: "https://www.linkedin.com/company/elite-steel-concepts",
    youtube: "",
    salesEmail: "esteelquotes@gmail.com",
    supportEmail: "esteelquotes@gmail.com",
    whatsappPhone: "+15716510337",
    certifications: "NSF · METRO DC HEALTH · NFPA · Virginia DPOR Licensed",
    primaryColor: "#F7931E",
    secondaryColor: "#000000",
    accentColor: "#333333",
    businessHours: "Mon-Sat | 09:00 AM - 05:00 PM",
    logoUrl: "/logo.png",
    googleMapsLink: "https://www.google.com/maps/place/11200+Bertalice+Ct,+Manassas,+VA+20110",
    mapEmbedUrl: "https://maps.google.com/maps?q=11200+Bertalice+Ct,+Manassas,+VA+20110&t=&z=15&ie=UTF8&iwloc=&output=embed",
    trucksBuiltCount: 350,
    experienceYears: 14,
    // SMTP defaults
    smtpHost: "smtp.gmail.com",
    smtpPort: 587,
    smtpUser: "",
    smtpPassword: "",
    smtpFrom: "Elite Steel Concepts <esteelquotes@gmail.com>",
    notificationEmail: "esteelquotes@gmail.com",
    smtpSecure: false,
};

const PAGE_STRUCTURE: { [key: string]: { [key: string]: PageSection } } = {
    "home": {
        "hero": { title: "Custom Food Trucks, Trailers & Mobile Kitchens Built to Perform", content: "Design. Fabrication. Ready to Serve. We turn your culinary vision into a high-performance mobile business.", ctaText: "Request a Quote" },
        "intro": { title: "Building Custom Food Trucks & Concession Trailers For Entrepreneurs Since 2012", content: "If you're looking to get started on launching your very own mobile food truck, contact Elite Steel Concepts today! Though we're located in the Metro DC area, our services are nationwide. We provide opportunity for entrepreneurs to visualize and design their ideal mobile kitchen and make their dream a reality. We're skilled in the fabrication, assembly and creation of beautiful mobile kitchens, food trucks and concession trailers. Our ultimate goal is to roll out a beautiful mobile food business in record time to allow you to spread happiness with your menu! All our trucks and trailers are built specifically to your needs and goals." },
        "whychooseus": { title: "Why Choose Elite Steel Concepts?", subtitle: "The Elite Advantage", content: "100% Health & Fire Code Compliant Builds\n14+ Years of Expert Fabrication Experience\nCustom Designed to Your Menu & Workflow\nPrecision TIG/MIG Welding & NSF Standards\nEnd-to-End Support: Design → Fabrication → Handover\nBased in Manassas VA, Serving DMV & Nationwide" },
        "localcoverage": { title: "Proudly Serving the DMV & Beyond", subtitle: "Service Area", content: "Based in Manassas, Virginia, Elite Steel Concepts serves the entire Washington DC metropolitan area including Northern Virginia, Maryland, and the greater Mid-Atlantic region. Our custom food trucks, concession trailers, and mobile kitchens have been delivered to entrepreneurs across 48 states. Whether you're launching in DC, Baltimore, Richmond, or anywhere nationwide — we build and deliver to your location." },
        "cta": { title: "Ready to Start Your Build?", subtitle: "Tell us about your vision and let's create the perfect mobile kitchen for your business.", ctaText: "Get a Free Quote" }
    },
    "about": {
        "header": { title: "Our Story", subtitle: "With 14+ years of experience, Elite Steel Concepts builds custom food trucks, trailers & mobile kitchens designed for food businesses. Based in Manassas, Virginia, we proudly serve entrepreneurs nationwide." },
        "story": { title: "Built Custom Food Trucks & Trailers for Entrepreneurs With Big Ideas", subtitle: "Our Mission", content: "Our mission is to build high-quality custom food trailers and trucks using durable, commercial-grade materials, reliable equipment, expert construction, and practical kitchen layouts. Every build is carefully designed around the client's menu, workflow, and business needs, with a strong focus on durability, functionality, professional finishing, and applicable code requirements. We use quality materials and thoughtful designs to create dependable mobile kitchen solutions that support entrepreneurs from their first launch through long-term business growth." },
        "cta": { title: "Ready to Start Your Journey?", subtitle: "Let's build a business that moves with you. Get your custom quote started today.", ctaText: "Get Free Quote" }
    },
    "services": {
        "header": { title: "Expert Food Truck, Food Trailer & Mobile Kitchen Services Nationwide", subtitle: "We build custom food trucks and trailers designed around your menu, equipment, and business goals." },
        "intro": { title: "Industry Leading Mobile Kitchen Solutions", subtitle: "Precision Builds", content: "At Elite Steel Concepts, we don't just build boxes with kitchens. We engineer high-performance commercial environments designed to maximize flow, sanitation, and safety while projecting a premium brand image." },
        "cta": { title: "Build Your Business On A Foundation Of Steel", ctaText: "Get Custom Quote" }
    },
    "portfolio": { "header": { title: "Elite Showcase", subtitle: "Browse our recent custom builds." } },
    "process": { "header": { title: "The Build Journey", subtitle: "From concept to keys." } },
    "blog": { "header": { title: "News & Insights", subtitle: "Latest from the workshop." } },
    "contact": { "header": { title: "Get In Touch", subtitle: "Start your consultation today." } },
    "quote": { "header": { title: "Custom Quote", subtitle: "Detailed pricing for your vision." } },
    "testimonials": { "header": { title: "Client Success Stories", subtitle: "Hear from the entrepreneurs we've helped launch." } },
    "privacy": {
        "header": { title: "Privacy Policy", subtitle: "Your data security is our priority." },
        "content": { title: "Information Governance", content: "At Elite Steel Concepts, we adhere to strict data protection standards. We collect information only necessary to provide our fabrication services and improve your user experience." }
    },
    "terms": {
        "header": { title: "Terms of Service", subtitle: "The foundation of our partnership." },
        "content": { title: "Legal Framework", content: "By utilizing our services, you agree to the following terms and conditions regarding custom fabrication, payment schedules, and project timelines." }
    }
};

const DEFAULT_SEO: SEOSettings = {
    siteTitle: "Elite Steel Concepts",
    description: "Custom Food Truck Builder",
    keywords: "food truck, trailer",
    ogImage: "",
    twitterHandle: "",
    robotsTxt: "User-agent: *\nAllow: /",
    canonicalUrl: "https://www.esteelconcepts.com",
    pages: {}
};

// ─── High-Speed In-Memory Cache ───
let memoryDbCache: DatabaseSchema | null = null;
let lastCacheTime = 0;
const CACHE_TTL_MS = 30 * 1000; // 30s cache TTL for instant sub-millisecond page loads

export function invalidateDbCache() {
    memoryDbCache = null;
    lastCacheTime = 0;
}

// Helper to read DB
async function readDb(): Promise<DatabaseSchema> {
    const now = Date.now();
    // 1. Return from memory cache if fresh (0ms response)
    if (memoryDbCache && (now - lastCacheTime < CACHE_TTL_MS)) {
        return memoryDbCache;
    }

    if (isTursoConfigured()) {
        try {
            // High-speed single query fetching all keys at once
            const kvMap = await tursoGetAllKV();
            if (Object.keys(kvMap).length > 0) {
                const schema: DatabaseSchema = {
                    posts: kvMap.posts || [],
                    quotes: kvMap.quotes || [],
                    contacts: kvMap.contacts || [],
                    settings: kvMap.settings || DEFAULT_SETTINGS,
                    seo: kvMap.seo || DEFAULT_SEO,
                    testimonials: kvMap.testimonials || [],
                    projects: kvMap.projects || [],
                    faqs: kvMap.faqs || [],
                    newsletters: kvMap.newsletters || [],
                    assets: kvMap.assets || [],
                    users: kvMap.users || [],
                    locations: kvMap.locations || [],
                    internalLinkRules: kvMap.internalLinkRules && kvMap.internalLinkRules.length > 0 ? kvMap.internalLinkRules : DEFAULT_INTERNAL_LINK_RULES,
                    internalLinkSettings: kvMap.internalLinkSettings || DEFAULT_INTERNAL_LINK_SETTINGS
                };
                memoryDbCache = schema;
                lastCacheTime = now;
                return schema;
            }
        } catch (tursoErr) {
            console.error("Turso read error, falling back to local db.json:", tursoErr);
        }
    }

    // Local JSON fallback
    try {
        const data = await fs.readFile(DB_PATH, 'utf-8');
        const parsed = JSON.parse(data);
        const schema: DatabaseSchema = {
            posts: parsed.posts || [],
            quotes: parsed.quotes || [],
            contacts: parsed.contacts || [],
            settings: parsed.settings || DEFAULT_SETTINGS,
            seo: parsed.seo || DEFAULT_SEO,
            testimonials: parsed.testimonials || [],
            projects: parsed.projects || [],
            faqs: parsed.faqs || [],
            newsletters: parsed.newsletters || [],
            assets: parsed.assets || [],
            users: parsed.users || [],
            locations: parsed.locations || [],
            internalLinkRules: parsed.internalLinkRules && parsed.internalLinkRules.length > 0 ? parsed.internalLinkRules : DEFAULT_INTERNAL_LINK_RULES,
            internalLinkSettings: parsed.internalLinkSettings || DEFAULT_INTERNAL_LINK_SETTINGS
        };
        memoryDbCache = schema;
        lastCacheTime = now;
        return schema;
    } catch (error) {
        return {
            posts: [],
            quotes: [],
            contacts: [],
            settings: DEFAULT_SETTINGS,
            seo: DEFAULT_SEO,
            testimonials: [],
            projects: [],
            faqs: [],
            newsletters: [],
            assets: [],
            users: [],
            locations: [],
            internalLinkRules: DEFAULT_INTERNAL_LINK_RULES,
            internalLinkSettings: DEFAULT_INTERNAL_LINK_SETTINGS
        };
    }
}

// Helper to write DB — always writes to BOTH Turso and local db.json in parallel
async function writeDb(data: DatabaseSchema): Promise<void> {
    // Instantly update memory cache
    memoryDbCache = data;
    lastCacheTime = Date.now();

    const tursoWrite = isTursoConfigured()
        ? tursoBatchSet([
              { key: 'posts', value: data.posts || [] },
              { key: 'quotes', value: data.quotes || [] },
              { key: 'contacts', value: data.contacts || [] },
              { key: 'settings', value: data.settings || DEFAULT_SETTINGS },
              { key: 'seo', value: data.seo || DEFAULT_SEO },
              { key: 'testimonials', value: data.testimonials || [] },
              { key: 'projects', value: data.projects || [] },
              { key: 'faqs', value: data.faqs || [] },
              { key: 'newsletters', value: data.newsletters || [] },
              { key: 'assets', value: data.assets || [] },
              { key: 'users', value: data.users || [] },
              { key: 'locations', value: data.locations || [] },
              { key: 'internalLinkRules', value: data.internalLinkRules || DEFAULT_INTERNAL_LINK_RULES },
              { key: 'internalLinkSettings', value: data.internalLinkSettings || DEFAULT_INTERNAL_LINK_SETTINGS },
          ]).catch((err) => console.error('[DB] Turso write error:', err))
        : Promise.resolve();

    const fileWrite = (async () => {
        try {
            await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
            await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
        } catch (err) {
            // Log but don't throw — filesystem may be read-only in some deploy targets
            console.error('[DB] Local db.json write error:', err);
        }
    })();

    // Run both in parallel — neither blocks the other
    await Promise.all([tursoWrite, fileWrite]);
}

// --- BLOG POSTS ---
export async function getPosts(): Promise<BlogPost[]> {
    const db = await readDb();
    return db.posts;
}

export async function getPostById(id: string): Promise<BlogPost | undefined> {
    const db = await readDb();
    return db.posts.find((p) => p.id === id);
}

export async function getPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const db = await readDb();
    return db.posts.find((p) => p.slug === slug);
}

export async function createPost(post: Omit<BlogPost, 'id'>): Promise<BlogPost> {
    const db = await readDb();
    const newPost = { ...post, id: Date.now().toString() };
    db.posts.push(newPost);
    await writeDb(db);
    return newPost;
}

export async function updatePost(id: string, updates: Partial<BlogPost>): Promise<BlogPost | null> {
    const db = await readDb();
    const index = db.posts.findIndex((p) => p.id === id);
    if (index === -1) return null;

    db.posts[index] = { ...db.posts[index], ...updates };
    await writeDb(db);
    return db.posts[index];
}

export async function deletePost(id: string): Promise<void> {
    const db = await readDb();
    db.posts = db.posts.filter((p) => p.id !== id);
    await writeDb(db);
}

// --- QUOTES ---
export async function createQuote(quote: Omit<Quote, 'id' | 'date' | 'status'>): Promise<Quote> {
    const db = await readDb();
    const newQuote: Quote = {
        ...quote,
        id: Date.now().toString(),
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        status: "New"
    };
    if (!db.quotes) db.quotes = [];
    db.quotes.unshift(newQuote);
    await writeDb(db);
    return newQuote;
}

export async function getQuotes(): Promise<Quote[]> {
    const db = await readDb();
    const quotes = db.quotes || [];
    return quotes.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function updateQuote(id: string, updates: Partial<Quote>): Promise<Quote | null> {
    const db = await readDb();
    const index = db.quotes?.findIndex((q) => q.id === id) ?? -1;
    if (index === -1) return null;

    db.quotes![index] = { ...db.quotes![index], ...updates };
    await writeDb(db);
    return db.quotes![index];
}

export async function deleteQuote(id: string): Promise<void> {
    const db = await readDb();
    db.quotes = db.quotes?.filter((q) => q.id !== id) || [];
    await writeDb(db);
}

// --- CONTACTS ---
export async function createContact(contact: Omit<Contact, 'id' | 'date' | 'status'>): Promise<Contact> {
    const db = await readDb();
    const newContact: Contact = {
        ...contact,
        id: Date.now().toString(),
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        status: "New"
    };
    if (!db.contacts) db.contacts = [];
    db.contacts.unshift(newContact);
    await writeDb(db);
    return newContact;
}

export async function getContacts(): Promise<Contact[]> {
    const db = await readDb();
    const contacts = db.contacts || [];
    return contacts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function updateContact(id: string, updates: Partial<Contact>): Promise<Contact | null> {
    const db = await readDb();
    const index = db.contacts?.findIndex((c) => c.id === id) ?? -1;
    if (index === -1) return null;

    db.contacts![index] = { ...db.contacts![index], ...updates };
    await writeDb(db);
    return db.contacts![index];
}

export async function deleteContact(id: string): Promise<void> {
    const db = await readDb();
    db.contacts = db.contacts?.filter((c) => c.id !== id) || [];
    await writeDb(db);
}

// --- SETTINGS ---
export async function getSettings(): Promise<GlobalSettings> {
    const db = await readDb();
    return db.settings || DEFAULT_SETTINGS;
}

export async function updateSettings(updates: Partial<GlobalSettings>): Promise<GlobalSettings> {
    const db = await readDb();
    db.settings = { ...db.settings, ...updates };
    await writeDb(db);
    return db.settings;
}

// --- SEO ---
export async function getSEO(): Promise<SEOSettings> {
    const db = await readDb();
    return db.seo || DEFAULT_SEO;
}

export async function getPageSEO(pageId: string): Promise<PageSEO> {
    const seo = await getSEO();
    const dbPage = seo?.pages?.[pageId] || { title: "", description: "", keywords: "", imageAlts: {}, sections: {}, structuredData: "" };
    const structure = PAGE_STRUCTURE[pageId] || {};

    // Deep merge sections: DB overrides structure defaults
    const mergedSections = { ...structure };
    if (dbPage.sections) {
        Object.keys(dbPage.sections).forEach(key => {
            mergedSections[key] = {
                ...structure[key],
                ...dbPage.sections![key]
            };
        });
    }

    return {
        ...dbPage,
        sections: mergedSections
    };
}

export async function updateSEO(updates: Partial<SEOSettings>): Promise<SEOSettings> {
    const db = await readDb();
    db.seo = { ...db.seo, ...updates };
    await writeDb(db);
    return db.seo;
}

// --- TESTIMONIALS ---
export async function getTestimonials(): Promise<Testimonial[]> {
    const db = await readDb();
    return db.testimonials || [];
}

export async function createTestimonial(testimonial: Omit<Testimonial, 'id' | 'date'>): Promise<Testimonial> {
    const db = await readDb();
    const newTestimonial: Testimonial = {
        ...testimonial,
        id: Date.now().toString(),
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    };
    if (!db.testimonials) db.testimonials = []; // Safety check
    db.testimonials.unshift(newTestimonial);
    await writeDb(db);
    return newTestimonial;
}

export async function updateTestimonial(id: string, updates: Partial<Testimonial>): Promise<Testimonial | null> {
    const db = await readDb();
    const index = db.testimonials.findIndex((t) => t.id === id);
    if (index === -1) return null;

    db.testimonials[index] = { ...db.testimonials[index], ...updates };
    await writeDb(db);
    return db.testimonials[index];
}

export async function deleteTestimonial(id: string): Promise<void> {
    const db = await readDb();
    db.testimonials = db.testimonials.filter((t) => t.id !== id);
    await writeDb(db);
}

// --- PROJECTS ---
export async function getProjects(): Promise<Project[]> {
    const db = await readDb();
    return db.projects || [];
}

export async function getProjectById(id: string): Promise<Project | undefined> {
    const db = await readDb();
    return db.projects?.find((p) => p.id === id);
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
    const db = await readDb();
    return db.projects?.find((p) => p.slug === slug);
}

export async function createProject(project: Omit<Project, 'id'>): Promise<Project> {
    const db = await readDb();
    const newProject: Project = {
        ...project,
        id: Date.now().toString(),
    };
    if (!db.projects) db.projects = [];
    db.projects.unshift(newProject);
    await writeDb(db);
    return newProject;
}

export async function updateProject(id: string, updates: Partial<Project>): Promise<Project | null> {
    const db = await readDb();
    const index = db.projects?.findIndex((p) => p.id === id) ?? -1;
    if (index === -1) return null;

    db.projects[index] = { ...db.projects[index], ...updates };
    await writeDb(db);
    return db.projects[index];
}

export async function deleteProject(id: string): Promise<void> {
    const db = await readDb();
    db.projects = db.projects?.filter((p) => p.id !== id) || [];
    await writeDb(db);
}

// --- FAQs ---
export async function getFAQs(): Promise<FAQ[]> {
    const db = await readDb();
    return db.faqs || [];
}

export async function createFAQ(faq: Omit<FAQ, 'id'>): Promise<FAQ> {
    const db = await readDb();
    const newFAQ: FAQ = {
        ...faq,
        id: Date.now().toString(),
    };
    if (!db.faqs) db.faqs = [];
    db.faqs.push(newFAQ);
    await writeDb(db);
    return newFAQ;
}

export async function updateFAQ(id: string, updates: Partial<FAQ>): Promise<FAQ | null> {
    const db = await readDb();
    const index = db.faqs?.findIndex((f) => f.id === id) ?? -1;
    if (index === -1) return null;

    db.faqs![index] = { ...db.faqs![index], ...updates };
    await writeDb(db);
    return db.faqs![index];
}

export async function deleteFAQ(id: string): Promise<void> {
    const db = await readDb();
    db.faqs = db.faqs?.filter((f) => f.id !== id) || [];
    await writeDb(db);
}

// --- NEWSLETTER ---
export async function createNewsletter(email: string): Promise<Newsletter> {
    const db = await readDb();
    const newEntry: Newsletter = {
        id: Date.now().toString(),
        email,
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    };
    if (!db.newsletters) db.newsletters = [];

    // Check if email already exists
    const exists = db.newsletters.find(n => n.email.toLowerCase() === email.toLowerCase());
    if (exists) return exists;

    db.newsletters.unshift(newEntry);
    await writeDb(db);
    return newEntry;
}

export async function getNewsletters(): Promise<Newsletter[]> {
    const db = await readDb();
    return db.newsletters || [];
}

export async function deleteNewsletter(id: string): Promise<void> {
    const db = await readDb();
    db.newsletters = db.newsletters?.filter((n) => n.id !== id) || [];
    await writeDb(db);
}

// --- ASSETS ---
export async function getAssets(): Promise<MediaAsset[]> {
    const db = await readDb();
    return db.assets || [];
}

export async function getMediaAsset(page: string, location: string, fallback: string): Promise<{ url: string, alt: string }> {
    const assets = await getAssets();
    const asset = assets.find(a => a.page === page && a.location === location);
    return asset ? { url: asset.url, alt: asset.alt } : { url: fallback, alt: "Elite Steel Concepts" };
}

export async function createAsset(asset: Omit<MediaAsset, 'id' | 'createdAt'>): Promise<MediaAsset> {
    const db = await readDb();
    const newAsset: MediaAsset = {
        ...asset,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
    };
    if (!db.assets) db.assets = [];
    db.assets.unshift(newAsset);
    await writeDb(db);
    return newAsset;
}

export async function updateAsset(id: string, updates: Partial<MediaAsset>): Promise<MediaAsset | null> {
    const db = await readDb();
    const index = db.assets?.findIndex((a) => a.id === id) ?? -1;
    if (index === -1) return null;

    db.assets![index] = { ...db.assets![index], ...updates };
    await writeDb(db);
    return db.assets![index];
}

export async function deleteAsset(id: string): Promise<void> {
    const db = await readDb();
    db.assets = db.assets?.filter((a) => a.id !== id) || [];
    await writeDb(db);
}

// --- USERS ---
export async function getUsers(): Promise<User[]> {
    const db = await readDb();
    const users = db.users || [];
    if (users.length === 0) {
        // Seed default super admin
        const superAdmin: User = {
            id: "1",
            name: "System Admin",
            email: "admin@esc.com",
            password: "Escadmin123@",
            role: "super_admin",
            createdAt: new Date().toISOString(),
            forcePasswordChange: false
        };
        db.users = [superAdmin];
        await writeDb(db);
        return [superAdmin];
    }
    return users;
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
    const users = await getUsers();
    return users.find(u => u.email.toLowerCase() === email.toLowerCase());
}

export async function createUser(user: Omit<User, 'id' | 'createdAt' | 'forcePasswordChange'>): Promise<User> {
    const db = await readDb();
    const newUser: User = {
        ...user,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        forcePasswordChange: true // Always force change for newly created accounts
    };
    if (!db.users) db.users = [];
    db.users.push(newUser);
    await writeDb(db);
    return newUser;
}

export async function updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    const db = await readDb();
    const index = db.users?.findIndex((u) => u.id === id) ?? -1;
    if (index === -1) return null;

    db.users![index] = { ...db.users![index], ...updates };
    await writeDb(db);
    return db.users![index];
}

export async function deleteUser(id: string): Promise<void> {
    const db = await readDb();
    db.users = db.users?.filter((u) => u.id !== id) || [];
    await writeDb(db);
}

// --- LOCATIONS ---
export async function getLocations(): Promise<LocationEntry[]> {
    const db = await readDb();
    return db.locations || [];
}

export async function getLocationBySlug(slug: string): Promise<LocationEntry | undefined> {
    const db = await readDb();
    return db.locations?.find((l) => l.slug === slug);
}

export async function createLocation(location: Omit<LocationEntry, 'id'>): Promise<LocationEntry> {
    const db = await readDb();
    const newLocation: LocationEntry = {
        ...location,
        id: Date.now().toString(),
    };
    if (!db.locations) db.locations = [];
    db.locations.push(newLocation);
    await writeDb(db);
    return newLocation;
}

export async function updateLocation(id: string, updates: Partial<LocationEntry>): Promise<LocationEntry | null> {
    const db = await readDb();
    const index = db.locations?.findIndex((l) => l.id === id) ?? -1;
    if (index === -1) return null;

    db.locations![index] = { ...db.locations![index], ...updates };
    await writeDb(db);
    return db.locations![index];
}

export async function deleteLocation(id: string): Promise<void> {
    const db = await readDb();
    db.locations = db.locations?.filter((l) => l.id !== id) || [];
    await writeDb(db);
}

// --- INTERNAL LINKING ---
export async function getInternalLinkRules(): Promise<InternalLinkRule[]> {
    const db = await readDb();
    return db.internalLinkRules && db.internalLinkRules.length > 0
        ? db.internalLinkRules
        : DEFAULT_INTERNAL_LINK_RULES;
}

export async function getInternalLinkRuleById(id: string): Promise<InternalLinkRule | undefined> {
    const rules = await getInternalLinkRules();
    return rules.find(r => r.id === id);
}

export async function createInternalLinkRule(rule: Omit<InternalLinkRule, 'id' | 'createdAt'>): Promise<InternalLinkRule> {
    const db = await readDb();
    const newRule: InternalLinkRule = {
        ...rule,
        id: `rule-${Date.now()}`,
        createdAt: new Date().toISOString()
    };
    if (!db.internalLinkRules || db.internalLinkRules.length === 0) {
        db.internalLinkRules = [...DEFAULT_INTERNAL_LINK_RULES];
    }
    db.internalLinkRules.unshift(newRule);
    await writeDb(db);
    return newRule;
}

export async function updateInternalLinkRule(id: string, updates: Partial<InternalLinkRule>): Promise<InternalLinkRule | null> {
    const db = await readDb();
    if (!db.internalLinkRules || db.internalLinkRules.length === 0) {
        db.internalLinkRules = [...DEFAULT_INTERNAL_LINK_RULES];
    }
    const index = db.internalLinkRules.findIndex(r => r.id === id);
    if (index === -1) return null;
    db.internalLinkRules[index] = { ...db.internalLinkRules[index], ...updates };
    await writeDb(db);
    return db.internalLinkRules[index];
}

export async function deleteInternalLinkRule(id: string): Promise<void> {
    const db = await readDb();
    if (!db.internalLinkRules || db.internalLinkRules.length === 0) {
        db.internalLinkRules = [...DEFAULT_INTERNAL_LINK_RULES];
    }
    db.internalLinkRules = db.internalLinkRules.filter(r => r.id !== id);
    await writeDb(db);
}

export async function resetInternalLinkRules(): Promise<InternalLinkRule[]> {
    const db = await readDb();
    db.internalLinkRules = [...DEFAULT_INTERNAL_LINK_RULES];
    await writeDb(db);
    return db.internalLinkRules;
}

export async function getInternalLinkSettings(): Promise<InternalLinkSettings> {
    const db = await readDb();
    return db.internalLinkSettings || DEFAULT_INTERNAL_LINK_SETTINGS;
}

export async function updateInternalLinkSettings(updates: Partial<InternalLinkSettings>): Promise<InternalLinkSettings> {
    const db = await readDb();
    db.internalLinkSettings = {
        ...(db.internalLinkSettings || DEFAULT_INTERNAL_LINK_SETTINGS),
        ...updates
    };
    await writeDb(db);
    return db.internalLinkSettings;
}



