import fs from 'fs/promises';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data/db.json');

export interface BlogPost {
    id: string;
    title: string;
    excerpt: string;
    category: string;
    date: string;
    readTime: string;
    image: string;
    slug: string;
    status: "Published" | "Draft";
    content?: string;
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

    date: string;
    status: "New" | "Contacted" | "Closed";
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
    email: string;
    phone: string;
    address: string;
    instagram: string;
    facebook: string;
    twitter: string;
}

export interface SEOSettings {
    siteTitle: string;
    description: string;
    keywords: string;
    ogImage: string;
    twitterHandle: string;
    robotsTxt: string;
    canonicalUrl: string;
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

export interface Project {
    id: string;
    title: string;
    category: string;
    image: string;
    description: string;
    client?: string;
    completionDate?: string;
}

interface DatabaseSchema {
    posts: BlogPost[];
    quotes: Quote[];
    contacts: Contact[];
    settings: GlobalSettings;
    seo: SEOSettings;
    testimonials: Testimonial[];
    projects: Project[];
}

const DEFAULT_SETTINGS: GlobalSettings = {
    email: "info@elitesteelconcepts.com",
    phone: "(571) 555-5555",
    address: "1234 Fabrication Way, Manassas, VA 20110",
    instagram: "",
    facebook: "",
    twitter: ""
};

const DEFAULT_SEO: SEOSettings = {
    siteTitle: "Elite Steel Concepts",
    description: "Custom Food Truck Builder",
    keywords: "food truck, trailer",
    ogImage: "",
    twitterHandle: "",
    robotsTxt: "User-agent: *\nAllow: /",
    canonicalUrl: "https://elitesteelconcepts.com"
};

// Helper to read DB
async function readDb(): Promise<DatabaseSchema> {
    try {
        const data = await fs.readFile(DB_PATH, 'utf-8');
        const parsed = JSON.parse(data);
        return {
            posts: parsed.posts || [],
            quotes: parsed.quotes || [],
            contacts: parsed.contacts || [],
            settings: parsed.settings || DEFAULT_SETTINGS,
            seo: parsed.seo || DEFAULT_SEO,
            testimonials: parsed.testimonials || [],
            projects: parsed.projects || []
        };
    } catch (error) {
        return { posts: [], quotes: [], contacts: [], settings: DEFAULT_SETTINGS, seo: DEFAULT_SEO, testimonials: [], projects: [] };
    }
}

// Helper to write DB
async function writeDb(data: DatabaseSchema): Promise<void> {
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
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
    return db.quotes || [];
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
    return db.contacts || [];
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
